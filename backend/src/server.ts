import "dotenv/config";
import express from "express";
import cors from "cors";

import { errorHandler } from "./middlewares/error.middleware.js";

import userRouter from "./routes/user.routes.js";
import umkmRouter from "./routes/umkm.routes.js";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import adminUMKMRouter from "./routes/admin-umkm.routes.js";

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  express.json({ limit: "10mb" }),
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin tidak diizinkan oleh CORS"));
    },
    credentials: true,
  }),
);

// Routes
app.use("/api/users", userRouter);
app.use("/api/umkms", umkmRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/admin", adminUMKMRouter);

// Global error handler
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server berjalan di port ${PORT}`);
});
