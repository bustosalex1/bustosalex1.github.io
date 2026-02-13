import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import Icons from "unplugin-icons/vite";
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeCaptionImages from "./src/utils/rehype-caption-images.ts";
import rehypeCaptionTables from "./src/utils/rehype-caption-tables.ts";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    integrations: [svelte(), mdx(), sitemap()],
    site: "https://bustosalex1.github.io",
    markdown: {
        shikiConfig: {
            themes: {
                light: "catppuccin-latte",
                dark: "dracula",
            },
        },
        remarkPlugins: [remarkMath],
        rehypePlugins: [
            [
                rehypeKatex,
                {
                    // katex plugin options
                },
            ],
            [
                rehypeCaptionImages,
                {
                    // rehype caption images options
                },
            ],
            [
                rehypeCaptionTables,
                {
                    // rehype caption images options
                },
            ],
        ],
    },
    vite: {
        plugins: [
            Icons({
                compiler: "svelte",
                autoInstall: true,
            }),
            Icons({
                compiler: "astro",
                autoInstall: true,
            }),
            tailwindcss(),
        ],
    },
});
