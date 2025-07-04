import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  bio?: string
  userType: 'FOUNDER' | 'MENTOR' | 'INVESTOR' | 'ADMIN'
  isVerified: boolean
  profileImage?: string
  hasStartupProfile: boolean
  hasMentorProfile: boolean
  hasInvestorProfile: boolean
  joinedAt?: string
}

export interface StartupProfile {
  id: string
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
  createdAt?: string
  updatedAt?: string
}

export interface MentorProfile {
  id: string
  title: string
  company?: string
  experience?: number
  expertise: string[]
  isAvailable: boolean
  hourlyRate?: number
  timezone?: string
  achievements?: string
  linkedinUrl?: string
  calendlyUrl?: string
  sessionDuration: number
  maxBookingsPerDay: number
}

export interface InvestorProfile {
  id: string
  firm: string
  title: string
  investmentFocus: string[]
  minInvestment?: number
  maxInvestment?: number
  preferredStage: string[]
  bio?: string
  linkedinUrl?: string
  firmWebsite?: string
  portfolioUrl?: string
  isAvailable: boolean
}

interface AuthState {
  // Auth state
  isAuthenticated: boolean
  token: string | null
  user: User | null
  
  // Profile state
  startupProfile: StartupProfile | null
  mentorProfile: MentorProfile | null
  investorProfile: InvestorProfile | null
  
  // Loading states
  isLoading: boolean
  isProfileLoading: boolean
  
  // Actions
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  setStartupProfile: (profile: StartupProfile | null) => void
  setMentorProfile: (profile: MentorProfile | null) => void
  setInvestorProfile: (profile: InvestorProfile | null) => void
  setLoading: (loading: boolean) => void
  setProfileLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      token: null,
      user: null,
      startupProfile: null,
      mentorProfile: null,
      investorProfile: null,
      isLoading: false,
      isProfileLoading: false,

      // Actions
      login: (token: string, user: User) => {
        set({
          isAuthenticated: true,
          token,
          user,
          isLoading: false,
        })
      },

      logout: () => {
        set({
          isAuthenticated: false,
          token: null,
          user: null,
          startupProfile: null,
          mentorProfile: null,
          investorProfile: null,
          isLoading: false,
          isProfileLoading: false,
        })
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData }
          })
        }
      },

      setStartupProfile: (profile: StartupProfile | null) => {
        set({ startupProfile: profile })
        
        // Update user's hasStartupProfile flag
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, hasStartupProfile: !!profile }
          })
        }
      },

      setMentorProfile: (profile: MentorProfile | null) => {
        set({ mentorProfile: profile })
        
        // Update user's hasMentorProfile flag
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, hasMentorProfile: !!profile }
          })
        }
      },

      setInvestorProfile: (profile: InvestorProfile | null) => {
        set({ investorProfile: profile })
        
        // Update user's hasInvestorProfile flag
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, hasInvestorProfile: !!profile }
          })
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setProfileLoading: (loading: boolean) => {
        set({ isProfileLoading: loading })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        user: state.user,
        startupProfile: state.startupProfile,
        mentorProfile: state.mentorProfile,
        investorProfile: state.investorProfile,
      }),
    }
  )
)

// Selectors for easier access
export const useAuth = () => {
  const { isAuthenticated, token, user, isLoading } = useAuthStore()
  return { isAuthenticated, token, user, isLoading }
}

export const useProfiles = () => {
  const { startupProfile, mentorProfile, investorProfile, isProfileLoading } = useAuthStore()
  return { startupProfile, mentorProfile, investorProfile, isProfileLoading }
}

export const useUserType = () => {
  const user = useAuthStore((state) => state.user)
  return user?.userType || null
}

export const useIsFounder = () => {
  const userType = useUserType()
  return userType === 'FOUNDER'
}

export const useIsMentor = () => {
  const userType = useUserType()
  return userType === 'MENTOR'
}

export const useIsInvestor = () => {
  const userType = useUserType()
  return userType === 'INVESTOR'
}

export const useIsAdmin = () => {
  const userType = useUserType()
  return userType === 'ADMIN'
}
