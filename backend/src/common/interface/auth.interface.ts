export interface JwtPayload {
    userID: number;
    providerID?: number;
    username: string;
    email: string;
    lastPasswordChange: Date;
    isProvider?: boolean;
}

export interface AuthenticatedUser {
  userID: number;
}

