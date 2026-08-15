import { z } from "zod";

const formBoolean = z.preprocess((value) => {
  if (value === undefined || value === "") {
    return undefined;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return value;
}, z.boolean().optional());

export const productSchema = z.object({
  body: z.object({
    umkmId: z.string().trim().min(1, "UMKM ID dibutuhkan"),

    name: z.string().trim().min(1, "nama produk wajib diisi"),

    description: z.string().trim().optional().or(z.literal("")),

    price: z.preprocess((value) => {
      if (value === "") {
        return undefined;
      }

      return value;
    }, z.coerce.number().nonnegative("price tidak bisa negatif")),

    imageUrl: z
      .string()
      .trim()
      .url("format URL gambar tidak valid")
      .optional()
      .or(z.literal("")),

    isActive: formBoolean,
  }),
});

export const productSearchQuerySchema = z.object({
  query: z.object({
    search: z
      .string()
      .trim()
      .max(100, "kata kunci pencarian maksimal 100 karakter")
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
      .max(50, "limit maksimal 50")
      .optional(),

    categoryId: z.string().trim().optional(),

    umkmId: z.string().trim().optional(),
  }),
});

export const productUpdateSchema = z.object({
  body: z
   .object({
     umkmId: z.string().trim().min(1, "UMKM ID dibutuhkan").optional(),

     name: z.string().trim().min(1, "nama produk wajib diisi").optional(),

     description: z.string().trim().optional().or(z.literal("")),

     price: z.preprocess((value) => {
       if (value === "" || value === undefined || value === null) {
         return undefined;
       }

       return value;
     }, z.coerce.number().nonnegative("price tidak bisa negatif").optional()),

     imageUrl: z
       .string()
       .trim()
       .url("format URL gambar tidak valid")
       .optional()
       .or(z.literal("")),

     isActive: formBoolean,
   })
   .refine((value) => Object.keys(value).length > 0, {
     message: "minimal satu field produk harus diperbarui",
   }),
});

/* =========================================================
   PARAMS PRODUCT
   ========================================================= */

export const productIdSchema = z.object({
  params: z.object({
   id: z.string().trim().min(1, "ID product wajib diisi"),
  }),
});

export const productUMKMIdSchema = z.object({
  params: z.object({
   umkmId: z.string().trim().min(1, "ID UMKM wajib diisi"),
  }),
});
