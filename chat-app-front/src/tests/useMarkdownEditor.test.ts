import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useMarkdownEditor } from '../components/messages/hooks/useMarkdownEditor';

describe('useMarkdownEditor', () => {
    const mockOnChange = vi.fn();

    it('initializes with empty content by default', () => {
        const { result } = renderHook(() =>
            useMarkdownEditor('', mockOnChange)
        );
        const [state] = result.current;

        expect(state.content).toBe('');
        expect(state.isPreviewMode).toBe(false);
    });

    it('initializes with provided content', () => {
        const { result } = renderHook(() =>
            useMarkdownEditor('Initial content', mockOnChange)
        );
        const [state] = result.current;

        expect(state.content).toBe('Initial content');
    });

    it('updates content when onChange is called', () => {
        const result = renderHook(() => useMarkdownEditor('', mockOnChange));

        act(() => {
            const [, actions] = result.result.current;
            actions.setContent('New content');
        });

        expect(mockOnChange).toHaveBeenCalledWith('New content');
    });

    it('toggles preview mode', () => {
        const { result } = renderHook(() =>
            useMarkdownEditor('', mockOnChange)
        );

        act(() => {
            const [, actions] = result.current;
            actions.togglePreview();
        });

        let [state] = result.current;
        expect(state.isPreviewMode).toBe(true);

        act(() => {
            const [, actions] = result.current;
            actions.togglePreview();
        });

        [state] = result.current;
        expect(state.isPreviewMode).toBe(false);
    });

    it('clears content', () => {
        const { result } = renderHook(() =>
            useMarkdownEditor('Some content', mockOnChange)
        );

        act(() => {
            const [, actions] = result.current;
            actions.clear();
        });

        expect(mockOnChange).toHaveBeenCalledWith('');
    });

    it('provides formatting actions', () => {
        const { result } = renderHook(() =>
            useMarkdownEditor('', mockOnChange)
        );
        const [, actions] = result.current;

        expect(typeof actions.bold).toBe('function');
        expect(typeof actions.italic).toBe('function');
        expect(typeof actions.strikethrough).toBe('function');
        expect(typeof actions.heading).toBe('function');
        expect(typeof actions.bulletList).toBe('function');
        expect(typeof actions.numberedList).toBe('function');
        expect(typeof actions.blockquote).toBe('function');
        expect(typeof actions.link).toBe('function');
    });
});
