export interface JwtPayload {
    id: number;
    email: string;
    role: string;
    code: string;
}

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export interface SignInResponse {
    message: string;
    firstName: string;
    lastName: string;
    avatar: string;
    accessToken: string;
}