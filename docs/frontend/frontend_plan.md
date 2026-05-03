# Frontend Implementation Plan (PERHAPS NEED AN UPDATE)

**SFC Digital Park Guide Training Platform**

---

## Sprint Scope — What Gets Built When

This is the most important section to read first. The proposal backlog assigns the web dashboard to Sprint 1 and the mobile app implementation to Sprint 2. Building out of this order wastes time and will not satisfy the sprint report requirements.

| Deliverable | Owner | Sprint |
|---|---|---|
| Web dashboard — Figma wireframes (all pages) | Cherylynn | Sprint 1 |
| Mobile app — Figma wireframes (all screens) | Xavier | Sprint 1 |
| Web dashboard — clickable Figma prototype | Cherylynn | Sprint 1 |
| Mobile app — clickable Figma prototype | Xavier | Sprint 1 |
| Web dashboard — implemented React screens | Cherylynn | Sprint 1 |
| Mobile app — implemented screens | Xavier | Sprint 2 |
| Mobile offline sync engine | Xavier | Sprint 2 |

### Cherylynn — Sprint 1 Web Implementation Priority

Build in this exact sequence. Each item depends on the one above it.

1. API client + auth guard + layout shell (sidebar, topbar, toast system) — nothing else renders correctly without this
2. `/login`
3. `/dashboard`
4. `/registrations` + `/registrations/:id`
5. `/modules` + `/modules/new` + `/modules/:id/edit`
6. `/modules/:id/content` — the content and quiz builder; this is the most complex page, allocate the most time here
7. `/guides` + `/guides/:id`
8. `/quiz-reviews` + `/quiz-reviews/:attemptId`
9. `/certifications` + `/certifications/issue/:attemptId`
10. `/iot-alerts` + `/iot-alerts/:alertId`
11. `/notifications`
12. `/settings/admins`
13. `/settings/stations`

If time runs short within Sprint 1, items 10–12 are the lowest risk to defer to Sprint 2 since they depend on IoT and notification APIs which may not be ready from the backend anyway.

### Xavier — Sprint 1 Mobile Priority

Sprint 1 is **Figma only** for mobile. No React Native implementation yet.

Complete wireframes and a clickable prototype for all screens in this order:

1. `LoginScreen`
2. `HomeScreen`
3. `ModulesScreen` + `ModuleDetailScreen`
4. `ContentViewerScreen` (show one example of each content type: text, image, video, infographic, quiz entry point)
5. `QuizScreen` + `QuizResultScreen`
6. `NotificationsScreen`
7. `ProfileScreen` + `CertificationsScreen` + `CertificationDetailScreen` + `BadgesScreen`

The clickable prototype must link these screens in a coherent user flow so it can be demonstrated: Login → Home → Browse Modules → Enrol → View Content → Take Quiz → See Result → Check Profile → View Certification.

---

## Before You Start — Read This First

### How the frontend connects to the backend

- All data comes from the REST API at `/api/`. You never touch the database directly.
- Use **TanStack Query** for all API calls on web. It handles caching, loading states, and refetching. Do not use `useEffect` + `fetch` manually.
- Auth is JWT-based. The access token lives **in memory** (not localStorage). The refresh token lives in an HttpOnly cookie (web) or Expo SecureStore (mobile). You do not manage this manually — the auth module handles it.
- When a request returns `401`, the client silently calls `POST /api/auth/refresh` and retries. If refresh also fails, redirect to login. This is handled at the API client layer — not in individual components.
- File downloads (certificates, CVs) are **pre-signed URLs** returned by the API. They expire in 15 minutes. Never store them — always request fresh on demand.
- Real-time IoT alerts come via **Socket.io**. The admin dashboard must maintain a persistent socket connection when logged in.

### Two separate applications

| App | Tech | Who uses it | Where |
|-----|------|-------------|-------|
| Web App | React + Vite + TailwindCSS + shadcn/ui | Admin/Trainer and Park Guide | `apps/web/` |
| Mobile App | React Native + Expo + NativeWind | Admin/Trainer and Park Guide | `apps/mobile/` |

Both roles use both platforms. Role-based access control determines which routes and screens are visible after login.

### Shared packages

Shared Zod schemas and TypeScript-equivalent JS type definitions live in `packages/types/`. Import from there, do not redefine types locally.

---

## Web App — Admin/Trainer and Park Guide

**Tech:** React + Vite, TailwindCSS, shadcn/ui, TanStack Query, Socket.io client

### Route Structure

