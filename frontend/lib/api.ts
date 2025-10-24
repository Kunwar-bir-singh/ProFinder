import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { getStoredToken, setStoredToken, removeStoredToken, isTokenExpired, getRefreshTokenFromCookies, clearAuthData } from './auth-utils'

// Define the base URL for your API
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Create base query with token handling
const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    // Add authentication headers if needed
    const token = getStoredToken()
    if (token && !isTokenExpired(token)) {
      headers.set('authorization', `Bearer ${token}`)
    }
    headers.set('content-type', 'application/json')
    return headers
  },
  credentials: 'include', // Include cookies for refresh token
})

// Enhanced base query with token refresh logic
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  // If we get a 401, try to refresh the token
  if (result.error && result.error.status === 401) {
    const refreshToken = getRefreshTokenFromCookies()
    
    if (refreshToken) {
      // Try to refresh the token
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refresh_token: refreshToken },
        },
        api,
        extraOptions
      )

      if (refreshResult.data) {
        // Store the new token
        const { access_token } = refreshResult.data as { access_token: string }
        setStoredToken(access_token)
        
        // Retry the original request with new token
        result = await baseQuery(args, api, extraOptions)
      } else {
        // Refresh failed, clear auth data
        clearAuthData()
        // You might want to redirect to login page here
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    } else {
      // No refresh token, clear auth data
      clearAuthData()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  }

  return result
}

// Create the base API slice
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Profession', 'Provider', 'Search'],
  endpoints: () => ({}),
})
