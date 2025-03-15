'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';

export default function SearchSection() {
    const { currentSearchEngine, updateSearchEngine, getSearchEngineIcon } = useAppContext();
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    const searchEngines = [
        {
            engine: 'google',
            iconName: 'google',
            url: 'https://www.google.com/search?q=',
            name: 'Google'
        },
        {
            engine: 'bing',
            iconName: 'bing',
            url: 'https://www.bing.com/search?q=',
            name: 'Bing'
        },
        {
            engine: 'duckduckgo',
            iconName: 'duckduckgo',
            url: 'https://duckduckgo.com/?q=',
            name: 'DuckDuckGo'
        },
        {
            engine: 'yahoo',
            iconName: 'yahoo',
            url: 'https://search.yahoo.com/search?p=',
            name: 'Yahoo'
        }
    ];

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            window.open(currentSearchEngine.url + encodeURIComponent(searchQuery), '_blank');
            setSearchQuery('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleEngineSelect = (engine) => {
        updateSearchEngine(engine);
        setShowDropdown(false);
    };

    return (
        <div className="search-section">
            <div className="search-container">
                {/* Search Engine Select */}
                <div className="search-engine-select">
                    <button
                        ref={buttonRef}
                        className="search-engine-btn"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <span className="search-icon">
                            {getSearchEngineIcon(currentSearchEngine.iconName)}
                        </span>
                        <span className="arrow-down">▼</span>
                    </button>

                    {showDropdown && (
                        <div
                            ref={dropdownRef}
                            className={`search-engine-dropdown ${showDropdown ? 'show' : ''}`}
                        >
                            {searchEngines.map((engine) => (
                                <div
                                    key={engine.engine}
                                    className="search-engine-option"
                                    onClick={() => handleEngineSelect(engine)}
                                >
                                    <span className="search-icon">
                                        {getSearchEngineIcon(engine.iconName)}
                                    </span>
                                    <span>{engine.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Search Input */}
                <input
                    className="search-input"
                    id="search-input"
                    type="text"
                    placeholder="Type anything and press Enter to search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                />

                {/* Search Button */}
                <button
                    id="search-button"
                    onClick={handleSearch}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
} 