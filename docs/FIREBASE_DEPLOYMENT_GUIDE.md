# 🚀 Firebase Hosting Deployment Guide

This guide will walk you through setting up automated deployment to Firebase Hosting using GitHub Actions.

## 📋 Prerequisites

Before you begin, make sure you have:

1. **Firebase Project** - Your project should already be set up in Firebase Console
2. **GitHub Repository** - Your code should be in a GitHub repository
3. **Firebase CLI** - Installed locally for initial setup
4. **Admin Access** - To both Firebase project and GitHub repository

## 🎯 **Dual Deployment Strategy**

This project is configured to work with **both Vercel and Firebase Hosting**:

- **Vercel**: Normal Next.js build with API routes (current setup)
- **Firebase Hosting**: Static export build without API routes (uses Firebase Functions instead)

The configuration automatically switches based on the `FIREBASE_BUILD` environment variable.

## 🔧 Step-by-Step Setup

### Step 1: Firebase Project Setup

1. **Enable Firebase Hosting**
   ```bash
   firebase login
   firebase init hosting
   ```
   - Select your existing project
   - Choose `out` as your public directory (already configured)
   - Configure as a single-page app: **Yes**
   - Don't overwrite existing files

2. **Generate Service Account Key**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Navigate to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file (keep it secure!)

### Step 2: GitHub Repository Setup

1. **Add Repository Secrets**
   
   Go to your GitHub repository → Settings → Secrets and variables → Actions, then add these secrets:

   **Firebase Configuration:**
   ```
   FIREBASE_PROJECT_ID=easifull-1f9e0
   FIREBASE_SERVICE_ACCOUNT_KEY=<entire-json-content-from-step-1>
   ```

   **Firebase Client Config (from your Firebase project settings):**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=easifull-1f9e0.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=easifull-1f9e0
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=easifull-1f9e0.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

   **Firebase Admin SDK Config (from your service account):**
   ```
   FIREBASE_PRIVATE_KEY_ID=your_private_key_id
   FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@easifull-1f9e0.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=your_client_id
   FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40easifull-1f9e0.iam.gserviceaccount.com
   ```

   **Stripe Configuration:**
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
   ```

   **NextAuth Configuration:**
   ```
   NEXTAUTH_SECRET=your_nextauth_secret_here
   NEXTAUTH_URL=https://easifull-1f9e0.web.app
   ```

### Step 3: Verify Workflow File

The GitHub Actions workflow (`.github/workflows/firebase-deploy.yml`) has been created with:

- ✅ **Automatic deployment** on push to main/master branch
- ✅ **Preview deployments** for pull requests
- ✅ **Environment variables** injection
- ✅ **Firebase Functions** deployment
- ✅ **Caching** for faster builds
- ✅ **Linting** before deployment

### Step 4: Test the Setup

1. **Create a test branch:**
   ```bash
   git checkout -b test-deployment
   git add .
   git commit -m "Setup Firebase deployment"
   git push origin test-deployment
   ```

2. **Create a Pull Request** to test preview deployment

3. **Merge to main** to trigger production deployment

## 🎯 Deployment Behavior

### Production Deployment (main/master branch)
- **Trigger:** Push to main or master branch
- **URL:** `https://easifull-1f9e0.web.app`
- **Includes:** Frontend + Firebase Functions

### Preview Deployment (Pull Requests)
- **Trigger:** Any pull request
- **URL:** `https://easifull-1f9e0--pr-{number}-preview.web.app`
- **Duration:** 7 days
- **Includes:** Frontend only (no functions)

## 🔍 Finding Your Firebase Configuration

### Firebase Client Config
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on the web app (</> icon)
6. Copy the config object values

### Firebase Admin SDK
1. Go to Project Settings → Service Accounts
2. Click "Generate new private key"
3. Use the values from the downloaded JSON file

### Stripe Configuration
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Developers → API keys
3. Copy the publishable key (starts with `pk_test_` or `pk_live_`)

## 🛠️ Troubleshooting

### Common Issues

1. **Build Fails - Environment Variables Missing**
   - Check all required secrets are added to GitHub
   - Verify secret names match exactly

2. **Firebase Functions Deployment Fails**
   - Check functions/package.json dependencies
   - Verify Firebase project permissions

3. **Static Export Issues**
   - API routes won't work in static export
   - Move dynamic logic to Firebase Functions

4. **Authentication Issues**
   - Update NEXTAUTH_URL to your production domain
   - Check Firebase Auth domain configuration

### Useful Commands

```bash
# Test build locally
npm run build

# Test Firebase deployment locally
firebase serve

# Check deployment status
firebase hosting:sites:list

# View deployment logs
# (Check GitHub Actions tab in your repository)
```

## 📱 Post-Deployment Checklist

- [ ] Test authentication flow
- [ ] Verify Stripe payment integration
- [ ] Check internationalization (ES/EN)
- [ ] Test responsive design
- [ ] Validate all page routes
- [ ] Check Firebase Functions logs
- [ ] Verify Stripe webhooks

## 🎉 Success!

Once everything is set up, every push to your main branch will automatically deploy your landing page to Firebase Hosting at:

**https://easifull-1f9e0.web.app**

Your GitHub Actions will handle:
- Building the Next.js application
- Running linting and tests
- Deploying to Firebase Hosting
- Deploying Firebase Functions
- Creating preview deployments for PRs

## 🔗 Useful Links

- [Firebase Console](https://console.firebase.google.com)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Next.js Static Export Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
