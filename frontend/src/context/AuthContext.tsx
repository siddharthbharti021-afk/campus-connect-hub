"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/auth-api";
import { useAuthStore, UserProfile } from "@/store/auth";

interface AuthContextType {
  user: UserProfile | null;
  role: string | null;
  loading: boolean;
  login: (user_id: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, token, setToken, setUser, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifySession() {
      if (token) {
        try {
          const res = await authApi.me();
          setUser(res.data);
        } catch {
          clearAuth();
        }
      }
      setLoading(false);
    }
    verifySession();
  }, [token, setUser, clearAuth]);

  async function login(user_id: string, password: string) {
    setLoading(true);
    try {
      const res = await authApi.login({ user_id, password });
      setToken(res.data.access_token);
      setUser(res.data.user);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    try {
      authApi.logout().catch(() => {});
    } finally {
      clearAuth();
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", "/login");
      }
      router.replace("/login");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
