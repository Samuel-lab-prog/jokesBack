import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database.js';
import { env } from '../../config/env.js';

function issueToken(user: { id: string; name: string; email: string }) {
  const token = jwt.sign({ name: user.name, email: user.email }, env.JWT_SECRET, { subject: user.id, expiresIn: '7d' });
  return { token, user };
}
export async function register(name: string, email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { name, email, passwordHash }, select: { id: true, name: true, email: true } });
  return issueToken(user);
}
export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !await bcrypt.compare(password, user.passwordHash)) return null;
  return issueToken({ id: user.id, name: user.name, email: user.email });
}
