export async function GET() {
    try {
        // Try the primary API first
        const primaryResponse = await fetchPrimaryQuote();
        if (primaryResponse.success) {
            return new Response(
                JSON.stringify(primaryResponse.data),
                {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Only try fallback if primary returns 429 (Too Many Requests)
        if (primaryResponse.status === 429) {
            console.log('Primary API rate limited (429), trying fallback API');
            const fallbackResponse = await fetchFallbackQuote();

            if (fallbackResponse.success) {
                return new Response(
                    JSON.stringify(fallbackResponse.data),
                    {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }

            // If fallback also fails, return local fallback
            return createLocalFallbackResponse();
        }

        // For non-429 errors, return local fallback
        return createLocalFallbackResponse();

    } catch (error) {
        console.error('Unexpected error in quote API:', error);
        return createLocalFallbackResponse();
    }
}

async function fetchPrimaryQuote() {
    try {
        const rapidApiKey = process.env.NEXT_PUBLIC_X_RAPIDAPI_KEY;
        const rapidApiHost = process.env.NEXT_PUBLIC_X_RAPIDAPI_HOST;
        const rapidApiEndpoint = process.env.NEXT_PUBLIC_X_RAPIDAPI_ENDPOINT;

        // Check if environment variables are set
        if (!rapidApiKey || !rapidApiHost || !rapidApiEndpoint) {
            console.error('Missing environment variables for primary API');
            return {
                success: false,
                error: 'Missing environment variables for primary API'
            };
        }

        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': rapidApiKey,
                'x-rapidapi-host': rapidApiHost,
            }
        };

        const response = await fetch(rapidApiEndpoint, options);
        console.log('Primary quote API response status:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('Primary quote API response data:', JSON.stringify(data));
            return { success: true, data };
        }

        // Return failure with status code for specific handling
        return {
            success: false,
            status: response.status,
            error: `Primary API returned status: ${response.status}`
        };
    } catch (error) {
        console.error('Primary quote API error:', error);
        return {
            success: false,
            error: `Primary API error: ${error.message}`
        };
    }
}

async function fetchFallbackQuote() {
    try {
        const rapidApiKey = process.env.NEXT_PUBLIC_X_RAPIDAPI_KEY;
        const rapidApiHost = process.env.NEXT_PUBLIC_X_RAPIDAPI_QUOTE_HOST;
        const rapidApiEndpoint = process.env.NEXT_PUBLIC_X_RAPIDAPI_QUOTE_ENDPOINT;

        // Check if environment variables are set
        if (!rapidApiKey || !rapidApiHost || !rapidApiEndpoint) {
            console.error('Missing environment variables for fallback API');
            return {
                success: false,
                error: 'Missing environment variables for fallback API'
            };
        }

        const category = 'inspirational';

        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': rapidApiKey,
                'x-rapidapi-host': rapidApiHost,
            }
        };

        const response = await fetch(`${rapidApiEndpoint}?category=${category}&count=1`, options);
        console.log('Fallback quote API response status:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('Fallback quote API response data:', JSON.stringify(data));
            return { success: true, data };
        }

        return {
            success: false,
            error: `Fallback API returned status: ${response.status}`
        };
    } catch (error) {
        console.error('Fallback quote API error:', error);
        return {
            success: false,
            error: `Fallback API error: ${error.message}`
        };
    }
}

function createLocalFallbackResponse() {
    const fallbackQuotes = [
        { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt." },
        { quote: "Life is what happens when you're busy making other plans.", author: "John Lennon." },
        { quote: "The purpose of our lives is to be happy.", author: "Dalai Lama." },
        { quote: "You only live once, but if you do it right, once is enough.", author: "Mae West." },
        { quote: "The time is always right to do what is right.", author: "Martin Luther King Jr." }
    ];

    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);

    return new Response(
        JSON.stringify(fallbackQuotes[randomIndex]),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        }
    );
}