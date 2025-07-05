# 🚀 Deployment Guide: Startup Accelerator Metaverse

This guide will help you deploy your metaverse application with:
- **Frontend**: Vercel (Free)
- **Backend**: Render (Free)
- **Database**: MongoDB Atlas (Free)

## 📋 Prerequisites

1. **Google Cloud Console Account** (for OAuth)
2. **Vercel Account** (for frontend)
3. **Render Account** (for backend)
4. **MongoDB Atlas Account** (already configured)

## 🔧 Step 1: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set Application type to "Web application"
6. Add authorized origins:
   - `http://localhost:5173` (development)
   - `https://your-app.vercel.app` (production)
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/v1/auth/google/callback` (development)
   - `https://your-backend.onrender.com/api/v1/auth/google/callback` (production)
8. Copy the Client ID and Client Secret

## 🌐 Step 2: Deploy Backend to Render

1. **Push your code to GitHub** (if not already done)
2. **Go to [Render](https://render.com/)**
3. **Create a new Web Service**
4. **Connect your GitHub repository**
5. **Configure the service**:
   - **Name**: `startup-accelerator-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd 2d-metaverse/metaverse/apps/http && npm install && npm run build`
   - **Start Command**: `cd 2d-metaverse/metaverse/apps/http && npm start`
   - **Plan**: Free

6. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=mongodb+srv://dassoham345:wS6ImjTOt3Ik57tl@cluster0.lwh5nso.mongodb.net/startup-accelerator?retryWrites=true&w=majority&appName=Cluster0
   JWT_PASSWORD=your_strong_jwt_secret_here
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=https://your-backend.onrender.com/api/v1/auth/google/callback
   FRONTEND_URL=https://your-app.vercel.app
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

7. **Deploy the service**

## 🔌 Step 3: Deploy WebSocket Server to Render

1. **Create another Web Service** for WebSocket
2. **Configure**:
   - **Name**: `startup-accelerator-websocket`
   - **Build Command**: `cd 2d-metaverse/metaverse/apps/ws && npm install && npm run build`
   - **Start Command**: `cd 2d-metaverse/metaverse/apps/ws && npm start`

3. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=mongodb+srv://dassoham345:wS6ImjTOt3Ik57tl@cluster0.lwh5nso.mongodb.net/startup-accelerator?retryWrites=true&w=majority&appName=Cluster0
   JWT_PASSWORD=same_as_backend_jwt_secret
   FRONTEND_URL=https://your-app.vercel.app
   ```

## 🎨 Step 4: Deploy Frontend to Vercel

1. **Go to [Vercel](https://vercel.com/)**
2. **Import your GitHub repository**
3. **Configure the project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `2d-metaverse/metaverse/apps/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Add Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   VITE_SOCKET_URL=https://your-websocket.onrender.com
   VITE_USE_MOCK_API=false
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

5. **Deploy the project**

## 🔄 Step 5: Update URLs

After deployment, update the following:

1. **Update Google OAuth settings** with your actual Vercel and Render URLs
2. **Update CORS settings** in backend with your Vercel URL
3. **Test the authentication flow**

## 🧪 Step 6: Testing

1. **Test email/password authentication**
2. **Test Google OAuth authentication**
3. **Test real-time features (lobby, chat)**
4. **Test all user types (Founder, Mentor, Investor)**

## 🔒 Security Notes

- Generate strong JWT secrets for production
- Keep Google OAuth credentials secure
- Use environment variables for all sensitive data
- Enable HTTPS only in production

## 📞 Support

If you encounter issues:
1. Check Render logs for backend errors
2. Check Vercel function logs for frontend issues
3. Verify all environment variables are set correctly
4. Ensure MongoDB Atlas allows connections from Render IPs

Your metaverse is now ready for users! 🎉
