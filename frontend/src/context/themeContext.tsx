'use client';

import { useEffect, useState } from 'react';
import { ThemeProviderContext } from '../hooks/useTheme';

type Theme = 'system' | 'light' | 'dark';

export type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    key?: string;
};

export type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

export function ThemeProvider({
    children,
    defaultTheme = 'system',
    key = 'theme',
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(defaultTheme);

    useEffect(() => {
        const savedTheme = localStorage.getItem(key) as Theme | null;
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (defaultTheme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            setTheme(systemTheme);
        }
    }, [defaultTheme, key]);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(key, theme);
            setTheme(theme);
        },
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}
