// Token management utilities
export const TOKEN_KEY = 'access_token'

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export const setStoredToken = (token: string): void => {
  console.log("typeof window", typeof window);
  
  if (typeof window === 'undefined') return
  console.log("Setting ", TOKEN_KEY, token);
  
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeStoredToken = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
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
  
  const cookies = document.cookie.split(';')
  const refreshTokenCookie = cookies.find(cookie => 
    cookie.trim().startsWith('refresh_token=')
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
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }
}
