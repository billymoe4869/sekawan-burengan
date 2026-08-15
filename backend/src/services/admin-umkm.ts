import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.util.js";

type UMKMStatus = "Pending" | "Published" | "Rejected" | "Suspended";

interface GetAdminUMKMQuery {
  status?: UMKMStatus;
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}

export const getAdminUMKMs = async (query: GetAdminUMKMQuery) => {
  const page = query.page && query.page > 0 ? query.page : 1;

  const limit =
    query.limit && query.limit > 0 ? Math.min(query.limit, 100) : 10;

  const skip = (page - 1) * limit;

  const status: UMKMStatus = query.status ?? "Pending";

  const search = query.search?.trim();

  const where = {
    status,

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
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

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

/**
 * Mengambil detail UMKM untuk kebutuhan Admin.
 * Berbeda dengan getUMKMDetail() di umkm.ts:
 * - Admin dapat melihat status UMKM
 * - Admin dapat melihat informasi owner lebih lengkap
 * - Admin dapat melihat seluruh product, termasuk yang nonaktif
 */
export const getAdminUMKMDetail = async (id: string) => {
  const umkm = await prisma.uMKM.findUnique({
    where: {
      id,
    },

    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },

      products: {
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
