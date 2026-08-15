import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Menembak endpoint POST /api/users/register (sesuaikan jika backend-mu pakai '/users' saja)
      await api.post("/users/register", {
        name,
        email,
        password,
      });

      // Jika sukses, tampilkan pesan hijau
      setSuccessMsg("Pendaftaran berhasil! Mengalihkan ke halaman login...");

      // Tunggu 2 detik agar user bisa membaca pesan, lalu pindah ke halaman login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMsg(
          error.response?.data?.message || "Terjadi kesalahan saat mendaftar",
        );
      } else {
        setErrorMsg("Terjadi kesalahan yang tidak terduga");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-[var(--bg)] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--card)] p-8 shadow-xl sm:p-10">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-[var(--font-heading)]">Buat Akun Baru</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Bergabunglah dengan Direktori UMKM Kediri
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {errorMsg && (
            <div className="rounded-lg bg-red-100 p-3 text-sm text-[var(--danger)]">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="rounded-lg bg-green-100 p-3 text-sm text-[var(--success)]">
              {successMsg}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[var(--font-heading)]">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              placeholder="Budi Santoso"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-3 text-base outline-none transition-all focus:border-[var(--font-heading)] focus:ring-4 focus:ring-[rgba(107,75,33,0.12)]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[var(--font-heading)]">Email</label>
            <input
              type="email"
              required
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-3 text-base outline-none transition-all focus:border-[var(--font-heading)] focus:ring-4 focus:ring-[rgba(107,75,33,0.12)]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[var(--font-heading)]">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-3 text-base outline-none transition-all focus:border-[var(--font-heading)] focus:ring-4 focus:ring-[rgba(107,75,33,0.12)]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 rounded-lg bg-[var(--font-heading)] p-3 font-semibold text-white transition-colors hover:bg-[var(--font-heading-strong)] disabled:bg-[var(--header)] active:scale-[0.98]"
          >
            {isLoading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--muted)]">
          <p>
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="font-semibold text-[var(--font-heading)] transition-colors hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
