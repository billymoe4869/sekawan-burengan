import { Router } from "express";
import { verifyToken, requireOwner } from "../middlewares/auth.middleware.js";
import {
  createUMKM,
  getPublishedUMKMs,
  getUMKMDetail,
  getMyUMKM,
} from "../controllers/umkm.controller.js";
import { validate } from "../middlewares/validate.middelware.js";
import { UMKMschema } from "../schema/umkm.schema.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// GET /api/umkms
// Public: mengambil daftar UMKM yang sudah Published
router.get("/", getPublishedUMKMs);

// GET /api/umkms/me
// Owner: mengambil UMKM milik owner yang sedang login
// Harus diletakkan sebelum "/:id"
router.get("/me", verifyToken, requireOwner, getMyUMKM);

// GET /api/umkms/:id
// Public: mengambil detail UMKM
router.get("/:id", getUMKMDetail);

// POST /api/umkms
// Owner: mendaftarkan UMKM baru
router.post(
  "/",
  verifyToken,
  requireOwner,
  upload.single("image"),
  validate(UMKMschema),
  createUMKM,
);

export default router;
