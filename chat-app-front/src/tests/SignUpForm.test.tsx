import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import SignUpForm from '../components/SignUpForm';
import { AlertContext, UserContext } from '../App';

// Mock fetch globally
global.fetch = vi.fn();

describe('SignUpForm', () => {
    const mockChangeUser = vi.fn();
    const mockChangeAlert = vi.fn();
    const mockShowLoginForm = vi.fn();

    const renderSignUpForm = () => {
        return render(
            <UserContext.Provider value={{ changeUser: mockChangeUser }}>
                <AlertContext.Provider value={{ changeAlert: mockChangeAlert }}>
                    <SignUpForm showLoginForm={mockShowLoginForm} />
                </AlertContext.Provider>
            </UserContext.Provider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (fetch as any).mockClear();
    });

    test('renders sign up form correctly', () => {
        renderSignUpForm();

        expect(screen.getByText('Chat App')).toBeInTheDocument();
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Re-enter Password')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Submit' })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Back to Login' })
        ).toBeInTheDocument();
        expect(
            screen.getByText('Chat App ©2022 Created by Sami Oksanen')
        ).toBeInTheDocument();
    });

    test('shows validation errors for empty required fields', async () => {
        const user = userEvent.setup();
        renderSignUpForm();

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        await user.click(submitButton);

        await waitFor(() => {
            expect(
                screen.getByText('Please input your username!')
            ).toBeInTheDocument();
            expect(
                screen.getByText('Please input your email!')
            ).toBeInTheDocument();
            expect(
                screen.getByText('Please input your password!')
            ).toBeInTheDocument();
            expect(
                screen.getByText('Please re-enter your password!')
            ).toBeInTheDocument();
        });
    });

    test('shows validation error for invalid email format', async () => {
        const user = userEvent.setup();
        renderSignUpForm();

        const emailInput = screen.getByLabelText('Email');
        await user.type(emailInput, 'invalid-email');

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        await user.click(submitButton);

        await waitFor(() => {
            expect(
                screen.getByText('Please give a valid email address!')
            ).toBeInTheDocument();
        });
    });

    test('handles successful sign up', async () => {
        const user = userEvent.setup();
        const mockResponse = {
            userid: '123',
            username: 'newuser',
            token: 'mock-token',
            email: 'new@example.com',
        };

        (fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        renderSignUpForm();

        const usernameInput = screen.getByLabelText('Username');
        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const confirmPasswordInput = screen.getByLabelText('Re-enter Password');
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        await user.type(usernameInput, 'newuser');
        await user.type(emailInput, 'new@example.com');
        await user.type(passwordInput, 'password123');
        await user.type(confirmPasswordInput, 'password123');
        await user.click(submitButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('/auth/signup', {
                method: 'POST',
                headers: expect.any(Headers),
                body: JSON.stringify({
                    username: 'newuser',
                    email: 'new@example.com',
                    password: 'password123',
                    confirmPassword: 'password123',
                }),
                redirect: 'follow',
            });
            expect(mockChangeUser).toHaveBeenCalledWith(mockResponse);
        });
    });

    test('handles sign up failure', async () => {
        const user = userEvent.setup();

        (fetch as any).mockResolvedValueOnce({
            ok: false,
        });

        renderSignUpForm();

        const usernameInput = screen.getByLabelText('Username');
        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const confirmPasswordInput = screen.getByLabelText('Re-enter Password');
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        await user.type(usernameInput, 'newuser');
        await user.type(emailInput, 'new@example.com');
        await user.type(passwordInput, 'password123');
        await user.type(confirmPasswordInput, 'password123');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockChangeAlert).toHaveBeenCalledWith({
                message: 'Error',
                description: 'Sign up failed',
                type: 'error',
            });
        });
    });

    test('calls showLoginForm when Back to Login button is clicked', async () => {
        const user = userEvent.setup();
        renderSignUpForm();

        const backButton = screen.getByRole('button', {
            name: 'Back to Login',
        });
        await user.click(backButton);

        expect(mockShowLoginForm).toHaveBeenCalledTimes(1);
    });

    test('handles network error during sign up', async () => {
        const user = userEvent.setup();
        const networkError = new Error('Network error');

        (fetch as any).mockRejectedValueOnce(networkError);

        renderSignUpForm();

        const usernameInput = screen.getByLabelText('Username');
        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const confirmPasswordInput = screen.getByLabelText('Re-enter Password');
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        await user.type(usernameInput, 'newuser');
        await user.type(emailInput, 'new@example.com');
        await user.type(passwordInput, 'password123');
        await user.type(confirmPasswordInput, 'password123');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockChangeAlert).toHaveBeenCalledWith({
                message: 'Error',
                description: 'Network error',
                type: 'error',
            });
        });
    });
});
