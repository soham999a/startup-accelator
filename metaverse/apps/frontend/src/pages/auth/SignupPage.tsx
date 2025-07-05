import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Rocket, Mail, Lock, User, Users } from 'lucide-react'
import { authAPI } from '../../lib/api'
import { useAuthStore } from '../../store/authStore'
import { cn } from '../../lib/utils'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import GoogleOAuthButton from '../../components/auth/GoogleOAuthButton'

interface SignupFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  userType: 'FOUNDER' | 'MENTOR' | 'INVESTOR'
}

const SignupPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, setLoading, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>()

  const password = watch('password')

  const onSubmit = async (data: SignupFormData) => {
    try {
      setLoading(true)
      const { confirmPassword, ...signupData } = data
      const response = await authAPI.signup(signupData)
      
      login(response.token, response.user)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error: any) {
      console.error('Signup error:', error)
      toast.error(error.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const userTypeOptions = [
    { value: 'FOUNDER', label: 'Founder', icon: '🚀', description: 'Building the next big thing' },
    { value: 'MENTOR', label: 'Mentor', icon: '🧠', description: 'Guiding startups to success' },
    { value: 'INVESTOR', label: 'Investor', icon: '💰', description: 'Funding innovative ideas' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-primary-50 via-brand-secondary-50 to-accent-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-brand-primary-600 p-3 rounded-full">
              <Rocket className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Join the Accelerator
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create your account and start your startup journey
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                I am a...
              </label>
              <div className="grid grid-cols-1 gap-3">
                {userTypeOptions.map((option) => (
                  <label key={option.value} className="relative">
                    <input
                      {...register('userType', { required: 'Please select your role' })}
                      type="radio"
                      value={option.value}
                      className="sr-only"
                    />
                    <div className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700 peer-checked:border-brand-primary-500 peer-checked:bg-brand-primary-50 dark:peer-checked:bg-brand-primary-900/20">
                      <span className="text-2xl mr-3">{option.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.userType && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.userType.message}
                </p>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  {...register('firstName', { required: 'First name is required' })}
                  type="text"
                  className={cn(
                    'block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-colors',
                    errors.firstName
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  )}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  {...register('lastName', { required: 'Last name is required' })}
                  type="text"
                  className={cn(
                    'block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-colors',
                    errors.lastName
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  )}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('username', {
                    required: 'Username is required',
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters',
                    },
                  })}
                  type="text"
                  className={cn(
                    'block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-colors',
                    errors.username
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  )}
                  placeholder="johndoe"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  type="email"
                  className={cn(
                    'block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-colors',
                    errors.email
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  )}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className={cn(
                      'block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-colors',
                      errors.password
                        ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    )}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) =>
                        value === password || 'Passwords do not match',
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={cn(
                      'block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-colors',
                      errors.confirmPassword
                        ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    )}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white',
                'bg-brand-primary-600 hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500',
                'transition-colors duration-200',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Google OAuth Button */}
          <div className="mt-6">
            <GoogleOAuthButton mode="signup" />
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-brand-primary-600 hover:text-brand-primary-500 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
