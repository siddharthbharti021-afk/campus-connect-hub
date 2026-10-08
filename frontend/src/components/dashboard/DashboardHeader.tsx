"use client";

/**
 * Sub-page header is no longer needed: navigation, user info and sign-out
 * live in the shared DashboardShell. Kept as a no-op so existing imports work.
 */
export default function DashboardHeader(_props: { backHref?: string; backLabel?: string }) {
  return null;
}
