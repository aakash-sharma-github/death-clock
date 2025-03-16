'use client';
import { useState, useEffect } from 'react';

export default function QuoteSection() {
    const [quote, setQuote] = useState({
        text: 'The future belongs to those who believe in the beauty of their dreams.',
        author: 'Eleanor Roosevelt'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDailyQuote();
        const intervalId = setInterval(fetchDailyQuote, 24 * 60 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);

    const fetchDailyQuote = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/quote');

            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }

            const data = await response.json();

            // Extract quote text and author based on API response structure
            const extractedQuote = extractQuoteFromData(data);

            if (extractedQuote.text) {
                setQuote(extractedQuote);
            } else {
                throw new Error('Could not extract quote from API response');
            }
        } catch (error) {
            console.error('Error fetching quote:', error);
            setError(error.message);
            // Keep existing quote if fetch fails
        } finally {
            setLoading(false);
        }
    };

    const extractQuoteFromData = (data) => {
        let quoteText = '';
        let quoteAuthor = 'Unknown';

        if (Array.isArray(data)) {
            if (data.length > 0) {
                quoteText = data[0].quote || data[0].text || data[0].content || '';
                quoteAuthor = data[0].author || 'Unknown';
            }
        } else if (data.quotes && Array.isArray(data.quotes) && data.quotes.length > 0) {
            quoteText = data.quotes[0].quote || data.quotes[0].text || '';
            quoteAuthor = data.quotes[0].author || 'Unknown';
        } else {
            quoteText = data.quote || data.text || data.content || '';
            quoteAuthor = data.author || 'Unknown';
        }

        return { text: quoteText, author: quoteAuthor };
    };

    const retry = () => {
        fetchDailyQuote();
    };

    return (
        <div className="quote-section">
            {loading ? (
                <p className="quote-text loading">Loading quote...</p>
            ) : error ? (
                <div className="quote-error">
                    <p>Could not load quote. {error}</p>
                    <button onClick={retry} className="retry-button">Try Again</button>
                </div>
            ) : (
                <>
                    <p className="quote-text">{quote.text}</p>
                    <div className="quote-author">- {quote.author}</div>
                </>
            )}
        </div>
    );
}