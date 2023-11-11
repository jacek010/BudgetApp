import React, { useEffect, useState, useContext } from "react";


const OperationModal = ({ active, handleModal, token, id, setErrorMessage }) => {
    const [name, setName] = useState("");
    const [value, setValue] = useState("");
    const [date, setDate] = useState("");
    const [subcategoryId, setSubcategoryId] = useState("");
    const [subcategories, setSubcategories] = useState(null);
    const [categories, setCategories] = useState(null);
    const [categoryId, setCategoryId] = useState("");

    const [reloadCategory, setReloadCategory] = useState(false);

    useEffect(() => {
        getCategoriesAndSubcategories();
        if(id){
            getOperation();
        }
        selectCategory();
    },[id, token, active]);

    useEffect(() => {
        selectCategory();
    },[reloadCategory]);

    const changeActiveCategory =(catId)=>{
        setCategoryId(catId);
        if (subcategories){
            const firstSubcategoryId = subcategories.find(subcategory => subcategory.category_id == catId).subcategory_id;
            if(firstSubcategoryId){
                setSubcategoryId(firstSubcategoryId);
            } 
        }
    };

    const selectCategory = () => {
        if(subcategories&&subcategoryId){
            const matchingSubcategory = subcategories.find(subcategory => subcategory.subcategory_id === subcategoryId);
            if (matchingSubcategory) {
                if (categoryId!=matchingSubcategory.category_id){
                    setCategoryId(matchingSubcategory.category_id);
                }
            }
        }
    };

    const getOperation = async() => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };
        const response = await fetch(`/api/operations/${id}`, requestOptions);
        
        if(!response.ok) {
            setErrorMessage("Could not get the operation");
        } else {
            const data = await response.json();
            setName(data.operation_name);
            setValue(data.operation_value);
            setDate(data.operation_date);
            setSubcategoryId(data.subcategory_id);
            setReloadCategory(!reloadCategory);
        }
        
    };

    const getCategoriesAndSubcategories = async() => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json',
              },
        };
        const response = await fetch(`/api/categories_subcategories`, requestOptions);
        
        if(!response.ok) {
            setErrorMessage("Could not get the categories or subcategories");
        } else {
            const data = await response.json();
            setCategories(data.categories);
            setSubcategories(data.subcategories);
        }
    };

    const cleanFormData  =()=>{
        setName("");
        setValue("");
        setDate("");
        setSubcategoryId("");
        setCategoryId("");

    };
    const handleCreateOperation = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ operation_name: name, 
                operation_value: parseFloat(value), 
                operation_date: date, 
                subcategory_id: parseInt(subcategoryId, 10)
            }),
        };
        const response = await fetch("/api/operations", requestOptions);

        if(!response.ok) {
            setErrorMessage("Something went wrong when creating operation");
        } else {
            cleanFormData();
            handleModal();
        }
    };

    const handleUpdateOperation = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ operation_name: name, 
                operation_value: parseFloat(value), 
                operation_date: date, 
                subcategory_id: parseInt(subcategoryId, 10)
            }),
        };
        const response = await fetch(`/api/operations/${id}`, requestOptions);

        if(!response.ok) {
            setErrorMessage("Something went wrong when updating operation");
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
                        {id ? "Update Operation" : "Add Operation"}
                    </h1>
                </header>
                <section className="modal-card-body">
                    <form>
                        <div className="field">
                            <label className="label">Operation name</label>
                            <div className="control">
                                <input type="text" className="input" required placeholder="Enter operation name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Value</label>
                            <div className="control">
                                <input type="text" className="input" required placeholder="Enter operation value" value={value} onChange={(e) => setValue(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Date</label>
                            <div className="control">
                                <input type="date" className="input" required placeholder="Enter operation date" value={date} onChange={(e) => setDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Category</label>
                            <div className="control">
                                <select className="input" required value={categoryId} onChange={(e) => changeActiveCategory(e.target.value)}>
                                    {categories ?(categories.map(category => (
                                        <option key={category.category_id} value={category.category_id}>
                                            <span className="title">{category.category_name}</span>
                                        </option>
                                    ))):(
                                        <progress class="progress is-large" max="100"></progress>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Subcategory</label>
                            <div className="control">
                                <select className="input" required value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)}>
                                    {subcategories ?(subcategories.map(subcategory => (
                                        subcategory.category_id == categoryId ?(
                                            <option key={subcategory.subcategory_id} value={subcategory.subcategory_id}>
                                                <span className="title">{subcategory.subcategory_name}</span>
                                            </option>
                                        ):(<></>)
                                    ))):(
                                        <p>loading</p>
                                    )}
                                </select>
                            </div>
                        </div>
                    </form>
                </section>
                <footer className="modal-card-foot has-background-primary-light">
                    {id ? (
                        <button className="button is-info" onClick={handleUpdateOperation}>Update</button>
                    ) : (
                        <button className="button is-primary" onClick={handleCreateOperation}>Add</button>
                    )}
                    <button className="button" onClick={handleModal}>Cancel</button>
                </footer>
            </div>
        </div>
    );
};

export default OperationModal;