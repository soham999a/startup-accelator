import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const LogoutPage: React.FC = () => {
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  useEffect(() => {
    // Clear all authentication data
    logout()
    
    // Clear localStorage completely
    localStorage.clear()
    
    // Show success message
    toast.success('Logged out successfully!')
    
    // Redirect to login after a short delay
    setTimeout(() => {
      window.location.href = '/login'
    }, 1000)
  }, [logout])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Logging out...</h2>
          <p className="text-gray-600">Please wait while we sign you out.</p>
        </div>
      </div>
    </div>
  )
}

export default LogoutPage
