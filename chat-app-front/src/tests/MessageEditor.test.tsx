import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MessageEditor from '../components/messages/MessageEditor';

describe('MessageEditor', () => {
    it('renders with placeholder text', () => {
        const mockOnChange = vi.fn();
        render(
            <MessageEditor
                value=""
                onChange={mockOnChange}
                placeholder="Type a message"
            />
        );

        expect(
            screen.getByPlaceholderText('Type a message')
        ).toBeInTheDocument();
    });

    it('calls onChange when text is entered', () => {
        const mockOnChange = vi.fn();
        render(<MessageEditor value="" onChange={mockOnChange} />);

        const textArea = screen.getByRole('textbox');
        fireEvent.change(textArea, { target: { value: 'Hello World' } });

        expect(mockOnChange).toHaveBeenCalledWith('Hello World');
    });

    it('calls onPressEnter when Enter is pressed', () => {
        const mockOnPressEnter = vi.fn();
        const mockOnChange = vi.fn();
        render(
            <MessageEditor
                value="test message"
                onChange={mockOnChange}
                onPressEnter={mockOnPressEnter}
            />
        );

        const textArea = screen.getByRole('textbox');
        fireEvent.keyDown(textArea, { key: 'Enter', code: 'Enter' });

        expect(mockOnPressEnter).toHaveBeenCalled();
    });

    it('shows toolbar when showToolbar is true', () => {
        const mockOnChange = vi.fn();
        render(
            <MessageEditor
                value=""
                onChange={mockOnChange}
                showToolbar={true}
            />
        );

        expect(
            screen.getByRole('button', { name: /bold/i })
        ).toBeInTheDocument();
    });

    it('hides toolbar when showToolbar is false', () => {
        const mockOnChange = vi.fn();
        render(
            <MessageEditor
                value=""
                onChange={mockOnChange}
                showToolbar={false}
            />
        );

        expect(
            screen.queryByRole('button', { name: /bold/i })
        ).not.toBeInTheDocument();
    });

    it('toggles preview mode', () => {
        const mockOnChange = vi.fn();
        render(
            <MessageEditor
                value="**bold text**"
                onChange={mockOnChange}
                showToolbar={true}
            />
        );

        const previewButton = screen.getByRole('button', { name: /preview/i });
        fireEvent.click(previewButton);

        expect(
            screen.getByRole('button', { name: /edit/i })
        ).toBeInTheDocument();
    });
});
