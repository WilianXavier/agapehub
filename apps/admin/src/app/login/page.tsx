"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@agapehub/ui";
import type { Role } from "@/lib/auth";

const roles: { value: Role; label: string; description: string; icon: string }[] = [
  {
    value: "admin",
    label: "Administrador",
    description: "Acesso total: campanhas, financeiro, configurações e membros.",
    icon: "👤",
  },
  {
    value: "treasurer",
    label: "Tesoureiro",
    description: "Acesso ao cockpit financeiro, saques e relatórios.",
    icon: "💼",
  },
  {
    value: "leader",
    label: "Líder",
    description: "Acesso às campanhas e monitoramento de doações.",
    icon: "🌟",
  },
];

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<Role>("admin");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.replace("/home");
  }, [user, router]);

  function handleLogin() {
    setLoading(true);
    login(selected);
    setTimeout(() => router.push("/home"), 400);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" variant="full" />
          </div>
          <p className="text-gray-500 text-sm">Painel Administrativo</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Entrar como</h2>
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            🔧 Modo de desenvolvimento — selecione um perfil para simular o login.
          </p>

          <div className="space-y-2">
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => setSelected(role.value)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                  selected === role.value
                    ? "border-violet-500 bg-violet-50"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{role.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{role.label}</p>
                    <p className="text-xs text-gray-500">{role.description}</p>
                  </div>
                  {selected === role.value && (
                    <span className="ml-auto text-violet-500">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            Entrar no painel
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          ágapehub © {new Date().getFullYear()} — Plataforma de doações para igrejas
        </p>
      </div>
    </div>
  );
}
