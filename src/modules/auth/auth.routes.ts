import { Router } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { requireAuth } from '../../middleware/auth.js';
import { validateBody } from '../../middleware/validate.js';
import { prisma } from '../../config/database.js';
import { loginSchema, registerSchema } from './auth.schemas.js';
import * as service from './auth.service.js';

export const authRouter = Router();
authRouter.post('/register', validateBody(registerSchema), asyncHandler(async (req, res) => {
  const result = await service.register(req.body.name, req.body.email, req.body.password);
  res.status(201).json(result);
}));
authRouter.post('/login', validateBody(loginSchema), asyncHandler(async (req, res) => {
  const result = await service.login(req.body.email, req.body.password);
  if (!result) { res.status(401).json({ error: 'E-mail ou senha incorretos.' }); return; }
  res.json(result);
}));
authRouter.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { id: true, name: true, email: true } });
  if (!user) { res.status(401).json({ error: 'Conta não encontrada.' }); return; }
  res.json({ user });
}));
