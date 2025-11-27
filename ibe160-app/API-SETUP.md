# 🔑 API Keys Setup Guide

## ✅ Configured API Keys

### 1. Spoonacular API - Recipe Search
**Status:** ✅ CONFIGURED
**API Key:** `b0b7eb9913b94806966ecd2f1f63422f`
**Environment Variables:**
```env
SPOONACULAR_API_KEY="b0b7eb9913b94806966ecd2f1f63422f"
NEXT_PUBLIC_SPOONACULAR_API_KEY="b0b7eb9913b94806966ecd2f1f63422f"
```

**Features Enabled:**
- Recipe search by name
- Recipe search by ingredients
- Recipe details with instructions
- Nutritional information
- Random recipe suggestions

**Free Tier Limits:**
- 150 requests per day
- Upgrade available at https://spoonacular.com/food-api/pricing

**Test in app:**
1. Start server: `npm run dev`
2. Go to: http://localhost:3000/recipes
3. Search for "pasta" or any recipe
4. Should see real recipes from Spoonacular!

---

### 2. Google Gemini AI - AI Features
**Status:** ✅ CONFIGURED
**API Key:** `AIzaSyBKBh1b5qA84v8R-c3t8J1nUBa4yYdKjl0`
**Environment Variables:**
```env
GOOGLE_AI_API_KEY="AIzaSyBKBh1b5qA84v8R-c3t8J1nUBa4yYdKjl0"
NEXT_PUBLIC_GOOGLE_AI_API_KEY="AIzaSyBKBh1b5qA84v8R-c3t8J1nUBa4yYdKjl0"
```

**Features Enabled:**
- AI-enhanced recipe search
- Ingredient substitution suggestions
- Smart shopping suggestions
- Nutritional analysis
- Respects dietary preferences automatically

**Test in app:**
- AI Search: http://localhost:3000/recipes (use AI search mode)
- Substitutions: Click "Creative Mode" in recipes
- Shopping: http://localhost:3000/grocery (AI suggestions)

---

## 🔧 Setup Instructions

### If you pulled from Git:

**Windows:**
```bash
cd SG-Gruppe-Stavanger\ibe160-app
copy .env.example .env.local
# Edit .env.local with your keys (already done!)
npm install
npm run dev
```

**The `.env.local` file is already configured with:**
- ✅ Spoonacular API key
- ✅ Google AI API key
- ⏳ Other services (optional)

---

## 📊 API Usage Dashboard

### Spoonacular
- Dashboard: https://spoonacular.com/food-api/console
- Check remaining quota
- Upgrade if needed

### Google Gemini
- Console: https://aistudio.google.com/app/apikey
- Monitor usage
- Free tier: Generous limits

---

## 🚨 Troubleshooting

### "Recipe search not working"
1. Check if server is running: `npm run dev`
2. Check browser console for errors (F12)
3. Verify .env.local exists and has NEXT_PUBLIC_SPOONACULAR_API_KEY
4. Restart server after changing .env.local

### "AI features not working"
1. Check NEXT_PUBLIC_GOOGLE_AI_API_KEY in .env.local
2. Restart server: Stop (Ctrl+C) and `npm run dev`
3. Check browser console for API errors

### "403 Forbidden" or "Quota exceeded"
- Spoonacular: You've hit the 150/day limit
- Solution: Wait 24h or upgrade at spoonacular.com
- Alternative: App has fallback stub data

---

## 🔐 Security Notes

**IMPORTANT:**
- ✅ .env.local is in .gitignore (NOT committed to Git)
- ✅ API keys are safe
- ✅ NEXT_PUBLIC_ keys are safe for browser use
- ⚠️ Never share your .env.local file

**For Production (Vercel):**
Add environment variables in Vercel dashboard:
1. Go to project settings
2. Environment Variables
3. Add all keys from .env.local
4. Redeploy

---

## 📝 Optional Services (Not Yet Configured)

### Email Alerts & Contact Form (Resend)
**Get API Key:** https://resend.com
1. Sign up free (3000 emails/month free tier)
2. Get API key from dashboard
3. Add to .env.local:
```env
RESEND_API_KEY="re_xxxxx"
EMAIL_FROM="noreply@yourdomain.com"
SUPPORT_EMAIL="support@yourdomain.com"
```

**Features Enabled:**
- Contact form submissions (sends to SUPPORT_EMAIL)
- Expiration alerts (automated daily emails)
- Welcome emails (on user registration)

### Push Notifications
**Generate VAPID Keys:**
```bash
npx web-push generate-vapid-keys
```
Add to .env.local

### Database (Supabase)
**Setup:**
1. Go to https://supabase.com
2. Create project
3. Get connection string
4. Add to .env.local
5. Run: `npx prisma migrate dev`

---

## ✅ Current Status

**Fully Working:**
- ✅ Recipe search (Spoonacular)
- ✅ AI features (Google Gemini)
- ✅ Barcode scanning (Open Food Facts - no key needed)
- ✅ User preferences
- ✅ Grocery lists (LocalStorage)

**Needs Configuration:**
- ⏳ Email alerts (Resend API key)
- ⏳ Push notifications (VAPID keys)
- ⏳ Database (Supabase)

**Everything else works WITHOUT additional setup!** 🎉

---

## 🚀 Quick Start

```bash
# 1. Navigate to project
cd SG-Gruppe-Stavanger\ibe160-app

# 2. Install dependencies (if not done)
npm install

# 3. Start development server
npm run dev

# 4. Open browser
http://localhost:3000



---

**All API keys are ready to go!** 🔥
