import { apiClient } from "./api";
import type { UserProfile } from "@/store/auth";

export interface LoginPayload {
  user_id: string; // Accepts student ID / employee ID / email
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

export interface RegisterPayload {
  user_code?: string;
  email: string;
  password: string;
  full_name: string;
  role?: "student" | "professor" | "admin" | "parent";
}

export const authApi = {
  /** Login with user_id (code or email) and password */
  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponse>("/auth/login", payload),

  /** Register a new user */
  register: (payload: RegisterPayload) =>
    apiClient.post<LoginResponse>("/auth/register", payload),

  /** Returns current authenticated user's profile */
  me: () => apiClient.get<UserProfile>("/auth/me"),

  /** Logout current session */
  logout: () => apiClient.post("/auth/logout"),

  forgotPassword: (email: string) =>
    apiClient.post("/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post("/auth/reset-password", { token, password }),
};
