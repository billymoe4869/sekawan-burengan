import { z } from "zod"

export const registerUserSchema = z.object({
    body: z.object({
        name: z.string().trim().min(3, "minimal 3 karakter"),
        email: z.string().trim().email("format email tidak valid"),
        password: z.string().min(8, "password minimal 8 karakter")
    })
});

export const loginUserSchema = z.object({
    body: z.object({
        email: z.string().email("format email tidak valid"),
        password: z.string().min(6, "password wajib diisi, minimal 6 karakter")
    })
})