import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { profileAPI } from '../lib/api'
import {
  User,
  Building2,
  GraduationCap,
  Coins,
  Edit3,
  Save,
  Camera,
  Mail,
  Calendar,
  Loader2
} from 'lucide-react'
import { cn, getUserTypeIcon, getUserTypeColor } from '../lib/utils'
import StartupProfileForm from '../components/profile/StartupProfileForm'
import toast from 'react-hot-toast'

const ProfilePage: React.FC = () => {
  const {
    user,
    startupProfile,
    mentorProfile,
    investorProfile,
    updateUser,
    setStartupProfile
  } = useAuthStore()

  const [activeTab, setActiveTab] = useState<'personal' | 'startup' | 'mentor' | 'investor'>('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [personalData, setPersonalData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || ''
  })

  useEffect(() => {
    if (user) {
      setPersonalData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        profileImage: user.profileImage || ''
      })
    }
  }, [user])

  const handlePersonalSave = async () => {
    try {
      setIsLoading(true)
      await profileAPI.updateMe(personalData)
      updateUser(personalData)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      console.error('Failed to update profile:', error)
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    ...(user?.userType === 'FOUNDER' ? [{ id: 'startup', label: 'Startup Profile', icon: Building2 }] : []),
    ...(user?.userType === 'MENTOR' ? [{ id: 'mentor', label: 'Mentor Profile', icon: GraduationCap }] : []),
    ...(user?.userType === 'INVESTOR' ? [{ id: 'investor', label: 'Investor Profile', icon: Coins }] : []),
  ] as const

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary-600" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="h-20 w-20 bg-brand-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    user.firstName?.[0]?.toUpperCase() || user.username[0]?.toUpperCase()
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  <Camera className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username
                  }
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getUserTypeColor(user.userType)
                  )}>
                    {getUserTypeIcon(user.userType)} {user.userType}
                  </span>
                  {user.isVerified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {user.email}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {new Date(user.joinedAt || '').toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === tab.id
                      ? 'border-brand-primary-500 text-brand-primary-600 dark:text-brand-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  )}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content - Personal */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {activeTab === 'personal' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h2>
              <button
                onClick={() => isEditing ? handlePersonalSave() : setIsEditing(true)}
                disabled={isLoading}
                className={cn(
                  'flex items-center px-4 py-2 rounded-lg font-medium transition-colors',
                  isEditing
                    ? 'bg-brand-primary-600 text-white hover:bg-brand-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : isEditing ? (
                  <Save className="h-4 w-4 mr-2" />
                ) : (
                  <Edit3 className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={personalData.firstName}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700"
                    placeholder="Enter your first name"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white py-3">
                    {user.firstName || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={personalData.lastName}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700"
                    placeholder="Enter your last name"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white py-3">
                    {user.lastName || 'Not provided'}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={personalData.bio}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white py-3">
                    {user.bio || 'No bio provided'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'startup' && user.userType === 'FOUNDER' && (
          <div className="p-6">
            {user.hasStartupProfile && startupProfile ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Startup Profile
                  </h2>
                  <button
                    onClick={() => {
                      // Reset to show form for editing
                      updateUser({ hasStartupProfile: false })
                      setStartupProfile(null)
                    }}
                    className="flex items-center px-4 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">Company Name</h3>
                      <p className="text-gray-600 dark:text-gray-400">{startupProfile.companyName}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">Industry</h3>
                      <p className="text-gray-600 dark:text-gray-400">{startupProfile.industry}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">Stage</h3>
                      <p className="text-gray-600 dark:text-gray-400">{startupProfile.stage}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">Team Size</h3>
                      <p className="text-gray-600 dark:text-gray-400">{startupProfile.teamSize} people</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">Founded</h3>
                      <p className="text-gray-600 dark:text-gray-400">{startupProfile.foundedYear}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">Location</h3>
                      <p className="text-gray-600 dark:text-gray-400">{startupProfile.location}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Description</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{startupProfile.description}</p>
                  </div>

                  {startupProfile.website && (
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">Website</h3>
                      <a
                        href={startupProfile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-primary-600 hover:text-brand-primary-700 dark:text-brand-primary-400 dark:hover:text-brand-primary-300"
                      >
                        {startupProfile.website}
                      </a>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">Funding Goal</h3>
                      <p className="text-gray-600 dark:text-gray-400">${startupProfile.fundingGoal?.toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">Funding Raised</h3>
                      <p className="text-gray-600 dark:text-gray-400">${startupProfile.fundingRaised?.toLocaleString()}</p>
                    </div>
                  </div>

                  {startupProfile.lookingFor && startupProfile.lookingFor.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Looking For</h3>
                      <div className="flex flex-wrap gap-2">
                        {startupProfile.lookingFor.map((item, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-brand-primary-100 text-brand-primary-700 dark:bg-brand-primary-900/20 dark:text-brand-primary-300 rounded-full text-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <StartupProfileForm
                onSuccess={() => {
                  toast.success('Startup profile created successfully!')
                }}
              />
            )}
          </div>
        )}

        {activeTab === 'mentor' && user.userType === 'MENTOR' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Mentor Profile
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Mentor profile form coming soon...
            </p>
          </div>
        )}

        {activeTab === 'investor' && user.userType === 'INVESTOR' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Investor Profile
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Investor profile form coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
