import React, { useEffect, useState } from "react";

import ErrorMessage from './ErrorMessage';

const UserModal = ({ active, handleModal, token, userInfo}) => {

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
            setErrorMessage("Something went wrong when updating operation");
        } else {
            handleModal();
        }
    };

    const handleUpdate = (e) => {
        if (userPassword === userPasswordRepeat && userPassword.length >5){
            handleUpdateUser();
        } else{
            setErrorMessage("Ensure that the password match and greater than 5 characters");
        }
    };

    return(
        <div className={`modal ${active && "is-active"}`}>
            <div className="modal-background" onClick={handleModal}></div>
            <div className="modal-card">
                <header className="modal-card-head has-background-primary-light">
                    <h1 className="modal-card-title">
                        Edit user details
                    </h1>
                </header>
                <section className="modal-card-body">
                    <form>
                        <div className="field">
                            <label className="label">User name</label>
                            <div className="control">
                                <input type="text" className="input" required placeholder="Enter budget name" value={userName} onChange={(e) => setUserName(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">User surname</label>
                            <div className="control">
                                <input type="text" className="input" required placeholder="Enter budget description" value={userSurname} onChange={(e) => setUserSurname(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">User password</label>
                            <div className="control">
                                <input type="password" className="input" required placeholder="Enter new password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Repeat user password</label>
                            <div className="control">
                                <input type="password" className="input" required placeholder="Repeat password" value={userPasswordRepeat} onChange={(e) => setUserPasswordRepeat(e.target.value)} />
                            </div>
                        </div>
                        <ErrorMessage message={errorMessage}/>
                    </form>
                </section>
                <footer className="modal-card-foot has-background-primary-light">
                    <button className="button is-info" onClick={handleUpdate}>Update</button>
                    <button className="button" onClick={handleModal}>Cancel</button>
                </footer>
            </div>
        </div>
    );
};

export default UserModal;