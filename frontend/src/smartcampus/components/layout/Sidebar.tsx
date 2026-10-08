"use client";
import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  CheckCircle2,
  CalendarDays,
  AlertCircle,
  CreditCard,
  FileCheck2,
  Home,
  BotMessageSquare,
  Sparkles,
  GraduationCap,
  FileText,
  HeartHandshake,
  Briefcase,
  LucideIcon
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  counter?: number;
  highlight?: boolean;
}

interface NavSection {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, grievances, fees, admissions, parentMessages } = useApp();

  const pendingFeesCount = fees.filter(f => f.status === 'Pending' || f.status === 'Overdue').length;
  const activeGrievancesCount = grievances.filter(g => g.status !== 'Resolved').length;
  const unreadMessagesCount = parentMessages.filter(m => !m.read).length;

  const navSections: NavSection[] = [
    {
      group: 'Overview',
      items: [
        { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard }
      ]
    },
    {
      group: 'Academic Governance',
      items: [
        { id: 'admissions', label: 'Admissions Pipeline', icon: GraduationCap, badge: 'Active' },
        { id: 'students', label: 'Student 360° Records', icon: Users },
        { id: 'attendance', label: 'Smart Attendance & RFID', icon: CheckCircle2, badge: 'Live' },
        { id: 'examinations', label: 'Examinations & Hall Ticket', icon: FileText },
        { id: 'timetable', label: 'Master Timetables', icon: CalendarDays }
      ]
    },
    {
      group: 'Welfare & Communication',
      items: [
        {
          id: 'parent-comm',
          label: 'Parent Communication',
          icon: HeartHandshake,
          counter: unreadMessagesCount > 0 ? unreadMessagesCount : undefined
        },
        {
          id: 'grievances',
          label: 'AI Grievance Redressal',
          icon: AlertCircle,
          counter: activeGrievancesCount > 0 ? activeGrievancesCount : undefined
        },
        { id: 'services', label: 'Student Services Desk', icon: Briefcase },
        { id: 'certificates', label: 'Digital Credentials', icon: FileCheck2 }
      ]
    },
    {
      group: 'Campus Operations & FinTech',
      items: [
        {
          id: 'fees',
          label: 'Fees & FinTech Portal',
          icon: CreditCard,
          counter: pendingFeesCount > 0 ? pendingFeesCount : undefined
        },
        { id: 'hostel', label: 'Hostel & Fleet Transit', icon: Home }
      ]
    },
    {
      group: 'Campus Intelligence',
      items: [
        {
          id: 'ai-assistant',
          label: 'SmartCampus Copilot',
          icon: BotMessageSquare,
          highlight: true
        }
      ]
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-[#0B1120]/95 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {navSections.map(section => (
          <div key={section.group} className="space-y-1">
            <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {section.group}
            </h4>
            <div className="mt-2 space-y-1">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20 font-semibold'
                        : item.highlight
                        ? 'text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300'
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-white' : item.highlight ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-400 uppercase">
                        {item.badge}
                      </span>
                    )}

                    {item.counter !== undefined && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500/20 border border-amber-500/30 px-1.5 text-[10px] font-bold text-amber-400">
                        {item.counter}
                      </span>
                    )}

                    {item.highlight && !isActive && (
                      <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Institutional Compliance Footer Banner */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
        <div className="rounded-xl border border-slate-800 p-3 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-slate-200">Campus Cloud Online</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400">
            Biometric Gate 1-8 active • SLA: 99.98%
          </p>
        </div>
      </div>
    </aside>
  );
};

