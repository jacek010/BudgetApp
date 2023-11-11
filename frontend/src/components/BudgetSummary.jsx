import React, { useContext, useEffect, useState } from "react";

import { UserContext } from '../context/UserContext';
import { ReloadContext } from "../context/ReloadContext";
import OperationsTable from "./OperationsTable";

const BudgetSummary = ({budgetId, token})=>{
    const {reload, triggerReload} = useContext(ReloadContext);


    const [budgetSum, setBudgetSum] = useState('');
    const [budgetName, setBudgetName] = useState('');


    useEffect( () => {
        getBudgetSum();
        
    }, [reload]);

    const getBudgetSum = async () => {
        fetch(`/api/budgets/summary/${budgetId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': 'application/json',
            },
          })
          .then(response => response.json())
          .then(data => {
            setBudgetSum(data.budget_sum);
            setBudgetName(data.name);
          })
          .catch(error => console.error(error));
        setBudgetSum(budgetId);
    };

    return(
        <>
            <div class="columns">
                <div class="column is-4">
                    <div className="box ">
                        <p className="title is-4 has-text-centered ">"{budgetName}" summary</p>
                    </div>
                    
                </div>
                <div className="column is-8">
                        <div className="box">
                            <p className={`title is-4 has-text-right ${budgetSum < 0 ? 'has-text-danger' : 'has-text-success'}`}>
                                Actual budget amount: {budgetSum}
                            </p>
                        </div>
                    </div>
            </div>
            
            <OperationsTable/>
        </>
        
    );
};

export default BudgetSummary;