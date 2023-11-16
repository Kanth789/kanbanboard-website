import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import SignUp from '../pages/SignUp';

jest.mock('../api/authClient', () => ({
  signup: jest.fn(() => Promise.resolve({ data: { token: 'mockedToken' } })),
}));

describe('SignUp Component', () => {
//     it('renders the signup form', () => {
//         render(
//           <MemoryRouter>
//             <SignUp />
//           </MemoryRouter>
//         );
      
//         expect(screen.getByLabelText(/UserName/i)).toBeInTheDocument();
//         expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
//         expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
//         expect(screen.getByText(/SignUp/i)).toBeInTheDocument();
//         expect(screen.getByText(/Already have an account?/i)).toBeInTheDocument();
      
//         // Use more specific queries for the password fields
//         expect(screen.getByLabelText(/Password/i, { selector: 'input' })).toBeInTheDocument();
//         expect(screen.getByLabelText(/Confirm Password/i, { selector: 'input' })).toBeInTheDocument();
//       });
      

//   it('submits the form with valid data', async () => {
//     render(
//       <MemoryRouter>
//         <SignUp />
//       </MemoryRouter>
//     );

//     userEvent.type(screen.getByTestId('username-input'), 'validUsername');
//     userEvent.type(screen.getByTestId('password-input'), 'validPassword');
//     userEvent.type(screen.getByTestId('confirmPassword-input'), 'validPassword');

//     fireEvent.click(screen.getByText(/SignUp/i));

//     expect(screen.getByRole('button', { name: /SignUp/i })).toBeInTheDocument()

//     await waitFor(() =>
//       expect(screen.getByRole('button', { name: /SignUp/i })).toHaveAttribute('aria-busy', 'false')
//     );

//     expect(window.location.pathname).toBe('/');
//     expect(screen.getByText(/SignUp Successful/i)).toBeInTheDocument();
//   });

  it('displays error messages for empty fields', async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/SignUp/i));

    await waitFor(() => {
      expect(screen.getByText(/Please enter the User/i)).toBeInTheDocument();
      expect(screen.getByText(/Please enter the Password/i)).toBeInTheDocument();
      expect(screen.getByText(/Please enter the Confirm Password/i)).toBeInTheDocument();
    });

    expect(screen.queryByText(/The passwords are not matching/i)).not.toBeInTheDocument();
  });

  it('displays error message for non-matching passwords', async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    userEvent.type(screen.getByTestId('password-input'), 'password1');
    userEvent.type(screen.getByTestId('confirmPassword-input'), 'password2');

    fireEvent.click(screen.getByText(/SignUp/i));

    await waitFor(() => expect(screen.getByText(/The passwords are not matching/i)).toBeInTheDocument());
  });

  // Add more test cases for other scenarios (e.g., server error, API response with errors, etc.)
});
