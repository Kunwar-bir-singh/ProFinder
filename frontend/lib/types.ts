// User related types
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  phone?: string
}

export interface AuthResponse {
  user: User
  access_token: string
  // refresh_token is handled via cookies, not in response body
}

// Profession related types
export interface Profession {
  id: string
  name: string
  description: string
  category: string
  icon?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateProfessionRequest {
  name: string
  description: string
  category: string
  icon?: string
}

// Provider related types
export interface Provider {
  id: string
  userId: string
  professionId: string
  businessName: string
  description: string
  location: string
  phone: string
  email: string
  website?: string
  rating: number
  reviewCount: number
  isVerified: boolean
  isActive: boolean
  profileImage?: string
  gallery?: string[]
  services: string[]
  availability: string
  pricing: {
    min: number
    max: number
    currency: string
  }
  createdAt: string
  updatedAt: string
  user: User
  profession: Profession
}

export interface CreateProviderRequest {
  professionId: string
  businessName: string
  description: string
  location: string
  phone: string
  email: string
  website?: string
  services: string[]
  pricing: {
    min: number
    max: number
    currency: string
  }
}

// Search related types
export interface SearchFilters {
  profession?: string
  location?: string
  rating?: number
  priceRange?: {
    min: number
    max: number
  }
  availability?: string
}

export interface SearchResponse {
  providers: Provider[]
  total: number
  page: number
  limit: number
  filters: SearchFilters
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// Pagination
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
