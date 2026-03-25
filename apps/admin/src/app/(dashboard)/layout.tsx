"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@agapehub/ui";

const navItems = [
  { href: "/home",                label: "Início",      icon: "🏠" },
  { href: "/campaigns",           label: "Campanhas",   icon: "📢" },
  { href: "/financial/dashboard", label: "Financeiro",  icon: "💰" },
  { href: "/compliance/kyc",      label: "Conformidade",icon: "✅" },
  { href: "/register",            label: "Organização", icon: "🏛️" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    router.replace("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-canvas border-r border-border min-h-screen">
        <div className="p-6 border-b border-border">
          <Logo size="md" variant="full" />
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-subtle text-brand"
                    : "text-fg-muted hover:bg-surface-2 hover:text-fg"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-brand-subtle flex items-center justify-center text-brand font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-fg truncate">{user.name}</p>
              <p className="text-xs text-fg-muted capitalize">{user.role}</p>
            </div>
            <button
              onClick={() => { logout(); router.push("/login"); }}
              className="text-fg-disabled hover:text-fg-muted text-xs transition-colors"
              title="Sair"
            >
              ↩
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-canvas border-b border-border px-4 py-3 flex items-center justify-between">
        <Logo size="sm" variant="full" />
        <div className="w-8 h-8 rounded-full bg-brand-subtle flex items-center justify-center text-brand font-bold text-sm">
          {user.name.charAt(0)}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 md:overflow-auto pt-16 md:pt-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-canvas border-t border-border flex z-30">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-2 text-xs gap-0.5 transition-colors ${
                active ? "text-brand" : "text-fg-muted"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="truncate w-full text-center">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
