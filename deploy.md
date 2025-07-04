# 🚀 Deployment Guide

## Quick Deploy to Netlify (FREE)

### Method 1: Drag & Drop (Fastest)
1. Build the project: `cd metaverse/apps/frontend && npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag the `dist` folder to Netlify
4. Done! Your site is live 🎉

### Method 2: GitHub Integration (Recommended)
1. Push code to GitHub (see instructions below)
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect GitHub and select your repo
5. Build settings:
   - **Base directory:** `metaverse/apps/frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `metaverse/apps/frontend/dist`
6. Deploy!

## Environment Variables for Production

Add these in Netlify dashboard under Site Settings > Environment Variables:

```
VITE_USE_MOCK_API=true
VITE_API_URL=https://your-api.railway.app
VITE_SOCKET_URL=https://your-websocket.railway.app
```

## Custom Domain (Optional)

1. Go to Site Settings > Domain management
2. Add custom domain
3. Configure DNS settings
4. Enable HTTPS (automatic)

## Performance Optimizations

- ✅ Automatic CDN
- ✅ Image optimization
- ✅ Gzip compression
- ✅ HTTP/2 support
- ✅ Global edge network
