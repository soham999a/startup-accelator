import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import { profileAPI } from './lib/api'

// Layout Components
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import BottomNavigation from './components/layout/BottomNavigation'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import LogoutPage from './pages/LogoutPage'

// Main Pages
import DashboardPage from './pages/DashboardPage'
import LobbyPage from './pages/LobbyPage'
import ProfilePage from './pages/ProfilePage'

// Startup Accelerator Pages
import StartupBoothPage from './pages/StartupBoothPage'
import PitchStagePage from './pages/PitchStagePage'
import MentorLoungePage from './pages/MentorLoungePage'
import InvestorIslandPage from './pages/InvestorIslandPage'
import ResourcePavilionPage from './pages/ResourcePavilionPage'

// Components
import LoadingSpinner from './components/ui/LoadingSpinner'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  const {
    isAuthenticated,
    token,
    user,
    isLoading,
    setLoading,
    setStartupProfile,
    setMentorProfile,
    setInvestorProfile,
    updateUser,
    logout
  } = useAuthStore()

  // Initialize authentication and load user profile data on app start
  useEffect(() => {
    const initializeAuth = async () => {
      // If we have a token but no user data, fetch user profile
      if (token && !user) {
        try {
          setLoading(true)
          const response = await profileAPI.getMe()
          const userData = response.user

          // Update user with complete profile data
          updateUser({
            ...userData,
            hasStartupProfile: !!userData.startupProfile,
            hasMentorProfile: !!userData.mentorProfile,
            hasInvestorProfile: !!userData.investorProfile
          })

          // Update profiles in store
          if (userData.startupProfile) {
            setStartupProfile(userData.startupProfile)
          }
          if (userData.mentorProfile) {
            setMentorProfile(userData.mentorProfile)
          }
          if (userData.investorProfile) {
            setInvestorProfile(userData.investorProfile)
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error)
          // If token is invalid, clear auth state
          logout()
        } finally {
          setLoading(false)
        }
      } else if (!token) {
        // No token, create mock user for testing
        const mockUser = {
          id: 'user-1',
          username: 'testuser',
          email: 'test@example.com',
          userType: 'FOUNDER' as const,
          firstName: 'John',
          lastName: 'Doe',
          isVerified: true,
          hasStartupProfile: false,
          hasMentorProfile: false,
          hasInvestorProfile: false,
          profileImage: undefined,
          bio: 'Passionate entrepreneur building the future',
          joinedAt: new Date().toISOString()
        }

        // Auto-login with mock user for development
        useAuthStore.getState().login('mock-token', mockUser)
        setLoading(false)
      }
    }

    initializeAuth()
  }, [token, user, setLoading, setStartupProfile, setMentorProfile, setInvestorProfile, updateUser, logout])

  // Show loading screen while initializing auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Initializing Startup Accelerator...
          </p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />

        <Routes>
          {/* Root Route */}
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            }
          />

          {/* Logout Route */}
          <Route
            path="/logout"
            element={<LogoutPage />}
          />

          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
            }
          />
          <Route
            path="/signup"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />
            }
          />

          {/* Protected Routes */}
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="flex h-screen">
                {/* Sidebar - Hidden on mobile */}
                <div className="hidden sm:block">
                  <Sidebar />
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Navbar */}
                  <Navbar />

                  {/* Page Content */}
                  <main className="flex-1 overflow-auto pb-16 sm:pb-0">
                    <Routes>
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/lobby" element={<LobbyPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/startup-booth" element={<StartupBoothPage />} />
                      <Route path="/pitch-stage" element={<PitchStagePage />} />
                      <Route path="/mentor-lounge" element={<MentorLoungePage />} />
                      <Route path="/investor-island" element={<InvestorIslandPage />} />
                      <Route path="/resource-pavilion" element={<ResourcePavilionPage />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </main>
                </div>

                {/* Mobile Bottom Navigation */}
                <BottomNavigation />
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
