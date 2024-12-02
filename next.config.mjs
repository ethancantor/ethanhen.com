/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "picsum.photos",
            },
        ],
    },
    // webpack: (config) => {
    //     config.module.rules.push({
    //         test: /\.(jpe?g|png|svg|gif|ico|eot|ttf|woff|woff2|mp4|pdf|webm|txt)$/,
    //         type: 'asset/resource',
    //         generator: {
    //             filename: 'static/chunks/[path][name].[hash][ext]'
    //         },
    //     })

    //     return config;
    // }
};

export default nextConfig;
