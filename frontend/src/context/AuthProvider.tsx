import { AuthContext, type AuthUser } from "./AuthContext";
import { useState, useEffect, type ReactNode } from "react";

const TOKEN_KEY = "token";
const USER_KEY = "user";

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    // data korup, bersihkan agar tidak terus error
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

  // men-sinkronkan status login antar-tab (logout di satu tab, tab lain ikut ter-update)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (
        event.key === TOKEN_KEY ||
        event.key === USER_KEY ||
        event.key === null
      ) {
        setToken(localStorage.getItem(TOKEN_KEY));
        setUser(readStoredUser());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
