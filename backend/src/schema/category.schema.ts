import { z } from "zod";

/* =========================================================
   CREATE CATEGORY
   POST /api/categories
   ========================================================= */

export const categorySchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "nama kategori dibutuhkan"),

    slug: z.string().trim().min(1, "slug kategori dibutuhkan"),
  }),
});

/* =========================================================
   UPDATE CATEGORY
   PATCH /api/categories/:id
   ========================================================= */

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().trim().min(1, "ID kategori wajib diisi"),
  }),

  body: z.object({
    name: z.string().trim().min(1, "nama kategori dibutuhkan").optional(),

    slug: z.string().trim().min(1, "slug kategori dibutuhkan").optional(),
  }),
});

/* =========================================================
   PARAMS CATEGORY
   ========================================================= */

export const categoryIdSchema = z.object({
  params: z.object({
    id: z.string().trim().min(1, "ID kategori wajib diisi"),
  }),
});
