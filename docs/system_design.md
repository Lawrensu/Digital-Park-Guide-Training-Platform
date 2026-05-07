# System Design

## Tech Stack Overview

| Layer | Technology |
|-------|------------|
| Web Frontend | React + Vite, TailwindCSS, TanStack Query |
| Mobile App | React Native + Expo, NativeWind, Expo SQLite |
| Backend API | Node.js + Express, Zod, Socket.io |
| Database | PostgreSQL via Prisma ORM |
| Cache / Session | Redis via Upstash |
| Auth | JWT (access + refresh token) |
| File Storage | AWS S3 (active assets), S3 Glacier (evidence archival) |
| Image Processing | sharp (server-side WebP conversion on upload) |
| Certificate Generation | pdf-lib (overlay dynamic fields onto Figma-exported PDF template) |
| IoT Communication | MQTT over TLS via AWS IoT Core |
| IoT Hardware | NodeMCU ESP32 + camera module, Arduino Uno R4 Minima |
| AI Inference | YOLOv8n → ONNX (INT8 quantised) → edge deployment on ESP32 |
| Real-time Alerts | Socket.io (WebSocket) |
| Monorepo | pnpm workspaces + Turborepo |
| CI/CD | GitHub Actions |
| Deployment | Docker + Docker Compose |
| Hosting | AWS EC2, RDS, S3, IoT Core (ap-southeast-1) |
| Notifications | In-app inbox + Expo Push (mobile) |

---

## Tech Stack Rationale

### Web Frontend

**React + Vite** was chosen over Next.js because the entire platform sits behind authentication, making server-side rendering unnecessary. Vite's HMR and build times are significantly faster than webpack-based alternatives.

**TailwindCSS** enforces a consistent design constraint without separate CSS files. Combined with shadcn/ui it provides accessible, composable components without a heavy UI library dependency.

**TanStack Query** handles caching, background refetching, and loading/error state uniformly, replacing manual `useEffect` + `useState` patterns across every data-fetching page.

### Mobile

**React Native + Expo** keeps the entire codebase in JavaScript, consistent with the web and backend. Expo's managed workflow provides built-in SecureStore (secure token storage), SQLite (offline database), and Push Notifications without native build configuration.

**Expo SQLite** was chosen over WatermelonDB because WatermelonDB requires JSI and native linking, adding build complexity without meaningful benefit at this data volume.

**NativeWind** applies TailwindCSS utility classes to React Native components, maintaining styling consistency with the web codebase.

### Backend

**Node.js + Express** keeps the full stack in one language. Express is minimal and flexible; 16 domain modules are straightforward to organise without the overhead of a full framework such as NestJS.

**Zod** provides runtime validation and schema-first design. A single schema file per domain validates request payloads and serves as the shared input contract via the `packages/types` workspace.

**Socket.io** was chosen over raw WebSockets for its built-in room abstraction and automatic reconnection handling. Polling was rejected as it wastes server resources proportional to connected sessions and introduces latency bounded by the poll interval.

### Database and Storage

**PostgreSQL** suits the relational data model: modules, enrolments, quiz attempts, certifications, and payments all require joins and ACID-compliant writes. **Prisma ORM** manages schema, migrations, and the query interface in one tool, keeping data access centralised and preventing raw SQL scattered across controllers.

**Redis via Upstash** stores refresh tokens for O(1) lookup and instant invalidation on logout. Upstash is serverless and requires no persistent container, keeping the production deployment simple.

**AWS S3** stores active assets; **S3 Glacier** handles long-term archival of IoT evidence frames via a Lifecycle Policy on the bucket, requiring no application code to manage the transition after 30 days.

**sharp** converts all uploaded images to WebP server-side before writing to S3, reducing file size compared to PNG or JPEG at equivalent visual quality.

**pdf-lib** overlays dynamic fields onto a Figma-exported PDF certificate template. PDFKit was rejected because it generates PDFs programmatically from scratch and cannot replicate a designer-produced layout without reimplementing it entirely in code.

### Authentication

**JWT with refresh token rotation** provides stateless authentication that scales horizontally without sticky sessions. Access tokens are kept in memory and expire in 15 minutes; refresh tokens live in Redis and expire in 7 days.

### IoT and AI

**MQTT over TLS** is lightweight and designed for constrained hardware. It operates on a publish/subscribe model suited to event-driven detection alerts, with lower overhead than HTTP polling from the device.

**AWS IoT Core** manages device certificates and MQTT broker infrastructure. A routing rule forwards detection events to S3 for evidence storage and HTTP-POSTs to the Node.js API for alert ingest, without additional server infrastructure.

