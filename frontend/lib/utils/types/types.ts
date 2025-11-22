// user/profile/types.ts
export type User = {
  username: string;
  fullname: string;
  email: string;
  phone: string;
  profession?: string;
  city?: string;
  address?: string;
  bio?: string;
  experience?: number;
  serviceArea?: string;
  type?: string;
  is_verified?: boolean;
};

// lib/types.ts

export interface LoginRequest {
  [key: string]: string;
  password: string;
}

export interface RegisterRequest  {
  fullname: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  profession?: string;
  city?: string;
  bio?: string;
  type: "user" | "provider";
}

export interface UserResponse {
  user_id: number;
  provider_id: number | null;
  username: string;
  email?: string;
  isProvider?: boolean;
}

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Pagination parameters
export interface PaginationParams {
  pageNumber?: number;
  rowsPerPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Profession types
export interface Profession {
  id: string;
  name: string;
  category: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Create profession request
export interface CreateProfessionRequest {
  name: string;
  category: string;
  description?: string;
}

// Provider types from new API
export interface RawProviderData {
  user_id: number;
  fullname: string;
  phone: string | null;
  email: string;
  is_verified: boolean;
  address: string | null;
  bio: string | null;
  is_available: string | null;
  rating: number | null;
  year_of_experience: number | null;
  service_area: string | null;
  total_count?: number;
}

// Transformed provider for UI
export interface TransformedProvider {
  id: number;
  user_id: number;
  username: string;
  fullname: string;
  profession: string;
  phone: string | null;
  address: string | null;
  rating: number | null;
  reviewCount: number;
  verified: boolean;
  yearsExperience: number | null;
  profileImage: string;
  email: string;
  bio: string | null;
  isAvailable: string | null;
  serviceArea: string | null;
}

export interface SearchResponse {
  success: boolean;
  data: TransformedProvider[];
}

// Search filters interface
export interface SearchFilters {
  profession?: string;
  city?: string;
  location?: string;
  minRating?: number;
  verified?: boolean;
  available?: boolean;
}
