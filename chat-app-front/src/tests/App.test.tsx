import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders app without crashing', () => {
    render(<App />);
    expect(document.body).toBeInTheDocument();
});

test('renders login form when no user is authenticated', () => {
    render(<App />);

    // Check for login form elements
    expect(screen.getByText('Chat App')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
});
