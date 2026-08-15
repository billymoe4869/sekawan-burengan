import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  root: fileURLToPath(new URL("./frontend", import.meta.url)),

  server: {
    host: "0.0.0.0",
    port: 5173,
  },

  preview: {
    host: "0.0.0.0",
    port: 4173,
  },

  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    outDir: fileURLToPath(new URL("./dist/frontend", import.meta.url)),
    emptyOutDir: true,
  },
});