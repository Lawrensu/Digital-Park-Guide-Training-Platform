# System Design

## Tech Stack Overview

| Layer | Technology |
|-------|------------|
| Web Frontend | React + Vite, TailwindCSS, shadcn/ui, TanStack Query, Recharts |
| Mobile App | React Native + Expo, NativeWind, Expo SQLite |
| Backend API | Node.js + Express, Zod, Socket.io |
| Database | PostgreSQL via Prisma ORM |
| Cache / Session | Redis via Upstash |
| Auth | JWT (access + refresh token) |
| File Storage | AWS S3 (active assets), S3 Glacier (evidence archival) |
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

## Repository Structure

Monorepo managed by pnpm workspaces and Turborepo.

```
/
├── apps/
│   ├── api/          ← Node.js + Express backend
│   ├── web/          ← React + Vite web dashboard
│   └── mobile/       ← React Native + Expo mobile app
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
- Admin and Trainer-facing dashboard
- Manages training modules, monitors guide progress, certifications, and real-time IoT alerts
- Styled with TailwindCSS + shadcn/ui component library
- Data fetching managed by TanStack Query
- Charts and progress visualisations via Recharts

### Mobile App : React Native + Expo
- Park Guide-facing application
- Delivers training content, assessments, and certification tracking
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
- Organised internally by domain: `auth`, `registrations`, `users`, `modules`, `enrolments`, `quizzes`, `certifications`, `notifications`, `iot-alerts`, `uploads`, `sync`
- Request validation via Zod schemas on every POST and PATCH
- Real-time alert push to connected admin clients via Socket.io

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
- **S3 Glacier (cold):** long-term archival of IoT evidence frames after a defined retention period
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

> **Unresolved:** On-device runtime must be confirmed as **ESP-DL or TFLite Micro** before model training begins. Standard ONNX Runtime is too large for ESP32's SRAM. This determines the export format. Blocks all AI pipeline progress.

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

- On every pull request to `develop`: lint, tests
- On merge to `main`: build Docker image, push to registry, deploy to EC2
- Failed health checks trigger automatic rollback

---

## Deployment : Docker + Docker Compose

Two Compose files:

| File | Purpose | Services |
|------|---------|---------|
| `docker-compose.yml` | Local development | api, postgres, redis |
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
| SES | Transactional email (registration, notifications) |