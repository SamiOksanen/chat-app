export interface UserData {
    userid: number;
    username: string;
    email: string;
    token: string;
}

export interface UserModel extends UserData {
    password: string;
}

export interface UserInsert {
    username: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface SignupRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ErrorResponse {
    message: string;
    type: string;
    data: Record<string, any>;
}

export interface HasuraWebhookResponse {
    'X-Hasura-Role': 'user' | 'anonymous';
    'X-Hasura-User-Id'?: string;
}
