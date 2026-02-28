FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps

RUN pnpm install

EXPOSE 3000

CMD ["pnpm", "--filter", "frontend", "dev"]