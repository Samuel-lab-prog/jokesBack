import { Router } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { optionalAuth, requireAuth } from '../../middleware/auth.js';
import { validateBody } from '../../middleware/validate.js';
import { generateSchema } from './jokes.schemas.js';
import * as service from './jokes.service.js';

export const jokesRouter = Router();
jokesRouter.post('/generate', optionalAuth, validateBody(generateSchema), asyncHandler(async (req,res)=>{
  res.status(201).json(await service.generate(req.body,req.user?.id));
}));
jokesRouter.get('/history', requireAuth, asyncHandler(async (req,res)=>{
  res.json(await service.history(req.user!.id));
}));
