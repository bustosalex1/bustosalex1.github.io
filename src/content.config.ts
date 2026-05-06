import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { file, glob } from "astro/loaders";
const quotesCollection = defineCollection({
    loader: file("src/content/quotes/index.json"),
    schema: z.object({
        id: z.string(),
        quote: z.string(),
        source: z.string(),
        additionalSourceInfo: z.string().optional(),
        author: z.string().optional(),
        character: z.string().optional(),
        aboutCharacter: z.string().optional(),
    }),
});
const postCollection = defineCollection({
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/posts" }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            author: z.string(),
            description: z.string(),
            pubDate: z
                .string()
                .or(z.date())
                .transform((val) => new Date(val)),
            image: image(),
            imageAlt: z.string(),
            useImage: z.boolean().optional(),
            tags: z.string().array(),
            project: z.boolean().optional(),
            math: z.boolean().optional(),
        }),
});
export const collections = {
    posts: postCollection,
    quotes: quotesCollection,
};
