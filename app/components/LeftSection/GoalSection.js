'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';

export default function GoalSection() {
    const { dailyGoal, updateDailyGoal } = useAppContext();
    const [goal, setGoal] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const savedTimeoutRef = useRef(null);

    // Load saved goal from context
    useEffect(() => {
        if (dailyGoal !== undefined) {
            setGoal(dailyGoal);
        }
    }, [dailyGoal]);

    useEffect(() => {
        // Cleanup timeouts when component unmounts
        return () => {
            if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);
        };
    }, []);

    // Handle input change
    const handleGoalChange = (e) => {
        const newGoal = e.target.value;
        setGoal(newGoal);
        // Just update the input without saving
    };

    // Save goal when user presses Enter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            saveGoal();
        }
    };

    // Save the goal
    const saveGoal = () => {
        // Only save if there were changes
        if (dailyGoal !== goal) {
            setIsSaving(true);

            // Simulate short saving process
            setTimeout(() => {
                updateDailyGoal(goal);
                setIsSaving(false);
                setIsSaved(true);

                // Remove saved indicator after animation
                savedTimeoutRef.current = setTimeout(() => {
                    setIsSaved(false);
                }, 3000);
            }, 300);
        }
    };

    return (
        <div className="goal-section">
            <div className="goal-header">
                <h3>Your Goal</h3>
            </div>
            <div className="goal-content">
                <input
                    type="text"
                    className="goal-input"
                    placeholder="Write your goal here and press Enter to save..."
                    value={goal || ''}
                    onChange={handleGoalChange}
                    onKeyDown={handleKeyDown}
                />
                <div className="save-status">
                    {isSaving && <span className="saving-indicator">Saving...</span>}
                    {isSaved && <span className="saved-indicator">✓ Saved</span>}
                </div>
            </div>
        </div>
    );
} 