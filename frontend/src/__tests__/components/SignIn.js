import  { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import SignIn from "../../components/SignIn";
import { MemoryRouter } from 'react-router-native';

describe('User sign in interaction', () => {
    it('calls onSignIn with correct credentials when valid', async () => {
        const mockOnSignIn = jest.fn();
        render(
            <MemoryRouter>
                <SignIn onSignIn={mockOnSignIn}></SignIn>
            </MemoryRouter>
        );
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByText('Log In');

        fireEvent.changeText(usernameInput, 'testuser');
        fireEvent.changeText(passwordInput, 'password123');
        fireEvent.press(loginButton);

        await waitFor(() => {
            expect(mockOnSignIn).toHaveBeenCalledTimes(1);
            expect(mockOnSignIn).toHaveBeenCalledWith('testuser', 'password123');
        });
    });
    
    it('displays an error message when credentials are invalid', async () => {
        const mockOnSignIn = jest.fn(() => {
            return Promise.reject({
                response: {
                    status: 401,
                }
            });
        });
        render(
            <MemoryRouter>
                <SignIn onSignIn={mockOnSignIn}></SignIn>
            </MemoryRouter>
        );
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByText('Log In');
    
        fireEvent.changeText(usernameInput, 'wronguser');
        fireEvent.changeText(passwordInput, 'wrongpassword');
        fireEvent.press(loginButton);
    
        await waitFor(() => {
            expect(mockOnSignIn).toHaveBeenCalledWith('wronguser', 'wrongpassword');
            expect(mockOnSignIn).toHaveBeenCalledTimes(1);
        });
    });    
});