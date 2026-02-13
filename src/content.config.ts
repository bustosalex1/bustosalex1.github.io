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
            useImage: z.boolean().optional(),
            tags: z.string().array(),
            project: z.boolean().optional(),
            math: z.boolean().optional(),
        }),
});

export const collections = {
    posts: postCollection,
};
