module.exports = {
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "Set-Cookie",
                        value: "__vercel_live_token=1; SameSite=None; Secure; Path=/",
                    },
                ],
            },
        ];
    },
};
