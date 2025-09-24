import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMarkdownEditor } from '../components/messages/hooks/useMarkdownEditor';

describe('useMarkdownEditor', () => {
    it('initializes with empty content by default', () => {
        const { result } = renderHook(() => useMarkdownEditor());
        const [state] = result.current;

        expect(state.content).toBe('');
        expect(state.isPreviewMode).toBe(false);
        expect(state.cursorPosition).toBe(0);
    });

    it('initializes with provided content', () => {
        const { result } = renderHook(() =>
            useMarkdownEditor('Initial content')
        );
        const [state] = result.current;

        expect(state.content).toBe('Initial content');
    });

    it('updates content when setContent is called', () => {
        const { result } = renderHook(() => useMarkdownEditor());

        act(() => {
            const [, actions] = result.current;
            actions.setContent('New content');
        });

        const [state] = result.current;
        expect(state.content).toBe('New content');
    });

    it('toggles preview mode', () => {
        const { result } = renderHook(() => useMarkdownEditor());

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
        const { result } = renderHook(() => useMarkdownEditor('Some content'));

        act(() => {
            const [, actions] = result.current;
            actions.clear();
        });

        const [state] = result.current;
        expect(state.content).toBe('');
        expect(state.cursorPosition).toBe(0);
    });

    it('provides formatting actions', () => {
        const { result } = renderHook(() => useMarkdownEditor());
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
