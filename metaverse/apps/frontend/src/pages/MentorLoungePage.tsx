import React, { useState } from 'react'
import {
  GraduationCap,
  Star,
  Clock,
  MapPin,
  Calendar,
  Video,
  MessageCircle,
  Filter,
  Search,
  Award,
  TrendingUp,
  Users,
  BookOpen,
  Zap,
  Heart,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import { cn } from '../lib/utils'
import toast from 'react-hot-toast'

interface Mentor {
  id: string
  name: string
  title: string
  company: string
  avatar: string
  rating: number
  reviews: number
  expertise: string[]
  experience: number
  location: string
  timezone: string
  hourlyRate: number
  isAvailable: boolean
  bio: string
  achievements: string[]
  sessionTypes: string[]
  languages: string[]
  responseTime: string
  totalSessions: number
}

const MOCK_MENTORS: Mentor[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'Former VP of Product',
    company: 'Google',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    reviews: 127,
    expertise: ['Product Strategy', 'User Experience', 'Team Leadership', 'Go-to-Market'],
    experience: 12,
    location: 'San Francisco, CA',
    timezone: 'PST',
    hourlyRate: 200,
    isAvailable: true,
    bio: 'Former VP of Product at Google with 12+ years building products used by billions. Helped launch Google Maps, Assistant, and Cloud Platform. Passionate about helping startups build products that matter.',
    achievements: ['Led team of 50+ PMs', 'Launched 3 billion-user products', 'TEDx Speaker', 'Forbes 30 Under 30'],
    sessionTypes: ['1-on-1 Mentoring', 'Product Reviews', 'Strategy Sessions', 'Team Workshops'],
    languages: ['English', 'Mandarin'],
    responseTime: '< 2 hours',
    totalSessions: 340
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    title: 'Serial Entrepreneur',
    company: 'TechStars',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    reviews: 89,
    expertise: ['Fundraising', 'Business Strategy', 'Sales', 'Scaling'],
    experience: 15,
    location: 'Austin, TX',
    timezone: 'CST',
    hourlyRate: 150,
    isAvailable: true,
    bio: 'Built and sold 3 startups (2 exits > $100M). Currently Managing Director at TechStars. Expert in fundraising, having raised $50M+ across multiple ventures.',
    achievements: ['3 successful exits', '$50M+ raised', 'TechStars MD', '500+ startups mentored'],
    sessionTypes: ['Fundraising Prep', 'Pitch Deck Review', 'Business Strategy', 'Investor Intros'],
    languages: ['English', 'Spanish'],
    responseTime: '< 4 hours',
    totalSessions: 280
  },
  {
    id: '3',
    name: 'Dr. Priya Patel',
    title: 'CTO & AI Expert',
    company: 'Microsoft',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    reviews: 156,
    expertise: ['AI/ML', 'Technical Architecture', 'Engineering Leadership', 'Deep Tech'],
    experience: 10,
    location: 'Seattle, WA',
    timezone: 'PST',
    hourlyRate: 180,
    isAvailable: false,
    bio: 'CTO at Microsoft AI division. PhD in Computer Science from Stanford. Leading AI research and product development for enterprise solutions.',
    achievements: ['20+ AI patents', 'PhD Stanford CS', 'Microsoft CTO', 'AI Conference Speaker'],
    sessionTypes: ['Technical Reviews', 'AI Strategy', 'Team Building', 'Research Guidance'],
    languages: ['English', 'Hindi', 'Gujarati'],
    responseTime: '< 6 hours',
    totalSessions: 195
  },
  {
    id: '4',
    name: 'Alex Rivera',
    title: 'Growth Marketing Expert',
    company: 'Stripe',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 4.7,
    reviews: 203,
    expertise: ['Growth Marketing', 'Digital Strategy', 'Analytics', 'Customer Acquisition'],
    experience: 8,
    location: 'New York, NY',
    timezone: 'EST',
    hourlyRate: 120,
    isAvailable: true,
    bio: 'Head of Growth at Stripe. Scaled user acquisition from 10K to 10M+ customers. Expert in growth hacking, performance marketing, and data-driven strategies.',
    achievements: ['10M+ users acquired', 'Growth Leader at Stripe', 'Marketing Week Speaker', '5x ROI improvement'],
    sessionTypes: ['Growth Strategy', 'Marketing Audits', 'Analytics Setup', 'Campaign Optimization'],
    languages: ['English', 'Spanish', 'Portuguese'],
    responseTime: '< 3 hours',
    totalSessions: 420
  },
  {
    id: '5',
    name: 'Jennifer Kim',
    title: 'People & Culture Leader',
    company: 'Airbnb',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    reviews: 92,
    expertise: ['HR Strategy', 'Company Culture', 'Talent Acquisition', 'Leadership Development'],
    experience: 9,
    location: 'San Francisco, CA',
    timezone: 'PST',
    hourlyRate: 140,
    isAvailable: true,
    bio: 'VP of People at Airbnb. Built HR systems that scaled from 50 to 5000+ employees. Expert in creating inclusive cultures and high-performance teams.',
    achievements: ['Scaled team 100x', 'Diversity & Inclusion Leader', 'HR Innovation Award', 'Culture Expert'],
    sessionTypes: ['HR Strategy', 'Culture Building', 'Hiring Plans', 'Leadership Coaching'],
    languages: ['English', 'Korean'],
    responseTime: '< 4 hours',
    totalSessions: 165
  },
  {
    id: '6',
    name: 'David Thompson',
    title: 'Fintech Entrepreneur',
    company: 'Square',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    rating: 4.6,
    reviews: 74,
    expertise: ['Fintech', 'Regulatory Compliance', 'B2B Sales', 'Enterprise Strategy'],
    experience: 11,
    location: 'Chicago, IL',
    timezone: 'CST',
    hourlyRate: 160,
    isAvailable: true,
    bio: 'Former Head of Enterprise at Square. Built fintech solutions for 100K+ businesses. Expert in financial regulations, B2B sales, and enterprise product strategy.',
    achievements: ['$1B+ in transactions', 'Fintech Pioneer', 'Regulatory Expert', 'Enterprise Leader'],
    sessionTypes: ['Fintech Strategy', 'Regulatory Guidance', 'B2B Sales', 'Enterprise Planning'],
    languages: ['English', 'French'],
    responseTime: '< 5 hours',
    totalSessions: 145
  }
]