```
(Public — no auth required)
/register
/login

(Admin/Trainer — redirected here after login if role = ADMIN)
/dashboard
/registrations
/registrations/:id
/modules
/modules/new
/modules/:id/edit
/modules/:id/content
/guides
/guides/:id
/quiz-reviews
/quiz-reviews/:attemptId
/certifications
/certifications/issue/:attemptId
/iot-alerts
/iot-alerts/:alertId
/notifications
/settings/admins
/settings/stations

(Park Guide — redirected here after login if role = GUIDE)
/home
/modules (browse published modules)
/modules/:id
/modules/:id/content/:itemId
/quiz/:quizId
/quiz/:quizId/result
/certifications (own certifications)
/certifications/:id
/badges
/notifications (own inbox)
/profile
```

---

### Page-by-Page Breakdown

---

#### `/login`

**What it is:** Shared login page for both Admin/Trainer and Park Guide.

**What it does:**
- `POST /api/auth/login` with credentials
- On success: store access token in memory, redirect based on role claim in JWT — Admin → `/dashboard`, Guide → `/home`
- On failure: show error message inline (do not clear the form)

**Key UI notes:**
- Link to `/register` for guides who do not yet have an account
- "Resend activation link" option for guides whose activation email expired

---

#### `/register`

**What it is:** Public registration form for park guides. No auth required.

**What it does:**
- Collects: first name, last name, email, IC/passport number, address, reason for applying, CV upload (PDF)
- CV upload flow: call `POST /api/uploads/presign` to get a pre-signed S3 URL, upload directly to S3, then send the returned S3 key as `cvS3Key` in the registration payload
- `POST /api/registrations` on submit
- On success: show confirmation message ("Your application has been submitted. You will receive an email once reviewed.")
- Admin accounts are never created via this form

---

#### `/dashboard`

**What it is:** Landing page after login. Overview of the platform state.

**What it shows:**
- Summary stats: total registrations, active guides, pending quiz reviews, certs issued
- Recent activity feed: last 4 notifications from the admin's inbox
- Quick actions: shortcut buttons to Registrations, New Module, Certifications, IoT Alerts

**API calls:**
- `GET /api/registrations?limit=1` — total count
- `GET /api/users?role=GUIDE&status=ACTIVE&limit=1` — active guide count
- `GET /api/quiz-attempts?status=PENDING_REVIEW&limit=1` — pending review count
- `GET /api/certifications?limit=1` — certs issued count
- `GET /api/modules?status=PUBLISHED&limit=1` — live modules count
- `GET /api/notifications?limit=4` — recent activity feed

> **Note:** Charts (Recharts) were originally planned here but removed. The required `GET /api/dashboard/stats` aggregate endpoint was not implemented in the backend. The stat cards cover the dashboard's informational needs with real live data.

**Socket.io:** Connect here on mount. Listen for `iot:alert` event — when received, show a toast notification and increment the alert badge count. Do not navigate away automatically.

---

#### `/registrations`

**What it is:** List of all park guide registration applications.

**What it shows:**
- Filterable table: All / Pending / Approved / Rejected
- Each row: applicant name, email, submitted date, status badge, "Review" button

**API calls:**
- `GET /api/registrations?status=PENDING|APPROVED|REJECTED`

---

#### `/registrations/:id`

**What it is:** Review screen for a single registration application.

**What it shows:**
- Applicant details: full name, IC/passport number, address, reason for applying
- CV download button — calls `GET /api/registrations/:id/cv-url`, opens pre-signed URL in new tab
- Approve button → opens a modal asking admin to set `start_date`, then `POST /api/registrations/:id/approve`
- Reject button → opens a modal with optional rejection reason text field, then `POST /api/registrations/:id/reject`

**After approval or rejection:**
- Show success state, redirect back to `/registrations`
- The API handles sending the email — you just trigger the action

---

#### `/modules`

**What it is:** List of all training modules.

**What it shows:**
- Cards or table: module title, status badge (DRAFT / PUBLISHED / ARCHIVED), enrolment count, created date
- "New Module" button → navigates to `/modules/new`
- Filter by status

**API calls:**
- `GET /api/modules`

---

#### `/modules/new` and `/modules/:id/edit`

**What it is:** Create or edit a module's metadata (not its content).

**Fields:**
- Title (text input)
- Description (rich text editor — use a simple one like `react-quill` or plain textarea for MVP)
- Status selector: DRAFT / PUBLISHED / ARCHIVED

