import React, { useState, useContext } from "react";

import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";
import { ReloadContext } from "../context/ReloadContext";
import { useTranslation } from "react-i18next";

const Login = () => {
    const { i18n, t} = useTranslation();

    const {reload, triggerReload} = useContext(ReloadContext);
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
        const[errorMessage, setErrorMessage] = useState("");
        const[, setToken] = useContext(UserContext);

    const submitLogin = async () =>{
        const requestOptions = {
            method:"POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: JSON.stringify(`grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`),
        };

        const response = await fetch("api/token", requestOptions);
        const data = await response.json();

        if(!response.ok){
            setErrorMessage(data.detail);
        } else {
            setToken(data.access_token);
            triggerReload();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitLogin();
    };

    return(
        <div className="column">
                <form className="box" onSubmit={handleSubmit}>
                    <h1 className="title has-text-centered">{t("button_login")}</h1>
                    <div className="field">
                        <label className="label">{t("email")}</label>
                        <div className="control">
                            <input type="email" placeholder={t("email_placeholder")} value={email} onChange={(e)=>setEmail(e.target.value)} className="input" required />
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
                    <button className="button is-primary" type="submit">{t("button_login")}</button>
                </form>
            </div>
    );
};

export default Login;
