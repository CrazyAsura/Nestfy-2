import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'nestfy-2-production.up.railway.app',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://nestfy-2-production.up.railway.app';
    
    // Garantir que a URL tenha o protocolo para o proxy funcionar
    let normalizedApiUrl = apiUrl;
    if (!normalizedApiUrl.startsWith('http')) {
      normalizedApiUrl = `https://${normalizedApiUrl}`;
    }

    // Remove trailing slash and /api if exists to normalize
    normalizedApiUrl = normalizedApiUrl.replace(/\/$/, '').replace(/\/api$/, '');

    return [
      {
        source: '/api/:path*',
        destination: `${normalizedApiUrl}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${normalizedApiUrl}/uploads/:path*`,
      }
    ];
  },
};

export default nextConfig;
