import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import axios from "axios";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      // 1. Kirim data ke backend
      const response = await api.post("/users/login", {
        email,
        password,
      });

      // 2. Tangkap token dan data user dari backend
      const { token, user } = response.data.data;

      // 3. Simpan sesi lewat AuthContext (otomatis update Navbar & seluruh app)
      login(token, user);

      // 4. Pindah halaman berdasarkan role
      if (user.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/owner/dashboard");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMsg(
          error.response?.data?.message || "Terjadi kesalahan saat login",
        );
      } else {
        setErrorMsg("Terjadi kesalahan yang tidak terduga");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Wadah utama: Flexbox untuk memusatkan card di tengah layar
    <div className="flex min-h-[80vh] items-center justify-center bg-[var(--bg)]">
      <div className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--card)] p-8 shadow-xl sm:p-10">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-[var(--font-heading)]">Selamat Datang</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Masuk ke akun dasbor Anda
          </p>
        </div>

        {/* Formulir */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Tampilkan kotak error warna merah jika login gagal */}
          {errorMsg && (
            <div className="rounded-lg bg-red-100 p-3 text-sm text-[var(--danger)]">
              {errorMsg}
            </div>
          )}

          {/* Input Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-[var(--font-heading)]"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-3 text-base outline-none transition-all focus:border-[var(--font-heading)] focus:ring-4 focus:ring-[rgba(107,75,33,0.12)]"
            />
          </div>

          {/* Input Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-[var(--font-heading)]"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-3 text-base outline-none transition-all focus:border-[var(--font-heading)] focus:ring-4 focus:ring-[rgba(107,75,33,0.12)]"
            />
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 rounded-lg bg-[var(--font-heading)] p-3 font-semibold text-white transition-colors hover:bg-[var(--font-heading-strong)] disabled:bg-[var(--header)]"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--muted)]">
          <p>
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="font-semibold text-[var(--font-heading)] transition-colors hover:text-[var(--font-heading-strong)] hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
