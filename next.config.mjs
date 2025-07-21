/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable source maps in development to avoid warnings
  productionBrowserSourceMaps: false,
  
  // Configure webpack to handle Firebase Admin SDK better
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignore source map warnings for node_modules
      config.ignoreWarnings = [
        { module: /node_modules\/@google-cloud\/firestore/ },
        { message: /Invalid source map/ }
      ];
    }
    return config;
  },
  
  // Experimental features
  experimental: {
    // Improve performance
    optimizePackageImports: ['firebase', 'firebase-admin'],
  }
};

export default nextConfig;
