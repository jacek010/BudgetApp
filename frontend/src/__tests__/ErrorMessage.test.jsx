import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import ErrorMessage from '../components/ErrorMessage';

test('ErrorMessage displays the message', async () => {
  render(<ErrorMessage message="Test error message" />);
  
  await waitFor(() => {
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });
});