/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.FIREBASE_BUILD === 'true' && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
  }),

  productionBrowserSourceMaps: false,

  experimental: {
    optimizePackageImports: ['firebase', 'firebase-admin'],
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.ignoreWarnings = [
        { module: /node_modules\/@google-cloud\/firestore/ },
        { message: /Invalid source map/ },
      ];
    }
    return config;
  },
};

export default nextConfig;
