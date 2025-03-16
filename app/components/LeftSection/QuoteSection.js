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
        const intervalId = setInterval(fetchDailyQuote, 24 * 60 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);

    const fetchDailyQuote = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/quote');
            if (!response.ok) {
                throw new Error(`Failed to fetch quote: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Extract quote text and author based on API response structure
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
            
            if (quoteText) {
                setQuote({
                    text: quoteText,
                    author: quoteAuthor
                });
            }
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
                    <p className="quote-text">{quote.text}</p>
                    <div className="quote-author">- {quote.author}</div>
                </>
            )}
        </div>
    );
}