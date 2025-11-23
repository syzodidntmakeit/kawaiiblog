import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
  type: "content",
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(["tech", "music", "games", "commentary"]),
    excerpt: z.string(),
    draft: z.boolean().optional(),
    featured: z.boolean().optional(),
    series: z
      .object({
        name: z.string(),
        order: z.number(),
      })
      .optional(),
    cover: image().optional(),
    coverAlt: z.string().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
