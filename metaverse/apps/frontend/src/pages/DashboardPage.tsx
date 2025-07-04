import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Building2,
  Mic,
  GraduationCap,
  Coins,
  BookOpen,
  TrendingUp,
  Calendar,
  MessageSquare,
  Star,
  ArrowRight,
  Plus,
  Target,
  Zap,
  Award,
  Clock,
  Activity,
  BarChart3
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { cn, getUserTypeIcon, getUserTypeColor } from '../lib/utils'
import { profileAPI } from '../lib/api'

const DashboardPage: React.FC = () => {
  const { user, startupProfile, mentorProfile, investorProfile } = useAuthStore()
  const [stats, setStats] = useState({
    totalConnections: 0,
    activePitches: 0,
    mentoringSessions: 0,
    investmentOpportunities: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        // Load dashboard stats and activity
        // This would typically come from an API
        setStats({
          totalConnections: 24,
          activePitches: 3,
          mentoringSessions: 8,
          investmentOpportunities: 12
        })
        setRecentActivity([
          { id: 1, type: 'connection', message: 'New mentor match found', time: '2 hours ago' },
          { id: 2, type: 'pitch', message: 'Pitch feedback received', time: '4 hours ago' },
          { id: 3, type: 'meeting', message: 'Mentoring session completed', time: '1 day ago' }
        ])
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const getQuickActions = () => {
    const baseActions = [
      {
        name: 'Join Lobby',
        href: '/lobby',
        icon: Users,
        description: 'Connect with the community',
        color: 'from-blue-500 to-blue-600',
        priority: 'high'
      }
    ]

    if (user?.userType === 'FOUNDER') {
      baseActions.push(
        {
          name: user.hasStartupProfile ? 'My Booth' : 'Create Startup Profile',
          href: user.hasStartupProfile ? '/startup-booth' : '/profile',
          icon: user.hasStartupProfile ? Building2 : Plus,
          description: user.hasStartupProfile ? 'Manage your startup showcase' : 'Complete your startup profile',
          color: user.hasStartupProfile ? 'from-purple-500 to-purple-600' : 'from-orange-500 to-orange-600',
          priority: user.hasStartupProfile ? 'medium' : 'high'
        },
        {
          name: 'Pitch Stage',
          href: '/pitch-stage',
          icon: Mic,
          description: 'Present to investors',
          color: 'from-red-500 to-red-600',
          priority: 'medium'
        },
        {
          name: 'Find Mentors',
          href: '/mentor-lounge',
          icon: GraduationCap,
          description: 'Get expert guidance',
          color: 'from-green-500 to-green-600',
          priority: 'medium'
        },
        {
          name: 'Investor Island',
          href: '/investor-island',
          icon: Coins,
          description: 'Connect with investors',
          color: 'from-yellow-500 to-yellow-600',
          priority: 'medium'
        }
      )
    } else if (user?.userType === 'MENTOR') {
      baseActions.push(
        {
          name: user.hasMentorProfile ? 'Mentor Lounge' : 'Create Mentor Profile',
          href: user.hasMentorProfile ? '/mentor-lounge' : '/profile',
          icon: user.hasMentorProfile ? GraduationCap : Plus,
          description: user.hasMentorProfile ? 'Manage mentoring sessions' : 'Complete your mentor profile',
          color: user.hasMentorProfile ? 'from-green-500 to-green-600' : 'from-orange-500 to-orange-600',
          priority: user.hasMentorProfile ? 'medium' : 'high'
        },
        {
          name: 'Startup Discovery',
          href: '/startup-booth',
          icon: Building2,
          description: 'Discover startups to mentor',
          color: 'from-purple-500 to-purple-600',
          priority: 'medium'
        }
      )
    } else if (user?.userType === 'INVESTOR') {
      baseActions.push(
        {
          name: user.hasInvestorProfile ? 'Investor Island' : 'Create Investor Profile',
          href: user.hasInvestorProfile ? '/investor-island' : '/profile',
          icon: user.hasInvestorProfile ? Coins : Plus,
          description: user.hasInvestorProfile ? 'Manage investments' : 'Complete your investor profile',
          color: user.hasInvestorProfile ? 'from-yellow-500 to-yellow-600' : 'from-orange-500 to-orange-600',
          priority: user.hasInvestorProfile ? 'medium' : 'high'
        },
        {
          name: 'Pitch Stage',
          href: '/pitch-stage',
          icon: Mic,
          description: 'Watch startup pitches',
          color: 'from-red-500 to-red-600',
          priority: 'medium'
        }
      )
    }

    return baseActions.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }

  const quickActions = getQuickActions()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const upcomingEvents = [
    {
      id: 1,
      title: 'Pitch Day',
      time: 'Today, 3:00 PM',
      attendees: 45,
      type: 'pitch'
    },
    {
      id: 2,
      title: 'Mentor Office Hours',
      time: 'Tomorrow, 10:00 AM',
      attendees: 12,
      type: 'mentor'
    },
    {
      id: 3,
      title: 'Investor Networking',
      time: 'Friday, 2:00 PM',
      attendees: 28,
      type: 'investor'
    }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-brand-primary-600 to-brand-secondary-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user?.firstName || user?.username}! 👋
            </h1>
            <p className="text-brand-primary-100 text-lg">
              Ready to accelerate your startup journey?
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold">{stats.totalConnections}</div>
              <div className="text-brand-primary-200 text-sm">Total Connections</div>
            </div>
            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
              {getUserTypeIcon(user?.userType || 'FOUNDER', 'h-8 w-8')}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Connections</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalConnections}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+12%</span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">from last week</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Active Pitches</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activePitches}</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-lg">
              <Mic className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Activity className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-blue-500 font-medium">2 pending</span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">feedback</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Mentoring</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.mentoringSessions}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
              <GraduationCap className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Clock className="h-4 w-4 text-orange-500 mr-1" />
            <span className="text-orange-500 font-medium">Next session</span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">tomorrow</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Opportunities</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.investmentOpportunities}</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-lg">
              <Target className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Zap className="h-4 w-4 text-purple-500 mr-1" />
            <span className="text-purple-500 font-medium">3 hot leads</span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">this week</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.name}
                  to={action.href}
                  className={cn(
                    'group relative p-6 rounded-xl text-white transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-r',
                    action.color,
                    action.priority === 'high' && 'ring-2 ring-yellow-400 ring-opacity-50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-white">
                        {action.name}
                      </h3>
                      <p className="text-sm opacity-90 group-hover:opacity-100">
                        {action.description}
                      </p>
                      {action.priority === 'high' && (
                        <div className="mt-2 flex items-center text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          <span>Recommended</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <Icon className="h-8 w-8 group-hover:scale-110 transition-transform" />
                      <ArrowRight className="h-4 w-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex-shrink-0">
                    <div className={cn(
                      'p-2 rounded-full',
                      activity.type === 'connection' ? 'bg-blue-100 dark:bg-blue-900/20' :
                      activity.type === 'pitch' ? 'bg-red-100 dark:bg-red-900/20' :
                      'bg-green-100 dark:bg-green-900/20'
                    )}>
                      <Activity className={cn(
                        'h-4 w-4',
                        activity.type === 'connection' ? 'text-blue-600 dark:text-blue-400' :
                        activity.type === 'pitch' ? 'text-red-600 dark:text-red-400' :
                        'text-green-600 dark:text-green-400'
                      )} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upcoming Events
            </h3>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border-l-4 border-primary-500 pl-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {event.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {event.time}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {event.attendees} attendees
                  </p>
                </div>
              ))}
            </div>
            <Link
              to="/events"
              className="block mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all events →
            </Link>
          </div>

          {/* Profile Completion */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Complete Your Profile
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Add more details to get better matches and opportunities.
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <div className="bg-primary-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">75% complete</p>
            <Link
              to="/profile"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Complete Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
