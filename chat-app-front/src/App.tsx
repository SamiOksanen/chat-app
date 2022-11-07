import { AlertProps, Layout } from 'antd';
import { Context, createContext, useState } from 'react';
import './App.css';
import ChatLayout from './components/ChatLayout';
import ErrorBoundary from './components/ErrorBoundary';
import LoginForm from './components/LoginForm';
import FlexAlert from './components/FlexAlert';
import { ApolloProvider } from '@apollo/client';
import client from './apollo';
import ThemeProvider from './components/themes/ThemeProvider';

export interface UserProps {
    userid: string | null;
    username?: string | null;
    token: string | null;
    email?: string | null;
}

export const UserContext: Context<{
    user?: UserProps | null;
    changeUser?: (newUser: UserProps) => void;
}> = createContext({});

export const AlertContext: Context<{
    alert?: AlertProps | null;
    changeAlert?: Function;
}> = createContext({});

const App = () => {
    const [user, setUser] = useState<UserProps | null>(
        localStorage.getItem('token')
            ? {
                  userid: localStorage.getItem('userid'),
                  token: localStorage.getItem('token'),
              }
            : null
    );

    const changeUser = (newUser: UserProps) => {
        if (
            newUser === null ||
            newUser.userid === null ||
            newUser.token === null
        ) {
            localStorage.removeItem('userid');
            localStorage.removeItem('token');
            setUser(null);
        } else {
            localStorage.setItem('userid', newUser.userid);
            localStorage.setItem('token', newUser.token);
            setUser(newUser);
        }
    };

    const [alert, setAlert] = useState<AlertProps | null>(null);

    const changeAlert = (newAlert: AlertProps | null) => {
        setAlert(newAlert);
    };

    return (
        <ErrorBoundary>
            <ThemeProvider>
                <Layout className="App" style={{ minHeight: '100vh' }}>
                    <AlertContext.Provider value={{ alert, changeAlert }}>
                        <UserContext.Provider value={{ user, changeUser }}>
                            {!user && <LoginForm />}
                            {user && (
                                <ApolloProvider client={client}>
                                    <ChatLayout />
                                </ApolloProvider>
                            )}
                            {alert && <FlexAlert {...alert} />}
                        </UserContext.Provider>
                    </AlertContext.Provider>
                </Layout>
            </ThemeProvider>
        </ErrorBoundary>
    );
};

export default App;
