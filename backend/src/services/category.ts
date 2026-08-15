// bertugas menangani logika database untuk kategori UMKM, seperti
 // menambahkan kategori baru (oleh Admin) dan mengambil daftar kategori.


import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.util.js";

interface CreateCategoryInput {
  name: string;
  slug: string;
}

export const createCategory = async (data: CreateCategoryInput) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [{ name: data.name }, { slug: data.slug }],
    },
  });

  if (existingCategory) {
    throw new AppError("kategori dengan nama dan slug tersbut sudah ada", 400);
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
    },
  });

  return category;
};

export const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "desc" },
  });

  return categories;
};

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      umkms: {
        select: { id: true },
      },
    },
  });

  if (!category) {
    throw new AppError("Kategori tidak ditemukan", 404);
  }

  if (category.umkms.length > 0) {
    throw new AppError(
      "Kategori sedang digunakan oleh UMKM, hapus atau pindahkan UMKM terlebih dahulu",
      409,
    );
  }

  await prisma.category.delete({
    where: { id },
  });

  return { id };
};
