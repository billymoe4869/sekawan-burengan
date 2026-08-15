import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import api from "../services/api";

interface ProductResult {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  imageUrl: string | null;
  umkm: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    category: {
      id: string;
      name: string;
      slug: string;
    } | null;
  };
}

interface ProductMeta {
  totalData: number;
  currentPage: number;
  limit: number;
  totalPage: number;
}

const LIMIT = 12;

export default function Product() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(search);
  const [products, setProducts] = useState<ProductResult[]>([]);
  const [meta, setMeta] = useState<ProductMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setIsLoading(true);
      setErrorMsg("");

      try {
        const response = await api.get("/products", {
          signal: controller.signal,
          params: {
            page,
            limit: LIMIT,
            search: search || undefined,
          },
        });

        setProducts(response.data.data.data);
        setMeta(response.data.data.meta);
      } catch (error) {
        if (axios.isCancel(error)) return;

        if (axios.isAxiosError(error)) {
          setErrorMsg(
            error.response?.data?.message || "Gagal memuat produk yang dicari",
          );
        } else {
          setErrorMsg("Terjadi kesalahan yang tidak terduga");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [search, page]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const keyword = searchInput.trim();
    if (!keyword) {
      setSearchInput("");
      setPage(1);
      setSearchParams({});
      return;
    }

    setSearchInput(keyword);
    setPage(1);
    setSearchParams({ search: keyword });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Cari Produk
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            {search ? `Hasil pencarian: “${search}”` : "Temukan produk lokal terbaik"}
          </h1>

          <form onSubmit={handleSubmit} className="mt-6 max-w-2xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Cari produk atau nama UMKM..."
                className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
              />
              <button
                type="submit"
                className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Cari
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="py-20 text-center text-sm font-semibold text-gray-500">
            Memuat produk...
          </div>
        )}

        {!isLoading && errorMsg && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMsg}
          </div>
        )}

        {!isLoading && !errorMsg && products.length === 0 && (
          <div className="py-20 text-center">
            <div className="text-5xl">🔎</div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Produk tidak ditemukan
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Coba kata kunci lain atau kembali ke halaman UMKM.
            </p>
          </div>
        )}

        {!isLoading && !errorMsg && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="aspect-[4/3] w-full bg-gray-100">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl">
                        🛍️
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                        {product.umkm.category?.name || "Produk"}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        Rp {Number(product.price).toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                        {product.description || "Belum ada deskripsi produk."}
                      </p>
                    </div>

                    <div className="text-xs text-gray-500">
                      <span className="font-semibold text-gray-700">UMKM:</span> {product.umkm.name}
                    </div>

                    <Link
                      to={`/umkm/${product.umkm.id}`}
                      className="inline-flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                    >
                      Lihat UMKM
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {meta && meta.totalPage > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Sebelumnya
                </button>

                <span className="text-sm text-gray-600">
                  Halaman {meta.currentPage} / {meta.totalPage}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(meta.totalPage, prev + 1))}
                  disabled={page >= meta.totalPage}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
