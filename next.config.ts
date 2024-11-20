// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.vexels.com', 'th.bing.com'], // Agrega los dominios permitidos
  },
};

export default nextConfig;
