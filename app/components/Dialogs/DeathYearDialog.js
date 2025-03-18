'use client';
import { useRef } from 'react';
import { useDeathYearContext } from '../../contexts/DeathYearContext';

// Create a custom event for name updates
export const NAME_UPDATED_EVENT = 'nameUpdated';

export default function DeathYearDialog() {
    const dialogRef = useRef(null);
    const { setDeathYear } = useDeathYearContext();

    const handleCloseDialog = () => {
        dialogRef.current.close();
    };

    const handleSubmit = () => {
        const yearInput = document.getElementById('death-year');
        const nameInput = document.getElementById('user-name');
        const year = parseInt(yearInput.value);
        const name = nameInput.value.trim();

        if (!name) {
            alert('Please enter your name');
            return;
        }

        if (year >= 2024 && year <= 2100) {
            setDeathYear(year);

            // Set the items in localStorage
            localStorage.setItem('userName', name);
            localStorage.setItem('deathYear', year.toString());

            // Dispatch a custom event with the new name
            const nameEvent = new CustomEvent(NAME_UPDATED_EVENT, {
                detail: { name }
            });
            window.dispatchEvent(nameEvent);

            dialogRef.current.close();
        } else {
            alert('Please enter a year between 2024 and 2100');
        }
    };

    return (
        <dialog id="death-year-dialog" ref={dialogRef}>
            <button type="button" id="btn-death-dialog-close" className="btn-dialog-close" autoFocus onClick={handleCloseDialog}>✕</button>
            <div className="death-year-input-container">
                <h2>Enter Your Name and Expected Death Year.</h2>
                <input
                    type="text"
                    id="user-name"
                    placeholder="Enter your name"
                    className="mb-4"
                />
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