import {
  clearAuth,
  setAccessToken,
  updateAccessToken,
  setUser,
} from "../slices/authSlice";

let storeRef: any;

export const setStoreReference = (s: any) => (storeRef = s);

export const getStoredToken = (): string | null => {
  return storeRef ? storeRef.getState().auth.accessToken : null;
};

export const setStoredToken = (token: string, user: any): void => {
  
  storeRef?.dispatch(setAccessToken(token));
  storeRef?.dispatch(setUser(user));
};

export const removeStoredToken = (): void => {
  console.log("LOGGING OUT");
  
  storeRef?.dispatch(clearAuth());
};

export const updateStoredToken = (token: string): void => {
  storeRef?.dispatch(updateAccessToken(token));
};

// Check if token is expired (basic check, you might want to decode JWT for more accuracy)
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true; // If we can't parse the token, consider it expired
  }
};

// Get token from cookies (for refresh token)
export const getRefreshTokenFromCookies = (): string | null => {
  if (typeof document === "undefined") return null;
  console.log("document", document);

  const cookies = document.cookie.split(";");
  const refreshTokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("refreshToken=")
  );

  if (refreshTokenCookie) {
    return refreshTokenCookie.split("=")[1];
  }

  return null;
};

// Clear all auth data
export const clearAuthData = (): void => {
  removeStoredToken();
  // Clear refresh token cookie
  if (typeof document !== "undefined") {
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
};
