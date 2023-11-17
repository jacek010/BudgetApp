import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ErrorMessage from "./ErrorMessage";

const AdminPanel = ({token})=>{
    const {i18n, t} = useTranslation();

    const [errorMessage, setErrorMessage] = useState("");

    const [userId, setUserId] = useState(null);
    const [email, setEmail] = useState("");
    const [budgetId, setBudgetId] = useState(null);

    const handleDeleteUser = (e) => {
        e.preventDefault();
        console.log("User deleted: "+email);

        setUserId(null);
        setEmail("");
    };

    const handleDetachUser = (e) => {
        e.preventDefault();
        console.log("User deleted: "+email);

        setUserId(null);
        setEmail("");
    };

    const handleDeleteBudget= (e) => {
        e.preventDefault();
        console.log("Budget deleted: "+email);

        setBudgetId(null);
    };

    return(
        <>
            <ErrorMessage message={errorMessage}/>

            <form className="box" onSubmit={handleDeleteUser}>
                <h1 className="title has-text-centered">{t("admin_delete_user_account_title")}</h1>
                <div className="columns">
                    <div className="column">
                        <div className="field">
                            <label className="label">{t("email")}</label>
                            <div className="control">
                                <input type="email" placeholder={t("email_placeholder")} value={email} onChange={(e)=>setEmail(e.target.value)} className="input" required />
                            </div>
                        </div>
                        <button className="button is-primary" type="submit">{t("button_admin_delete_user")}</button>
                    </div>
                    <div className="column">

                    </div>
                </div>
                
            </form>

            <form className="box" onSubmit={handleDetachUser}>
                <h1 className="title has-text-centered">{t("admin_detach_user_from_budget_title")}</h1>
                <div className="field">
                    <label className="label">{t("email")}</label>
                    <div className="control">
                        <input type="email" placeholder={t("email_placeholder")} value={email} onChange={(e)=>setEmail(e.target.value)} className="input" required />
                    </div>
                </div>
                <button className="button is-primary" type="submit">{t("button_admin_detach_user")}</button>
            </form>

            <form className="box" onSubmit={handleDeleteBudget}>
                <h1 className="title has-text-centered">{t("admin_delete_budget_title")}</h1>
                <div className="field">
                    <label className="label">{t("budget_id")}</label>
                    <div className="control">
                        <input type="number" placeholder={t("budget_id_placeholder")} value={budgetId} onChange={(e)=>setBudgetId(e.target.value)} className="input" required />
                    </div>
                </div>
                <button className="button is-primary" type="submit">{t("button_admin_delete_budget")}</button>
            </form>

            <div className="box">
                <p className="title has-text-centered">{t("admin_edit_categories_title")}</p>
            </div>
        </>
    );
};

export default AdminPanel;