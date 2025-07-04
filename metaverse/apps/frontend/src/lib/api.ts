import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:3000')
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false' // Default to true for development

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Mock data storage
const mockStorage = {
  profiles: new Map(),
  startupProfiles: new Map(),
  mentorProfiles: new Map(),
  investorProfiles: new Map()
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      useAuthStore.getState().logout()
      toast.error('Session expired. Please login again.')
      window.location.href = '/login'
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else if (error.message) {
      toast.error(error.message)
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  signup: async (data: {
    username: string
    email: string
    password: string
    firstName?: string
    lastName?: string
    userType: 'FOUNDER' | 'MENTOR' | 'INVESTOR'
  }) => {
    const response = await api.post('/signup', data)
    return response.data
  },

  signin: async (data: { email: string; password: string }) => {
    const response = await api.post('/signin', data)
    return response.data
  },
}

// Profile API
export const profileAPI = {
  getMe: async () => {
    const response = await api.get('/profiles/me')
    return response.data
  },

  updateMe: async (data: {
    firstName?: string
    lastName?: string
    bio?: string
    profileImage?: string
  }) => {
    if (USE_MOCK_API) {
      // Update mock user data
      const currentUser = useAuthStore.getState().user
      if (currentUser) {
        const updatedUser = { ...currentUser, ...data }
        useAuthStore.getState().updateUser(data)
        return {
          success: true,
          user: updatedUser
        }
      }
      throw new Error('No user found')
    }
    const response = await api.put('/profiles/me', data)
    return response.data
  },

  // Startup Profile
  createStartupProfile: async (data: any) => {
    if (USE_MOCK_API) {
      // Create mock startup profile
      const profile = {
        id: 'startup-' + Date.now(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const userId = useAuthStore.getState().user?.id
      if (userId) {
        mockStorage.startupProfiles.set(userId, profile)
      }

      return {
        success: true,
        profile: profile
      }
    }
    const response = await api.post('/profiles/startup', data)
    return response.data
  },

  updateStartupProfile: async (data: any) => {
    const response = await api.put('/profiles/startup', data)
    return response.data
  },

  // Mentor Profile
  createMentorProfile: async (data: any) => {
    const response = await api.post('/profiles/mentor', data)
    return response.data
  },

  updateMentorProfile: async (data: any) => {
    const response = await api.put('/profiles/mentor', data)
    return response.data
  },

  // Investor Profile
  createInvestorProfile: async (data: any) => {
    const response = await api.post('/profiles/investor', data)
    return response.data
  },

  updateInvestorProfile: async (data: any) => {
    const response = await api.put('/profiles/investor', data)
    return response.data
  },

  // Discovery with filters
  getStartups: async (filters?: {
    industry?: string
    stage?: string
    location?: string
    limit?: number
  }) => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString())
      })
    }
    const response = await api.get(`/profiles/startups?${params}`)
    return response.data
  },

  getMentors: async (filters?: {
    expertise?: string
    industry?: string
    availability?: string
    limit?: number
  }) => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString())
      })
    }
    const response = await api.get(`/profiles/mentors?${params}`)
    return response.data
  },

  getInvestors: async (filters?: {
    investorType?: string
    focusArea?: string
    investmentRange?: string
    limit?: number
  }) => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString())
      })
    }
    const response = await api.get(`/profiles/investors?${params}`)
    return response.data
  },
}

// Space API
export const spaceAPI = {
  getAll: async () => {
    const response = await api.get('/space/all')
    return response.data
  },

  create: async (data: {
    name: string
    dimensions: string
    mapId?: string
  }) => {
    const response = await api.post('/space', data)
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/space/${id}`)
    return response.data
  },

  addElement: async (data: {
    spaceId: string
    elementId: string
    x: number
    y: number
  }) => {
    const response = await api.post('/space/element', data)
    return response.data
  },

  deleteElement: async (elementId: string) => {
    const response = await api.delete('/space/element', {
      data: { id: elementId }
    })
    return response.data
  },
}

// Elements API
export const elementsAPI = {
  getAll: async () => {
    const response = await api.get('/elements')
    return response.data
  },
}

// Avatars API
export const avatarsAPI = {
  getAll: async () => {
    const response = await api.get('/avatars')
    return response.data
  },
}

// User API
export const userAPI = {
  updateMetadata: async (data: { avatarId: string }) => {
    const response = await api.post('/user/metadata', data)
    return response.data
  },
}

// Generic API helper functions
export const apiHelpers = {
  // Upload file (placeholder - implement based on your file upload strategy)
  uploadFile: async (file: File, type: 'image' | 'document' | 'video') => {
    // This would typically upload to a service like AWS S3, Cloudinary, etc.
    // For now, return a placeholder URL
    return Promise.resolve({
      url: `https://placeholder.com/${type}/${file.name}`,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  },

  // Download file
  downloadFile: async (url: string, filename: string) => {
    const response = await fetch(url)
    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  },
}

export default api
