import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import axios from "axios";

interface Category {
  id: string;
  name: string;
  slug: string;
}

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB, samakan dengan limit multer di backend

// Ubah nama UMKM jadi slug URL-friendly, mis. "Toko Donat & Kue" -> "toko-donat-kue"
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

export default function CreateUMKM() {
  // Sedang mengecek apakah owner ini sudah punya UMKM sebelumnya (backend: 1 owner = 1 UMKM)
  const [isCheckingExisting, setIsCheckingExisting] = useState(true);

  // Daftar kategori (diambil dari backend, bukan hardcode)
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // 1. State untuk menyimpan data form
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // State khusus untuk gambar (Satu untuk file aslinya, satu untuk URL preview)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // State untuk status pengiriman
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  // Cek dulu: kalau owner sudah punya UMKM, jangan biarkan daftar lagi -> lempar ke dasbor
  useEffect(() => {
    const checkExistingUMKM = async () => {
      try {
        await api.get("/umkms/me");
        // Berhasil (200) artinya sudah punya UMKM
        navigate("/owner/dashboard", { replace: true });
      } catch {
        // 404 (belum punya UMKM) atau error lain -> tetap izinkan mengisi form
        setIsCheckingExisting(false);
      }
    };

    checkExistingUMKM();
  }, [navigate]);

  // Ambil daftar kategori untuk dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data.data);
      } catch {
        setErrorMsg(
          "Gagal memuat daftar kategori. Silakan muat ulang halaman.",
        );
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // 2. Fungsi untuk menangani saat user memilih gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("File harus berupa gambar (JPG, PNG, atau WEBP).");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrorMsg("Ukuran gambar maksimal 2MB.");
      return;
    }

    setErrorMsg("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Nama UMKM diketik -> slug otomatis mengikuti, kecuali user sudah edit slug manual
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

  // 3. Fungsi saat tombol "Kirim Pendaftaran" ditekan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (!imageFile) {
      setErrorMsg("Mohon unggah foto utama UMKM Anda.");
      setIsLoading(false);
      return;
    }

    if (!categoryId) {
      setErrorMsg("Mohon pilih kategori UMKM Anda.");
      setIsLoading(false);
      return;
    }

    if (!slug) {
      setErrorMsg("Slug tidak boleh kosong.");
      setIsLoading(false);
      return;
    }

    try {
      // BUNGKUS DATA MENGGUNAKAN FORMDATA
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("categoryId", categoryId);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append("description", description);
      if (latitude) formData.append("latitude", latitude);
      if (longitude) formData.append("longitude", longitude);
      formData.append("image", imageFile); // 'image' harus sama dengan nama field di upload.single('image') backend

      // Kirim ke backend dengan header khusus multipart/form-data
      await api.post("/umkms", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMsg("UMKM berhasil didaftarkan! Mengalihkan ke dasbor...");

      setTimeout(() => {
        navigate("/owner/dashboard");
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMsg(error.response?.data?.message || "Gagal mendaftarkan UMKM");
      } else {
        setErrorMsg("Terjadi kesalahan yang tidak terduga");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Tampilan sementara saat masih mengecek status pendaftaran owner
  if (isCheckingExisting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-500 animate-pulse">
          Memeriksa status pendaftaran Anda...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <div className="max-w-3xl px-4 py-10 mx-auto sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/owner/dashboard"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            &larr; Kembali ke Dasbor
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Daftarkan UMKM Baru
          </h1>
          <p className="mt-1 text-gray-500">
            Lengkapi data di bawah ini untuk mendaftarkan usaha Anda.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 bg-white border border-gray-200 shadow-sm sm:p-8 rounded-2xl"
        >
          {/* Notifikasi Error & Sukses */}
          {errorMsg && (
            <div className="p-3 mb-6 text-sm text-red-700 bg-red-100 rounded-lg">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 mb-6 text-sm text-green-700 bg-green-100 rounded-lg">
              {successMsg}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Input Nama UMKM */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">
                Nama UMKM / Toko
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Contoh: Toko Donut Kediri"
                className="w-full p-3 mt-2 text-base transition-all bg-white border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-4 focus:ring-black/10"
              />
            </div>

            {/* Input Slug (URL) - otomatis dari nama, tapi bisa diedit manual */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">
                Slug (URL)
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="toko-donut-kediri"
                className="w-full p-3 mt-2 text-base font-mono transition-all bg-white border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-4 focus:ring-black/10"
              />
              <p className="mt-1 text-xs text-gray-500">
                Otomatis dibuat dari nama UMKM. Harus unik, boleh diubah manual.
              </p>
            </div>

            {/* Input Kategori */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Kategori
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={isLoadingCategories || categories.length === 0}
                className="w-full p-3 mt-2 text-base transition-all bg-white border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-4 focus:ring-black/10 disabled:bg-gray-100"
              >
                <option value="">
                  {isLoadingCategories
                    ? "Memuat kategori..."
                    : categories.length === 0
                      ? "Belum ada kategori tersedia"
                      : "Pilih Kategori..."}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {!isLoadingCategories && categories.length === 0 && (
                <p className="mt-1 text-xs text-red-500">
                  Belum ada kategori. Hubungi admin untuk menambahkannya
                  terlebih dahulu.
                </p>
              )}
            </div>

            {/* Input Nomor HP */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Nomor Telepon/WhatsApp
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 08123456789"
                className="w-full p-3 mt-2 text-base transition-all bg-white border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-4 focus:ring-black/10"
              />
            </div>

            {/* Input Alamat */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">
                Alamat Lengkap
              </label>
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Contoh: Jl. Panglima Sudirman No. 123, Kota Kediri"
                className="w-full p-3 mt-2 text-base transition-all bg-white border border-gray-300 rounded-lg outline-none resize-none focus:border-black focus:ring-4 focus:ring-black/10"
              ></textarea>
            </div>

            {/* Input Titik Lokasi (opsional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Latitude{" "}
                <span className="font-normal text-gray-400">(opsional)</span>
              </label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Contoh: -7.8166"
                className="w-full p-3 mt-2 text-base transition-all bg-white border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-4 focus:ring-black/10"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Longitude{" "}
                <span className="font-normal text-gray-400">(opsional)</span>
              </label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Contoh: 112.0138"
                className="w-full p-3 mt-2 text-base transition-all bg-white border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-4 focus:ring-black/10"
              />
            </div>

            {/* Input Deskripsi */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">
                Deskripsi Usaha
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ceritakan tentang usaha Anda, produk unggulan, dll."
                className="w-full p-3 mt-2 text-base transition-all bg-white border border-gray-300 rounded-lg outline-none resize-none focus:border-black focus:ring-4 focus:ring-black/10"
              ></textarea>
            </div>

            {/* Input Foto (Image Upload) */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">
                Foto Utama UMKM
              </label>
              <div className="flex flex-col items-center justify-center p-6 mt-2 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50">
                {imagePreview ? (
                  <div className="relative w-full max-w-sm">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="object-cover w-full h-48 rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="absolute px-3 py-1 text-sm font-bold text-white bg-red-600 rounded-md top-2 right-2 hover:bg-red-700"
                    >
                      Ganti Foto
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="text-4xl">📸</span>
                    <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                      <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                        <span>Upload file gambar</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG, atau WEBP (Maks. 2MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 mt-8 border-t border-gray-100 flex justify-end gap-3">
            <Link
              to="/owner/dashboard"
              className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={
                isLoading || isLoadingCategories || categories.length === 0
              }
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
            >
              {isLoading ? "Mengunggah..." : "Kirim Pendaftaran"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
