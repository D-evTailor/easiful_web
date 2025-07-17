// Environment configuration with Firebase Admin SDK setup
export const serviceAccount = (() => {
  try {
    // Check if we have the base64 encoded service account
    if (process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
      const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, 'base64').toString('utf-8');
      return JSON.parse(decoded);
    }
    
    // Fallback: check if we have individual environment variables
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      // Fix the private key formatting - handle both escaped and unescaped newlines
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      if (privateKey.includes('\\n')) {
        privateKey = privateKey.replace(/\\n/g, '\n');
      }
      
      return {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: privateKey,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
        universe_domain: "googleapis.com"
      };
    }
    
    // If no credentials found, return null
    console.warn("No Firebase Admin credentials found. Admin features will be disabled.");
    return null;
  } catch (error) {
    console.error("Error parsing Firebase service account:", error);
    return null;
  }
})(); 