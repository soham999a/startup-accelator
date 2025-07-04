import React, { useState } from 'react'
import {
  DollarSign,
  TrendingUp,
  Building2,
  Users,
  Calendar,
  MessageCircle,
  Filter,
  Search,
  Award,
  Globe,
  MapPin,
  Clock,
  Star,
  ExternalLink,
  ChevronRight,
  Briefcase,
  Target,
  PieChart,
  BarChart3
} from 'lucide-react'
import { cn } from '../lib/utils'
import toast from 'react-hot-toast'

interface Investor {
  id: string
  name: string
  title: string
  firm: string
  avatar: string
  firmLogo: string
  rating: number
  reviews: number
  investmentFocus: string[]
  preferredStage: string[]
  minInvestment: number
  maxInvestment: number
  location: string
  timezone: string
  isActive: boolean
  bio: string
  portfolioCompanies: string[]
  recentInvestments: string[]
  expertise: string[]
  totalInvestments: number
  successfulExits: number
  averageCheckSize: number
  responseTime: string
}

const MOCK_INVESTORS: Investor[] = [
  {
    id: '1',
    name: 'Emily Rodriguez',
    title: 'Managing Partner',
    firm: 'Sequoia Capital',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    firmLogo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
    rating: 4.9,
    reviews: 45,
    investmentFocus: ['SaaS', 'AI/ML', 'Enterprise Software', 'Developer Tools'],
    preferredStage: ['Series A', 'Series B'],
    minInvestment: 5000000,
    maxInvestment: 25000000,
    location: 'Menlo Park, CA',
    timezone: 'PST',
    isActive: true,
    bio: 'Managing Partner at Sequoia Capital with 15+ years in venture capital. Led investments in 50+ companies including Zoom, Stripe, and Airbnb. Passionate about backing exceptional founders building category-defining companies.',
    portfolioCompanies: ['Zoom', 'Stripe', 'Airbnb', 'WhatsApp', 'Instagram'],
    recentInvestments: ['OpenAI', 'Notion', 'Figma'],
    expertise: ['Enterprise SaaS', 'Consumer Tech', 'Marketplace', 'Fintech'],
    totalInvestments: 127,
    successfulExits: 23,
    averageCheckSize: 12000000,
    responseTime: '< 24 hours'
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Principal',
    firm: 'Andreessen Horowitz',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    firmLogo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
    rating: 4.8,
    reviews: 38,
    investmentFocus: ['Crypto', 'Web3', 'DeFi', 'NFTs'],
    preferredStage: ['Seed', 'Series A'],
    minInvestment: 1000000,
    maxInvestment: 15000000,
    location: 'San Francisco, CA',
    timezone: 'PST',
    isActive: true,
    bio: 'Principal at a16z focusing on crypto and web3 investments. Former founder with 2 successful exits. Deep expertise in blockchain technology and decentralized finance.',
    portfolioCompanies: ['Coinbase', 'OpenSea', 'Uniswap', 'Compound'],
    recentInvestments: ['Solana', 'Polygon', 'Chainlink'],
    expertise: ['Blockchain', 'DeFi', 'Smart Contracts', 'Tokenomics'],
    totalInvestments: 89,
    successfulExits: 15,
    averageCheckSize: 5500000,
    responseTime: '< 48 hours'
  },
  {
    id: '3',
    name: 'Sarah Kim',
    title: 'Partner',
    firm: 'Kleiner Perkins',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    firmLogo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
    rating: 4.7,
    reviews: 52,
    investmentFocus: ['HealthTech', 'BioTech', 'Digital Health', 'MedTech'],
    preferredStage: ['Series A', 'Series B', 'Series C'],
    minInvestment: 3000000,
    maxInvestment: 20000000,
    location: 'Palo Alto, CA',
    timezone: 'PST',
    isActive: true,
    bio: 'Partner at Kleiner Perkins with focus on healthcare and life sciences. MD from Harvard, former practicing physician. Led investments in breakthrough healthcare technologies.',
    portfolioCompanies: ['23andMe', 'Ginkgo Bioworks', 'Veracyte', 'Guardant Health'],
    recentInvestments: ['Tempus', 'Flatiron Health', 'Oscar Health'],
    expertise: ['Digital Health', 'Genomics', 'Medical Devices', 'Healthcare AI'],
    totalInvestments: 67,
    successfulExits: 18,
    averageCheckSize: 8500000,
    responseTime: '< 3 days'
  },
  {
    id: '4',
    name: 'James Wilson',
    title: 'General Partner',
    firm: 'Benchmark',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    firmLogo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
    rating: 4.9,
    reviews: 41,
    investmentFocus: ['Consumer', 'Mobile', 'Social', 'E-commerce'],
    preferredStage: ['Seed', 'Series A'],
    minInvestment: 2000000,
    maxInvestment: 12000000,
    location: 'San Francisco, CA',
    timezone: 'PST',
    isActive: false,
    bio: 'General Partner at Benchmark with 20+ years in venture capital. Early investor in Twitter, Uber, Instagram, and Snapchat. Expert in consumer internet and mobile applications.',
    portfolioCompanies: ['Twitter', 'Uber', 'Instagram', 'Snapchat', 'Discord'],
    recentInvestments: ['TikTok', 'Clubhouse', 'Substack'],
    expertise: ['Consumer Internet', 'Social Media', 'Mobile Apps', 'Creator Economy'],
    totalInvestments: 156,
    successfulExits: 34,
    averageCheckSize: 6200000,
    responseTime: '< 1 week'
  },
  {
    id: '5',
    name: 'Lisa Zhang',
    title: 'Investment Director',
    firm: 'GV (Google Ventures)',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    firmLogo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
    rating: 4.6,
    reviews: 29,
    investmentFocus: ['AI/ML', 'Robotics', 'IoT', 'Cloud Infrastructure'],
    preferredStage: ['Series A', 'Series B'],
    minInvestment: 4000000,
    maxInvestment: 18000000,
    location: 'Mountain View, CA',
    timezone: 'PST',
    isActive: true,
    bio: 'Investment Director at GV focusing on AI and deep tech investments. Former Google engineer with PhD in Computer Science. Expertise in machine learning and cloud technologies.',
    portfolioCompanies: ['Slack', 'Uber', 'Nest', 'Medium', 'Flatiron Health'],
    recentInvestments: ['DeepMind', 'Waymo', 'Verily'],
    expertise: ['Artificial Intelligence', 'Machine Learning', 'Cloud Computing', 'Robotics'],
    totalInvestments: 73,
    successfulExits: 12,
    averageCheckSize: 9200000,
    responseTime: '< 5 days'
  }
]

