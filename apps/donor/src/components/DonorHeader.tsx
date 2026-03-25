import React from "react";
import Link from "next/link";
import { Logo } from "@agapehub/ui";

export function DonorHeader() {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/explore">
          <Logo size="sm" variant="full" />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/my/donations"
            className="text-sm text-gray-600 hover:text-violet-600 transition-colors"
          >
            Minhas doações
          </Link>
          <Link
            href="/auth/login"
            className="px-3 py-1.5 text-sm font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Entrar
          </Link>
        </div>
      </div>
    </header>
  );
}
