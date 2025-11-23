import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.kawaii-san.org",
  base: "/",
  output: "static",
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: "tokyo-night",
      wrap: true,
    },
  },
  build: {
    inlineStylesheets: "auto",
  },
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
});
