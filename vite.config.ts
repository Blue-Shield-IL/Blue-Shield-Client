import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: "/src/components",
      config: "/src/config",
      constants: "/src/constants",
      contexts: "/src/contexts",
      hooks: "/src/hooks",
      interfaces: "/src/interfaces",
      pages: "/src/pages",
      services: "/src/services",
      styles: "/src/styles",
      utilities: "/src/utilities",
    },
  },
});
