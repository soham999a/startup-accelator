// Simple Authentication Service
import { toast } from 'react-hot-toast'

// Mock user database (in real app, this would be in backend)
const MOCK_USERS = [
  {
    id: '1',
    email: 'demo@example.com',
    password: 'password123',
    firstName: 'Demo',
    lastName: 'User',
    userType: 'FOUNDER',
    provider: 'email'
  },
  {
    id: '2',
    email: 'investor@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Investor',
    userType: 'INVESTOR',
    provider: 'email'
  },
  {
    id: '3',
    email: 'mentor@example.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Mentor',
    userType: 'MENTOR',
    provider: 'email'
  }
]

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  userType: 'FOUNDER' | 'INVESTOR' | 'MENTOR'
  provider: 'email' | 'google'
  avatar?: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  message?: string
}

class AuthService {
  private currentUser: User | null = null
  private token: string | null = null

  constructor() {
    // Load user from localStorage on init
    this.loadFromStorage()
  }

  private loadFromStorage() {
    try {
      const userData = localStorage.getItem('auth_user')
      const tokenData = localStorage.getItem('auth_token')
      
      if (userData && tokenData) {
        this.currentUser = JSON.parse(userData)
        this.token = tokenData
      }
    } catch (error) {
      console.error('Error loading auth data:', error)
    }
  }

  private saveToStorage(user: User, token: string) {
    try {
      localStorage.setItem('auth_user', JSON.stringify(user))
      localStorage.setItem('auth_token', token)
      this.currentUser = user
      this.token = token
    } catch (error) {
      console.error('Error saving auth data:', error)
    }
  }

  private clearStorage() {
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
    this.currentUser = null
    this.token = null
  }

  // Email/Password Login
  async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const user = MOCK_USERS.find(u => u.email === email && u.password === password)
      
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        }
      }

      const { password: _, ...userWithoutPassword } = user
      const token = 'mock_token_' + Date.now()
      
      this.saveToStorage(userWithoutPassword as User, token)
      
      toast.success('Login successful!')
      
      return {
        success: true,
        user: userWithoutPassword as User,
        token
      }
    } catch (error) {
      return {
        success: false,
        message: 'Login failed. Please try again.'
      }
    }
  }

  // Email/Password Signup
  async signupWithEmail(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    userType: 'FOUNDER' | 'INVESTOR' | 'MENTOR'
  }): Promise<AuthResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => u.email === data.email)
      if (existingUser) {
        return {
          success: false,
          message: 'User with this email already exists'
        }
      }

      // Create new user
      const newUser: User = {
        id: 'user_' + Date.now(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        userType: data.userType,
        provider: 'email'
      }

      // Add to mock database
      MOCK_USERS.push({
        ...newUser,
        password: data.password
      } as any)

      const token = 'mock_token_' + Date.now()
      this.saveToStorage(newUser, token)
      
      toast.success('Account created successfully!')
      
      return {
        success: true,
        user: newUser,
        token
      }
    } catch (error) {
      return {
        success: false,
        message: 'Signup failed. Please try again.'
      }
    }
  }

  // Google Login (Mock)
  async loginWithGoogle(): Promise<AuthResponse> {
    try {
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500))

      const googleUser: User = {
        id: 'google_' + Date.now(),
        email: 'user@gmail.com',
        firstName: 'Google',
        lastName: 'User',
        userType: 'FOUNDER',
        provider: 'google',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      }

      const token = 'google_token_' + Date.now()
      this.saveToStorage(googleUser, token)
      
      toast.success('Google login successful!')
      
      return {
        success: true,
        user: googleUser,
        token
      }
    } catch (error) {
      return {
        success: false,
        message: 'Google login failed. Please try again.'
      }
    }
  }

  // Logout
  logout() {
    this.clearStorage()
    toast.success('Logged out successfully!')
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null && this.token !== null
  }

  // Get auth token
  getToken(): string | null {
    return this.token
  }
}

// Export singleton instance
export const authService = new AuthService()
export default authService
