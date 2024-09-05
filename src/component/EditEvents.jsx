import React, { Fragment, useEffect, useState } from "react"

export const formatDateToLocal = (dateStr) => {
    console.log("got date", date)
    const date = new Date(dateStr)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};
export const GetEventsFromLocal = () => {
    let events = localStorage.getItem("events")
    if (!events) return []
    if (!!events) return JSON.parse(events) || []
}

export const SetEventsInLocal = (arr) => {
    localStorage.setItem("events", JSON.stringify(arr))
}

const EditEvents = ({ modalType = "CREATE", selectedDate = null, eventId = null, handleCloseModal }) => {

    console.log("selectedDate?.startStr", selectedDate?.startStr)

    const [eventsForm, setEventsForm] = useState({
        title: "",
        dateTime: !!selectedDate?.startStr ? new Date(selectedDate?.startStr).toISOString().slice(0, 16) : "",
        description: "",
        frequency: "",
        color: ""
    })

    const handleChangeEvent = (e) => {
        const fieldName = e?.target?.name;
        const fieldValue = e?.target?.value;
        setEventsForm((prev) => {
            return {
                ...prev,
                [fieldName]: fieldValue
            }
        })
    }

    const handleUpdateEvent = () => {
        const allEvents = GetEventsFromLocal();
        let removed = allEvents?.filter((event) => event?.id != eventId)
        const merged = [...removed, eventsForm]
        SetEventsInLocal(merged)
        handleCloseModal()
        window.location.reload()
    }

    const handleDeleteEvent = () => {
        const allEvents = GetEventsFromLocal();
        let removed = allEvents?.filter((event) => event?.id != eventId)
        SetEventsInLocal(removed)
        handleCloseModal()
        window.location.reload()
    }

    const handleCreateEvent = () => {
        const prevEvents = GetEventsFromLocal();
        const finalObj = {
            ...eventsForm,
            id: new Date().getTime(),
            start: formatDateToLocal(eventsForm?.dateTime)?.slice(0, 10),
            end: formatDateToLocal(eventsForm?.dateTime)?.slice(0, 10),

        }
        const merged = [...prevEvents, finalObj]
        SetEventsInLocal(merged)
        handleCloseModal()
        window.location.reload()
    }

    useEffect(() => {
        if (modalType === "UPDATE" && !!eventId) {
            const allEvents = GetEventsFromLocal();
            const filteredEvents = allEvents?.find((event) => event?.id == eventId)
            console.log("filtered eve", filteredEvents, allEvents)
            setEventsForm(filteredEvents)
        }
    }, [eventId])



    return (
        <Fragment>
            <div className="modal fade show" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="card p-4">
                            <div className="d-flex justify-content-between">
                                <h5>{modalType === "CREATE" ? "Create" : "Update"} Event</h5>
                                <img src="https://cdn-icons-png.flaticon.com/512/9068/9068678.png"
                                    onClick={handleCloseModal}
                                    className="cp"
                                    style={{ width: 25, height: 25 }} />
                            </div>
                            <div className="event-form">
                                <div className="form-field">
                                    <label>Title:</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control mb-3"
                                        value={eventsForm.title}
                                        onChange={handleChangeEvent}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Date and Time:</label>
                                    <input
                                        type="datetime-local"
                                        name="dateTime"
                                        className="form-control mb-3"
                                        value={eventsForm.dateTime}
                                        onChange={handleChangeEvent}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Description:</label>
                                    <textarea
                                        name="description"
                                        className="form-control mb-3"
                                        value={eventsForm.description}
                                        onChange={handleChangeEvent}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Frequency:</label>
                                    <select
                                        name="frequency"
                                        className="form-control mb-3"
                                        value={eventsForm.frequency}
                                        onChange={handleChangeEvent}
                                    >
                                        <option value="">Select frequency</option>
                                        <option value="none">None</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                                <div className="form-field">
                                    <label>Color:</label>
                                    <input
                                        type="color"
                                        name="color"
                                        className="form-control mb-3"
                                        value={eventsForm.color}
                                        onChange={handleChangeEvent}
                                    />
                                </div>
                                {modalType === "CREATE" &&
                                    <button className="btn btn-primary btn-block" onClick={handleCreateEvent}>
                                        Create
                                    </button>
                                }
                                {modalType === "UPDATE" &&
                                    <>
                                        <div className="d-flex justify-content-end">
                                            <button className="btn btn-danger mr-4" onClick={handleDeleteEvent}>
                                                Delete
                                            </button>
                                            <button className="btn btn-primary" onClick={handleUpdateEvent}>
                                                Update
                                            </button>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default EditEvents