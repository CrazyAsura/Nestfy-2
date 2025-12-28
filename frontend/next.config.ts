import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // Remove trailing slash and /api if exists to normalize
    const normalizedApiUrl = apiUrl.replace(/\/$/, '').replace(/\/api$/, '');

    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${normalizedApiUrl}/api/:path*`,
        },
        {
          source: '/uploads/:path*',
          destination: `${normalizedApiUrl}/uploads/:path*`,
        }
      ],
    };
  },
};

export default nextConfig;
