import { createContext, ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';
import 'antd/dist/reset.css';

export const ThemeContext = createContext<{
    theme?: string;
    changeTheme?: (newTheme: string) => void;
}>({});

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const currentTheme = localStorage.getItem('theme') || 'light';

    const changeTheme = (newTheme: string) => {
        localStorage.setItem('theme', newTheme);
        window.location.reload();
    };

    const getThemeConfig = () => {
        switch (currentTheme) {
            case 'dark':
                return {
                    algorithm: theme.darkAlgorithm,
                };
            case 'compact':
                return {
                    algorithm: theme.compactAlgorithm,
                };
            default:
                return {
                    algorithm: theme.defaultAlgorithm,
                };
        }
    };

    return (
        <ConfigProvider theme={getThemeConfig()}>
            <ThemeContext.Provider value={{ theme: currentTheme, changeTheme }}>
                {children}
            </ThemeContext.Provider>
        </ConfigProvider>
    );
};

export default ThemeProvider;
