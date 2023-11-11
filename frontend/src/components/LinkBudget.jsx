import React, {useState, useEffect, useContext} from "react";


import ErrorMessage from "./ErrorMessage";
import { UserContext } from '../context/UserContext';

const NewBudget = ()=>{
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
            setErrorMessage("Ensure that the password match and greater than 5 characters");
        }
    };

    return(
        <form onSubmit={handleSubmitNew} className="box">
            <h1 className="title has-text-centered">Create new fresh budget</h1>
            <div className="field">
                <label className="label">Budget name</label>
                <div className="control">
                    <input type="text" placeholder="Enter budget name" value={name} onChange={(e)=>setName(e.target.value)} className="input" required />
                </div>
            </div>
            <div className="field">
                <label className="label">Description</label>
                <div className="control">
                    <textarea placeholder="Enter budget name" value={description} onChange={(e)=>setDescription(e.target.value)} className="input" required />
                </div>
            </div>
            <div className="field">
                <label className="label">Password</label>
                <div className="control">
                    <input type="password" placeholder="Enter password" value={password} onChange={(e)=>setPassword(e.target.value)} className="input" required />
                </div>
            </div>
            <div className="field">
                <label className="label">Confirm password</label>
                <div className="control">
                    <input type="password" placeholder="Enter password" value={confirmationPassword} onChange={(e)=>setConfirmationPassword(e.target.value)} className="input" required />
                </div>
            </div>
            <ErrorMessage message={errorMessage}/>
            <br />
            <button className="button is-primary" type="submit">Create budget</button>
        </form>
    );
};

const ExistingBudget = () =>{
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
            <h1 className="title has-text-centered">Join to an existing budget</h1>
            <div className="field">
                <label className="label">Budget id</label>
                <div className="control">
                    <input type="text" placeholder="Enter budget id" value={id} onChange={(e)=>setId(e.target.value)} className="input" required />
                </div>
            </div>
            <div className="field">
                <label className="label">Password</label>
                <div className="control">
                    <input type="password" placeholder="Enter password" value={password} onChange={(e)=>setPassword(e.target.value)} className="input" required />
                </div>
            </div>
            <ErrorMessage message={errorMessage}/>
            <br />
            <button className="button is-primary" type="submit">Join</button>
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