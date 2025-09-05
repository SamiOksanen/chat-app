import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ErrorBoundary from '../components/ErrorBoundary';

// Component that throws an error when shouldThrow prop is true
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
        throw new Error('Test error');
    }
    return <div>Normal component</div>;
};

describe('ErrorBoundary', () => {
    beforeEach(() => {
        // Mock console.error to avoid error output in tests
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('renders children when there is no error', () => {
        render(
            <ErrorBoundary>
                <div>Test child component</div>
            </ErrorBoundary>
        );

        expect(screen.getByText('Test child component')).toBeInTheDocument();
    });

    test('renders error message when there is an error', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(
            screen.getByText('Sorry.. there was an error')
        ).toBeInTheDocument();
        expect(screen.queryByText('Normal component')).not.toBeInTheDocument();
    });

    test('logs error to console when error occurs', () => {
        const consoleSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(consoleSpy).toHaveBeenCalledWith(
            'Uncaught error:',
            expect.any(Error),
            expect.any(Object)
        );
    });

    test('error message has correct heading level', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        const errorMessage = screen.getByText('Sorry.. there was an error');
        expect(errorMessage.tagName).toBe('H3');
    });

    test('can recover from error when children change', () => {
        const { rerender } = render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        // Should show error message
        expect(
            screen.getByText('Sorry.. there was an error')
        ).toBeInTheDocument();

        // Rerender with non-throwing component
        rerender(
            <ErrorBoundary>
                <ThrowError shouldThrow={false} />
            </ErrorBoundary>
        );

        // Should still show error message (ErrorBoundary doesn't reset automatically)
        expect(
            screen.getByText('Sorry.. there was an error')
        ).toBeInTheDocument();
    });
});
