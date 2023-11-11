import React, { useState, useContext } from "react";

import { UserContext } from "../context/UserContext";
import { ReloadContext } from "../context/ReloadContext";
import ErrorMessage from "./ErrorMessage";

const Register = () =>{
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
                setErrorMessage("Ensure that the password match and greater than 5 characters");
            }
        };

        return(
            <div className="column">
                <form className="box" onSubmit={handleSubmit}>
                    <h1 className="title has-text-centered">Register</h1>
                    <div className="field">
                        <label className="label">Name</label>
                        <div className="control">
                            <input type="text" placeholder="Enter name" value={name} onChange={(e)=>setName(e.target.value)} className="input" required />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Surname</label>
                        <div className="control">
                            <input type="text" placeholder="Enter surname" value={surname} onChange={(e)=>setSurname(e.target.value)} className="input" required />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Email Address</label>
                        <div className="control">
                            <input type="email" placeholder="Enter email" value={email} onChange={(e)=>setEmail(e.target.value)} className="input" required />
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
                    <button className="button is-primary" type="submit">Register</button>
                </form>
            </div>
        );
};

export default Register;