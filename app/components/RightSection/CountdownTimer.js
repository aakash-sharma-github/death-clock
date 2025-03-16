'use client';

import { useState, useEffect } from 'react';
import { useDeathYearContext } from '../../contexts/DeathYearContext';

export default function CountdownTimer() {
    const { deathYear } = useDeathYearContext();
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!deathYear) return;

        const updateCountdownTimer = () => {
            if (!deathYear) return;

            const now = new Date();
            const deathDate = new Date(deathYear, 0, 1); // January 1st of death year
            const timeLeftMs = deathDate - now;

            if (timeLeftMs <= 0) {
                setTimeLeft("Time's up!");
                return;
            }

            const years = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24 * 365));
            const days = Math.floor((timeLeftMs % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeftMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);

            setTimeLeft(`Time left for goals: ${years}y ${days}d ${hours}h ${minutes}m ${seconds}s`);
        };

        updateCountdownTimer();
        const intervalId = setInterval(updateCountdownTimer, 1000);

        return () => clearInterval(intervalId);
    }, [deathYear]);

    return timeLeft || 'Time left: ';
} 