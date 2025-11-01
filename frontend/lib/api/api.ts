import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { clearAuthData, isTokenExpired, updateStoredToken } from "../utils/auth-utils";


// Define the base URL for your API
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// ⭐ Define auth endpoints that should NOT trigger redirect on 401
const AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/send-otp",
  "/auth/verify-otp",
];

// Helper function to check if endpoint is an auth endpoint
const isAuthEndpoint = (url: string | FetchArgs): boolean => {
  const endpoint = typeof url === "string" ? url : url.url;
  return AUTH_ENDPOINTS.some((authEndpoint) => endpoint.includes(authEndpoint));
};

// Create base query with token handling
const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
  const state = getState() as { auth?: { accessToken?: string } }
    const token = state?.auth?.accessToken;

    if (token && !isTokenExpired(token)) {
      headers.set("authorization", `Bearer ${token}`);
    }

    headers.set("content-type", "application/json");
    return headers;
  },
  credentials: "include",
});

// Enhanced base query with smart token refresh and redirect logic
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401 error
  if (result.error && result.error.status === 401) {
    // ⭐ CHECK: Is this an auth endpoint? If yes, don't redirect
    if (isAuthEndpoint(args)) {
      console.log("❌ Auth endpoint failed (login/register), not redirecting");
      // Just return the error, let the component handle it
      return result;
    }

    // ⭐ For non-auth endpoints, try to refresh the token
    console.log("🔄 Non-auth endpoint got 401, attempting token refresh...");

    try {
      // Try to refresh the token - backend will read refresh token from httpOnly cookie
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: {},
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Successfully refreshed token
        const { accessToken } = refreshResult.data as { accessToken: string };
        updateStoredToken(accessToken);

        console.log(
          "✅ Token refreshed successfully, retrying original request"
        );

        // Retry the original request with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed
        console.log("❌ Token refresh failed, redirecting to login");
        clearAuthData();

        // if (
        //   typeof window !== "undefined" &&
        //   window.location.pathname !== "/login"
        // ) {
        //   window.location.href = "/login";
        // }
      }
    } catch (error) {
      console.error("❌ Token refresh error:", error);
      clearAuthData();

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }
  }

  return result;
};

// Create the base API slice
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Profession", "Provider", "Search"],
  endpoints: () => ({}),
});
