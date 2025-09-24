import { useState, useCallback } from 'react';

export interface MarkdownEditorState {
    content: string;
    isPreviewMode: boolean;
}

export interface MarkdownEditorActions {
    setContent: (content: string) => void;
    togglePreview: () => void;
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
    value: string,
    onChange: (value: string) => void
): [MarkdownEditorState, MarkdownEditorActions] => {
    const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

    const setContent = useCallback(
        (newContent: string) => {
            onChange(newContent);
        },
        [onChange]
    );

    const togglePreview = useCallback(() => {
        setIsPreviewMode((prev) => !prev);
    }, []);

    const wrapText = useCallback(
        (prefix: string, suffix: string = prefix) => {
            const textarea = document.querySelector(
                'textarea[placeholder="Write Message..."]'
            ) as HTMLTextAreaElement;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = value.substring(start, end);

            if (selectedText) {
                // Wrap selected text
                const wrappedText = `${prefix}${selectedText}${suffix}`;
                const newContent =
                    value.substring(0, start) +
                    wrappedText +
                    value.substring(end);
                onChange(newContent);

                // Restore selection after React re-renders
                setTimeout(() => {
                    textarea.focus();
                    textarea.setSelectionRange(
                        start + prefix.length,
                        start + prefix.length + selectedText.length
                    );
                }, 0);
            } else {
                // Insert wrapper and place cursor between
                const insertedText = `${prefix}${suffix}`;
                const newContent =
                    value.substring(0, start) +
                    insertedText +
                    value.substring(end);
                onChange(newContent);

                // Place cursor between markers
                setTimeout(() => {
                    const newPosition = start + prefix.length;
                    textarea.setSelectionRange(newPosition, newPosition);
                }, 0);
            }
        },
        [value, onChange]
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
            const textarea = document.querySelector(
                'textarea[placeholder="Write Message..."]'
            ) as HTMLTextAreaElement;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const lineStart = value.lastIndexOf('\n', start - 1) + 1;
            const lineEnd = value.indexOf('\n', start);
            const actualLineEnd = lineEnd === -1 ? value.length : lineEnd;
            const currentLine = value.substring(lineStart, actualLineEnd);

            const hashes = '#'.repeat(Math.max(1, Math.min(6, level)));
            const cleanLine = currentLine.replace(/^#+\s*/, '');
            const newLine = `${hashes} ${cleanLine}`;

            const newContent =
                value.substring(0, lineStart) +
                newLine +
                value.substring(actualLineEnd);
            onChange(newContent);

            setTimeout(() => {
                const newPosition = lineStart + newLine.length;
                textarea.setSelectionRange(newPosition, newPosition);
            }, 0);
        },
        [value, onChange]
    );

    const bulletList = useCallback(() => {
        const textarea = document.querySelector(
            'textarea[placeholder="Write Message..."]'
        ) as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const newContent =
            value.substring(0, start) + '- ' + value.substring(start);
        onChange(newContent);

        setTimeout(() => {
            const newPosition = start + 2;
            textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
    }, [value, onChange]);

    const numberedList = useCallback(() => {
        const textarea = document.querySelector(
            'textarea[placeholder="Write Message..."]'
        ) as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const newContent =
            value.substring(0, start) + '1. ' + value.substring(start);
        onChange(newContent);

        setTimeout(() => {
            const newPosition = start + 3;
            textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
    }, [value, onChange]);

    const blockquote = useCallback(() => {
        const textarea = document.querySelector(
            'textarea[placeholder="Write Message..."]'
        ) as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const newContent =
            value.substring(0, start) + '> ' + value.substring(start);
        onChange(newContent);

        setTimeout(() => {
            const newPosition = start + 2;
            textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
    }, [value, onChange]);

    const link = useCallback(
        (url: string = '', title: string = '') => {
            const linkText = title || 'Link text';
            const linkUrl = url || 'https://';
            wrapText(`[${linkText}](`, `${linkUrl})`);
        },
        [wrapText]
    );

    const clear = useCallback(() => {
        onChange('');
    }, [onChange]);

    return [
        { content: value, isPreviewMode },
        {
            setContent,
            togglePreview,
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
