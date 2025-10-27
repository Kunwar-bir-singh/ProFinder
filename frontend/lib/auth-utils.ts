// Token management utilities - now using Redux store
import { store } from './store'
import { setAccessToken, clearAuth, updateAccessToken } from './slices/authSlice'

export const getStoredToken = (): string | null => {
  const state = store.getState()
  return state.auth.accessToken
}

export const setStoredToken = (token: string): void => {
  store.dispatch(setAccessToken(token))
}

export const removeStoredToken = (): void => {
  store.dispatch(clearAuth())
}

export const updateStoredToken = (token: string): void => {
  store.dispatch(updateAccessToken(token))
}

// Check if token is expired (basic check, you might want to decode JWT for more accuracy)
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    return payload.exp < currentTime
  } catch {
    return true // If we can't parse the token, consider it expired
  }
}

// Get token from cookies (for refresh token)
export const getRefreshTokenFromCookies = (): string | null => {
  if (typeof document === 'undefined') return null
  console.log('document', document);
  
  const cookies = document.cookie.split(';')
  const refreshTokenCookie = cookies.find(cookie => 
    cookie.trim().startsWith('refreshToken=')
  )
  
  if (refreshTokenCookie) {
    return refreshTokenCookie.split('=')[1]
  }
  
  return null
}

// Clear all auth data
export const clearAuthData = (): void => {
  removeStoredToken()
  // Clear refresh token cookie
  if (typeof document !== 'undefined') {
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }
}
