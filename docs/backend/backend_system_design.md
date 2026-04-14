# Backend System Design
**SFC Digital Park Guide Training Platform**

---

## User Roles

**Admin/Trainer** : manages the platform: approves registrations, creates training content, grades assessments, issues certifications, monitors IoT alerts, manages stations. Accessible via both web and mobile.

**Park Guide** : consumes the platform: registers, enrols in modules, completes training, earns certifications, receives notifications. Assigned to a station. Must work fully offline on mobile. Accessible via both web and mobile.

---

## Registration & Approval

1. Park Guide submits: First Name, Last Name, IC/Passport Number, Address, Reason for applying, CV (PDF → S3)
2. Admin reviews and approves or rejects

**On approval:**
- `User` record created in DB
- Username auto-generated: `FirstName` + random 4-digit number (e.g. `Lawrence2607`). Uniqueness checked; retry once on collision.
- Activation email sent via AWS SES containing username and a link to set their own password
- Activation token: `crypto.randomBytes(32)`, hash + 24hr expiry stored in `PasswordResetToken` table
- If guide doesn't activate within 24 hours: login page offers "Resend activation link" → `POST /api/auth/resend-activation` invalidates old token, sends new one. Same endpoint reused for forgot-password.

**On rejection:**
- No `User` record created
- Rejection email sent. Admin optionally includes reason.

---

## Station Management

Stations are named SFC park locations (e.g., Semenggoh Nature Reserve, Gunung Mulu National Park). Admins manage the station list from the dashboard — no code deployment or schema migration needed to add new locations.

- `Station` table: `id` (UUID PK), `name` (VARCHAR UNIQUE), `created_at`
- `User.station_id` is a nullable FK → `Station.id`
  - Guides only — admin accounts are never assigned a station
  - Set by admin on approval or updated later via the guide management page
- Admin can filter the guide list by station: `GET /api/users?role=GUIDE&stationId=:id`
- Station is displayed on the guide's profile on both web and mobile
- Delete guard: a station cannot be deleted while guides are assigned to it — enforced at application layer
- Station name must be unique — prevents duplicate entries for the same location

---

## Authentication

- JWT, no sessions
- Access token: 15 min, kept in memory on client
- Refresh token: 7 days, stored in Redis (Upstash). Mobile: Expo SecureStore. Web: HttpOnly cookie.
- Silent refresh: on 401, client calls `POST /api/auth/refresh`, retries original request. On refresh expiry, redirect to login.
- Passwords hashed with bcrypt
- User statuses: `INACTIVE` (not yet set password), `ACTIVE`, `SUSPENDED`

---

## Training Modules

- Guides enrol freely. No hard prerequisites as admin notes them in the module description.
- Due date is per individual enrolment (`due_at` on `Enrolment`)
- Module statuses: `DRAFT` → `PUBLISHED` → `ARCHIVED`
- Content items within a module are ordered

**Content types (can be mixed in one module):**

| Type | Notes |
|------|-------|
| `VIDEO` | `video_source`: `S3` or `YOUTUBE`. `allow_offline` boolean. S3 videos cacheable; YouTube flagged "unavailable offline". |
| `IMAGE` | Converted to WebP server-side via `sharp` before storing to S3. |
| `TEXT` | Rich text stored as HTML/Markdown string. |
| `INFOGRAPHIC` | `subtype`: `HOTSPOT`, `SCENARIO`, or `STEPPER`. Content stored as JSON. Coordinates are percentage-based (0–1) for mobile compatibility. |
| `QUIZ` | Links to a `Quiz` entity. |

---

## Quiz & Assessment

- Question types: `MCQ`, `TRUE_FALSE`, `SHORT_ANSWER`, `LONG_ANSWER` : all can be mixed in one quiz
- Admin configures: pass score (%), time limit, mark weighting per question, `show_score_to_guide` boolean

**Submission flow:**
- MCQ/True-False → auto-scored immediately, stored in `QuestionAttempt`
- Short/Long answer → stored as text, `QuizAttempt.status = PENDING_REVIEW`, admin notified
- If all questions are auto-scored → `QuizAttempt.status = GRADED` immediately
- `QuizAttempt` total score = sum of all `QuestionAttempt` scores
- Certification cannot be triggered until `QuizAttempt.status = GRADED`

---

## Retake & Payment

- No retake limit
- Each retake (attempt_number > 1) requires a successful BillPlz payment
- Retake price configurable per quiz by admin via `retake_price_myr` (nullable — null means price not yet set)
- Payment gateway: **BillPlz** (FPX, Malaysia)
  - Sandbox: `https://www.billplz-sandbox.com/api/v3`
  - Production: `https://www.billplz.com/api/v3`

