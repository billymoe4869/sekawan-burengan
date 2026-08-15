import { Router } from "express";
import { validate } from "../middlewares/validate.middelware.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../controllers/category.controller.js";
import { verifyToken, requireAdmin } from "../middlewares/auth.middleware.js";
import {
  categoryIdSchema,
  categorySchema,
} from "../schema/category.schema.js";

const router = Router();

// [GET: publik]: mengambil daftar kategori (dropdown saat daftar umkm)
router.get("/", getAllCategories);

// [POST: admin]: menambah kategori
router.post("/", verifyToken, requireAdmin, validate(categorySchema), createCategory);

// [DELETE: admin]: hapus kategori apabila tidak sedang digunakan
router.delete(
  "/:id",
  verifyToken,
  requireAdmin,
  validate(categoryIdSchema),
  deleteCategory,
);

export default router;