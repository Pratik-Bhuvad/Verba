import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

    useEffect(() => {
        if (theme === 'light') {
            document.documentElement.classList.remove('dark')
        }
        else {
            document.documentElement.classList.add('dark')
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        const newTheme = (theme === 'dark') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme)
        setTheme(newTheme)
        console.log(theme, document.documentElement.classList);
        
    }
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}