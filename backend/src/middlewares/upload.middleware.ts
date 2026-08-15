import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
    // menggunakn memoryStorage agar file sementara disimpan di RAM, bukan di folder lokal server
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith("image/")) {
            callback(null, true)
        } else {
            callback(new Error("Format file ditolak, hanya unggah file dengan format (JPG/PNG/WEBP"))
        }
    }
})