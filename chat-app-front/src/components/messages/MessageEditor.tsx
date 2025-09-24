import React, { useRef, useEffect, useCallback } from 'react';
import { Input, Card, Space } from 'antd';
import { useMarkdownEditor } from './hooks/useMarkdownEditor';
import MarkdownToolbar from './MarkdownToolbar';
import MessageRenderer from './MessageRenderer';
import { TextAreaRef } from 'antd/es/input/TextArea';

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
    const textareaRef = useRef<TextAreaRef>(null);
    const [editorState, actions] = useMarkdownEditor(value);

    // Only sync when the external value changes and it's different from internal state
    // Use a ref to track if the change is coming from internal state to avoid loops
    const isInternalChange = useRef(false);

    useEffect(() => {
        if (!isInternalChange.current && value !== editorState.content) {
            actions.setContent(value);
        }
        isInternalChange.current = false;
    }, [value, editorState.content, actions]);

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
            const newValue = e.target.value;
            isInternalChange.current = true;
            actions.setContent(newValue);
            onChange(newValue);
        },
        [actions, onChange]
    );

    // Focus handling for toolbar actions and content sync
    useEffect(() => {
        if (textareaRef.current?.resizableTextArea?.textArea) {
            const textarea = textareaRef.current.resizableTextArea.textArea;
            // Store reference for the hook to use
            Object.assign(actions, { textareaRef: { current: textarea } });
        }
        // Also notify parent when content changes via toolbar actions
        if (editorState.content !== value) {
            isInternalChange.current = true;
            onChange(editorState.content);
        }
    }, [actions, editorState.content, value, onChange]);

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
                        setTimeout(() => {
                            if (
                                textareaRef.current &&
                                typeof textareaRef.current.focus === 'function'
                            ) {
                                textareaRef.current.focus();
                            }
                        }, 100);
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
