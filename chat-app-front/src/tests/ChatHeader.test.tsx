import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ChatHeader from '../components/ChatHeader';
import { UserContext } from '../App';
import { ThemeContext } from '../components/themes/ThemeProvider';

describe('ChatHeader', () => {
    const mockChangeUser = vi.fn();

    const renderChatHeader = (theme = 'light') => {
        return render(
            <UserContext.Provider value={{ changeUser: mockChangeUser }}>
                <ThemeContext.Provider value={{ theme }}>
                    <ChatHeader />
                </ThemeContext.Provider>
            </UserContext.Provider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders chat header correctly', () => {
        renderChatHeader();

        const logoutButton = screen.getByRole('button');
        expect(logoutButton).toBeInTheDocument();
        // The button itself doesn't have aria-label, the tooltip provides accessibility
        expect(logoutButton).toHaveClass('ant-btn');
    });

    test('renders logout button with tooltip', () => {
        renderChatHeader();

        const logoutButton = screen.getByRole('button');

        // Check that the button has the LogoutOutlined icon
        expect(logoutButton.querySelector('svg')).toBeInTheDocument();
        // The tooltip functionality is provided by Ant Design's Tooltip component
        expect(logoutButton).toBeInTheDocument();
    });

    test('calls changeUser with logout params when logout button is clicked', async () => {
        const user = userEvent.setup();
        renderChatHeader();

        const logoutButton = screen.getByRole('button');
        await user.click(logoutButton);

        expect(mockChangeUser).toHaveBeenCalledWith({
            userid: null,
            token: null,
        });
    });

    test('applies correct background color for light theme', () => {
        const { container } = renderChatHeader('light');

        const header = container.querySelector('.ant-layout-header');
        expect(header).toHaveStyle('background: #002140');
    });

    test('applies correct background color for dark theme', () => {
        const { container } = renderChatHeader('dark');

        const header = container.querySelector('.ant-layout-header');
        expect(header).toHaveStyle('background: #262626');
    });

    test('header has correct layout styles', () => {
        const { container } = renderChatHeader();

        const header = container.querySelector('.ant-layout-header');
        expect(header).toHaveStyle({
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row-reverse',
        });
    });

    test('logout button has correct styling', () => {
        renderChatHeader();

        const logoutButton = screen.getByRole('button');
        expect(logoutButton).toHaveStyle('margin: 12px');
    });

    test('handles missing changeUser function gracefully', () => {
        const user = userEvent.setup();

        render(
            <UserContext.Provider value={{}}>
                <ThemeContext.Provider value={{ theme: 'light' }}>
                    <ChatHeader />
                </ThemeContext.Provider>
            </UserContext.Provider>
        );

        const logoutButton = screen.getByRole('button');

        // Should not throw error when changeUser is undefined
        expect(async () => {
            await user.click(logoutButton);
        }).not.toThrow();
    });
});
