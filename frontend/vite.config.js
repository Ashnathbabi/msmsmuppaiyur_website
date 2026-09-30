import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    host: true,
    port: 5173,

    // Allow localhost + any ngrok URL (ngrok rotates hostnames).
    allowedHosts: true,

    // Proxy API + uploads to the backend so the frontend can use
    // same-origin relative URLs. This means ONE ngrok tunnel
    // (pointing at 5173) serves the entire site — no hardcoded
    // backend URL, no CORS issues for external users.
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});