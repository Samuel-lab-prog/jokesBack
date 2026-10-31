import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome.').max(60),
  email: z.email('Informe um e-mail válido.').transform(value => value.toLowerCase()),
  password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres.').max(72),
});
export const loginSchema = z.object({ email: z.email('Informe um e-mail válido.').transform(value => value.toLowerCase()), password: z.string().min(1, 'Informe sua senha.') });
