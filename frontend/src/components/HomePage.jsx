import React, {useState, useEffect, useContext} from "react";

import LinkBudget from "./LinkBudget";
import { UserContext } from '../context/UserContext';
import OperationsTable from "./OperationsTable";
import BudgetSummary from "./BudgetSummary";
import BudgetDetails from "./BudgetDetails";
import Categories from "./Categories";
import Reminders from "./Reminders";
import UserDetails from "./UserDetails";
import { useTranslation } from "react-i18next";
import ErrorMessage from "./ErrorMessage";

const HomePage = ({currentTab})=>{
    const {i18n, t} = useTranslation();

    const [budgetId, setBudgetId] = useState('');
    const [token] = useContext(UserContext);
    


    useEffect(() => {
        fetch('/api/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => setBudgetId(data.budget_id))
    .catch(error => console.error(error));
  }, [token]);

  const renderTabs = ()=>{
    switch (currentTab) {
        case 'BudgetSummary':
            return <BudgetSummary budgetId={budgetId} token={token}/>;
        case 'BudgetDetails':
          return <BudgetDetails budgetId={budgetId} token={token}/>;
        case 'Categories':
          return <Categories token={token}/>;
        case 'PaymentReminders':
          return <Reminders />;
        case 'UserDetails':
          return <UserDetails token={token}/>;
        default:
          return <ErrorMessage message={t("error_homepage_selector")}/>;
      }
  };

    return(
        <div className="homePage">
            {
                budgetId ? (
                    <>  
                        {renderTabs()}
                    </> 
                ): (
                    <LinkBudget/>
                )
            }
        </div>
    );
};
export default HomePage;