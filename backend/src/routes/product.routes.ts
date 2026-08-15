import { Router } from "express";
import { validate } from "../middlewares/validate.middelware.js";
import {
  productSchema,
  productSearchQuerySchema,
  productIdSchema,
  productUMKMIdSchema,
  productUpdateSchema,
} from "../schema/product.schema.js";
import {
  createProduct,
  deleteProduct,
  getProductsByUMKM,
  searchProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { verifyToken, requireOwner } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// [GET: publik]: pencarian produk dengan kata kunci dan filter opsional
router.get("/search", validate(productSearchQuerySchema), searchProducts);
router.get("/", validate(productSearchQuerySchema), searchProducts);

// [GET: owner]: melihat daftar produk berdasar id UMKM milik user yang sedang login
router.get(
  "/umkm/:umkmId",
  verifyToken,
  requireOwner,
  validate(productUMKMIdSchema),
  getProductsByUMKM,
);

// [POST: owner]: menambahkan product ke umkm, hanya owner yang sudah login yang bisa
router.post(
  "/",
  verifyToken,
  requireOwner,
  upload.single("image"),
  validate(productSchema),
  createProduct,
);

// [PUT: owner]: memperbarui detail produk milik owner yang sedang login
router.put(
  "/:id",
  verifyToken,
  requireOwner,
  upload.single("image"),
  validate(productIdSchema),
  validate(productUpdateSchema),
  updateProduct,
);

// [DELETE: owner]: menghapus produk milik owner yang sedang login
router.delete(
  "/:id",
  verifyToken,
  requireOwner,
  validate(productIdSchema),
  deleteProduct,
);

export default router;