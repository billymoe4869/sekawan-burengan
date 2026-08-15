// Menangani penambahan, pembaruan, dan penghapusan produk/layanan yang dimiliki oleh suatu UMKM.

import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.util.js";

interface CreateProductInput {
    ownerId: string;
    umkmId: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string | null;
    isActive?: boolean;
}

interface SearchProductQuery {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    umkmId?: string;
}

interface UpdateProductInput {
    ownerId: string;
    productId: string;
    data: {
        umkmId?: string;
        name?: string;
        description?: string;
        price?: number;
        imageUrl?: string | null;
        isActive?: boolean;
    };
}

interface DeleteProductInput {
    ownerId: string;
    productId: string;
}

export const createProduct = async (data: CreateProductInput) => {
    const umkm = await prisma.uMKM.findUnique({
        where: { id: data.umkmId },
    });

    if (!umkm) {
        throw new AppError("UMKM tidak ditemukan", 404);
    }

    if (umkm.ownerId !== data.ownerId) {
        throw new AppError("Anda tidak memiliki izin untuk menambahkan produk ke UMKM ini", 403);
    }

    const product = await prisma.product.create({
        data: {
            umkmId: data.umkmId,
            name: data.name,
            description: data.description,
            price: data.price,
            imageUrl: data.imageUrl ?? null,
            isActive: data.isActive ?? true,
        },
    });

    return product;
};

export const searchProducts = async (query: SearchProductQuery) => {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? Math.min(query.limit, 50) : 12;
    const search = query.search?.trim();

    const where = {
        isActive: true,

        ...(search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" as const } },
                    { description: { contains: search, mode: "insensitive" as const } },
                    {
                        umkm: {
                            name: { contains: search, mode: "insensitive" as const },
                        },
                    },
                ],
            }
            : {}),

        ...(query.categoryId
            ? {
                umkm: {
                    categoryId: query.categoryId,
                },
            }
            : {}),

        ...(query.umkmId
            ? {
                umkmId: query.umkmId,
            }
            : {}),
    };

    const skip = (page - 1) * limit;

    const [total, products] = await Promise.all([
        prisma.product.count({ where }),
        prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                umkm: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        imageUrl: true,
                        category: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                },
            },
        }),
    ]);

    return {
        data: products,
        meta: {
            totalData: total,
            currentPage: page,
            limit,
            totalPage: Math.ceil(total / limit),
        },
    };
};

export const getProductByUMKM = async (umkmId: string, ownerId?: string) => {
    const umkm = await prisma.uMKM.findUnique({
        where: { id: umkmId },
        select: { id: true, ownerId: true },
    });

    if (!umkm) {
        throw new AppError("UMKM tidak ditemukan", 404);
    }

    if (ownerId && umkm.ownerId !== ownerId) {
        throw new AppError("Anda tidak memiliki izin untuk melihat produk UMKM ini", 403);
    }

    const products = await prisma.product.findMany({
        where: { umkmId },
        orderBy: { createdAt: "desc" },
    });

    return products;
};

export const updateProduct = async ({ ownerId, productId, data }: UpdateProductInput) => {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { umkm: true },
    });

    if (!product) {
        throw new AppError("Produk tidak ditemukan", 404);
    }

    if (product.umkm.ownerId !== ownerId) {
        throw new AppError("Anda tidak memiliki izin untuk memperbarui produk ini", 403);
    }

    const targetUmkmId = data.umkmId ?? product.umkmId;
    if (targetUmkmId !== product.umkmId) {
        const targetUmkm = await prisma.uMKM.findUnique({
            where: { id: targetUmkmId },
        });

        if (!targetUmkm) {
            throw new AppError("UMKM tujuan tidak ditemukan", 404);
        }

        if (targetUmkm.ownerId !== ownerId) {
            throw new AppError("Anda tidak memiliki izin untuk memindahkan produk ke UMKM ini", 403);
        }
    }

    const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
            ...(data.umkmId ? { umkmId: data.umkmId } : {}),
            ...(data.name !== undefined ? { name: data.name.trim() } : {}),
            ...(data.description !== undefined ? { description: data.description?.trim() || null } : {}),
            ...(data.price !== undefined ? { price: data.price } : {}),
            ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl?.trim() || null } : {}),
            ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        },
    });

    return updatedProduct;
};

export const deleteProduct = async ({ ownerId, productId }: DeleteProductInput) => {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { umkm: true },
    });

    if (!product) {
        throw new AppError("Produk tidak ditemukan", 404);
    }

    if (product.umkm.ownerId !== ownerId) {
        throw new AppError("Anda tidak memiliki izin untuk menghapus produk ini", 403);
    }

    await prisma.product.delete({
        where: { id: productId },
    });

    return true;
};