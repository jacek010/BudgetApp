import React, { useContext, useEffect, useState } from "react";

import { UserContext } from "../context/UserContext";
import { ReloadContext } from "../context/ReloadContext";
import { useTranslation } from "react-i18next";

const Header = ({ title, changeCurrentTab}) => {
    const { i18n, t } = useTranslation();

    const [token, setToken] = useContext(UserContext);
    const [loading, setLoading] = useState(false);

    const {reload, triggerReload} = useContext(ReloadContext);

    const [userName, setUserName] = useState('');
    const [userSurname, setUserSurname] = useState('');
    const [budgetId, setBudgetId] = useState('');

    useEffect( () => {
        if(token) {
            getCurrentUser();
        }
    }, [token, reload]);

    const handleLogout = () => {
        setToken(null);

    };

    const getCurrentUser = async() =>{
        setLoading(true);
        fetch('/api/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': 'application/json',
            },
          })
          .then(response => response.json())
          .then(data => {
            setUserName(data.user_name);
            setUserSurname(data.user_surname);
            setBudgetId(data.budget_id);
            setLoading(false)
          })
          .catch(error => {
            setLoading(false);
            console.error(error);
        });
          
          
    };

    return(

        <div className="has-text-centered m-6">
            {
                token ? (
                    loading ? (
                        <progress class="progress is-large" max="100"></progress>
                    ) : (
                        <>
                            <h1 className="title is-3">{t("header_welcome")} {userName} {userSurname}</h1>
                            <br></br>
                            <div className="columns">
                                {budgetId? (<>
                                <div className="column is-2">
                                    <button className="button is-success is-fullwidth" onClick={()=>changeCurrentTab('BudgetDetails')}>
                                    {t("header_budget_details")}
                                    </button>
                                </div>
                                <div className="column is-2">
                                    <button className="button is-info is-fullwidth" onClick={()=>changeCurrentTab('Categories')}>
                                    {t("header_categories")}
                                    </button>
                                </div>
                                <div className="column is-2">
                                    <button className="button is-primary is-fullwidth" onClick={()=>changeCurrentTab('BudgetSummary')}>
                                    {t("header_budget_summary")}
                                    </button>
                                </div>
                                <div className="column is-2">
                                    <button className="button is-link is-fullwidth" onClick={()=>changeCurrentTab('PaymentReminders')}>
                                    {t("header_payment_reminders")}
                                    </button>
                                </div>
                                
                                <div className="column is-2">
                                    <button className="button is-warning is-fullwidth" onClick={()=>changeCurrentTab('UserDetails')}>
                                    {t("header_user_details")}
                                    </button>
                                </div>
                                </>):(<></>)}
                                <div className="column is-1">
                                    <button className="button is-danger"  onClick={handleLogout}>
                                    {t("header_logout")}
                                    </button>
                                </div>
                            </div>
                        </>
                    )
                ):(
                    <>
                        <h1 className="title">{title}</h1>
                    </>
                )
            }
        </div>
    );
};

export default Header;