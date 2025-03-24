import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import Icons from "unplugin-icons/vite";
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    integrations: [svelte(), mdx()],
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
