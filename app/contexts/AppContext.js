'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useDeathYearContext } from './DeathYearContext';
import { FaGoogle, FaYahoo, FaSearchengin } from 'react-icons/fa';
import { BsBing } from "react-icons/bs";

const AppContext = createContext();

// This function will render the correct icon based on a string identifier
const getSearchEngineIcon = (iconName) => {
    switch (iconName) {
        case 'google':
            return <FaGoogle />;
        case 'bing':
            return <BsBing />;
        case 'yahoo':
            return <FaYahoo />;
        case 'duckduckgo':
            return <FaSearchengin />;
        default:
            return <FaGoogle />;
    }
};

// Define currency symbols
export const currencySymbols = {
    inr: '₹', // Indian Rupee
    npr: 'रू', // Nepali Rupee
    aed: 'د.إ', // UAE Dirham
    usd: '$'  // US Dollar
};

export function AppProvider({ children }) {
    // Get deathYear from DeathYearContext to avoid duplication
    const { deathYear } = useDeathYearContext();

    // State variables - always start with muted=true for better user experience
    const [locale, setLocale] = useState('en-US');
    // const [currency, setCurrency] = useState('रू');
    const [isMuted, setIsMuted] = useState(true);
    const [currentSearchEngine, setCurrentSearchEngine] = useState({
        engine: 'google',
        iconName: 'google', // Store a string identifier instead of a component
        url: 'https://www.google.com/search?q='
    });
    const [balance, setBalance] = useState('रू0.00');
    const [lastUpdated, setLastUpdated] = useState('Never');
    const [dailyGoal, setDailyGoal] = useState('');
    const [showLanguageDialog, setShowLanguageDialog] = useState(false);
    const [currencyType, setCurrencyType] = useState('npr');

    // Load user preferences from localStorage when the component mounts
    useEffect(() => {
        // Check if we're in a browser environment
        if (typeof window !== 'undefined') {
            // For sound, we always default to muted=true on page load for better UX
            // We'll load other saved preferences but intentionally keep muted=true
            localStorage.setItem('isMuted', 'true');

            // Load locale preference
            const savedLocale = localStorage.getItem('locale');
            if (savedLocale) {
                setLocale(savedLocale);
            }

            // Load balance information
            const savedBalance = localStorage.getItem('balance');
            if (savedBalance) {
                setBalance(savedBalance);
            }

            const savedLastUpdated = localStorage.getItem('lastUpdated');
            if (savedLastUpdated) {
                setLastUpdated(savedLastUpdated);
            }

            // Daily goal
            const savedGoal = localStorage.getItem('yourGoals');
            if (savedGoal) {
                setDailyGoal(savedGoal);
            }

            // Currency type
            const savedCurrencyType = localStorage.getItem('currencyType');
            if (savedCurrencyType) {
                setCurrencyType(savedCurrencyType);
            }

            // Search engine preferences
            const savedEngine = localStorage.getItem('searchEngine');
            if (savedEngine) {
                try {
                    setCurrentSearchEngine(JSON.parse(savedEngine));
                } catch (e) {
                    console.error('Error parsing search engine from localStorage:', e);
                }
            }
        }
    }, []);

    // Update localStorage when preferences change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('isMuted', isMuted);

            // Make sure audio is paused when muted
            const tickSound = document.getElementById('tick-sound');
            if (tickSound) {
                if (isMuted) {
                    tickSound.pause();
                }
                // Don't try to auto-play here - we'll handle play in the toggleSound function
            }
        }
    }, [isMuted]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('locale', locale);
        }
    }, [locale]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('currencyType', currencyType);
        }
    }, [currencyType]);

    // Helper function to get browser locale
    const getBrowserLocale = () => {
        if (typeof window !== 'undefined' && navigator) {
            return (navigator.languages && navigator.languages[0]) ||
                navigator.language ||
                'en-US';
        }
        return 'en-US';
    };

    // Format balance with current currency symbol and commas
    const formatBalance = (amount) => {
        const symbol = currencySymbols[currencyType] || 'रू';

        // Different locale format based on currency
        // let locale = locale;
        // if (currencyType === 'usd') setLocale(currencySymbols.usd);
        // else if (currencyType === 'npr') setLocale(currencySymbols.npr);
        // else if (currencyType === 'aed') setLocale(currencySymbols.aed);
        // else if (currencyType === 'inr') setLocale(currencySymbols.inr);

        let locale = 'en-US'; // Default to Indian Rupee
        if (currencyType === 'usd') locale = 'en-US';
        else if (currencyType === 'npr') locale = 'en-US';
        else if (currencyType === 'aed') locale = 'en-US';
        else if (currencyType === 'inr') locale = 'en-US';

        const formattedAmount = symbol + parseFloat(amount).toLocaleString(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        return formattedAmount;
    };

    // Update balance
    const updateBalance = (newBalance) => {
        setBalance(newBalance);
        const now = new Date();
        const nowStr = now.toLocaleString();
        setLastUpdated(nowStr);

        if (typeof window !== 'undefined') {
            localStorage.setItem('balance', newBalance);
            localStorage.setItem('lastUpdated', nowStr);

            // Also store the current currency type with the balance for better synchronization
            localStorage.setItem('currencyType', currencyType);
        }
    };

    // Update currency type
    const updateCurrencyType = (newCurrencyType) => {
        setCurrencyType(newCurrencyType);
        if (typeof window !== 'undefined') {
            localStorage.setItem('currencyType', newCurrencyType);

            // Update the balance with the new currency symbol
            try {
                // Extract numeric value and format with new currency
                const numericBalance = parseFloat(balance.replace(/[^0-9.]/g, ''));
                if (!isNaN(numericBalance)) {
                    // Update the currency first so formatBalance uses the new symbol
                    setCurrencyType(newCurrencyType);
                    const newFormattedBalance = formatBalance(numericBalance);
                    setBalance(newFormattedBalance);
                    localStorage.setItem('balance', newFormattedBalance);
                }
            } catch (e) {
                console.error('Error updating balance with new currency:', e);
            }
        }
    };

    // Toggle sound
    const toggleSound = () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);

        if (typeof window !== 'undefined') {
            localStorage.setItem('isMuted', newMuted.toString());

            // This is user-initiated, so we can try to play the sound
            if (!newMuted) {
                const tickSound = document.getElementById('tick-sound');
                if (tickSound) {
                    tickSound.volume = 0.2; // Set volume to 20%
                    tickSound.load(); // Ensure audio is loaded before playing

                    // Properly handle the Promise returned by play()
                    tickSound.play().catch(e => {
                        console.log('Audio play failed:', e);
                        // If autoplay is still blocked, keep the muted state true
                        setIsMuted(true);
                        localStorage.setItem('isMuted', 'true');
                    });
                }
            }
        }
    };

    // Update search engine
    const updateSearchEngine = (engine) => {
        setCurrentSearchEngine(engine);
        if (typeof window !== 'undefined') {
            localStorage.setItem('searchEngine', JSON.stringify(engine));
        }
    };

    // Update daily goal
    const updateDailyGoal = (goal) => {
        setDailyGoal(goal);
        if (typeof window !== 'undefined') {
            localStorage.setItem('goals', goal);
        }
    };

    // Update locale
    const updateLocale = (newLocale) => {
        setLocale(newLocale);
        if (typeof window !== 'undefined') {
            localStorage.setItem('locale', newLocale);
        }
    };

    return (
        <AppContext.Provider value={{
            locale,
            deathYear,
            isMuted,
            currentSearchEngine,
            getSearchEngineIcon, // Add the icon rendering function to context
            balance,
            lastUpdated,
            dailyGoal,
            showLanguageDialog,
            setShowLanguageDialog,
            updateLocale,
            updateBalance,
            toggleSound,
            updateSearchEngine,
            updateDailyGoal,
            formatBalance,
            currencyType,
            currencySymbols,
            updateCurrencyType
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
} 