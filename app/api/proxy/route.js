export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return new Response(
            JSON.stringify({ error: 'URL parameter is required' }),
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': 'true'
                }
            }
        );
    }

    try {
        // Validate URL to prevent proxying to internal network resources
        const parsedUrl = new URL(url);
        const disallowedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '[::1]'];

        if (disallowedHosts.includes(parsedUrl.hostname) ||
            /^192\.168\./.test(parsedUrl.hostname) ||
            /^10\./.test(parsedUrl.hostname) ||
            /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(parsedUrl.hostname)) {
            return new Response(
                JSON.stringify({ error: 'Proxying to internal network resources is not allowed' }),
                {
                    status: 403,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': 'true'
                    }
                }
            );
        }

        // Add additional headers for the external request
        const fetchOptions = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; NextJS/13.0; +https://nextjs.org/)'
            },
            next: { revalidate: 0 } // Next.js 13+ way to prevent caching
        };

        const response = await fetch(url, fetchOptions);
        console.error(`Proxy request to ${url} status: ${response.status}`); // For Vercel logs

        // Check content type before assuming JSON
        const contentType = response.headers.get('content-type');
        let data;

        try {
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                // Handle non-JSON responses
                const text = await response.text();
                data = { text: text, contentType: contentType };
            }
        } catch (parseError) {
            console.error('Error parsing response:', parseError);
            const text = await response.text();
            data = { text: text, parseError: parseError.message };
        }

        return new Response(
            JSON.stringify(data),
            {
                status: response.status,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': 'true',
                    'Cache-Control': 'no-store, max-age=0'
                }
            }
        );
    } catch (error) {
        console.error('Proxy request error:', error);
        return new Response(
            JSON.stringify({
                error: 'Error processing proxy request',
                message: error.message,
                url: url
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': 'true'
                }
            }
        );
    }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '86400'
        }
    });
}