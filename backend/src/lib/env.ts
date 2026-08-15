import "dotenv/config"
import { z } from "zod"

const EnvSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
})

export const env = EnvSchema.parse(process.env)