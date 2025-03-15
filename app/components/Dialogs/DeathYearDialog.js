'use client';

import { useRef } from 'react';
import { useDeathYearContext } from '../../contexts/DeathYearContext';

export default function DeathYearDialog() {
    const dialogRef = useRef(null);
    const { setDeathYear } = useDeathYearContext();

    const handleCloseDialog = () => {
        dialogRef.current.close();
    };

    const handleSubmit = () => {
        const input = document.getElementById('death-year');
        const year = parseInt(input.value);
        if (year >= 2024 && year <= 2100) {
            setDeathYear(year);
            dialogRef.current.close();
        } else {
            alert('Please enter a year between 2024 and 2100');
        }
    };

    return (
        <dialog id="death-year-dialog" ref={dialogRef}>
            <button type="button" id="btn-death-dialog-close" className="btn-dialog-close" autoFocus onClick={handleCloseDialog}>✕</button>
            <div className="death-year-input-container">
                <h2>Enter Your Expected Death Year</h2>
                <input
                    type="number"
                    id="death-year"
                    min="2024"
                    max="2100"
                    placeholder="Enter year (2024-2100)"
                />
                <button
                    type="button"
                    id="submit-death-year"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </dialog>
    );
} 