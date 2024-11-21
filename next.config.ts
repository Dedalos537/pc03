import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.vexels.com', 'images.mrcook.app', 'i0.wp.com', 's7d1.scene7.com', 'i2.wp.com', 'encrypted-tbn0.gstatic.com', "d31npzejelj8v1.cloudfront.net", 'th.bing.com'],
    // Opción adicional: habilitar subdominios
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.wp.com', // Cualquier subdominio de wp.com
      },
      {
        protocol: 'https',
        hostname: '**.vexels.com', // Cualquier subdominio de vexels.com
      },
    ],
  },
};

export default nextConfig;
