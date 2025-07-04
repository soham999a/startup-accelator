import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Users,
  Clock,
  Calendar,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Star,
  Award,
  Trophy,
  Target,
  Zap,
  Send,
  Eye,
  Heart,
  Share2,
  Download,
  Settings,
  MoreVertical
} from 'lucide-react'
import { cn, getUserTypeColor, getUserTypeIcon } from '../lib/utils'
import toast from 'react-hot-toast'

interface PitchSession {
  id: string
  title: string
  presenter: {
    id: string
    name: string
    company: string
    userType: string
    avatar?: string
  }
  description: string
  startTime: Date
  duration: number // in minutes
  status: 'upcoming' | 'live' | 'ended'
  viewers: number
  likes: number
  category: string
  tags: string[]
  isRecorded: boolean
}

interface ChatMessage {
  id: string
  userId: string
  username: string
  userType: string
  message: string
  timestamp: Date
  type: 'message' | 'reaction' | 'system'
}

interface Reaction {
  type: 'like' | 'love' | 'clap' | 'fire'
  count: number
  emoji: string
}

const PitchStagePage: React.FC = () => {
  const { user } = useAuthStore()
  const [currentPitch, setCurrentPitch] = useState<PitchSession | null>(null)
  const [upcomingPitches, setUpcomingPitches] = useState<PitchSession[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [reactions, setReactions] = useState<Reaction[]>([
    { type: 'like', count: 0, emoji: '👍' },
    { type: 'love', count: 0, emoji: '❤️' },
    { type: 'clap', count: 0, emoji: '👏' },
    { type: 'fire', count: 0, emoji: '🔥' }
  ])
  const [isVideoMuted, setIsVideoMuted] = useState(false)
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'AI/ML', 'Healthcare', 'FinTech', 'EdTech', 'SaaS', 'E-commerce']

  useEffect(() => {
    loadPitchData()
    // Simulate real-time updates
    const interval = setInterval(() => {
      updateViewerCount()
      addRandomChatMessage()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const loadPitchData = () => {
    // Mock current live pitch
    const livePitch: PitchSession = {
      id: '1',
      title: 'TechFlow AI: Revolutionizing Workflow Automation',
      presenter: {
        id: '1',
        name: 'Sarah Chen',
        company: 'TechFlow AI',
        userType: 'FOUNDER',
        avatar: undefined
      },
      description: 'Join us as we demonstrate how our AI-powered platform is transforming business operations across industries.',
      startTime: new Date(Date.now() - 10 * 60 * 1000), // Started 10 minutes ago
      duration: 30,
      status: 'live',
      viewers: 247,
      likes: 89,
      category: 'AI/ML',
      tags: ['AI', 'Automation', 'SaaS', 'Enterprise'],
      isRecorded: true
    }

    // Mock upcoming pitches
    const upcoming: PitchSession[] = [
      {
        id: '2',
        title: 'HealthConnect: Telemedicine for Rural Areas',
        presenter: {
          id: '2',
          name: 'Dr. Priya Patel',
          company: 'HealthConnect',
          userType: 'FOUNDER'
        },
        description: 'Bridging the healthcare gap with AI-powered telemedicine solutions.',
        startTime: new Date(Date.now() + 30 * 60 * 1000), // In 30 minutes
        duration: 25,
        status: 'upcoming',
        viewers: 0,
        likes: 0,
        category: 'Healthcare',
        tags: ['Healthcare', 'AI', 'Telemedicine'],
        isRecorded: true
      },
      {
        id: '3',
        title: 'GreenTech Solutions: Smart City IoT Platform',
        presenter: {
          id: '3',
          name: 'Mike Rodriguez',
          company: 'GreenTech Solutions',
          userType: 'FOUNDER'
        },
        description: 'Sustainable technology solutions for the cities of tomorrow.',
        startTime: new Date(Date.now() + 90 * 60 * 1000), // In 90 minutes
        duration: 20,
        status: 'upcoming',
        viewers: 0,
        likes: 0,
        category: 'IoT',
        tags: ['IoT', 'Sustainability', 'Smart Cities'],
        isRecorded: true
      }
    ]

    setCurrentPitch(livePitch)
    setUpcomingPitches(upcoming)

    // Mock chat messages
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        userId: 'user1',
        username: 'Alex Kim',
        userType: 'INVESTOR',
        message: 'Great presentation! What\'s your customer acquisition cost?',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: 'message'
      },
      {
        id: '2',
        userId: 'user2',
        username: 'Maria Gonzalez',
        userType: 'MENTOR',
        message: 'Impressive AI capabilities. How do you handle data privacy?',
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
        type: 'message'
      },
      {
        id: '3',
        userId: 'system',
        username: 'System',
        userType: 'SYSTEM',
        message: 'John Smith joined the pitch',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        type: 'system'
      }
    ]

    setChatMessages(mockMessages)
  }

  const updateViewerCount = () => {
    if (currentPitch) {
      setCurrentPitch(prev => prev ? {
        ...prev,
        viewers: prev.viewers + Math.floor(Math.random() * 5) - 2
      } : null)
    }
  }

  const addRandomChatMessage = () => {
    const randomMessages = [
      'This is amazing!',
      'What about scalability?',
      'Impressive demo!',
      'How much funding are you seeking?',
      'Great team!',
      'Love the UI/UX'
    ]

    const randomUsers = [
      { name: 'David Wilson', type: 'INVESTOR' },
      { name: 'Lisa Zhang', type: 'MENTOR' },
      { name: 'Robert Johnson', type: 'FOUNDER' }
    ]

    const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)]
    const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)]

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      userId: 'random',
      username: randomUser.name,
      userType: randomUser.type,
      message: randomMessage,
      timestamp: new Date(),
      type: 'message'
    }

    setChatMessages(prev => [...prev, newMsg])
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user?.id || '',
      username: user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.username || 'Anonymous',
      userType: user?.userType || 'FOUNDER',
      message: newMessage.trim(),
      timestamp: new Date(),
      type: 'message'
    }

    setChatMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const handleReaction = (reactionType: string) => {
    setReactions(prev => prev.map(reaction =>
      reaction.type === reactionType
        ? { ...reaction, count: reaction.count + 1 }
        : reaction
    ))
    toast.success(`${reactions.find(r => r.type === reactionType)?.emoji} Reaction sent!`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getTimeUntil = (date: Date) => {
    const diff = date.getTime() - Date.now()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                🎤 Pitch Stage
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Watch live startup pitches and connect with founders
              </p>
            </div>

            {user?.userType === 'FOUNDER' && (
              <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Mic className="h-5 w-5 mr-2" />
                Schedule Pitch
              </button>
            )}
          </div>
        </div>

        {/* Video Player Area */}
        <div className="flex-1 bg-black relative">
          {currentPitch ? (
            <>
              {/* Video Placeholder */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{currentPitch.title}</h3>
                  <p className="text-gray-300 mb-4">
                    {currentPitch.presenter.name} • {currentPitch.presenter.company}
                  </p>
                  <div className="flex items-center justify-center space-x-6 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                      LIVE
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {currentPitch.viewers} viewers
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {Math.floor((Date.now() - currentPitch.startTime.getTime()) / (1000 * 60))} min
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsAudioMuted(!isAudioMuted)}
                      className={cn(
                        'p-2 rounded-lg transition-colors',
                        isAudioMuted ? 'bg-red-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                      )}
                    >
                      {isAudioMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
                    >
                      <Maximize className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Reactions */}
                  <div className="flex items-center space-x-2">
                    {reactions.map((reaction) => (
                      <button
                        key={reaction.type}
                        onClick={() => handleReaction(reaction.type)}
                        className="flex items-center px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                      >
                        <span className="mr-1">{reaction.emoji}</span>
                        <span className="text-sm">{reaction.count}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors">
                      <Share2 className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors">
                      <Settings className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Mic className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Live Pitch</h3>
                <p>Check the schedule for upcoming pitches</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button className="flex-1 px-4 py-3 text-sm font-medium text-brand-primary-600 border-b-2 border-brand-primary-600 bg-brand-primary-50 dark:bg-brand-primary-900/20">
              Chat
            </button>
            <button className="flex-1 px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Schedule
            </button>
          </nav>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col">
          {/* Current Pitch Info */}
          {currentPitch && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-brand-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                  {currentPitch.presenter.name[0]}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {currentPitch.presenter.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentPitch.presenter.company}
                  </p>
                </div>
                <span className={cn(
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  getUserTypeColor(currentPitch.presenter.userType)
                )}>
                  {getUserTypeIcon(currentPitch.presenter.userType, 'h-3 w-3 mr-1')}
                  {currentPitch.presenter.userType}
                </span>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((message) => (
              <div key={message.id} className={cn(
                'flex space-x-2',
                message.type === 'system' && 'justify-center'
              )}>
                {message.type !== 'system' && (
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-brand-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {message.username[0]}
                    </div>
                  </div>
                )}
                <div className={cn(
                  'flex-1',
                  message.type === 'system' && 'text-center'
                )}>
                  {message.type === 'system' ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                      {message.message}
                    </p>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {message.username}
                        </span>
                        <span className={cn(
                          'inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium',
                          getUserTypeColor(message.userType)
                        )}>
                          {message.userType}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {message.message}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PitchStagePage
