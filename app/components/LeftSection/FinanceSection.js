'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { FaChevronDown } from 'react-icons/fa';

export default function FinanceSection() {
    const {
        balance,
        lastUpdated,
        updateBalance,
        formatBalance,
        currencyType,
        currencySymbols,
        updateCurrencyType
    } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [editableBalance, setEditableBalance] = useState('');
    const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const balanceRef = useRef(null);
    const dropdownRef = useRef(null);
    const currencyRef = useRef(null);
    const containerRef = useRef(null);

    // Extract the numeric balance without currency symbol when editing starts
    useEffect(() => {
        // Remove any currency symbols and commas, keep only the numeric part
        setEditableBalance(balance.replace(/[^0-9.]/g, ''));
    }, [balance, isEditing]);

    // Calculate dropdown position when showing
    useEffect(() => {
        if (showCurrencyDropdown && currencyRef.current) {
            const rect = currencyRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.top - 200, // Position above the currency element
                left: rect.left
            });
        }
    }, [showCurrencyDropdown]);

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            // Don't close if clicking on currency or its children
            if (currencyRef.current && currencyRef.current.contains(event.target)) {
                return;
            }

            // Don't close if clicking on dropdown or its children
            if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
                return;
            }

            // Close dropdown for all other clicks
            setShowCurrencyDropdown(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
        // Extract the numeric part without the currency symbol
        setEditableBalance(balance.replace(/[^0-9.]/g, ''));
        setTimeout(() => balanceRef.current?.focus(), 0);
    };

    const handleBalanceChange = (e) => {
        // Only allow numbers and decimal point
        const value = e.target.value.replace(/[^0-9.]/g, '');
        setEditableBalance(value);
    };

    const handleBalanceBlur = (e) => {
        // Don't save if clicking on currency dropdown or currency symbol
        if (currencyRef.current && currencyRef.current.contains(e.relatedTarget) ||
            dropdownRef.current && dropdownRef.current.contains(e.relatedTarget)) {
            return;
        }

        saveBalance();
    };

    const handleBalanceKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveBalance();
        }
    };

    const toggleCurrencyDropdown = (e) => {
        // Make sure the click event doesn't propagate to parent elements
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (isEditing) {
            setShowCurrencyDropdown(!showCurrencyDropdown);
        }
    };

    const handleCurrencySelect = (currencyKey, e) => {
        // Prevent event bubbling
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        updateCurrencyType(currencyKey);
        setShowCurrencyDropdown(false);

        // Refocus on the input after selecting currency with a small delay
        if (balanceRef.current) {
            setTimeout(() => balanceRef.current.focus(), 50);
        }
    };

    const saveBalance = () => {
        if (editableBalance) {
            // Ensure the balance is a valid number
            const numericBalance = parseFloat(editableBalance);
            if (!isNaN(numericBalance)) {
                // Format with currency symbol
                const formattedBalance = formatBalance(numericBalance);
                updateBalance(formattedBalance);
            }
        }
        setIsEditing(false);
        setShowCurrencyDropdown(false);
    };

    // Get current currency symbol
    const currentSymbol = currencySymbols[currencyType];

    // Currency labels for dropdown
    const currencyLabels = {
        inr: 'Indian Rupee (₹)',
        npr: 'Nepali Rupee (रू)',
        aed: 'AED (د.إ)',
        usd: 'US Dollar ($)'
    };

    return (
        <div className="finance-section">
            <div className="balance-card">
                <div className="balance-header">
                    <h3>Current Bank Balance</h3>
                    <button
                        className="edit-btn"
                        onClick={handleEditClick}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10216 21.5 2.49998C21.8978 2.89781 22.1213 3.43737 22.1213 3.99998C22.1213 4.56259 21.8978 5.10216 21.5 5.49998L12 15L8 16L9 12L18.5 2.49998Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Edit
                    </button>
                </div>
                <div className="balance-amount">
                    {isEditing ? (
                        <div className="balance-edit-container" ref={containerRef}>
                            <span
                                ref={currencyRef}
                                className={`currency ${isEditing ? 'editable' : ''}`}
                                onClick={toggleCurrencyDropdown}
                                tabIndex="0"
                            >
                                {currentSymbol}
                                {isEditing && <FaChevronDown className="dropdown-icon" />}
                            </span>
                            <input
                                ref={balanceRef}
                                type="text"
                                className="balance-edit-input"
                                value={editableBalance}
                                onChange={handleBalanceChange}
                                onBlur={handleBalanceBlur}
                                onKeyDown={handleBalanceKeyDown}
                                autoFocus
                            />
                        </div>
                    ) : (
                        <>
                            <span className="currency">{currentSymbol}</span>
                            {balance.replace(new RegExp(`[${Object.values(currencySymbols).join('')}]`), '')}
                        </>
                    )}
                </div>
                <div className="last-updated">
                    Last updated: {lastUpdated}
                </div>
            </div>

            {/* Dropdown placed outside the finance section */}
            {showCurrencyDropdown && (
                <div
                    ref={dropdownRef}
                    className="currency-dropdown-portal"
                    style={{
                        position: 'fixed',
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                        zIndex: 9999
                    }}
                >
                    {Object.keys(currencySymbols).map((key) => (
                        <div
                            key={key}
                            className={`currency-option ${currencyType === key ? 'active' : ''}`}
                            onClick={(e) => handleCurrencySelect(key, e)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleCurrencySelect(key, e);
                                }
                            }}
                            tabIndex="0"
                        >
                            <span className="currency-symbol">{currencySymbols[key]}</span>
                            <span className="currency-name">{currencyLabels[key]}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 