**YOLOv8n** is the smallest variant in the YOLOv8 family. It is exported to ONNX and INT8 quantised to reduce memory footprint for edge deployment on the ESP32, eliminating the need for a cloud GPU and enabling detection without internet connectivity.

### Tooling and Infrastructure

**pnpm + Turborepo** reduce disk usage via a content-addressable package store and add task-level caching across the monorepo so unchanged packages do not rebuild on every CI run.

**GitHub Actions** handles lint and validation on pull requests and automated deployment to EC2 on merge to `main`, requiring no separate CI tooling beyond the existing repository.

**Docker + Docker Compose** ensures the API container runs identically in local development and on EC2. Local Postgres runs in a container; production points to RDS and Upstash, keeping the images environment-agnostic.

**AWS ap-southeast-1** (Singapore) is the closest region to Sarawak, Malaysia. Consolidating EC2, RDS, S3, IoT Core, and SES in one region minimises latency and keeps data residency consistent.

---

## Repository Structure

Monorepo managed by pnpm workspaces and Turborepo.

```
/
├── apps/
│   ├── api/          ← Node.js + Express backend
│   ├── web/          ← React + Vite web application — both Admin/Trainer and Park Guide
│   └── mobile/       ← React Native + Expo mobile application — both Admin/Trainer and Park Guide
├── packages/
│   ├── types/        ← shared Zod schemas and JS type definitions
│   └── utils/        ← shared utility functions
├── docs/
├── iot_ai/           ← ESP32 firmware + AI model pipeline
├── docker-compose.yml
├── docker-compose.prod.yml
├── turbo.json
├── pnpm-workspace.yaml
└── .env.example
```

---

## Frontend

### Web App : React + Vite
- Accessible to both Admin/Trainer and Park Guide — role-based access control determines visible routes after login
- Admin/Trainer features: module management, guide oversight, registration review, quiz grading, certification issuance, IoT alert monitoring, notifications, station management, admin account settings
- Park Guide features: registration (public, pre-login), browse and enrol in modules, view content, take quizzes, view certifications, view badges, notifications, profile
- Styled with TailwindCSS + shadcn/ui component library
- Data fetching and caching managed by TanStack Query

### Mobile App : React Native + Expo
- Accessible to both Admin/Trainer and Park Guide — role-based access control determines visible screens after login
- Park Guide features: same as web guide features, with the addition of full offline operation
- Admin/Trainer features: same as web admin features accessible from mobile
- **Offline-first:** guides work in areas with no connectivity (day trips to multi-day expeditions)
- Local data stored in Expo SQLite; synced to API when connectivity returns
- Styled with NativeWind (TailwindCSS for React Native)
- Push notifications via Expo Push Notifications

---

## Backend

### REST API : Node.js + Express
- Single source of business logic and data access
- Both web and mobile clients communicate exclusively through this API
- The database is never exposed directly to any client
- Routes follow RESTful conventions, prefixed `/api/`
- Organised internally by domain: `auth`, `registrations`, `users`, `stations`, `modules`, `content-items`, `enrolments`, `quizzes`, `quiz-attempts`, `payments`, `certifications`, `badges`, `notifications`, `iot-alerts`, `uploads`, `sync`
- Request validation via Zod schemas on every POST and PATCH
- Real-time alert push to connected admin clients via Socket.io
- All uploaded images converted to WebP server-side via `sharp` before storing to S3

---

## Authentication

JWT with refresh token rotation. No session-based auth.

| Token | Storage | Lifetime | Purpose |
|-------|---------|----------|---------|
| Access token | Memory (client) | 15 minutes | Sent with every API request via `Authorization: Bearer` header |
| Refresh token | Redis (server-side) | 7 days | Silently obtain a new access token on expiry |

- Passwords hashed with bcrypt
- Refresh tokens stored in Redis via Upstash; invalidated on logout
- Mobile stores refresh token in Expo SecureStore
- Web stores refresh token in HttpOnly cookie
- On 401, client silently calls `POST /api/auth/refresh`. If refresh token is also expired, redirect to login.
- On guide account approval: a one-time activation token is generated, its hash + expiry stored in `PasswordResetToken` table. Guide receives email with an activation link. Token expires in 24 hours. Resend activation reuses the same endpoint, invalidating the previous token first.
- **Idle session timeout:** authenticated web sessions auto-logout after 14 minutes of inactivity. A 60-second countdown modal gives the user a chance to stay logged in before logout is triggered client-side.

---

## Database

