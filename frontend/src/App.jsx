import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import './sass/mystyles.scss';

import './language/LangConf';

import Register from './components/Register';
import Login from './components/Login';
import Header from './components/Header';
import HomePage from './components/HomePage';
import { UserContext } from './context/UserContext';
import { ReloadProvider } from './context/ReloadContext';

function App() {
  const [message, setMessage] = useState('');
  const [token] = useContext(UserContext);
  const [currentTab, setCurrentTab] = useState('BudgetSummary');

  const changeCurrentTab = (newTab) => {
    setCurrentTab(newTab);
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api');
        setMessage(response.data.Message);
      } catch (error) {
        console.error('Error during getting data: ', error);
      }
    };

    fetchData();
  }, []);

  

  return (
    <>
      <ReloadProvider>
        <Header title={message} changeCurrentTab={changeCurrentTab}/>
        <div className="columns">
          <div className="column"></div>
          <div className="column m-5 is-two-thirds">
            {
            !token ? (
              <div className="columns">
                <div className="column">
                  <Register/>
                </div>
                <div className="column">
                  <Login/>
                </div>
              </div>
            ): (
              <HomePage currentTab={currentTab}/>
            )
            }
          </div>
          <div className="column"></div>
        </div>
      </ReloadProvider>
    </>
  );
}

export default App;
