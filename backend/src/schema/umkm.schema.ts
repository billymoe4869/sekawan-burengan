import { z } from "zod";

/* =========================================================
   CREATE UMKM
   POST /api/umkms
   ========================================================= */

export const UMKMschema = z.object({
  body: z.object({
    categoryId: z.string().min(1, "kategori UMKM wajib dipilih"),

    name: z.string().trim().min(1, "nama UMKM wajib diisi"),

    slug: z.string().trim().min(1, "slug UMKM wajib diisi"),

    phone: z
      .string()
      .trim()
      .min(10, "nomor telepon minimal 10 angka")
      .optional()
      .or(z.literal("")),

    description: z.string().trim().optional().or(z.literal("")),

    address: z.string().trim().optional().or(z.literal("")),

    latitude: z.preprocess((value) => {
      if (value === "" || value === undefined) {
        return undefined;
      }

      return value;
    }, z.coerce.number().min(-90, "latitude minimal -90").max(90, "latitude maksimal 90").optional()),

    longitude: z.preprocess((value) => {
      if (value === "" || value === undefined) {
        return undefined;
      }

      return value;
    }, z.coerce.number().min(-180, "longitude minimal -180").max(180, "longitude maksimal 180").optional()),
  }),
});

/* =========================================================
   PARAMS :id
   GET /api/umkms/:id
   GET /api/umkms/me/... jika nanti dibutuhkan
   ========================================================= */

export const umkmIdSchema = z.object({
  params: z.object({
    id: z.string().trim().min(1, "ID UMKM wajib diisi"),
  }),
});

/* =========================================================
   ADMIN — QUERY UMKM
   GET /api/admin/umkms
   ========================================================= */

export const adminUMKMQuerySchema = z.object({
  query: z.object({
    status: z
      .enum(["Pending", "Published", "Rejected", "Suspended"])
      .optional(),

    page: z.coerce
      .number()
      .int("page harus bilangan bulat")
      .positive("page harus lebih dari 0")
      .optional(),

    limit: z.coerce
      .number()
      .int("limit harus bilangan bulat")
      .positive("limit harus lebih dari 0")
      .max(100, "limit maksimal 100")
      .optional(),

    search: z.string().trim().optional(),

    categoryId: z.string().trim().optional(),
  }),
});

/* =========================================================
   ADMIN — UPDATE STATUS
   PATCH /api/admin/umkms/:id/status
   ========================================================= */

export const updateUMKMStatusSchema = z.object({
  params: z.object({
    id: z.string().trim().min(1, "ID UMKM wajib diisi"),
  }),

  body: z.object({
    status: z.enum(["Published", "Rejected"], {
      message: "status harus Published atau Rejected",
    }),
  }),
});
