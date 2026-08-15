// Menangani semua logika bisnis UMKM: pendaftaran oleh Owner,
// pengambilan data publik (hanya yang berstatus Published),
// dan proses approval/verifikasi oleh Admin.

import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.util.js";

interface CreateUMKMInput {
  ownerId: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  phone?: string;
  imageUrl?: string | null;
}

export const createUMKM = async (data: CreateUMKMInput) => {
  const existingUMKM = await prisma.uMKM.findUnique({
    where: {
      slug: data.slug,
    },
  });

  if (existingUMKM) {
    throw new AppError(
      "Slug ini sudah digunakan, silakan pilih yang lain",
      409,
    );
  }

  const umkm = await prisma.uMKM.create({
    data: {
      ownerId: data.ownerId,
      categoryId: data.categoryId,
      name: data.name,
      slug: data.slug,
      description: data.description,
      address: data.address,
      phone: data.phone,
      imageUrl: data.imageUrl,
    },
  });

  return umkm;
};

/* =========================================================
   PUBLIC — GET UMKM YANG SUDAH PUBLISHED
   ========================================================= */

interface GetUMKMQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}

export const getPublishedUMKMs = async (query: GetUMKMQuery) => {
  const page = query.page && query.page > 0 ? query.page : 1;

  const limit =
    query.limit && query.limit > 0 ? Math.min(query.limit, 100) : 10;

  const search = query.search?.trim();

  const where = {
    status: "Published" as const,

    ...(search
      ? {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {}),

    ...(query.categoryId
      ? {
          categoryId: query.categoryId,
        }
      : {}),
  };

  const skip = (page - 1) * limit;

  const [total, umkms] = await Promise.all([
    prisma.uMKM.count({
      where,
    }),

    prisma.uMKM.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),
  ]);

  return {
    data: umkms,
    meta: {
      totalData: total,
      currentPage: page,
      limit,
      totalPage: Math.ceil(total / limit),
    },
  };
};

/* =========================================================
   PUBLIC — DETAIL UMKM
   ========================================================= */

export const getUMKMDetail = async (id: string) => {
  const umkm = await prisma.uMKM.findUnique({
    where: {
      id,
      status: "Published",
    },

    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },

      owner: {
        select: {
          id: true,
          name: true,
        },
      },

      products: {
        where: {
          isActive: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!umkm) {
    throw new AppError("UMKM tidak ditemukan", 404);
  }

  return umkm;
};

/* =========================================================
   OWNER — GET UMKM MILIK OWNER YANG SEDANG LOGIN
   ========================================================= */

export const getMyUMKM = async (ownerId: string) => {
  const umkm = await prisma.uMKM.findFirst({
    where: {
      ownerId,
    },

    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!umkm) {
    throw new AppError("Anda belum mendaftarkan UMKM", 404);
  }

  return umkm;
};

/* =========================================================
   ADMIN — UPDATE STATUS UMKM
   ========================================================= */

type UMKMStatus = "Published" | "Rejected" | "Suspended";

export const updateUMKMStatus = async (umkmId: string, status: UMKMStatus) => {
  const umkm = await prisma.uMKM.findUnique({
    where: {
      id: umkmId,
    },
  });

  if (!umkm) {
    throw new AppError("UMKM tidak ditemukan", 404);
  }

  const updatedUMKM = await prisma.uMKM.update({
    where: {
      id: umkmId,
    },

    data: {
      status,
    },
  });

  return updatedUMKM;
};