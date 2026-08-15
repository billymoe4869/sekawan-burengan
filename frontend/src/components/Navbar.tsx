import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronRight } from "lucide-react";
import ModalDialog from "./ModalDialog";
import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState<{
    type: "confirm" | "error";
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  } | null>(null);

  const dashboardPath =
    user?.role === "Admin"
      ? "/admin/dashboard"
      : user?.role === "Owner"
        ? "/owner/dashboard"
        : null;

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    setLogoutModal({
      type: "confirm",
      title: "Keluar dari akun",
      message: "Apakah Anda yakin ingin keluar dari akun saat ini?",
      confirmLabel: "Ya, keluar",
      cancelLabel: "Batal",
      onConfirm: () => {
        logout();
        setIsMenuOpen(false);
        setLogoutModal(null);
        navigate("/");
      },
      onCancel: () => setLogoutModal(null),
    });
  };

  return (
    <>
      <ModalDialog
        isOpen={Boolean(logoutModal)}
        type={logoutModal?.type ?? "confirm"}
        title={logoutModal?.title ?? ""}
        message={logoutModal?.message ?? ""}
        confirmLabel={logoutModal?.confirmLabel}
        cancelLabel={logoutModal?.cancelLabel}
        onConfirm={() => {
          logoutModal?.onConfirm?.();
        }}
        onCancel={() => {
          logoutModal?.onCancel?.();
          setLogoutModal(null);
        }}
      />

      <nav className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--bg)]/90 opacity-100 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              onClick={closeMenu}
              className="flex shrink-0 items-center"
            >
              <img
                src="/logo-sekawan.png"
                alt="Sekawan Burengan"
                className="h-10 w-auto object-contain sm:h-11 lg:h-16"
              />
            </Link>
            <span className="font-brand md:text-3xl text-2xl text-[var(--font-heading)]">
              Sekawan Burengan
            </span>
          </div>

          <div className="hidden items-center gap-8 lg:flex">
            <Link
              to="/"
              className="text-sm font-medium text-[var(--font-heading)] transition-colors hover:text-[var(--font-heading-strong)]"
            >
              Beranda
            </Link>

            <Link
              to="/umkm"
              className="text-sm font-medium text-[var(--font-heading)] transition-colors hover:text-[var(--font-heading-strong)]"
            >
              Eksplorasi UMKM
            </Link>
          </div>

          {/* =========================
              DESKTOP AUTH
              lg ke atas
          ========================== */}
          <div className="hidden items-center gap-3 lg:flex">
            {isAuthenticated ? (
              <>
                {dashboardPath && (
                  <Link
                    to={dashboardPath}
                    onClick={closeMenu}
                    className="rounded-lg bg-[var(--font-heading)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--font-heading-strong)] active:scale-95"
                  >
                    Dashboard
                  </Link>
                )}

                <span className="rounded-full bg-[var(--card-alt)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--font-heading)]">
                  {user?.role || "User"}
                </span>

                <button
                  onClick={handleLogout}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-[var(--danger)] transition-colors hover:bg-red-50 active:scale-95"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--font-heading)] transition-colors hover:bg-[var(--card-alt)] hover:text-[var(--font-heading-strong)]"
                >
                  Masuk
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-[var(--font-heading)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--font-heading-strong)] active:scale-95"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* =========================
              MOBILE MENU BUTTON
              < lg
          ========================== */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 active:scale-95 lg:hidden"
            aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X size={24} strokeWidth={2} />
            ) : (
              <Menu size={24} strokeWidth={2} />
            )}
          </button>
        </div>

        {/* =========================
            MOBILE MENU
        ========================== */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
            isMenuOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-gray-100 py-4">
            {/* Navigation */}
            <div className="space-y-1">
              <Link
                to="/"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-[var(--font-heading)] transition hover:bg-[var(--card-alt)] hover:text-[var(--font-heading-strong)]"
              >
                <span>Beranda</span>
                <ChevronRight size={17} />
              </Link>
 
              <Link
                to="/umkm"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-[var(--font-heading)] transition hover:bg-[var(--card-alt)] hover:text-[var(--font-heading-strong)]"
              >
                <span>Eksplorasi UMKM</span>
                <ChevronRight size={17} />
              </Link>
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-gray-100" />

            {/* Auth */}
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="rounded-xl bg-[var(--card-alt)] px-4 py-3">
                  <p className="text-xs font-medium text-[var(--muted)]">
                    Masuk sebagai
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[var(--ink)]">
                    {user?.name || "User"}
                  </p>

                  <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-[var(--font-heading)]">
                    {user?.role || "User"}
                  </p>
                </div>

                {dashboardPath && (
                  <Link
                    to={dashboardPath}
                    onClick={closeMenu}
                    className="flex w-full items-center justify-between rounded-xl bg-[var(--font-heading)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--font-heading-strong)] active:scale-[0.98]"
                  >
                    <span>Dashboard</span>
                    <ChevronRight size={17} />
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--danger)] transition hover:bg-red-100 active:scale-[0.98]"
                >
                  <span>Keluar</span>
                  <ChevronRight size={17} />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Masuk
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="rounded-xl bg-(--font-heading) px-4 py-3 text-center text-sm font-semibold text-white transition hover:opacity-80"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      </nav>
    </>
  );
}
