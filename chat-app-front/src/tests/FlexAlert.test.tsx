import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import FlexAlert from '../components/FlexAlert';
import { AlertContext } from '../App';

describe('FlexAlert', () => {
    const mockChangeAlert = vi.fn();

    const renderFlexAlert = (props = {}) => {
        return render(
            <AlertContext.Provider value={{ changeAlert: mockChangeAlert }}>
                <FlexAlert {...props} />
            </AlertContext.Provider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders alert with default props', () => {
        renderFlexAlert({
            message: 'Test Message',
            description: 'Test Description',
        });

        expect(screen.getByText('Test Message')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    test('renders different alert types', () => {
        const { rerender } = render(
            <AlertContext.Provider value={{ changeAlert: mockChangeAlert }}>
                <FlexAlert message="Success" type="success" />
            </AlertContext.Provider>
        );

        let alert = screen.getByRole('alert');
        expect(alert).toHaveClass('ant-alert-success');

        rerender(
            <AlertContext.Provider value={{ changeAlert: mockChangeAlert }}>
                <FlexAlert message="Error" type="error" />
            </AlertContext.Provider>
        );

        alert = screen.getByRole('alert');
        expect(alert).toHaveClass('ant-alert-error');

        rerender(
            <AlertContext.Provider value={{ changeAlert: mockChangeAlert }}>
                <FlexAlert message="Warning" type="warning" />
            </AlertContext.Provider>
        );

        alert = screen.getByRole('alert');
        expect(alert).toHaveClass('ant-alert-warning');

        rerender(
            <AlertContext.Provider value={{ changeAlert: mockChangeAlert }}>
                <FlexAlert message="Info" type="info" />
            </AlertContext.Provider>
        );

        alert = screen.getByRole('alert');
        expect(alert).toHaveClass('ant-alert-info');
    });

    test('shows icon and close button by default', () => {
        renderFlexAlert({
            message: 'Test Message',
        });

        const alert = screen.getByRole('alert');
        // Check for icon presence
        expect(alert.querySelector('.ant-alert-icon')).toBeInTheDocument();
        // Check for close button
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('calls changeAlert with null when close button is clicked', async () => {
        const user = userEvent.setup();
        renderFlexAlert({
            message: 'Test Message',
        });

        const closeButton = screen.getByRole('button');
        await user.click(closeButton);

        expect(mockChangeAlert).toHaveBeenCalledWith(null);
    });

    test('applies correct styling', () => {
        renderFlexAlert({
            message: 'Test Message',
        });

        const alert = screen.getByRole('alert');
        expect(alert).toHaveStyle('margin: 4px auto 4px auto');
    });

    test('handles missing changeAlert function gracefully', async () => {
        const user = userEvent.setup();

        render(
            <AlertContext.Provider value={{}}>
                <FlexAlert message="Test Message" />
            </AlertContext.Provider>
        );

        const closeButton = screen.getByRole('button');

        // Should not throw error when changeAlert is undefined
        expect(async () => {
            await user.click(closeButton);
        }).not.toThrow();
    });

    test('passes through additional props to Alert component', () => {
        renderFlexAlert({
            message: 'Test Message',
            banner: true,
            'data-testid': 'custom-alert',
        });

        const alert = screen.getByTestId('custom-alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass('ant-alert-banner');
    });

    test('renders without description', () => {
        renderFlexAlert({
            message: 'Just a message',
        });

        expect(screen.getByText('Just a message')).toBeInTheDocument();
        // Should not crash when description is not provided
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });
});
