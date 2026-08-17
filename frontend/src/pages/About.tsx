import { ArrowRight, Globe, Handshake, MapPinned, ShieldCheck, Store, Users } from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  {
    icon: Globe,
    title: "Mendorong UMKM lokal",
    description:
      "Kami membantu usaha kecil di sekitar Burengan tampil lebih mudah ditemukan oleh masyarakat dan pelanggan baru.",
  },
  {
    icon: Users,
    title: "Membangun koneksi",
    description:
      "Platform ini menjadi jembatan antara pelaku usaha, pembeli, dan komunitas lokal agar transaksi dan kolaborasi lebih dekat.",
  },
  {
    icon: ShieldCheck,
    title: "Transparan dan terpercaya",
    description:
      "Setiap profil usaha dan produk dirancang agar pelanggan bisa lebih yakin sebelum memutuskan membeli atau melakukan kerja sama.",
  },
];

const steps = [
  {
    label: "01",
    title: "Jelajahi UMKM",
    description: "Cari usaha berdasarkan kategori, lokasi, atau produk yang kamu butuhkan.",
  },
  {
    label: "02",
    title: "Lihat profil usaha",
    description: "Temukan deskripsi usaha, galeri, serta produk unggulan dari setiap UMKM.",
  },
  {
    label: "03",
    title: "Dukung masyarakat lokal",
    description: "Beli produk, hubungi pemilik usaha, dan bantu ekonomi sekitar tumbuh bersama.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--font-heading)]">
      <section className="px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <div>
              <p className="inline-flex items-center rounded-full border border-[var(--line)] bg-[var(--card)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)] shadow-sm sm:text-xs">
                Tentang Sekawan Burengan
              </p>

              <h1 className="mt-5 max-w-xl text-4xl font-black tracking-tight text-[var(--font-heading)] sm:text-5xl lg:text-6xl">
                Membawa UMKM lokal lebih dekat dengan masyarakat.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                Sekawan Burengan hadir untuk memperkuat usaha lokal di Burengan dan sekitarnya.
                Kami menghubungkan pelaku UMKM dengan pelanggan yang mencari produk berkualitas,
                layanan yang dapat dipercaya, dan cerita bisnis yang mencerahkan komunitas sekitar.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/umkm"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--font-heading)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--font-heading-strong)]"
                >
                  Jelajahi UMKM
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--card)] px-6 py-3 text-sm font-semibold text-[var(--font-heading)] transition hover:border-[var(--header-strong)] hover:bg-[var(--bg-soft)]"
                >
                  Daftarkan Usaha
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-8 hidden h-20 w-20 rounded-2xl border border-[var(--line)] bg-[var(--card)] shadow-lg sm:block lg:-left-8 lg:top-12" />

              <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--card)] p-4 shadow-xl shadow-[rgba(107,75,33,0.08)] sm:p-6">
                <div className="overflow-hidden rounded-[1.5rem] bg-[var(--bg-soft)]">
                  <img
                    src="/hero/foto-tahu.jpg"
                    alt="UMKM lokal di Burengan"
                    className="h-[320px] w-full object-cover sm:h-[420px]"
                  />
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--bg-soft)] text-[var(--font-heading)]">
                      <Store size={20} />
                    </div>
                    <p className="mt-3 text-2xl font-bold text-[var(--ink)]">100+</p>
                    <p className="text-xs text-[var(--muted)]">UMKM terdaftar</p>
                  </div>

                  <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--bg-soft)] text-[var(--font-heading)]">
                      <MapPinned size={20} />
                    </div>
                    <p className="mt-3 text-2xl font-bold text-[var(--ink)]">Lokal</p>
                    <p className="text-xs text-[var(--muted)]">Di sekitar kita</p>
                  </div>

                  <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--bg-soft)] text-[var(--font-heading)]">
                      <Handshake size={20} />
                    </div>
                    <p className="mt-3 text-2xl font-bold text-[var(--ink)]">Bersama</p>
                    <p className="text-xs text-[var(--muted)]">Membangun ekonomi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Nilai Kami
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[var(--font-heading)] sm:text-4xl">
              Membangun ekosistem UMKM yang sehat dan berdampak
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-[1.75rem] border border-[var(--line)] bg-[var(--card)] p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-soft)] text-[var(--font-heading)]">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-[var(--font-heading)]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--card)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Cara Kerja
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[var(--font-heading)] sm:text-4xl">
              Langkah sederhana untuk mendorong pertumbuhan usaha lokal
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map(({ label, title, description }) => (
              <div
                key={label}
                className="rounded-[1.75rem] border border-[var(--line)] bg-[var(--bg)] p-6 shadow-sm"
              >
                <span className="inline-flex rounded-full border border-[var(--line)] bg-[var(--card)] px-2.5 py-1 text-xs font-bold text-[var(--muted)]">
                  {label}
                </span>
                <h3 className="mt-4 text-xl font-bold text-[var(--font-heading)]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-[var(--line)] bg-[var(--card)] px-6 py-8 shadow-lg sm:px-8 lg:px-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Komitmen Kami
              </p>
              <h2 className="mt-3 text-3xl font-bold text-[var(--font-heading)]">
                Dukung produk lokal, bangun ekonomi setempat.
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/umkm"
                className="inline-flex items-center justify-center rounded-xl bg-[var(--font-heading)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--font-heading-strong)]"
              >
                Lihat UMKM
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--bg)] px-5 py-3 text-sm font-semibold text-[var(--font-heading)] transition hover:bg-[var(--bg-soft)]"
              >
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
