import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import ModalDialog from "../components/ModalDialog";

// 1. Cetak Biru untuk data UMKM yang masuk
interface PendingUMKM {
  id: string;
  name: string;
  status: "Pending" | "Published" | "Rejected" | "Suspended";
  createdAt: string;

  owner: {
    id: string;
    name: string;
    email: string;
  };

  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface PaginationMeta {
  totalData: number;
  currentPage: number;
  limit: number;
  totalPage: number;
}

export default function AdminDashboard() {
  const [pendingUmkms, setPendingUmkms] = useState<PendingUMKM[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [modal, setModal] = useState<{
    type: "confirm" | "error";
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  } | null>(null);

  // 2. Fetch data UMKM yang masih Pending
  useEffect(() => {
    const controller = new AbortController();

    const fetchPendingUMKMs = async () => {
      setIsLoading(true);
      setErrorMsg("");

      try {
        const response = await api.get("/admin/umkms", {
          signal: controller.signal,
          params: {
            status: "Pending",
            page,
          },
        });

        // PENTING: backend membungkus hasil sebagai { data: { data: [...], meta: {...} } }
        setPendingUmkms(response.data.data.data);
        setMeta(response.data.data.meta);
      } catch (error) {
        if (axios.isCancel(error)) return;

        if (axios.isAxiosError(error)) {
          setErrorMsg(
            error.response?.data?.message || "Gagal memuat data persetujuan",
          );
        } else {
          setErrorMsg("Terjadi kesalahan yang tidak terduga");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingUMKMs();

    return () => controller.abort();
  }, [page]);

  // 3. Fungsi untuk menyetujui atau menolak UMKM
  const handleVerify = async (id: string, action: "Published" | "Rejected") => {
    const confirmMessage =
      action === "Published"
        ? "Apakah Anda yakin ingin MENYETUJUI UMKM ini?"
        : "Apakah Anda yakin ingin MENOLAK UMKM ini?";

    setModal({
      type: "confirm",
      title: action === "Published" ? "Verifikasi UMKM" : "Tolak UMKM",
      message: confirmMessage,
      confirmLabel: action === "Published" ? "Ya, setujui" : "Ya, tolak",
      cancelLabel: "Batal",
      onConfirm: async () => {
        try {
          await api.patch(`/admin/umkms/${id}/status`, { status: action });
          setPendingUmkms((prev) => prev.filter((umkm) => umkm.id !== id));
          setMeta((prev) =>
            prev ? { ...prev, totalData: prev.totalData - 1 } : prev,
          );
          setModal({
            type: "confirm",
            title: "Berhasil",
            message: `UMKM berhasil di-${action === "Published" ? "setujui" : "tolak"}!`,
            confirmLabel: "OK",
            cancelLabel: "Tutup",
            onConfirm: () => setModal(null),
            onCancel: () => setModal(null),
          });
        } catch (error) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || "Gagal memproses verifikasi"
            : "Terjadi kesalahan sistem";

          setModal({
            type: "error",
            title: "Gagal memproses verifikasi",
            message,
            confirmLabel: "Coba lagi",
            cancelLabel: "Tutup",
            onConfirm: () => setModal(null),
            onCancel: () => setModal(null),
          });
        }
      },
      onCancel: () => setModal(null),
    });
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <ModalDialog
        isOpen={Boolean(modal)}
        type={modal?.type ?? "confirm"}
        title={modal?.title ?? ""}
        message={modal?.message ?? ""}
        confirmLabel={modal?.confirmLabel}
        cancelLabel={modal?.cancelLabel}
        onConfirm={() => {
          modal?.onConfirm?.();
        }}
        onCancel={() => {
          modal?.onCancel?.();
          setModal(null);
        }}
      />
      <div className="max-w-6xl px-4 py-10 mx-auto sm:px-6 lg:px-8">
        {/* HEADER DASBOR ADMIN */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dasbor Admin</h1>
            <p className="mt-1 text-gray-500">
              Pusat kendali Direktori UMKM Kota Kediri
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/categories"
              className="px-4 py-2 text-sm font-semibold text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
            >
              📂 Kelola Kategori
            </Link>
          </div>
        </div>

        {/* GRID STATISTIK (Disederhanakan untuk fokus ke tabel) */}
        <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-3">
          <div className="p-6 bg-blue-50 border border-blue-100 shadow-sm rounded-2xl relative overflow-hidden sm:col-span-3 lg:col-span-1 lg:col-start-2">
            <div className="relative z-10 text-center">
              <p className="text-sm font-medium text-blue-800">
                Menunggu Persetujuan
              </p>
              <p className="mt-2 text-4xl font-bold text-blue-900">
                {meta ? meta.totalData : pendingUmkms.length}
              </p>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">
              🔔
            </div>
          </div>
        </div>

        {/* TABEL APPROVAL UMKM */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Perlu Persetujuan (Pending)
            </h2>
          </div>

          {errorMsg && (
            <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg border border-red-200">
              {errorMsg}
            </div>
          )}

          <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Nama UMKM
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Pemilik
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Kategori
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-gray-500 animate-pulse"
                      >
                        Memuat data...
                      </td>
                    </tr>
                  ) : pendingUmkms.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <span className="text-4xl block mb-3">🎉</span>
                        Tidak ada UMKM yang menunggu persetujuan saat ini.
                      </td>
                    </tr>
                  ) : (
                    pendingUmkms.map((umkm) => (
                      <tr
                        key={umkm.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          {umkm.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {umkm.owner?.name || "Tidak diketahui"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span className="px-2.5 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg">
                            {umkm.category?.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => handleVerify(umkm.id, "Published")}
                            className="px-3 py-1.5 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => handleVerify(umkm.id, "Rejected")}
                            className="px-3 py-1.5 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                          >
                            Tolak
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINASI */}
          {meta && meta.totalPage > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
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
                onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
                disabled={page >= meta.totalPage}
                className="px-4 py-2 text-sm font-semibold bg-white border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Selanjutnya &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
