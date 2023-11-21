import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ReloadContext } from '../context/ReloadContext';
import BudgetDetails from '../components/BudgetDetails';


global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      budget_info: {
        budget_name: "Test Budget",
        budget_id: "123",
        budget_description: "Test Description",
        budget_encrypted_password: "Test Password"
      },
      budget_users: [
        { user_id: "1", user_name: "Test User", user_surname: "Test Surname" }
      ]
    }),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

test('BudgetDetails renders correctly', async () => {

  const mockReloadContext = {
    reload: false,
    triggerReload: jest.fn(),
  };

  render(
    <ReloadContext.Provider value={mockReloadContext}>
      <BudgetDetails budgetId="123" token="testToken" />
    </ReloadContext.Provider>
  );

  await waitFor(() => {
    expect(screen.getByText('Test Budget')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test User Test Surname')).toBeInTheDocument();
  });
});