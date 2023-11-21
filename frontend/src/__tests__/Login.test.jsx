import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import { UserContext } from '../context/UserContext';
import { ReloadContext } from '../context/ReloadContext';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('Login component', () => {
    beforeEach(() => {
        fetch.mockResponseOnce(JSON.stringify({ access_token: 'testToken' }));
      });
    it('renders correctly', () => {
      const { getByPlaceholderText, getAllByText } = render(
        <UserContext.Provider value={[{}, () => {}]}>
          <ReloadContext.Provider value={{reload: false, triggerReload: () => {}}}>
            <Login />
          </ReloadContext.Provider>
        </UserContext.Provider>
      );
  
      expect(getByPlaceholderText('email_placeholder')).toBeInTheDocument();
      expect(getByPlaceholderText('password_placeholder')).toBeInTheDocument();
      expect(getAllByText('button_login')[1]).toBeInTheDocument(); // select the button
    });
  
    it('calls setToken on form submit', async () => {
        const setToken = jest.fn();
        const { getByPlaceholderText, getAllByText } = render(
          <UserContext.Provider value={[{}, setToken]}>
            <ReloadContext.Provider value={{reload: false, triggerReload: () => {}}}>
              <Login />
            </ReloadContext.Provider>
          </UserContext.Provider>
        );
      
        // Simulate a successful network response
        fetch.mockResponseOnce(JSON.stringify({ access_token: 'testToken' }));
      
        fireEvent.submit(getByPlaceholderText('email_placeholder').form);
      
        // Wait for the promise to resolve
        await waitFor(() => expect(setToken).toHaveBeenCalledWith('testToken'));
    });
  });