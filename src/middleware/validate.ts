import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

export const validateBody = (schema: ZodType): RequestHandler => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: result.error.issues[0]?.message ?? 'Dados inválidos.' });
  req.body = result.data;
  next();
};