**API calls:**
- POST: `POST /api/modules`
- Edit: `PATCH /api/modules/:id`

**Important:** Changing status to PUBLISHED sends a push notification to all guides. The backend handles this — you just PATCH the status.

---

#### `/modules/:id/content`

**What it is:** The most complex admin page. This is where the module's content items are built and ordered.

**What it shows:**
- Ordered list of content items (drag to reorder — use `@dnd-kit/core` or similar)
- Each item shows its type icon, title, and actions (edit, delete, move up/down)
- "Add content item" button → opens a type selector modal

**Content type creation flows (each opens its own modal or inline panel):**

| Type | What admin fills in |
|------|-------------------|
| `TEXT` | Rich text editor |
| `IMAGE` | File upload (PNG/JPEG/WebP accepted — backend converts to WebP) |
| `VIDEO` | Choose S3 upload or YouTube URL; toggle `allow_offline` if S3 |
| `INFOGRAPHIC` | Choose subtype (HOTSPOT / SCENARIO / STEPPER), then type-specific builder (see below) |
| `QUIZ` | Title, pass score %, time limit, `show_score_to_guide` toggle; then add questions |

**Infographic builders (simplified for MVP):**
- `HOTSPOT`: Upload image, place hotspot markers with x/y as percentage (0–1), add popup text per marker. Store as JSON.
- `SCENARIO`: Text-based decision tree builder. Add question node, add choices, each choice links to next node.
- `STEPPER`: Add ordered steps, each with text and optional image upload.

**Quiz question builder:**
- Add questions one by one
- Choose question type: MCQ / TRUE_FALSE / SHORT_ANSWER / LONG_ANSWER
- For MCQ and TRUE_FALSE: add options, mark the correct one, set mark weight
- For SHORT/LONG: just set mark weight (no options)
- Drag to reorder questions

**API calls:**
- `GET /api/modules/:id/content` — fetch ordered content items
- `POST /api/modules/:id/content` — add a content item
- `PATCH /api/content/:itemId` — edit
- `DELETE /api/content/:itemId` — delete
- `PATCH /api/modules/:id/content/reorder` — send new order array
- `POST /api/quizzes` — create quiz (linked to module)
- `POST /api/quizzes/:quizId/questions` — add question
- `POST /api/uploads/image` / `POST /api/uploads/video` — file upload endpoints

---

#### `/guides`

**What it is:** List of all approved park guides.

**What it shows:**
- Table: name, username, email, status (ACTIVE / INACTIVE / SUSPENDED), station, start date, enrolment count, certification count
- Click row → goes to `/guides/:id`
- Filter by status
- Filter by station — dropdown populated from `GET /api/stations`

**API calls:**
- `GET /api/users?role=GUIDE`
- `GET /api/users?role=GUIDE&stationId=:id` — when station filter applied
- `GET /api/stations` — to populate filter dropdown

---

#### `/guides/:id`

**What it is:** Admin view of a specific guide's profile and progress.

**What it shows:**
- Guide info: name, username, email, IC/passport, station, start date, status
- Enrolments table: module name, enrolment date, due date, progress
- Quiz attempt history: quiz name, attempt number, score, status
- Certifications earned: module, issue date, expiry date, download button
- Badges earned
- "Suspend account" / "Reactivate account" action button
- "Send custom notification" button → modal with title + body fields

**API calls:**
- `GET /api/users/:id`
- `GET /api/users/:id/enrolments`
- `GET /api/users/:id/quiz-attempts`
- `GET /api/users/:id/certifications`
- `GET /api/users/:id/badges`
- `PATCH /api/users/:id/status`
- `POST /api/notifications` — custom notification

---

#### `/quiz-reviews`

**What it is:** List of all quiz attempts pending admin grading.

**What it shows:**
- Table: guide name, module name, quiz name, attempt number, submitted at, status
- Filter: PENDING_REVIEW / GRADED
- Click row → `/quiz-reviews/:attemptId`

**API calls:**
- `GET /api/quiz-attempts?status=PENDING_REVIEW`

---

#### `/quiz-reviews/:attemptId`

**What it is:** The grading screen for a specific quiz attempt.

**What it shows:**
- Guide name and quiz info at the top
- Each question listed with:
  - Question text
  - Guide's response (selected option for MCQ/TF, text for short/long)
  - For auto-scored questions: show awarded score (locked, not editable)
  - For SHORT/LONG questions: score input field (0 to max_score)
- Running total score as admin fills in scores
- "Submit Grades" button → marks attempt as GRADED, guide is notified

