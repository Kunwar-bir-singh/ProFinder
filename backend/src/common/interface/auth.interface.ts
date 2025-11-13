export interface JwtPayload {
    user_id: number;
    provider_id?: number;
    username: string;
    email: string;
    last_password_change: Date;
    isProvider?: boolean;
}

export interface AuthenticatedUser {
  user_id: number;
}

