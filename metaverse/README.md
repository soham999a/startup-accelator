# 🚀 Startup Accelerator Metaverse

A 2D multiplayer real-time environment where startup founders can pitch, mentors can guide, and investors can interact through different virtual spaces.

## 🛠️ Tech Stack

- **Frontend**: React.js + TypeScript + TailwindCSS + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB + Prisma ORM
- **Real-time**: Socket.IO
- **Authentication**: JWT
- **Package Manager**: pnpm (Turborepo)

## 📋 Prerequisites

1. **Node.js** (v18 or higher) - Download from: https://nodejs.org/
2. **MongoDB** - Local installation or MongoDB Atlas (cloud)
3. **pnpm** - Install with: `npm install -g pnpm`

## 🚀 Quick Start

### Option 1: Using the Startup Script (Windows)
```bash
# Navigate to the project directory
cd "c:\Users\code7\Desktop\metaverse game\2d-metaverse\metaverse"

# Run the startup script
start.bat
```

### Option 2: Manual Setup
```bash
# 1. Install dependencies
pnpm install

# 2. Generate Prisma client
cd packages/db && pnpm prisma generate && cd ../..

# 3. Start all services
pnpm dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **WebSocket Server**: http://localhost:3001

## 👥 User Types

- **🚀 Founders** - Create startups, pitch to investors
- **🧠 Mentors** - Guide startups, conduct sessions
- **💰 Investors** - Fund startups, attend pitches

## 🏛️ Virtual Spaces

1. **Lobby** - Main gathering area with real-time presence
2. **Startup Booths** - Individual startup showcase spaces
3. **Pitch Stage** - Live presentations with Q&A
4. **Mentor Lounge** - 1:1 guidance sessions
5. **Investor Island** - Premium networking zone
6. **Resource Pavilion** - Learning materials and tools

## 🔧 Environment Setup

All `.env` files are pre-configured. For MongoDB Atlas, update the `DATABASE_URL` in:
- `apps/http/.env`
- `apps/ws/.env`
- `packages/db/.env`

## 🎯 Getting Started

1. **Install Node.js** from https://nodejs.org/
2. **Run the startup script** or follow manual setup
3. **Open** http://localhost:5173
4. **Sign up** and choose your user type
5. **Explore** the metaverse and connect with others!

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
