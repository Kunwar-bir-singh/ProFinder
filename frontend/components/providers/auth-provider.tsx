"use client"
import { ReactNode } from 'react'
import { useAuthInitialization } from '@/lib/hooks/useAuthInitialization'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isLoading } = useAuthInitialization()

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return <>{children}</>
}
