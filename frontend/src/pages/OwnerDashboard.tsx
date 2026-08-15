import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import axios from "axios";

interface UMKMData {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  phone: string | null;
  status: "Pending" | "Published" | "Rejected" | "Suspended" | string;
  imageUrl?: string | null;
}

export default function OwnerDashboard() {
  const [umkm, setUmkm] = useState<UMKMData | null>(null);
  const [productCount, setProductCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchMyUMKM = async () => {
      try {
        const response = await api.get("/umkms/me");
        const myUmkm = response.data?.data ?? response.data;
        setUmkm(myUmkm);

        if (myUmkm?.id) {
          const productsResponse = await api.get(`/products/umkm/${myUmkm.id}`);
          const payload = productsResponse.data;
          const products = Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.data)
              ? payload.data
              : Array.isArray(payload?.data?.data)
                ? payload.data.data
                : [];

          setProductCount(Array.isArray(products) ? products.length : 0);
        } else {
          setProductCount(0);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setUmkm(null);
            setProductCount(0);
          } else {
            setErrorMsg(
              error.response?.data?.message || "Gagal memuat data UMKM",
            );
          }
        } else {
          setErrorMsg("Terjadi kesalahan yang tidak terduga");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyUMKM();
  }, []);

  // 3. TAMPILAN SAAT LOADING
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-500 animate-pulse">
          Memuat Dasbor...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <div className="max-w-5xl px-4 py-10 mx-auto sm:px-6 lg:px-8">
        {/* HEADER DASBOR */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dasbor Owner</h1>
            <p className="mt-1 text-gray-500">
              Kelola informasi dan visibilitas usaha Anda di sini.
            </p>
          </div>
        </div>

        {/* Notifikasi Error jika ada masalah koneksi */}
        {errorMsg && (
          <div className="p-4 mt-6 text-red-700 bg-red-100 rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* 4. KONDISI 1: JIKA OWNER BELUM PUNYA UMKM */}
        {!umkm && !errorMsg && (
          <div className="flex flex-col items-center justify-center p-12 mt-8 text-center bg-white border border-dashed border-gray-300 rounded-2xl">
            <span className="text-5xl">🏪</span>
            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Anda belum mendaftarkan UMKM
            </h2>
            <p className="mt-2 text-gray-500 max-w-md">
              Mari mulai perjalanan Anda dengan menambahkan detail toko, foto,
              dan lokasi agar bisa ditemukan oleh warga Kediri.
            </p>
            <Link
              to="/owner/create-umkm"
              className="px-6 py-3 mt-6 font-semibold text-white transition-colors bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 active:scale-[0.98]"
            >
              + Daftarkan UMKM Sekarang
            </Link>
          </div>
        )}

        {/* 5. KONDISI 2: JIKA UMKM SUDAH ADA, TAMPILKAN DATANYA */}
        {umkm && (
          <>
            <div className="p-6 mt-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
               <div className="flex items-center gap-4">
                  {umkm.imageUrl && (
                    <img
                      src={umkm.imageUrl}
                      alt={umkm.name}
                      className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{umkm.name}</h2>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm text-gray-500">Status visibilitas:</span>

                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          umkm.status === "Published"
                            ? "bg-green-100 text-green-800"
                            : umkm.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {umkm.status || "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link
                    to="/owner/products"
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                  >
                    + Kelola Produk
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Total Produk</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{productCount}</p>
                <Link
                  to="/owner/products"
                  className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
                >
                  Kelola Produk &rarr;
                </Link>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Kategori Toko</p>
                <p className="mt-2 text-xl font-bold text-gray-900">
                  {umkm.category?.name || "-"}
                </p>
                <p className="mt-5 text-sm text-gray-500">Sesuai pendaftaran</p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Nomor Kontak</p>
                <p className="mt-2 text-lg font-bold text-gray-900">
                  {umkm.phone || "Belum diisi"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
