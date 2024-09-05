import React, { useState } from 'react'
import { formatDate } from '@fullcalendar/core'

const Sidebar = ({ currentEvents }) => {

    const [allEvents, setAllEvents] = useState(currentEvents)
    const [inputSearch, setInputSearch] = useState("")

    const handleSearch = (e) => {
        const fieldInput = e?.target?.value
        setInputSearch(fieldInput)
        let filtered = currentEvents?.filter((event) => {
            let title = !!event?.title ? event?.title?.toLowerCase() : "";
            let description = !!event?.description ? event?.description?.toLowerCase() : "";
            let fieldLowerCase = !!fieldInput ? fieldInput?.toLowerCase() : ""
            return (title?.includes(fieldLowerCase) || description?.includes(fieldLowerCase))
        })
        setAllEvents(filtered)
    }

    return (
        <div className='demo-app-sidebar'>
            <div className='demo-app-sidebar-section'>
                <h5>All Events ({allEvents.length})</h5>
                <input className='form-control mt-3' placeholder='Search Event' value={inputSearch} onChange={handleSearch} />
                <ul>
                    {!!allEvents && allEvents.length > 0 && allEvents.map((event) => (
                        <SidebarEvent key={event.id} event={event} />
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Sidebar

function SidebarEvent({ event }) {
    return (
        <li key={event.id}>
            <b>{formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b>
            <i>{event.title}</i>
        </li>
    )
}
