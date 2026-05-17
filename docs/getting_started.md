# Getting Started

This document walks you through setting up the project locally for development.
By the end you will have the API running on port 3000 and the web app on port 5173.

---

## Requirements

Install the following before proceeding:

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org/) | v20 LTS (v22 works, see note below) | JavaScript runtime |
| [pnpm](https://pnpm.io/) | v9+ | Package manager (`npm install -g pnpm`) |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Latest | Runs Postgres locally |
| [Git](https://git-scm.com/) | Latest | Version control |

**Mobile development only:**
- Expo Go app on your phone (Android or iOS) as it is our primary testing method
- Android Studio (optional, for Android emulator only (I tried it and it was such a hurrendous experience))
- iOS requires macOS for emulation, use Expo Go on a physical device if on Windows/Linux

> **Node.js v22 note:** v22 enforces strict `package.json` exports which conflicts with Metro 0.83.x. The repo includes a custom resolver in `apps/mobile/metro.config.js` and a preload script `apps/mobile/_fix-node22.js` that handle this automatically. If Metro fails to start after running `pnpm install --force`, the patches in `node_modules/.pnpm/` will have been wiped and must be re-applied. See `CLAUDE.md` for details.

**Recommended VS Code extensions:**
- ESLint
- Prettier
- Prisma
- Docker
- REST Client by Huachao Mao (required for `.http` API test files in `apps/api/test/`)

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Lawrensu/Digital-Park-Guide-Training-Platform.git
cd Digital-Park-Guide-Training-Platform
```

Check out the integration branch and cut your own working branch from it:

```bash
git checkout dev
git checkout -b dev-yourname dev
```

### 2. Install dependencies

From the repo root:

```bash
pnpm install
```

This installs all dependencies across `apps/` and `packages/` in one command.

### 3. Configure environment variables

Copy the example file to create your local `.env`:

**Windows:**
```powershell
copy .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

Open `.env` and fill in the following. Everything else can be left as-is for local dev.

**Must fill in to run locally:**

```
JWT_ACCESS_SECRET=    ← generate: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
JWT_REFRESH_SECRET=   ← generate a different one using the same command
REDIS_URL=            ← your Upstash Redis URL (format: rediss://default:PASSWORD@HOST:PORT)
INTERNAL_SECRET=      ← any random string, e.g. local-dev-secret
```

**Must fill in for seed (step 6):**

```
SEED_ADMIN_EMAIL=your@email.com
SEED_ADMIN_USERNAME=YourAdminUsername
SEED_ADMIN_PASSWORD=YourSecurePassword
```

**Optional: leave blank to skip those features:**
- `AWS_*` / `SES_*`: uploads and email will not work, but the rest of the API runs fine
- `BILLPLZ_*`: payment flow will not work

The `DATABASE_URL` is already pre-filled in `.env.example` to match the Docker setup (`localhost:5433`). Leave it as-is.

**Also create `apps/api/.env`**: Prisma reads its database URL from here, not the root `.env`:

**Windows:**
```powershell
copy .env.example apps\api\.env
```

**Mac/Linux:**
```bash
cp .env.example apps/api/.env
```

You only need one line in `apps/api/.env`. Delete everything else and keep:

```
DATABASE_URL=postgresql://user:password@localhost:5433/sfcpark
```

**Also create `apps/mobile/.env`**: the mobile app reads the API base URL from here:

```
EXPO_PUBLIC_API_BASE=http://<YOUR_LAN_IP>:3000/api
```

Replace `<YOUR_LAN_IP>` with your machine's local network IP (see Step 8 for how to find it). If using an Android emulator instead of a physical device, use `http://10.0.2.2:3000/api`.

### 4. Start the local database

Make sure Docker Desktop is running, then:

```bash
docker compose up postgres -d
```

Wait about 10 seconds for the container to become healthy.

> **Port conflict:** The Docker setup maps Postgres to port `5433` on your machine (not the default 5432), so it will not conflict with any existing local Postgres installation.

### 5. Run database migrations

From the repo root:

```bash
pnpm --filter @sfc/api exec prisma migrate dev
```

This creates all tables in your local database. Run this once on first setup, and again whenever someone pushes a new migration.

### 6. Seed the database

Make sure you filled in the `SEED_ADMIN_*` values in your root `.env` (step 3), then:

```bash
pnpm --filter @sfc/api exec prisma db seed
```

This creates 4 stations, your primary admin account, 4 test admins, and 10 test guides.
The test password for all seeded test accounts (not your primary admin) is `TestPass123!`.

Re-running seed is safe, it uses upsert and will not create duplicates.

### 7. Start the development servers

Open two terminals from the repo root:

```bash
# Terminal 1 — API
pnpm --filter @sfc/api dev

# Terminal 2 — Web
pnpm --filter @sfc/web dev
```

Apps are available at:

| App | URL |
|-----|-----|
| API | http://localhost:3000 |
| Web | http://localhost:5173 |

---

### 8. Run the mobile app

The mobile app connects to the API over your local network. Your phone and your computer must be on the **same Wi-Fi network**.

**Step 1: Find your machine's LAN IP**

| OS | Command | Look for |
|----|---------|----------|
| Windows | `ipconfig` in CMD | IPv4 Address under your active adapter (Wi-Fi or Ethernet), e.g. `192.168.0.3` |
| Mac | `ifconfig` or System Settings → Wi-Fi → Details | `inet` address under `en0` |
| Linux | `ip addr` | `inet` address under your active interface |

**Step 2: Configure `apps/mobile/.env`**

```
EXPO_PUBLIC_API_BASE=http://192.168.0.3:3000/api
```

Replace `192.168.0.3` with your actual LAN IP. The API must be running (step 7 above).

**Step 3: Start Expo**

```bash
cd apps/mobile
npx expo start
```

Scan the QR code in Expo Go (install from App Store / Play Store). The app opens on your phone connected to your local API.

> **Troubleshooting:** If the app cannot reach the API, check that your firewall allows inbound connections on port 3000, and that both devices are on the same network (not a guest network).

---

## Branching Strategy

```
main        ← production-ready, Law merges into here
dev         ← integration branch, Law pulls from your branch into here
dev-name    ← your personal working branch, cut from dev
```

**Workflow:**
1. Cut your branch from `dev`: `git checkout -b dev-yourname dev`
2. Work and commit on your branch
3. Push your branch and let Law know when it is ready
4. Law will review and merge, you do not need to do anything else

---

## Useful Commands

```bash
# Start only the database
docker compose up postgres -d

# Visual database browser (runs at http://localhost:5555)
pnpm --filter @sfc/api exec prisma studio

# Apply new migrations after pulling changes that include one
pnpm --filter @sfc/api exec prisma migrate dev

# Seed the database (first-time setup or after a full DB wipe)
pnpm --filter @sfc/api exec prisma db seed

# Run a command scoped to one app
pnpm --filter @sfc/api <command>
pnpm --filter @sfc/web <command>
```

---

## API Testing

Test files live in `apps/api/test/` as `.http` files.

1. Install the **REST Client** extension in VS Code (by Huachao Mao)
2. Press `Ctrl+Shift+P` → "Rest Client: Switch Environment" → select **local**
3. Open any `.http` file and click **Send Request** above each `###` block

Run `apps/api/test/02-auth.http` login first, copy the `accessToken` from the response
into `adminToken` in `.vscode/settings.json`, then all other requests will resolve automatically.

---

## Diagrams

Architecture and ERD diagrams are in `docs/diagrams.drawio`. Open with the draw.io
VS Code extension or directly at [app.diagrams.net](https://app.diagrams.net/).
