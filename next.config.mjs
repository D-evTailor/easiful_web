/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Firebase Hosting
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
  
  // Skip API routes in static export (they're handled by Firebase Functions)
  generateBuildId: () => 'build',
  
  // Disable experimental features that might cause issues with static export
  experimental: {
    // Improve performance
    optimizePackageImports: ['firebase', 'firebase-admin'],
  },
  
  // Disable source maps in development to avoid warnings
  productionBrowserSourceMaps: false,
  
  // Configure ESLint to not fail the build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configure webpack to handle Firebase Admin SDK better
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignore source map warnings for node_modules
      config.ignoreWarnings = [
        { module: /node_modules\/@google-cloud\/firestore/ },
        { message: /Invalid source map/ }
      ];
    }
    
    // Exclude functions directory from webpack compilation
    config.externals = config.externals || [];
    config.externals.push({
      './functions': 'commonjs ./functions'
    });
    
    // Exclude functions folder from TypeScript compilation
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias['@/functions'] = false;
    
    return config;
  }
};

export default nextConfig;
