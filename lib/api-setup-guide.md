# API Setup Guide for Stop Fake AI

This guide will help you obtain and configure the API keys needed for full functionality.

## 1. GPTZero API (Text Detection)

**Purpose**: Detects AI-generated text from ChatGPT, Claude, Gemini, etc.

### Setup Steps:
1. Visit [GPTZero API](https://gptzero.me/api)
2. Sign up for an account
3. Choose a pricing plan:
   - **Free Tier**: 1,000 words/month
   - **Basic**: $10/month for 50,000 words
   - **Premium**: $50/month for 300,000 words
4. Get your API key from the dashboard
5. Add to `.env.local`:
   ```
   GPTZERO_API_KEY=your-actual-api-key-here
   ```

### Testing:
- Minimum text length: 100 characters
- Best accuracy with 300+ characters
- Supports multiple languages

## 2. Hive Moderation API (Image/Video Detection)

**Purpose**: Detects AI-generated images, deepfakes, and manipulated media.

### Setup Steps:
1. Visit [Hive AI](https://thehive.ai/)
2. Contact sales for API access (B2B product)
3. Pricing is custom based on volume:
   - Typically starts at $0.001-0.01 per image
   - Volume discounts available
4. Get your API token from the dashboard
5. Add to `.env.local`:
   ```
   HIVE_API_KEY=your-actual-api-key-here
   ```

### Supported Formats:
- Images: JPG, PNG, GIF (up to 50MB)
- Videos: MP4, AVI (up to 50MB)

### Detection Capabilities:
- AI-generated images
- Deepfakes
- Face swaps
- Synthetic media
- Image manipulation

## 3. Resemble.ai API (Audio Detection)

**Purpose**: Detects AI-generated speech, voice clones, and synthetic audio.

### Setup Steps:
1. Visit [Resemble.ai](https://www.resemble.ai/)
2. Sign up and navigate to the API section
3. Enable the "Detect" API feature
4. Pricing:
   - **Free**: 100 detections/month
   - **Pro**: $0.10 per detection
   - **Enterprise**: Custom pricing
5. Get your API key from settings
6. Add to `.env.local`:
   ```
   RESEMBLE_API_KEY=your-actual-api-key-here
   ```

### Supported Formats:
- Audio: MP3, WAV, M4A, OGG (up to 25MB)
- Max duration: 10 minutes per file

### Detection Features:
- Voice cloning detection
- Synthetic speech identification
- Deepfake audio detection
- Speaker authenticity verification

## 4. Complete Environment Configuration

After obtaining all API keys, your `.env.local` should look like:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_YEARLY_PRICE_ID=price_your-yearly-plan-id
STRIPE_PRO_PRICE_ID=price_your-pro-plan-id
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# AI Detection API Keys (REPLACE THESE!)
GPTZERO_API_KEY=your-actual-gptzero-api-key
HIVE_API_KEY=your-actual-hive-api-key
RESEMBLE_API_KEY=your-actual-resemble-api-key

# Application URL
NEXT_PUBLIC_BASE_URL=https://stopfakeai.com
```

## 5. Testing Your Setup

1. Start the development server: `npm run dev`
2. Visit http://localhost:3002/dashboard
3. Test each detection type:
   - **Text**: Paste AI-generated content (ChatGPT output works well)
   - **Image**: Upload an AI-generated image or photo
   - **Audio**: Upload a short audio clip

## 6. Cost Optimization Tips

### For Development:
- Use the free tiers during development
- Test with small files to minimize costs
- Implement caching to avoid duplicate API calls

### For Production:
- Monitor usage through each provider's dashboard
- Set up billing alerts
- Consider bulk/volume discounts
- Implement user limits to control costs

## 7. Alternative/Free Options

If budget is limited, consider:

1. **Text Detection**: 
   - Use GPTZero's free tier
   - Implement basic heuristics (repetitive patterns, etc.)

2. **Image Detection**:
   - Use open-source models (lower accuracy)
   - FakeLocator or other free tools

3. **Audio Detection**:
   - Basic spectral analysis
   - Open-source voice authenticity models

## 8. Error Handling

The application includes:
- Automatic fallback to demo mode if APIs fail
- Retry logic for transient errors
- Rate limiting to prevent abuse
- Detailed error messages for debugging

## 9. Monitoring & Analytics

Track:
- API response times
- Error rates by provider
- Usage patterns
- Cost per detection
- User satisfaction with accuracy

This setup will give you a fully functional AI detection platform!