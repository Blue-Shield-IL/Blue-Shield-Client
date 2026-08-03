import { createApiInstance } from "config/axiosInstance";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  GoogleAuthRequest,
  UserInfo,
} from "interfaces/auth";

const authApi = createApiInstance("auth");
const usersApi = createApiInstance("users");

export const register = async (data: RegisterRequest) =>
  (await authApi.post<AuthResponse>("/register", data)).data;

export const login = async (data: LoginRequest) =>
  (await authApi.post<AuthResponse>("/login", data)).data;

export const googleAuth = async (data: GoogleAuthRequest) =>
  (await authApi.post<AuthResponse>("/google", data)).data;

export const refresh = async () =>
  (await authApi.post<AuthResponse>("/refresh")).data;

export const logout = async () => {
  await authApi.post("/logout");
};

export const deleteAccount = async () => {
  await authApi.delete("/delete-account");
};

export const updateProfile = async (data: {
  name?: string;
  email?: string;
  role?: string;
}) => (await usersApi.patch<UserInfo>("/me", data)).data;

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  await authApi.patch("/change-password", data);
};
