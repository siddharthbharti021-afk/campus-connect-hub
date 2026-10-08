"use client";
import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Bell,
  Search,
  Sparkles,
  ShieldAlert,
  Users,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  ChevronDown,
  AlertOctagon
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentRole,
    setRole,
    currentUser,
    emergencyAlertCount,
    toggleAssistant,
    isAssistantOpen,
    triggerEmergencySOS,
    sosTriggered
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = React.useState(false);

  const roleConfigs: Record<
    UserRole,
    { label: string; icon: React.ComponentType<{ className?: string }>; badgeColor: string }
  > = {
    admin: { label: 'Super Admin / Dean', icon: Briefcase, badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    faculty: { label: 'Faculty / HOD', icon: Users, badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    student: { label: 'Student', icon: GraduationCap, badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    parent: { label: 'Parent / Guardian', icon: HeartHandshake, badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30' }
  };

  const CurrentRoleIcon = roleConfigs[currentRole].icon;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0B1120]/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 shadow-lg shadow-brand-500/20">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white">
                SMART<span className="text-brand-400">CAMPUS</span> <span className="text-cyan-400">AI</span>
              </span>
              <span className="rounded bg-brand-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand-400 border border-brand-500/20">
                v2.0 • Phase 2
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
              One Campus. One Platform. Smarter Governance.
            </p>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search admissions, students, attendance, exams, fees, grievances..."
              className="w-full rounded-xl bg-slate-900/80 border border-slate-800 pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition"
            />
          </div>
        </div>

        {/* Right Controls: SOS Emergency, Role Switcher, AI Trigger, Notifications & User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Emergency SOS Beacon Button */}
          <button
            onClick={triggerEmergencySOS}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-bold transition border ${
              sosTriggered
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
            }`}
            title="Campus Distress / Medical Emergency Beacon"
          >
            <AlertOctagon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">SOS Beacon</span>
          </button>

          {/* AI Copilot Trigger */}
          <button
            onClick={toggleAssistant}
            className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition border ${
              isAssistantOpen
                ? 'bg-gradient-to-r from-brand-600 to-cyan-600 text-white border-transparent shadow-lg shadow-brand-500/25'
                : 'bg-slate-900 border-brand-500/30 text-brand-300 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="h-4 w-4 text-cyan-400 animate-spin-slow" />
            <span className="hidden md:inline">AI Copilot</span>
          </button>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${roleConfigs[currentRole].badgeColor}`}
            >
              <CurrentRoleIcon className="h-3.5 w-3.5" />
              <span className="capitalize">{currentRole}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in duration-150">
                <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 mb-1">
                  Switch Persona (Demo)
                </div>
                {(['admin', 'faculty', 'student', 'parent'] as UserRole[]).map(role => {
                  const Conf = roleConfigs[role];
                  const Icon = Conf.icon;
                  const isSelected = currentRole === role;
                  return (
                    <button
                      key={role}
                      onClick={() => {
                        setRole(role);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                        isSelected
                          ? 'bg-brand-600 text-white font-medium shadow-sm'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4" />
                        <span>{Conf.label}</span>
                      </div>
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Emergency Alert Indicator */}
          <div className="relative">
            <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition">
              <Bell className="h-4 w-4" />
              {emergencyAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow">
                  {emergencyAlertCount}
                </span>
              )}
            </button>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-brand-500/30"
            />
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-white leading-none truncate max-w-[120px]">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-slate-400 leading-none mt-1 truncate max-w-[120px]">
                {currentUser.department}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

