import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import framewireIntegration from "./framewire-integration.js";

export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  
  integrations: [
    framewireIntegration(),
    tailwind(),
    react(),
  ],
  
  server: {
    allowedHosts: true,
    host: true,
    port: 3000,
  },
  
  security: {
    checkOrigin: false,
  },
});