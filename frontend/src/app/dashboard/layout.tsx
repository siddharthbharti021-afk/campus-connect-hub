"use client";

import React from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import { AppProvider } from "@/smartcampus/context/AppContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppProvider>
        {children}
      </AppProvider>
    </AuthGuard>
  );
}
