export type Role = "admin" | "treasurer" | "leader";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  orgName: string;
  avatarUrl?: string;
}

export const MOCK_USERS: Record<Role, MockUser> = {
  admin: {
    id: "usr_admin_001",
    name: "Pastor João Silva",
    email: "joao@igrejagraca.com.br",
    role: "admin",
    orgName: "Igreja da Graça",
  },
  treasurer: {
    id: "usr_treasurer_001",
    name: "Ana Tesoureira",
    email: "ana@igrejagraca.com.br",
    role: "treasurer",
    orgName: "Igreja da Graça",
  },
  leader: {
    id: "usr_leader_001",
    name: "Carlos Líder",
    email: "carlos@igrejagraca.com.br",
    role: "leader",
    orgName: "Igreja da Graça",
  },
};

const AUTH_KEY = "agapehub_mock_user";

export function getSession(): MockUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MockUser;
  } catch {
    return null;
  }
}

export function signIn(role: Role): MockUser {
  const user = MOCK_USERS[role];
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

export function signOut(): void {
  localStorage.removeItem(AUTH_KEY);
}
