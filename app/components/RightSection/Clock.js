'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useDeathYearContext } from '../../contexts/DeathYearContext';

export default function Clock() {
    const { locale, setShowLanguageDialog } = useAppContext();
    const { deathYear } = useDeathYearContext();
    const clockRef = useRef(null);
    const [currentFlag, setCurrentFlag] = useState('🇳🇵');
    const [currentLangName, setCurrentLangName] = useState('English (US)');

    useEffect(() => {
        // Initialize clock faces
        drawClockFaces();

        // Start rotating clock faces
        const intervalId = setInterval(() => {
            drawClockFaces();
            rotateClockFaces();
        }, 1000); // Update every second

        return () => clearInterval(intervalId);
    }, [locale, deathYear]);

    // Update flag and language name based on locale
    useEffect(() => {
        // Set flag and language name based on locale
        switch (locale) {
            case 'en-US':
                setCurrentFlag('🇺🇸');
                setCurrentLangName('English (US)');
                break;
            case 'en-GB':
                setCurrentFlag('🇬🇧');
                setCurrentLangName('English (UK)');
                break;
            case 'fr-FR':
                setCurrentFlag('🇫🇷');
                setCurrentLangName('French');
                break;
            case 'de-DE':
                setCurrentFlag('🇩🇪');
                setCurrentLangName('German');
                break;
            case 'es-ES':
                setCurrentFlag('🇪🇸');
                setCurrentLangName('Spanish');
                break;
            case 'it-IT':
                setCurrentFlag('🇮🇹');
                setCurrentLangName('Italian');
                break;
            case 'ja-JP':
                setCurrentFlag('🇯🇵');
                setCurrentLangName('Japanese');
                break;
            case 'zh-CN':
                setCurrentFlag('🇨🇳');
                setCurrentLangName('Chinese');
                break;
            case 'ru-RU':
                setCurrentFlag('🇷🇺');
                setCurrentLangName('Russian');
                break;
            case 'ar-SA':
                setCurrentFlag('🇸🇦');
                setCurrentLangName('Arabic');
                break;
            default:
                setCurrentFlag('🇳🇵');
                setCurrentLangName('English (US)');
        }
    }, [locale]);

    // Updated language button click handler
    const handleLanguageButtonClick = () => {
        // Set state to show language dialog
        setShowLanguageDialog(true);
    };

    const drawClockFaces = () => {
        if (!clockRef.current) return;

        const clockFaces = clockRef.current.querySelectorAll('.clock-face');

        // Get the current date details
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const currentWeekday = currentDate.getDay();
        const currentHours = currentDate.getHours();
        const currentMinutes = currentDate.getMinutes();
        const currentSeconds = currentDate.getSeconds();
        const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const weekdayNames = Array.from({ length: 7 }, (_, i) =>
            new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2021, 0, i + 3))
        );
        const monthNames = Array.from({ length: 12 }, (_, i) =>
            new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2021, i))
        );

        clockFaces.forEach(clockFace => {
            clockFace.innerHTML = '';

            const clockType = clockFace.getAttribute('data-clock');
            const numbers = parseInt(clockFace.getAttribute('data-numbers'), 10);
            const faceWidth = clockFace.offsetWidth;
            const RADIUS = (faceWidth / 2) - 20; // Match original design
            const center = faceWidth / 2;

            let valueSet;
            let currentValue;

            switch (clockType) {
                case 'seconds':
                    valueSet = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
                    currentValue = currentSeconds;
                    break;
                case 'minutes':
                    valueSet = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
                    currentValue = currentMinutes;
                    break;
                case 'hours':
                    valueSet = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
                    currentValue = currentHours;
                    break;
                case 'days':
                    valueSet = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
                    currentValue = currentDay;
                    break;
                case 'months':
                    valueSet = monthNames;
                    currentValue = currentMonth;
                    break;
                case 'years':
                    valueSet = Array.from({ length: 101 }, (_, i) => 2000 + i);
                    currentValue = currentYear;
                    break;
                case 'day-names':
                    valueSet = weekdayNames;
                    currentValue = currentWeekday;
                    break;
                default:
                    return;
            }

            valueSet.forEach((value, i) => {
                const angle = (i * (360 / numbers));
                const x = center + RADIUS * Math.cos((angle * Math.PI) / 180);
                const y = center + RADIUS * Math.sin((angle * Math.PI) / 180);

                const element = document.createElement('span');
                element.classList.add('number');

                // Add 'dead' class to years that are past the death year
                if (clockType === 'years' && deathYear && parseInt(value) >= deathYear) {
                    element.classList.add('dead');
                }

                element.textContent = value;
                element.style.left = `${x}px`;
                element.style.top = `${y}px`;
                element.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

                clockFace.appendChild(element);
            });

            const currentIndex = valueSet.indexOf(
                typeof valueSet[0] === 'string' ? String(currentValue) : currentValue
            );
            const rotationAngle = -((currentIndex / numbers) * 360);
            clockFace.style.transform = `rotate(${rotationAngle}deg)`;
        });
    };

    const rotateClockFaces = () => {
        if (!clockRef.current) return;

        const clockFaces = clockRef.current.querySelectorAll('.clock-face');
        const now = new Date();

        clockFaces.forEach(clockFace => {
            const clockType = clockFace.getAttribute('data-clock');
            const totalNumbers = parseInt(clockFace.getAttribute('data-numbers'), 10);

            let currentValue;
            switch (clockType) {
                case 'seconds':
                    currentValue = now.getSeconds();
                    break;
                case 'minutes':
                    currentValue = now.getMinutes();
                    break;
                case 'hours':
                    currentValue = now.getHours();
                    break;
                case 'days':
                    currentValue = now.getDate() - 1;
                    break;
                case 'months':
                    currentValue = now.getMonth();
                    break;
                case 'years':
                    currentValue = now.getFullYear() - 2000;
                    break;
                case 'day-names':
                    currentValue = now.getDay();
                    break;
                default:
                    return;
            }

            const angle = (360 / totalNumbers) * currentValue;
            clockFace.style.transform = `rotate(${-angle}deg)`;
        });
    };

    return (
        <div className="clock" ref={clockRef} data-date="2024-12-25">
            <div>
                <div data-clock="years" data-numbers="101" className="clock-face"></div>
            </div>
            <div>
                <div data-clock="seconds" data-numbers="60" className="clock-face"></div>
            </div>
            <div>
                <div data-clock="minutes" data-numbers="60" className="clock-face"></div>
            </div>
            <div>
                <div data-clock="hours" data-numbers="24" className="clock-face"></div>
            </div>
            <div>
                <div data-clock="days" data-numbers="31" className="clock-face"></div>
            </div>
            <div>
                <div data-clock="months" data-numbers="12" className="clock-face"></div>
            </div>
            <div>
                <div data-clock="day-names" data-numbers="7" className="clock-face"></div>
            </div>
            <button
                type="button"
                id="current-lang"
                className="current-lang-display"
                title={currentLangName}
                onClick={handleLanguageButtonClick}
            >
                {currentFlag}
            </button>
        </div>
    );
} 