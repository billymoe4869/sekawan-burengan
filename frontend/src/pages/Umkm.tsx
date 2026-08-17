import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../services/api";
import axios from "axios";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface UMKMListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  category: Category;
}

interface PaginationMeta {
  totalData: number;
  currentPage: number;
  limit: number;
  totalPage: number;
}

interface UMKMProps {
  initialSearch?: string;
}

const LIMIT = 9;

export default function UMKM({ initialSearch = "" }: UMKMProps) {
  // State untuk menyimpan data dari API
  const [umkms, setUmkms] = useState<UMKMListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // State input pencarian (mentah, langsung terikat ke <input>)
  const [searchInput, setSearchInput] = useState(() => initialSearch);
  // State pencarian yang sudah di-debounce, ini yang benar-benar dipakai untuk fetch
  const [searchTerm, setSearchTerm] = useState(() => initialSearch);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const categoryListRef = useRef<HTMLDivElement | null>(null);

  const scrollCategories = (direction: "left" | "right") => {
    const container = categoryListRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // 1. Ambil daftar kategori sekali saja saat halaman dibuka (untuk tombol filter)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data.data);
      } catch {
        // Kegagalan memuat kategori tidak fatal, filter cukup jadi "Semua" saja
      }
    };

    fetchCategories();
  }, []);

  // 2. Debounce: tunggu 400ms setelah user berhenti mengetik, baru update searchTerm
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1); // pencarian baru selalu balik ke halaman 1
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // 3. Ambil daftar UMKM setiap kali pencarian / kategori / halaman berubah
  useEffect(() => {
    const controller = new AbortController();

    const fetchPublicUMKMs = async () => {
      setIsLoading(true);
      setErrorMsg("");

      try {
        // Filter & paginasi dilakukan di backend lewat query params
        const response = await api.get("/umkms", {
          signal: controller.signal,
          params: {
            page,
            limit: LIMIT,
            search: searchTerm || undefined,
            categoryId: selectedCategoryId || undefined,
          },
        });

        // PENTING: backend membungkus hasil sebagai { data: { data: [...], meta: {...} } }
        setUmkms(response.data.data.data);
        setMeta(response.data.data.meta);
      } catch (error) {
        if (axios.isCancel(error)) return;

        if (axios.isAxiosError(error)) {
          setErrorMsg(
            error.response?.data?.message || "Gagal memuat daftar UMKM",
          );
        } else {
          setErrorMsg("Terjadi kesalahan yang tidak terduga");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicUMKMs();

    return () => controller.abort();
  }, [searchTerm, selectedCategoryId, page]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setPage(1);
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      {/* HEADER & PENCARIAN */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-900">Eksplorasi UMKM</h1>
          <p className="mt-2 text-gray-500">
            Temukan layanan dan produk lokal terbaik di Kediri.
          </p>

          <div className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center">
            <div className="w-full xl:flex-1">
              <input
                type="text"
                placeholder="Cari nama UMKM..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-base text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 md:h-14 md:text-lg"
              />
            </div>

            <div className="flex w-full items-center gap-2 xl:w-auto xl:max-w-[60%]">
              <button
                type="button"
                onClick={() => scrollCategories("left")}
                aria-label="Geser kategori ke kiri"
                className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 md:flex"
              >
                <ChevronLeft size={18} />
              </button>

              <div
                ref={categoryListRef}
                className="w-full overflow-x-auto pb-1 md:pb-0 md:[&::-webkit-scrollbar]:hidden"
              >
                <div className="flex min-w-max items-center gap-2 whitespace-nowrap sm:gap-3">
                  <button
                    onClick={() => handleCategoryChange("")}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors md:px-5 md:py-3.5 ${
                      selectedCategoryId === ""
                        ? "bg-gray-900 text-white"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Semua
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors md:px-5 md:py-3.5 ${
                        selectedCategoryId === cat.id
                          ? "bg-gray-900 text-white"
                          : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => scrollCategories("right")}
                aria-label="Geser kategori ke kanan"
                className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 md:flex"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TAMPILAN ERROR ATAU LOADING */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading && (
          <div className="text-center py-20 text-gray-500 font-semibold animate-pulse">
            Memuat daftar UMKM...
          </div>
        )}

        {!isLoading && errorMsg && (
          <div className="text-center py-10 text-red-600 bg-red-50 rounded-lg border border-red-200">
            {errorMsg}
          </div>
        )}

        {/* KONDISI JIKA DATA KOSONG */}
        {!isLoading && !errorMsg && umkms.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl">🔍</span>
            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Tidak ada hasil ditemukan
            </h3>
            <p className="text-gray-500 mt-2">
              Coba gunakan kata kunci pencarian atau kategori lain.
            </p>
          </div>
        )}

        {/* GRID KARTU UMKM */}
        {!isLoading && !errorMsg && umkms.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {umkms.map((umkm) => (
                <div
                  key={umkm.id}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  <div className="aspect-4/3 w-full overflow-hidden bg-gray-100 relative">
                    {umkm.imageUrl ? (
                      <img
                        src={umkm.imageUrl}
                        alt={umkm.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-4xl">
                        🏪
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                        {umkm.name}
                      </h3>
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full whitespace-nowrap">
                        {umkm.category.name}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-6 line-clamp-2 flex-1">
                      {umkm.description || "Belum ada deskripsi."}
                    </p>

                    <Link
                      to={`/umkm/${umkm.id}`}
                      className="block w-full py-2.5 text-center text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:scale-[0.98] transition-all"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINASI */}
            {meta && meta.totalPage > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-4 py-2 text-sm font-semibold bg-white border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  &larr; Sebelumnya
                </button>

                <span className="text-sm text-gray-600 font-medium">
                  Halaman {meta.currentPage} dari {meta.totalPage}
                </span>

                <button
                  onClick={() =>
                    setPage((p) => Math.min(meta.totalPage, p + 1))
                  }
                  disabled={page >= meta.totalPage}
                  className="px-4 py-2 text-sm font-semibold bg-white border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Selanjutnya &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
