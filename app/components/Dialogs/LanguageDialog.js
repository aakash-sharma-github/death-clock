'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';

export default function LanguageDialog() {
    const dialogRef = useRef(null);
    const { locale, updateLocale, showLanguageDialog, setShowLanguageDialog } = useAppContext();
    const [languages] = useState([
        { code: "ne-NP", flag: "🇳🇵", name: "Nepal" },
        { code: "en-IN", flag: "🇮🇳", name: "India" },
        { code: "en-AU", flag: "🇦🇺", name: "Australia" },
        { code: "en-US", flag: "🇺🇸", name: "United States" },
        { code: "en-GB", flag: "🇬🇧", name: "United Kingdom" },
        { code: "fr-FR", flag: "🇫🇷", name: "France" },
        { code: "de-DE", flag: "🇩🇪", name: "Germany" },
        { code: "es-ES", flag: "🇪🇸", name: "Spain" },
        { code: "it-IT", flag: "🇮🇹", name: "Italy" },
        { code: "ja-JP", flag: "🇯🇵", name: "Japan" },
        { code: "zh-CN", flag: "🇨🇳", name: "China" },
        { code: "ru-RU", flag: "🇷🇺", name: "Russia" },
        { code: "ar-SA", flag: "🇸🇦", name: "Saudi Arabia" },
        { code: "en-AE", flag: "🇦🇪", name: "United Arab Emirates" }
    ]);

    // Handle dialog open
    useEffect(() => {
        if (showLanguageDialog && dialogRef.current) {
            try {
                dialogRef.current.showModal();
            } catch (e) {
                console.error('Error showing dialog:', e);
            }
        }
    }, [showLanguageDialog]);

    // Handle dialog open/close
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const closeButton = dialog.querySelector('#btn-dialog-close');
        if (closeButton) {
            closeButton.addEventListener('click', closeDialog);
        }

        dialog.addEventListener('click', closeDialogOnClickOutside);

        // Clean up event listeners
        return () => {
            if (closeButton) {
                closeButton.removeEventListener('click', closeDialog);
            }
            dialog.removeEventListener('click', closeDialogOnClickOutside);
        };
    }, []);

    const closeDialog = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
            setShowLanguageDialog(false);
        }
    };

    const closeDialogOnClickOutside = (e) => {
        if (e.target === dialogRef.current) {
            closeDialog();
        }
    };

    const handleFlagSelect = (code) => {
        updateLocale(code);
        closeDialog();
    };

    // Calculate positions for flag options in a circle
    const calculatePositions = () => {
        const positionedFlags = [];
        const radius = 60; // Radius for the circle of flags
        const numFlags = languages.length;

        languages.forEach((lang, index) => {
            // Calculate angle (in radians) for each flag option
            // Start from -Math.PI/2 (top position) and distribute evenly
            const angle = -Math.PI / 2 + (index * 2 * Math.PI / numFlags);

            // Calculate x and y positions (50% is center of the dialog)
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);

            positionedFlags.push({
                ...lang,
                style: {
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)', // Center the flag element
                    position: 'absolute'
                }
            });
        });

        return positionedFlags;
    };

    return (
        <dialog id="language-dialog" ref={dialogRef} className="flag-dialog">
            <button type="button" id="btn-dialog-close" className="btn-dialog-close" autoFocus>✕</button>
            <div id="language-options" className="flag-options">
                <div className="flag-title">Select Flag</div>

                {calculatePositions().map((lang) => (
                    <label
                        key={lang.code}
                        className={`flag-option ${lang.code === locale ? 'active' : ''}`}
                        style={lang.style}
                        title={lang.name}
                        onClick={() => handleFlagSelect(lang.code)}
                    >
                        <span className="link-tooltip">
                            {lang.name}
                        </span>
                        <input
                            type="radio"
                            name="flag"
                            value={lang.code}
                            checked={lang.code === locale}
                            readOnly
                        />
                        <span className="flag-icon">{lang.flag}</span>
                    </label>
                ))}
            </div>
        </dialog>
    );
}