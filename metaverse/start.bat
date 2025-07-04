@echo off
echo 🚀 Starting Startup Accelerator Metaverse...
echo.

echo 📦 Installing dependencies...
call pnpm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo 🔧 Generating Prisma client...
cd packages\db
call pnpm prisma generate
if %errorlevel% neq 0 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
)
cd ..\..

echo 🌟 Starting all services...
echo.
echo 📱 Frontend will be available at: http://localhost:5173
echo 🔗 Backend API will be available at: http://localhost:3000
echo 🔌 WebSocket server will be available at: http://localhost:3001
echo.
echo Press Ctrl+C to stop all services
echo.

call pnpm dev
