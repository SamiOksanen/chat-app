import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Typography } from 'antd';

const { Text } = Typography;

interface MessageRendererProps {
    content: string;
    style?: React.CSSProperties;
    className?: string;
}

const MessageRenderer: React.FC<MessageRendererProps> = ({
    content,
    style,
    className,
}) => {
    // If content doesn't contain markdown syntax, render as plain text for performance
    const hasMarkdownSyntax = /[*_~`#[\]()>-]|(1.)/.test(content);
    const baseStyle = {
        width: 'fit-content',
    };

    if (!hasMarkdownSyntax) {
        return (
            <div style={{ ...baseStyle, ...style }} className={className}>
                <Text>{content}</Text>
            </div>
        );
    }

    return (
        <div style={{ ...baseStyle, ...style }} className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Custom components to match Ant Design styling
                    p: ({ children }) => <Text>{children}</Text>,
                    strong: ({ children }) => <Text strong>{children}</Text>,
                    em: ({ children }) => <Text italic>{children}</Text>,
                    del: ({ children }) => <Text delete>{children}</Text>,
                    code: ({ children }) => <Text code>{children}</Text>,
                    h1: ({ children }) => (
                        <Text
                            strong
                            style={{ fontSize: '1.5em', display: 'block' }}
                        >
                            {children}
                        </Text>
                    ),
                    h2: ({ children }) => (
                        <Text
                            strong
                            style={{ fontSize: '1.3em', display: 'block' }}
                        >
                            {children}
                        </Text>
                    ),
                    h3: ({ children }) => (
                        <Text
                            strong
                            style={{ fontSize: '1.1em', display: 'block' }}
                        >
                            {children}
                        </Text>
                    ),
                    h4: ({ children }) => (
                        <Text
                            strong
                            style={{ fontSize: '1em', display: 'block' }}
                        >
                            {children}
                        </Text>
                    ),
                    h5: ({ children }) => (
                        <Text
                            strong
                            style={{ fontSize: '0.9em', display: 'block' }}
                        >
                            {children}
                        </Text>
                    ),
                    h6: ({ children }) => (
                        <Text
                            strong
                            style={{ fontSize: '0.8em', display: 'block' }}
                        >
                            {children}
                        </Text>
                    ),
                    blockquote: ({ children }) => (
                        <div
                            style={{
                                borderLeft: '4px solid #d9d9d9',
                                paddingLeft: '16px',
                                margin: '8px 0',
                                fontStyle: 'italic',
                                color: '#666',
                            }}
                        >
                            {children}
                        </div>
                    ),
                    ul: ({ children }) => (
                        <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol style={{ paddingLeft: '20px', margin: '8px 0' }}>
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li style={{ margin: '2px 0' }}>{children}</li>
                    ),
                    a: ({ href, children }) => (
                        <Text>
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#1890ff' }}
                            >
                                {children}
                            </a>
                        </Text>
                    ),
                    pre: ({ children }) => (
                        <pre
                            style={{
                                background: '#f5f5f5',
                                padding: '12px',
                                borderRadius: '4px',
                                border: '1px solid #d9d9d9',
                                overflow: 'auto',
                                fontSize: '0.9em',
                                margin: '8px 0',
                            }}
                        >
                            {children}
                        </pre>
                    ),
                    table: ({ children }) => (
                        <table
                            style={{
                                border: '1px solid #d9d9d9',
                                borderCollapse: 'collapse',
                                margin: '8px 0',
                            }}
                        >
                            {children}
                        </table>
                    ),
                    th: ({ children }) => (
                        <th
                            style={{
                                border: '1px solid #d9d9d9',
                                padding: '8px 12px',
                                background: '#f5f5f5',
                                fontWeight: 'bold',
                                textAlign: 'left',
                            }}
                        >
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td
                            style={{
                                border: '1px solid #d9d9d9',
                                padding: '8px 12px',
                            }}
                        >
                            {children}
                        </td>
                    ),
                    hr: () => (
                        <hr
                            style={{
                                border: 'none',
                                borderTop: '1px solid #d9d9d9',
                                margin: '16px 0',
                            }}
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MessageRenderer;
