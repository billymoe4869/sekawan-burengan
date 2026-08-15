import { Router } from "express";

import { verifyToken, requireAdmin } from "../middlewares/auth.middleware.js";

import {
  getAdminUMKMs,
  getAdminUMKMDetail,
  updateUMKMStatus,
} from "../controllers/admin-umkm.controller.js";

import { validate } from "../middlewares/validate.middelware.js";

import {
  adminUMKMQuerySchema,
  umkmIdSchema,
  updateUMKMStatusSchema,
} from "../schema/umkm.schema.js";

const router = Router();

router.get(
  "/umkms",
  verifyToken,
  requireAdmin,
  validate(adminUMKMQuerySchema),
  getAdminUMKMs,
);

router.get(
  "/umkms/:id",
  verifyToken,
  requireAdmin,
  validate(umkmIdSchema),
  getAdminUMKMDetail,
);

router.patch(
  "/umkms/:id/status",
  verifyToken,
  requireAdmin,
  validate(updateUMKMStatusSchema),
  updateUMKMStatus,
);

export default router;
