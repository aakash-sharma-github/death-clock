export async function GET() {
    try {
        // Try the primary API first
        try {
            const rapidApiKey = process.env.NEXT_PUBLIC_X_RAPIDAPI_KEY;
            const rapidApiHost = process.env.NEXT_PUBLIC_X_RAPIDAPI_HOST;
            const rapidApiEndpoint = process.env.NEXT_PUBLIC_X_RAPIDAPI_ENDPOINT;

            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': rapidApiKey,
                    'x-rapidapi-host': rapidApiHost,
                }
            };
            const response = await fetch(rapidApiEndpoint, options);
            if (response.ok) {
                const data = await response.json();
                return new Response(
                    JSON.stringify(data),
                    {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }

            // If primary API fails with non-ok status, throw an error to trigger fallback
            throw new Error(`Primary API returned status: ${response.status}`);

        } catch (primaryError) {
            console.error('Primary quote API failed:', primaryError);

            // Uncomment this fallback section
            const fallbackQuotes = [
                { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
                { content: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
                { content: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
                { content: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
                { content: "The time is always right to do what is right.", author: "Martin Luther King Jr." }
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
    } catch (error) {
        console.error('Error in quote API:', error);
        return new Response(
            JSON.stringify({
                error: 'Internal Server Error',
                message: error.message
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}