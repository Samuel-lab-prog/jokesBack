import type { ErrorRequestHandler } from 'express';
import { Prisma } from '@prisma/client';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    res.status(409).json({ error: 'Este e-mail já tem conta.' }); return;
  }
  console.error(error);
  res.status(500).json({ error: 'Erro interno. Tente novamente.' });
};
