import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { useContext } from 'react';
import ThemeProvider, {
    ThemeContext,
} from '../components/themes/ThemeProvider';

// Mock component to test theme context
const TestComponent = () => {
    const { theme, changeTheme } = useContext(ThemeContext);
    return (
        <div>
            <div data-testid="theme-display">Theme: {theme}</div>
            <button onClick={() => changeTheme?.('dark')}>
                Change to Dark
            </button>
            <button onClick={() => changeTheme?.('light')}>
                Change to Light
            </button>
            <button onClick={() => changeTheme?.('compact')}>
                Change to Compact
            </button>
        </div>
    );
};

// Mock window.location.reload
Object.defineProperty(window, 'location', {
    value: {
        reload: vi.fn(),
    },
    writable: true,
});

describe('ThemeProvider', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        vi.clearAllMocks();
    });

    test('provides default light theme when no theme in localStorage', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(screen.getByTestId('theme-display')).toHaveTextContent(
            'Theme: light'
        );
    });

    test('reads theme from localStorage', () => {
        localStorage.setItem('theme', 'dark');

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(screen.getByTestId('theme-display')).toHaveTextContent(
            'Theme: dark'
        );
    });

    test('changeTheme updates localStorage and reloads page', async () => {
        const user = userEvent.setup();
        const reloadSpy = vi.spyOn(window.location, 'reload');

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        const darkButton = screen.getByText('Change to Dark');
        await user.click(darkButton);

        expect(localStorage.getItem('theme')).toBe('dark');
        expect(reloadSpy).toHaveBeenCalledTimes(1);
    });

    test('changeTheme works with different theme values', async () => {
        const user = userEvent.setup();
        const reloadSpy = vi.spyOn(window.location, 'reload');

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        // Test compact theme
        const compactButton = screen.getByText('Change to Compact');
        await user.click(compactButton);

        expect(localStorage.getItem('theme')).toBe('compact');
        expect(reloadSpy).toHaveBeenCalledTimes(1);

        // Reset mock
        reloadSpy.mockClear();

        // Test light theme
        const lightButton = screen.getByText('Change to Light');
        await user.click(lightButton);

        expect(localStorage.getItem('theme')).toBe('light');
        expect(reloadSpy).toHaveBeenCalledTimes(1);
    });

    test('renders children correctly', () => {
        render(
            <ThemeProvider>
                <div data-testid="child">Test Child</div>
            </ThemeProvider>
        );

        expect(screen.getByTestId('child')).toHaveTextContent('Test Child');
    });

    test('provides theme context with correct values', () => {
        localStorage.setItem('theme', 'compact');

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(screen.getByTestId('theme-display')).toHaveTextContent(
            'Theme: compact'
        );

        // Buttons should be present, indicating changeTheme function is available
        expect(screen.getByText('Change to Dark')).toBeInTheDocument();
        expect(screen.getByText('Change to Light')).toBeInTheDocument();
        expect(screen.getByText('Change to Compact')).toBeInTheDocument();
    });

    test('handles invalid theme values gracefully', () => {
        localStorage.setItem('theme', 'invalid-theme');

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        // Should display the invalid theme value as stored in localStorage
        expect(screen.getByTestId('theme-display')).toHaveTextContent(
            'Theme: invalid-theme'
        );
    });
});
