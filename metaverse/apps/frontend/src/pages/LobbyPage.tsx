import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  Building2, 
  Mic, 
  GraduationCap, 
  Coins, 
  BookOpen,
  ArrowRight,
  Clock,
  Megaphone,
  MapPin
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { cn, getUserTypeIcon, getUserTypeColor, getTimeAgo } from '../lib/utils'
import io, { Socket } from 'socket.io-client'

interface OnlineUser {
  id: string
  username: string
  userType: string
  x: number
  y: number
  socketId: string
}

interface Announcement {
  id: string
  title: string
  content: string
  type: 'general' | 'event' | 'urgent'
  createdAt: string
  isPinned: boolean
}

const LobbyPage: React.FC = () => {
  const { user, token } = useAuthStore()
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Welcome to Startup Accelerator!',
      content: 'Join us for an exciting journey of innovation and growth. Connect with mentors, pitch to investors, and build the future.',
      type: 'general',
      createdAt: new Date().toISOString(),
      isPinned: true
    },
    {
      id: '2',
      title: 'Pitch Day Tomorrow!',
      content: 'Don\'t miss our weekly pitch day tomorrow at 3 PM. Register your startup for a chance to present to top investors.',
      type: 'event',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isPinned: false
    }
  ])
  const [currentUser, setCurrentUser] = useState<{ x: number; y: number } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const socketRef = useRef<Socket | null>(null)

  const zones = [
    {
      name: 'Startup Booths',
      href: '/startup-booth',
      icon: Building2,
      description: 'Showcase your startup',
      color: 'bg-purple-500',
      position: { x: 100, y: 100 }
    },
    {
      name: 'Pitch Stage',
      href: '/pitch-stage',
      icon: Mic,
      description: 'Present to investors',
      color: 'bg-red-500',
      position: { x: 300, y: 100 }
    },
    {
      name: 'Mentor Lounge',
      href: '/mentor-lounge',
      icon: GraduationCap,
      description: 'Get expert guidance',
      color: 'bg-green-500',
      position: { x: 500, y: 100 }
    },
    {
      name: 'Investor Island',
      href: '/investor-island',
      icon: Coins,
      description: 'Connect with investors',
      color: 'bg-yellow-500',
      position: { x: 200, y: 250 }
    },
    {
      name: 'Resource Pavilion',
      href: '/resource-pavilion',
      icon: BookOpen,
      description: 'Learning materials',
      color: 'bg-blue-500',
      position: { x: 400, y: 250 }
    }
  ]

  // Initialize Socket.IO connection
  useEffect(() => {
    if (token) {
      const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001', {
        auth: { token },
        timeout: 5000,
        forceNew: true
      })

      socketRef.current = socket

      socket.on('connect', () => {
        console.log('Connected to lobby')
        // Join the main lobby space
        socket.emit('join-space', { spaceId: 'lobby' })
      })

      socket.on('connect_error', (error) => {
        console.warn('Socket connection failed (backend not available):', error.message)
        // Continue without real-time features
      })

      socket.on('space-joined', (data) => {
        console.log('Joined lobby space:', data)
        setCurrentUser(data.spawn)
        setOnlineUsers(data.users)
      })

      socket.on('user-joined', (userData) => {
        console.log('User joined:', userData)
        setOnlineUsers(prev => [...prev, userData])
      })

      socket.on('user-left', (data) => {
        console.log('User left:', data)
        setOnlineUsers(prev => prev.filter(u => u.id !== data.userId))
      })

      socket.on('user-moved', (data) => {
        setOnlineUsers(prev => 
          prev.map(u => 
            u.id === data.userId 
              ? { ...u, x: data.x, y: data.y }
              : u
          )
        )
      })

      socket.on('error', (error) => {
        console.error('Socket error:', error)
      })

      return () => {
        socket.disconnect()
      }
    }
  }, [token])

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 600
    canvas.height = 400

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#f0f9ff')
    gradient.addColorStop(1, '#e0e7ff')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    ctx.setLineDash([2, 2])
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }
    ctx.setLineDash([])

    // Draw zones with better styling
    zones.forEach(zone => {
      const x = zone.position.x
      const y = zone.position.y

      // Zone background
      ctx.fillStyle = getZoneColor(zone.color)
      ctx.fillRect(x - 30, y - 30, 60, 60)

      // Zone border
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.strokeRect(x - 30, y - 30, 60, 60)

      // Zone icon (simplified)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(getZoneIcon(zone.name), x, y + 5)

      // Zone label
      ctx.fillStyle = '#1f2937'
      ctx.font = '10px Arial'
      ctx.fillText(zone.name.split(' ')[0], x, y + 45)
    })

    // Draw current user
    if (currentUser) {
      const x = currentUser.x * 40 + 20
      const y = currentUser.y * 40 + 20

      // User shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
      ctx.beginPath()
      ctx.arc(x + 2, y + 2, 12, 0, Math.PI * 2)
      ctx.fill()

      // User circle
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(x, y, 12, 0, Math.PI * 2)
      ctx.fill()

      // User border
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()

      // User label
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 8px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('YOU', x, y + 2)
    }

    // Draw other users
    onlineUsers.forEach(user => {
      if (user.x !== undefined && user.y !== undefined) {
        const x = user.x * 40 + 20
        const y = user.y * 40 + 20

        // User shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
        ctx.beginPath()
        ctx.arc(x + 1, y + 1, 10, 0, Math.PI * 2)
        ctx.fill()

        // User circle
        ctx.fillStyle = getUserColor(user.userType)
        ctx.beginPath()
        ctx.arc(x, y, 10, 0, Math.PI * 2)
        ctx.fill()

        // User border
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 1
        ctx.stroke()

        // User initial
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 7px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(user.username[0].toUpperCase(), x, y + 2)
      }
    })
  }, [currentUser, onlineUsers])

  const getZoneColor = (colorClass: string) => {
    const colorMap: { [key: string]: string } = {
      'bg-purple-500': '#8b5cf6',
      'bg-red-500': '#ef4444',
      'bg-green-500': '#10b981',
      'bg-yellow-500': '#f59e0b',
      'bg-blue-500': '#3b82f6'
    }
    return colorMap[colorClass] || '#6b7280'
  }

  const getZoneIcon = (zoneName: string) => {
    const iconMap: { [key: string]: string } = {
      'Startup Booths': '🏢',
      'Pitch Stage': '🎤',
      'Mentor Lounge': '🎓',
      'Investor Island': '💰',
      'Resource Pavilion': '📚'
    }
    return iconMap[zoneName] || '📍'
  }

  const getUserColor = (userType: string) => {
    const colorMap: { [key: string]: string } = {
      'FOUNDER': '#3b82f6',
      'MENTOR': '#10b981',
      'INVESTOR': '#f59e0b'
    }
    return colorMap[userType] || '#6b7280'
  }

  // Handle canvas click for movement
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !socketRef.current) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const x = Math.floor(((event.clientX - rect.left) * scaleX) / 40)
    const y = Math.floor(((event.clientY - rect.top) * scaleY) / 40)

    // Ensure coordinates are within bounds
    const boundedX = Math.max(0, Math.min(14, x)) // 600/40 = 15 columns
    const boundedY = Math.max(0, Math.min(9, y))  // 400/40 = 10 rows

    // Update current user position immediately for smooth UX
    setCurrentUser({ x: boundedX, y: boundedY })

    // Emit movement to server
    if (socketRef.current) {
      socketRef.current.emit('move', { x: boundedX, y: boundedY })
    }
  }

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return '🚨'
      case 'event':
        return '📅'
      default:
        return '📢'
    }
  }

  const getAnnouncementColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20'
      case 'event':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
      default:
        return 'border-gray-300 bg-gray-50 dark:bg-gray-800'
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🏛️ Startup Accelerator Lobby
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to the heart of innovation! Navigate to different zones and connect with the community.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Canvas Area */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Virtual Space
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4" />
                <span>{onlineUsers.length + (currentUser ? 1 : 0)} online</span>
              </div>
            </div>
            
            <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-700 shadow-inner">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full h-auto cursor-crosshair hover:cursor-pointer transition-all duration-200"
                onClick={handleCanvasClick}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  imageRendering: 'pixelated'
                }}
              />
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                🖱️ Click anywhere to move your avatar around the virtual space
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  You
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  Founders
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Mentors
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  Investors
                </div>
              </div>
            </div>
          </div>

          {/* Zone Navigation */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {zones.map((zone) => {
              const Icon = zone.icon
              return (
                <Link
                  key={zone.name}
                  to={zone.href}
                  className="group bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn('p-2 rounded-lg text-white', zone.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600">
                        {zone.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {zone.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Online Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Online Now ({onlineUsers.length + (currentUser ? 1 : 0)})
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {/* Current User */}
              {currentUser && user && (
                <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="relative">
                    <div className="h-10 w-10 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.username}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        user.firstName?.[0]?.toUpperCase() || user.username[0]?.toUpperCase()
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-700 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.username
                      } (You)
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        getUserTypeColor(user.userType)
                      )}>
                        {getUserTypeIcon(user.userType)} {user.userType}
                      </span>
                      {currentUser && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({currentUser.x}, {currentUser.y})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Other Users */}
              {onlineUsers.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No other users online
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Invite friends to join!
                  </p>
                </div>
              ) : (
                onlineUsers.map((onlineUser) => (
                  <div
                    key={onlineUser.id}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 cursor-pointer group"
                    onClick={() => {
                      // toast.success(`👋 Say hi to ${onlineUser.username}!`)
                    }}
                  >
                    <div className="relative">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium",
                        getUserColor(onlineUser.userType)
                      )}>
                        {onlineUser.profileImage ? (
                          <img
                            src={onlineUser.profileImage}
                            alt={onlineUser.username}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          onlineUser.username[0]?.toUpperCase()
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-700 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white group-hover:text-brand-primary-600 dark:group-hover:text-brand-primary-400 transition-colors">
                        {onlineUser.firstName && onlineUser.lastName
                          ? `${onlineUser.firstName} ${onlineUser.lastName}`
                          : onlineUser.username
                        }
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          getUserTypeColor(onlineUser.userType)
                        )}>
                          {getUserTypeIcon(onlineUser.userType)} {onlineUser.userType}
                        </span>
                        {onlineUser.x !== undefined && onlineUser.y !== undefined && (
                          <span className="text-xs text-gray-400">
                            ({onlineUser.x}, {onlineUser.y})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* User Statistics */}
            {onlineUsers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {onlineUsers.filter(u => u.userType === 'FOUNDER').length}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Founders</div>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {onlineUsers.filter(u => u.userType === 'MENTOR').length}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Mentors</div>
                  </div>
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                      {onlineUsers.filter(u => u.userType === 'INVESTOR').length}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Investors</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Announcements */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📢 Announcements
            </h3>
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={cn(
                    'p-3 rounded-lg border-l-4',
                    getAnnouncementColor(announcement.type)
                  )}
                >
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">{getAnnouncementIcon(announcement.type)}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {announcement.title}
                        {announcement.isPinned && (
                          <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                            Pinned
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {announcement.content}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {getTimeAgo(announcement.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LobbyPage
