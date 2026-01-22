import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deshabilitar Turbopack y usar webpack para webpack config
  experimental: {
    turbopack: false,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Excluir módulos de servidor del cliente
        "openid-client": false,
        "@panva/hkdf": false,
        "@panva/asn1.js": false,
      };
    }
    return config;
  },
};

export default nextConfig;
