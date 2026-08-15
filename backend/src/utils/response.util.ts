// file ini berfungsi sebagai helper atau pembantu untuk men-standarisasi format reaponse API yang berhasil, dengan
// fungsi ini semua endpoint akan selalu mengirimkan struktur json yang seragam

import { Response } from "express";


export const sendSuccess = (res: Response, statusCode: number, message: string, data?: unknown) => {
    return res.status(statusCode).json({
        status: "success",
        message,
        data,
    })
}