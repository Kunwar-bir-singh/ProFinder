import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRefreshTokenMutation } from '../services/auth.service'
import { clearAuthData } from '../auth-utils'
import { setAccessToken, clearAuth } from '../slices/authSlice'

export const useAuthInitialization = () => {
  const dispatch = useDispatch()
  const [refreshToken, { isLoading }] = useRefreshTokenMutation()
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔄 App refresh: Attempting to get new access token...')
        
        // Call refresh API without passing refresh token - backend will read it from httpOnly cookie
        const result = await refreshToken({}).unwrap()
        
        if (result.data?.accessToken) {
          console.log('✅ App refresh: Successfully got new access token')
          dispatch(setAccessToken(result.data.accessToken))
        } else {
          console.log('❌ App refresh: No access token in response')
          dispatch(clearAuth())
        }
      } catch (error) {
        console.log('❌ App refresh: Failed to refresh token, user needs to login')
        dispatch(clearAuth())
        // Don't redirect here - let the app handle it naturally
      } finally {
        setIsInitializing(false)
      }
    }

    initializeAuth()
  }, [dispatch, refreshToken])

  return { isLoading: isLoading || isInitializing }
}
