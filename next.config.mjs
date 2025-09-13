/** @type {import('next').NextConfig} */
const nextConfig = {
  // Conditional configuration: static export for Firebase, normal build for Vercel
  ...(process.env.FIREBASE_BUILD === 'true' && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true, // Required for static export
    },
  }),
  
  // Disable source maps in development to avoid warnings
  productionBrowserSourceMaps: false,
  
  // Configure ESLint to not fail the build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Experimental features
  experimental: {
    // Improve performance
    optimizePackageImports: ['firebase', 'firebase-admin'],
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
