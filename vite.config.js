import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), sentryVitePlugin({
    org: "nathan-ww",
    project: "tabify"
  })],
  host: true
});