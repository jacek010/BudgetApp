import React, { useEffect, useState } from "react";

import ErrorMessage from "./ErrorMessage";
import { useTranslation } from "react-i18next";

const BudgetModal = ({ active, handleModal, token, budgetInfo}) => {
    const {i18n, t} = useTranslation();

    const [budgetName, setBudgetName] = useState('');
    const [budgetDescription, setBudgetDescription] = useState('');
    const [budgetPassword, setBudgetPassword] = useState('');
    const [budgetPasswordRepeat, setBudgetPasswordRepeat] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() =>{
        setBudgetName(budgetInfo.budget_name);
        setBudgetDescription(budgetInfo.budget_description);
        setBudgetPassword(budgetInfo.budget_encrypted_password);
        setBudgetPasswordRepeat(budgetInfo.budget_encrypted_password);
    },[handleModal, active]);

    useEffect(() =>{
        setErrorMessage('');
    },[budgetPassword, budgetPasswordRepeat]);

    const handleUpdateOperation = async () => {
        const requestOptions = {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ budget_name: budgetName, 
                budget_description: budgetDescription, 
                budget_password: budgetPassword
            }),
        };
        const response = await fetch(`/api/budgets/${budgetInfo.budget_id}`, requestOptions);

        if(!response.ok) {
            setErrorMessage(t("error_update_budget"));
        } else {
            handleModal();
        }
    };

    const handleUpdate = (e) => {
        if (budgetPassword === budgetPasswordRepeat && budgetPassword.length >5){
            handleUpdateOperation();
        } else{
            setErrorMessage(t("error_password_not_matching"));
        }
    };

    return(
        <div className={`modal ${active && "is-active"}`}>
            <div className="modal-background" onClick={handleModal}></div>
            <div className="modal-card">
                <header className="modal-card-head has-background-primary-light">
                    <h1 className="modal-card-title">
                        {t("budget_modal_edit_budget_details")}
                    </h1>
                </header>
                <section className="modal-card-body">
                    <form>
                        <div className="field">
                            <label className="label">{t("budget_name")}</label>
                            <div className="control">
                                <input type="text" className="input" required placeholder={t("budget_name_placeholder")} value={budgetName} onChange={(e) => setBudgetName(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">{t("budget_description")}</label>
                            <div className="control">
                                <input type="text" className="input" required placeholder={t("budget_description_placeholder")} value={budgetDescription} onChange={(e) => setBudgetDescription(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">{t("budget_modal_budget_password")}</label>
                            <div className="control">
                                <input type="password" className="input" required placeholder={t("password_placeholder")} value={budgetPassword} onChange={(e) => setBudgetPassword(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">{t("password_repeat")}</label>
                            <div className="control">
                                <input type="password" className="input" required placeholder={t("password_repeat")} value={budgetPasswordRepeat} onChange={(e) => setBudgetPasswordRepeat(e.target.value)} />
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

export default BudgetModal;