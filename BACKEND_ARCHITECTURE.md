# 🖥️ Backend Architecture - Stop Fake AI

## 📋 **You Already Have a Complete Backend!**

Your Stop Fake AI application is a **full-stack application** with a robust backend built using **Next.js 14 API Routes**. Here's what's included:

## 🏗️ **Backend Architecture Overview**

### **Technology Stack:**
- **Runtime**: Node.js (serverless functions on Render)
- **Framework**: Next.js 14 API Routes
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage (optional)
- **Payments**: Stripe APIs
- **AI Detection**: GPTZero, Hive, Resemble.ai APIs

## 🛠️ **Backend Features Already Built**

### 1. **AI Detection APIs** (`/app/api/`)

#### **Text Detection** (`/api/detect-text`)
```typescript
POST /api/detect-text
Content-Type: application/json

{
  "text": "Your text content here..."
}

Response:
{
  "likelyAI": boolean,
  "score": number,
  "details": {
    "sentences": number,
    "averagePerplexity": number,
    "burstiness": number
  }
}
```

#### **Image/Video Detection** (`/api/detect-image`)
```typescript
POST /api/detect-image
Content-Type: multipart/form-data

FormData: { file: File }

Response:
{
  "likelyAI": boolean,
  "score": number,
  "details": {
    "fileType": string,
    "fileSize": string,
    "deepfakeIndicators": string[]
  }
}
```

#### **Audio Detection** (`/api/detect-audio`)
```typescript
POST /api/detect-audio
Content-Type: multipart/form-data

FormData: { file: File }

Response:
{
  "likelyAI": boolean,
  "score": number,
  "details": {
    "duration": string,
    "voiceCloneConfidence": number,
    "artifacts": string[]
  }
}
```

### 2. **Authentication System** (`/api/auth/`)

#### **Logout** (`/api/auth/logout`)
```typescript
POST /api/auth/logout
```

**Note**: Login/Signup are handled by Supabase client-side with server-side validation.

### 3. **Stripe Payment APIs** (`/api/`)

#### **Create Checkout Session** (`/api/create-checkout-session`)
```typescript
POST /api/create-checkout-session
Content-Type: application/json

{
  "priceId": "price_1234567890"
}

Response:
{
  "sessionId": "cs_1234567890"
}
```

#### **Create Portal Session** (`/api/create-portal-session`)
```typescript
POST /api/create-portal-session

Response:
{
  "url": "https://billing.stripe.com/session/..."
}
```

#### **Webhook Handler** (`/api/webhook`)
```typescript
POST /api/webhook
Content-Type: application/json

Handles Stripe events:
- checkout.session.completed
- customer.subscription.updated
- customer.subscription.deleted
```

## 🔧 **Advanced Backend Features**

### **1. Rate Limiting** (`/lib/rate-limit.ts`)
- 10 requests per minute per user
- In-memory storage (production: use Redis)
- Automatic cleanup of expired entries

### **2. Error Handling** (`/lib/api-client.ts`)
- Automatic retries with exponential backoff
- Intelligent error classification
- Graceful fallbacks for API failures
- User-friendly error messages

### **3. Usage Tracking** (`/lib/auth.ts`)
- Daily check limits for free users
- Subscription tier management
- Automatic reset at midnight

### **4. Security Features**
- API key validation
- User authentication required
- Rate limiting protection
- Input validation and sanitization
- CORS handling

## 📊 **Database Schema (Supabase)**

### **Users Table:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  subscription_tier TEXT DEFAULT 'free' 
    CHECK (subscription_tier IN ('free', 'yearly', 'pro')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  daily_checks INTEGER DEFAULT 0,
  last_check_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Auto-trigger for new users:**
```sql
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

## 🚀 **Backend Deployment Architecture**

### **On Render:**
```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
├─────────────────┤
│   API Routes    │ ← Your Backend!
│   (Node.js)     │
├─────────────────┤
│   External APIs │
│   - GPTZero     │
│   - Hive        │
│   - Resemble.ai │
│   - Stripe      │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   Supabase      │
│   - Database    │
│   - Auth        │
│   - Storage     │
└─────────────────┘
```

## 🔄 **Request Flow Example**

### Text Detection Request:
```
1. User uploads text via frontend
   ↓
2. Frontend sends POST to /api/detect-text
   ↓
3. Backend validates user authentication
   ↓
4. Backend checks rate limits & daily usage
   ↓
5. Backend calls GPTZero API
   ↓
6. Backend processes response
   ↓
7. Backend updates usage tracking
   ↓
8. Backend returns formatted response
   ↓
9. Frontend displays results to user
```

## 📈 **Scaling Considerations**

### **Current Architecture (Perfect for SaaS):**
- **Serverless**: Automatic scaling on Render
- **Stateless**: Each request is independent
- **Cached**: Rate limiting with in-memory cache
- **External Services**: Offload heavy AI processing

### **Future Scaling Options:**
1. **Redis**: For distributed rate limiting
2. **Database Scaling**: Supabase handles this
3. **CDN**: For static assets (Render includes this)
4. **Background Jobs**: For batch processing
5. **Monitoring**: Built-in Render metrics

## 🛡️ **Security Features**

### **Already Implemented:**
- ✅ User authentication (Supabase)
- ✅ API key protection (server-side only)
- ✅ Rate limiting (abuse prevention)
- ✅ Input validation (file size, text length)
- ✅ Error handling (no sensitive data leaked)
- ✅ HTTPS enforcement (Render default)

### **Environment Security:**
- ✅ API keys in environment variables
- ✅ No secrets in codebase
- ✅ Database connection secured
- ✅ Stripe webhooks verified

## 📋 **Backend is Production-Ready!**

### **What You Have:**
- ✅ **Complete REST API** for all features
- ✅ **Authentication & Authorization** system
- ✅ **Payment Processing** with Stripe
- ✅ **AI Detection** with multiple providers
- ✅ **Rate Limiting** and abuse prevention
- ✅ **Error Handling** and fallbacks
- ✅ **Database Integration** with Supabase
- ✅ **Usage Tracking** for billing tiers

### **No Additional Backend Needed!**

Your Next.js application **IS** your backend. It's a modern, scalable, full-stack application that's ready for production deployment on Render.

## 🎯 **Summary**

You don't need a separate backend service. Your Stop Fake AI application is a **complete full-stack SaaS platform** with:

- **Frontend**: React components, pages, UI
- **Backend**: Next.js API routes (7 endpoints)
- **Database**: Supabase PostgreSQL
- **External APIs**: AI detection services
- **Payment System**: Stripe integration
- **Authentication**: Supabase Auth

Everything is ready for deployment! 🚀