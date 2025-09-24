import React from 'react';
import { Button, Space, Tooltip, Dropdown } from 'antd';
import {
    BoldOutlined,
    ItalicOutlined,
    StrikethroughOutlined,
    UnorderedListOutlined,
    OrderedListOutlined,
    LinkOutlined,
    EyeOutlined,
    EditOutlined,
    ClearOutlined,
    MenuOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { MarkdownEditorActions } from './hooks/useMarkdownEditor';

interface MarkdownToolbarProps {
    actions: MarkdownEditorActions;
    isPreviewMode: boolean;
    size?: 'small' | 'middle' | 'large';
    compact?: boolean;
}

const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({
    actions,
    isPreviewMode,
    size = 'small',
    compact = false,
}) => {
    const headingItems: MenuProps['items'] = [
        {
            key: 'h1',
            label: 'Heading 1',
            onClick: () => actions.heading(1),
        },
        {
            key: 'h2',
            label: 'Heading 2',
            onClick: () => actions.heading(2),
        },
        {
            key: 'h3',
            label: 'Heading 3',
            onClick: () => actions.heading(3),
        },
    ];

    if (compact) {
        const compactItems: MenuProps['items'] = [
            {
                key: 'bold',
                label: 'Bold',
                icon: <BoldOutlined />,
                onClick: actions.bold,
            },
            {
                key: 'italic',
                label: 'Italic',
                icon: <ItalicOutlined />,
                onClick: actions.italic,
            },
            {
                key: 'strikethrough',
                label: 'Strikethrough',
                icon: <StrikethroughOutlined />,
                onClick: actions.strikethrough,
            },
            { type: 'divider' },
            ...headingItems,
            { type: 'divider' },
            {
                key: 'bulletList',
                label: 'Bullet List',
                icon: <UnorderedListOutlined />,
                onClick: actions.bulletList,
            },
            {
                key: 'numberedList',
                label: 'Numbered List',
                icon: <OrderedListOutlined />,
                onClick: actions.numberedList,
            },
            {
                key: 'blockquote',
                label: 'Quote',
                onClick: () => actions.blockquote(),
            },
            {
                key: 'link',
                label: 'Link',
                icon: <LinkOutlined />,
                onClick: () => actions.link(),
            },
            { type: 'divider' },
            {
                key: 'clear',
                label: 'Clear',
                icon: <ClearOutlined />,
                onClick: actions.clear,
            },
        ];

        return (
            <Space size="small">
                <Dropdown
                    menu={{ items: compactItems }}
                    placement="bottomLeft"
                    trigger={['click']}
                >
                    <Button size={size} icon={<MenuOutlined />} />
                </Dropdown>
                <Button
                    size={size}
                    icon={isPreviewMode ? <EditOutlined /> : <EyeOutlined />}
                    onClick={actions.togglePreview}
                >
                    {isPreviewMode ? 'Edit' : 'Preview'}
                </Button>
            </Space>
        );
    }

    return (
        <Space size="small" wrap>
            <Space.Compact>
                <Tooltip title="Bold (Ctrl+B)">
                    <Button
                        size={size}
                        icon={<BoldOutlined />}
                        onClick={actions.bold}
                    />
                </Tooltip>
                <Tooltip title="Italic (Ctrl+I)">
                    <Button
                        size={size}
                        icon={<ItalicOutlined />}
                        onClick={actions.italic}
                    />
                </Tooltip>
                <Tooltip title="Strikethrough">
                    <Button
                        size={size}
                        icon={<StrikethroughOutlined />}
                        onClick={actions.strikethrough}
                    />
                </Tooltip>
            </Space.Compact>

            <Dropdown
                menu={{ items: headingItems }}
                placement="bottomLeft"
                trigger={['click']}
            >
                <Button size={size}>H</Button>
            </Dropdown>

            <Space.Compact>
                <Tooltip title="Bullet List">
                    <Button
                        size={size}
                        icon={<UnorderedListOutlined />}
                        onClick={actions.bulletList}
                    />
                </Tooltip>
                <Tooltip title="Numbered List">
                    <Button
                        size={size}
                        icon={<OrderedListOutlined />}
                        onClick={actions.numberedList}
                    />
                </Tooltip>
            </Space.Compact>

            <Tooltip title="Quote">
                <Button size={size} onClick={() => actions.blockquote()}>
                    "
                </Button>
            </Tooltip>

            <Tooltip title="Link">
                <Button
                    size={size}
                    icon={<LinkOutlined />}
                    onClick={() => actions.link()}
                />
            </Tooltip>

            <Button
                size={size}
                icon={isPreviewMode ? <EditOutlined /> : <EyeOutlined />}
                onClick={actions.togglePreview}
            >
                {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>

            <Tooltip title="Clear All">
                <Button
                    size={size}
                    icon={<ClearOutlined />}
                    onClick={actions.clear}
                    danger
                />
            </Tooltip>
        </Space>
    );
};

export default MarkdownToolbar;
