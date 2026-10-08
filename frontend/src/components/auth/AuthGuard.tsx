"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Sparkles, ShieldCheck, Cpu, AlertTriangle } from "lucide-react";
import Link from "next/link";

/**
 * Protects pages that require authentication.
 * Redirects to /login if unauthenticated.
 * Enforces role-based route permissions.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const [checking, setChecking] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    // Role-based route checks
    const role = user?.role;
    if (role === "PARENT") {
      // Guardians cannot access admin scheduling or user management
      if (pathname.includes("/dashboard/users") || pathname.includes("/dashboard/conflicts")) {
        setUnauthorized(true);
        setChecking(false);
        return;
      }
    }

    if (role === "STUDENT") {
      // Students cannot access user management or admin routes
      if (pathname.includes("/dashboard/users")) {
        setUnauthorized(true);
        setChecking(false);
        return;
      }
    }

    setUnauthorized(false);
    setChecking(false);
  }, [router, isAuthenticated, user, pathname]);

  if (checking) {
    return (
      <div className="relative min-h-screen bg-[#0A0D14] flex flex-col items-center justify-center overflow-hidden px-4">
        <div className="relative z-10 flex flex-col items-center max-w-sm w-full p-8 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl text-center">
          <div className="relative mb-6 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-transparent border-t-[#ff9900] border-r-[#febd69] animate-spin" />
            <div className="absolute flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff9900] to-[#febd69]">
              <Cpu className="w-4 h-4 text-[#131921] animate-pulse" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Verifying Credentials</h3>
          <p className="text-xs text-slate-400">Authenticating role telemetry...</p>
        </div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="relative min-h-screen bg-[#0A0D14] flex flex-col items-center justify-center overflow-hidden px-4 text-center">
        <div className="max-w-md p-8 rounded-3xl border border-rose-500/30 bg-slate-900/80 backdrop-blur-xl space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Access Denied</h2>
          <p className="text-xs text-slate-400">
            Your current role (<strong className="text-rose-400">{user?.role}</strong>) does not have permission to access this page.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold bg-[#ff9900] text-[#131921] hover:brightness-110 transition text-xs"
          >
            Return to My Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
