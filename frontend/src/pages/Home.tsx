import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  Shirt,
  Sparkles,
  Star,
  Store,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const slidesImg = [
    { image: "/hero/donut.jpg" },
    { image: "/hero/foto-tahu.jpg" },
    { image: "/hero/nasi-kuning.jpg" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const popularCategories = [
    {
      title: "Kuliner",
      description: "Makanan ringan, katering, hingga minuman kekinian.",
      Icon: UtensilsCrossed,
      accent: "bg-amber-100 text-amber-600",
    },
    {
      title: "Fashion",
      description: "Pakaian lokal, batik, sepatu, dan aksesoris.",
      Icon: Shirt,
      accent: "bg-pink-100 text-pink-600",
    },
    {
      title: "Jasa & Layanan",
      description: "Servis elektronik, desain grafis, hingga reparasi kendaraan.",
      Icon: Wrench,
      accent: "bg-emerald-100 text-emerald-600",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slidesImg.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slidesImg.length]);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="px-4 pt-16 pb-20 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--card)] px-4 py-2 text-xs font-medium text-[var(--font-heading)] shadow-sm">
              <Sparkles size={14} className="text-[var(--accent-strong)]" />
              Direktori UMKM Lokal Kediri
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-[var(--font-heading)] sm:text-5xl lg:text-7xl">
              Temukan Produk Lokal,
              <br className="hidden sm:block" />
              <span className="text-[var(--muted)]">Dukung Usaha Sekitarmu.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Jelajahi berbagai UMKM di Burengan dan sekitarnya. Temukan
              kuliner, fashion, produk, dan jasa terbaik dari pelaku usaha
              lokal.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/umkm"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--font-heading)] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--font-heading-strong)] active:scale-[0.98] sm:w-auto"
              >
                <Search size={17} />
                Jelajahi UMKM
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/register"
                className="inline-flex w-full items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--card)] px-6 py-3.5 text-sm font-semibold text-[var(--font-heading)] shadow-sm transition hover:border-[var(--header-strong)] hover:bg-[var(--bg-soft)] active:scale-[0.98] sm:w-auto"
              >
                Daftarkan Usahamu
              </Link>
            </div>
          </div>

          {/* =================================================
              HERO IMAGE SHOWCASE
          ================================================== */}
          <div className="relative mx-auto mt-14 max-w-5xl sm:mt-16">
            {/* Main image container */}
            <div className="relative overflow-hidden rounded-4xl border border-[var(--line)] bg-[var(--card-alt)] shadow-2xl shadow-[rgba(107,75,33,0.12)]">
              <div className="aspect-video sm:aspect-16/8">
                <img
                  src={slidesImg[currentIndex].image}
                  alt="UMKM lokal Sekawan Burengan"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/15 via-transparent to-transparent" />
            </div>

            <div className="absolute -left-2 top-8 hidden w-44 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 shadow-xl sm:block lg:-left-8 lg:top-12 lg:w-52">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-soft)] text-white">
                  <Store size={19} className="text-[var(--font-heading)]"/>
                </div>

                <div>
                  <p className="text-xs font-medium text-[var(--muted)]">
                    UMKM Terdaftar
                  </p>
                  <p className="text-xl font-bold tracking-tight text-[var(--ink)]">
                    100+
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
                Temukan berbagai usaha lokal dalam satu tempat.
              </p>
            </div>

            <div className="absolute -right-2 top-1/3 hidden w-44 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 shadow-xl sm:block lg:-right-8 lg:w-52">
              <div className="flex items-center gap-2">
                <Star size={17} className="fill-[var(--warning)] text-[var(--warning)]" />

                <span className="text-lg font-bold text-[var(--ink)]">4.9</span>
              </div>

              <p className="mt-1 text-xs font-medium text-[var(--muted)]">
                Pengalaman pelanggan
              </p>

              <div className="mt-3 flex gap-1">
                <span className="h-1.5 flex-1 rounded-full bg-[var(--font-heading)]" />
                <span className="h-1.5 flex-1 rounded-full bg-[var(--font-heading)]" />
                <span className="h-1.5 flex-1 rounded-full bg-[var(--font-heading)]" />
                <span className="h-1.5 flex-1 rounded-full bg-[var(--font-heading)]" />
                <span className="h-1.5 w-5 rounded-full bg-[var(--line)]" />
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 rounded-full border border-white/70 bg-white/95 px-5 py-2.5 text-xs font-semibold text-[var(--font-heading)] shadow-lg backdrop-blur sm:flex sm:items-center sm:gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
              Dukung UMKM lokal hari ini
            </div>
          </div>

          <div className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-4 text-center sm:mt-10">
            <div>
              <p className="text-xl font-bold tracking-tight text-[var(--ink)] sm:text-2xl">
                100+
              </p>
              <p className="mt-1 text-xs text-[var(--muted)] sm:text-sm">UMKM</p>
            </div>

            <div className="border-x border-[var(--line)]">
              <p className="text-xl font-bold tracking-tight text-[var(--ink)] sm:text-2xl">
                10+
              </p>
              <p className="mt-1 text-xs text-[var(--muted)] sm:text-sm">Kategori</p>
            </div>

            <div>
              <p className="text-xl font-bold tracking-tight text-[var(--ink)] sm:text-2xl">
                Lokal
              </p>
              <p className="mt-1 text-xs text-[var(--muted)] sm:text-sm">Kediri</p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          2. SECTION KATEGORI POPULER
      ====================================================== */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Kategori Populer
            </h2>

            <p className="mt-4 text-gray-500">
              Mulai pencarianmu dari kategori favorit di bawah ini
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {popularCategories.map(({ title, description, Icon, accent }) => (
              <div
                key={title}
                className="cursor-pointer rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-shadow hover:shadow-md"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}
                >
                  <Icon size={22} strokeWidth={2} />
                </div>

                <h3 className="text-lg font-bold text-gray-900">{title}</h3>

                <p className="mt-2 text-sm text-gray-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
