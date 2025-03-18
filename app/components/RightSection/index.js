'use client';

import { useEffect } from 'react';
import Clock from './Clock';
import CountdownTimer from './CountdownTimer';
import SoundControl from './SoundControl';
import LanguageDialog from '../Dialogs/LanguageDialog';
import DeathYearDialog from '../Dialogs/DeathYearDialog';
import { useDeathYearContext } from '../../contexts/DeathYearContext';
import { useAppContext } from '../../contexts/AppContext';

export default function RightSection() {
    const { deathYear } = useDeathYearContext();
    const { showLanguageDialog } = useAppContext();

    useEffect(() => {
        // Show death year dialog on first load if no death year is set
        const dialog = document.getElementById('death-year-dialog');
        if (!deathYear && dialog) {
            dialog.showModal();
        }
    }, [deathYear]);

    // Show language dialog when showLanguageDialog is true
    useEffect(() => {
        if (showLanguageDialog) {
            const dialog = document.getElementById('language-dialog');
            if (dialog) {
                setTimeout(() => {
                    dialog.showModal();
                }, 0);
            }
        }
    }, [showLanguageDialog]);

    if (!deathYear) {
        return (
            <div className="right-section">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Welcome to Death Clock</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Please set your expected death year to continue</p>
                    <DeathYearDialog />
                </div>
            </div>
        );
    }

    return (
        <div className="right-section">
            <div className="clock-container">
                <Clock />
                <div id="countdown-timer" className="countdown-timer">
                    <CountdownTimer />
                </div>
            </div>

            <SoundControl />

            <LanguageDialog />
            <DeathYearDialog />
        </div>
    );
} 