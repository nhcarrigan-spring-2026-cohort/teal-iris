# Contributing to teal-iris

Kudos to you for contributing to teal-iris! 🎉

## Getting Started

### Prerequisites

- **[Node.js](https://nodejs.org/en/download)**: v20 or higher (check with `node --version`)
- **[pnpm](https://pnpm.io/installation)**: Latest version (install with `npm install -g pnpm`)
- **[Docker](https://www.docker.com/get-started/)**: For running the full stack with database
- **[nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)**: Switch Node versions automatically (configure your Node version to project via `nvm use`)

### Running the Project

#### Development Mode

At the root of the project, run:

```bash
docker-compose up --build
```

This will start the entire stack including:

- Backend (NestJS) on port 3000
- Frontend (Next.js) on port 3001
- PostgreSQL database

#### Running Individual Apps

**Backend only:**

```bash
pnpm --filter backend start:dev
```

**Frontend only:**

```bash
pnpm --filter frontend dev
```

## Development Commands

### Root-Level Commands

For convenience, you can run these commands from the project root:

| Command          | Description                     |
| ---------------- | ------------------------------- |
| `pnpm install`   | Install all dependencies        |
| `pnpm run lint`  | Lint both backend and frontend  |
| `pnpm run build` | Build both backend and frontend |
| `pnpm run test`  | Run backend tests               |

### Workspace Commands

| Command                            | Description                       |
| ---------------------------------- | --------------------------------- |
| `pnpm --filter backend <command>`  | Run command in backend workspace  |
| `pnpm --filter frontend <command>` | Run command in frontend workspace |

### Backend Commands

| Command                             | Description                            |
| ----------------------------------- | -------------------------------------- |
| `pnpm --filter backend start:dev`   | Start backend in dev mode (watch mode) |
| `pnpm --filter backend start:debug` | Start backend in debug mode            |
| `pnpm --filter backend build`       | Build backend for production           |
| `pnpm --filter backend start:prod`  | Run production build                   |
| `pnpm --filter backend lint`        | Run ESLint                             |
| `pnpm --filter backend format`      | Format code with Prettier              |
| `pnpm --filter backend test`        | Run unit tests                         |

### Frontend Commands

| Command                        | Description                           |
| ------------------------------ | ------------------------------------- |
| `pnpm --filter frontend dev`   | Start frontend dev server (port 3000) |
| `pnpm --filter frontend build` | Build frontend for production         |
| `pnpm --filter frontend start` | Run production build                  |
| `pnpm --filter frontend lint`  | Run ESLint                            |

### Database Commands (Backend)

The backend uses Drizzle ORM with PostgreSQL. Database configuration is in `apps/backend/drizzle.config.ts`.

| Command                                      | Description                     |
| -------------------------------------------- | ------------------------------- |
| `docker-compose up -d`                       | Start PostgreSQL in background  |
| `docker-compose down`                        | Stop all services               |
| `pnpm --filter backend drizzle-kit generate` | Generate migrations from schema |
| `pnpm --filter backend drizzle-kit migrate`  | Apply migrations to database    |
| `pnpm --filter backend drizzle-kit studio`   | Open Drizzle Studio GUI         |

## Commit Messages

This project enforces [Conventional Commits](https://www.conventionalcommits.org/) via **commitlint**. Every commit message must follow this format:

```
<type>(<scope>): <description>
```

### Allowed Types

`feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`, `build`, `perf`, `style`, `revert`

### Allowed Scopes

| Scope      | Usage                              |
| ---------- | ---------------------------------- |
| `backend`  | Changes in `apps/backend/`         |
| `frontend` | Changes in `apps/frontend/`        |
| `root`     | Root config files                  |
| `ci`       | `.github/workflows/`               |
| `docs`     | Documentation files                |
| `docker`   | Dockerfiles, `docker-compose.yml`  |
| `deps`     | Cross-workspace dependency updates |

### Examples

```bash
# Valid commits
feat(backend): add user authentication endpoint
fix(frontend): resolve hydration mismatch on home page
chore(root): update ESLint config
docs(docs): add API usage guide
ci(ci): add deploy workflow

# Valid but produces a warning (missing scope)
chore: update dependencies

# Invalid (will be rejected)
updated stuff               # not conventional format
feat(api): add endpoint     # invalid scope
```

## Making Changes

### Code Style

- Run `pnpm --filter <workspace> lint` before committing
- Run `pnpm --filter <workspace> format` to format code with Prettier
- Follow existing patterns in the codebase
- Husky pre-commit hooks will automatically check your code

### Environment Variables

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Update the values as needed:
   - `PORT`: Backend server port (default: 3000)
   - `DATABASE_URL`: PostgreSQL connection string

### Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat(backend): add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Questions?

- 🐛 **Found a bug?** Open an issue
- 💡 **Have a feature idea?** Open an issue to discuss
- 💬 **Need help?** Reach out to the team

Thank you for contributing! 🙏
