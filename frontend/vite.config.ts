import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:3001";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsInlineLimit: 0,
  },
  server: {
    proxy: {
      "/api": {
        target: backendUrl,
        ws: true,
      },
    },
  },
  preview: {
    port: 4173,
    host: true,
    proxy: {
      "/api": {
        target: backendUrl,
        ws: true,
      },
    },
    allowedHosts: [
      "volly-staging.cc.k3s.chas-lab.dev",
      "volly.cc.k3s.chas-lab.dev",
    ],
  },
});
