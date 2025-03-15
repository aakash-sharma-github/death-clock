export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return new Response(
            JSON.stringify({ error: 'URL parameter is required' }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
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
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const response = await fetch(url);
        const data = await response.json();

        return new Response(
            JSON.stringify(data),
            {
                status: response.status,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        console.error('Proxy request error:', error);
        return new Response(
            JSON.stringify({ error: 'Error processing proxy request', message: error.message }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
} 