"use client";
import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Radio,
  FileCheck2,
  Calendar,
  AlertCircle,
  GraduationCap,
  FileText,
  HeartHandshake,
  AlertOctagon,
  X
} from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const {
    currentRole,
    currentUser,
    setActiveTab,
    attendance,
    fees,
    grievances,
    alerts,
    admissions,
    parentMessages,
    toggleAssistant,
    sosTriggered,
    dismissSOS
  } = useApp();

  const totalDues = fees.filter(f => f.status !== 'Paid').reduce((sum, f) => sum + f.amount, 0);
  const avgAttendance = attendance.length
    ? (attendance.reduce((acc, curr) => acc + curr.percentage, 0) / attendance.length).toFixed(1)
    : '0';

  const criticalSubjects = attendance.filter(s => s.percentage < 75);

  return (
    <div className="space-y-6">
      {/* SOS Distress Alert Banner (if triggered) */}
      {sosTriggered && (
        <div className="rounded-2xl bg-rose-600 border border-rose-400 p-4 text-white shadow-2xl flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <AlertOctagon className="h-6 w-6 shrink-0" />
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider">
                CAMPUS DISTRESS BEACON ACTIVE
              </h4>
              <p className="text-xs text-rose-100 mt-0.5">
                Emergency Alert broadcasted to Campus Security Control (Gate 1), Chief Warden, and First Responder Medical Unit.
              </p>
            </div>
          </div>
          <button
            onClick={dismissSOS}
            className="p-1.5 rounded-lg bg-rose-800/80 hover:bg-rose-900 transition text-white"
            title="Dismiss Beacon"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* 1. Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900/60 via-slate-900 to-slate-900 border border-brand-500/20 p-6 sm:p-8 backdrop-blur-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="purple" size="sm" dot>
                {currentRole === 'admin'
                  ? 'Central Academic Governance'
                  : currentRole === 'faculty'
                  ? 'Department of CSE'
                  : currentRole === 'student'
                  ? 'Active Semester VI'
                  : 'Parent Guardian Portal'}
              </Badge>
              <span className="text-xs text-slate-400">Spring Term • Academic Year 2025-2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {currentRole === 'student' &&
                'Your unified student portal is synced. Attendance is tracked at 82.5% across 5 subjects. End-term exam hall tickets and student services desk are active.'}
              {currentRole === 'admin' &&
                `Central Admissions counseling has 1,480 applicants with 840 seats allotted. Campus turnstiles recording 3,890 morning check-ins with 99.98% uptime.`}
              {currentRole === 'faculty' &&
                'You have 2 scheduled lectures today. 1 student in Compiler Design is currently below the mandatory 75% attendance threshold.'}
              {currentRole === 'parent' &&
                `Monitoring academic profile and attendance logs for Aarav Sharma (CS2022-048). Direct communication channel with HOD active.`}
            </p>
          </div>

          {/* Quick Action Pill in Hero */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('examinations')}
              className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-brand-600/30 hover:bg-brand-500 transition"
            >
              <FileText className="h-4 w-4" />
              <span>Exam Hall Ticket</span>
            </button>
            <button
              onClick={toggleAssistant}
              className="flex items-center gap-2 rounded-xl bg-slate-800/90 border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Ask AI Copilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Campus Alert Ticker */}
      {alerts.length > 0 && (
        <div className="flex items-center gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 px-4 py-3 text-xs text-amber-200 backdrop-blur-md">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
          <div className="flex-1 truncate">
            <span className="font-bold text-amber-300">CAMPUS NOTICE: </span>
            {alerts[0].title} — {alerts[0].description}
          </div>
          <button
            onClick={() => setActiveTab('attendance')}
            className="text-amber-400 font-semibold hover:underline shrink-0 flex items-center gap-1 text-[11px]"
          >
            Review <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* 3. Core KPI Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentRole === 'admin' ? (
          <>
            <StatCard
              title="Admissions 2026-27"
              value="1,480"
              subtitle="840 Seats Allotted"
              change="+18% YoY"
              changeType="positive"
              icon={GraduationCap}
              onClick={() => setActiveTab('admissions')}
            />
            <StatCard
              title="Campus Attendance Rate"
              value="89.4%"
              subtitle="Biometric RFID gate logs"
              change="+1.1% this week"
              changeType="positive"
              icon={CheckCircle2}
              iconBgColor="bg-emerald-500/10 border-emerald-500/20"
              iconColor="text-emerald-400"
              onClick={() => setActiveTab('attendance')}
            />
            <StatCard
              title="Fee Realization"
              value="94.2%"
              subtitle="₹4.82 Cr collected"
              change="₹18.5L pending"
              changeType="neutral"
              icon={CreditCard}
              iconBgColor="bg-brand-500/10 border-brand-500/20"
              iconColor="text-brand-400"
              onClick={() => setActiveTab('fees')}
            />
            <StatCard
              title="Grievance SLA"
              value="96.8%"
              subtitle="Avg resolution: 14.2h"
              change="3 open tickets"
              changeType="positive"
              icon={Clock}
              iconBgColor="bg-purple-500/10 border-purple-500/20"
              iconColor="text-purple-400"
              onClick={() => setActiveTab('grievances')}
            />
          </>
        ) : (
          <>
            <StatCard
              title="Overall Attendance"
              value={`${avgAttendance}%`}
              subtitle={criticalSubjects.length > 0 ? `${criticalSubjects.length} subject below 75%` : 'All subjects compliant'}
              change={criticalSubjects.length > 0 ? 'Requires attention' : 'Good standing'}
              changeType={criticalSubjects.length > 0 ? 'negative' : 'positive'}
              icon={CheckCircle2}
              iconBgColor={criticalSubjects.length > 0 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}
              iconColor={criticalSubjects.length > 0 ? 'text-amber-400' : 'text-emerald-400'}
              onClick={() => setActiveTab('attendance')}
            />
            <StatCard
              title="Academic Standing (CGPA)"
              value="8.84"
              subtitle="Rank #14 in Department"
              change="132 / 160 Credits"
              changeType="positive"
              icon={Users}
              onClick={() => setActiveTab('examinations')}
            />
            <StatCard
              title="Semester Fee Status"
              value={totalDues === 0 ? 'Settled' : `₹${totalDues.toLocaleString('en-IN')}`}
              subtitle={totalDues === 0 ? 'All receipts generated' : 'Exam & lab dues pending'}
              change={totalDues === 0 ? '100% Paid' : 'Due by Oct 25'}
              changeType={totalDues === 0 ? 'positive' : 'negative'}
              icon={CreditCard}
              iconBgColor="bg-cyan-500/10 border-cyan-500/20"
              iconColor="text-cyan-400"
              onClick={() => setActiveTab('fees')}
            />
            <StatCard
              title="Open Grievances"
              value={grievances.filter(g => g.status !== 'Resolved').length}
              subtitle="1 in Investigation phase"
              change="SLA within 24h"
              changeType="neutral"
              icon={AlertTriangle}
              iconBgColor="bg-purple-500/10 border-purple-500/20"
              iconColor="text-purple-400"
              onClick={() => setActiveTab('grievances')}
            />
          </>
        )}
      </div>

      {/* 4. Two-Column Dashboard Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Actions & Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Panel */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>SmartCampus Unified Services</span>
              <span className="text-[11px] text-slate-400 font-normal">One-click operations</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setActiveTab('admissions')}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-brand-600/10 hover:border-brand-500/40 text-center transition group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 mb-2 group-hover:scale-110 transition">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-200">Admissions</span>
                <span className="text-[10px] text-slate-400">Enrollment pipeline</span>
              </button>

              <button
                onClick={() => setActiveTab('examinations')}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-brand-600/10 hover:border-brand-500/40 text-center transition group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 mb-2 group-hover:scale-110 transition">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-200">Hall Ticket</span>
                <span className="text-[10px] text-slate-400">QR Exam Pass</span>
              </button>

              <button
                onClick={() => setActiveTab('parent-comm')}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-brand-600/10 hover:border-brand-500/40 text-center transition group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 mb-2 group-hover:scale-110 transition">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-200">Parent Portal</span>
                <span className="text-[10px] text-slate-400">Advisor dialogue</span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-brand-600/10 hover:border-brand-500/40 text-center transition group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 mb-2 group-hover:scale-110 transition">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-200">Student Services</span>
                <span className="text-[10px] text-slate-400">Library & NOC desk</span>
              </button>
            </div>
          </div>

          {/* Today's Academic Schedule Highlight */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Today's Master Schedule
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('timetable')}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                Full Timetable <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/30">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">CS601: Distributed Cloud Architecture</span>
                      <Badge variant="success" size="sm">Active Now</Badge>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      09:00 AM - 10:00 AM • Lecture Hall LH-301 • Prof. Priya Raman
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold text-brand-300">In Progress</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-slate-500" />
                  <div>
                    <span className="text-xs font-bold text-slate-200">CS602: Machine Learning Foundations</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      10:15 AM - 11:15 AM • Lecture Hall LH-301 • Dr. Vivek Bhattacharya
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">Next Up</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-slate-500" />
                  <div>
                    <span className="text-xs font-bold text-slate-200">CS605P: Cloud Native Computing Lab</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      11:30 AM - 01:30 PM • Software Lab-4 • Batch A
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">Lab Session</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Biometric Stream & Smart Campus Pulse */}
        <div className="space-y-6">
          {/* Biometric Turnstile Live Pulse */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Biometric RFID Feed
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Live Sensor Sync
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/40 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-200">Aarav Sharma (CS2022-048)</p>
                  <p className="text-[10px] text-slate-400">Gate 3 Academic Block • RFID Tag #8942</p>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">08:52 AM</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/40 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-200">Ananya Deshmukh (CS2022-012)</p>
                  <p className="text-[10px] text-slate-400">Library Turnstile 01 • Facial Biometric</p>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">08:48 AM</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/40 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-200">Prof. Priya Raman (HOD)</p>
                  <p className="text-[10px] text-slate-400">Faculty Tower Punch #04</p>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">08:35 AM</span>
              </div>
            </div>
          </div>

          {/* Institutional Trust & Verification Card */}
          <div className="rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-950/40 to-slate-900 p-5 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-brand-500/15 text-brand-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Smart Governance Protocol</h4>
                <p className="text-[11px] text-slate-400">National Accreditation Grade A++</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every admission application, attendance punch, grade entry, grievance ticket, and fee receipt is cryptographically audited and signed.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Uptime Reliability</span>
              <span className="font-mono font-bold text-emerald-400">99.98% High Availability</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

