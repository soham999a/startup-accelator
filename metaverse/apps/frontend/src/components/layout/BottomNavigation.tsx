import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Building2, 
  Users, 
  DollarSign, 
  BookOpen,
  User
} from 'lucide-react'
import { cn } from '../../lib/utils'

const BottomNavigation: React.FC = () => {
  const location = useLocation()

  const navigation = [
    { name: 'Lobby', href: '/lobby', icon: Home },
    { name: 'Mentors', href: '/mentor-lounge', icon: Users },
    { name: 'Investors', href: '/investor-island', icon: DollarSign },
    { name: 'Resources', href: '/resource-pavilion', icon: BookOpen },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 sm:hidden z-50">
      <div className="flex justify-around">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors min-w-0',
                isActive
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <Icon className={cn(
                'h-5 w-5 mb-1',
                isActive ? 'text-purple-600 dark:text-purple-400' : ''
              )} />
              <span className="text-xs font-medium truncate">
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNavigation
