# RTK Query Usage Examples

This document shows how to use the RTK Query setup in your ProFinder application.

## Basic Usage

### 1. Authentication

```tsx
import { useLoginMutation, usegetUserDetailsQuery } from '@/lib/hooks'

function LoginComponent() {
  const [login, { isLoading, error }] = useLoginMutation()
  const { data: user, isLoading: userLoading } = usegetUserDetailsQuery()

  const handleLogin = async (credentials) => {
    try {
      const result = await login(credentials).unwrap()
      console.log('Login successful:', result.data)
      // Access token is automatically stored in localStorage
      // Refresh token is automatically stored in cookies by the server
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <div>
      {userLoading && <p>Loading user...</p>}
      {user && <p>Welcome, {user.data.name}!</p>}
      {/* Your login form here */}
    </div>
  )
}
```

### 2. Fetching Professions

```tsx
import { useGetProfessionsQuery } from '@/lib/hooks'

function ProfessionsList() {
  const { data, error, isLoading } = useGetProfessionsQuery({
    page: 1,
    limit: 10,
    sortBy: 'name',
    sortOrder: 'asc'
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading professions</div>

  return (
    <div>
      {data?.data.map(profession => (
        <div key={profession.id}>
          <h3>{profession.name}</h3>
          <p>{profession.description}</p>
        </div>
      ))}
    </div>
  )
}
```

### 3. Creating a Provider

```tsx
import { useCreateProviderMutation } from '@/lib/hooks'

function CreateProviderForm() {
  const [createProvider, { isLoading, error }] = useCreateProviderMutation()

  const handleSubmit = async (formData) => {
    try {
      const result = await createProvider({
        professionId: 'prof-123',
        businessName: 'My Business',
        description: 'Professional services',
        location: 'New York, NY',
        phone: '+1234567890',
        email: 'contact@mybusiness.com',
        services: ['Service 1', 'Service 2'],
        pricing: {
          min: 50,
          max: 200,
          currency: 'USD'
        }
      }).unwrap()
      
      console.log('Provider created:', result.data)
    } catch (err) {
      console.error('Failed to create provider:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields here */}
    </form>
  )
}
```

### 4. Searching Providers

```tsx
import { useSearchProvidersQuery } from '@/lib/hooks'

function SearchResults() {
  const { data, error, isLoading } = useSearchProvidersQuery({
    profession: 'plumber',
    location: 'New York',
    rating: 4,
    priceRange: {
      min: 50,
      max: 200
    },
    page: 1,
    limit: 10
  })

  if (isLoading) return <div>Searching...</div>
  if (error) return <div>Search failed</div>

  return (
    <div>
      {data?.data.map(provider => (
        <div key={provider.id}>
          <h3>{provider.businessName}</h3>
          <p>{provider.description}</p>
          <p>Rating: {provider.rating}/5</p>
        </div>
      ))}
    </div>
  )
}
```

## Advanced Usage

### Conditional Queries

```tsx
import { useGetProviderByIdQuery } from '@/lib/hooks'

function ProviderDetails({ provider_id }: { provider_id?: string }) {
  const { data, error, isLoading } = useGetProviderByIdQuery(provider_id!, {
    skip: !provider_id // Only run query if provider_id exists
  })

  if (!provider_id) return <div>No provider selected</div>
  if (isLoading) return <div>Loading provider...</div>
  if (error) return <div>Error loading provider</div>

  return (
    <div>
      <h2>{data?.data.businessName}</h2>
      <p>{data?.data.description}</p>
    </div>
  )
}
```

### Optimistic Updates

```tsx
import { useUpdateProviderMutation } from '@/lib/hooks'

function ProviderEditForm({ provider }) {
  const [updateProvider] = useUpdateProviderMutation()

  const handleUpdate = async (updates) => {
    try {
      await updateProvider({
        id: provider.id,
        data: updates
      }).unwrap()
      
      // The cache will automatically update due to invalidatesTags
    } catch (err) {
      console.error('Update failed:', err)
    }
  }

  return (
    <form onSubmit={handleUpdate}>
      {/* Your form here */}
    </form>
  )
}
```

## Configuration

### Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Token Authentication

The setup handles token authentication with:
- **Access Token**: Stored in localStorage, sent in Authorization header
- **Refresh Token**: Stored in HTTP-only cookies, automatically sent with requests
- **Automatic Refresh**: When access token expires (401), automatically attempts refresh
- **Automatic Logout**: Redirects to login page when refresh fails

### Custom Base Query

The base query is configured in `lib/api.ts` and includes:
- Automatic token attachment from localStorage
- Automatic token refresh on 401 errors
- Content-Type headers
- Cookie inclusion for refresh tokens
- Automatic logout on auth failure

You can modify the `prepareHeaders` function to add custom headers or authentication logic.

## Error Handling

RTK Query provides built-in error handling:

```tsx
const { data, error, isLoading } = useGetProfessionsQuery()

if (error) {
  if ('status' in error) {
    // RTK Query error
    const errMsg = 'data' in error ? error.data : 'An error occurred'
    console.error('API Error:', errMsg)
  } else {
    // Network error
    console.error('Network Error:', error.message)
  }
}
```

## Cache Management

RTK Query automatically manages caching with the configured tag types:
- `User` - User-related data
- `Profession` - Profession data
- `Provider` - Provider data  
- `Search` - Search results

When you mutate data, the appropriate tags are invalidated, causing related queries to refetch automatically.

## Login Page Integration

The login page (`app/login/page.tsx`) has been fully integrated with RTK Query:

```tsx
import { useLoginMutation } from '@/lib/hooks'

function LoginPage() {
  const [login, { isLoading, error }] = useLoginMutation()
  
  const handleLogin = async (credentials) => {
    try {
      const result = await login(credentials).unwrap()
      // Token automatically stored, user redirected
      router.push('/')
    } catch (err) {
      // Error automatically displayed
    }
  }
}
```

**Features:**
- ✅ Automatic token storage on successful login
- ✅ Loading states with disabled form fields
- ✅ Error handling with user-friendly messages
- ✅ Automatic redirect after successful login
- ✅ Support for both username/email and mobile login
- ✅ User type selection (User/Provider)

## Example Components

See `components/examples/rtk-example.tsx` for a complete working example.
See `components/examples/login-integration-example.tsx` for login integration example.
