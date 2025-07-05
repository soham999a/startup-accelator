import React, { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'

interface GoogleOAuthButtonProps {
  mode: 'signin' | 'signup'
  onSuccess?: () => void
  onError?: (error: string) => void
}

declare global {
  interface Window {
    google: any
  }
}

const GoogleOAuthButton: React.FC<GoogleOAuthButtonProps> = ({ 
  mode, 
  onSuccess, 
  onError 
}) => {
  const googleButtonRef = useRef<HTMLDivElement>(null)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (window.google && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id_here',
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      })

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: mode === 'signin' ? 'signin_with' : 'signup_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      })
    }
  }, [mode])

  const handleGoogleResponse = async (response: any) => {
    try {
      const { credential } = response

      // Send credential to backend
      const apiResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/auth/google`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ credential }),
        }
      )

      const data = await apiResponse.json()

      if (!apiResponse.ok) {
        throw new Error(data.message || 'Authentication failed')
      }

      // Login user
      login(data.token, data.user)
      
      toast.success(`Welcome ${data.user.firstName || data.user.username}!`)
      
      if (onSuccess) {
        onSuccess()
      } else {
        navigate('/dashboard')
      }
    } catch (error: any) {
      console.error('Google OAuth error:', error)
      const errorMessage = error.message || 'Google authentication failed'
      toast.error(errorMessage)
      
      if (onError) {
        onError(errorMessage)
      }
    }
  }

  return (
    <div className="w-full">
      <div ref={googleButtonRef} className="w-full flex justify-center" />
    </div>
  )
}

export default GoogleOAuthButton
