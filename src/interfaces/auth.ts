export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface GoogleAuthRequest {
  token: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: UserInfo;
  accessToken: string;
}

export interface UserInfo {
  id: string;
  name: string | null;
  email: string;
  isOnboarded: boolean;
  authProvider: string;
  role?: string;
  profilePicUrl?: string | null;
}

export interface ApiError {
  message: string;
  errors?: string[];
}
