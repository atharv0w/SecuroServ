import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path"; // ✅ For aliasing

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ✅ '@' points to /src
    },
  },
  server: {
    proxy: {
      // ✅ Proxy all backend API calls to your ngrok server
      "/api": {
        target: "https://lucille-unbatted-monica.ngrok-free.dev",
        changeOrigin: true,
        secure: false,
      },
      "/profile": {
        target: "https://lucille-unbatted-monica.ngrok-free.dev",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});