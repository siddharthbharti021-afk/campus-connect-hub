"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Bot,
  CalendarDays,
  ClipboardCheck,
  LineChart,
  CalendarClock,
  Library,
  CreditCard,
  Award,
  Bus,
  Utensils,
  Megaphone,
  Briefcase,
  HeartPulse,
  LifeBuoy,
  Users,
  Search,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore, Role } from "@/store/auth";
import NotificationBell from "@/components/notifications/NotificationBell";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: Role[]; // undefined = everyone
};

type NavGroup = { title: string; items: NavItem[] };

const ADMIN: Role[] = ["ACADEMIC_ADMIN", "SUPER_ADMIN"];

const NAV: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Home", href: "/dashboard", icon: Home },
      { label: "Ask the assistant", href: "/dashboard/assistant", icon: Bot },
    ],
  },
  {
    title: "Academics",
    items: [
      { label: "Timetable", href: "/dashboard/timetable", icon: CalendarDays, roles: ["STUDENT", "FACULTY", ...ADMIN] },
      { label: "Attendance", href: "/dashboard/attendance", icon: ClipboardCheck },
      { label: "Progress & early warnings", href: "/dashboard/intelligence", icon: LineChart },
      { label: "Room scheduler", href: "/dashboard/conflicts", icon: CalendarClock, roles: ["FACULTY", ...ADMIN] },
      { label: "Knowledge base", href: "/dashboard/knowledge", icon: Library, roles: ADMIN },
    ],
  },
  {
    title: "Money & paperwork",
    items: [
      { label: "Fees & payments", href: "/dashboard/fees", icon: CreditCard, roles: ["STUDENT", "PARENT", ...ADMIN] },
      { label: "Certificates", href: "/dashboard/certificates", icon: Award, roles: ["STUDENT", "PARENT", ...ADMIN] },
    ],
  },
  {
    title: "Campus life",
    items: [
      { label: "Transport", href: "/dashboard/transport", icon: Bus },
      { label: "Mess menu", href: "/dashboard/mess", icon: Utensils, roles: ["STUDENT", "FACULTY", ...ADMIN] },
      { label: "Notices", href: "/dashboard/notices", icon: Megaphone },
      { label: "Placements", href: "/dashboard/placement", icon: Briefcase, roles: ["STUDENT", ...ADMIN] },
      { label: "Wellbeing", href: "/dashboard/wellbeing", icon: HeartPulse, roles: ["STUDENT", ...ADMIN] },
      { label: "Help & grievances", href: "/dashboard/helpdesk", icon: LifeBuoy },
    ],
  },
  {
    title: "Administration",
    items: [{ label: "People & roles", href: "/dashboard/users", icon: Users, roles: ADMIN }],
  },
];

export function roleLabel(role?: Role) {
  if (role === "ACADEMIC_ADMIN" || role === "SUPER_ADMIN") return "Dean";
  if (role === "FACULTY") return "Professor";
  if (role === "PARENT") return "Guardian";
  return "Student";
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = (user?.role ?? "STUDENT") as Role;

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return NAV.map((g) => ({
      ...g,
      items: g.items.filter(
        (i) => (!i.roles || i.roles.includes(role)) && (!q || i.label.toLowerCase().includes(q))
      ),
    })).filter((g) => g.items.length > 0);
  }, [role, query]);

  const initials =
    user?.full_name
      ?.split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "U";

  function handleLogout() {
    clearAuth();
    router.replace("/login");
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const first = groups[0]?.items[0];
    if (first) {
      router.push(first.href);
      setQuery("");
      setMobileOpen(false);
    }
  }

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const sidebar = (
    <nav className="flex h-full flex-col">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-5 py-5" onClick={() => setMobileOpen(false)}>
        <span className="h-7 w-7 rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-emerald-400" />
        <span className="text-xl font-black tracking-tight text-slate-900">Campusly</span>
      </Link>

      <div className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{g.title}</p>
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                        active
                          ? "bg-emerald-100 text-emerald-900"
                          : "text-slate-600 hover:bg-white hover:text-slate-900"
                      }`}
                    >
                      <Icon className={`h-[18px] w-[18px] ${active ? "text-emerald-700" : "text-slate-400"}`} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {groups.length === 0 && (
          <p className="px-3 text-sm text-slate-400">Nothing matches “{query}”.</p>
        )}
      </div>

      <div className="border-t border-slate-200/70 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#f3f9f4] text-slate-900">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200/70 bg-[#eaf4ec] lg:block">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/30" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-[#eaf4ec] shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-5 rounded-lg p-1.5 text-slate-500 hover:bg-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-[#f3f9f4]/90 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-8">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-white lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <form onSubmit={onSearchSubmit} className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to fees, timetable, transport…"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </form>

            <div className="ml-auto flex items-center gap-3">
              <NotificationBell />
              <div className="hidden items-center gap-3 sm:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-200 text-sm font-bold text-emerald-900">
                  {initials}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-900">{user?.full_name ?? "Campus user"}</p>
                  <p className="text-xs text-slate-500">
                    {roleLabel(role)}
                    {user?.user_code ? ` · ${user.user_code}` : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="campus-skin px-4 py-8 sm:px-8">{children}</main>
      </div>

      {/* Single assistant launcher */}
      {pathname !== "/dashboard/assistant" && (
        <Link
          href="/dashboard/assistant"
          className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full bg-[#0d1527] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
        >
          <Bot className="h-4 w-4" />
          <span className="hidden sm:inline">Ask the assistant</span>
        </Link>
      )}
    </div>
  );
}
