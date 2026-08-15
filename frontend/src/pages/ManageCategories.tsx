import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import ModalDialog from "../components/ModalDialog";

interface Category {
  id: string;
  name: string;
  slug: string;
}

// Helper untuk mengambil kategori dari backend.
// Fungsi ini TIDAK melakukan setState.
const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories");
  return response.data.data;
};

// Ubah nama kategori menjadi slug URL-friendly.
// Contoh: "Kriya & Kerajinan" -> "kriya-kerajinan"
function slugify(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  // true karena halaman pertama kali dibuka memang sedang loading
  const [isLoading, setIsLoading] = useState(true);

  const [errorMsg, setErrorMsg] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formErrorMsg, setFormErrorMsg] = useState("");
  const [modal, setModal] = useState<{
    type: "confirm" | "error";
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  } | null>(null);

  /* =====================================================
     INITIAL LOAD
     ===================================================== */

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const data = await getCategories();

        if (!isMounted) {
          return;
        }

        setCategories(data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (axios.isAxiosError(error)) {
          setErrorMsg(
            error.response?.data?.message || "Gagal memuat daftar kategori",
          );
        } else {
          setErrorMsg("Terjadi kesalahan yang tidak terduga");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  /* =====================================================
     FORM
     ===================================================== */

  const handleNameChange = (value: string) => {
    setName(value);

    if (!isSlugManuallyEdited) {
      setSlug(slugify(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setIsSlugManuallyEdited(true);
    setSlug(slugify(value));
  };

  const refreshCategories = async () => {
    setIsLoading(true);
    setErrorMsg("");

    try {
     const data = await getCategories();
     setCategories(data);
    } catch (error) {
     if (axios.isAxiosError(error)) {
       setErrorMsg(
         error.response?.data?.message || "Gagal memuat daftar kategori",
       );
     } else {
       setErrorMsg("Terjadi kesalahan yang tidak terduga");
     }
    } finally {
     setIsLoading(false);
    }
  };

  /* =====================================================
     CREATE CATEGORY
     ===================================================== */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setFormErrorMsg("");

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();

    if (!trimmedName || !trimmedSlug) {
      setFormErrorMsg("Nama dan slug kategori wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/categories", {
        name: trimmedName,
        slug: trimmedSlug,
      });

      setName("");
      setSlug("");
      setIsSlugManuallyEdited(false);

      await refreshCategories();
      setModal({
        type: "confirm",
        title: "Kategori berhasil ditambahkan",
        message: `Kategori "${trimmedName}" berhasil dibuat.`,
        confirmLabel: "OK",
        cancelLabel: "Tutup",
        onConfirm: () => setModal(null),
        onCancel: () => setModal(null),
      });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Gagal menambahkan kategori"
        : "Terjadi kesalahan yang tidak terduga";

      setFormErrorMsg(errorMessage);
      setModal({
        type: "error",
        title: "Gagal menambahkan kategori",
        message: errorMessage,
        confirmLabel: "Coba lagi",
        cancelLabel: "Tutup",
        onConfirm: () => setModal(null),
        onCancel: () => setModal(null),
      });
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  /* =====================================================
     DELETE CATEGORY
     ===================================================== */

  const handleDeleteCategory = async (id: string) => {
    const target = categories.find((cat) => cat.id === id);
    setModal({
     type: "confirm",
     title: "Hapus kategori",
     message: `Apakah Anda yakin ingin menghapus kategori "${target?.name ?? "ini"}"? Tindakan ini tidak dapat dibatalkan.`,
     confirmLabel: "Ya, hapus",
     cancelLabel: "Batal",
     onConfirm: async () => {
       setDeletingId(id);
       setErrorMsg("");
       setFormErrorMsg("");

       try {
         await api.delete(`/categories/${id}`);
         await refreshCategories();
         setModal({
           type: "confirm",
           title: "Berhasil",
           message: `Kategori "${target?.name ?? "Kategori"}" berhasil dihapus.`,
           confirmLabel: "OK",
           cancelLabel: "Tutup",
           onConfirm: () => setModal(null),
           onCancel: () => setModal(null),
         });
       } catch (error) {
         const message = axios.isAxiosError(error)
           ? error.response?.data?.message || "Gagal menghapus kategori"
           : "Terjadi kesalahan yang tidak terduga";

         setErrorMsg(message);
         setModal({
           type: "error",
           title: "Gagal menghapus kategori",
           message,
           confirmLabel: "Coba lagi",
           cancelLabel: "Tutup",
           onConfirm: () => setModal(null),
           onCancel: () => setModal(null),
         });
       } finally {
         setDeletingId(null);
       }
     },
     onCancel: () => setModal(null),
    });

  };

  /* =====================================================
     UI
     ===================================================== */

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
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

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin/dashboard"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            &larr; Kembali ke Dasbor
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Kelola Kategori
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* =================================================
              FORM TAMBAH KATEGORI
          ================================================== */}
          <div className="md:col-span-1">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Tambah Kategori
              </h2>

              {formErrorMsg && (
                <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
                  {formErrorMsg}
                </div>
              )}

              <div className="flex flex-col gap-4">
                {/* Nama */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Nama Kategori
                  </label>

                  <input
                    type="text"
                    placeholder="Contoh: Otomotif"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-black focus:ring-2"
                    required
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Slug
                  </label>

                  <input
                    type="text"
                    placeholder="otomotif"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-300 p-3 font-mono outline-none transition focus:border-black focus:ring-2"
                    required
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Otomatis dibuat dari nama, boleh diubah manual.
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {isSubmitting ? "Menyimpan..." : "+ Tambah Data"}
                </button>
              </div>
            </form>
          </div>

          {/* =================================================
              DAFTAR KATEGORI
          ================================================== */}
          <div className="md:col-span-2">
            {errorMsg && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-100 p-4 text-red-700">
                {errorMsg}
              </div>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                        Nama Kategori
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                        Slug
                      </th>

                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {/* Loading */}
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="animate-pulse px-6 py-8 text-center text-gray-500"
                        >
                          Memuat data...
                        </td>
                      </tr>
                    ) : categories.length === 0 ? (
                      /* Empty */
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          Belum ada kategori. Tambahkan lewat form di samping.
                        </td>
                      </tr>
                    ) : (
                      /* Data */
                      categories.map((cat) => (
                        <tr
                          key={cat.id}
                          className="transition hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">
                            {cat.name}
                          </td>

                          <td className="px-6 py-4 font-mono text-sm text-gray-500">
                            {cat.slug}
                          </td>

                          <td className="px-6 py-4 text-right text-sm">
                            <button
                              type="button"
                              disabled={deletingId === cat.id}
                              onClick={() => handleDeleteCategory(cat.id)}
                              className={`font-semibold ${
                                deletingId === cat.id
                                  ? "cursor-not-allowed text-gray-400"
                                  : "text-red-600 hover:text-red-700"
                              }`}
                            >
                              {deletingId === cat.id ? "Menghapus..." : "Hapus"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
