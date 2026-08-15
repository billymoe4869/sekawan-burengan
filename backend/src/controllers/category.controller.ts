// Bertugas menerima request terkait kategori, memanggil category.service,
// dan mengembalikan respons sukses atau meneruskan error ke handler global.

import { Request, Response, NextFunction } from "express";
import * as categoryService from "../services/category.js";
import { AppError } from "../utils/appError.util.js";
import { sendSuccess } from "../utils/response.util.js";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, slug } = req.body;

    const category = await categoryService.createCategory({ name, slug });

    sendSuccess(res, 201, "Berhasil membuat kategori baru", category);
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await categoryService.getAllCategories();
    sendSuccess(res, 200, "Berhasil mengambil daftar kategori", categories);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id || id.trim() === "") {
      throw new AppError("ID kategori tidak valid", 400);
    }

    const result = await categoryService.deleteCategory(id);

    sendSuccess(res, 200, "Berhasil menghapus kategori", result);
  } catch (error) {
    next(error);
  }
};