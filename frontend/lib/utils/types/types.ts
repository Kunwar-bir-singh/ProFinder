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
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profession?: string;
  city?: string;
  bio?: string;
  type: "user" | "provider";
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
