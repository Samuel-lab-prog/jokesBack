import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/database.js';

const server = app.listen(env.PORT, () => console.info(`API Piada de Deploy ouvindo na porta ${env.PORT}`));
async function shutdown() {
  server.close(async () => { await prisma.$disconnect(); process.exit(0); });
  setTimeout(()=>process.exit(1),10_000).unref();
}
process.on('SIGINT',()=>void shutdown());
process.on('SIGTERM',()=>void shutdown());
