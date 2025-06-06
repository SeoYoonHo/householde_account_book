import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
  },
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
