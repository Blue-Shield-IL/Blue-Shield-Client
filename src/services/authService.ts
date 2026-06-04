import { createApiInstance } from "config/axiosInstance";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  GoogleAuthRequest,
} from "interfaces/auth";

const axiosInstance = createApiInstance("auth", true);

export const register = async (data: RegisterRequest) =>
  (await axiosInstance.post<AuthResponse>("/register", data)).data;

export const login = async (data: LoginRequest) =>
  (await axiosInstance.post<AuthResponse>("/login", data)).data;

export const googleAuth = async (data: GoogleAuthRequest) =>
  (await axiosInstance.post<AuthResponse>("/google", data)).data;

export const refresh = async () =>
  (await axiosInstance.post<{ accessToken: string }>("/refresh")).data;

export const logout = async () => {
  await axiosInstance.post("/logout");
};

export const deleteAccount = async () => {
  await axiosInstance.delete("/delete-account");
};
