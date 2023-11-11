import React, { useState, useEffect, useContext } from 'react';
import { ReloadContext } from '../context/ReloadContext';

import ErrorMessage from './ErrorMessage';
import UserModal from './UserModal';


const UserDetails = ({token})=>{
    const {reload, triggerReload} = useContext(ReloadContext);
    const [activeModal, setActiveModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loaded, setLoaded] = useState(false);

    const [userInfo, setUserInfo] = useState('');

    useEffect( () => {
        getUserDetails();
        
    }, [reload]);

    const handleModal = () =>{
        setActiveModal(!activeModal);
        getUserDetails();
        triggerReload();
    };

    const getUserDetails = async() =>{
        fetch('/api/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': 'application/json',
            },
          })
          .then(response => response.json())
          .then(data => {
            setUserInfo(data);
            setLoaded(false);
          })
          .catch(error => {
            setLoaded(false);
            console.error(error);
        });
    };

    return(
        <>
            <div class="tile is-ancestor">
                <div class="tile is-7">
                    <div class="tile">
                        <div class="tile is-parent">
                            <article class="tile is-child notification is-primary">
                                <p class="title">Name</p>
                                <p class="subtitle">{userInfo.user_name}</p>
                            </article>
                        </div>
                        <div class="tile is-parent">
                            <article class="tile is-child notification is-info">
                                <p class="title">Surname</p>
                                <p class="subtitle">{userInfo.user_surname}</p>
                            </article>
                        </div>
                    </div>
                </div>
                <div class="tile is-parent">
                    <article class="tile is-child notification is-success">
                    <div class="content">
                        <p class="title">Email address</p>
                        <p class="subtitle">{userInfo.user_email}</p>
                    </div>
                    </article>
                </div>
            </div>
            <UserModal active={activeModal} handleModal={handleModal} token={token} userInfo={userInfo} />
            <button className='button is-fullwidth mb-5 is-warning' 
            onClick={()=> setActiveModal(true)}>
                Change details
            </button>
        </>
    );
};

export default UserDetails;