import React, { useContext, useState, useEffect, useCallback } from 'react';
import moment from 'moment';



import { ReloadContext } from '../context/ReloadContext';

import ErrorMessage from "./ErrorMessage";
import { UserContext } from '../context/UserContext';
import OperationModal from './OperationModal';

const OperationsTable = () => {
    const [token] = useContext(UserContext);
    const { reload, triggerReload } = useContext(ReloadContext);
    const [operations, setOperations] = useState(null);
    const [filteredOperations, setFilteredOperations] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [id, setId] = useState(null);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [incomeExpense, setIncomeExpense] = useState("");

    const [incomeSum, setIncomeSum] = useState(0);
    const [expensesSum, setExpensesSum] = useState(0);
    const [totalSum, setTotalSum] = useState(0);

    const [incomesSums, setIncomesSums] = useState({});
    const [expensesSums, setExpensesSums] = useState({});

    const [categoryColors, setCategoryColors] = useState({});

    let tempCategoryColors = {};


    const handleUpdate = async (id) => {
        setId(id);
        setActiveModal(true);
    };

    const filterOperations = useCallback(() => {
        let tempIncomeSum = 0;
        let tempExpensesSum = 0;
        let incomeSums = [];
        let expenseSums = [];


        let filteredOperations = operations.filter(operation => {
            const operationDate = operation.operation_date
            if (
                (!fromDate || operationDate >= fromDate)
                && (!toDate || operationDate <= toDate)
                && (!incomeExpense || operation.operation_value > 0 === (incomeExpense === "income"))) {
                if (operation.operation_value > 0) {
                    if (!incomeSums[operation.category_name]) {
                        incomeSums[operation.category_name] = 0;
                        tempCategoryColors[operation.category_name] = operation.category_color;
                    }
                    incomeSums[operation.category_name] += parseFloat(operation.operation_value);
                    tempIncomeSum += parseFloat(operation.operation_value);
                } else {
                    if (!expenseSums[operation.category_name]) {
                        expenseSums[operation.category_name] = 0;
                        tempCategoryColors[operation.category_name] = operation.category_color;
                    }
                    expenseSums[operation.category_name] += parseFloat(operation.operation_value);
                    tempExpensesSum += parseFloat(operation.operation_value);
                }
                return true;
            }
            else {
                return false;
            }

        });
        setTotalSum(tempIncomeSum - tempExpensesSum.toFixed(2))
        setIncomeSum(tempIncomeSum.toFixed(2));
        setExpensesSum(tempExpensesSum.toFixed(2));
        setIncomesSums(incomeSums);
        setExpensesSums(expenseSums);
        setCategoryColors(tempCategoryColors);

        return filteredOperations;

    }, [fromDate, toDate, incomeExpense, operations]);

    useEffect(() => {
        if (operations) {
            setIncomeSum(0);
            setExpensesSum(0);
            setTotalSum(0);
            setIncomesSums({});
            setExpensesSums({});

            setFilteredOperations(filterOperations());
        }
    }, [fromDate, toDate, incomeExpense, operations, filterOperations]);

    const resetFilters = () => {
        setFromDate("");
        setToDate("");
        setIncomeExpense("");
    };

    


    const handleDelete = async (id) => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json',
                "Content-Type": "application/json"
            },
        };
        const response = await fetch(`/api/operations/${id}`, requestOptions);
        if (!response.ok) {
            setErrorMessage("Failed to delete operation")
        }
        getOperations();
    };

    const getOperations = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json',
                "Content-Type": "application/json"
            },
        };
        const response = await fetch("/api/operations", requestOptions);

        if (!response.ok) {
            setErrorMessage("Something went wrong. Couldn't load the operations")
        } else {
            const data = await response.json();
            setOperations(data);
            setLoaded(true);
        }

    };

    useEffect(() => {
        getOperations();
    }, []);

    const handleModal = () => {
        setActiveModal(!activeModal);
        getOperations();
        setId(null);
        triggerReload();
    };

    return (
        <>
            <OperationModal active={activeModal} handleModal={handleModal} token={token} id={id} setErrorMessage={setErrorMessage} />

            <div className="box">

                <div className="columns">
                    <div className="column is-4 has-text-centered">
                        <input className={`button is-fullwidth ${fromDate ? ("is-warning") : ("is-light")}`} type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                    </div>
                    <div className="column is-4 has-text-centered">
                        <input className={`button is-fullwidth ${toDate ? ("is-warning") : ("is-light")}`} type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
                    </div>
                    <div className="column has-text-centered">
                        <select className={`button is-fullwidth is-light ${incomeExpense === "income" ? ("is-success") : (incomeExpense === "expense" ? ("is-danger") : ("is-info"))}`} value={incomeExpense} onChange={e => setIncomeExpense(e.target.value)}>
                            <option value="">All</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                    <div className="column has-text-centered">
                        <button className="button is-dark" onClick={() => resetFilters()}>Reset</button>
                    </div>
                </div>
            </div>
            <div className="box">
                <p className='title is-3 has-text-centered'>Budget balance{fromDate ? (" from " + fromDate) : ("")}{toDate ? (" to " + toDate) : ("")}</p>
                <div className="columns">
                    <div className="column is-6 has-text-left">
                        <p className='title is-4 has-text-success'>Income</p>
                        <p className='subtitle is-5 has-text-success'>{incomeSum}</p>
                    </div>
                    <div className="column is-6 has-text-right">
                        <p className='title is-4 has-text-danger'>Expenses</p>
                        <p className='subtitle is-5 has-text-danger'>{-expensesSum}</p>
                    </div>
                </div>
                <progress class="progress is-green_red is-large" value={`${parseFloat(incomeSum)}`} max={`${parseFloat(totalSum)}`}></progress>
                <div className="columns">
                    <div className="column has-text-centered">
                        <div className="box">
                            <p className='title is-5 has-text-success'>By categories</p>
                            {Object.entries(incomesSums).map(([category_name, value]) => (
                                <div key={category_name}>
                                    {category_name}: {value.toFixed(2)}
                                    <progress class={`progress ${categoryColors[category_name]} is-small`} value={`${parseFloat(value)}`} max={`${parseFloat(incomeSum)}`}></progress>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="column has-text-centered">
                        <div className="box">
                            <p className='title is-5 has-text-danger'>By categories</p>
                            {Object.entries(expensesSums).map(([category_name, value]) => (
                                <div key={category_name}>
                                    {category_name}: {parseFloat(-value).toFixed(2)}
                                    <progress class={`progress ${categoryColors[category_name]}_inverted is-small`} value={`${parseFloat((-expensesSum) + value)}`} max={`${parseFloat(-expensesSum)}`}></progress>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            <button className='button is-fullwidth mb-5 is-primary'
                onClick={() => setActiveModal(true)}>
                Add operation
            </button>
            <ErrorMessage message={errorMessage} />
            {loaded ? (
                <table className='table is-fullwidth'>
                    <thead>
                        <tr>
                            <th>Operation name</th>
                            <th>Value</th>
                            <th>Date</th>
                            <th>Subcategory</th>
                            <th>User</th>
                            <th className='has-text-right'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOperations.map((operation) => (
                            <tr key={operation.operation_id}>
                                <td>{operation.operation_name}</td>
                                <td className={`${operation.operation_value < 0 ? 'has-text-danger' : 'has-text-success'}`}>{operation.operation_value}</td>
                                <td>{moment(operation.operation_date).format("Do MMMM YYYY")}</td>
                                <td className='has-text-centered'><span className={`tag ${operation.category_color}`}>{operation.subcategory_name}</span></td>
                                <td>{operation.user_name + " " + operation.user_surname}</td>
                                <td className='has-text-right'>
                                    <button className="button mr-2 is-link" onClick={() => handleUpdate(operation.operation_id)}>Update</button>
                                    <button className="button mr-2 is-danger is-light" onClick={() => handleDelete(operation.operation_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <progress class="progress is-large" max="100"></progress>
            }
        </>
    );

};
export default OperationsTable;
