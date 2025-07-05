#!/usr/bin/env node

/**
 * Environment Setup Script for Startup Accelerator Metaverse
 * This script helps you configure environment variables for development and production
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Startup Accelerator Metaverse - Environment Setup');
console.log('====================================================\n');

// Generate a strong JWT secret
function generateJWTSecret() {
  return crypto.randomBytes(64).toString('hex');
}

// Check if file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Create environment file
function createEnvFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created: ${filePath}`);
  } catch (error) {
    console.log(`❌ Failed to create: ${filePath}`);
    console.log(`   Error: ${error.message}`);
  }
}

// Main setup function
function setupEnvironment() {
  const jwtSecret = generateJWTSecret();
  
  console.log('🔑 Generated JWT Secret:', jwtSecret);
  console.log('⚠️  Save this secret securely for production!\n');

  // Backend development .env
  const backendDevEnv = `# Database Configuration
DATABASE_URL="mongodb+srv://dassoham345:wS6ImjTOt3Ik57tl@cluster0.lwh5nso.mongodb.net/startup-accelerator?retryWrites=true&w=majority&appName=Cluster0"

# JWT Secret (change this in production)
JWT_PASSWORD="${jwtSecret}"

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Origins
CORS_ORIGIN="http://localhost:5173"

# Google OAuth Configuration
GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/v1/auth/google/callback"

# Frontend URL
FRONTEND_URL="http://localhost:5173"

# AI Configuration
GEMINI_API_KEY="your_gemini_api_key_here"
`;

  // Frontend development .env
  const frontendDevEnv = `VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3001
VITE_USE_MOCK_API=false
VITE_NETLIFY_FUNCTIONS=false

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
`;

  // Database .env
  const dbEnv = `# Database Configuration
DATABASE_URL="mongodb+srv://dassoham345:wS6ImjTOt3Ik57tl@cluster0.lwh5nso.mongodb.net/startup-accelerator?retryWrites=true&w=majority&appName=Cluster0"
`;

  // WebSocket .env
  const wsEnv = `# Database Configuration
DATABASE_URL="mongodb+srv://dassoham345:wS6ImjTOt3Ik57tl@cluster0.lwh5nso.mongodb.net/startup-accelerator?retryWrites=true&w=majority&appName=Cluster0"

# JWT Secret
JWT_PASSWORD="${jwtSecret}"

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL
FRONTEND_URL="http://localhost:5173"
`;

  // Create environment files
  const files = [
    {
      path: 'metaverse/apps/http/.env',
      content: backendDevEnv,
      description: 'Backend API environment'
    },
    {
      path: 'metaverse/apps/frontend/.env',
      content: frontendDevEnv,
      description: 'Frontend environment'
    },
    {
      path: 'metaverse/packages/db/.env',
      content: dbEnv,
      description: 'Database environment'
    },
    {
      path: 'metaverse/apps/ws/.env',
      content: wsEnv,
      description: 'WebSocket server environment'
    }
  ];

  console.log('📁 Creating environment files...\n');

  files.forEach(file => {
    const fullPath = path.join(__dirname, file.path);
    
    if (fileExists(fullPath)) {
      console.log(`⚠️  File exists: ${file.path} (skipping)`);
    } else {
      createEnvFile(fullPath, file.content);
    }
  });

  console.log('\n🎉 Environment setup complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Get Google OAuth credentials from Google Cloud Console');
  console.log('2. Get Gemini API key from Google AI Studio');
  console.log('3. Update the placeholder values in your .env files');
  console.log('4. Run: cd metaverse && pnpm install');
  console.log('5. Run: cd packages/db && pnpm prisma generate');
  console.log('6. Run: pnpm dev');
  console.log('\n📖 See ENVIRONMENT_SETUP.md for detailed instructions');
}

// Run the setup
setupEnvironment();
