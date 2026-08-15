import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import { AppError } from "../utils/appError.util.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";
import { sendSuccess } from "../utils/response.util.js";
import * as umkmService from "../services/umkm.js";

export const createUMKM = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError(
        "Akses ditolak, data user tidak ditemukan di token",
        401,
      );
    }

    const { categoryId, name, slug, description, address, phone } = req.body;

    let imageUrl: string | null = null;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "umkm-logo",
      );

      imageUrl = uploadResult.secure_url;
    }

    const umkm = await umkmService.createUMKM({
      ownerId: req.user.id,
      categoryId,
      name,
      slug,
      description,
      address,
      phone,
      imageUrl,
    });

    sendSuccess(res, 201, "Berhasil mendaftarkan UMKM", umkm);
  } catch (error) {
    next(error);
  }
};

export const getPublishedUMKMs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = req.query.page !== undefined ? Number(req.query.page) : 1;

    const limit = req.query.limit !== undefined ? Number(req.query.limit) : 10;

    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const categoryId =
      typeof req.query.categoryId === "string"
        ? req.query.categoryId
        : undefined;

    const result = await umkmService.getPublishedUMKMs({
      page,
      limit,
      search,
      categoryId,
    });

    sendSuccess(res, 200, "Berhasil mengambil data UMKM", {
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};

export const getUMKMDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
      const id = req.params.id
      if (typeof id !== "string") {
        throw new AppError("ID UMKM tidak valid", 400);
      }

    const umkm = await umkmService.getUMKMDetail(id);

    sendSuccess(res, 200, "Berhasil mengambil detail UMKM", umkm);
  } catch (error) {
    next(error);
  }
};

export const getMyUMKM = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError(
        "Akses ditolak, data user tidak ditemukan di token",
        401,
      );
    }

    const umkm = await umkmService.getMyUMKM(req.user.id);

    sendSuccess(res, 200, "Berhasil mengambil UMKM milik Anda", umkm);
  } catch (error) {
    next(error);
  }
};