**API calls:**
- `GET /api/quiz-attempts/:attemptId` — full attempt with all question attempts
- `POST /api/quiz-attempts/:attemptId/grade` — submit all manual scores

**After submitting:**
- If pass score met → redirect to `/certifications/issue/:attemptId`
- If not → redirect back to `/quiz-reviews` with a "Guide failed" toast

---

#### `/certifications`

**What it is:** List of all issued certifications.

**What it shows:**
- Table: guide name, module, issue date, expiry date, download link
- Filter by module

**API calls:**
- `GET /api/certifications`

---

#### `/certifications/issue/:attemptId`

**What it is:** The certificate issuance form. Reached after a quiz attempt is graded and passed.

**What it shows:**
- Form fields admin fills in:
  - Company Name
  - Issuer Name
  - Issuer Title
  - Issue Date (default today)
  - Expiry Date (optional toggle)
- Preview note: "Certificate will be generated from the approved Figma template"
- "Issue Certificate" button

**On submit:**
- `POST /api/certifications` with the form data and `quiz_attempt_id`
- Backend generates the PDF via pdf-lib, stores to S3, sends push + in-app notification to guide
- Redirect to `/certifications` on success

---

#### `/iot-alerts`

**What it is:** List of all IoT detection events.

**What it shows:**
- Table: device ID, guide name, detection type, confidence score, detected at, status (PENDING / CONFIRMED / FALSE_DETECTION)
- Filter by status and detection type
- New PENDING alerts should visually stand out (e.g. highlighted row or badge)
- Click row → `/iot-alerts/:alertId`

**Socket.io:** When `iot:alert` event arrives, prepend the new alert to the list without a full page refresh. Use TanStack Query's `invalidateQueries` or manual cache update.

**API calls:**
- `GET /api/iot-alerts`

---

#### `/iot-alerts/:alertId`

**What it is:** Detail view for a single IoT alert.

**What it shows:**
- Alert metadata: device ID, guide name, detection type, confidence, detected at
- Evidence frame image — load via `GET /api/iot-alerts/:alertId/evidence-url` (pre-signed, opens in page)
- Two action buttons: "Confirm Violation" and "Mark as False Detection"
- `PATCH /api/iot-alerts/:alertId/flag` with `status: CONFIRMED | FALSE_DETECTION`

---

#### `/notifications`

**What it is:** Admin's in-app notification inbox.

**What it shows:**
- List of notifications: title, body, timestamp, read/unread indicator
- Click to mark as read: `PATCH /api/notifications/:id/read`
- "Send custom notification" button → modal: choose target (specific guide or all guides), fill title + body → `POST /api/notifications/custom`