const INVESTMENT_STAGES = [
  'All Stages',
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C',
  'Growth'
]

const FOCUS_AREAS = [
  'All',
  'SaaS',
  'AI/ML',
  'HealthTech',
  'Fintech',
  'Consumer',
  'Enterprise',
  'Crypto/Web3',
  'E-commerce',
  'Developer Tools'
]

const InvestorIslandPage: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState('All Stages')
  const [selectedFocus, setSelectedFocus] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showActiveOnly, setShowActiveOnly] = useState(false)
  const [minInvestment, setMinInvestment] = useState('')
  const [maxInvestment, setMaxInvestment] = useState('')

  const filteredInvestors = MOCK_INVESTORS.filter(investor => {
    const matchesStage = selectedStage === 'All Stages' || investor.preferredStage.includes(selectedStage)
    const matchesFocus = selectedFocus === 'All' || investor.investmentFocus.includes(selectedFocus)
    const matchesSearch = investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         investor.firm.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         investor.investmentFocus.some(focus => focus.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesActive = !showActiveOnly || investor.isActive

    const minInv = minInvestment ? parseInt(minInvestment) * 1000000 : 0
    const maxInv = maxInvestment ? parseInt(maxInvestment) * 1000000 : Infinity
    const matchesInvestmentRange = investor.minInvestment >= minInv && investor.maxInvestment <= maxInv

    return matchesStage && matchesFocus && matchesSearch && matchesActive && matchesInvestmentRange
  })

  const handleConnectInvestor = (investor: Investor) => {
    toast.success(`Connection request sent to ${investor.name}! 🤝`)
  }

  const handleScheduleMeeting = (investor: Investor) => {
    toast.success(`Meeting request sent to ${investor.name}! 📅`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-3 sm:p-4 rounded-full">
                <DollarSign className="h-8 w-8 sm:h-12 sm:w-12" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-4">Investor Island</h1>
            <p className="text-base sm:text-xl text-green-100 max-w-2xl mx-auto px-4">
              Connect with top-tier investors and VCs. Pitch your startup and secure the funding you need to scale
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">200+</div>
                <div className="text-green-100">Active Investors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">$2.5B+</div>
                <div className="text-green-100">Total Invested</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">150+</div>
                <div className="text-green-100">Successful Exits</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">85%</div>
                <div className="text-green-100">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search investors by name, firm, or focus area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Stage Filter */}
            <div>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {INVESTMENT_STAGES.map((stage) => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            {/* Focus Filter */}
            <div>
              <select
                value={selectedFocus}
                onChange={(e) => setSelectedFocus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {FOCUS_AREAS.map((focus) => (
                  <option key={focus} value={focus}>{focus}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Investment Range */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Investment (M)
              </label>
              <input
                type="number"
                placeholder="e.g., 1"
                value={minInvestment}
                onChange={(e) => setMinInvestment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Investment (M)
              </label>
              <input
                type="number"
                placeholder="e.g., 25"
                value={maxInvestment}
                onChange={(e) => setMaxInvestment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showActiveOnly}
                  onChange={(e) => setShowActiveOnly(e.target.checked)}
                  className="sr-only"
                />
                <div className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  showActiveOnly ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                )}>
                  <div className={cn(
                    'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform',
                    showActiveOnly ? 'translate-x-5' : 'translate-x-0'
                  )} />
                </div>
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Active only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredInvestors.length} investor{filteredInvestors.length !== 1 ? 's' : ''}
            {selectedStage !== 'All Stages' && ` for ${selectedStage}`}
            {selectedFocus !== 'All' && ` in ${selectedFocus}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Investors Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {filteredInvestors.map((investor) => (
            <div
              key={investor.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200"
            >
              {/* Investor Header */}
              <div className="flex items-start space-x-4 mb-4">
                <div className="relative">
                  <img
                    src={investor.avatar}
                    alt={investor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className={cn(
                    'absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800',
                    investor.isActive ? 'bg-green-500' : 'bg-gray-400'
                  )} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {investor.name}
                  </h3>
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    {investor.title}
                  </p>
                  <div className="flex items-center mt-1">
                    <img
                      src={investor.firmLogo}
                      alt={investor.firm}
                      className="w-5 h-5 rounded mr-2"
                    />
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {investor.firm}
                    </p>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">
                        {investor.rating}
                      </span>
                    </div>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {investor.reviews} reviews
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    ${(investor.minInvestment / 1000000).toFixed(0)}M - ${(investor.maxInvestment / 1000000).toFixed(0)}M
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Check Size
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {investor.bio}
              </p>

              {/* Investment Focus */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Investment Focus</h4>
                <div className="flex flex-wrap gap-2">
                  {investor.investmentFocus.slice(0, 3).map((focus, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300 rounded-full text-xs font-medium"
                    >
                      {focus}
                    </span>
                  ))}
                  {investor.investmentFocus.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-full text-xs">
                      +{investor.investmentFocus.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Preferred Stages */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Preferred Stages</h4>
                <div className="flex flex-wrap gap-2">
                  {investor.preferredStage.map((stage, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 rounded-full text-xs font-medium"
                    >
                      {stage}
                    </span>
                  ))}
                </div>
              </div>

              {/* Portfolio Companies */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Notable Portfolio</h4>
                <div className="flex flex-wrap gap-1">
                  {investor.portfolioCompanies.slice(0, 4).map((company, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded text-xs"
                    >
                      {company}
                    </span>
                  ))}
                  {investor.portfolioCompanies.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded text-xs">
                      +{investor.portfolioCompanies.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {investor.totalInvestments}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Investments</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {investor.successfulExits}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Exits</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {investor.responseTime}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Response</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleConnectInvestor(investor)}
                  disabled={!investor.isActive}
                  className={cn(
                    'flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors',
                    investor.isActive
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                  )}
                >
                  <Users className="h-4 w-4 mr-2" />
                  {investor.isActive ? 'Connect' : 'Unavailable'}
                </button>
                <button
                  onClick={() => handleScheduleMeeting(investor)}
                  disabled={!investor.isActive}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium transition-colors',
                    investor.isActive
                      ? 'border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                      : 'border border-gray-300 text-gray-400 cursor-not-allowed dark:border-gray-600'
                  )}
                >
                  <Calendar className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredInvestors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No investors found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search criteria or browse all investors
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedStage('All Stages')
                setSelectedFocus('All')
                setShowActiveOnly(false)
                setMinInvestment('')
                setMaxInvestment('')
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default InvestorIslandPage
