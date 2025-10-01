import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: "https://crudapp-backend-kpa0.onrender.com",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
