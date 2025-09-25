export interface JwtPayload {
    sub: number;
    username: string;
    email: string;
    lastPasswordChange: Date;
}