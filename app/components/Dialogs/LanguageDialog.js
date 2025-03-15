'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';

export default function LanguageDialog() {
    const dialogRef = useRef(null);
    const { locale, updateLocale, showLanguageDialog, setShowLanguageDialog } = useAppContext();
    const [languages] = useState([
        { code: 'ne-NP', name: 'Nepali (Nepal)', flag: '🇳🇵' },
        { code: 'en-US', flag: '🇺🇸', name: 'English (US)' },
        { code: 'en-GB', flag: '🇬🇧', name: 'English (UK)' },
        { code: 'fr-FR', flag: '🇫🇷', name: 'French' },
        { code: 'de-DE', flag: '🇩🇪', name: 'German' },
        { code: 'es-ES', flag: '🇪🇸', name: 'Spanish' },
        { code: 'it-IT', flag: '🇮🇹', name: 'Italian' },
        { code: 'ja-JP', flag: '🇯🇵', name: 'Japanese' },
        { code: 'zh-CN', flag: '🇨🇳', name: 'Chinese' },
        { code: 'ru-RU', flag: '🇷🇺', name: 'Russian' },
        { code: 'ar-SA', flag: '🇸🇦', name: 'Arabic' }
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

    const handleLanguageSelect = (code) => {
        updateLocale(code);
        closeDialog();
    };

    // Calculate positions for language options in a circle
    const calculatePositions = () => {
        const positionedLanguages = [];
        const radius = 60; // Reduced radius to ensure flags stay within the dialog circle
        const numLanguages = languages.length;

        languages.forEach((lang, index) => {
            // Calculate angle (in radians) for each language option
            // Start from -Math.PI/2 (top position) and distribute evenly
            const angle = -Math.PI / 2 + (index * 2 * Math.PI / numLanguages);

            // Calculate x and y positions (50% is center of the dialog)
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);

            positionedLanguages.push({
                ...lang,
                style: {
                    left: `${x}%`,
                    top: `${y}%`
                }
            });
        });

        return positionedLanguages;
    };

    return (
        <dialog id="language-dialog" ref={dialogRef}>
            <button type="button" id="btn-dialog-close" className="btn-dialog-close" autoFocus>✕</button>
            <div id="language-options" className="language-options">
                <div className="language-title">Select Language</div>

                {calculatePositions().map((lang) => (
                    <label
                        key={lang.code}
                        className={`language-option ${lang.code === locale ? 'active' : ''}`}
                        style={lang.style}
                        title={lang.name}
                        onClick={() => handleLanguageSelect(lang.code)}
                    >
                        <input
                            type="radio"
                            name="language"
                            value={lang.code}
                            checked={lang.code === locale}
                            onChange={() => { }}
                        />
                        <span className="flag-icon">{lang.flag}</span>
                    </label>
                ))}
            </div>
        </dialog>
    );
} 