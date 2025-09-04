# 🚀 Render Deployment Guide for Stop Fake AI

Deploy your Stop Fake AI application to Render with this comprehensive guide.

## 🌟 Why Render?

- **Easy deployment** from GitHub
- **Automatic HTTPS** and SSL certificates
- **Free tier** available for testing
- **Custom domains** supported
- **Environment variables** management
- **Auto-deploy** from GitHub commits

## 📋 Prerequisites

- ✅ GitHub repository: `https://github.com/waalid2540/stop-fake-ai`
- ✅ Render account (sign up at [render.com](https://render.com))
- ✅ API keys ready (GPTZero, Hive, Resemble.ai, Supabase, Stripe)

## 🚀 Step-by-Step Deployment

### 1. Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended for easy integration)
3. Connect your GitHub account

### 2. Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `waalid2540/stop-fake-ai`
3. Configure the service:

**Basic Settings:**
- **Name**: `stop-fake-ai`
- **Root Directory**: `.` (leave empty)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`

**Build & Deploy:**
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm start`

### 3. Environment Variables

Add these environment variables in Render dashboard:

#### **Required for Basic Functionality:**
```env
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://stop-fake-ai.onrender.com
```

#### **Supabase (Database & Auth):**
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

#### **Stripe (Billing):**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_YEARLY_PRICE_ID=price_your-yearly-plan-id
STRIPE_PRO_PRICE_ID=price_your-pro-plan-id
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

#### **AI Detection APIs:**
```env
GPTZERO_API_KEY=your-gptzero-api-key
HIVE_API_KEY=your-hive-api-key
RESEMBLE_API_KEY=your-resemble-api-key
```

### 4. Deploy!
1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your GitHub repo
   - Install dependencies (`npm ci`)
   - Build the application (`npm run build`)
   - Start the server (`npm start`)

## 🌐 Custom Domain Setup (stopfakeai.com)

### 1. In Render Dashboard:
1. Go to your service → **"Settings"** → **"Custom Domains"**
2. Add domain: `stopfakeai.com`
3. Add domain: `www.stopfakeai.com` (optional)
4. Render will provide DNS instructions

### 2. Configure DNS:
Add these records to your domain provider:

**For apex domain (stopfakeai.com):**
- Type: `CNAME` or `ALIAS`
- Name: `@` or leave empty
- Value: `stop-fake-ai.onrender.com`

**For www subdomain (optional):**
- Type: `CNAME`
- Name: `www`
- Value: `stop-fake-ai.onrender.com`

### 3. Update Environment Variables:
```env
NEXT_PUBLIC_BASE_URL=https://stopfakeai.com
```

### 4. Update Stripe Webhook:
- Stripe Dashboard → Webhooks
- Update endpoint URL to: `https://stopfakeai.com/api/webhook`

## 🔧 Render Configuration File

The included `render.yaml` provides Infrastructure as Code:

```yaml
services:
  - type: web
    name: stop-fake-ai
    env: node
    plan: starter
    buildCommand: npm ci && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: NEXT_PUBLIC_BASE_URL
        value: https://stop-fake-ai.onrender.com
    autoDeploy: true
```

## 💰 Pricing Plans

**Free Tier:**
- 750 hours/month (enough for testing)
- Automatic sleep after 15 minutes of inactivity
- 0.1 CPU, 512MB RAM

**Starter Plan ($7/month):**
- Always on, no sleeping
- Custom domains
- 0.5 CPU, 512MB RAM

**Standard Plan ($25/month):**
- Higher performance
- 1 CPU, 2GB RAM

## 📊 Monitoring & Logs

### View Logs:
1. Render Dashboard → Your Service → **"Logs"**
2. Real-time deployment and runtime logs
3. Filter by log level (info, error, etc.)

### Monitor Performance:
1. **"Metrics"** tab shows:
   - CPU usage
   - Memory usage
   - Response times
   - Error rates

## 🔄 Auto-Deploy Setup

**Already configured!** Your app will automatically redeploy when you push to GitHub:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```
3. Render automatically detects changes and redeploys

## ✅ Post-Deployment Checklist

- [ ] **Test all pages**: Homepage, Dashboard, Pricing, Auth
- [ ] **Test AI detection**: Text, Image, Audio uploads
- [ ] **Test authentication**: Signup, Login, Logout
- [ ] **Test billing**: Stripe checkout (use test mode)
- [ ] **Check logs**: No errors in Render dashboard
- [ ] **Test custom domain**: stopfakeai.com resolves correctly
- [ ] **SSL certificate**: HTTPS working properly
- [ ] **Environment variables**: All APIs working

## 🐛 Troubleshooting

### Common Issues:

**Build Fails:**
- Check Node.js version compatibility
- Ensure all dependencies in `package.json`
- Review build logs in Render dashboard

**Environment Variables:**
- Verify all required variables are set
- Check for typos in variable names
- Ensure no trailing spaces in values

**API Errors:**
- Test API keys individually
- Check rate limits on external APIs
- Review application logs

**Custom Domain:**
- DNS propagation can take up to 48 hours
- Use `dig` or online tools to check DNS records
- Ensure CNAME points to correct Render URL

## 🎉 Success!

Your Stop Fake AI platform is now live on Render! 

**Production URL**: `https://stop-fake-ai.onrender.com`
**Custom Domain**: `https://stopfakeai.com` (once DNS configured)

Ready to detect AI-generated content at scale! 🚀