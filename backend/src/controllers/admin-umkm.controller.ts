import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../utils/response.util.js";
import * as adminUMKMService from "../services/admin-umkm.js";
import * as umkmService from "../services/umkm.js";

type UMKMStatus = "Pending" | "Published" | "Rejected" | "Suspended";

export const getAdminUMKMs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = req.query.page ? Number(req.query.page) : undefined;

    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const status =
      typeof req.query.status === "string"
        ? (req.query.status as UMKMStatus)
        : undefined;

    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const categoryId =
      typeof req.query.categoryId === "string"
        ? req.query.categoryId
        : undefined;

    const result = await adminUMKMService.getAdminUMKMs({
      page,
      limit,
      status,
      search,
      categoryId,
    });

    return sendSuccess(res, 200, "Berhasil mengambil data UMKM untuk admin", {
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminUMKMDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;

    const umkm = await adminUMKMService.getAdminUMKMDetail(id as string);

    return sendSuccess(
      res,
      200,
      "Berhasil mengambil detail UMKM untuk admin",
      umkm,
    );
  } catch (error) {
    next(error);
  }
};

export const updateUMKMStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;

    const status = req.body.status as "Published" | "Rejected";

    const updatedUMKM = await umkmService.updateUMKMStatus(id, status);

    return sendSuccess(
      res,
      200,
      `Berhasil mengubah status UMKM menjadi ${status}`,
      updatedUMKM,
    );
  } catch (error) {
    next(error);
  }
};
