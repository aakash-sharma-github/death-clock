'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';

export default function GreetingSection({ myFont }) {
    const [greeting, setGreeting] = useState('Good day');
    const [date, setDate] = useState('');
    const { locale } = useAppContext();

    useEffect(() => {
        updateGreeting();
        updateDate();

        // Update greeting and date every minute
        const intervalId = setInterval(() => {
            updateGreeting();
            updateDate();
        }, 60000);

        return () => clearInterval(intervalId);
    }, [locale]);

    // Update greeting based on time of day
    const updateGreeting = () => {
        const hour = new Date().getHours();
        let newGreeting = 'Good Morning';

        if (hour >= 12 && hour < 16) {
            newGreeting = 'Good Afternoon';
        } else if (hour >= 16 && hour < 20) {
            newGreeting = 'Good Evening';
        } else if (hour >= 20) {
            newGreeting = 'Good Night';
        }

        setGreeting(newGreeting);
    };

    // Update current date
    const updateDate = () => {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const currentDate = new Date().toLocaleDateString(locale, options);
        setDate(currentDate);
    };

    return (
        <div className={`greeting-section ${myFont.className} text-4xl`}>
            <h1 className={`${myFont.className} font-semibold`}>{`${greeting}, Aakash Sharma`}</h1>
            <div className="date">
                {date}
            </div>
        </div>
    );
} 