import {
  ApiResponse,
  User,
} from "@/lib/utils/types/types";
import { api } from "@/lib/api/api";


export const userService = api.injectEndpoints({
  endpoints: (builder) => ({
    // Login user

    // Get current user
    getUserDetails: builder.query<ApiResponse<User>, Partial<User>>({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Update user profile
    updateProfile: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (userData) => ({
        url: "/auth/profile",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // Verify email
    verifyEmail: builder.mutation<ApiResponse<null>, { token: string }>({
      query: ({ token }) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: { token },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserDetailsQuery,
  useUpdateProfileMutation,
  useVerifyEmailMutation,
} = userService;