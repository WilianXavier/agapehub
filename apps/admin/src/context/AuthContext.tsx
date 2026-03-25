"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { type MockUser, type Role, getSession, signIn, signOut } from "@/lib/auth";

interface AuthContextValue {
  user: MockUser | null;
  loading: boolean;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getSession());
    setLoading(false);
  }, []);

  function login(role: Role) {
    const u = signIn(role);
    setUser(u);
  }

  function logout() {
    signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
