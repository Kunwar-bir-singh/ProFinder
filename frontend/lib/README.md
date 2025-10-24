# RTK Query Setup

This directory contains the Redux Toolkit Query (RTK Query) configuration for the ProFinder application.

## Structure

```
lib/
├── api.ts                 # Main API slice configuration
├── store.ts              # Redux store configuration
├── types.ts              # TypeScript type definitions
├── hooks.ts              # Re-exported hooks for easy imports
└── services/
    ├── index.ts          # Export all services
    ├── auth.service.ts   # Authentication endpoints
    ├── profession.service.ts # Profession management
    ├── provider.service.ts   # Provider management
    └── search.service.ts     # Search functionality
```

## Features

- **Global Configuration**: Single API slice with base configuration
- **Modular Services**: Separate service files for different domains
- **TypeScript Support**: Full type safety with generated hooks
- **Automatic Caching**: Built-in caching with tag-based invalidation
- **Error Handling**: Comprehensive error handling and loading states
- **Authentication**: Automatic token attachment to requests

## Usage

### Import Hooks

```tsx
import { 
  useGetProfessionsQuery,
  useCreateProviderMutation,
  useSearchProvidersQuery 
} from '@/lib/hooks'
```

### Use in Components

```tsx
function MyComponent() {
  const { data, error, isLoading } = useGetProfessionsQuery()
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error occurred</div>
  
  return <div>{/* Render data */}</div>
}
```

## Configuration

### Environment Variables

Set your API base URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Authentication

The API automatically attaches authentication tokens from localStorage. Make sure to store the token as 'token' in localStorage after login.

### Cache Tags

The following cache tags are used for automatic invalidation:

- `User` - User-related data
- `Profession` - Profession data
- `Provider` - Provider data
- `Search` - Search results

## Service Files

### Auth Service (`auth.service.ts`)
- User authentication
- Profile management
- Password reset functionality

### Profession Service (`profession.service.ts`)
- CRUD operations for professions
- Category-based queries
- Search functionality

### Provider Service (`provider.service.ts`)
- Provider management
- Image uploads
- Availability updates

### Search Service (`search.service.ts`)
- Global search
- Filtered searches
- Search suggestions

## Best Practices

1. **Use the generated hooks** - They provide type safety and automatic caching
2. **Handle loading and error states** - Always check `isLoading` and `error` properties
3. **Use conditional queries** - Skip queries when parameters are not available
4. **Leverage cache invalidation** - Mutations automatically invalidate related data
5. **Optimize with selectFromResult** - Transform data at the query level when needed

## Example Components

See `components/examples/rtk-example.tsx` for a complete working example.
