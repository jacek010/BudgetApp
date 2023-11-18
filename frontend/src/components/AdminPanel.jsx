import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ErrorMessage from "./ErrorMessage";

const AdminPanel = ({token})=>{
    const {i18n, t} = useTranslation();

    const [errorMessage, setErrorMessage] = useState("");

    const [userId, setUserId] = useState(null);
    const [email, setEmail] = useState("");
    const [budgetId, setBudgetId] = useState(null);
    const [budgetName, setBudgetName] = useState("");
    const [userName, setUserName] = useState("");
    const [userSurname, setUserSurname] = useState("");


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

    const handleGetUser = () => {
        getUser();
    };

    const handleGetBudget = () => {
        getBudget();
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
                        <button className="button is-warning" onClick={handleGetUser}>Get user</button>
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
                <button className="button is-primary is-fullwidth" onClick={handleDeleteUser}>{t("button_admin_delete_user")}</button>
                <br/>
                <button className="button is-primary is-fullwidth" onClick={handleDetachUser}>{t("button_admin_detach_user")}</button>
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
                        <button className="button is-warning" onClick={handleGetBudget}>Get budget</button>
                    </div>
                    <div className="column box">
                        <h1 className="title is-5">{t("budget_id")}</h1>
                        <h1 className="title is-6">{budgetId}</h1>
                        <h1 className="title is-5">{t("budget_name")}</h1>
                        <h1 className="title is-6">{budgetName}</h1>
                    </div>
                </div>
                <button className="button is-primary is-fullwidth" onClick={handleDeleteBudget}>{t("button_admin_delete_budget")}</button>
            </div>

            <div className="box">
                <p className="title has-text-centered">{t("admin_edit_categories_title")}</p>
            </div>
        </>
    );
};

export default AdminPanel;