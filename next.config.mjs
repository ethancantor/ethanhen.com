
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'testing.ethanhen.com'
            },
            {
                protocol: 'https',
                hostname: 'ethanhen.com'
            },
        ]
    },
    webpack: (config)=> {
        // config.module.rules.push({
        //     test: /\.ARW|.dng|.tif/,
        //     type: 'asset/resource'
        // })

        return config
    }
};

export default nextConfig;
