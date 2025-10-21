import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Désactiver Turbopack pour les API routes qui utilisent Sharp
    turbo: {
      rules: {
        '*.{js,ts,tsx}': {
          loaders: ['swc-loader'],
          as: '*.js'
        }
      }
    },
    serverComponentsExternalPackages: ['sharp']
  },
  // Configuration pour Sharp sur Vercel
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('sharp');
    }
    return config;
  }
};

export default nextConfig;
