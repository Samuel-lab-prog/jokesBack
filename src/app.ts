import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { rateLimit } from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { openApiDocument } from './docs/openapi.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { jokesRouter } from './modules/jokes/jokes.routes.js';
import { errorHandler } from './middleware/error-handler.js';

export const app = express();
app.disable('x-powered-by');
app.get('/docs/openapi.json', (_req, res) => res.json(openApiDocument));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument, {
  customSiteTitle: 'Piada de Deploy API — documentação',
  customCss: '.swagger-ui .topbar { background-color: #20231d; } .swagger-ui .topbar-wrapper .link { visibility: hidden; }',
}));
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const localDevelopmentOrigin = env.NODE_ENV !== 'production'
      && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin ?? '');
    callback(null, !origin || origin === env.FRONTEND_URL || localDevelopmentOrigin);
  },
  credentials: false,
}));
app.use(express.json({ limit: '16kb' }));
app.use(pinoHttp({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  redact: ['req.headers.authorization'],
}));
app.use('/api', rateLimit({ windowMs: 15*60*1000, limit: 120, standardHeaders: 'draft-7', legacyHeaders: false }));
app.get('/api/health', (_req,res)=>res.json({status:'ok'}));
app.use('/api/auth', authRouter);
app.use('/api/jokes', jokesRouter);
app.use((_req,res)=>res.status(404).json({error:'Rota não encontrada.'}));
app.use(errorHandler);
