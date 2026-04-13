# Getting Started

This document guides you through setting up the project locally for development.

---

## Requirements

Install the following before proceeding:

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org/) | v20 LTS | JavaScript runtime |
| [pnpm](https://pnpm.io/) | v9+ | Package manager (`npm install -g pnpm`) |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Latest | Runs Postgres and Redis locally |
| [Git](https://git-scm.com/) | Latest | Version control |

**Mobile development only (Sprint 2):**
- Android Studio (Android SDK for emulator)
- iOS requires macOS : use Expo Go on a physical device if on Windows/Linux

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
cd Digital-Park-Guide-Training-Platform
```

Then check out the integration branch:

```bash
git checkout dev
```

Cut your own working branch from there:

```bash
git checkout -b dev-yourname dev
```

### 2. Install dependencies

```bash
pnpm install
```

This installs all dependencies across `apps/` and `packages/` in one command.

### 3. Configure environment variables

**Windows:**
```powershell
copy .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

Open the root `.env` and fill in these values at minimum to get the app running locally:

```
JWT_ACCESS_SECRET=    ← generate one: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
JWT_REFRESH_SECRET=   ← generate a different one using the same command
```

The `DATABASE_URL` and `REDIS_URL` values are already pre-filled to match the Docker setup, leave them as-is unless you changed the Docker port (see step 4).

AWS and SES keys can be left blank locally, uploads and email will not work but the rest of the API will.

**Also create `apps/api/.env`** : Prisma reads its database URL from here, not the root `.env`:

**Windows:**
```powershell
copy .env.example apps\api\.env
```

**Mac/Linux:**
```bash
cp .env.example apps/api/.env
```

Then edit `apps/api/.env` and keep only this line (delete everything else):

```
DATABASE_URL=postgresql://user:password@localhost:5432/sfcpark
```

### 4. Start the local database

Make sure Docker Desktop is running, then:

```bash
docker compose up postgres redis -d
```

Wait about 10 seconds for the containers to become healthy.

> **Port conflict (Windows):** If you have a local PostgreSQL installation, it already occupies port 5432. Fix by stopping it first:
> ```powershell
> Stop-Service -Name "postgresql*"
> ```
> Then re-run the docker compose command. Alternatively, change the port in `docker-compose.yml` from `5432:5432` to `5433:5432` and update `DATABASE_URL` in both `.env` files to use port `5433`.

### 5. Run database migrations

```bash
cd apps/api
pnpm prisma migrate dev
```

This creates all 17 tables in your local database. You only need to run this once on first setup, and again whenever someone pushes a new migration.

### 6. Start the development servers

**Sprint 1 — API + Web only:**

From the repo root:
```bash
pnpm --filter @sfc/api dev &
pnpm --filter @sfc/web dev
```

Or start them individually in separate terminals:
```bash
# Terminal 1
cd apps/api && pnpm dev

# Terminal 2
cd apps/web && pnpm dev
```

**Sprint 2 — Mobile:**
```bash
cd apps/mobile && npx expo start
```

Apps are available at:

| App | URL |
|-----|-----|
| API | http://localhost:3000 |
| Web | http://localhost:5173 |
| Mobile | Expo DevTools : scan QR code with Expo Go app |

---

## Who Needs What

| Role | Must run | Can skip |
|------|----------|----------|
| API dev (Cyndia) | Steps 1–5, `apps/api` dev server | Web, Mobile |
| Web dev (Elyn) | Steps 1–5, `apps/web` dev server | Mobile, Android Studio |
| Mobile dev (Xavier) | Steps 1–6 all, Android Studio | — |

---

## Branching Strategy

```
main        ← production-ready, Law merges into here when ready
dev         ← integration branch, Law pulls from your branch into here
dev-name    ← your personal working branch, cut from dev
```

**Workflow:**
1. Cut your branch from `dev`: `git checkout -b dev-yourname dev`
2. Work and commit on your branch
3. Push your branch and let Law know when your part is ready
4. Law will review and merge it — you don't need to do anything else

---

## Useful Commands

```bash
# Start only database and redis
docker compose up postgres redis -d

# Visual database browser (runs at http://localhost:5555)
cd apps/api && pnpm prisma studio

# Apply new migrations after pulling changes that include one
cd apps/api && pnpm prisma migrate dev

# Run linting across all apps
pnpm lint

# Run a command scoped to one app
pnpm --filter @sfc/api <command>
pnpm --filter @sfc/web <command>
```

---

## Diagrams

Architecture and ERD diagrams are in `docs/diagrams/` using [draw.io](https://app.diagrams.net/). Open `.drawio` files in the draw.io VS Code extension or directly at app.diagrams.net.
