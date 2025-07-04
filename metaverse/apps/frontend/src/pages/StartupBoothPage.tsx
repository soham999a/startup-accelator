import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { profileAPI } from '../lib/api'
import {
  Building2,
  Users,
  MapPin,
  Globe,
  Calendar,
  TrendingUp,
  DollarSign,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Filter,
  Search,
  Star,
  Award,
  Zap,
  Target,
  ArrowRight,
  ExternalLink,
  Play,
  Download
} from 'lucide-react'
import { cn, getUserTypeColor } from '../lib/utils'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

interface StartupProfile {
  id: string
  companyName: string
  description: string
  industry: string
  stage: string
  foundedYear: number
  location: string
  website?: string
  teamSize: number
  fundingRaised?: number
  fundingGoal?: number
  pitchDeck?: string
  businessModel?: string
  targetMarket?: string
  competitiveAdvantage?: string
  lookingFor: string[]
  user: {
    id: string
    username: string
    firstName?: string
    lastName?: string
    profileImage?: string
  }
  metrics?: {
    views: number
    likes: number
    connections: number
  }
  isVerified?: boolean
  isFeatured?: boolean
}

const StartupBoothPage: React.FC = () => {
  const { user } = useAuthStore()
  const [startups, setStartups] = useState<StartupProfile[]>([])
  const [filteredStartups, setFilteredStartups] = useState<StartupProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedStage, setSelectedStage] = useState('')

  const industries = [
    'All Industries', 'Technology', 'Healthcare', 'Finance', 'Education',
    'E-commerce', 'SaaS', 'Mobile Apps', 'AI/ML', 'Blockchain', 'IoT',
    'Gaming', 'Social Media', 'Marketplace', 'B2B Services', 'Consumer Goods'
  ]

  const stages = [
    'All Stages', 'Idea', 'MVP', 'Early Stage', 'Growth Stage', 'Scaling', 'Mature'
  ]

  useEffect(() => {
    loadStartups()
  }, [])

  useEffect(() => {
    filterStartups()
  }, [startups, searchTerm, selectedIndustry, selectedStage])

  const loadStartups = async () => {
    try {
      setIsLoading(true)

      // Mock data for demonstration
      const mockStartups: StartupProfile[] = [
        {
          id: '1',
          companyName: 'TechFlow AI',
          description: 'Revolutionary AI-powered workflow automation platform that helps businesses streamline their operations and increase productivity by 300%.',
          industry: 'AI/ML',
          stage: 'Growth Stage',
          foundedYear: 2023,
          location: 'San Francisco, CA',
          website: 'https://techflow.ai',
          teamSize: 12,
          fundingRaised: 2500000,
          fundingGoal: 10000000,
          businessModel: 'SaaS',
          targetMarket: 'Enterprise businesses with 100+ employees',
          competitiveAdvantage: 'Proprietary AI algorithms with 95% accuracy',
          lookingFor: ['Funding', 'Partnerships', 'Team Members'],
          user: {
            id: '1',
            username: 'sarah_chen',
            firstName: 'Sarah',
            lastName: 'Chen'
          },
          metrics: {
            views: 1250,
            likes: 89,
            connections: 34
          },
          isVerified: true,
          isFeatured: true
        },
        {
          id: '2',
          companyName: 'GreenTech Solutions',
          description: 'Sustainable technology solutions for smart cities. We develop IoT sensors and analytics platforms for environmental monitoring.',
          industry: 'IoT',
          stage: 'Early Stage',
          foundedYear: 2024,
          location: 'Austin, TX',
          website: 'https://greentech.solutions',
          teamSize: 6,
          fundingRaised: 500000,
          fundingGoal: 3000000,
          businessModel: 'B2B SaaS',
          targetMarket: 'Municipal governments and smart city initiatives',
          competitiveAdvantage: 'Patent-pending sensor technology with 10x battery life',
          lookingFor: ['Funding', 'Mentorship', 'Customers'],
          user: {
            id: '2',
            username: 'mike_rodriguez',
            firstName: 'Mike',
            lastName: 'Rodriguez'
          },
          metrics: {
            views: 890,
            likes: 67,
            connections: 23
          },
          isVerified: false,
          isFeatured: false
        },
        {
          id: '3',
          companyName: 'HealthConnect',
          description: 'Telemedicine platform connecting patients with healthcare providers. HIPAA-compliant with AI-powered diagnosis assistance.',
          industry: 'Healthcare',
          stage: 'MVP',
          foundedYear: 2024,
          location: 'Boston, MA',
          website: 'https://healthconnect.app',
          teamSize: 8,
          fundingRaised: 1200000,
          fundingGoal: 5000000,
          businessModel: 'Marketplace',
          targetMarket: 'Healthcare providers and patients in rural areas',
          competitiveAdvantage: 'AI diagnosis with 92% accuracy, FDA approved',
          lookingFor: ['Funding', 'Technical Guidance', 'Partnerships'],
          user: {
            id: '3',
            username: 'dr_patel',
            firstName: 'Priya',
            lastName: 'Patel'
          },
          metrics: {
            views: 2100,
            likes: 156,
            connections: 78
          },
          isVerified: true,
          isFeatured: true
        }
      ]

      setStartups(mockStartups)
    } catch (error) {
      console.error('Failed to load startups:', error)
      toast.error('Failed to load startups')
    } finally {
      setIsLoading(false)
    }
  }

  const filterStartups = () => {
    let filtered = startups

    if (searchTerm) {
      filtered = filtered.filter(startup =>
        startup.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.industry.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedIndustry && selectedIndustry !== 'All Industries') {
      filtered = filtered.filter(startup => startup.industry === selectedIndustry)
    }

    if (selectedStage && selectedStage !== 'All Stages') {
      filtered = filtered.filter(startup => startup.stage === selectedStage)
    }

    // Sort by featured first, then by metrics
    filtered.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1
      if (!a.isFeatured && b.isFeatured) return 1
      return (b.metrics?.views || 0) - (a.metrics?.views || 0)
    })

    setFilteredStartups(filtered)
  }

  const handleLike = async (startupId: string) => {
    setStartups(prev => prev.map(startup =>
      startup.id === startupId
        ? {
            ...startup,
            metrics: {
              ...startup.metrics!,
              likes: startup.metrics!.likes + 1
            }
          }
        : startup
    ))
    toast.success('Liked!')
  }

  const handleConnect = async (startupId: string) => {
    toast.success('Connection request sent!')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading startup booths...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🏢 Startup Booths
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover innovative startups and connect with founders
            </p>
          </div>

          {user?.userType === 'FOUNDER' && (
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors"
            >
              <Building2 className="h-5 w-5 mr-2" />
              {user.hasStartupProfile ? 'Edit My Booth' : 'Create My Booth'}
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search startups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent bg-white dark:bg-gray-700"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 bg-white dark:bg-gray-700"
            >
              {industries.map(industry => (
                <option key={industry} value={industry === 'All Industries' ? '' : industry}>
                  {industry}
                </option>
              ))}
            </select>

            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 bg-white dark:bg-gray-700"
            >
              {stages.map(stage => (
                <option key={stage} value={stage === 'All Stages' ? '' : stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          Showing {filteredStartups.length} of {startups.length} startups
        </p>
      </div>

      {/* Startup Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStartups.map((startup) => (
          <div
            key={startup.id}
            className={cn(
              'bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group relative',
              startup.isFeatured && 'ring-2 ring-yellow-400 ring-opacity-50'
            )}
          >
            {/* Featured Badge */}
            {startup.isFeatured && (
              <div className="absolute top-4 left-4 z-10">
                <div className="flex items-center px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-medium">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </div>
              </div>
            )}

            {/* Verified Badge */}
            {startup.isVerified && (
              <div className="absolute top-4 right-4 z-10">
                <div className="flex items-center px-2 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                  <Award className="h-3 w-3 mr-1" />
                  Verified
                </div>
              </div>
            )}

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-primary-600 transition-colors">
                    {startup.companyName}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {startup.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {startup.foundedYear}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {startup.teamSize}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {startup.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-xs font-medium">
                  {startup.industry}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs font-medium">
                  {startup.stage}
                </span>
                {startup.fundingRaised && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-full text-xs font-medium">
                    ${(startup.fundingRaised / 1000000).toFixed(1)}M raised
                  </span>
                )}
              </div>

              {/* Looking For */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Looking for:</p>
                <div className="flex flex-wrap gap-1">
                  {startup.lookingFor.slice(0, 3).map((item, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded text-xs">
                      {item}
                    </span>
                  ))}
                  {startup.lookingFor.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded text-xs">
                      +{startup.lookingFor.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {startup.metrics?.views}
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    {startup.metrics?.likes}
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {startup.metrics?.connections}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleLike(startup.id)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Like
                </button>
                <button
                  onClick={() => handleConnect(startup.id)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Connect
                </button>
                {startup.website && (
                  <a
                    href={startup.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredStartups.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No startups found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search criteria or filters
          </p>
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedIndustry('')
              setSelectedStage('')
            }}
            className="px-4 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default StartupBoothPage
