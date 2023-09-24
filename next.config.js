/** @type {import('next').NextConfig} */

const local = "http://localhost:3000";
const prod = "https://synchroflow.vercel.app";

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_URL: local,
    NEXTAUTH_SECRET: "41582306921153645163930625375900 ",
  },
};

module.exports = nextConfig;
