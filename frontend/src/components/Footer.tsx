import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Footer() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const keyword = search.trim();
    if (!keyword) return;

    navigate(`/product?search=${encodeURIComponent(keyword)}`);
    setSearch("");
  };

  return (
    <footer className="bg-[var(--font-heading)] text-[var(--card)]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <section className="border-b border-white/10 py-14 sm:py-16">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold tracking-wide text-[var(--header)]">
                DUKUNG UMKM LOKAL
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Temukan produk lokal,
                <br className="hidden sm:block" />
                dukung usaha di sekitar kita.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--card-alt)] sm:text-base">
                Jelajahi berbagai UMKM lokal, temukan produk terbaik, dan bantu
                usaha masyarakat berkembang bersama.
              </p>
            </div>

            <Link
              to="/umkm"
              className="inline-flex w-fit items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[var(--font-heading)] transition hover:bg-[var(--bg-soft)]"
            >
              Eksplorasi UMKM
            </Link>
          </div>
        </section>

        {/* Main footer */}
        <section className="grid grid-cols-1 gap-12 py-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">
          {/* Logo */}
          <div>
            <div className="flex items-center">
              <Link to="/" className="inline-flex items-center">
                <img
                  src="/logo-sekawan.png"
                  alt="Sekawan Burengan"
                  className="h-10 w-auto object-contain sm:h-11 lg:h-16"
                />
              </Link>
              <span className="font-brand md:text-3xl text-2xl text-white">
                Sekawan Burengan
              </span>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--card-alt)]">
              Platform untuk menemukan dan mengenal lebih dekat UMKM lokal di
              Burengan dan sekitarnya.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Navigasi
            </h3>

            <nav className="mt-5 flex flex-col gap-3">
              <Link
                to="/"
                className="w-fit text-sm text-[var(--card-alt)] transition hover:text-white"
              >
                Beranda
              </Link>

              <Link
                to="/umkm"
                className="w-fit text-sm text-[var(--card-alt)] transition hover:text-white"
              >
                Eksplorasi UMKM
              </Link>

              <Link
                to="/about"
                className="w-fit text-sm text-[var(--card-alt)] transition hover:text-white"
              >
                Tentang Kami
              </Link>

              <Link
                to="/register"
                className="w-fit text-sm text-[var(--card-alt)] transition hover:text-white"
              >
                Daftarkan UMKM
              </Link>
            </nav>
          </div>

          {/* Search Product */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Cari Produk
            </h3>

            <p className="mt-4 text-sm leading-6 text-[var(--header)]">
              Temukan produk yang kamu cari dari berbagai UMKM lokal.
            </p>

            <form className="mt-5" onSubmit={handleSearch}>
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--header)]"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari produk..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-[var(--header)] transition focus:border-white/30 focus:bg-white/10"
                />
              </div>

              <button
                type="submit"
                className="mt-3 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[var(--font-heading)] transition hover:bg-[var(--bg-soft)]"
              >
                Cari Produk
              </button>
            </form>
          </div>
        </section>

        {/* Bottom */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-sm text-[var(--header)] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Sekawan Burengan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
