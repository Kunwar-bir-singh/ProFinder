import {
  ApiResponse,
  User,
} from "@/lib/utils/types/types";
import { api } from "@/lib/api/api";


export const userService = api.injectEndpoints({
  endpoints: (builder) => ({

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
        url: "/user/profile",
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // // Verify email
    // verifyEmail: builder.mutation<ApiResponse<null>, { token: string }>({
    //   query: ({ token }) => ({
    //     url: "/auth/verify-email",
    //     method: "POST",
    //     body: { token },
    //   }),
    //   invalidatesTags: ["User"],
    // }),

    // Request verification (for user profile verification)
    requestVerification: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: "/user/request-verification",
        method: "POST",
      }),
    }),

    // Verify profile with OTP
    verifyProfile: builder.mutation<ApiResponse<null>, { otp: string; email: string }>({
      query: (data) => ({
        url: "/user/verify-profile",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserDetailsQuery,
  useUpdateProfileMutation,
  useRequestVerificationMutation,
  useVerifyProfileMutation,
} = userService;