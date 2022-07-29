import { Layout, Radio } from 'antd';
import { Footer } from 'antd/lib/layout/layout';
import { Context, createContext, useEffect, useState } from 'react';
import './App.css';
import ChatLayout from './components/ChatLayout';
import ErrorBoundary from './components/ErrorBoundary';
import LoginForm from './components/LoginForm';

export const ThemeContext: Context<{ theme?: string, changeTheme?: Function }> = createContext({});

export const UserContext: Context<{ user?: string, setUser?: Function }> = createContext({});

const App = () => {

    const [user, setUser] = useState(null);

    const theme = localStorage.getItem('theme') || 'light';

    if (theme === 'compact') {
        require('antd/dist/antd.compact.css');
    } else if (theme === 'dark') {
        require('antd/dist/antd.dark.css');
    } else {
        require('antd/dist/antd.css');
    }

    const changeTheme = (newTheme: string) => {
        localStorage.setItem('theme', newTheme);
        window.location.reload();
    };

    return (
        <ErrorBoundary>
            <Layout className="App" style={{ minHeight: '100vh' }}>
                <ThemeContext.Provider value={{ theme, changeTheme }}>
                    {!user && <LoginForm />}
                    {user && <ChatLayout />}
                    <Radio.Group value={theme || 'light'} onChange={e => changeTheme && changeTheme(e.target.value)} style={{ padding: 16 }}>
                        <Radio.Button value="light">Default</Radio.Button>
                        <Radio.Button value="dark">Dark</Radio.Button>
                        <Radio.Button value="compact">Compact</Radio.Button>
                    </Radio.Group>
                    <Footer style={{ textAlign: 'center' }}>Chat App ©2018 Created by Sami Oksanen</Footer>
                </ThemeContext.Provider>
            </Layout>
        </ErrorBoundary>

    );
}

export default App;
