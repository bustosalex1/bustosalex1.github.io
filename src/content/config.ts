import { defineCollection, z } from 'astro:content'

const postCollection = defineCollection({
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
        }),
})

export const collections = {
    posts: postCollection,
}
