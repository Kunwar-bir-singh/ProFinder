import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/lib/utils/types/types";
import { api } from "@/lib/api/api";
import {
  clearAuthData,
  setStoredToken,
  updateStoredToken,
} from "@/lib/utils/auth-utils";

export const authService = api.injectEndpoints({
  endpoints: (builder) => ({
    // Login user
    login: builder.mutation<ApiResponse<AuthResponse>, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Store the access token in Redux store
          if (data.data.accessToken) {
            setStoredToken(data.data.accessToken);
          }
        } catch (error) {
          // Handle login error
          console.error("Login failed:", error);
        }
      },
    }),

    // Register user
    register: builder.mutation<ApiResponse<AuthResponse>, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Store the access token in Redux store
          if (data.data.accessToken) {
            setStoredToken(data.data.accessToken);
          }
        } catch (error) {
          // Handle registration error
          console.error("Registration failed:", error);
        }
      },
    }),

 

    // Logout user
    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Clear all auth data on successful logout
          clearAuthData();
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),


    // Request password reset
    requestPasswordReset: builder.mutation<
      ApiResponse<null>,
      { email: string }
    >({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // Reset password
    resetPassword: builder.mutation<
      ApiResponse<null>,
      { token: string; password: string }
    >({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    // Refresh token
    refreshToken: builder.mutation<ApiResponse<{ accessToken: string }>, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
        body: {},
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Update the access token in Redux store
          if (data.data.accessToken) {
            updateStoredToken(data.data.accessToken);
          }
        } catch (error) {
          // Refresh failed, clear auth data
          clearAuthData();
          console.error("Token refresh failed:", error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
} = authService;
