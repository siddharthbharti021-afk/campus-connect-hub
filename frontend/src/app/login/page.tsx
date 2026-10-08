"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Lock,
  UserCheck,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { authApi } from "@/lib/auth-api";
import { useAuthStore } from "@/store/auth";
import { CampusBackground } from "@/components/campus/campus-background";

type RoleTab = "STUDENT" | "FACULTY" | "DEAN" | "PARENT";

const SAMPLE_CREDENTIALS: Record<
  RoleTab,
  { label: string; userId: string; name: string; desc: string; badgeColor: string }
> = {
  STUDENT: {
    label: "Student",
    userId: "student01",
    name: "Aarav Patel",
    desc: "Timetable, attendance, fees & digital bus pass",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  FACULTY: {
    label: "Professor",
    userId: "prof01",
    name: "Prof. Ananya Sen",
    desc: "Class attendance, conflict solver & student alerts",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  DEAN: {
    label: "Dean",
    userId: "dean01",
    name: "Dr. Sanjeev Verma",
    desc: "Fee analytics, dropout risk intelligence & approvals",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
  },
  PARENT: {
    label: "Guardian",
    userId: "parent01",
    name: "Vikram Patel",
    desc: "Child academic tracker, fee payments & attendance",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<RoleTab>("STUDENT");
  const [userId, setUserId] = useState(SAMPLE_CREDENTIALS.STUDENT.userId);
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTabChange(tab: RoleTab) {
    setActiveTab(tab);
    setUserId(SAMPLE_CREDENTIALS[tab].userId);
    setPassword("Password123!");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !password) return;

    setError(null);
    setLoading(true);

    try {
      const res = await authApi.login({
        user_id: userId.trim(),
        password: password,
      });

      const { access_token, user } = res.data;
      setToken(access_token);
      setUser(user);

      router.push("/dashboard");
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        "Invalid User ID or Password. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="campus-page min-h-screen flex flex-col justify-center items-center px-4 py-12 relative">
      <CampusBackground />

      {/* Top back button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700 transition bg-white/70 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/80 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Campus Life
        </Link>
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 wordmark justify-center mb-1">
            <span className="brand-symbol">
              <Sparkles size={20} />
            </span>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              university<span className="text-emerald-600 font-extrabold">welfare.</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to Campus Portal
          </h1>
          <p className="text-xs text-slate-600 max-w-xs mx-auto">
            Access your academic dashboard, live timetable, attendance, fee dues & digital services.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-1 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 grid grid-cols-4 gap-1 text-[11px] font-semibold shadow-sm">
          {(["STUDENT", "FACULTY", "DEAN", "PARENT"] as RoleTab[]).map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabChange(tab)}
                className={`py-2 rounded-xl transition ${
                  isSelected
                    ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {SAMPLE_CREDENTIALS[tab].label}
              </button>
            );
          })}
        </div>

        {/* Active Role Hint Card */}
        <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-md flex items-center justify-between text-xs shadow-sm">
          <div>
            <span className="font-bold text-slate-900">
              {SAMPLE_CREDENTIALS[activeTab].name}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {SAMPLE_CREDENTIALS[activeTab].desc}
            </p>
          </div>
          <span
            className={`font-semibold text-[10px] px-2.5 py-1 rounded-full border shrink-0 ${SAMPLE_CREDENTIALS[activeTab].badgeColor}`}
          >
            Demo Active
          </span>
        </div>

        {/* Form Card */}
        <div className="p-8 rounded-3xl border border-slate-200/90 bg-white/90 backdrop-blur-xl shadow-xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                User ID / Employee Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. student01 or prof01"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition"
                />
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                "Authenticating Session..."
              ) : (
                <>
                  Sign In to Portal
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure institution session • Signed JWT authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
}
