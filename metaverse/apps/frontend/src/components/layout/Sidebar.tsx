import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home,
  Users,
  Building2,
  Mic,
  GraduationCap,
  Coins,
  BookOpen,
  Rocket,
  User,
  Settings
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { cn } from '../../lib/utils'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  requiredUserType?: string[]
  badge?: string
}

const Sidebar: React.FC = () => {
  const location = useLocation()
  const { user } = useAuthStore()

  const navigation: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Overview and quick actions'
    },
    {
      name: 'Lobby',
      href: '/lobby',
      icon: Users,
      description: 'Main gathering space'
    },
    {
      name: 'Startup Booths',
      href: '/startup-booth',
      icon: Building2,
      description: 'Showcase your startup'
    },
    {
      name: 'Pitch Stage',
      href: '/pitch-stage',
      icon: Mic,
      description: 'Live pitching arena'
    },
    {
      name: 'Mentor Lounge',
      href: '/mentor-lounge',
      icon: GraduationCap,
      description: 'Get guidance from experts'
    },
    {
      name: 'Investor Island',
      href: '/investor-island',
      icon: Coins,
      description: 'Connect with investors',
      requiredUserType: ['FOUNDER', 'INVESTOR']
    },
    {
      name: 'Resource Pavilion',
      href: '/resource-pavilion',
      icon: BookOpen,
      description: 'Learning materials and tools'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      description: 'Manage your profile'
    }
  ]

  const isActive = (href: string) => {
    return location.pathname === href
  }

  const canAccess = (item: NavItem) => {
    if (!item.requiredUserType) return true
    return item.requiredUserType.includes(user?.userType || '')
  }

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link to="/dashboard" className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 p-2 rounded-lg">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Startup
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Accelerator
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          if (!canAccess(item)) return null

          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                active
                  ? 'bg-brand-primary-50 dark:bg-brand-primary-900/20 text-brand-primary-700 dark:text-brand-primary-300 border-r-2 border-brand-primary-500'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <Icon
                className={cn(
                  'mr-3 h-5 w-5 transition-colors',
                  active
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                )}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {item.description}
                </p>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* User Status */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 p-3 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Online
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ready to connect
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
