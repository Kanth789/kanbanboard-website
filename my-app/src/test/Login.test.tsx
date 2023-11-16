import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';

jest.mock('../api/authClient', () => ({
  login: jest.fn(() => Promise.resolve({ data: { token: 'mockedToken' } })),
}));

describe('Login Component', () => {
  it('renders the login form', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getAllByText(/UserName/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Password/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Login/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Don't have an account?/i)).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    userEvent.type(screen.getByLabelText(/UserName/i), 'validUsername');
    userEvent.type(screen.getByLabelText(/Password/i), 'validPassword');

    fireEvent.click(screen.getByText(/Login/i));

    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument()



  });

});
