// file ini berisi middleware untuk autentikasi dan otorisasi,
// bertugas untuk mengecek validitas token JWT dari header request, serta memastikan apakah user memilik hal akses (admin atau owner) untuk mengakses suatu endpoint

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.util.js";
import { env } from "../lib/env.js";

// extend request express u/ menyimpan data user dari token
export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: "Admin" | "Owner";
    }
}

// 1. mengecek apakah user sudah login (membawea token jwt yg valid)
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization

        // mengecek keberadaan token dengan format "Bearer"
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("Akses ditolak, token tidak ditemukan atau format salah", 401)
        }

        const token = authHeader.split(" ")[1]

        //verifikasi token dengan secret key
        const decode = jwt.verify(token, env.JWT_SECRET) as AuthRequest["user"]

        // menyimpan data payload token kedalam obj request
        req.user = decode
        next()

    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            next(new AppError("Token tidak valid atau sudah kadaluwarsa, silahkan login ulang", 401))
        } else {
            next(err)
        }
    }
}

// 2. mengecek otorisasi untuk admin
export const requireAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.user?.role !== "Admin") {
        return next(new AppError("akses ditolak, hanya admin yang diizinkan melakukan aksi ini", 403))
    }

    next()
}

// mengecek otorisasi khusus owner
export const requireOwner = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== "Owner") {
        return next(new AppError("akses ditolak hanya owner umkm yang diizinkan melakukan aksi ini", 403))
    }

    next()
}