### PostgreSQL via Prisma ORM
- Primary source of truth for all structured data
- Prisma manages schema, migrations, and query interface
- Binary assets (videos, images, PDFs, evidence frames) are never stored in the database — only the S3 **key** is stored as a reference (not the full URL, since URLs are generated on-demand as pre-signed URLs with expiry)
- RegistrationApplication records are retained permanently as an audit trail,
  regardless of approval or rejection outcome.
- IC/Passport number is stored on both RegistrationApplication (original submission)
  and the User record (verified identity for ongoing use).
- IoT device-to-guide assignment history is tracked in a DeviceAssignment table,
  not just current assignment on the IoTDevice record.

### Redis via Upstash
- Stores refresh tokens mapped to user IDs
- Handles token invalidation on logout and refresh token rotation
- Stateless from the API's perspective, no in-memory session state

### AWS S3
- **S3 Standard (hot):** active training media, uploaded CVs, certificate PDFs, user-facing assets
- **S3 Glacier (cold):** long-term archival of IoT evidence frames. AWS S3 Lifecycle Policy automatically transitions evidence frames from S3 Standard → S3 Glacier after **30 days**. No application code required as it is configured once on the S3 bucket. 30 days provides sufficient window for admins to review and flag alerts before frames become cold-storage only.
- Files are accessed via pre-signed URLs generated on-demand by the API (short expiry, typically 15 minutes)

---

## IoT + AI Pipeline

### Hardware
- **NodeMCU ESP32:** with camera module that is body-worn by park guide during tours
- **Arduino Uno R4 Minima:** controls peripheral hardware (buzzer, LEDs, tactile buttons) for on-device alerts

### AI Inference — On-Device (Edge)
- Model: YOLOv8n trained in PyTorch, exported to ONNX (INT8 quantised) for edge deployment
- Inference runs directly on the ESP32, no server-side GPU required
- Detects: plant damage, wildlife disturbance, according to project scope.
- On detection: captures evidence frame, triggers Arduino alert (buzzer + LED)

### Detection Event Flow
```
ESP32 detects → captures evidence frame
→ MQTT over TLS → AWS IoT Core
→ IoT Core rule: stores frame to S3, HTTP POST to Node.js API
→ API saves alert to PostgreSQL
→ API emits Socket.io event to connected admin dashboard
→ Admin notified via push notification + email (AWS SES)
```

> **In progress:** Detection model confirmed as YOLOv8. On-device runtime and export format are pending hardware validation — standard ONNX Runtime is too large for ESP32's SRAM. IoT pipeline integration with the platform is in progress.

---

## Live Alerts : Socket.io

- AWS IoT Core posts detection event to the Node.js API via HTTP (internal endpoint, protected by shared secret)
- API persists the alert, then emits to admin clients via Socket.io event `iot:alert`
- Admins see the alert on the dashboard in real time without polling

**Event payload:**
```json
{
"alertId": "uuid",
"deviceId": "esp32-001",
"guideId": "uuid",
"detectionType": "PLANT_DAMAGE | WILDLIFE_DISTURBANCE",
"detectedAt": "ISO timestamp",
"evidenceS3Key": "evidence/2026-04-09/abc123.jpg",
"confidence": 0.94
}
```

---

## Offline Sync : Mobile

- Guide completes training content and quiz attempts with no internet (Expo SQLite stores everything locally)
- On reconnect, app sends batched sync payload to `POST /api/sync`
- Each progress item includes device-side `completedAt` timestamp
- **Conflict policy: last-write-wins.** Offline submissions are accepted even if the module was archived during the offline period.

---

## CI/CD : GitHub Actions

- On every pull request to `dev`: lint, tests
- On merge to `main`: build Docker image, push to registry, deploy to EC2
- Failed health checks trigger automatic rollback

---

## Deployment : Docker + Docker Compose

Two Compose files:

| File | Purpose | Services |
|------|---------|---------|
| `docker-compose.yml` | Local development | api, postgres |
| `docker-compose.prod.yml` | EC2 deployment | api only (RDS + Upstash replace local containers) |

- `apps/web` and `apps/mobile` are not containerised as Vite and Expo run natively during development
- Volume mounts on the `api` service allow hot reload without container rebuild

---

## Hosting : AWS (ap-southeast-1)

| Service | Usage |
|---------|-------|
| EC2 | Hosts the Node.js API container |
| RDS | Managed PostgreSQL |
| S3 | Active file storage |
| S3 Glacier | Evidence frame archival |
| IoT Core | MQTT broker for ESP32 device communication |
| SES | Transactional email (registration, activation, notifications) |