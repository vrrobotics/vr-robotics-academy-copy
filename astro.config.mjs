import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

const isVercel = process.env.VERCEL === "1";
const deployTarget = process.env.PUBLIC_DEPLOY_TARGET || "";
const isGitHubPages =
  deployTarget.includes("github") || process.env.GITHUB_ACTIONS === "true";

// Determine the base path based on deployment target
let basePath = '/';
if (isGitHubPages) {
  if (deployTarget === "github-admin") {
    basePath = '/admin-dashboard/';
  } else if (deployTarget === "github-teacher") {
    basePath = '/teacher-dashboard/';
  } else if (deployTarget === "github-student") {
    basePath = '/student-dashboard/';
  } else {
    basePath = '/vr-robotics-academy-copy/';
  }
}

export default defineConfig({
  site: 'https://vrrobotics.github.io',
  base: basePath,
  
  integrations: [
    tailwind(),
    react(),
  ],
  adapter: isVercel ? vercel() : undefined,
  
  server: {
    host: "127.0.0.1",
    port: 3000,
  },
  
  output: isVercel ? 'server' : 'static',
});
