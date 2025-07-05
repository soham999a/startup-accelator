# 🧪 Testing Guide: Authentication & Deployment

This guide helps you test your Startup Accelerator Metaverse before and after deployment.

## 🔧 Pre-Deployment Testing (Local Development)

### 1. Environment Setup Test

```bash
# Run the environment setup script
node setup-env.js

# Install dependencies
cd metaverse
pnpm install

# Generate Prisma client
cd packages/db
pnpm prisma generate

# Push database schema
pnpm prisma db push
```

### 2. Backend API Testing

```bash
# Start the backend
cd apps/http
npm run dev

# Test endpoints (in another terminal)
curl http://localhost:3000/api/v1/avatars
```

### 3. WebSocket Server Testing

```bash
# Start WebSocket server
cd apps/ws
npm run dev

# Should see: "WebSocket server running on port 3001"
```

### 4. Frontend Testing

```bash
# Start frontend
cd apps/frontend
npm run dev

# Open http://localhost:5173
```

## 🔐 Authentication Flow Testing

### Test Cases to Verify

#### 1. Email/Password Authentication

**Signup Flow:**
1. ✅ Navigate to `/signup`
2. ✅ Fill form with valid data
3. ✅ Select user type (Founder/Mentor/Investor)
4. ✅ Submit form
5. ✅ Verify redirect to dashboard
6. ✅ Check user data in MongoDB Atlas

**Login Flow:**
1. ✅ Navigate to `/login`
2. ✅ Enter valid credentials
3. ✅ Submit form
4. ✅ Verify redirect to dashboard
5. ✅ Check authentication state

**Error Handling:**
1. ✅ Invalid email format
2. ✅ Weak password
3. ✅ Duplicate email/username
4. ✅ Wrong credentials

#### 2. Google OAuth Authentication

**Setup Required:**
1. Get Google OAuth credentials
2. Update environment variables
3. Test on localhost:5173

**Test Flow:**
1. ✅ Click "Continue with Google"
2. ✅ Google popup appears
3. ✅ Select Google account
4. ✅ Verify redirect to dashboard
5. ✅ Check user created in database

#### 3. Protected Routes

**Test Access Control:**
1. ✅ Access `/dashboard` without login → redirect to `/login`
2. ✅ Access `/lobby` without login → redirect to `/login`
3. ✅ Login and access protected routes → success
4. ✅ Logout and try protected routes → redirect to `/login`

#### 4. User Types & Profiles

**Test User Type Functionality:**
1. ✅ Founder: Can create startup profile
2. ✅ Mentor: Can create mentor profile
3. ✅ Investor: Can create investor profile
4. ✅ Profile data persists after logout/login

## 🌐 Post-Deployment Testing

### 1. Production Environment Verification

**Backend (Render):**
```bash
# Test API endpoint
curl https://your-backend.onrender.com/api/v1/avatars

# Check health
curl https://your-backend.onrender.com/health
```

**Frontend (Vercel):**
1. ✅ Visit your Vercel URL
2. ✅ Check all pages load
3. ✅ Verify API calls work
4. ✅ Test authentication

### 2. Cross-Origin Testing

**Verify CORS Configuration:**
1. ✅ Frontend can call backend API
2. ✅ WebSocket connections work
3. ✅ Google OAuth redirects properly

### 3. Database Connectivity

**MongoDB Atlas:**
1. ✅ Backend connects to database
2. ✅ User registration creates records
3. ✅ Data persists between sessions

## 🚨 Common Issues & Solutions

### Issue: Google OAuth Not Working

**Symptoms:**
- "Invalid client" error
- Redirect URI mismatch

**Solutions:**
1. Verify Google Client ID in environment
2. Check authorized redirect URIs in Google Console
3. Ensure HTTPS in production

### Issue: CORS Errors

**Symptoms:**
- "Access-Control-Allow-Origin" errors
- API calls failing from frontend

**Solutions:**
1. Update CORS_ORIGIN in backend
2. Check Render environment variables
3. Verify frontend URL is correct

### Issue: Database Connection Failed

**Symptoms:**
- "MongoServerError" in logs
- Authentication failures

**Solutions:**
1. Check MongoDB Atlas IP whitelist
2. Verify connection string
3. Ensure database user has proper permissions

### Issue: Environment Variables Not Loading

**Symptoms:**
- "undefined" values in logs
- Features not working

**Solutions:**
1. Check file names (.env vs .env.production)
2. Verify deployment platform settings
3. Restart services after changes

## 📊 Performance Testing

### Load Testing (Optional)

```bash
# Install artillery
npm install -g artillery

# Test API endpoints
artillery quick --count 10 --num 5 https://your-backend.onrender.com/api/v1/avatars
```

### Frontend Performance

1. ✅ Lighthouse score > 90
2. ✅ First Contentful Paint < 2s
3. ✅ Time to Interactive < 3s

## ✅ Pre-Launch Checklist

### Security
- [ ] Strong JWT secrets in production
- [ ] Google OAuth properly configured
- [ ] Database access restricted
- [ ] HTTPS enabled everywhere

### Functionality
- [ ] Email/password auth works
- [ ] Google OAuth works
- [ ] All user types can register
- [ ] Protected routes work
- [ ] Real-time features work
- [ ] Profile creation works

### Performance
- [ ] API response times < 500ms
- [ ] Frontend loads quickly
- [ ] WebSocket connections stable
- [ ] Database queries optimized

### Monitoring
- [ ] Error logging enabled
- [ ] Performance monitoring setup
- [ ] Database monitoring active
- [ ] Uptime monitoring configured

## 🎉 Success Criteria

Your metaverse is ready when:

1. ✅ Users can register with email or Google
2. ✅ Authentication persists across sessions
3. ✅ All user types have proper access
4. ✅ Real-time features work smoothly
5. ✅ No console errors in production
6. ✅ Mobile-responsive design works
7. ✅ Performance meets standards

Congratulations! Your Startup Accelerator Metaverse is live! 🚀
