import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: { postcss: {} }, // Tailwind comes from the plugin above; don't look for a PostCSS config
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "./src") } },
});
