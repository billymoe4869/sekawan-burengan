import { useLocation, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/useAuth";
import type { Role } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowRoles: Role[]; // jika diisi hanya role ini yang boleh mengakses, jika kosong cukup harus login
}

export default function ProtectedRoute({
  children,
  allowRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  //jika belum login lempar ke halaman login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  //sudah login tapi role tidak sesuai (misal owner memaksa buka dashboard admin)
  if (allowRoles && (!user || !allowRoles.includes(user.role))) {
    return <Navigate to={`/`} replace />;
  }

  return <>{children}</>;
}
