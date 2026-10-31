import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  FRONTEND_URL: z.string().url().transform(value => new URL(value).origin).default('http://localhost:5173'),
});
const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Configuração inválida:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}
export const env = parsed.data;
