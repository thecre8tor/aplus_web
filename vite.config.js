import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        services: resolve(__dirname, "services.html"),
        pricing: resolve(__dirname, "pricing.html"),
        contact: resolve(__dirname, "contact_us.html"),
      },
    },
  },
});

