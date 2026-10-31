# Piada de Deploy — API

API HTTP em TypeScript, organizada por módulos de autenticação e piadas. Este diretório é um repositório independente do front-end.

## Desenvolvimento

Requer Bun e Docker Desktop. Copie `.env.example` para `.env`, rode `bun install`, `docker compose up -d db`, `bun run db:generate`, `bun run db:migrate:dev` e `bun dev`. O servidor de desenvolvimento usa a porta 3001 e o banco do Compose fica na 5434, para evitar conflitos com outros serviços locais. `.env.example` já traz os valores de desenvolvimento para esse banco.

## Publicação no Render

O `Dockerfile` empacota a API e o `render.yaml` configura um serviço Docker mais PostgreSQL gerenciado. Crie o serviço a partir deste diretório/repositório. Na primeira publicação, use `http://localhost:5173` em `FRONTEND_URL`; depois de publicar o front-end, troque pelo domínio público dele e redeploye a API. O container aplica as migrações do Prisma antes de iniciar a API.

Para rodar API e PostgreSQL localmente em containers, use `docker compose up --build`. A API fica em `http://localhost:3000`; pare com `docker compose down` (os dados do banco continuam no volume local).

## Rotas

- Documentação interativa OpenAPI/Swagger UI: `/docs`
- Especificação OpenAPI em JSON: `/docs/openapi.json`

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| GET | `/api/health` | Público | Estado da API |
| POST | `/api/auth/register` | Público | Cadastro (`name`, `email`, `password`) |
| POST | `/api/auth/login` | Público | Login (`email`, `password`) |
| GET | `/api/auth/me` | Token | Usuário atual |
| POST | `/api/jokes/generate` | Público | Gera uma piada sem salvar, para dar espaço à edição |
| POST | `/api/jokes` | Token | Salva uma piada editada no PostgreSQL |
| GET | `/api/jokes/history` | Token | Lista as piadas salvas pela conta |
| PATCH | `/api/jokes/:id` | Token | Edita uma piada do próprio mural |
| DELETE | `/api/jokes/:id` | Token | Exclui uma piada do próprio mural |

Na documentação interativa, use o botão **Authorize** para informar o JWT retornado por `/api/auth/register` ou `/api/auth/login`; assim é possível explorar as rotas protegidas pelo navegador.

As respostas de erro usam JSON no formato `{ "error": "..." }`. O login usa JWT com validade de sete dias. O CRUD completo do mural é separado da geração: gerar não grava nada até a pessoa salvar.

## Stack e estrutura

- Express 5, TypeScript e Zod para validação.
- Prisma ORM e PostgreSQL.
- bcryptjs para hash de senha; JWT para autenticação.
- Helmet, CORS, rate limiting e pino-http.
- `src/modules/` contém rotas e regras por funcionalidade; `src/middleware/` centraliza autenticação, validação e erros.
