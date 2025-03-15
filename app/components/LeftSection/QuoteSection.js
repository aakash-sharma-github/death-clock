'use client';

import { useState, useEffect } from 'react';

export default function QuoteSection() {
    const [quote, setQuote] = useState({
        text: 'The future belongs to those who believe in the beauty of their dreams.',
        author: 'Eleanor Roosevelt'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDailyQuote();

        // Fetch new quote every day
        const intervalId = setInterval(fetchDailyQuote, 24 * 60 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, []);

    const fetchDailyQuote = async () => {
        setLoading(true);
        try {
            // Use our own API route as a proxy to avoid CORS issues
            const response = await fetch('/api/quote');
            if (!response.ok) {
                throw new Error(`Failed to fetch quote: ${response.status}`);
            }
            const data = await response.json();
            setQuote({
                text: data.quote,
                author: data.author
            });
        } catch (error) {
            console.error('Error fetching quote:', error);
            // Keep default quote if fetch fails
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="quote-section">
            {loading ? (
                <p className="quote-text loading">Loading quote...</p>
            ) : (
                <>
                    <p className="quote-text">
                        {quote.text}
                    </p>
                    <div className="quote-author">
                        - {quote.author}
                    </div>
                </>
            )}
        </div>
    );
} 