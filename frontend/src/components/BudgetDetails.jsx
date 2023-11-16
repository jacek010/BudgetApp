import React, { useState, useEffect, useContext } from 'react';

import { ReloadContext } from '../context/ReloadContext';

import BudgetModal from './BudgetModal';
import ErrorMessage from './ErrorMessage';
import { useTranslation } from 'react-i18next';

const BudgetDetails = ({budgetId, token})=>{
    const {i18n, t} = useTranslation();

    const {reload, triggerReload} = useContext(ReloadContext);
    const [showPassword, setShowPassword] = useState(false);

    const [budgetInfo, setBudgetInfo] = useState('')
    const [budgetUsers, setBudgetUsers] = useState('')
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect( () => {
        getBudgetDetails();
        
    }, [reload]);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleModal = () =>{
        setActiveModal(!activeModal);
        getBudgetDetails();
        triggerReload();
    };

    const getBudgetDetails = async () => {
        fetch(`/api/budgets/details/${budgetId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': 'application/json',
            },
          })
          .then(response => response.json())
          .then(data => {
            setBudgetInfo(data.budget_info);
            setBudgetUsers(data.budget_users);
            setLoaded(true);
          })
          .catch(error => console.error(error));
    };

    return(
        <>
            <div class="tile is-ancestor">
                <div class="tile is-vertical is-8">
                    <div class="tile">
                    <div class="tile is-parent is-vertical">
                        <article class="tile is-child notification is-primary">
                            <p class="title">{t("budget_name")}</p>
                            <p class="subtitle">{budgetInfo.budget_name}</p>
                        </article>
                        <article class="tile is-child notification is-warning">
                            <p class="title">ID</p>
                            <p class="subtitle">{budgetInfo.budget_id}</p>
                        </article>
                    </div>
                    <div class="tile is-parent">
                        <article class="tile is-child notification is-info">
                            <p class="title">{t("budget_description")}</p>
                            <p class="subtitle">{budgetInfo.budget_description}</p>
                        </article>
                    </div>
                    </div>
                    <div class="tile is-parent">
                    <article class="tile is-child notification is-danger">
                        <p class="title">{t("password")}</p>
                        <p class="subtitle">{t("budget_password_subtitle")}</p>
                        <button className="button is-warning" onClick={toggleShowPassword}>
                            {
                                showPassword ? (
                                    <p>{t("budget_password_hide")}</p>
                                ):(
                                    <p>{t("budget_password_show")}</p>
                                )
                            }
                        </button>
                        <div class="content">
                            {
                                showPassword ? (
                                    <p>{budgetInfo.budget_encrypted_password}</p>
                                ):(
                                    <p>{t("budget_password_hiden")}</p>
                                )
                            }
                            
                        </div>
                    </article>
                    </div>
                </div>
                <div class="tile is-parent">
                    <article class="tile is-child notification is-success">
                    <div class="content">
                        <p class="title">{t("budget_members")}</p>
                        <div class="content">
                            <ul>
                                {loaded&&budgetUsers ? (budgetUsers.map((user) => (
                                        <li>{user.user_name} {user.user_surname}</li>
                                    ))):(
                                        <p>{t("budget_members_failure")}</p>
                                    )}
                            </ul>
                        </div>
                    </div>
                    </article>
                </div>
            </div>
            <BudgetModal active={activeModal} handleModal={handleModal} token={token} budgetInfo={budgetInfo} setErrorMessage={setErrorMessage} />
            <button className='button is-fullwidth mb-5 is-success' 
            onClick={()=> setActiveModal(true)}>
                {t("budget_change_details")}
            </button>
        </>
    );
};

export default BudgetDetails;