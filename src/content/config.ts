import { defineCollection, z } from 'astro:content';

const vaultcdnGuides = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number(),
  }),
});

export const collections = {
  'vaultcdn-guides': vaultcdnGuides,
};
