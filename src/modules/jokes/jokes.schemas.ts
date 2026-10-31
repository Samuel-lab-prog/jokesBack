import { z } from 'zod';

export const generateSchema = z.object({
  category: z.enum(['atraso', 'bug', 'lentidao', 'qualidade']).default('atraso'),
  tone: z.enum(['leve', 'sarcastico', 'corporativo', 'dramatico', 'tio']).default('leve'),
  context: z.string().trim().max(80).default(''),
});

export const saveJokeSchema = generateSchema.extend({
  content: z.string().trim().min(1, 'A piada não pode ficar vazia.').max(500),
});

export const updateJokeSchema = saveJokeSchema.partial().refine(
  (fields) => Object.keys(fields).length > 0,
  'Informe pelo menos um campo para atualizar.',
);
