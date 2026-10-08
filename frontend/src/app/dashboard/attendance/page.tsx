"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AttendancePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard?tab=attendance");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-400 p-8 flex items-center justify-center font-sans">
      Loading Smart Biometric Attendance & RFID...
    </div>
  );
}
