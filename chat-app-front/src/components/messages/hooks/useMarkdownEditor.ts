import { useState, useCallback, useRef } from 'react';

export interface MarkdownEditorState {
    content: string;
    isPreviewMode: boolean;
    cursorPosition: number;
}

export interface MarkdownEditorActions {
    setContent: (content: string) => void;
    togglePreview: () => void;
    insertText: (text: string, cursorOffset?: number) => void;
    wrapText: (prefix: string, suffix?: string) => void;
    insertAtCursor: (text: string) => void;
    bold: () => void;
    italic: () => void;
    strikethrough: () => void;
    heading: (level: number) => void;
    bulletList: () => void;
    numberedList: () => void;
    blockquote: () => void;
    link: (url?: string, title?: string) => void;
    clear: () => void;
}

export const useMarkdownEditor = (
    initialContent: string = ''
): [MarkdownEditorState, MarkdownEditorActions] => {
    const [content, setContentState] = useState<string>(initialContent);
    const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
    const [cursorPosition, setCursorPosition] = useState<number>(0);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const setContent = useCallback((newContent: string) => {
        setContentState(newContent);
    }, []);

    const togglePreview = useCallback(() => {
        setIsPreviewMode((prev) => !prev);
    }, []);

    const insertText = useCallback(
        (text: string, cursorOffset: number = 0) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newContent =
                content.substring(0, start) + text + content.substring(end);

            setContentState(newContent);

            // Set cursor position after insertion
            setTimeout(() => {
                const newPosition = start + text.length + cursorOffset;
                textarea.setSelectionRange(newPosition, newPosition);
                setCursorPosition(newPosition);
            }, 0);
        },
        [content]
    );

    const wrapText = useCallback(
        (prefix: string, suffix: string = prefix) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = content.substring(start, end);

            if (selectedText) {
                // Wrap selected text
                const wrappedText = `${prefix}${selectedText}${suffix}`;
                const newContent =
                    content.substring(0, start) +
                    wrappedText +
                    content.substring(end);
                setContentState(newContent);

                setTimeout(() => {
                    textarea.setSelectionRange(
                        start + prefix.length,
                        start + prefix.length + selectedText.length
                    );
                }, 0);
            } else {
                // Insert wrapper and place cursor between
                insertText(`${prefix}${suffix}`, -suffix.length);
            }
        },
        [content, insertText]
    );

    const insertAtCursor = useCallback(
        (text: string) => {
            insertText(text);
        },
        [insertText]
    );

    const bold = useCallback(() => {
        wrapText('**');
    }, [wrapText]);

    const italic = useCallback(() => {
        wrapText('*');
    }, [wrapText]);

    const strikethrough = useCallback(() => {
        wrapText('~~');
    }, [wrapText]);

    const heading = useCallback(
        (level: number) => {
            const hashes = '#'.repeat(Math.max(1, Math.min(6, level)));
            const textarea = textareaRef.current;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const lineStart = content.lastIndexOf('\n', start - 1) + 1;
            const lineEnd = content.indexOf('\n', start);
            const actualLineEnd = lineEnd === -1 ? content.length : lineEnd;
            const currentLine = content.substring(lineStart, actualLineEnd);

            // Remove existing heading prefix if present
            const cleanLine = currentLine.replace(/^#+\s*/, '');
            const newLine = `${hashes} ${cleanLine}`;

            const newContent =
                content.substring(0, lineStart) +
                newLine +
                content.substring(actualLineEnd);
            setContentState(newContent);

            setTimeout(() => {
                const newPosition = lineStart + newLine.length;
                textarea.setSelectionRange(newPosition, newPosition);
            }, 0);
        },
        [content]
    );

    const bulletList = useCallback(() => {
        insertAtCursor('- ');
    }, [insertAtCursor]);

    const numberedList = useCallback(() => {
        insertAtCursor('1. ');
    }, [insertAtCursor]);

    const blockquote = useCallback(() => {
        insertAtCursor('> ');
    }, [insertAtCursor]);

    const link = useCallback(
        (url: string = '', title: string = '') => {
            const linkText = title || 'Link text';
            const linkUrl = url || 'https://';
            wrapText(`[${linkText}](`, `${linkUrl})`);
        },
        [wrapText]
    );

    const clear = useCallback(() => {
        setContentState('');
        setCursorPosition(0);
    }, []);

    return [
        { content, isPreviewMode, cursorPosition },
        {
            setContent,
            togglePreview,
            insertText,
            wrapText,
            insertAtCursor,
            bold,
            italic,
            strikethrough,
            heading,
            bulletList,
            numberedList,
            blockquote,
            link,
            clear,
        },
    ];
};

export default useMarkdownEditor;
