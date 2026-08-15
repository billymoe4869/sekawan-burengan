import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import axios from "axios";

// Cetak Biru untuk Produk dan Detail UMKM (disesuaikan dengan bentuk asli response backend)
interface Product {
  id: string;
  name: string;
  // Prisma Decimal diserialisasi backend sebagai string, bukan number
  price: string;
  description: string | null;
  imageUrl: string | null;
}

interface UMKMDetailData {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  address: string | null;
  imageUrl: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  owner: {
    id: string;
    name: string;
  };
  products: Product[];
}

// Ubah nomor lokal (mis. 08123456789) ke format internasional untuk link wa.me
function toWhatsAppNumber(phone: string) {
  const digitsOnly = phone.replace(/[^0-9]/g, "");
  if (digitsOnly.startsWith("0")) {
    return `62${digitsOnly.slice(1)}`;
  }
  return digitsOnly;
}

function formatRupiah(price: string) {
  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice)) return price;
  return `Rp ${numericPrice.toLocaleString("id-ID")}`;
}

export default function UMKMDetail() {
  // Menangkap ID dari URL (contoh: /umkm/123 -> id = "123")
  const { id } = useParams();

  const [umkm, setUmkm] = useState<UMKMDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchDetailUMKM = async () => {
      try {
        const response = await api.get(`/umkms/${id}`);
        setUmkm(response.data.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setErrorMsg("UMKM tidak ditemukan.");
          } else {
            setErrorMsg(
              error.response?.data?.message || "Gagal memuat detail UMKM",
            );
          }
        } else {
          setErrorMsg("Terjadi kesalahan sistem");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDetailUMKM();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-500 animate-pulse">
          Memuat Profil UMKM...
        </div>
      </div>
    );
  }

  if (errorMsg || !umkm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50 px-4">
        <span className="text-6xl mb-4">🏚️</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
        <p className="text-gray-600 mb-6">
          {errorMsg || "UMKM tidak ditemukan"}
        </p>
        <Link
          to="/umkm"
          className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800"
        >
          &larr; Kembali ke Daftar UMKM
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      {/* 1. HERO SECTION (FOTO & INFO UTAMA) */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Foto UMKM */}
            <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm shrink-0">
              {umkm.imageUrl ? (
                <img
                  src={umkm.imageUrl}
                  alt={umkm.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-6xl">
                  🏪
                </div>
              )}
            </div>

            {/* Info UMKM */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 text-xs font-bold tracking-wide text-blue-700 uppercase bg-blue-100 rounded-full">
                  {umkm.category.name}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                {umkm.name}
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Dikelola oleh {umkm.owner.name}
              </p>

              <div className="mt-6 space-y-4 text-gray-600">
                <p className="text-base leading-relaxed">
                  {umkm.description || "Belum ada deskripsi untuk UMKM ini."}
                </p>
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                  {umkm.address && (
                    <div className="flex items-start gap-3">
                      <span className="text-xl">📍</span>
                      <p>{umkm.address}</p>
                    </div>
                  )}

                  {umkm.phone && (
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📞</span>
                      <p className="font-semibold text-gray-900">
                        {umkm.phone}
                      </p>
                      <a
                        href={`https://wa.me/${toWhatsAppNumber(umkm.phone)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                      >
                        Chat WA
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DAFTAR PRODUK SECTION */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Produk & Layanan
        </h2>

        {umkm.products.length === 0 ? (
          <div className="p-10 text-center bg-white border border-dashed border-gray-300 rounded-2xl">
            <span className="text-4xl">🛍️</span>
            <p className="mt-4 text-gray-500 font-medium">
              Belum ada produk yang ditambahkan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {umkm.products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-4xl">
                      📦
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-lg font-extrabold text-blue-600">
                    {formatRupiah(product.price)}
                  </p>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {product.description || "Tidak ada deskripsi."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
