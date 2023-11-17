import React, { useEffect, useState } from "react";

import ErrorMessage from './ErrorMessage';
import { useTranslation } from "react-i18next";

const UserModal = ({ active, handleModal, token, userInfo}) => {
    const {i18n, t} = useTranslation();

    const [userName, setUserName] = useState('');
    const [userSurname, setUserSurname] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userPasswordRepeat, setUserPasswordRepeat] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() =>{
        setUserName(userInfo.user_name);
        setUserSurname(userInfo.user_surname);
        
    },[userInfo]);

    const handleUpdateUser = async () => {
        const requestOptions = {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user_name: userName, 
                user_surname: userSurname, 
                user_email: userInfo.user_email,
                user_hashed_password: userPassword
            }),
        };
        const response = await fetch(`/api/users/update`, requestOptions);

        if(!response.ok) {
            setErrorMessage(t("error_update_user"));
        } else {
            handleModal();
        }
    };

    const handleUpdate = (e) => {
        if (userPassword === userPasswordRepeat && userPassword.length >5){
            handleUpdateUser();
        } else{
            setErrorMessage(t("error_pasword_not_matching"));
        }
    };

    return(
        <div className={`modal ${active && "is-active"}`}>
            <div className="modal-background" onClick={handleModal}></div>
            <div className="modal-card">
                <header className="modal-card-head has-background-primary-light">
                    <h1 className="modal-card-title">
                        {t("user_modal_title")}
                    </h1>
                </header>
                <section className="modal-card-body">
                    <form>
                        <div className="field">
                            <label className="label">{t("user_name")}</label>
                            <div className="control">
                                <input type="text" className="input" required placeholder={t("user_name_placeholder")} value={userName} onChange={(e) => setUserName(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">{t("user_surname")}</label>
                            <div className="control">
                                <input type="text" className="input" required placeholder={t("user_surname_placeholder")} value={userSurname} onChange={(e) => setUserSurname(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">{t("password")}</label>
                            <div className="control">
                                <input type="password" className="input" required placeholder={t("password_placeholder")} value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">{t("password_repeat")}</label>
                            <div className="control">
                                <input type="password" className="input" required placeholder={t("password_repeat")} value={userPasswordRepeat} onChange={(e) => setUserPasswordRepeat(e.target.value)} />
                            </div>
                        </div>
                        <ErrorMessage message={errorMessage}/>
                    </form>
                </section>
                <footer className="modal-card-foot has-background-primary-light">
                    <button className="button is-info" onClick={handleUpdate}>{t("button_update")}</button>
                    <button className="button" onClick={handleModal}>{t("button_cancel")}</button>
                </footer>
            </div>
        </div>
    );
};

export default UserModal;