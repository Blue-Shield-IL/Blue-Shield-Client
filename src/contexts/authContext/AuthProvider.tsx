import { AuthContext } from "./useAuth";
import * as authService from "services/authService";
import { setAccessToken } from "config/axiosInstance";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import type { GoogleAuthRequest, LoginRequest, RegisterRequest, UserInfo } from "interfaces/auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = user !== null;

  const login = useCallback(async (data: LoginRequest) => {
    const response = await authService.login(data);
    setAccessToken(response.accessToken);
    setUser(response.user);
    return response.user;
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await authService.register(data);
    setAccessToken(response.accessToken);
    setUser(response.user);
    return response.user;
  }, []);

  const googleAuth = useCallback(async (data: GoogleAuthRequest) => {
    const response = await authService.googleAuth(data);
    setAccessToken(response.accessToken);
    setUser(response.user);
    return response.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Logout API failure should not block client-side cleanup
    }
    setAccessToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { accessToken } = await authService.refresh();
        setAccessToken(accessToken);

        // Decode user from JWT payload
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        setUser({
          id: payload.sub,
          name: payload.name ?? null,
          email: payload.email,
          isOnboarded: payload.isOnboarded ?? false,
          authProvider: payload.authProvider ?? "local",
        });
      } catch {
        // Not authenticated — stay on login
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, register, googleAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
