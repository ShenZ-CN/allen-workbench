import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { renameSync } from "node:fs";
import { resolve } from "node:path";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/allen-workbench/europa-flow/" : "/",
  plugins: [react(), {
    name: "allen-os-pages-entry",
    closeBundle() {
      renameSync(
        resolve("dist/europa-flow/europa-flow.entry.html"),
        resolve("dist/europa-flow/index.html")
      );
    }
  }],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  build: {
    outDir: "dist/europa-flow",
    emptyOutDir: true,
    rollupOptions: { input: "europa-flow.entry.html" }
  }
}));
