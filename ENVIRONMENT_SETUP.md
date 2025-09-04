# 🔧 Environment Variables Setup Guide

## **Required API Keys for Full Functionality**

### **1. Supabase (Database & Authentication)**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Get Supabase Keys:**
1. Go to [supabase.com](https://supabase.com)
2. Create free account & new project
3. Go to Settings → API
4. Copy URL and keys

### **2. AI Detection APIs**

#### **GPTZero (Text Detection)**
```
GPTZERO_API_KEY=your-gptzero-key
```
**Get GPTZero API:**
- Go to [gptzero.me/api](https://gptzero.me/api)
- Sign up for API access
- Get your API key

#### **Hive AI (Image/Video Detection)**
```
HIVE_API_KEY=your-hive-key
```
**Get Hive API:**
- Go to [thehive.ai](https://thehive.ai)
- Create account → API section
- Get your API key

#### **Resemble AI (Audio Detection)**
```
RESEMBLE_API_KEY=your-resemble-key
```
**Get Resemble API:**
- Go to [resemble.ai](https://resemble.ai)
- Sign up → API access
- Get your API key

### **3. Stripe (Payments)**
```
STRIPE_SECRET_KEY=sk_live_or_sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_YEARLY_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
```

**Get Stripe Keys:**
1. Go to [stripe.com](https://stripe.com)
2. Create account
3. Dashboard → Developers → API Keys
4. Create products and get price IDs

## **🚀 Render Environment Setup**

### **Step 1: Add Environment Variables**
1. Go to Render Dashboard
2. Click your service
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. Add each variable above

### **Step 2: Trigger Redeploy**
After adding variables:
1. Go to **Manual Deploy** tab
2. Click **Deploy Latest Commit**
3. Wait for deployment to complete

## **📋 Quick Start (Free Tier)**

**Minimum setup to get started:**

1. **Supabase (Free)**
   - Essential for user auth and database
   - Required for app to function

2. **GPTZero (Free tier available)**
   - Text detection functionality
   - 10,000 free detections/month

3. **Stripe (Free)**
   - Only charges on successful payments
   - Required for subscription handling

## **🎯 Current App Status**

**Without API keys:** App works in demo mode with:
- ✅ Simulated detection results
- ✅ All UI functionality
- ❌ No real detection
- ❌ No user accounts
- ❌ No payments

**With API keys:** Full functionality:
- ✅ Real AI detection
- ✅ User authentication
- ✅ Payment processing
- ✅ Usage tracking
- ✅ All features working

## **🔄 Testing Your Setup**

1. **Add Supabase keys first**
2. **Redeploy on Render**
3. **Test user signup/login**
4. **Add detection API keys**
5. **Test detection features**
6. **Add Stripe for payments**

## **💡 Pro Tips**

- Start with Supabase + GPTZero for basic functionality
- Use Stripe test keys during development
- Keep API keys secure (never in code)
- Monitor usage limits on free tiers
- Upgrade APIs as you get customers

## **🆘 Troubleshooting**

**App not working after adding keys?**
1. Check all variable names match exactly
2. Ensure no extra spaces in keys
3. Redeploy after adding variables
4. Check Render logs for errors

**Still seeing demo mode?**
- Verify GPTZERO_API_KEY is set correctly
- Check API key is valid and active
- Restart the application