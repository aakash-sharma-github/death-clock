'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const DeathYearContext = createContext();

export function DeathYearProvider({ children }) {
    const [deathYear, setDeathYear] = useState(null);

    // Load death year from localStorage when the component mounts
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedDeathYear = localStorage.getItem('deathYear');
            if (savedDeathYear) {
                setDeathYear(parseInt(savedDeathYear, 10));
            }
        }
    }, []);

    // Update localStorage when death year changes
    useEffect(() => {
        if (deathYear && typeof window !== 'undefined') {
            localStorage.setItem('deathYear', deathYear.toString());
        }
    }, [deathYear]);

    return (
        <DeathYearContext.Provider value={{ deathYear, setDeathYear }}>
            {children}
        </DeathYearContext.Provider>
    );
}

export function useDeathYearContext() {
    return useContext(DeathYearContext);
} 