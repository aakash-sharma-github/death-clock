// next.config.js
const nextConfig = {
    async headers() {
        return [
            {
                // Apply to all routes
                source: '/:path*',
                headers: [
                    {
                        key: 'Set-Cookie',
                        // This modifies any cookies to use SameSite=None; Secure
                        value: '__vercel_live_token=1; SameSite=None; Secure; Path=/',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;