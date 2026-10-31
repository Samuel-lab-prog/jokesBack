# Piada de Deploy — API

API HTTP em TypeScript, organizada por módulos de autenticação e piadas. Este diretório é um repositório independente do front-end.

## Desenvolvimento

Requer Bun e PostgreSQL. Crie um banco PostgreSQL local, copie `.env.example` para `.env`, ajuste `DATABASE_URL` e defina um `JWT_SECRET` aleatório com pelo menos 32 caracteres. Então rode `bun install`, `bun run db:generate`, `bun run db:migrate:dev` e `bun run dev`.

## Publicação no Render

O `render.yaml` configura uma API Node e um PostgreSQL gerenciado. Crie o serviço a partir deste diretório/repositório. Defina `FRONTEND_URL` para o domínio publicado do Static Site. O banco recebe migrações na inicialização.

## Rotas

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| GET | `/api/health` | Público | Estado da API |
| POST | `/api/auth/register` | Público | Cadastro (`name`, `email`, `password`) |
| POST | `/api/auth/login` | Público | Login (`email`, `password`) |
| GET | `/api/auth/me` | Token | Usuário atual |
| POST | `/api/jokes/generate` | Público | Gera e salva piada; associa ao usuário se houver token |
| GET | `/api/jokes/history` | Token | Histórico pessoal |

As respostas de erro usam JSON no formato `{ "error": "..." }`. O login usa JWT com validade de sete dias.

## Stack e estrutura

- Express 5, TypeScript e Zod para validação.
- Prisma ORM e PostgreSQL.
- bcryptjs para hash de senha; JWT para autenticação.
- Helmet, CORS, rate limiting e pino-http.
- `src/modules/` contém rotas e regras por funcionalidade; `src/middleware/` centraliza autenticação, validação e erros.
