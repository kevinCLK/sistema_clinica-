import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Advertencia: Esto permite el despliegue incluso si hay errores de linting.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Advertencia: Esto permite el despliegue incluso si hay errores de TypeScript.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
