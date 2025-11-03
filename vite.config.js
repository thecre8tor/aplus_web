import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
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
  server: {
    port: 5173,
    open: true,
  },
  plugins: [
    {
      name: "move-scripts-to-body",
      transformIndexHtml(html) {
        // Find all script tags in head
        const scriptRegex = /<script[^>]*type="module"[^>]*><\/script>/g;
        const linkRegex = /<link[^>]*rel="stylesheet"[^>]*>/g;

        // Extract scripts and styles from head
        const scripts = [];
        const styles = [];

        // Remove scripts from head and collect them
        html = html.replace(
          /<head>([\s\S]*?)<\/head>/,
          (match, headContent) => {
            // Extract scripts from head
            headContent = headContent.replace(
              /<script[^>]*type="module"[^>]*><\/script>/g,
              (script) => {
                scripts.push(script);
                return "";
              }
            );

            // Keep styles in head
            return `<head>${headContent}</head>`;
          }
        );

        // Inject scripts before closing body tag
        if (scripts.length > 0) {
          html = html.replace(
            /<\/body>/,
            `    ${scripts.join("\n    ")}\n  </body>`
          );
        }

        return html;
      },
    },
  ],
});
