import React, {useState, useEffect, useContext} from "react";


import ErrorMessage from "./ErrorMessage";
import { UserContext } from '../context/UserContext';
import { useTranslation } from "react-i18next";

const NewBudget = ()=>{
    const {i18n, t} = useTranslation();

    const[name, setName] = useState("");
    const[description, setDescription] = useState("");
    const[password, setPassword] = useState("");
    const[confirmationPassword, setConfirmationPassword] = useState("");
    const[errorMessage, setErrorMessage] = useState("");
    const [token] = useContext(UserContext);


    const submitNew = async () =>{
        const requestOptions = {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({budget_name: name,
                                budget_description: description,
                                budget_password: password
                                }),
        };

        const response = await fetch("/api/budgets/new", requestOptions)
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        }
    };

    const handleSubmitNew = (e) => {
        e.preventDefault();
        if (password === confirmationPassword && password.length >5){
            submitNew();
            window.location.reload();
        } else{
            setErrorMessage(t("error_password_not_matching"));
        }
    };

    return(
        <form onSubmit={handleSubmitNew} className="box">
            <h1 className="title has-text-centered">{t("new_budget_create_title")}</h1>
            <div className="field">
                <label className="label">{t("budget_name")}</label>
                <div className="control">
                    <input type="text" placeholder={t("budget_name_placeholder")} value={name} onChange={(e)=>setName(e.target.value)} className="input" required />
                </div>
            </div>
            <div className="field">
                <label className="label">{t("budget_description")}</label>
                <div className="control">
                    <textarea placeholder={t("budget_description_placeholder")} value={description} onChange={(e)=>setDescription(e.target.value)} className="input" required />
                </div>
            </div>
            <div className="field">
                <label className="label">{t("password")}</label>
                <div className="control">
                    <input type="password" placeholder={t("password_placeholder")} value={password} onChange={(e)=>setPassword(e.target.value)} className="input" required />
                </div>
            </div>
            <div className="field">
                <label className="label">{t("password_repeat")}</label>
                <div className="control">
                    <input type="password" placeholder={t("password_placeholder")} value={confirmationPassword} onChange={(e)=>setConfirmationPassword(e.target.value)} className="input" required />
                </div>
            </div>
            <ErrorMessage message={errorMessage}/>
            <br />
            <button className="button is-primary" type="submit">{t("button_create_budget")}</button>
        </form>
    );
};

const ExistingBudget = () =>{
    const {i18n, t} = useTranslation();

    const[id, setId] = useState("");
    const[password, setPassword] = useState("");
    const[errorMessage, setErrorMessage] = useState("");
    const [token] = useContext(UserContext);

    const submitExisting = async () =>{
        const requestOptions = {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({budget_id: parseInt(id,10),
                                budget_password: password
                                }),
        };

        const response = await fetch(`/api/budgets/existing/${id}`, requestOptions)
        const data = await response.json();

        
        if (!response.ok) {
            setErrorMessage(data.detail);
        }
    };

    const handleSubmitExisting = (e) => {
        e.preventDefault();
        submitExisting();
        window.location.reload();
    };

    return(
        <form onSubmit={handleSubmitExisting} className="box">
            <h1 className="title has-text-centered">{t("existing_budget_join_title")}</h1>
            <div className="field">
                <label className="label">{t("budget_id")}</label>
                <div className="control">
                    <input type="text" placeholder={t("budget_id_placeholder")} value={id} onChange={(e)=>setId(e.target.value)} className="input" required />
                </div>
            </div>
            <div className="field">
                <label className="label">{t("password")}</label>
                <div className="control">
                    <input type="password" placeholder={t("password_placeholder")} value={password} onChange={(e)=>setPassword(e.target.value)} className="input" required />
                </div>
            </div>
            <ErrorMessage message={errorMessage}/>
            <br />
            <button className="button is-primary" type="submit">{t("button_join")}</button>
        </form>
    );
};

const LinkBudget = () => {

    return(
        <div className="columns">
            <div className="column">
                <NewBudget/> 
            </div>
            <div className="column">
                <ExistingBudget/> 
            </div>
        </div>
    );
};
export default LinkBudget;