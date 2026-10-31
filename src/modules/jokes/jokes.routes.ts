import { Router } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { requireAuth } from '../../middleware/auth.js';
import { validateBody } from '../../middleware/validate.js';
import { generateSchema, saveJokeSchema, updateJokeSchema } from './jokes.schemas.js';
import * as service from './jokes.service.js';

export const jokesRouter = Router();

// Geração é pública e não grava no PostgreSQL até a pessoa decidir salvar.
jokesRouter.post('/generate', validateBody(generateSchema), asyncHandler(async (req, res) => {
  res.status(200).json(service.generate(req.body));
}));

// Create / Read
jokesRouter.post('/', requireAuth, validateBody(saveJokeSchema), asyncHandler(async (req, res) => {
  res.status(201).json(await service.save(req.body, req.user!.id));
}));
jokesRouter.get('/history', requireAuth, asyncHandler(async (req, res) => {
  res.json(await service.history(req.user!.id));
}));

// Update / Delete. Both operations are restricted to the owner of the joke.
jokesRouter.patch('/:id', requireAuth, validateBody(updateJokeSchema), asyncHandler(async (req, res) => {
  const updated = await service.update(String(req.params.id), req.user!.id, req.body);
  if (!updated) { res.status(404).json({ error: 'Piada não encontrada no seu mural.' }); return; }
  res.json(updated);
}));
jokesRouter.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
  const removed = await service.remove(String(req.params.id), req.user!.id);
  if (!removed) { res.status(404).json({ error: 'Piada não encontrada no seu mural.' }); return; }
  res.status(204).end();
}));