**API calls:**
- `GET /api/notifications` (admin's own inbox)
- `POST /api/notifications/custom`

---

#### `/settings/admins`

**What it is:** Admin account management.

**What it shows:**
- List of all admin accounts: username, email, created date
- "Add Admin" button → modal: first name, last name, email → `POST /api/users/admins`
- New admin receives an activation email (same flow as guide activation)

**API calls:**
- `GET /api/users?role=ADMIN`
- `POST /api/users/admins`

---

#### `/settings/stations`

**What it is:** Station management — admin creates and manages the list of SFC park locations that guides are assigned to.

**What it shows:**
- List of all stations: name, number of guides assigned, created date
- "Add Station" button → modal: station name field → `POST /api/stations`
- Edit button per row → inline or modal: update name → `PATCH /api/stations/:id`
- Delete button per row → `DELETE /api/stations/:id`; only allow delete if no guides are currently assigned to that station (show error if guides exist)

**API calls:**
- `GET /api/stations`
- `POST /api/stations`
- `PATCH /api/stations/:id`
- `DELETE /api/stations/:id`

---

### Web App — Global Components

These are not pages but must be built and shared across all pages:

- **Sidebar navigation** — links to all main sections, notification badge count, logged-in admin name
- **Top bar** — page title, notification bell icon, logout button
- **Auth guard** — wraps all protected routes; redirects to `/login` if no valid token
- **Toast system** — for success/error feedback on actions (use shadcn/ui Toast)
- **Socket provider** — wraps the app, initialises Socket.io connection on login, tears down on logout
- **API client** — centralised Axios or fetch wrapper that attaches the access token and handles 401 silent refresh

---

## Mobile App — Park Guide Application

**Tech:** React Native + Expo, NativeWind, Expo SQLite, TanStack Query, Expo Push Notifications, Expo SecureStore

### Key Principle: Offline-First

The mobile app must work **fully offline**. This means:
- All content the guide has downloaded is stored in Expo SQLite
- All progress (quiz answers, content completion) is written to SQLite first, then synced to the API when connectivity returns
- The app must detect connectivity using `@react-native-community/netinfo`
- On reconnect: call `POST /api/sync` with batched progress payload
- Never assume connectivity. Every action that would normally hit the API must have an offline fallback that queues to SQLite

---

### Screen Structure

```
(Auth)
  LoginScreen

(Main — Tab Navigation)
  HomeScreen (tab)
  ModulesScreen (tab)
  NotificationsScreen (tab)
  ProfileScreen (tab)

(Module flow — Stack within Modules tab)
  ModuleDetailScreen
  ContentViewerScreen
  QuizScreen
  QuizResultScreen

(Profile sub-screens)
  CertificationsScreen
  CertificationDetailScreen
  BadgesScreen
```

---

### Screen-by-Screen Breakdown

---

#### `LoginScreen`

**What it does:**
- Username + password input
- `POST /api/auth/login`
- On success: store refresh token in Expo SecureStore, store access token in memory, navigate to Home
- "Resend activation link" option — navigates to a simple email input screen that calls `POST /api/auth/resend-activation`

---

#### `HomeScreen`

**What it shows:**
- Welcome message with guide's name
- "Continue Learning" card — most recently active enrolment, with progress bar
- Upcoming deadlines — list of enrolments with `due_at` within the next 7 days
- Recent notifications — last 3 unread

**API calls (cached in SQLite for offline):**
- `GET /api/users/me`
- `GET /api/enrolments/me?limit=1&sort=lastActive`
- `GET /api/enrolments/me?dueSoon=true`
- `GET /api/notifications/me?unread=true&limit=3`

---

#### `ModulesScreen`

**What it shows:**
- List of all PUBLISHED modules
- Each card: title, description snippet, enrolment status (Enrolled / Not Enrolled), progress if enrolled
- Search bar to filter by title
- Tap a module → `ModuleDetailScreen`

**API calls:**
- `GET /api/modules?status=PUBLISHED`

**Offline behaviour:** If offline and no cached data, show last-fetched list from SQLite with a "You're offline" banner. If never fetched, show empty state.

---

#### `ModuleDetailScreen`

**What it shows:**
- Module title and full description
- List of content items (ordered) — each shows type icon and title
- Enrol button (if not enrolled) → `POST /api/enrolments`
- Due date if enrolled
- Progress indicator (X of Y items completed)
- Start / Continue button → navigates to `ContentViewerScreen` at next incomplete item

**API calls:**
- `GET /api/modules/:id`
- `GET /api/modules/:id/content` — fetches and caches all content items to SQLite on enrolment
- `GET /api/enrolments/me/:moduleId` — enrolment status and progress

---

#### `ContentViewerScreen`

**What it is:** The core learning screen. Renders the current content item and handles navigation between items.

**Rendering by type:**

| Type | How to render |
|------|--------------|
| `TEXT` | Render HTML string using `react-native-render-html` |
| `IMAGE` | Full-width WebP image with pinch-to-zoom |
| `VIDEO` (S3, allow_offline=true) | Cached video via Expo AV |
| `VIDEO` (YouTube or allow_offline=false) | WebView embed; show "unavailable offline" banner when offline |
| `INFOGRAPHIC` (HOTSPOT) | Image with tappable coordinate regions, popup on tap |
| `INFOGRAPHIC` (SCENARIO) | Decision tree: render question, show choices as buttons, walk to next node on choice |
| `INFOGRAPHIC` (STEPPER) | Step-by-step with Next/Back navigation, optional image per step |
| `QUIZ` | Navigate to `QuizScreen` |

**Progress tracking:**
- When guide reaches the end of a content item (scrolls to bottom / video ends / stepper completes), mark it as complete
- Write completion to SQLite immediately with device-side `completedAt` timestamp
- If online: also call `POST /api/progress` immediately
- If offline: queue in SQLite sync table, send on reconnect

**Navigation:**
- "Next" button moves to the next content item
- "Back" button goes to previous
- Last item → show module completion screen, trigger sync

---

#### `QuizScreen`

**What it is:** The quiz-taking experience.

**What it shows:**
- One question at a time (or scrollable list — your choice for UX)
- Timer countdown if time limit is set (show remaining time in header)
- Question type rendering:
  - MCQ: radio button options
  - TRUE_FALSE: two large buttons (True / False)
  - SHORT_ANSWER: single-line text input
  - LONG_ANSWER: multi-line text input
- Progress indicator (Question X of Y)
- "Submit Quiz" button on last question

**On submit:**
- Write all answers to SQLite first
- If online: `POST /api/quiz-attempts` with all question responses
- If offline: queue in SQLite sync table
- Navigate to `QuizResultScreen`

**Important:** If the timer runs out, auto-submit whatever has been answered.

---

#### `QuizResultScreen`

**What it shows (online flow):**
- If `show_score_to_guide = true` and attempt is GRADED: show score, pass/fail message
- If attempt is PENDING_REVIEW (has short/long questions): show "Your answers have been submitted and are under review. You will be notified when graded."
- If failed: show "Would you like to retake?" button (Billplz payment flow — deferred, placeholder for now)

**What it shows (offline flow):**
- "Your quiz has been saved. It will be submitted when you reconnect."

---

#### `NotificationsScreen`

**What it shows:**
- Chronological list of all in-app notifications for the guide
- Unread items visually distinct
- Tap to mark as read: `PATCH /api/notifications/:id/read`
- Notification types and their display:
  - `MODULE_PUBLISHED` → "New module available: [title]" → tap navigates to ModuleDetailScreen
  - `DEADLINE_REMINDER` → "Deadline in 24 hours: [module]" → tap navigates to ModuleDetailScreen
  - `QUIZ_RESULT` → "Your result for [quiz]: [pass/fail]" → tap navigates to QuizResultScreen
  - `CERTIFICATE_APPROVED` → "Certificate issued for [module]" → tap navigates to CertificationDetailScreen
  - `CUSTOM` → admin message: show title + body

**API calls:**
- `GET /api/notifications/me`

---

#### `ProfileScreen`

**What it shows:**
- Guide info: name, username, email, station, start date
- Badges row (horizontally scrollable) → tap navigates to `BadgesScreen`
- Certifications section → tap navigates to `CertificationsScreen`
- Stats: total modules completed, total certifications
- Logout button

---

#### `CertificationsScreen`

**What it shows:**
- List of all earned certifications
- Each: module title, issue date, expiry date (if set), "Download" button

**Download flow:**
- Tap "Download" → `GET /api/certifications/:id/download-url` → receives pre-signed URL → open in device browser or use Expo FileSystem to download PDF

---

#### `CertificationDetailScreen`

**What it shows:**
- Full certificate metadata: company name, issuer, issue date, expiry date, certification ID
- QR code (the verify URL is on the certificate itself — display as static info)
- Download button

---

#### `BadgesScreen`

**What it shows:**
- Grid of all earned badges
- Each: badge image, name, description, date earned
- Visual treatment: unearned badges shown greyed out if you want to motivate (optional)

---

### Mobile App — Global Concerns

- **Offline sync manager:** A background service that watches `NetInfo`, and on transition from offline → online, calls `POST /api/sync` with all queued SQLite progress rows. Show a subtle "Syncing..." indicator while this runs.
- **Push notification handler:** Use `expo-notifications`. On app foreground, update notification badge count. On background tap, navigate to the relevant screen based on notification type.
- **Auth persistence:** On app launch, read refresh token from Expo SecureStore. If present, silently call `POST /api/auth/refresh` to get a new access token before showing the main app. If it fails, show login screen.
- **Connectivity banner:** When offline, show a persistent non-blocking banner at the top of the screen ("You're offline — progress is saved locally").

---

## What You Do NOT Build

To avoid confusion — these are explicitly out of scope for the frontend:

- PDF certificate generation — this happens server-side, you only display/download the result
- Push notification delivery — Expo handles this, you only handle receiving and displaying them
- Payment flow (Billplz) — deferred, do not implement until confirmed

---

## API Contract Expectation

You will need to coordinate with the backend team (Law, Joey, Cyndia, Faisal) on the exact request/response shape for each endpoint before building the screens that depend on them. The priority order for API delivery from the backend is:

1. Auth (login, refresh, activation)
2. Registrations (submit, approve, reject)
3. Users (guide profile, guide list)
4. Stations (list, create, update, delete)
5. Modules + ContentItems
6. Enrolments
7. Quizzes + Attempts + Grading
8. Certifications
9. Notifications
10. IoT Alerts
11. Sync endpoint

Build screens in that priority order. Use mock data (hardcoded JS objects) for screens whose API is not yet ready — do not block on the backend.