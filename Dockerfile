FROM oven/bun:1 AS build

RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY prisma ./prisma
RUN bun run db:generate
COPY tsconfig.json ./
COPY src ./src
RUN bun run build

FROM oven/bun:1 AS runtime

RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile
COPY prisma ./prisma
RUN bun run db:generate
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["sh", "-c", "bun run db:migrate && bun run start"]
