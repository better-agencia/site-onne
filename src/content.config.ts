import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    path: z.string(),
    menuName: z.string(),
    breadcrumbLabel: z.string().optional(),
    bodyClass: z.string().default('page'),
    vertical: z.string().default('especialista'),
    ogImage: z.string().default('og-onne.jpg'),
    ogType: z.string().default('website'),
    noindex: z.boolean().default(false),
    breadcrumbs: z.boolean().default(true),
    intro: z.boolean().default(false),
    sitemapPriority: z.number().default(0.8),
  }),
});

export const collections = { pages };
