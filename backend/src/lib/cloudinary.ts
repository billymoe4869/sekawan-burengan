import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import { env } from "./env.js";


// konfigurasi cloudinary menggunakan kredensial dari environment variabel
cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
})

// helper untuk upload buffer file ke cloudinary secara async
export const uploadToCloudinary = (
    fileBuffer: Buffer,
    folder: string = "direktori-UMKM",
): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error ?? new Error("Upload ke Cloudinary gagal"));
                }
            },
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};

export default cloudinary