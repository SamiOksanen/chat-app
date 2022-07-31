import { SendOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Input, MenuProps, Radio, Space } from 'antd';
import { Typography, Layout, Menu } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../App';

const { Content, Footer, Sider } = Layout;

const { Text } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('My User', '1', <UserOutlined />),
    getItem('Jane', '2'),
    getItem('Joe', '3'),
    getItem('Our Group', '4', <TeamOutlined />),
];

const ChatLayout = () => {
    const { theme, changeTheme } = useContext(ThemeContext);

    const [collapsed, setCollapsed] = useState(false);

    const [selectedMenuItem, setSelectedMenuItem] = useState('');

    const [messageInput, setMessageInput] = useState('');

    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        console.log(selectedMenuItem)
    }, [selectedMenuItem]);

    const sendMessage = () => {
        setMessages(prev => {prev.push(messageInput); return prev;});
        setMessageInput('');
    }

    return (
        <>
            <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)} style={{ overflowY: 'auto' }}>
                <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={[selectedMenuItem]} mode="inline" items={items} onSelect={val => setSelectedMenuItem(val.key)} />
            </Sider>
            <Layout className="site-layout">
                {
                    // Searchbar here
                    //<Header className="site-layout-background" style={{ padding: 0 }} />
                }
                <Content style={{ margin: '16px 16px', height: 360, overflowY: 'scroll', position: 'relative', display: 'flex', flexDirection: 'column-reverse' }}>
                    <Space className="site-layout-background" style={{ padding: 24, width: '100%', position: 'absolute' }} direction="vertical">
                        {
                            messages.map((message, ix) => <Text key={ix}>{message}</Text>)
                        }
                    </Space>
                </Content>
                <Input.Group compact>
                    <Input value={messageInput} onChange={(x) => setMessageInput(x.target.value)} onPressEnter={sendMessage} placeholder="Write Message..." style={{ width: 'calc(100% - 200px)', textAlign: 'left' }}/>
                    <Button type="primary" onClick={sendMessage}><SendOutlined /></Button>
                </Input.Group>
                <Radio.Group value={theme || 'light'} onChange={e => changeTheme && changeTheme(e.target.value)} style={{ padding: 16 }}>
                        <Radio.Button value="light">Default</Radio.Button>
                        <Radio.Button value="dark">Dark</Radio.Button>
                        <Radio.Button value="compact">Compact</Radio.Button>
                </Radio.Group>
                <Footer style={{ textAlign: 'center' }}>Chat App ©2022 Created by Sami Oksanen</Footer>
            </Layout>
        </>
    );
};

export default ChatLayout;