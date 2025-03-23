import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
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
            tags: z.string().array(),
            project: z.boolean().optional(),
            fullWidth: z.boolean().optional(),
        }),
});

const noteCollection = defineCollection({
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/notes" }),
    schema: () =>
        z.object({
            title: z.string(),
            author: z.string(),
            class: z.string(),
            pubDate: z
                .string()
                .or(z.date())
                .transform((val) => new Date(val)),
            draft: z.boolean().optional(),
        }),
});

export const collections = {
    posts: postCollection,
    notes: noteCollection,
};
