import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

export default defineConfig({
  // Uncomment for GitHub Pages deployment
  // site: 'https://YOUR_USERNAME.github.io',
  // base: '/vr-robotics', // Change to your repo name if not using username.github.io
  
  integrations: [
    tailwind(),
    react(),
  ],
  
  server: {
    host: "127.0.0.1",
    port: 3000,
  },
  
  output: 'static', // Static site generation for GitHub Pages
});