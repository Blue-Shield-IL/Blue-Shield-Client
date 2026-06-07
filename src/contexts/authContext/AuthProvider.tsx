import { AuthContext } from "./useAuth";
import * as authService from "services/authService";
import { setAccessToken } from "config/axiosInstance";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import type {
  GoogleAuthRequest,
  LoginRequest,
  RegisterRequest,
  UserInfo,
} from "interfaces/auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = useMemo(() => !!user, [user]);

  const login = useCallback(async (data: LoginRequest) => {
    const { accessToken, user: userRes } = await authService.login(data);
    setAccessToken(accessToken);
    setUser(userRes);

    return userRes;
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const { accessToken, user: userRes } = await authService.register(data);
    setAccessToken(accessToken);
    setUser(userRes);

    return userRes;
  }, []);

  const googleAuth = useCallback(async (data: GoogleAuthRequest) => {
    const { accessToken, user: userRes } = await authService.googleAuth(data);
    setAccessToken(accessToken);
    setUser(userRes);

    return userRes;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Logout API failure should not block client-side cleanup
      console.error("Logout API failure", error);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    const { accessToken, user: userRes } = await authService.refresh();
    setAccessToken(accessToken);
    setUser(userRes);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refreshAuth();
      } catch {
        // Not authenticated — stay on login
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [refreshAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        googleAuth,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
