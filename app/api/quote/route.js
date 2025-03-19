export async function GET() {
    try {
        // Try the first quote API
        const firstApiResult = await fetchFromFirstApi();
        if (firstApiResult.success) {
            return createSuccessResponse(firstApiResult.data);
        }

        // If first API failed with status 429 (rate limit), try the second API
        if (firstApiResult.status === 429) {
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
        // Changed to server-only environment variables (without NEXT_PUBLIC_)
        const apiKey = process.env.RAPIDAPI_KEY;
        const apiUrl = process.env.RAPIDAPI_ENDPOINT;
        const apihost = process.env.RAPIDAPI_HOST;

        // Enhanced validation for all required environment variables
        if (!apiKey || !apiUrl || !apihost) {
            console.error('Missing required environment variables for first API');
            return { success: false, error: 'Missing configuration' };
        }

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apihost,
                'User-Agent': 'Mozilla/5.0 (compatible; NextJS/13.0; +https://nextjs.org/)'
            },
            next: { revalidate: 0 } // Next.js 13+ way to prevent caching
        };

        const response = await fetch(apiUrl, options);

        if (response.ok) {
            const rawData = await response.json();

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
        // Changed to server-only environment variables (without NEXT_PUBLIC_)
        const apiKey = process.env.RAPIDAPI_KEY;
        const apiendpoint = process.env.RAPIDAPI_QUOTE_ENDPOINT;
        const apihost = process.env.RAPIDAPI_QUOTE_HOST;
        const cat = process.env.RAPIDAPI_CATEGORY;

        // Enhanced validation for all required environment variables
        if (!apiKey || !apiendpoint || !apihost) {
            console.error('Missing required environment variables for second API');
            return { success: false, error: 'Missing configuration' };
        }

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apihost,
                'User-Agent': 'Mozilla/5.0 (compatible; NextJS/13.0; +https://nextjs.org/)'
            },
            next: { revalidate: 0 } // Next.js 13+ way to prevent caching
        };

        const response = await fetch(`${apiendpoint}?category=${cat || 'inspirational'}&count=1`, options);

        if (response.ok) {
            const rawData = await response.json();

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
        { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { quote: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
        { quote: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
        { quote: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
        { quote: "The time is always right to do what is right.", author: "Martin Luther King Jr." }
    ];

    const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];

    console.error('Using fallback quote due to API failures');

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