// file ini adalah service layer untuk user
// Service bertanggung jawab penuh atas logika bisnis dan interaksi langsung dengan db (menggunakan prisma)

import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.util.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../lib/env.js";

// mendefinisikan tipe data untuk register user
interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

// mendefinisikan tipe data untuk login
interface LoginUserInput {
  email: string;
  password: string;
}

export const createUser = async (data: CreateUserInput) => {
  // mengecek apakah email sebelumnya sudah terdaftar di db
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    // error ini ditangkap langsung oleh block catch di controller
    throw new AppError(
      "Email sudah terdaftar, silakan gunakan email lain",
      400,
    );
  }

  // hash pwd
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  // menyimpan user baru ke db
  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "Owner",
    },
    // mengembalikan ke frontend (no password)
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return newUser;
};

export const loginUser = async (data: LoginUserInput) => {
  // mencari dulu data user yang ada di db
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    // pesan ambigu agar tidak mudah terlacak apa yang salah saat akun user tidak ditemukan
    throw new AppError("email atau password salah", 401)
  }

  // pencocokan password
  const isPasswordValid = await bcrypt.compare(data.password, user.password)
  if (!isPasswordValid) throw new AppError("email atau password salah", 401)
  
  // membuat payload (isi data yang akan diselipkan kedalam token) yang nantinya dibaca req.user dalam middleware
  const payload = {
    id: user.id,
    role: user.role
  }

  // mencetak token jwt yang diberi kadaluwarsa agar user login kembali
  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "2d" })
  
  // mengembalikan token beserta info profil (tidak termasuk password)
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  }
};
