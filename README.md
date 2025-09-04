# 🛡️ Stop Fake AI

> **Professional AI Content Detection Platform**

A comprehensive SaaS application that detects AI-generated content across text, images, video, and audio. Built with Next.js 14, TypeScript, and modern AI detection technologies.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Features

- **Multi-Modal Detection**: Detect AI-generated content in text, images, video, and audio
- **User Authentication**: Secure authentication with Supabase
- **Subscription Management**: Stripe integration for yearly and pro plans
- **Usage Limits**: Free tier with 3 daily checks, unlimited for paid users
- **Modern UI**: Built with Next.js 14 and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **AI Detection APIs**:
  - Text: GPTZero API
  - Image/Video: Hive Moderation API
  - Audio: Resemble.ai Detect API

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/stop-fake-ai.git
cd stop-fake-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Create the users table with the following schema:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'yearly', 'pro')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  daily_checks INTEGER DEFAULT 0,
  last_check_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a trigger to automatically create user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 4. Set up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create two subscription products:
   - Yearly Plan: $9.99/year
   - Pro Plan: $99/year
3. Set up a webhook endpoint pointing to `/api/webhook`
4. Configure webhook to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 5. Configure environment variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in all the required API keys and configuration values

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy
5. Connect your custom domain (stopfakeai.com) in Vercel dashboard

### Important Notes

- Update `NEXT_PUBLIC_BASE_URL` to https://stopfakeai.com in production
- Ensure Stripe webhook endpoint is configured with production URL (https://stopfakeai.com/api/webhook)
- Set up proper CORS and security headers
- Enable RLS (Row Level Security) in Supabase for production
- Configure DNS settings for stopfakeai.com to point to Vercel

## Making the App Functional

The application is now **fully functional** with real AI detection APIs! Here's what's been implemented:

### ✅ **Real API Integrations**

1. **GPTZero API** (Text Detection):
   - Production-ready integration with error handling
   - Automatic fallback to demo mode if API key is missing
   - Rate limiting and retry logic
   - Detailed analysis results

2. **Hive Moderation API** (Image/Video Detection):
   - Handles AI-generated images and deepfakes
   - Supports multiple file formats (JPG, PNG, GIF, MP4, AVI)
   - Advanced detection metrics and confidence scores

3. **Resemble.ai API** (Audio Detection):
   - Voice clone and synthetic speech detection
   - Detailed audio analysis with spectral data
   - Support for multiple audio formats (MP3, WAV, M4A, OGG)

### 🔧 **Enhanced Features**

- **Smart Error Handling**: Classifies errors and provides user-friendly messages
- **Rate Limiting**: Prevents API abuse with 10 requests/minute per user
- **Automatic Retries**: Handles temporary API failures gracefully
- **Fallback System**: Uses demo responses when APIs are unavailable
- **Usage Tracking**: Monitors daily limits for free tier users

### 📋 **API Setup Guide**

See `lib/api-setup-guide.md` for detailed instructions on:
- Getting API keys from each provider
- Pricing information and free tiers
- Configuration steps
- Testing your setup
- Cost optimization tips

### 🚀 **Current Status**

- **Development Mode**: Works with demo responses (placeholder API keys)
- **Production Ready**: Add real API keys to enable full functionality
- **Error Resilient**: Graceful handling of API failures
- **User Friendly**: Clear error messages and loading states

## License

MIT