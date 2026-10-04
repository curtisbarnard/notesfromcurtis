import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const books = defineCollection({
  loader: glob({ base: './src/content/books', pattern: '**/*.mdx' }),
  schema: z.object({
    title: z.string(),
    author: z.string().optional(),
    rating: z.number().int().min(1).max(5).optional(),
    readDate: z.string().optional(),
    publishYear: z.number().int().optional(),
    type: z.string().optional(),
    genres: z.array(z.string()).optional(),
    isbn13: z.string().optional(),
    description: z.string().optional(),
    reviewPublishedAt: z.string().optional(),
    reviewEditedAt: z.string().optional(),
  }),
});

export const collections = { books };