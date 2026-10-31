import { z } from 'zod';

export const generateSchema = z.object({
  category: z.enum(['atraso', 'bug', 'lentidao', 'qualidade']).default('atraso'),
  tone: z.enum(['leve', 'sarcastico', 'corporativo', 'dramatico', 'tio']).default('leve'),
  context: z.string().trim().max(80).default(''),
});
