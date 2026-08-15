// file ini berfungsi: untuk mengecek barang bawaan (request body/query) pengunjung sebelum mereka diizinkan masuk ke ruang utama (Controller).
// hanya dipasang pada rute2 tertentu yang butuh validasi seperti login, register, createUMKM nantinya file ini akan diselipkan di file route2 tersebut 


import { Request, Response, NextFunction } from "express";
import {ZodSchema, ZodError} from "zod"


export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) =>  {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        })
        next()
    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                status: "error",
                message: "validasi error",
                errors: err.issues.map((e) => ({
                    field: e.path.join("."),
                    message: e.message
                }))
            })
        }
        next(err)
    }
}