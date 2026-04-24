import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import expressiveCode from "astro-expressive-code";
import tailwindcss from "@tailwindcss/vite";
import { SITE } from "./src/site.config";
import { adminPlugin } from "./src/lib/admin/vite-plugin";

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? SITE.website,
  output: "static",
  integrations: [
    react(),
    expressiveCode({
      themes: ["github-dark", "github-light"],
      themeCssSelector: (theme) =>
        theme.name === "github-light"
          ? '[data-theme="light"]'
          : '[data-theme="dark"]',
      styleOverrides: {
        borderRadius: "8px",
        frames: { shadowColor: "transparent" },
      },
    }),
    mdx(),
    sitemap({
      filter: (page) => !page.includes("/admin"),
    }),
  ],
  vite: {
    plugins: [tailwindcss(), adminPlugin()],
    resolve: {
      dedupe: ["react", "react-dom"],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "@uiw/react-codemirror",
        "@codemirror/lang-markdown",
        "@codemirror/theme-one-dark",
        "@codemirror/language",
        "@codemirror/state",
        "@codemirror/view",
      ],
    },
  },
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
    },
  },
});
