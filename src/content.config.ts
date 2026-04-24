import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "./site.config";

export const BLOG_PATH = "src/data/blog";
export const PAGES_PATH = "src/data/pages";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1).max(120),
      description: z.string().max(280).optional().default(""),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.string().default(SITE.author),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      heroImage: z.string().optional(),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      ogImage: z.string().optional(),
      canonicalURL: z.string().url().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "*.{md,mdx}", base: `./${PAGES_PATH}` }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = { blog, pages };
