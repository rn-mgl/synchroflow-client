/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXTAUTH_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  images: { remotePatterns: [{ hostname: "res.cloudinary.com" }] },
};

const mp3Config = {
  // Turbopack handles static assets automatically
  // Audio files (.mp3, .ogg, .wav) are supported out of the box
  experimental: {
    turbo: {
      rules: {
        "*.mp3": {
          loaders: ["@vercel/turbopack-loader"],
          as: "*.js",
        },
        "*.ogg": {
          loaders: ["@vercel/turbopack-loader"],
          as: "*.js",
        },
        "*.wav": {
          loaders: ["@vercel/turbopack-loader"],
          as: "*.js",
        },
      },
    },
  },

  // Keep webpack config as fallback for production builds
  webpack(config, options) {
    const { isServer } = options;
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve("url-loader"),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve("file-loader"),
            publicPath: `${config.assetPrefix}/_next/static/images/`,
            outputPath: `${isServer ? "../" : ""}static/images/`,
            name: "[name]-[hash].[ext]",
            esModule: config.esModule || false,
          },
        },
      ],
    });

    return config;
  },
};

module.exports = { ...nextConfig, ...mp3Config };
