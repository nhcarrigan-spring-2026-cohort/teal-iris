# teal-iris
Repository for Team teal-iris - Spring 2026 Cohort. It is structured as a monorepo containing both the backend and frontend applications.

## Tech Stack

**Backend**
* NestJS (Node.js framework)
* TypeScript
* pnpm (Package manager)
* Drizzle (ORM)

**Frontend**
* Next.js (React framework)
* TypeScript
* Tailwind CSS

**DevOps & Tooling**
* Docker & Docker Compose
* Husky (Git hooks for linting and formatting)
* GitHub Actions (CI/CD)

## Repository Structure

## File Structure

```text
.
├── .github/              # CI/CD workflows
├── .husky/               # Pre-commit hooks
├── apps/                 # Application source code
│   ├── backend/          # NestJS API
│   └── frontend/         # Next.js Client
├── docker/               # Centralized Docker configurations
│   ├── backend.Dockerfile
│   └── frontend.Dockerfile
├── scripts/              # Setup and maintenance scripts
├── .dockerignore         # Docker build exclusion rules
├── .gitignore            # Git exclusion rules
├── .nvmrc                # Node.js version pinning
├── .prettierrc           # Code formatting rules
├── LICENSE               # Project License
├── docker-compose.yml    # Service orchestration
├── package.json          # Root configuration & scripts
└── README.md             # Project documentation