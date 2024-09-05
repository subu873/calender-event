import React, { Fragment, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils'
import Sidebar from './component/Sidebar'
import EditEvents, { formatDateToLocal, GetEventsFromLocal, SetEventsInLocal } from './component/EditEvents'


export default function DemoApp() {
  const [weekendsVisible, setWeekendsVisible] = useState(true)
  const [currentEvents, setCurrentEvents] = useState([])
  const [selectedInfo, setSelectedInfo] = useState("")

  const [editEventModal, setEditEventModal] = useState(false)
  const [editEventData, setEditEventData] = useState({})
  const [isOpenCreateEventModal, setIsOpenCreateEventModal] = useState(false)


  function handleDateSelect(selectInfo) {
    setIsOpenCreateEventModal(true)
    setSelectedInfo(selectInfo)
    return
    // let title = prompt('Please enter a new title for your event')
    // let calendarApi = selectInfo.view.calendar

    // calendarApi.unselect() // clear date selection

    // if (title) {
    //   calendarApi.addEvent({
    //     id: createEventId(),
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay
    //   })
    // }
  }

  function handleEventClick(clickInfo) {
    setEditEventModal(true)
    console.log("click", clickInfo.event.id)
    setEditEventData(clickInfo.event.id)
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   clickInfo.event.remove()
    // }
  }

  function handleEvents(events) {
    setCurrentEvents(events)
  }

  const handleEventDrop = (info) => {
    const { event } = info;

    // Get new start and end dates after the event is dropped
    const newStart = event.start;
    const newEnd = event.end;

    console.log("full event id", event?.id)
    const eventId = event?.id

    const allEvents = GetEventsFromLocal();
    const eventsForm = allEvents?.find((event) => event?.id == eventId)
    let removed = allEvents?.filter((event) => event?.id != eventId)

    const updatedEventDate = {
      ...eventsForm,
      dateTime: new Date(newStart).toISOString().slice(0, 16),
      start: formatDateToLocal(newStart).slice(0, 10),
      // end: new Date(newEnd).toISOString().slice(0, 10),
      end: formatDateToLocal(newEnd).slice(0, 10)
    }

    console.log("updated ev", updatedEventDate)

    const merged = [...removed, updatedEventDate]
    SetEventsInLocal(merged)
    window.location.reload()



    // Optional: You can update the event in your database or state here
    console.log('Event dropped:', event.title);
    console.log('New start:', newStart);
    console.log('New end:', newEnd);


  };

  const FINAL_EVENTS = GetEventsFromLocal()


  return (
    <Fragment>
      <div className='demo-app'>
        <Sidebar
          currentEvents={FINAL_EVENTS}
        />
        <div className='demo-app-main'>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView='dayGridMonth'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={weekendsVisible}
            initialEvents={FINAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
            select={handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={handleEventClick}
            eventsSet={handleEvents} // called after events are initialized/added/changed/removed
            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
            eventDrop={handleEventDrop}
          />
        </div>


      </div>
      {!!isOpenCreateEventModal &&
        <EditEvents modalType='CREATE' selectedDate={selectedInfo} handleCloseModal={() => setIsOpenCreateEventModal(false)} />
      }
      {!!editEventModal &&
        <EditEvents modalType='UPDATE' selectedDate={selectedInfo} eventId={editEventData} handleCloseModal={() => setEditEventModal(false)} />
      }
    </Fragment>
  )
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}


