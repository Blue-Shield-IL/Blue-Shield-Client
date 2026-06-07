import { createContext, useContext } from "react";
import type {
  UserInfo,
  LoginRequest,
  RegisterRequest,
  GoogleAuthRequest,
} from "interfaces/auth";

export interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<UserInfo>;
  register: (data: RegisterRequest) => Promise<UserInfo>;
  googleAuth: (data: GoogleAuthRequest) => Promise<UserInfo>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

const useAuth = () => useContext(AuthContext);

export default useAuth;
