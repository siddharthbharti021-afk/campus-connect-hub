"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUpRight,
  Heart,
  MoveUpRight,
  Sparkles,
  User,
  GraduationCap,
  Shield,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CampusBackground } from "@/components/campus/campus-background";
import { CanteenScene } from "@/components/campus/canteen-scene";
import { useAuthStore } from "@/store/auth";
import { authApi } from "@/lib/auth-api";

export default function LandingPage() {
  const router = useRouter();
  const { token, user, setToken, setUser } = useAuthStore();
  const [loggingIn, setLoggingIn] = useState<string | null>(null);

  async function handleQuickLogin(userId: string) {
    setLoggingIn(userId);
    try {
      const res = await authApi.login({
        user_id: userId,
        password: "Password123!",
      });
      setToken(res.data.access_token);
      setUser(res.data.user);
      router.push("/dashboard");
    } catch {
      router.push("/login");
    } finally {
      setLoggingIn(null);
    }
  }

  return (
    <div className="campus-page">
      <CampusBackground />

      {/* Header */}
      <header className="site-header page-width">
        <Link href="/" className="wordmark" aria-label="University Welfare home">
          <span className="brand-symbol">
            <Sparkles size={22} />
          </span>
          <span>
            university
            <span className="wordmark-bottom">
              welfare<span className="brand-period">.</span>
            </span>
          </span>
        </Link>

        <nav aria-label="Main navigation">
          <a className="nav-link" href="#canteen">
            Campus life
          </a>
          <a className="nav-link" href="#together">
            Our community
          </a>
          <a className="nav-link" href="#roles">
            Demo Logins
          </a>

          {token && user ? (
            <Button asChild className="nav-cta bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">
              <Link href="/dashboard">
                Open Dashboard <ArrowUpRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="nav-cta border-emerald-600/30 text-emerald-800 hover:bg-emerald-50 rounded-full">
              <Link href="/login">
                Sign In to Portal <ArrowUpRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
          )}
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="campus-hero page-width">
          <div className="hero-eyebrow">
            <span className="status-dot" /> FOR THE DAYS YOU’LL REMEMBER
          </div>

          <h1>
            University welfare.
            <br />
            A little more <span className="hero-campus">campus.</span>
            <br />
            A lot more{" "}
            <span className="hero-life">
              life.
              <svg viewBox="0 0 180 15" aria-hidden="true">
                <path d="M4 10Q83-3 176 7M13 14Q84 3 158 12" />
              </svg>
            </span>
          </h1>

          <p>
            Beyond the lectures. Between the deadlines.
            <br />
            Here’s to finding your people — and making campus feel like home.
          </p>

          <div className="hero-actions">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 py-6 text-sm font-semibold shadow-lg shadow-emerald-600/20">
              <Link href="/login">
                Enter Campus Portal <ArrowUpRight className="ml-1.5 w-4 h-4" />
              </Link>
            </Button>

            <a className="hero-secondary text-slate-700 hover:text-emerald-700 font-semibold" href="#canteen">
              Meet the canteen crew <Heart size={17} className="text-pink-500 fill-pink-500/20" />
            </a>
          </div>

          <div className="hero-footnote">
            <div className="mini-friends" aria-hidden="true">
              <span>☺</span>
              <span>☺</span>
              <span>☺</span>
              <span>☺</span>
            </div>
            <span>Different courses. Same kind of chaos.</span>
          </div>

          <span className="hero-doodle doodle-star" aria-hidden="true">
            ✳
          </span>
          <svg className="hero-doodle doodle-plane" viewBox="0 0 110 95" aria-hidden="true">
            <path className="doodle-trail" d="M8 88Q60 76 27 49Q5 38 11 62Q24 83 63 44" />
            <path d="m55 22 48-15-19 38-12-13-17-10Zm17 10 31-25-39 22m8 3-5 16 11-9" />
          </svg>

          <a className="scroll-cue" href="#canteen" aria-label="Scroll to the canteen">
            <ArrowDown size={17} />
          </a>
        </section>

        {/* Canteen Scene Section */}
        <section id="canteen" className="canteen-section">
          <div className="page-width">
            <div className="section-eyebrow">
              <span /> THE UNOFFICIAL CLASSROOM
            </div>
            <div className="section-heading">
              <div>
                <h2>
                  Where the real learning
                  <br />
                  starts: <span>the canteen</span>
                </h2>
                <p>A side of samosas. A cup of chai. A lifetime of inside jokes.</p>
              </div>
              <div className="scene-note">
                Attendance optional.
                <br />
                Good company mandatory.
                <svg viewBox="0 0 70 45" aria-hidden="true">
                  <path d="M5 7Q54 5 48 36m-12-10 12 10 12-12" />
                </svg>
              </div>
            </div>

            {/* Interactive Animated SVG Scene */}
            <CanteenScene />

            <div className="scene-caption">
              <span>
                <span className="live-dot" /> Somewhere on campus, right now
              </span>
              <span>
                One bench. Four friends. Zero boring moments. <Sparkles size={14} />
              </span>
            </div>
          </div>
        </section>

        {/* Quick Role Portal Access */}
        <section id="roles" className="page-width py-16">
          <div className="text-center space-y-3 mb-10">
            <div className="hero-eyebrow justify-center">
              <span className="status-dot" /> DIRECT ACCESS FOR EVALUATORS
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              One unified portal. Every campus role.
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Select any role below to instantly log in and experience the full responsive dashboard, academic services, and timetable system.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Student */}
            <div className="p-5 rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md hover:border-emerald-500/50 hover:shadow-md transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Student Portal</h3>
                <p className="text-xs text-slate-500 mt-0.5">Aarav Patel (CS-2024-001)</p>
                <p className="text-xs text-slate-600 mt-2">
                  Timetable, live attendance, fee dues (₹), bus routes & digital certificates.
                </p>
              </div>
              <button
                onClick={() => handleQuickLogin("student01")}
                disabled={loggingIn === "student01"}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition text-center"
              >
                {loggingIn === "student01" ? "Signing In..." : "Launch as Student →"}
              </button>
            </div>

            {/* Professor */}
            <div className="p-5 rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md hover:border-indigo-500/50 hover:shadow-md transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Professor Portal</h3>
                <p className="text-xs text-slate-500 mt-0.5">Prof. Ananya Sen</p>
                <p className="text-xs text-slate-600 mt-2">
                  Class schedule, quick student attendance marking & early-warning alerts.
                </p>
              </div>
              <button
                onClick={() => handleQuickLogin("prof01")}
                disabled={loggingIn === "prof01"}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 transition text-center"
              >
                {loggingIn === "prof01" ? "Signing In..." : "Launch as Faculty →"}
              </button>
            </div>

            {/* Dean */}
            <div className="p-5 rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md hover:border-amber-500/50 hover:shadow-md transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Dean / Admin</h3>
                <p className="text-xs text-slate-500 mt-0.5">Dr. Sanjeev Verma</p>
                <p className="text-xs text-slate-600 mt-2">
                  Fee analytics, student dropout risk intelligence, certificate issuance & AI RAG.
                </p>
              </div>
              <button
                onClick={() => handleQuickLogin("dean01")}
                disabled={loggingIn === "dean01"}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition text-center"
              >
                {loggingIn === "dean01" ? "Signing In..." : "Launch as Dean →"}
              </button>
            </div>

            {/* Parent */}
            <div className="p-5 rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md hover:border-sky-500/50 hover:shadow-md transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Guardian Portal</h3>
                <p className="text-xs text-slate-500 mt-0.5">Vikram Patel</p>
                <p className="text-xs text-slate-600 mt-2">
                  Child academic tracker, verified attendance alerts & online fee payments.
                </p>
              </div>
              <button
                onClick={() => handleQuickLogin("parent01")}
                disabled={loggingIn === "parent01"}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition text-center"
              >
                {loggingIn === "parent01" ? "Signing In..." : "Launch as Parent →"}
              </button>
            </div>
          </div>
        </section>

        {/* Together Section */}
        <section id="together" className="together-section page-width">
          <div className="together-icon">
            <Heart />
          </div>
          <div>
            <div className="section-eyebrow">YOUR CAMPUS. YOUR PEOPLE.</div>
            <h2>No one does university alone.</h2>
            <p>The best part of campus isn’t a place. It’s the people you find there.</p>
          </div>
          <Button asChild variant="outline" className="border-slate-300 text-slate-800 hover:bg-slate-100 rounded-full">
            <a href="#canteen">
              Save you a seat? <MoveUpRight className="ml-1 w-3.5 h-3.5" />
            </a>
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer page-width">
        <span>
          university welfare<span className="brand-period">.</span>
        </span>
        <span>
          Made for the in-between moments. <Heart size={13} />
        </span>
      </footer>
    </div>
  );
}
