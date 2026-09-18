import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().default('Coravant'),
    tag: z.string().default('Insight'),
    draft: z.boolean().default(false),
  }),
});

const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    /** Shown on cards and in the nav. One plain sentence, no jargon. */
    summary: z.string(),
    /** Lucide icon name, e.g. 'boxes'. See https://lucide.dev/icons */
    icon: z.string(),
    /** Lower sorts first. Controls order on the services grid. */
    order: z.number(),
    /** Shown on the home page grid when true. */
    featured: z.boolean().default(false),
    /** Question a buyer actually asks, answered on the page and in FAQ schema. */
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

const cases = defineCollection({
  loader: glob({ base: './src/content/cases', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    sector: z.string(),
    summary: z.string(),
    /** The number that does the selling. Keep it to one. */
    headline: z.object({ value: z.string(), label: z.string() }),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, services, cases };
