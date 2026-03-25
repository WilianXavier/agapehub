"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@agapehub/ui";

const navItems = [
  { href: "/home", label: "Início", icon: "🏠" },
  { href: "/campaigns", label: "Campanhas", icon: "📢" },
  { href: "/financial/dashboard", label: "Financeiro", icon: "💰" },
  { href: "/compliance/kyc", label: "Conformidade", icon: "✅" },
  { href: "/register", label: "Organização", icon: "🏛️" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    router.replace("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-100 min-h-screen">
        <div className="p-6 border-b border-gray-100">
          <Logo size="md" variant="full" />
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-violet-50 text-violet-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            <button
              onClick={() => { logout(); router.push("/login"); }}
              className="text-gray-400 hover:text-gray-600 text-xs"
              title="Sair"
            >
              ↩
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <Logo size="sm" variant="full" />
        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm">
          {user.name.charAt(0)}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 md:overflow-auto pt-16 md:pt-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-30">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-2 text-xs gap-0.5 transition-colors ${
                active ? "text-violet-600" : "text-gray-500"
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
