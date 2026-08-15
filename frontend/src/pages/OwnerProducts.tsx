import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, Package, PencilLine, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import api from "../services/api";
import ModalDialog from "../components/ModalDialog";

interface Product {
  id: string;
  umkmId?: string;
  name: string;
  description: string | null;
  price: number | string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt?: string;
}

interface UMKMData {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function OwnerProducts() {
  const navigate = useNavigate();
  const [umkm, setUmkm] = useState<UMKMData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    type: "confirm" | "error";
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  } | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isFormVisible = showProductForm;

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setImageUrl("");
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setEditingProductId(null);
    setShowProductForm(false);
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const myUmkmResponse = await api.get("/umkms/me");
      const myUmkmData = myUmkmResponse.data?.data ?? myUmkmResponse.data;
      const myUmkm = myUmkmData as UMKMData;

      if (!myUmkm?.id) {
        setUmkm(null);
        setProducts([]);
        return;
      }

      setUmkm(myUmkm);

      const productsResponse = await api.get(`/products/umkm/${myUmkm.id}`);
      const payload = productsResponse.data;
      const normalizedProducts = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.data?.data)
            ? payload.data.data
            : [];

      setProducts(normalizedProducts as Product[]);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setUmkm(null);
        setProducts([]);
      } else {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message || "Gagal memuat produk"
          : "Terjadi kesalahan yang tidak terduga";

        setFormError(message);
        setModal({
          type: "error",
          title: "Gagal memuat data produk",
          message,
          confirmLabel: "Kembali ke dashboard",
          cancelLabel: "Tutup",
          onConfirm: () => {
            setModal(null);
            navigate("/owner/dashboard");
          },
          onCancel: () => setModal(null),
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // This fetch is triggered once when the owner page mounts and then updates local state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData();
  }, [loadData]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!umkm) {
      setFormError("UMKM belum tersedia");
      return;
    }

    if (!name.trim() || !price) {
      setFormError("Nama produk dan harga wajib diisi.");
      return;
    }

    setFormError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("umkmId", umkm.id);
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("price", String(Number(price)));
      formData.append("isActive", "true");

      if (imageFile) {
        formData.append("image", imageFile);
      } else if (imageUrl.trim()) {
        formData.append("imageUrl", imageUrl.trim());
      }

      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Produk berhasil diperbarui.");
      } else {
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Produk berhasil ditambahkan.");
      }

      setShowProductForm(false);
      resetForm();
      await loadData();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ||
          (editingProductId ? "Gagal memperbarui produk" : "Gagal menambahkan produk")
        : "Terjadi kesalahan yang tidak terduga";

      setFormError(message);
      setModal({
        type: "error",
        title: editingProductId ? "Gagal memperbarui produk" : "Gagal menambahkan produk",
        message,
        confirmLabel: "Kembali ke kelola produk",
        cancelLabel: "Tutup",
        onConfirm: () => {
          setModal(null);
          setShowProductForm(true);
        },
        onCancel: () => setModal(null),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setName(product.name);
    setDescription(product.description ?? "");
    setPrice(String(product.price));
    setImageUrl(product.imageUrl ?? "");
    setImageFile(null);
    setShowProductForm(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFormError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);

    if (file) {
      setImageUrl("");
    }
  };

  const performDeleteProduct = async (productId: string) => {
    try {
      await api.delete(`/products/${productId}`);
      if (editingProductId === productId) {
        resetForm();
      }
      setMessage("Produk berhasil dihapus.");
      setModal(null);
      await loadData();
    } catch (error) {
      setModal({
        type: "error",
        title: "Gagal menghapus produk",
        message: axios.isAxiosError(error)
          ? error.response?.data?.message || "Terjadi kesalahan saat menghapus produk."
          : "Terjadi kesalahan yang tidak terduga.",
        confirmLabel: "Kembali ke kelola produk",
        cancelLabel: "Tutup",
        onConfirm: () => {
          setModal(null);
          navigate("/owner/products");
        },
        onCancel: () => setModal(null),
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const target = products.find((item) => item.id === productId);
    setModal({
      type: "confirm",
      title: "Hapus produk",
      message: `Apakah Anda yakin ingin menghapus produk "${target?.name ?? "ini"}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmLabel: "Ya, hapus",
      cancelLabel: "Batal",
      onConfirm: () => {
        void performDeleteProduct(productId);
      },
      onCancel: () => setModal(null),
    });
  };

  const handleToggleProductStatus = async (product: Product) => {
    try {
      const nextStatus = !product.isActive;
      await api.put(`/products/${product.id}`, { isActive: nextStatus });

      setProducts((current) =>
        current.map((item) =>
          item.id === product.id ? { ...item, isActive: nextStatus } : item,
        ),
      );
      setMessage(
        `Status produk "${product.name}" diubah menjadi ${nextStatus ? "Aktif" : "Nonaktif"}.`,
      );
      setFormError("");
    } catch (error) {
      setModal({
        type: "error",
        title: "Gagal mengubah status",
        message: axios.isAxiosError(error)
          ? error.response?.data?.message || "Status produk gagal diperbarui."
          : "Terjadi kesalahan yang tidak terduga.",
        confirmLabel: "Kembali ke kelola produk",
        cancelLabel: "Tutup",
        onConfirm: () => {
          setModal(null);
          navigate("/owner/products");
        },
        onCancel: () => setModal(null),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-gray-500 animate-pulse">
          Memuat produk Anda...
        </div>
      </div>
    );
  }

  if (!umkm) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">UMKM belum dibuat</h1>
        <p className="mt-2 text-gray-600">
          Silakan daftarkan UMKM terlebih dahulu sebelum menambah produk.
        </p>
        <Link
          to="/owner/create-umkm"
          className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
        >
          Daftarkan UMKM
        </Link>
      </div>
    );
  }

  const totalProducts = products.length;
  const activeProducts = products.filter((product) => product.isActive).length;

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white pb-20">
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

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/owner/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
            >
              <ArrowLeft size={16} />
              Kembali ke Dasbor
            </Link>
            <h1 className="mt-3 text-3xl font-bold text-gray-900">Kelola Produk</h1>
            <p className="mt-1 text-sm text-gray-500">{umkm.name}</p>
          </div>
          <button
            type={isFormVisible ? "submit" : "button"}
            form={isFormVisible ? "product-form" : undefined}
            onClick={() => {
              if (!isFormVisible) {
                setShowProductForm(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6b4b21] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4f3218]"
          >
            <Plus size={16} />
            {isFormVisible ? "Simpan Produk" : "Tambah Produk"}
          </button>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e7d9c6] bg-[#fffdf9] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#7d6757]">Total Produk</span>
              <Package className="h-5 w-5 text-[#c78d55]" />
            </div>
            <p className="mt-4 text-3xl font-bold text-[#2d1d14]">{totalProducts}</p>
          </div>

          <div className="rounded-2xl border border-[#e7d9c6] bg-[#fffdf9] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#7d6757]">Produk Aktif</span>
              <span className="rounded-full bg-[#eaf5eb] px-2 py-1 text-[10px] font-semibold text-[#2e7d32]">
                Live
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-[#2d1d14]">{activeProducts}</p>
          </div>

          <div className="rounded-2xl border border-[#e7d9c6] bg-[#fffdf9] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#7d6757]">Kategori</span>
              <ImageIcon className="h-5 w-5 text-[#c78d55]" />
            </div>
            <p className="mt-4 text-lg font-bold text-[#2d1d14]">{umkm.category?.name || "UMKM"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[420px,1fr]">
          {showProductForm && (
            <form id="product-form" onSubmit={handleSubmit} className="rounded-2xl border border-[#e7d9c6] bg-[#fffdf9] p-6 shadow-sm ring-1 ring-[#f0e5d7]">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#2d1d14]">
                  {editingProductId ? "Edit Produk" : "Tambah Produk Baru"}
                </h2>
                {editingProductId && (
                  <span className="rounded-full bg-[#f2e7d7] px-2.5 py-1 text-[10px] font-semibold text-[#6b4b21]">
                    Mode edit
                  </span>
                )}
              </div>

              {formError && (
                <div className="mb-4 rounded-xl border border-[#f0c6c1] bg-[#fff2f0] p-3 text-sm text-[#b42318]">
                  {formError}
                </div>
              )}
              {message && (
                <div className="mb-4 rounded-xl border border-[#cfe8d3] bg-[#f1faf3] p-3 text-sm text-[#2e7d32]">
                  {message}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#4f3218]">Nama Produk</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#e7d9c6] bg-white p-3 text-sm text-[#2d1d14] outline-none transition focus:border-[#6b4b21] focus:ring-4 focus:ring-[#f1e0c7]"
                    placeholder="Contoh: Donut Coklat Lumer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#4f3218]">Harga (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#e7d9c6] bg-white p-3 text-sm text-[#2d1d14] outline-none transition focus:border-[#6b4b21] focus:ring-4 focus:ring-[#f1e0c7]"
                    placeholder="15000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#4f3218]">Deskripsi</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="mt-2 w-full resize-none rounded-xl border border-[#e7d9c6] bg-white p-3 text-sm text-[#2d1d14] outline-none transition focus:border-[#6b4b21] focus:ring-4 focus:ring-[#f1e0c7]"
                    placeholder="Jelaskan detail produkmu..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#4f3218]">
                    Foto Produk
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-2 block w-full rounded-xl border border-dashed border-[#d9c2a7] bg-[#f9f5f0] p-3 text-sm text-[#7d6757] file:mr-3 file:rounded-lg file:border-0 file:bg-[#6b4b21] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-[#4f3218]"
                  />
                  <p className="mt-2 text-xs text-[#7d6757]">
                    Upload file gambar untuk otomatis menyimpan URL Cloudinary ke database.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#4f3218]">
                    URL Gambar Manual (opsional)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(event) => setImageUrl(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#e7d9c6] bg-white p-3 text-sm text-[#2d1d14] outline-none transition focus:border-[#6b4b21] focus:ring-4 focus:ring-[#f1e0c7]"
                    placeholder="https://example.com/produk.jpg"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  {editingProductId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 rounded-xl border border-[#d9c2a7] bg-white px-4 py-3 text-sm font-semibold text-[#4f3218] transition hover:bg-[#f8f1e7]"
                    >
                      Batal
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`rounded-xl bg-[#6b4b21] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4f3218] disabled:cursor-not-allowed disabled:bg-[#c9b89d] ${editingProductId ? "flex-1" : "w-full"}`}
                  >
                    {isSubmitting
                      ? "Menyimpan..."
                      : editingProductId
                        ? "Perbarui Produk"
                        : "Simpan Produk"}
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="rounded-2xl border border-[#e7d9c6] bg-[#fffdf9] p-6 shadow-sm ring-1 ring-[#f0e5d7]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#2d1d14]">Daftar Produk</h2>
              <span className="rounded-full bg-[#f3ead9] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#6b4b21]">
                {totalProducts} item
              </span>
            </div>

            {products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#d9c2a7] bg-[#f9f5f0] p-10 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                  🛍️
                </div>
                <p className="text-base font-semibold text-[#2d1d14]">Belum ada produk</p>
                <p className="mt-2 text-sm text-[#7d6757]">
                  Tambahkan produk pertama Anda untuk mulai tampil di katalog UMKM.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {products.map((product) => (
                  <div key={product.id} className="overflow-hidden rounded-2xl border border-[#e7d9c6] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="relative aspect-4/3 bg-[#f3ead9]">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-4xl text-[#c78d55]">🛍️</div>
                      )}
                      <span className={`absolute right-3 top-3 rounded-full px-2 py-1 text-[10px] font-semibold ${product.isActive ? "bg-[#eaf5eb] text-[#2e7d32]" : "bg-[#f1eee8] text-[#7d6757]"}`}>
                        {product.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>

                    <div className="space-y-3 p-4">
                      <div>
                        <h3 className="text-base font-bold text-[#2d1d14]">{product.name}</h3>
                      </div>

                      <p className="text-sm font-semibold text-[#6b4b21]">
                        Rp {Number(product.price).toLocaleString("id-ID")}
                      </p>

                      <p className="line-clamp-3 text-sm text-[#7d6757]">
                        {product.description || "Belum ada deskripsi."}
                      </p>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => handleToggleProductStatus(product)}
                          className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
                            product.isActive
                              ? "border-[#cfe8d3] bg-[#f1faf3] text-[#2e7d32] hover:bg-[#e9f7ee]"
                              : "border-[#f0c6c1] bg-[#fff5f3] text-[#b42318] hover:bg-[#ffe9e5]"
                          }`}
                        >
                          {product.isActive ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditProduct(product)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#d9c2a7] bg-[#fffdf9] px-3 py-2.5 text-xs font-semibold text-[#4f3218] transition hover:bg-[#f8f1e7]"
                        >
                          <PencilLine size={14} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#f0c6c1] bg-[#fff5f3] px-3 py-2.5 text-xs font-semibold text-[#b42318] transition hover:bg-[#ffe9e5]"
                        >
                          <Trash2 size={14} />
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
