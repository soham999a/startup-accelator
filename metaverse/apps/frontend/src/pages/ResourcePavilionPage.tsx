import React, { useState } from 'react'
import {
  BookOpen,
  Video,
  FileText,
  Download,
  ExternalLink,
  Search,
  Filter,
  Star,
  Clock,
  Users,
  TrendingUp,
  Award,
  Play,
  Bookmark,
  Share2,
  Eye,
  Calendar,
  Tag,
  ChevronRight,
  Lightbulb,
  Target,
  Zap,
  Globe
} from 'lucide-react'
import { cn } from '../lib/utils'
import toast from 'react-hot-toast'

interface Resource {
  id: string
  title: string
  description: string
  type: 'article' | 'video' | 'template' | 'tool' | 'course' | 'ebook'
  category: string
  author: string
  authorAvatar: string
  publishedAt: string
  readTime?: number
  duration?: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  rating: number
  reviews: number
  views: number
  downloads?: number
  tags: string[]
  thumbnail: string
  isPremium: boolean
  isBookmarked: boolean
  url?: string
}

const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'The Complete Guide to Product-Market Fit',
    description: 'Learn how to identify, measure, and achieve product-market fit for your startup. This comprehensive guide covers frameworks, metrics, and real-world case studies.',
    type: 'article',
    category: 'Product Strategy',
    author: 'Sarah Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
    publishedAt: '2024-01-15',
    readTime: 12,
    difficulty: 'Intermediate',
    rating: 4.8,
    reviews: 234,
    views: 15420,
    tags: ['Product-Market Fit', 'Strategy', 'Metrics', 'Validation'],
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
    isPremium: false,
    isBookmarked: true
  },
  {
    id: '2',
    title: 'Fundraising Masterclass: From Seed to Series A',
    description: 'A comprehensive video course covering everything you need to know about raising capital, from preparing your pitch deck to negotiating terms.',
    type: 'course',
    category: 'Fundraising',
    author: 'Marcus Johnson',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    publishedAt: '2024-01-10',
    duration: 180,
    difficulty: 'Advanced',
    rating: 4.9,
    reviews: 156,
    views: 8930,
    tags: ['Fundraising', 'Pitch Deck', 'Investors', 'Valuation'],
    thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop',
    isPremium: true,
    isBookmarked: false
  },
  {
    id: '3',
    title: 'Startup Financial Model Template',
    description: 'Professional Excel template for creating comprehensive financial projections. Includes revenue forecasting, expense planning, and scenario analysis.',
    type: 'template',
    category: 'Finance',
    author: 'David Thompson',
    authorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop&crop=face',
    publishedAt: '2024-01-08',
    difficulty: 'Intermediate',
    rating: 4.7,
    reviews: 89,
    views: 12340,
    downloads: 2340,
    tags: ['Financial Model', 'Excel', 'Projections', 'Planning'],
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
    isPremium: false,
    isBookmarked: true,
    url: '/templates/financial-model.xlsx'
  },
  {
    id: '4',
    title: 'Building High-Performance Teams',
    description: 'Learn the secrets of building and managing high-performance teams in a startup environment. Covers hiring, culture, and retention strategies.',
    type: 'video',
    category: 'Leadership',
    author: 'Jennifer Kim',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
    publishedAt: '2024-01-05',
    duration: 45,
    difficulty: 'Intermediate',
    rating: 4.6,
    reviews: 167,
    views: 9870,
    tags: ['Team Building', 'Hiring', 'Culture', 'Management'],
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
    isPremium: false,
    isBookmarked: false
  },
  {
    id: '5',
    title: 'The Lean Startup Methodology',
    description: 'Complete ebook covering Eric Ries\' Lean Startup methodology. Learn how to build, measure, and learn your way to a successful startup.',
    type: 'ebook',
    category: 'Methodology',
    author: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
    publishedAt: '2024-01-03',
    readTime: 240,
    difficulty: 'Beginner',
    rating: 4.8,
    reviews: 312,
    views: 18650,
    downloads: 4560,
    tags: ['Lean Startup', 'MVP', 'Validation', 'Methodology'],
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop',
    isPremium: true,
    isBookmarked: true,
    url: '/ebooks/lean-startup.pdf'
  }
]

const CATEGORIES = [
  'All Categories',
  'Product Strategy',
  'Fundraising',
  'Finance',
  'Leadership',
  'Methodology',
  'Customer Research',
  'Growth',
  'Legal',
  'Marketing',
  'Technology'
]

const RESOURCE_TYPES = [
  'All Types',
  'article',
  'video',
  'template',
  'tool',
  'course',
  'ebook'
]

const DIFFICULTY_LEVELS = [
  'All Levels',
  'Beginner',
  'Intermediate',
  'Advanced'
]

const ResourcePavilionPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedType, setSelectedType] = useState('All Types')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels')
  const [searchQuery, setSearchQuery] = useState('')
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)

  const filteredResources = MOCK_RESOURCES.filter(resource => {
    const matchesCategory = selectedCategory === 'All Categories' || resource.category === selectedCategory
    const matchesType = selectedType === 'All Types' || resource.type === selectedType
    const matchesDifficulty = selectedDifficulty === 'All Levels' || resource.difficulty === selectedDifficulty
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesPremium = !showPremiumOnly || resource.isPremium
    const matchesBookmarked = !showBookmarkedOnly || resource.isBookmarked

    return matchesCategory && matchesType && matchesDifficulty && matchesSearch && matchesPremium && matchesBookmarked
  })

  const handleBookmark = (resourceId: string) => {
    toast.success('Resource bookmarked! 📚')
  }

  const handleShare = (resource: Resource) => {
    toast.success(`Shared "${resource.title}"! 🔗`)
  }

  const handleDownload = (resource: Resource) => {
    toast.success(`Downloading "${resource.title}"! ⬇️`)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="h-4 w-4" />
      case 'video': return <Video className="h-4 w-4" />
      case 'template': return <Download className="h-4 w-4" />
      case 'tool': return <Zap className="h-4 w-4" />
      case 'course': return <BookOpen className="h-4 w-4" />
      case 'ebook': return <BookOpen className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'Advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-3 sm:p-4 rounded-full">
                <BookOpen className="h-8 w-8 sm:h-12 sm:w-12" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-4">Resource Pavilion</h1>
            <p className="text-base sm:text-xl text-indigo-100 max-w-2xl mx-auto px-4">
              Access curated learning materials, tools, and resources to accelerate your startup journey
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-indigo-100">Resources</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-indigo-100">Expert Authors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">100K+</div>
                <div className="text-indigo-100">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4.7★</div>
                <div className="text-indigo-100">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources by title, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {RESOURCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type === 'All Types' ? type : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {DIFFICULTY_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPremiumOnly}
                  onChange={(e) => setShowPremiumOnly(e.target.checked)}
                  className="sr-only"
                />
                <div className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  showPremiumOnly ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                )}>
                  <div className={cn(
                    'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform',
                    showPremiumOnly ? 'translate-x-5' : 'translate-x-0'
                  )} />
                </div>
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Premium only</span>
              </label>
            </div>
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showBookmarkedOnly}
                  onChange={(e) => setShowBookmarkedOnly(e.target.checked)}
                  className="sr-only"
                />
                <div className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  showBookmarkedOnly ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                )}>
                  <div className={cn(
                    'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform',
                    showBookmarkedOnly ? 'translate-x-5' : 'translate-x-0'
                  )} />
                </div>
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Bookmarked only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
            {selectedCategory !== 'All Categories' && ` in ${selectedCategory}`}
            {selectedType !== 'All Types' && ` of type ${selectedType}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200 group"
            >
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={resource.thumbnail}
                  alt={resource.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-3 left-3">
                  <span className={cn(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    resource.type === 'video' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300' :
                    resource.type === 'article' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' :
                    resource.type === 'template' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' :
                    resource.type === 'tool' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300' :
                    resource.type === 'course' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  )}>
                    {getTypeIcon(resource.type)}
                    <span className="ml-1 capitalize">{resource.type}</span>
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  {resource.isPremium && (
                    <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300 rounded-full text-xs font-medium">
                      <Award className="h-3 w-3 mr-1" />
                      Premium
                    </span>
                  )}
                </div>
                {resource.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 rounded-full p-3">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {resource.category}
                    </p>
                  </div>
                  <button
                    onClick={() => handleBookmark(resource.id)}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      resource.isBookmarked
                        ? 'text-purple-600 bg-purple-100 dark:bg-purple-900/20'
                        : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                    )}
                  >
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {resource.description}
                </p>

                {/* Author & Meta */}
                <div className="flex items-center mb-4">
                  <img
                    src={resource.authorAvatar}
                    alt={resource.author}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {resource.author}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(resource.publishedAt).toLocaleDateString()}
                      {resource.readTime && (
                        <>
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          {resource.readTime} min read
                        </>
                      )}
                      {resource.duration && (
                        <>
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          {resource.duration} min
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Difficulty & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    getDifficultyColor(resource.difficulty)
                  )}>
                    {resource.difficulty}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">
                      {resource.rating}
                    </span>
                    <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                      ({resource.reviews})
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {resource.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {resource.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-500 rounded text-xs">
                      +{resource.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {resource.views.toLocaleString()} views
                  </div>
                  {resource.downloads && (
                    <div className="flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      {resource.downloads.toLocaleString()} downloads
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(resource)}
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    {resource.type === 'video' ? 'Watch' :
                     resource.type === 'template' ? 'Download' :
                     resource.type === 'tool' ? 'Access' : 'Read'}
                  </button>
                  <button
                    onClick={() => handleShare(resource)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No resources found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search criteria or browse all resources
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All Categories')
                setSelectedType('All Types')
                setSelectedDifficulty('All Levels')
                setShowPremiumOnly(false)
                setShowBookmarkedOnly(false)
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

export default ResourcePavilionPage
