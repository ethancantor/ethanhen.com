
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config)=> {
        // config.module.rules.push({
        //     test: /\.ARW|.dng|.tif/,
        //     type: 'asset/resource'
        // })

        return config
    }
};

export default nextConfig;
