FROM node:20-alpine

WORKDIR /app

# Copy entire monorepo
COPY . .

# Install pnpm
RUN corepack enable

# Install all workspace deps
RUN pnpm install

# Move into backend folder
WORKDIR /app/apps/backend

EXPOSE 3001

CMD ["pnpm", "--filter", "backend", "start:dev"]
