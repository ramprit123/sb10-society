import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Node modules chunking
          if (id.includes("node_modules")) {
            // React ecosystem
            if (id.includes("react") || id.includes("react-dom")) {
              return "react";
            }
            // React Router
            if (id.includes("react-router")) {
              return "router";
            }
            // Lucide React icons
            if (id.includes("lucide-react")) {
              return "icons";
            }
            // State management
            if (id.includes("zustand")) {
              return "state";
            }
            // Utilities
            if (id.includes("clsx") || id.includes("tailwind-merge")) {
              return "utils";
            }
            // Other vendor libraries
            return "vendor";
          }

          // Application code chunking
          if (id.includes("src/pages")) {
            return "pages";
          }
          if (id.includes("src/components")) {
            return "components";
          }
          if (id.includes("src/stores")) {
            return "stores";
          }
          if (id.includes("src/services")) {
            return "services";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1000kB
    target: "esnext",
    minify: "terser",
  },
});
