import React, { useState, useContext } from "react";

import { UserContext } from "../context/UserContext";
import { ReloadContext } from "../context/ReloadContext";
import ErrorMessage from "./ErrorMessage";
import { useTranslation } from "react-i18next";

const Register = () =>{
    const {i18n, t} = useTranslation();

    const {reload, triggerReload} = useContext(ReloadContext);
    const[name, setName] = useState("");
    const[surname, setSurname] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[confirmationPassword, setConfirmationPassword] = useState("");
        const[errorMessage, setErrorMessage] = useState("");
        const[, setToken] = useContext(UserContext);

        const submitRegistration = async () =>{
            const requestOptions = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({user_name: name,
                                    user_surname: surname,
                                    user_email: email,
                                    user_hashed_password: password
                                    }),
            };

            const response = await fetch("/api/users", requestOptions)
            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.detail);
            } else {
                setToken(data.access_token);
                triggerReload();
            }
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            if (password === confirmationPassword && password.length >5){
                submitRegistration();
            } else{
                setErrorMessage(t("error_password_not_matching"));
            }
        };

        return(
            <div className="column">
                <form className="box" onSubmit={handleSubmit}>
                    <h1 className="title has-text-centered">{t("register_title")}</h1>
                    <div className="field">
                        <label className="label">{t("name")}</label>
                        <div className="control">
                            <input type="text" placeholder={t("name_placeholder")} value={name} onChange={(e)=>setName(e.target.value)} className="input" required />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">{t("surname")}</label>
                        <div className="control">
                            <input type="text" placeholder={t("surname_placeholder")} value={surname} onChange={(e)=>setSurname(e.target.value)} className="input" required />
                        </div>
                    </div>
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
                    <div className="field">
                        <label className="label">{t("password_repeat")}</label>
                        <div className="control">
                            <input type="password" placeholder={t("password_placeholder")} value={confirmationPassword} onChange={(e)=>setConfirmationPassword(e.target.value)} className="input" required />
                        </div>
                    </div>
                    <ErrorMessage message={errorMessage}/>
                    <br />
                    <button className="button is-primary" type="submit">{t("button_register")}</button>
                </form>
            </div>
        );
};

export default Register;