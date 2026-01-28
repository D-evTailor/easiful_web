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
  
  // Image optimization for Vercel (uses sharp)
  images: process.env.FIREBASE_BUILD !== 'true' ? {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  } : undefined,
  
  // Disable source maps in production to reduce bundle size
  productionBrowserSourceMaps: false,
  
  // Configure ESLint to not fail the build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Experimental features
  experimental: {
    // Improve performance
    optimizePackageImports: ['firebase', 'firebase-admin', '@radix-ui/react-icons', 'lucide-react'],
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
