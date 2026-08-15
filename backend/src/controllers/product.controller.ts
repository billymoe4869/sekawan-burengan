/**
 * Menangani request penambahan produk baru ke dalam sebuah UMKM
 * dan menampilkan daftar produk berdasarkan ID UMKM.
 */

import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import { AppError } from "../utils/appError.util.js";
import { sendSuccess } from "../utils/response.util.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";
import * as productService from "../services/product.js";

const parseBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }

  return undefined;
};

export const createProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError("Akses ditolak, data user tidak ditemukan di token", 401);
    }

    const { umkmId, name, description, price, imageUrl } = req.body;
    const isActive = parseBoolean(req.body.isActive);

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      throw new AppError("Harga produk tidak valid", 400);
    }

    let finalImageUrl = imageUrl ?? null;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "product-images");
      finalImageUrl = uploadResult.secure_url;
    }

    const product = await productService.createProduct({
      ownerId: req.user.id,
      umkmId,
      name,
      description,
      price: numericPrice,
      imageUrl: finalImageUrl,
      isActive: isActive ?? true,
    });

    sendSuccess(res, 201, "Berhasil menambahkan produk", product);
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = req.query.page !== undefined ? Number(req.query.page) : 1;
    const limit = req.query.limit !== undefined ? Number(req.query.limit) : 12;
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;
    const umkmId = typeof req.query.umkmId === "string" ? req.query.umkmId : undefined;

    const result = await productService.searchProducts({
      page,
      limit,
      search,
      categoryId,
      umkmId,
    });

    sendSuccess(res, 200, "Berhasil mengambil data produk", {
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductsByUMKM = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError("Akses ditolak, data user tidak ditemukan di token", 401);
    }

    const umkmId = req.params.umkmId as string;

    const products = await productService.getProductByUMKM(umkmId, req.user.id);

    sendSuccess(res, 200, "Berhasil mengambil daftar produk", products);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError("Akses ditolak, data user tidak ditemukan di token", 401);
    }

    const productId = req.params.id as string;
    const { umkmId, name, description, imageUrl } = req.body;
    const isActive = parseBoolean(req.body.isActive);
    const rawPrice = req.body.price;

    const updateData: {
      umkmId?: string;
      name?: string;
      description?: string;
      price?: number;
      imageUrl?: string | null;
      isActive?: boolean;
    } = {
      umkmId,
      name,
      description,
      imageUrl,
    };

    if (rawPrice !== undefined && rawPrice !== "" && rawPrice !== null) {
      const numericPrice = Number(rawPrice);
      if (!Number.isFinite(numericPrice) || numericPrice < 0) {
        throw new AppError("Harga produk tidak valid", 400);
      }
      updateData.price = numericPrice;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "product-images");
      updateData.imageUrl = uploadResult.secure_url;
    }

    const product = await productService.updateProduct({
      ownerId: req.user.id,
      productId,
      data: updateData,
    });

    sendSuccess(res, 200, "Berhasil memperbarui produk", product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError("Akses ditolak, data user tidak ditemukan di token", 401);
    }

    const productId = req.params.id as string;

    await productService.deleteProduct({
      ownerId: req.user.id,
      productId,
    });

    sendSuccess(res, 200, "Berhasil menghapus produk", { id: productId });
  } catch (error) {
    next(error);
  }
};
