import { api } from '../api'
import { setStoredToken, clearAuthData } from '../auth-utils'
import type { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  ApiResponse 
} from '../types'

export const authService = api.injectEndpoints({
  endpoints: (builder) => ({
    // Login user
    login: builder.mutation<ApiResponse<AuthResponse>, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // Store the access token from response body
          if (data.data.access_token) {
            setStoredToken(data.data.access_token)
          }
        } catch (error) {
          // Handle login error
          console.error('Login failed:', error)
        }
      },
    }),

    // Register user
    register: builder.mutation<ApiResponse<AuthResponse>, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // Store the access token from response body
          if (data.data.access_token) {
            setStoredToken(data.data.access_token)
          }
        } catch (error) {
          // Handle registration error
          console.error('Registration failed:', error)
        }
      },
    }),

    // Get current user
    getCurrentUser: builder.query<ApiResponse<User>, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    // Logout user
    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          // Clear all auth data on successful logout
          clearAuthData()
        } catch (error) {
          // Even if logout fails on server, clear local auth data
          clearAuthData()
          console.error('Logout failed:', error)
        }
      },
    }),

    // Update user profile
    updateProfile: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (userData) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    // Verify email
    verifyEmail: builder.mutation<ApiResponse<null>, { token: string }>({
      query: ({ token }) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: { token },
      }),
      invalidatesTags: ['User'],
    }),

    // Request password reset
    requestPasswordReset: builder.mutation<ApiResponse<null>, { email: string }>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Reset password
    resetPassword: builder.mutation<ApiResponse<null>, { token: string; password: string }>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Refresh token
    refreshToken: builder.mutation<ApiResponse<{ access_token: string }>, { refresh_token: string }>({
      query: (data) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // Store the new access token
          if (data.data.access_token) {
            setStoredToken(data.data.access_token)
          }
        } catch (error) {
          // Refresh failed, clear auth data
          clearAuthData()
          console.error('Token refresh failed:', error)
        }
      },
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useUpdateProfileMutation,
  useVerifyEmailMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
} = authService