**Flow:**
1. Guide initiates retake → `POST /api/payments/initiate { quizId }`
2. Server checks: quiz has price, guide has at least one prior attempt, no existing PENDING payment
3. Server creates BillPlz bill, stores `Payment` row (status `PENDING`)
4. Returns `{ url }` — frontend redirects guide to BillPlz
5. Guide completes FPX payment on BillPlz
6. BillPlz calls `POST /api/payments/callback` (webhook)
7. Server verifies X-Signature: `HMAC-SHA256(key=BILLPLZ_X_SIGNATURE, data="<billId>|<paid>")`
8. Payment status updated to `PAID` or `FAILED`
9. Guide returns to frontend — retake is now unlocked
10. `POST /api/quiz-attempts` checks for a `PAID` payment with `quiz_attempt_id = null` before creating attempt; on success links the payment to the new attempt

---

## Certifications

Triggered after admin approves a graded quiz attempt.

**Flow:** Admin fills fields → system generates PDF → stored in S3 → guide notified

**Certificate fields (admin-configurable):**
- SFC Logo
- Certification ID (UUID)
- Company Name
- Module Title
- Issuer: `"Issued by [Name], [Title], Sarawak Forestry Corporation"`
- Issue Date
- Expiry Date (optional)
- Signature (handwriting-style font)
- QR code linking to `GET /api/certifications/verify/:certId` (public)

**Implementation:** `pdf-lib` overlays dynamic fields on a Figma-designed template exported as PDF/PNG. PDF stored in S3; DB stores S3 key only. Downloads return a pre-signed URL (15 min expiry).

---

## Badges

Count-based achievement markers shown on guide profile. **For Park Guides only — admin accounts do not earn or display badges. Admin authorisation is assumed by role.**

- Badge fields: image, description (e.g. "Finished 3 modules in a row")
- Awarded server-side automatically when a module is approved/certified
- Threshold configurable per badge (e.g. complete 3 modules = badge)
- Not client-triggered
- `UserBadge` must only be created for users with `role = GUIDE` — enforced at application layer before insert

---

## Offline Sync (Mobile)

- Expo SQLite stores all progress locally during offline periods (up to multi-day expeditions)
- On reconnect: `POST /api/sync` sends batched progress + quiz attempts
- Each item includes device-side `completedAt` timestamp
- **Conflict policy: last-write-wins.** Archived modules still accept offline submissions.

---

## Notifications

| Recipient | Trigger | Channel |
|-----------|---------|---------|
| Admin | New registration submitted | In-app |
| Admin | IoT alert detected | Push + Email |
| Guide | New module published | Push |
| Guide | Deadline reminder (24hr) | Push + In-app |
| Guide | Quiz result | In-app |
| Guide | Certificate approved | Push + In-app |
| Guide | Custom message from admin | In-app |

Custom notifications (admin → specific guide or all guides): Title + Description only.

---

## IoT Live Alerts

**Flow:**
```
ESP32 detects violation
→ Captures evidence frame
→ MQTT over TLS → AWS IoT Core
→ IoT Core: stores frame to S3 + HTTP POST to Node.js API (internal endpoint)
→ API saves alert to DB
→ API emits Socket.io event to admin dashboard
→ Admin notified via push + email
→ Admin flags: CONFIRMED or FALSE_DETECTION
```

**Socket.io event payload (`iot:alert`):**
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

Internal ingest endpoint is protected by `x-internal-secret` header, not JWT.

---

## RBAC Middleware

Every route falls into one of:

1. **Admin only** : `requireAuth` + `requireRole('ADMIN')`
2. **Guide only** : `requireAuth` + `requireRole('GUIDE')`
3. **Own resource** : `requireAuth` + ownership check in controller (`req.user.id === resource.userId`). Return 403 if mismatch.
4. **Public** : no middleware

---

## Admin Account Creation

- **Bootstrap:** `prisma db seed` creates initial admin accounts. Credentials read from `.env`. Idempotent (upsert).
- **Ongoing:** any admin can create new admin accounts via `POST /api/users/admins` (admin-only route). All admins have equal privileges.

---

## Open Items

| Item | Status |
|------|--------|
| Billplz integration | Confirmed as payment gateway. `retake_price_myr` on `Quiz` is nullable until active. |
| Badge threshold values | Count-based confirmed. Specific threshold values (e.g. 3 modules = badge) are set by admin per badge via the dashboard — not hardcoded. |