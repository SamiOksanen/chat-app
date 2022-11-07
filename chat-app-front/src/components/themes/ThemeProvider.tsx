import { createContext, lazy, ReactNode, Suspense } from 'react';

const CompactTheme = lazy(() => import('./CompactTheme'));
const DarkTheme = lazy(() => import('./DarkTheme'));
const LightTheme = lazy(() => import('./LightTheme'));

export const ThemeContext = createContext<{
    theme?: string;
    changeTheme?: (newTheme: string) => void;
}>({});

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const theme = localStorage.getItem('theme') || 'light';

    const changeTheme = (newTheme: string) => {
        localStorage.setItem('theme', newTheme);
        window.location.reload();
    };

    return (
        <>
            <Suspense fallback={<span />}>
                {theme === 'compact' ? (
                    <CompactTheme />
                ) : theme === 'dark' ? (
                    <DarkTheme />
                ) : (
                    <LightTheme />
                )}
                <ThemeContext.Provider value={{ theme, changeTheme }}>
                    {children}
                </ThemeContext.Provider>
            </Suspense>
        </>
    );
};

export default ThemeProvider;
