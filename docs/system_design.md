# System Design

## Tech Stack Overview

| Layer | Technology |
|-------|------------|
| Web Frontend | React + Vite, TailwindCSS |
| Mobile App | React Native + Expo, TailwindCSS via NativeWind |
| Backend API | Node.js + Express |
| AI / IoT Service | Python + FastAPI, YOLOv8 + OpenCV |
| Database | PostgreSQL via Prisma ORM |
| File & Video Storage | AWS S3 (hot), S3 Glacier (cold/long-term archival) |
| Real-time Alerts | WebSocket via Socket.io |
| CI/CD | GitHub Actions |
| Deployment | Docker + Docker Compose |
| Hosting | AWS (EC2, S3, RDS) |

---

## Frontend

### Web App — React + Vite
- Admin and Trainer-facing dashboard
- Manages training content, monitors guide progress, certifications, and real-time IoT alerts
- Styled with TailwindCSS

### Mobile App — React Native + Expo
- Park Guide-facing application
- Delivers training content, assessments, and certification tracking
- Must operate fully offline, guides frequently work in areas without connectivity (Assuming that the connectivity within the forest is minimal/non-existent)
- Styled with TailwindCSS via NativeWind

---

## Backend

### REST API — Node.js + Express
- Single source of business logic and data access
- Both web and mobile clients communicate exclusively through this API
- The database is never exposed directly to any client
- Routes follow RESTful conventions, prefixed `/api/v1/`
- Organised internally by domain module: `auth`, `users`, `training`, `assessments`, `certifications`, `alerts`, `video`, `notifications`

### AI / IoT Service — Python + FastAPI (To be confirmed again)
- Isolated microservice for all computer vision and real-time video analysis
- Receives live video streams from IoT body-worn cameras
- Runs YOLOv8 inference to detect prohibited activities
- On detection: extracts video clip via FFmpeg, uploads to S3, posts alert event to the Node.js API
- Isolated from the Node.js API because ML inference is CPU/GPU-intensive and must not block the REST API event loop

> **Hardware is not yet specified.** Camera model, connectivity method (WiFi / 4G), and inference hardware (edge device vs. server GPU) must be confirmed. This affects stream ingestion method (RTSP, WebRTC, or HTTP chunked upload) and whether inference runs on-device or centrally.

**Prohibited activities to detect:**
- Plucking or damaging protected plants
- Relocating, disturbing, or handling wildlife
- Any other actions violating park regulations

---

## Authentication

**Current:** Built-in session-based authentication.

**Planned:** JWT with refresh token rotation.

| Token | Lifetime | Purpose |
|-------|----------|---------|
| Access token | 15 minutes | Sent with every API request |
| Refresh token | 30 days | Silently obtain a new access token on expiry |

- Passwords hashed with bcrypt
- Refresh tokens stored in Expo SecureStore on mobile, HttpOnly cookie on web
- On refresh token expiry, user is required to re-authenticate

---

## Database

### PostgreSQL via Prisma ORM
- Primary source of truth for all structured data
- Prisma manages the schema, migrations, and provides type-safe queries
- Video files are not stored in the database — only the S3 URL is stored as a reference

### AWS S3
- Stores all binary assets: training videos, course media, body-worn camera footage, and evidence clips
- **Hot storage (S3 Standard):** recently captured footage and active training media requiring frequent access
- **Cold storage (S3 Glacier):** long-term archival of older evidence footage where infrequent retrieval is acceptable and cost reduction is the priority

---

## Live Alerts — WebSocket via Socket.io

- The AI service posts a detection event to the Node.js API over HTTP
- The Node.js API pushes the alert in real time to connected admin clients via Socket.io
- Admins receive alerts on the dashboard without polling or refreshing

---

## CI/CD — GitHub Actions

- Runs on every pull request: lint, type check, tests
- Runs on merge to `main`: build Docker image, push to registry, deploy to hosting environment
- Failed health checks trigger automatic rollback

---

## Deployment — Docker + Docker Compose

- Every service runs in a Docker container: Node.js API, Python AI service, PostgreSQL, Redis
- Docker Compose orchestrates the full local stack with a single command
- The same Docker image used locally is what gets deployed to production — no environment-specific surprises

---

## Hosting — AWS

| Service | Usage |
|---------|-------|
| EC2 | Hosts the Node.js API and Python AI service containers |
| RDS | Managed PostgreSQL — handles backups, patching, and connection pooling |
| S3 | Video and media object storage |
| S3 Glacier | Long-term video archival |