const EXPERTISE_CATEGORIES = [
  'All',
  'Product Strategy',
  'Fundraising',
  'AI/ML',
  'Growth Marketing',
  'HR Strategy',
  'Fintech',
  'Technical Architecture',
  'Business Strategy',
  'Sales',
  'Leadership'
]

const MentorLoungePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)

  const filteredMentors = MOCK_MENTORS.filter(mentor => {
    const matchesCategory = selectedCategory === 'All' || mentor.expertise.includes(selectedCategory)
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesAvailability = !showAvailableOnly || mentor.isAvailable

    return matchesCategory && matchesSearch && matchesAvailability
  })

  const handleBookSession = (mentor: Mentor) => {
    toast.success(`Booking session with ${mentor.name}! 📅`)
  }

  const handleSendMessage = (mentor: Mentor) => {
    toast.success(`Message sent to ${mentor.name}! 💬`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-3 sm:p-4 rounded-full">
                <GraduationCap className="h-8 w-8 sm:h-12 sm:w-12" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-4">Mentor Lounge</h1>
            <p className="text-base sm:text-xl text-blue-100 max-w-2xl mx-auto px-4">
              Connect with world-class mentors who've built successful companies and can guide your startup journey
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-blue-100">Expert Mentors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-blue-100">Sessions Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4.8★</div>
                <div className="text-blue-100">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search mentors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {EXPERTISE_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors',
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Available Only Toggle */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)}
                  className="sr-only"
                />
                <div className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  showAvailableOnly ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                )}>
                  <div className={cn(
                    'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform',
                    showAvailableOnly ? 'translate-x-5' : 'translate-x-0'
                  )} />
                </div>
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Available only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-lg transition-all duration-200"
            >
              {/* Mentor Header */}
              <div className="flex items-start space-x-4 mb-4">
                <div className="relative">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className={cn(
                    'absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800',
                    mentor.isAvailable ? 'bg-green-500' : 'bg-gray-400'
                  )} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {mentor.name}
                  </h3>
                  <p className="text-purple-600 dark:text-purple-400 font-medium">
                    {mentor.title}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {mentor.company}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">
                        {mentor.rating}
                      </span>
                    </div>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {mentor.reviews} reviews
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {mentor.totalSessions} sessions
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    ${mentor.hourlyRate}/hr
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {mentor.responseTime}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {mentor.bio}
              </p>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {mentor.expertise.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {mentor.expertise.length > 4 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-full text-xs">
                    +{mentor.expertise.length - 4} more
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {mentor.experience}+ years
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {mentor.location.split(',')[0]}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Location</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {mentor.timezone}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Timezone</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleBookSession(mentor)}
                  disabled={!mentor.isAvailable}
                  className={cn(
                    'flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors',
                    mentor.isAvailable
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                  )}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {mentor.isAvailable ? 'Book Session' : 'Unavailable'}
                </button>
                <button
                  onClick={() => handleSendMessage(mentor)}
                  className="px-4 py-2 border border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg font-medium transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No mentors found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search criteria or browse all mentors
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
                setShowAvailableOnly(false)
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MentorLoungePage
