import bcrypt from "bcryptjs";
import { prisma } from "../backend/src/lib/prisma.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@sekawanburengan.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "SekawanBurengan123!";

async function main() {
    console.log("memulai proses seeding...")

    const adminPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const admin = await prisma.user.upsert({
        where: { email: ADMIN_EMAIL },
        update: {},
        create: {
            name: "Developer",
            email: ADMIN_EMAIL,
            password: adminPassword,
            role: "Admin"
        }
    })

    console.log("admin selesai dibuat", `email: ${admin.email}`)

    // membuat kategori bawaan
    const categories = [
      { name: "makanan & minuman", slug: "makanan-minuman" },
      { name: "Pakaian & Fashion", slug: "pakaian-fashion" },
      { name: "Jasa & Layanan", slug: "jasa-layanan" },
      { name: "Kerajinan Tangan", slug: "kerajinan-tangan" },
      { name: "Kebutuhan Harian", slug: "kebutuhan-harian" },
      { name: "Otomotif", slug: "otomotif" },
    ];

    for (const category of categories) {
        await prisma.category.upsert({
            where: { slug: category.slug },
            update: {},
            create: category
        })
    }

    console.log(`${categories.length} kategori selesai dibuat`)
    console.log("seeding berhasil")
}

main()
    .catch((e) => {
        console.error("terjadi error saat seeding data", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })