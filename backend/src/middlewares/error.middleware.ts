// file ini berfungsi sebagai penanganan error global
// Semua error yang dilempar (throw) atau diteruskan dengan next(error) dari  rute atau controller lain akan ditangkap di sini.

import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.util.js";

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  console.error(`[Error] ${err.message}`);

  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Terjadi kesalahan pada server internal";

  res.status(statusCode).json({
    status: "error",
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
