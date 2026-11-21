import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  proxy: {
      // Requests to /api will be forwarded to your backend
      '': {
        target: 'https://localhost:7129', // Replace with your API URL
        changeOrigin: false, // Set to true if your backend is on a different domain
        secure: false, // Set to true if your backend uses HTTPS
        ws: true, // Enable WebSocket proxying if needed
        // Optional: remove '/api' prefix if your backend doesn't expect it
        rewrite: (path: string) => path.replace(/^\/api/, ''),
      },
    },
  plugins: [].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
    },
  },
}));
