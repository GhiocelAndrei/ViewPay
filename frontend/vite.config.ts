import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// TODO: add "@/*" path alias to match tsconfig once features grow.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});
