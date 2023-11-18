import React, { useState, useContext } from "react";

import { ReloadContext } from '../context/ReloadContext';

import { useTranslation } from "react-i18next";
import ErrorMessage from "./ErrorMessage";
import Categories from "./Categories";

const AdminPanel = ({token})=>{
    const {i18n, t} = useTranslation();

    const {reload, triggerReload} = useContext(ReloadContext);

    const [errorMessage, setErrorMessage] = useState("");

    const [userId, setUserId] = useState(null);
    const [email, setEmail] = useState("");
    const [budgetId, setBudgetId] = useState(null);
    const [budgetName, setBudgetName] = useState("");
    const [userName, setUserName] = useState("");
    const [userSurname, setUserSurname] = useState("");

    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryDescription, setNewCategoryDescription] = useState("");
    const [newCategoryColor, setNewCategoryColor] = useState("is-black");

    const [categoryName, setCategoryName] = useState("");
    const [categoryId, setCategoryId] = useState(null);
    const [categoryColor, setCategoryColor] = useState("");


    const getUser = async() =>{
        fetch(`/api/users/get_by_email/${email}`, {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': 'application/json',
            },
          })
          .then(response => response.json())
          .then(data => {
            setUserId(data.user_id);
            setUserName(data.user_name);
            setUserSurname(data.user_surname);
          })
          .catch(error => {
            console.error(error);
        });  
    };

    const getBudget = async() =>{
        fetch(`/api/budgets/details/${budgetId}`, {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': 'application/json',
            },
          })
          .then(response => response.json())
          .then(data => {
            setBudgetName(data.budget_info.budget_name)
          })
          .catch(error => {
            console.error(error);
        });
    };

    const getCategory = async() =>{
        fetch(`/api/categories/${categoryName}`, {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': 'application/json',
            },
          })
          .then(response => response.json())
          .then(data => {
            setCategoryId(data.category_id);
            setCategoryColor(data.category_color);
          })
          .catch(error => {
            console.error(error);
        });
    };

    const deleteUser = async() =>{
        fetch(`/api/admin/delete_user/${userId}`, {
            method: "DELETE",
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': 'application/json',
            },
          })
          .then(response => response.json())
          .catch(error => {
            console.error(error);
        });
    };

    const detachUser = async() =>{
        fetch(`/api/admin/detach_user/${userId}`, {
            method: "PUT",
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': 'application/json',
            },
          })
          .then(response => response.json())
          .catch(error => {
            console.error(error);
        });
    };

    const deleteBudget = async() =>{
        fetch(`/api/admin/delete_budget/${budgetId}`, {
            method: "DELETE",
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': 'application/json',
            },
          })
          .then(response => response.json())
          .catch(error => {
            console.error(error);
        });
    };

    const addCategory = async() =>{
        fetch(`/api/categories`, {
            method: "POST",
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': 'application/json',
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ category_name: newCategoryName, 
                category_description: newCategoryDescription, 
                category_color: newCategoryColor
            }),
          })
          .then(response => response.json())
          .catch(error => {
            console.error(error);
        });
    };

    const deleteCategory = async() =>{
        fetch(`/api/admin/delete_category/${categoryId}`, {
            method: "DELETE",
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': 'application/json',
            },
          })
          .then(response => response.json())
          .catch(error => {
            console.error(error);
        });
        triggerReload();
    };

    const handleGetUser = () => {
        getUser();
    };

    const handleGetBudget = () => {
        getBudget();
    };

    const handleGetCategory = () => {
        if(categoryName!=="UNCATEGORIZED"){
            getCategory();
        }
    };

    const handleDeleteUser = () => {
        if(userId){
            deleteUser();

            setUserId(null);
            setEmail("");
            setUserName("");
            setUserSurname("");
        }
    };

    const handleDetachUser = () => {
        if(userId){
            detachUser();

            setUserId(null);
            setEmail("");
            setUserName("");
            setUserSurname("");
        }
    };

    const handleDeleteBudget= () => {
        if(budgetName){
            deleteBudget();

            setBudgetId(null);
            setBudgetName("");
        }
    };

    const handleAddCategory = () => {
        if(newCategoryName && newCategoryDescription && newCategoryColor){
            addCategory();

            setNewCategoryName("");
            setNewCategoryDescription("");
            setNewCategoryColor("is-black");
        }
    };

    const handleDeleteCategory= () => {
        if(categoryId){
            deleteCategory();

            setCategoryName("");
            setCategoryId(null);
            setCategoryColor("");
        }
    };

    return(
        <>
            <ErrorMessage message={errorMessage}/>
            <div className="box">
                <h1 className="title has-text-centered">{t("admin_delete_detach_user_account_title")}</h1>
                <div className="columns">
                    <div className="column box">
                        <div className="field">
                            <label className="label">{t("email")}</label>
                            <div className="control">
                                <input type="email" placeholder={t("email_placeholder")} value={email} onChange={(e)=>setEmail(e.target.value)} className="input" required />
                            </div>
                        </div>
                        <button className="button is-info" onClick={handleGetUser}>Get user</button>
                    </div>
                    <div className="column box">
                        <h1 className="title is-5">ID</h1>
                        <h1 className="title is-6">{userId}</h1>
                        <h1 className="title is-5">{t("name")}</h1>
                        <h1 className="title is-6">{userName}</h1>
                        <h1 className="title is-5">{t("surname")}</h1>
                        <h1 className="title is-6">{userSurname}</h1>
                    </div>
                </div>
                <button className="button is-danger is-fullwidth" onClick={handleDeleteUser}>{t("button_admin_delete_user")}</button>
                <br/>
                <button className="button is-warning is-fullwidth" onClick={handleDetachUser}>{t("button_admin_detach_user")}</button>
            </div>

            <div className="box">
                <h1 className="title has-text-centered">{t("admin_delete_budget_title")}</h1>
                <div className="columns">
                    <div className="column box">
                        <div className="field">
                            <label className="label">{t("budget_id")}</label>
                            <div className="control">
                                <input type="number" placeholder={t("budget_id_placeholder")} value={budgetId} onChange={(e)=>setBudgetId(e.target.value)} className="input" required />
                            </div>
                        </div>
                        <button className="button is-info" onClick={handleGetBudget}>Get budget</button>
                    </div>
                    <div className="column box">
                        <h1 className="title is-5">{t("budget_id")}</h1>
                        <h1 className="title is-6">{budgetId}</h1>
                        <h1 className="title is-5">{t("budget_name")}</h1>
                        <h1 className="title is-6">{budgetName}</h1>
                    </div>
                </div>
                <button className="button is-danger is-fullwidth" onClick={handleDeleteBudget}>{t("button_admin_delete_budget")}</button>
            </div>

            <div className="box">
                <p className="title has-text-centered">{t("admin_edit_categories_title")}</p>
                <div className="box">
                    <p className="title is-5 has-text-centered">Add category</p>
                    <div className="field">
                        <label className="label">Category name</label>
                        <div className="control">
                            <input type="text" className="input" placeholder="Enter category name" value={newCategoryName} onChange={(e)=>setNewCategoryName(e.target.value)} required/>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Category description</label>
                        <div className="control">
                            <textarea type="textarea" className="input" placeholder="Enter category description" value={newCategoryDescription} onChange={(e)=>setNewCategoryDescription(e.target.value)} required/>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Category color</label>
                        <div className="control">
                            <select className={`button is-fullwidth ${newCategoryColor}`} required value={newCategoryColor} onChange={(e)=>setNewCategoryColor(e.target.value)}>
                                <option value="is-black">Black</option>
                                <option value="is-dark">Dark</option>
                                <option value="is-primary">Turquise</option>
                                <option value="is-link">Blue</option>
                                <option value="is-info">Cyan</option>
                                <option value="is-success">Green</option>
                                <option value="is-warning">Yellow</option>
                                <option value="is-danger">Red</option>
                            </select>
                        </div>
                    </div>
                    <br />
                    <button className="button is-fullwidth is-success" onClick={handleAddCategory}>Add category</button>
                </div>
                <div className="box">
                    <p className="title is-5 has-text-centered">Delete category</p>
                    <div className="columns">
                        <div className="column box">
                            <div className="field">
                                <label className="label">Category name</label>
                                <div className="control">
                                    <input type="text" placeholder="Enter category name" value={categoryName} onChange={(e)=>setCategoryName(e.target.value)} className="input" required />
                                </div>
                            </div>
                            <button className="button is-info" onClick={handleGetCategory}>Get category</button>
                        </div>
                        <div className="column box">
                            <h1 className="title is-5">Category ID</h1>
                            <h1 className="title is-6">{categoryId}</h1>
                            <h1 className="title is-5">Category color</h1>
                            <h1 className={`title is-6 ${categoryColor}`}>{categoryColor}</h1>
                        </div>
                    </div>
                    <button className="button is-danger is-fullwidth" onClick={handleDeleteCategory}>Delete category {categoryId?(categoryName):null}</button>
                </div>
            </div>

            <Categories token={token}/>
        </>
    );
};

export default AdminPanel;