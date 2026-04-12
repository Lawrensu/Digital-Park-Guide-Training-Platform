# Getting Started

This document guides you through setting up the project locally for development.

---

## Requirements

Install the following before proceeding:

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org/) | v20 LTS | JavaScript runtime |
| [pnpm](https://pnpm.io/) | v9+ | Package manager (`npm install -g pnpm`) |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Latest | Runs Postgres, Redis, and API containers |
| [Git](https://git-scm.com/) | Latest | Version control |
| [Android Studio](https://developer.android.com/studio) | Latest | Android SDK for mobile development |

> **iOS development** requires macOS. Use the Expo Go app on a physical iOS device if on Windows/Linux.

**Recommended editor:** VS Code with the following extensions:
- ESLint
- Prettier
- Prisma
- Docker
- Thunder Client (API testing)

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Lawrensu/Digital-Park-Guide-Training-Platform.git
```

### 2. Install dependencies

```bash
pnpm install
```

This installs all dependencies across `apps/` and `packages/` in one command.

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the required values. Ask the team lead for credentials you don't have (AWS keys, etc.). Do not commit `.env`.

### 4. Start the local development stack

```bash
docker compose up postgres redis -d
```

This starts PostgreSQL and Redis as containers. On first run it will pull the images — this takes a minute.

> **Port conflict (Windows):** If you have a local PostgreSQL installation, it will already occupy port 5432 and Docker's container won't be reachable. Fix by stopping the local service first:
> ```powershell
> Stop-Service -Name "postgresql*"
> ```
> Then restart the containers. Alternatively, change the port mapping in `docker-compose.yml` from `5432:5432` to `5433:5432` and update `DATABASE_URL` in your `.env` to use port `5433`.

### 5. Run database migrations

```bash
cd apps/api
pnpm prisma migrate dev
```

### 6. (Optional) Seed the database

```bash
pnpm prisma db seed
```

This creates the initial admin accounts defined in `.env`.

### 7. Start the development servers

From the repo root:

```bash
pnpm dev
```

Turborepo starts all apps in parallel. Individual apps are available at:

| App | URL |
|-----|-----|
| API | http://localhost:3000 |
| Web | http://localhost:5173 |
| Mobile | Expo DevTools in terminal |

---

## Branching Strategy

```
main         ← production-ready, protected (no direct pushes)
develop      ← integration branch, all features merge here first
feature/*    ← your working branch, cut from develop
```

**Workflow:**
1. Cut a branch from `develop`: `git checkout -b feature/your-feature develop`
2. Work and commit on your branch
3. Get at least one review before merging
4. Never push directly to `main`

---

## Useful Commands

```bash
# Start only the database and redis (no app servers)
docker compose up postgres redis

# Rebuild API container after adding new packages
docker compose up --build api

# Run Prisma Studio (visual DB browser)
cd apps/api && pnpm prisma studio

# Run linting across all apps
pnpm lint

# Run a command in a specific app
pnpm --filter @sfc/api <command>
```

---

## Diagrams

Architecture and ERD diagrams are maintained in `docs/diagrams/` using [draw.io](https://app.diagrams.net/). Open `.drawio` files directly in the app or in the draw.io VS Code extension.