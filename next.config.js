/** @type {import('next').NextConfig} */

const local = "http://localhost:3000";
const prod = "https://synchroflow.vercel.app";

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_URL: prod,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  images: { remotePatterns: [{ hostname: "res.cloudinary.com" }] },
};

module.exports = nextConfig;
