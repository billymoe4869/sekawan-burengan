// file ini adalah controller untuk user / pengguna, brfungsi untuk menangani alur http: menerima request dari rute,
// memanggil sevice layer untuk logika bisnis (seperti simpan ke db),
// dan mengembalikan response (success atau error) ke frontend

import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../utils/response.util.js";
import * as userService from "../services/user.js"


// fungsi register
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // mengambil data dari body yang sudah divalidasi zod
    const { name, email, password } = req.body;

    // data testing/bohongan agar tidak error
      const newUser = await userService.createUser({name, email, password})
        
          
    sendSuccess(res, 201, "registrasi berhasil", newUser);
  } catch (error) {
    next(error);
  }
};

// fungsi login
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser({ email, password })
    sendSuccess(res, 200, "Login Berhasil", result)
  } catch (err) { 
    next(err)
  }
}