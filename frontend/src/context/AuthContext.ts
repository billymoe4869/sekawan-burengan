import { createContext } from "react";

export type Role = "Admin" | "Owner";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  // dipanggil setelah login/register sukses, untuk menyimpan sesi
  login: (token: string, user: AuthUser) => void;
  // dipanggil saat logout, membersihkan sesi
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
