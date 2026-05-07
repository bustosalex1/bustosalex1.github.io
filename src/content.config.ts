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

const photoSchema = ({ image }: { image: (path?: string) => z.ZodType }) =>
    z.object({
        src: image(),
        caption: z.string().optional(),
        alt: z.string().optional(),
    });

const photoCollection = defineCollection({
    loader: glob({ pattern: "**/index.yaml", base: "./src/content/photos" }),
    schema: ({ image }) =>
        z
            .object({
                title: z.string(),
                location: z.string(),
                cover: image(),
                dateRange: z.string(),
                description: z.string().optional(),
                photos: z.array(photoSchema({ image })).optional(),
                sections: z
                    .array(
                        z.object({
                            title: z.string().optional(),
                            cover: image(),
                            coverAlt: z.string(),
                            photos: z.array(photoSchema({ image })),
                        }),
                    )
                    .optional(),
            })
            .refine(
                (data) => {
                    const hasPhotos = data.photos && data.photos.length > 0;
                    const hasSections =
                        data.sections && data.sections.length > 0;
                    return hasPhotos || hasSections;
                },
                {
                    message:
                        "photos must have either `photos` or `sections` with at least one entry",
                },
            ),
});

export const collections = {
    posts: postCollection,
    photos: photoCollection,
    quotes: quotesCollection,
};
