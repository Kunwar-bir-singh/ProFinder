# Auth Redux Usage Example

This example shows how to use the new Redux-based authentication system.

## Key Changes

1. **Access tokens are now stored in Redux store** instead of localStorage
2. **Automatic token refresh** happens on app startup and when a 401 error occurs
3. **Headers are automatically attached** to each request with the current token
4. **App initialization** checks for refresh token and gets new access token

## Complete Authentication Flow

### 1. App Startup/Refresh
```
App loads → AuthProvider checks for refresh token → 
If found: Call refresh API → Store new access token in Redux
If not found: User needs to login
```

### 2. API Requests
```
Any API call → Check Redux for access token → 
Attach token to headers → Make request
```

### 3. Token Refresh on 401
```
API returns 401 → Check if auth endpoint → 
If auth endpoint: Return error (don't redirect)
If not auth endpoint: Try refresh token → 
If success: Retry original request
If fail: Redirect to login
```

## Usage in Components

```tsx
import { useAuth } from '../lib/hooks/useAuth'
import { useLoginMutation, useLogoutMutation } from '../lib/services/auth.service'

function LoginComponent() {
  const { isAuthenticated, user, logout } = useAuth()
  const [login, { isLoading }] = useLoginMutation()
  const [logoutMutation] = useLogoutMutation()

  const handleLogin = async (credentials) => {
    try {
      await login(credentials).unwrap()
      // Token is automatically stored in Redux store
      // User will be redirected or state will update automatically
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap()
      // Auth state is automatically cleared from Redux store
    } catch (error) {
      // Even if server logout fails, local state is cleared
      logout()
    }
  }

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user?.name}!</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleLogin}>
      {/* Login form */}
    </form>
  )
}
```

## App Setup

The app is automatically wrapped with `AuthProvider` in the root layout:

```tsx
// app/layout.tsx
<ReduxProvider>
  <AuthProvider>
    {children}
  </AuthProvider>
</ReduxProvider>
```

## How Token Refresh Works

### On App Startup
1. **Check Refresh Token**: Look for refresh token in cookies
2. **Call Refresh API**: If found, call `/auth/refresh` endpoint
3. **Store Access Token**: If successful, store new access token in Redux
4. **Clear Auth**: If failed, clear all auth data

### On API Requests (401 Error)
1. **Automatic Detection**: When any API call returns a 401 error
2. **Check Endpoint Type**: Don't redirect for auth endpoints (login/register)
3. **Refresh Attempt**: Try to refresh the token using refresh token from cookies
4. **Token Update**: If refresh succeeds, update access token in Redux store
5. **Request Retry**: Retry the original request with new token
6. **Fallback**: If refresh fails, redirect to login page

## Benefits

- **No localStorage dependency**: Tokens are managed in Redux store
- **Automatic refresh**: Works on app startup and API errors
- **Centralized state**: All auth state is in one place
- **Type safety**: Full TypeScript support
- **Performance**: No localStorage reads on every request
- **Smart redirects**: Only redirects on non-auth endpoint failures
