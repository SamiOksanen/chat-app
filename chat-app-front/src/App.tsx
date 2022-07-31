import { Alert, AlertProps, Layout, Radio } from 'antd';
import { Footer } from 'antd/lib/layout/layout';
import { Context, createContext, SetStateAction, useEffect, useState } from 'react';
import './App.css';
import ChatLayout from './components/ChatLayout';
import ErrorBoundary from './components/ErrorBoundary';
import LoginForm from './components/LoginForm';
import FlexAlert from './components/FlexAlert';
import userEvent from '@testing-library/user-event';

export const ThemeContext: Context<{ theme?: string, changeTheme?: Function }> = createContext({});

export interface UserProps {
    userid: string | null,
    username?: string | null,
    token: string | null,
    email?: string | null
}

export const UserContext: Context<{ user?: UserProps | null, changeUser?: Function }> = createContext({});

export const AlertContext: Context<{ alert?: AlertProps | null, changeAlert?: Function }> = createContext({});

const App = () => {

    const [user, setUser] = useState<UserProps | null>(localStorage.getItem('token') ? { 'userid': localStorage.getItem('userid'), 'token': localStorage.getItem('token') } : null);

    const changeUser = (newUser: UserProps) => {
        if (newUser === null || newUser.userid === null || newUser.token === null) {
            localStorage.removeItem('userid');
            localStorage.removeItem('token');
            setUser(null);
        } else {
            localStorage.setItem('userid', newUser.userid);
            localStorage.setItem('token', newUser.token);
            setUser(newUser);
        }
    }

    const [alert, setAlert] = useState<AlertProps | null>(null);

    const changeAlert = (newAlert: AlertProps | null) => {
        setAlert(newAlert);
    }

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
                    <AlertContext.Provider value={{ alert, changeAlert }}>
                        <UserContext.Provider value={{ user, changeUser }}>
                            {!user && <LoginForm />}
                            {user && <ChatLayout />}
                            {alert && <FlexAlert {...alert} />}
                        </UserContext.Provider>
                    </AlertContext.Provider>
                </ThemeContext.Provider>
            </Layout>
        </ErrorBoundary>

    );
}

export default App;
