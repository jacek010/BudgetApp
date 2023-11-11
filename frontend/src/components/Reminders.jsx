import React, { useContext, useState, useEffect } from 'react';
import moment from 'moment';

import { ReloadContext } from '../context/ReloadContext';
import { UserContext } from '../context/UserContext';

import ErrorMessage from "./ErrorMessage";
import ReminderModal from './ReminderModal';


const Reminders = ()=>{

    const [token] = useContext(UserContext);
    const { reload, triggerReload } = useContext(ReloadContext);
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);

    const [reminders, setReminders] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const [id, setId] = useState(null);

    useEffect(() => {
        getReminders();
    }, []);

    const handleModal = () => {
        setActiveModal(!activeModal);
        getReminders();
        setId(null);
        triggerReload();
    };


    const getReminders = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json',
                "Content-Type": "application/json"
            },
        };
        const response = await fetch("/api/reminders", requestOptions);

        if (!response.ok) {
            setErrorMessage("Something went wrong. Couldn't load the reminders")
        } else {
            const data = await response.json();
            setReminders(data);
            setLoaded(true);
        }
    }

    const handleDoneReminder = async (id) => {
        console.log("Reminder done "+id);
        const requestOptions = {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json',
                "Content-Type": "application/json"
            },
        };
        const response = await fetch(`/api/reminders/done/${id}`, requestOptions);

        if (!response.ok) {
            setErrorMessage("Something went wrong. Couldn't done reminder")
        } else {
            getReminders();
            triggerReload();
        }
    };

    const handleEditReminder = async (id) => {
        console.log("Reminder updating "+id);
        setId(id);
        setActiveModal(true);
    };

    const handleCancelReminder = async (id) => {
        console.log("Reminder canceled "+id);
        const requestOptions = {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json',
                "Content-Type": "application/json"
            },
        };
        const response = await fetch(`/api/reminders/${id}`, requestOptions);

        if (!response.ok) {
            setErrorMessage("Something went wrong. Couldn't cancel reminder")
        } else {
            getReminders();
            triggerReload();
        }
    };

    return(
        <>
            <ReminderModal active={activeModal} handleModal={handleModal} token={token} id={id} setErrorMessage={setErrorMessage} />
            <button className='button is-fullwidth mb-5 is-link'
                onClick={() => setActiveModal(true)}>
                Add reminder
            </button>
            <ErrorMessage message={errorMessage} />
            {reminders?(
                <>
                    <div className="box">
                        <div className="columns">
                            <div className="column has-text-centered">
                                Name
                            </div>
                            <div className="column has-text-centered">
                                Description
                            </div>
                            <div className="column has-text-centered">
                                Value
                            </div>
                            <div className="column has-text-centered">
                                Category
                            </div>
                            <div className="column has-text-centered">
                                Date
                            </div>
                            <div className="column has-text-centered">
                                Repeat cycle
                            </div>
                        </div>
                    </div>
                    <div className="tile is-ancestor">
                        <div className="tile is-parent is-vertical">
                        {reminders.map((reminder) =>(
                            <div className={`tile is-child notification ${reminder.category_color}`} key={reminder.reminder_id}>
                                <div className="columns">
                                    <div className="column has-text-centered">
                                        {reminder.reminder_name}
                                    </div>
                                    <div className="column has-text-centered">
                                        {reminder.reminder_description}
                                    </div>
                                    <div className="column has-text-centered">
                                        {reminder.reminder_value}
                                    </div>
                                    <div className="column has-text-centered">
                                        {reminder.subcategory_name}
                                    </div>
                                    <div className="column has-text-centered">
                                        {reminder.reminder_date}
                                    </div>
                                    <div className="column has-text-centered">
                                        {reminder.reminder_repeat_quantity} {reminder.reminder_repeat_scale}
                                    </div>
                                    
                                </div>
                                <div className="columns">
                                    <div className="column has-text-centered">
                                        <button className="button is-light is-primary is-fullwidth" onClick={() => handleDoneReminder(reminder.reminder_id)}>
                                            <p className='title is-6'>Done</p>
                                        </button>
                                    </div>
                                    <div className="column has-text-centered">
                                        <button className="button is-light is-link is-fullwidth" onClick={() => handleEditReminder(reminder.reminder_id)}>
                                            <p className='title is-6'>Edit</p>
                                        </button>
                                    </div>
                                    <div className="column has-text-centered">
                                        <button className="button is-light is-danger is-fullwidth" onClick={() => handleCancelReminder(reminder.reminder_id)}>
                                            <p className='title is-6'>Cancel</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </>
            ):(
                <p>loading</p>
            )}
        </>
    );
};

export default Reminders;