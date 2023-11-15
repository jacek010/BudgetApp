import React, { useContext, useState, useEffect } from 'react';

const ReminderModal = ({ active, handleModal, token, id, setErrorMessage }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [value, setValue] = useState("");
    const [date, setDate] = useState("");
    const [repeatScale, setRepeatScale] = useState("days");
    const [repeatQuantity, setRepeatQuantity] = useState(0);

    const [subcategoryId, setSubcategoryId] = useState("");
    const [subcategories, setSubcategories] = useState(null);
    const [categories, setCategories] = useState(null);
    const [categoryId, setCategoryId] = useState("");

    const [incomeExpense, setIncomeExpense] = useState("income");

    const [reloadCategory, setReloadCategory] = useState(false);

    useEffect(() => {
        getCategoriesAndSubcategories();
        if (id) {
            getReminder();
        }
        selectCategory();
    }, [id, token, active]);

    useEffect(() => {
        selectCategory();
    }, [reloadCategory]);

    useEffect(() => {
        cleanFormData();
    }, [handleModal])

    const changeActiveCategory = (catId) => {
        setCategoryId(catId);
        if (subcategories) {
            const firstSubcategoryId = subcategories.find(subcategory => subcategory.category_id == catId).subcategory_id;
            if (firstSubcategoryId) {
                setSubcategoryId(firstSubcategoryId);
            }
        }
    };

    const selectCategory = () => {
        if (subcategories && subcategoryId) {
            const matchingSubcategory = subcategories.find(subcategory => subcategory.subcategory_id === subcategoryId);
            if (matchingSubcategory) {
                if (categoryId != matchingSubcategory.category_id) {
                    setCategoryId(matchingSubcategory.category_id);
                }
            }
        }
    };

    const getReminder = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };
        const response = await fetch(`/api/reminders/${id}`, requestOptions);

        if (!response.ok) {
            setErrorMessage("Could not get the reminder");
        } else {
            const data = await response.json();
            setName(data.reminder_name);
            setDescription(data.reminder_description);
            if (data.reminder_value < 0) {
                setValue(-1 * data.reminder_value);
                setIncomeExpense("expense");
            } else {
                setValue(data.reminder_value);
                setIncomeExpense("income");
            }
            setDate(data.reminder_date);
            setRepeatQuantity(data.reminder_repeat_quantity);
            setRepeatScale(data.reminder_repeat_scale);

            setSubcategoryId(data.subcategory_id);
            setReloadCategory(!reloadCategory);
        }

    };

    const getCategoriesAndSubcategories = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json',
            },
        };
        const response = await fetch(`/api/categories_subcategories`, requestOptions);

        if (!response.ok) {
            setErrorMessage("Could not get the categories or subcategories");
        } else {
            const data = await response.json();
            setCategories(data.categories);
            setSubcategories(data.subcategories);
        }
    };

    const getRealValue = () => {
        if (incomeExpense === "income") {
            return parseFloat(value);
        } else if (incomeExpense === "expense") {
            return -1 * parseFloat(value);
        }
    };

    const checkValue = (val) => {
        if (val && val != "-") {
            let parsedVal = parseFloat(val);
            if (parsedVal < 0) {
                setValue(-1 * parsedVal);
                setIncomeExpense("expense");
            } else {
                setValue(parsedVal);
            }
        } else {
            setValue(val);
        }
    };

    const cleanFormData = () => {
        setName("");
        setDescription("");
        setValue("");
        setDate("");
        setSubcategoryId("");
        setCategoryId("");
        setRepeatQuantity(0);
        setRepeatScale("days");
    };


    const handleCreateReminder = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                reminder_name: name,
                reminder_description: description,
                reminder_value: getRealValue(),
                reminder_date: date,
                subcategory_id: parseInt(subcategoryId, 10),
                reminder_repeat_quantity: parseInt(repeatQuantity, 10),
                reminder_repeat_scale: repeatScale
            }),
        };
        const response = await fetch("/api/reminders", requestOptions);

        if (!response.ok) {
            setErrorMessage("Something went wrong when creating reminder");
        } else {
            cleanFormData();
            handleModal();
        }
    };

    const handleUpdateReminder = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                reminder_name: name,
                reminder_description: description,
                reminder_value: getRealValue(),
                reminder_date: date,
                subcategory_id: parseInt(subcategoryId, 10),
                reminder_repeat_quantity: parseInt(repeatQuantity, 10),
                reminder_repeat_scale: repeatScale
            }),
        };
        const response = await fetch(`/api/reminders/${id}`, requestOptions);

        if (!response.ok) {
            setErrorMessage("Something went wrong when updating reminder");
        } else {
            cleanFormData();
            handleModal();
        }
    };

    return (
        <div className={`modal ${active && "is-active"}`}>
            <div className="modal-background" onClick={handleModal}></div>
            <div className="modal-card">
                <header className="modal-card-head has-background-primary-light">
                    <h1 className="modal-card-title">
                        {id ? "Update Reminder" : "Add Reminder"}
                    </h1>
                </header>
                <section className="modal-card-body">
                    <form>
                        <div className="field">
                            <label className="label">Reminder name</label>
                            <div className="control">
                                <input type="text" className="input" required placeholder="Enter operation name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Description</label>
                            <div className="control">
                                <input type="text" className="input" required placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Value</label>
                            <div className="columns">
                                <div className="column">
                                    <div className="control">
                                        <input type="text" className="input" required placeholder="Enter operation value" value={value} onChange={(e) => checkValue(e.target.value)} />
                                    </div>
                                </div>
                                <div className="column">
                                    <select className={`button is-fullwidth is-light ${incomeExpense === "income" ? ("is-success") : ("is-danger")}`}
                                        value={incomeExpense}
                                        onChange={e => setIncomeExpense(e.target.value)}  >
                                        <option value="income">Income</option>
                                        <option value="expense">Expense</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Date</label>
                            <div className="control">
                                <input type="date" className="input" required placeholder="Enter reminder date" value={date} onChange={(e) => setDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Repeat after</label>
                            <div className="control">
                                <div className="columns">
                                    <div className="column">
                                        <input type="number" className="input" required value={repeatQuantity} onChange={(e) => setRepeatQuantity(e.target.value)} />
                                    </div>
                                    <div className="column">
                                        <select className={`button is-fullwidth`} value={repeatScale} onChange={e => setRepeatScale(e.target.value)}>
                                            <option value="days">Days</option>
                                            <option value="months">Months</option>
                                            <option value="years">Years</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Category</label>
                            <div className="control">
                                <select className="input" required value={categoryId} onChange={(e) => changeActiveCategory(e.target.value)}>
                                    {categories ? (categories.map(category => (
                                        <option key={category.category_id} value={category.category_id}>
                                            <span className="title">{category.category_name}</span>
                                        </option>
                                    ))) : (
                                        <progress class="progress is-large" max="100"></progress>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Subcategory</label>
                            <div className="control">
                                <select className="input" required value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)}>
                                    {subcategories ? (subcategories.map(subcategory => (
                                        subcategory.category_id == categoryId ? (
                                            <option key={subcategory.subcategory_id} value={subcategory.subcategory_id}>
                                                <span className="title">{subcategory.subcategory_name}</span>
                                            </option>
                                        ) : (<></>)
                                    ))) : (
                                        <p>loading</p>
                                    )}
                                </select>
                            </div>
                        </div>
                    </form>
                </section>
                <footer className="modal-card-foot has-background-primary-light">
                    {id ? (
                        <button className="button is-info" onClick={handleUpdateReminder}>Update</button>
                    ) : (
                        <button className="button is-primary" onClick={handleCreateReminder}>Add</button>
                    )}
                    <button className="button" onClick={handleModal}>Cancel</button>
                </footer>
            </div>
        </div>
    );
};

export default ReminderModal;