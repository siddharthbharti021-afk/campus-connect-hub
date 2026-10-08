"use client";
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Radio,
  Sparkles,
  BookOpen,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const SmartAttendanceModule: React.FC = () => {
  const { attendance, markAttendance, currentRole, currentUser } = useApp();
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Healthy'>('All');
  const [simulatingCode, setSimulatingCode] = useState<string | null>(null);

  const filteredAttendance = attendance.filter(item => {
    if (filter === 'Critical') return item.percentage < 75;
    if (filter === 'Healthy') return item.percentage >= 75;
    return true;
  });

  const avgAttendance = (
    attendance.reduce((sum, item) => sum + item.percentage, 0) / attendance.length
  ).toFixed(1);

  const criticalCount = attendance.filter(item => item.percentage < 75).length;

  const handleSimulatePunch = (code: string, present: boolean) => {
    setSimulatingCode(code);
    setTimeout(() => {
      markAttendance(code, present);
      setSimulatingCode(null);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            <span>Smart Biometric Attendance & Early-Warning Radar</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time biometric turnstile logs, RFID gate records, and AI compliance threshold monitoring.
          </p>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 px-4 py-2 flex items-center gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Aggregate Average</span>
              <p className="text-lg font-bold text-white leading-none mt-0.5">{avgAttendance}%</p>
            </div>
            <div className={`h-3 w-3 rounded-full ${parseFloat(avgAttendance) >= 75 ? 'bg-emerald-400' : 'bg-rose-400'} animate-pulse`} />
          </div>
        </div>
      </div>

      {/* Critical Alert Banner if attendance < 75% */}
      {criticalCount > 0 && (
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 sm:p-5 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-300">
                Attendance Shortage Warning ({criticalCount} Subject Below 75% Threshold)
              </h4>
              <p className="text-xs text-rose-200/80 mt-1 leading-relaxed">
                As per University Statute Clause 12.A, candidates failing to maintain 75% aggregate in any registered subject are ineligible for End-Semester Examinations without approved medical waiver.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilter('Critical')}
            className="px-3.5 py-2 rounded-xl bg-rose-600 text-white font-semibold text-xs shrink-0 hover:bg-rose-500 transition shadow-lg shadow-rose-600/20"
          >
            Filter Shortage Subjects
          </button>
        </div>
      )}

      {/* Controls: Filter Pills */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(['All', 'Critical', 'Healthy'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                filter === tab
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'All' ? 'All Subjects' : tab === 'Critical' ? 'Shortage (<75%)' : 'Compliant (≥75%)'}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
          <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span>Biometric Sensor Active</span>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAttendance.map(item => {
          const isCritical = item.percentage < 75;
          return (
            <div
              key={item.code}
              className={`rounded-2xl border p-5 backdrop-blur-md transition-all ${
                isCritical
                  ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                      {item.code}
                    </span>
                    <Badge variant={isCritical ? 'danger' : 'success'} size="sm" dot>
                      {item.status}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-2 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Faculty: {item.faculty}</p>
                </div>

                <div className="text-right">
                  <span
                    className={`text-2xl font-black font-mono ${
                      isCritical ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {item.percentage}%
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {item.attendedClasses} / {item.totalClasses} Hours
                  </p>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="mt-4 space-y-1.5">
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden relative">
                  {/* 75% Target Mark line */}
                  <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-amber-400 z-10" title="Mandatory 75% Threshold" />
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCritical ? 'bg-gradient-to-r from-rose-500 to-amber-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                    }`}
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Current: {item.percentage}%</span>
                  <span className="text-amber-400 font-medium">Req: 75.0%</span>
                </div>
              </div>

              {/* Shortage Remedy Calculator or Compliant Note */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                {isCritical ? (
                  <div className="text-rose-300 font-medium flex items-center gap-1.5 text-[11px]">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>Attend next <strong>{item.classesNeededFor75}</strong> consecutive classes to reach 75%</span>
                  </div>
                ) : (
                  <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Eligible for End-Term Exam
                  </span>
                )}
                <span className="text-[10px] text-slate-500">{item.lastUpdated}</span>
              </div>

              {/* Interactive Biometric Punch Simulator */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-end gap-2">
                <span className="text-[10px] text-slate-400 mr-auto font-mono">
                  {simulatingCode === item.code ? 'Simulating RFID punch...' : 'RFID Simulator:'}
                </span>
                <button
                  disabled={simulatingCode === item.code}
                  onClick={() => handleSimulatePunch(item.code, true)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 text-[11px] font-semibold transition"
                >
                  + Punch Present
                </button>
                <button
                  disabled={simulatingCode === item.code}
                  onClick={() => handleSimulatePunch(item.code, false)}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/25 text-[11px] font-semibold transition"
                >
                  - Mark Absent
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

