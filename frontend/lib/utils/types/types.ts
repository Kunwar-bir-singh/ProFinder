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
  isVerified?: boolean;
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
