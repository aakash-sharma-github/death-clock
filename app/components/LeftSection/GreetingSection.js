'use client';
import { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { NAME_UPDATED_EVENT } from '../Dialogs/DeathYearDialog'; // Import the custom event name

export default function GreetingSection({ myFont }) {
    const [greeting, setGreeting] = useState('Good day');
    const [date, setDate] = useState('');
    const [userName, setUserName] = useState('');
    const { locale } = useAppContext();

    useEffect(() => {
        updateGreeting();
        updateDate();

        // Get initial userName from localStorage
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setUserName(storedName);
        }

        // Update greeting and date every minute
        const intervalId = setInterval(() => {
            updateGreeting();
            updateDate();
        }, 60000);

        // Event listener for custom name updated event
        const handleNameUpdate = (event) => {
            setUserName(event.detail.name);
        };

        // Add event listener
        window.addEventListener(NAME_UPDATED_EVENT, handleNameUpdate);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener(NAME_UPDATED_EVENT, handleNameUpdate);
        };
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
            <h1 className={`${myFont.className} font-semibold`}>
                {`${greeting}${userName ? ', ' + userName : ''}`}
            </h1>
            <div className="date">
                {date}
            </div>
        </div>
    );
}