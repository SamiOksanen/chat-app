import React, { useRef, useEffect, useCallback } from 'react';
import { Input, Card, Space } from 'antd';
import { useMarkdownEditor } from './hooks/useMarkdownEditor';
import MarkdownToolbar from './MarkdownToolbar';
import MessageRenderer from './MessageRenderer';

const { TextArea } = Input;

interface MessageEditorProps {
    value: string;
    onChange: (value: string) => void;
    onPressEnter?: () => void;
    placeholder?: string;
    style?: React.CSSProperties;
    autoFocus?: boolean;
    disabled?: boolean;
    showToolbar?: boolean;
    compactToolbar?: boolean;
}

const MessageEditor: React.FC<MessageEditorProps> = ({
    value,
    onChange,
    onPressEnter,
    placeholder = 'Write Message...',
    style,
    autoFocus = false,
    disabled = false,
    showToolbar = true,
    compactToolbar = false,
}) => {
    const textareaRef = useRef<{
        resizableTextArea?: { textArea: HTMLTextAreaElement };
        focus?: () => void;
    }>(null);
    const [editorState, actions] = useMarkdownEditor(value);

    // Sync external value changes with internal state
    useEffect(() => {
        if (value !== editorState.content) {
            actions.setContent(value);
        }
    }, [value, editorState.content, actions]);

    // Notify parent of content changes
    useEffect(() => {
        if (editorState.content !== value) {
            onChange(editorState.content);
        }
    }, [editorState.content, value, onChange]);

    // Handle keyboard shortcuts
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'b':
                        e.preventDefault();
                        actions.bold();
                        break;
                    case 'i':
                        e.preventDefault();
                        actions.italic();
                        break;
                    case 'k':
                        e.preventDefault();
                        actions.link();
                        break;
                    default:
                        break;
                }
            }

            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onPressEnter?.();
            }
        },
        [actions, onPressEnter]
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            actions.setContent(e.target.value);
        },
        [actions]
    );

    // Focus handling for toolbar actions
    useEffect(() => {
        if (textareaRef.current?.resizableTextArea?.textArea) {
            const textarea = textareaRef.current.resizableTextArea.textArea;
            // Store reference for the hook to use
            Object.assign(actions, { textareaRef: { current: textarea } });
        }
    }, [actions]);

    const editorContent = (
        <div style={{ position: 'relative' }}>
            {editorState.isPreviewMode ? (
                <Card
                    size="small"
                    style={{
                        minHeight: '32px',
                        cursor: 'text',
                    }}
                    onClick={() => {
                        actions.togglePreview();
                        setTimeout(() => textareaRef.current?.focus(), 100);
                    }}
                >
                    {editorState.content ? (
                        <MessageRenderer content={editorState.content} />
                    ) : (
                        <span style={{ color: '#bfbfbf', fontStyle: 'italic' }}>
                            {placeholder}
                        </span>
                    )}
                </Card>
            ) : (
                <TextArea
                    ref={textareaRef}
                    value={editorState.content}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    autoSize={{ minRows: 1, maxRows: 6 }}
                    style={style}
                    autoFocus={autoFocus}
                    disabled={disabled}
                />
            )}
        </div>
    );

    if (!showToolbar) {
        return editorContent;
    }

    return (
        <div>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <MarkdownToolbar
                    actions={actions}
                    isPreviewMode={editorState.isPreviewMode}
                    compact={compactToolbar}
                />
                {editorContent}
            </Space>
        </div>
    );
};

export default MessageEditor;
