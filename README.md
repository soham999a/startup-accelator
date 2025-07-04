# 🚀 Startup Accelerator Metaverse

A virtual startup accelerator platform where founders can connect with mentors, pitch to investors, access resources, and network in an interactive virtual environment.

## ✨ Features

### 🧠 **Mentor Lounge**
- Browse 500+ expert mentors from top companies (Google, Microsoft, Sequoia)
- Filter by expertise, availability, and pricing
- Book 1:1 mentoring sessions
- Real-time messaging with mentors

### 💰 **Investor Island**
- Connect with 200+ active investors and VCs
- Filter by investment stage, focus area, and check size
- View portfolio companies and success metrics
- Schedule pitch meetings

### 📚 **Resource Pavilion**
- Access 1000+ curated resources (articles, videos, templates, tools)
- Filter by category, difficulty, and content type
- Download templates and guides
- Bookmark favorite resources

### 🎮 **Virtual Lobby**
- Interactive 2D virtual space
- Real-time user presence and movement
- Chat with other founders
- Navigate to different areas

### 📱 **Mobile-Friendly**
- Responsive design for all devices
- Bottom navigation for mobile
- Touch-optimized interactions
- Progressive Web App features

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Socket.io
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT tokens
- **Real-time:** WebSocket connections
- **Deployment:** Netlify (Frontend) + Railway (Backend)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/startup-accelerator-metaverse.git
cd startup-accelerator-metaverse
```

2. **Install dependencies**
```bash
cd metaverse
pnpm install
```

3. **Start development servers**
```bash
# Frontend
cd apps/frontend
npm run dev

# HTTP API (separate terminal)
cd apps/http
npm run dev

# WebSocket server (separate terminal)
cd apps/ws
npm run dev
```

4. **Open your browser**
```
http://localhost:5174
```

## 📦 Project Structure

```
metaverse/
├── apps/
│   ├── frontend/          # React frontend application
│   ├── http/             # Express API server
│   └── ws/               # Socket.io WebSocket server
├── packages/
│   └── db/               # Shared database schema
└── docs/                 # Documentation
```

## 🌐 Live Demo

**Frontend:** [https://startup-accelerator-metaverse.netlify.app](https://startup-accelerator-metaverse.netlify.app)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the startup ecosystem
- Designed for the next generation of entrepreneurs

---

**Made with ❤️ for the startup community**
