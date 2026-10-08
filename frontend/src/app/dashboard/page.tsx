"use client";

import React, { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppContent } from "@/smartcampus/App";
import { useApp } from "@/smartcampus/context/AppContext";

function TabSyncWrapper() {
  const searchParams = useSearchParams();
  const { setActiveTab } = useApp();

  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams, setActiveTab]);

  return <AppContent />;
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B1120] text-slate-400 p-8 flex items-center justify-center font-sans">
          Loading SmartCampus AI Command Center...
        </div>
      }
    >
      <TabSyncWrapper />
    </Suspense>
  );
}
