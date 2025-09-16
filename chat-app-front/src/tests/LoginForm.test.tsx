import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import LoginForm from '../components/LoginForm';
import { AlertContext, UserContext } from '../App';

// Mock fetch globally
global.fetch = vi.fn();

describe('LoginForm', () => {
    const mockChangeUser = vi.fn();
    const mockChangeAlert = vi.fn();

    const renderLoginForm = () => {
        return render(
            <UserContext.Provider value={{ changeUser: mockChangeUser }}>
                <AlertContext.Provider value={{ changeAlert: mockChangeAlert }}>
                    <LoginForm />
                </AlertContext.Provider>
            </UserContext.Provider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (fetch as any).mockClear();
    });

    test('renders login form correctly', () => {
        renderLoginForm();

        expect(screen.getByText('Chat App')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(
            screen.getByRole('checkbox', { name: 'Remember me' })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Submit' })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Sign Up' })
        ).toBeInTheDocument();
        expect(
            screen.getByText('Chat App ©2022 Created by Sami Oksanen')
        ).toBeInTheDocument();
    });

    test('shows validation errors for empty fields', async () => {
        const user = userEvent.setup();
        renderLoginForm();

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        await user.click(submitButton);

        await waitFor(() => {
            expect(
                screen.getByText('Please input your username!')
            ).toBeInTheDocument();
            expect(
                screen.getByText('Please input your password!')
            ).toBeInTheDocument();
        });
    });

    test('handles successful login', async () => {
        const user = userEvent.setup();
        const mockResponse = {
            userid: '123',
            username: 'testuser',
            token: 'mock-token',
            email: 'test@example.com',
        };

        (fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        renderLoginForm();

        const usernameInput = screen.getByLabelText('Username');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        await user.type(usernameInput, 'testuser');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('/auth/login', {
                method: 'POST',
                headers: expect.any(Headers),
                body: JSON.stringify({
                    username: 'testuser',
                    password: 'password123',
                }),
                redirect: 'follow',
            });
            expect(mockChangeUser).toHaveBeenCalledWith(mockResponse);
        });
    });

    test('handles login failure', async () => {
        const user = userEvent.setup();

        (fetch as any).mockResolvedValueOnce({
            ok: false,
        });

        renderLoginForm();

        const usernameInput = screen.getByLabelText('Username');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        await user.type(usernameInput, 'testuser');
        await user.type(passwordInput, 'wrongpassword');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockChangeAlert).toHaveBeenCalledWith({
                message: 'Error',
                description: 'Login failed',
                type: 'error',
            });
        });
    });

    test('toggles to sign up form when sign up button is clicked', async () => {
        const user = userEvent.setup();
        renderLoginForm();

        const signUpButton = screen.getByRole('button', { name: 'Sign Up' });
        await user.click(signUpButton);

        // Should show sign up form now
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Re-enter Password')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Back to Login' })
        ).toBeInTheDocument();
    });

    test('can navigate back from sign up to login form', async () => {
        const user = userEvent.setup();
        renderLoginForm();

        // Go to sign up
        const signUpButton = screen.getByRole('button', { name: 'Sign Up' });
        await user.click(signUpButton);

        // Verify we're on sign up form
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();

        // Go back to login
        const backButton = screen.getByRole('button', {
            name: 'Back to Login',
        });
        await user.click(backButton);

        // Should be back to login form
        expect(screen.getByText('Login')).toBeInTheDocument();
        // Note: The "Sign Up" text appears in both the button and the title
        // So we check for the Email field not being present instead
        expect(screen.queryByLabelText('Email')).not.toBeInTheDocument();
        expect(
            screen.queryByLabelText('Re-enter Password')
        ).not.toBeInTheDocument();
    });

    test('remember me checkbox works correctly', async () => {
        const user = userEvent.setup();
        renderLoginForm();

        const rememberCheckbox = screen.getByRole('checkbox', {
            name: 'Remember me',
        });

        // Should be checked by default (from initialValues)
        expect(rememberCheckbox).toBeChecked();

        // Uncheck it
        await user.click(rememberCheckbox);
        expect(rememberCheckbox).not.toBeChecked();

        // Check it again
        await user.click(rememberCheckbox);
        expect(rememberCheckbox).toBeChecked();
    });
});
