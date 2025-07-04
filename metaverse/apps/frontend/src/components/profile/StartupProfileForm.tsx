import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { 
  Building2, 
  Users, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Globe, 
  Save,
  Loader2
} from 'lucide-react'
import { profileAPI } from '../../lib/api'
import { useAuthStore } from '../../store/authStore'
import { cn } from '../../lib/utils'

interface StartupProfileFormData {
  companyName: string
  description: string
  industry: string
  stage: string
  foundedYear: number
  location: string
  website?: string
  teamSize: number
  fundingRaised: number
  fundingGoal: number
  pitchDeck?: string
  businessModel: string
  targetMarket: string
  competitiveAdvantage: string
  revenueModel: string
  keyMetrics: string
  challenges: string
  lookingFor: string[]
}

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce',
  'SaaS', 'Mobile Apps', 'AI/ML', 'Blockchain', 'IoT', 'Gaming',
  'Social Media', 'Marketplace', 'B2B Services', 'Consumer Goods', 'Other'
]

const STAGES = [
  'Idea', 'MVP', 'Early Stage', 'Growth Stage', 'Scaling', 'Mature'
]

const LOOKING_FOR_OPTIONS = [
  'Funding', 'Mentorship', 'Co-founder', 'Team Members', 'Customers',
  'Partnerships', 'Technical Guidance', 'Business Development', 'Marketing Help'
]

interface StartupProfileFormProps {
  initialData?: Partial<StartupProfileFormData>
  onSuccess?: () => void
}

const StartupProfileForm: React.FC<StartupProfileFormProps> = ({ 
  initialData, 
  onSuccess 
}) => {
  const { setStartupProfile, updateUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLookingFor, setSelectedLookingFor] = useState<string[]>(
    initialData?.lookingFor || []
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<StartupProfileFormData>({
    defaultValues: initialData
  })

  const onSubmit = async (data: StartupProfileFormData) => {
    try {
      setIsLoading(true)

      // Validate that at least one "looking for" option is selected
      if (selectedLookingFor.length === 0) {
        toast.error('Please select at least one option for what you are looking for')
        return
      }

      const profileData = {
        ...data,
        lookingFor: selectedLookingFor
      }

      console.log('Submitting startup profile:', profileData)
      const response = await profileAPI.createStartupProfile(profileData)
      console.log('Profile created successfully:', response)

      setStartupProfile(response.profile)
      updateUser({ hasStartupProfile: true })

      toast.success('Startup profile saved successfully! 🎉')
      onSuccess?.()
    } catch (error: any) {
      console.error('Failed to save startup profile:', error)
      toast.error(error.response?.data?.message || error.message || 'Failed to save profile')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleLookingFor = (option: string) => {
    setSelectedLookingFor(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-8">
          <div className="bg-brand-primary-100 dark:bg-brand-primary-900/20 p-3 rounded-lg mr-4">
            <Building2 className="h-8 w-8 text-brand-primary-600 dark:text-brand-primary-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Startup Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tell us about your startup to connect with the right mentors and investors
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name *
              </label>
              <input
                {...register('companyName', { required: 'Company name is required' })}
                type="text"
                className={cn(
                  'block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-colors',
                  errors.companyName
                    ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                )}
                placeholder="Enter your company name"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Industry *
              </label>
              <select
                {...register('industry', { required: 'Industry is required' })}
                className={cn(
                  'block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-colors',
                  errors.industry
                    ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                )}
              >
                <option value="">Select industry</option>
                {INDUSTRIES.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
              {errors.industry && (
                <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company Description *
            </label>
            <textarea
              {...register('description', { 
                required: 'Description is required',
                minLength: { value: 50, message: 'Description must be at least 50 characters' }
              })}
              rows={4}
              className={cn(
                'block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-colors resize-none',
                errors.description
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              )}
              placeholder="Describe what your startup does, the problem you solve, and your unique value proposition..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Stage and Year */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stage *
              </label>
              <select
                {...register('stage', { required: 'Stage is required' })}
                className={cn(
                  'block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-colors',
                  errors.stage
                    ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                )}
              >
                <option value="">Select stage</option>
                {STAGES.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
              {errors.stage && (
                <p className="mt-1 text-sm text-red-600">{errors.stage.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Founded Year *
              </label>
              <input
                {...register('foundedYear', { 
                  required: 'Founded year is required',
                  min: { value: 1900, message: 'Invalid year' },
                  max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' }
                })}
                type="number"
                className={cn(
                  'block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-colors',
                  errors.foundedYear
                    ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                )}
                placeholder="2024"
              />
              {errors.foundedYear && (
                <p className="mt-1 text-sm text-red-600">{errors.foundedYear.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Team Size *
              </label>
              <input
                {...register('teamSize', { 
                  required: 'Team size is required',
                  min: { value: 1, message: 'Team size must be at least 1' }
                })}
                type="number"
                className={cn(
                  'block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-colors',
                  errors.teamSize
                    ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                )}
                placeholder="5"
              />
              {errors.teamSize && (
                <p className="mt-1 text-sm text-red-600">{errors.teamSize.message}</p>
              )}
            </div>
          </div>

          {/* Location and Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('location', { required: 'Location is required' })}
                  type="text"
                  className={cn(
                    'block w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-colors',
                    errors.location
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  )}
                  placeholder="San Francisco, CA"
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('website')}
                  type="url"
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700"
                  placeholder="https://yourcompany.com"
                />
              </div>
            </div>
          </div>

          {/* What are you looking for? */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              What are you looking for? *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {LOOKING_FOR_OPTIONS.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleLookingFor(option)}
                  className={cn(
                    'px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all',
                    selectedLookingFor.includes(option)
                      ? 'border-brand-primary-500 bg-brand-primary-50 text-brand-primary-700 dark:bg-brand-primary-900/20 dark:text-brand-primary-300'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-brand-primary-300 hover:bg-brand-primary-50 dark:hover:bg-brand-primary-900/10'
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
            {selectedLookingFor.length === 0 && (
              <p className="mt-2 text-sm text-red-600">Please select at least one option</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={isLoading || selectedLookingFor.length === 0}
              className={cn(
                'flex items-center px-6 py-3 bg-brand-primary-600 text-white rounded-lg font-medium transition-colors',
                isLoading || selectedLookingFor.length === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:ring-offset-2'
              )}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Save className="h-5 w-5 mr-2" />
              )}
              {isLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StartupProfileForm
