// app/api/quote/route.js
export async function GET() {
    try {
        // Try the first quote API
        const firstApiResult = await fetchFromFirstApi();
        if (firstApiResult.success) {
            return createSuccessResponse(firstApiResult.data);
        }

        // If first API failed with status 429 (rate limit), try the second API
        if (firstApiResult.status === 429) {
            console.log('First API rate limited, trying second API');
            const secondApiResult = await fetchFromSecondApi();

            if (secondApiResult.success) {
                return createSuccessResponse(secondApiResult.data);
            }
        }

        // If both APIs failed or first API failed with non-429 error, use fallback
        return createFallbackResponse();

    } catch (error) {
        console.error('Unexpected error in quote API:', error);
        return createFallbackResponse();
    }
}

async function fetchFromFirstApi() {
    try {
        const apiKey = process.env.NEXT_PUBLIC_X_RAPIDAPI_KEY;
        const apiUrl = process.env.NEXT_PUBLIC_X_RAPIDAPI_QUOTE_ENDPOINT;
        const apihost = process.env.NEXT_PUBLIC_X_RAPIDAPI_QUOTE_HOST;
        if (!apiKey) {
            console.error('Missing API key');
            return { success: false, error: 'Missing API key' };
        }

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apihost,
                'User-Agent': 'Mozilla/5.0 (compatible; NextJS/13.0; +https://nextjs.org/)'
            },
            cache: 'no-store' // Prevent caching issues
        };

        const response = await fetch(apiUrl, options);
        console.log('First API status:', response.status);

        if (response.ok) {
            const rawData = await response.json();
            console.log('First API raw response:', JSON.stringify(rawData));

            // Format the data consistently
            const formattedData = {
                quote: rawData.text || rawData.quote || (Array.isArray(rawData) ? rawData[0]?.text : ''),
                author: rawData.author || (Array.isArray(rawData) ? rawData[0]?.author : 'Unknown')
            };

            return { success: true, data: formattedData };
        }

        return {
            success: false,
            status: response.status,
            error: `API returned status: ${response.status}`
        };
    } catch (error) {
        console.error('Error in first API fetch:', error);
        return { success: false, error: error.message };
    }
}

async function fetchFromSecondApi() {
    try {
        const apiKey = process.env.NEXT_PUBLIC_X_RAPIDAPI_KEY;
        const apiendpoint = process.env.NEXT_PUBLIC_X_RAPIDAPI_ENDPOINT;
        const apihost = process.env.NEXT_PUBLIC_X_RAPIDAPI_HOST;
        const cat = process.env.NEXT_PUBLIC_X_RAPIDAPI_CATEGORY;
        if (!apiKey) {
            console.error('Missing API key');
            return { success: false, error: 'Missing API key' };
        }

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apihost,
                'User-Agent': 'Mozilla/5.0 (compatible; NextJS/13.0; +https://nextjs.org/)'
            },
            cache: 'no-store' // Prevent caching issues
        };

        const response = await fetch(`${apiendpoint}?category=${cat}&count=1`, options);
        console.log('Second API status:', response.status);

        if (response.ok) {
            const rawData = await response.json();
            console.log('Second API raw response:', JSON.stringify(rawData));

            // Format the data consistently
            const formattedData = {
                quote: rawData.text || rawData.quote || (Array.isArray(rawData) ? rawData[0]?.text : ''),
                author: rawData.author || (Array.isArray(rawData) ? rawData[0]?.author : 'Unknown')
            };

            return { success: true, data: formattedData };
        }

        return {
            success: false,
            status: response.status,
            error: `API returned status: ${response.status}`
        };
    } catch (error) {
        console.error('Error in second API fetch:', error);
        return { success: false, error: error.message };
    }
}

function createSuccessResponse(data) {
    return new Response(
        JSON.stringify(data),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            }
        }
    );
}

function createFallbackResponse() {
    const fallbackQuotes = [
        { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt." },
        { quote: "Life is what happens when you're busy making other plans.", author: "John Lennon." },
        { quote: "The purpose of our lives is to be happy.", author: "Dalai Lama." },
        { quote: "You only live once, but if you do it right, once is enough.", author: "Mae West." },
        { quote: "The time is always right to do what is right.", author: "Martin Luther King Jr." }
    ];

    const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];

    return new Response(
        JSON.stringify(randomQuote),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            }
        }
    );
}