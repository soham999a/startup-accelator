# 🔧 Environment Variables Setup Guide

This guide explains all environment variables needed for your Startup Accelerator Metaverse.

## 📁 File Structure

```
2d-metaverse/metaverse/
├── apps/
│   ├── frontend/
│   │   ├── .env                 # Development frontend
│   │   └── .env.production      # Production frontend
│   ├── http/
│   │   ├── .env                 # Development backend
│   │   └── .env.production      # Production backend
│   └── ws/
│       └── .env                 # WebSocket server
└── packages/
    └── db/
        └── .env                 # Database configuration
```

## 🔑 Required Environment Variables

### 1. Database Configuration

**File**: `packages/db/.env`
```env
DATABASE_URL="mongodb+srv://dassoham345:wS6ImjTOt3Ik57tl@cluster0.lwh5nso.mongodb.net/startup-accelerator?retryWrites=true&w=majority&appName=Cluster0"
```

### 2. Backend (HTTP API) - Development

**File**: `apps/http/.env`
```env
# Database
DATABASE_URL="mongodb+srv://dassoham345:wS6ImjTOt3Ik57tl@cluster0.lwh5nso.mongodb.net/startup-accelerator?retryWrites=true&w=majority&appName=Cluster0"

# JWT Secret
JWT_PASSWORD="startup_accelerator_secret_key_2024"

# Server
PORT=3000
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/v1/auth/google/callback"

# Frontend URL
FRONTEND_URL="http://localhost:5173"

# AI
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 3. Backend (HTTP API) - Production

**File**: `apps/http/.env.production`
```env
# Database
DATABASE_URL="mongodb+srv://dassoham345:wS6ImjTOt3Ik57tl@cluster0.lwh5nso.mongodb.net/startup-accelerator?retryWrites=true&w=majority&appName=Cluster0"

# JWT Secret (GENERATE A STRONG SECRET!)
JWT_PASSWORD="your_production_jwt_secret_here"

# Server
PORT=10000
NODE_ENV=production
CORS_ORIGIN="https://your-app.vercel.app"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
GOOGLE_REDIRECT_URI="https://your-backend.onrender.com/api/v1/auth/google/callback"

# Frontend URL
FRONTEND_URL="https://your-app.vercel.app"

# AI
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 4. Frontend - Development

**File**: `apps/frontend/.env`
```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3001
VITE_USE_MOCK_API=false
VITE_NETLIFY_FUNCTIONS=false

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 5. Frontend - Production

**File**: `apps/frontend/.env.production`
```env
VITE_API_URL=https://your-backend.onrender.com
VITE_SOCKET_URL=https://your-websocket.onrender.com
VITE_USE_MOCK_API=false
VITE_NETLIFY_FUNCTIONS=false

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## 🔐 How to Get Required Credentials

### Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project
3. Enable Google+ API
4. Create OAuth 2.0 Client ID
5. Set authorized origins and redirect URIs
6. Copy Client ID and Secret

### JWT Secret

Generate a strong secret:
```bash
# Option 1: Use Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Use OpenSSL
openssl rand -hex 64

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/64
```

### Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Copy the key

## 🚀 Deployment Environment Variables

### Render (Backend)
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=mongodb+srv://dassoham345:wS6ImjTOt3Ik57tl@cluster0.lwh5nso.mongodb.net/startup-accelerator?retryWrites=true&w=majority&appName=Cluster0
JWT_PASSWORD=your_production_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-backend.onrender.com/api/v1/auth/google/callback
FRONTEND_URL=https://your-app.vercel.app
GEMINI_API_KEY=your_gemini_api_key
```

### Vercel (Frontend)
```env
VITE_API_URL=https://your-backend.onrender.com
VITE_SOCKET_URL=https://your-websocket.onrender.com
VITE_USE_MOCK_API=false
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## ⚠️ Security Best Practices

1. **Never commit .env files** to version control
2. **Use different secrets** for development and production
3. **Rotate secrets regularly** in production
4. **Use strong, random JWT secrets** (64+ characters)
5. **Restrict OAuth redirect URIs** to your domains only
6. **Enable IP whitelisting** on MongoDB Atlas for production

## 🔄 Environment Variable Priority

1. **System environment variables** (highest priority)
2. **`.env.production`** (production only)
3. **`.env.local`** (local overrides)
4. **`.env`** (default values)

## 🧪 Testing Environment Setup

Run this command to verify your environment:
```bash
# In the backend directory
cd apps/http
node -e "
require('dotenv').config();
console.log('✅ Environment check:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
console.log('JWT_PASSWORD:', process.env.JWT_PASSWORD ? '✅ Set' : '❌ Missing');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing');
"
```

Your environment is now properly configured! 🎉
