import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

type Claims = { sub: string; name: string; email: string };
export const optionalAuth: RequestHandler = (req, _res, next) => {
  const header = req.header('authorization');
  if (!header?.startsWith('Bearer ')) return next();
  try {
    const claims = jwt.verify(header.slice(7), env.JWT_SECRET) as Claims;
    req.user = { id: claims.sub, name: claims.name, email: claims.email };
  } catch { /* A bad optional token does not block public joke generation. */ }
  next();
};
export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Entre na sua conta para continuar.' });
  next();
};
