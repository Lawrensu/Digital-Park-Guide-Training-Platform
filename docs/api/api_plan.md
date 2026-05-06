# API Design Guide
**SFC Digital Park Guide Training Platform**
**API is fully implemented. This document is the reference for endpoint contracts,**
**response shapes, and business rules. Do not re-implement any domain.**

---

## Your Responsibility

You own the **API layer**: routes, controllers, and Zod schemas. You consume the Prisma models that Law defines and expose clean endpoints to the frontend.

You do **not** own:
- `prisma/schema.prisma` — Law
- `src/middleware/` — already done, just use them
- `src/lib/` — already done, just import from there
- Docker, CI/CD — Ariq
- AWS IoT Core rules — Faisal

If you need a DB field that doesn't exist yet, tell Law — don't add it yourself.

---

## What's Already Set Up For You

```
apps/api/src/
├── index.js                  ← server entry, don't touch
├── app.js                    ← add your router imports/mounts here
├── lib/
│   ├── prisma.js             ← import this to query the DB
│   ├── redis.js              ← import this for refresh token storage
│   ├── s3.js                 ← getPresignedUploadUrl, getPresignedDownloadUrl, uploadBuffer, deleteObject
│   └── email.js              ← sendActivationEmail, sendRegistrationRejectedEmail, sendPasswordResetEmail
├── middleware/
│   ├── validate.js           ← use on every POST and PATCH
│   ├── requireAuth.js        ← use on protected routes
│   └── requireRole.js        ← use on role-restricted routes
├── routes/
│   ├── auth.js               ← routes wired, you fill in schemas + controllers
│   └── stations.js           ← routes wired, you fill in schemas + controllers
├── controllers/
│   ├── auth.js               ← your first task, steps are commented inside
│   └── stations.js           ← steps are commented inside
└── schemas/
    ├── auth.js               ← your first task, define the Zod shapes
    └── stations.js           ← Zod stubs ready for you to fill
```

For every new domain you build, add three files: `routes/<domain>.js`, `controllers/<domain>.js`, `schemas/<domain>.js`. Then wire the router into `app.js`.

---

## Conventions — Non-Negotiable

**URLs:** plural nouns, kebab-case, no verbs.
```
✅ GET  /api/modules
✅ POST /api/modules/:id/enrolments
❌ POST /api/createModule
```

**Every response** follows this shape — success or error, no exceptions:
```json
{ "success": true, "data": {} }
{ "success": true, "data": [], "pagination": { "page": 1, "limit": 20, "total": 84, "totalPages": 5 } }
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [] } }
```

**Status codes:**

| Situation | Code |
|---|---|
| OK, returns data | 200 |
| Created | 201 |
| OK, no body | 204 |
| Validation failed | 400 |
| Not authenticated | 401 |
| Wrong role / not your resource | 403 |
| Not found | 404 |
| Duplicate / conflict | 409 |
| Server error | 500 |

---

## Auth Headers

Protected routes require:
```
Authorization: Bearer <access_token>
```

After `requireAuth` runs, you have `req.user.id` and `req.user.role` in the controller.

---

## RBAC — Three Categories

Every route is one of:

1. **Admin only** → `requireAuth, requireRole('ADMIN')`
2. **Guide only** → `requireAuth, requireRole('GUIDE')`
3. **Own resource** → `requireAuth`, then check `req.user.id === resource.guideId` inside the controller. Return 403 if it doesn't match.
4. **Public** → no middleware (login, registration submit, cert verify)

---

## Worked Example — Full Domain Pattern

This is the complete pattern. Every domain you build follows the same three-file structure.

**`schemas/registrations.js`**
```js
import { z } from 'zod';

export const submitRegistrationSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    icPassportNumber: z.string().min(1),
    address: z.string().min(1),
    reason: z.string().min(1),
    cvS3Key: z.string().min(1),
});
```

**`routes/registrations.js`**
```js
import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import validate from '../middleware/validate.js';
import { submitRegistrationSchema } from '../schemas/registrations.js';
import * as ctrl from '../controllers/registrations.js';

const router = Router();

router.post('/', validate(submitRegistrationSchema), ctrl.submit);
router.get('/', requireAuth, requireRole('ADMIN'), ctrl.listAll);
router.get('/:id', requireAuth, requireRole('ADMIN'), ctrl.getOne);
router.patch('/:id/approve', requireAuth, requireRole('ADMIN'), ctrl.approve);
router.patch('/:id/reject', requireAuth, requireRole('ADMIN'), ctrl.reject);

export default router;
```

**`controllers/registrations.js`**
```js
import prisma from '../lib/prisma.js';

export const submit = async (req, res) => {
    try {
        const registration = await prisma.registrationApplication.create({ data: req.body });
        return res.status(201).json({ success: true, data: registration });
    } catch (err) {
        return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
    }
};

// listAll, getOne, approve, reject — you write these
```

Then in `app.js`, add:
```js
import registrationsRouter from './routes/registrations.js';
app.use('/api/registrations', registrationsRouter);
```

Notice the controller doesn't validate — `validate()` already did that before the controller ran. The controller only queries the DB and shapes the response.

---

## File Uploads

Files never pass through your API. The frontend asks your API for a pre-signed S3 URL, uploads directly to S3, then sends you back the S3 key. You store only the key.

The presign endpoint is `POST /api/uploads/presign`. It receives `{ purpose, contentType, extension }` and returns `{ url, key }`. Files are uploaded directly from the client to S3 using the returned URL.

---

## Domains to Build (in order)

1. **auth** — already scaffolded, start here
2. **registrations** — submit, list, get, approve, reject
3. **users** — list, get, update, create-admin, update-status. List endpoint accepts `?stationId=` and `?role=` as query filters. Station filter is admin-only.
4. **stations** — create, list, get, update, delete. Admin-only on all operations. Used to populate station dropdowns on the guide list filter and on the registration approval form. Endpoints: `GET /api/stations`, `POST /api/stations`, `GET /api/stations/:id`, `PATCH /api/stations/:id`, `DELETE /api/stations/:id`.
5. **modules** — CRUD, publish, archive
6. **content-items** — add, update, reorder, delete within a module
7. **enrolments** — enrol, list, set due date
8. **quizzes** — create, update, manage questions and options
9. **quiz-attempts** — submit, list, get, grade (admin). For attempt_number > 1, check for a PAID payment row before creating.
10. **payments** — initiate retake (BillPlz bill), BillPlz callback webhook (X-Signature verified)
11. **certifications** — issue, list, download (pre-signed URL), public verify
12. **badges** — list definitions, get guide's earned badges
13. **notifications** — get own inbox, mark read, send custom (admin)
14. **iot-alerts** — list, get, flag; internal ingest (separate router, not under `/api/`)
15. **uploads** — presign S3 upload URL
16. **sync** — offline batch sync endpoint

---

## Special Cases

**Quiz attempt submission** has two paths:
- All questions MCQ/True-False → auto-score, status = `GRADED`
- Any short/long answer → status = `PENDING_REVIEW`, notify admin
- Admin grades open questions → recalculate total → status = `GRADED` → notify guide

**Retake policy:** there is no retake limit, no cooldown period, and no admin reset mechanism. Guides may retake as many times as they are willing to pay. Do not implement any limit, lockout, or cooldown logic. `attempt_number` simply increments on each new submission with no ceiling.

**IoT alert ingest** is not a client-facing endpoint. It's protected by `x-internal-secret` header (compared against `process.env.INTERNAL_SECRET`), not JWT. Keep it on a separate router outside `/api/` mounted at `/internal`. After saving the alert, emit a Socket.io `iot:alert` event via `req.app.get('io')` and fan-out `IOT_ALERT` notifications to all admins. Always return a 2xx status so AWS IoT Core does not retry.

**Cert downloads** — never return the raw S3 key to the client. Always generate a pre-signed URL on the fly (15min expiry). Ask Law for the utility.

**Offline sync** — mobile batches offline data into one POST on reconnect. Accept an array, use the device-side `completedAt` timestamp (not server time). Never reject an offline submission even if the module is archived.

**Retake payment gate** — for `attempt_number > 1`, the quiz-attempts controller must check that a `PAID` Payment row exists for `(guideId, quizId)` with `quizAttemptId = null` before creating the attempt. On success, set `payment.quizAttemptId = newAttempt.id`. Return 402 `PAYMENT_REQUIRED` if not.

**BillPlz callback** — `POST /api/payments/callback` is a webhook from BillPlz, not a client request. No JWT auth. Verify the `X-Signature` header (HMAC-SHA256) before trusting the payload. Always return 200 — BillPlz retries if it receives anything else.

**Badge award** — badges are for park guides only. When the certification count for a guide meets a badge threshold, create a `UserBadge` row. Never create a `UserBadge` for a user with `role = ADMIN`. Enforce this check before the insert, not after.

---

## When You're Stuck

- Need a DB field that doesn't exist → ask Law
- Not sure which RBAC category a route is → ask Law
- Response shape doesn't match what frontend expects → ask Elyn (web) or Xavier (mobile)

---

## Route Reference

All routes are prefixed with `/api/` unless noted otherwise. Auth categories: **Public** (no middleware), **Admin** (requireAuth + requireRole ADMIN), **Guide** (requireAuth + requireRole GUIDE), **Auth** (requireAuth only), **Own** (requireAuth + ownership check in controller).

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/login | Public | Log in, receive access token and set refresh cookie |
| POST | /api/auth/refresh | Public | Rotate access token using HttpOnly refresh cookie |
| POST | /api/auth/logout | Auth | Delete refresh token from Redis, clear cookie |
| POST | /api/auth/set-password | Public | Activate account by setting password with one-time token |
| POST | /api/auth/resend-activation | Public | Resend activation email for INACTIVE account |
| POST | /api/auth/forgot-password | Public | Send password reset link (always returns 200) |
| POST | /api/auth/reset-password | Public | Reset password using reset token |

### Registrations

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/registrations | Public | Submit a new park guide registration application |
| GET | /api/registrations | Admin | List all applications with optional status filter |
| GET | /api/registrations/:id | Admin | Get a single application |
| GET | /api/registrations/:id/cv-url | Admin | Get a pre-signed S3 download URL for the applicant's CV |
| PATCH | /api/registrations/:id/approve | Admin | Approve application; creates User, sends activation email |
| PATCH | /api/registrations/:id/reject | Admin | Reject application; sends rejection email |

### Users

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/users | Admin | List users; filters: role, status, stationId |
| POST | /api/users/admins | Admin | Create a new admin account (INACTIVE, activation email sent) |
| GET | /api/users/:id | Auth | Get user profile; guides may only view their own |
| PATCH | /api/users/:id | Admin | Update user fields |
| PATCH | /api/users/:id/status | Admin | Change user status (ACTIVE, SUSPENDED) |

### Stations

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/stations | Admin | List all stations |
| POST | /api/stations | Admin | Create a station |
| GET | /api/stations/:id | Admin | Get a station |
| PATCH | /api/stations/:id | Admin | Update station name |
| DELETE | /api/stations/:id | Admin | Delete station; blocked if guides are assigned |

### Modules

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/modules | Auth | List modules; guides see PUBLISHED only |
| POST | /api/modules | Admin | Create a module in DRAFT status |
| GET | /api/modules/:id | Auth | Get module detail |
| PATCH | /api/modules/:id | Admin | Update module fields |
| PATCH | /api/modules/:id/publish | Admin | Publish module; notifies all active guides |
| PATCH | /api/modules/:id/archive | Admin | Archive module |
| DELETE | /api/modules/:id | Admin | Delete module; blocked if enrolments or certifications exist |

### Content Items

Content items are nested under a module. Base path: `/api/modules/:moduleId/content-items`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/modules/:moduleId/content-items | Auth | List all content items for a module in order |
| POST | /api/modules/:moduleId/content-items | Admin | Add a content item; type determines required fields |
| PATCH | /api/modules/:moduleId/content-items/reorder | Admin | Reorder items by providing an array of id plus order pairs |
| PATCH | /api/modules/:moduleId/content-items/:id | Admin | Update a content item |
| DELETE | /api/modules/:moduleId/content-items/:id | Admin | Remove a content item |

Content item types and their required fields:
- VIDEO: videoSource (S3 or YOUTUBE), videoUrl
- IMAGE: imageS3Key
- TEXT: textContent
- INFOGRAPHIC: infographicSubtype (HOTSPOT, SCENARIO, STEPPER), infographicContent
- QUIZ: quizId

### Enrolments

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/enrolments | Auth | List enrolments; guides see only their own |
| POST | /api/enrolments | Admin | Enrol a specific guide in a module |
| POST | /api/enrolments/me | Guide | Guide self-enrolls in a PUBLISHED module |
| PATCH | /api/enrolments/:id | Admin | Update due date on an enrolment |
| DELETE | /api/enrolments/:id | Admin | Remove an enrolment |

### Quizzes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/quizzes | Auth | List quizzes; filter by moduleId |
| POST | /api/quizzes | Admin | Create a quiz linked to a module |
| GET | /api/quizzes/:id | Auth | Get quiz with questions; correct answers hidden from guides |
| PATCH | /api/quizzes/:id | Admin | Update quiz settings |
| DELETE | /api/quizzes/:id | Admin | Delete quiz; blocked if attempts exist |
| POST | /api/quizzes/:quizId/questions | Admin | Add a question to a quiz |
| PATCH | /api/quizzes/:quizId/questions/:questionId | Admin | Update a question; replacing all options if provided |
| DELETE | /api/quizzes/:quizId/questions/:questionId | Admin | Remove a question and its options |

Question types: MCQ, TRUE_FALSE, SHORT_ANSWER, LONG_ANSWER. MCQ and TRUE_FALSE require options with an isCorrect boolean.

### Quiz Attempts

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/quiz-attempts | Auth | List attempts; guides see only their own |
| POST | /api/quiz-attempts | Guide | Submit a quiz attempt; retakes require a PAID payment row |
| GET | /api/quiz-attempts/:id | Own | Get attempt detail with question responses |
| PATCH | /api/quiz-attempts/:id/grade | Admin | Grade open questions and finalize total score |

Retake gate: if attemptNumber is greater than 1 and retakePriceMyr is set, a PAID Payment row with quizAttemptId null must exist for the guide and quiz.

### Payments

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/payments/initiate | Guide | Initiate a BillPlz retake payment; returns redirect URL |
| POST | /api/payments/callback | Public | BillPlz webhook; updates Payment status to PAID or FAILED |

The callback verifies the X Signature header before trusting the payload. Always returns 200 to prevent BillPlz retries.

### Certifications

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/certifications | Auth | List certifications; guides see only their own |
| POST | /api/certifications | Admin | Issue a certification for a passed, graded attempt |
| GET | /api/certifications/:id/download | Own | Get a pre-signed S3 download URL (15 min expiry) |
| GET | /api/certifications/verify/:certId | Public | Verify certificate validity; returns VALID or EXPIRED |

### Badges

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/badges | Auth | List all badge definitions |
| POST | /api/badges | Admin | Create a badge definition |
| PATCH | /api/badges/:id | Admin | Update a badge |
| DELETE | /api/badges/:id | Admin | Delete a badge |
| GET | /api/badges/users/:userId | Own | List badges earned by a user; guides may only view their own |

Badges are awarded automatically when a guide's certification count meets a badge threshold. No guide-triggered award exists.

### Notifications

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/notifications/me | Auth | Get the authenticated user's notification inbox |
| PATCH | /api/notifications/:id/read | Auth | Mark a single notification as read |
| PATCH | /api/notifications/me/read-all | Auth | Mark all own notifications as read |
| POST | /api/notifications/custom | Admin | Send a custom notification to specific users or an entire role |

### IoT Alerts

Admin-facing routes under /api/:

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/iot-alerts | Admin | List alerts with filters: deviceId, guideId, status, detectionType |
| GET | /api/iot-alerts/:id | Admin | Get a single alert with device and guide details |
| PATCH | /api/iot-alerts/:id/flag | Admin | Flag an alert as CONFIRMED or FALSE_DETECTION |

Internal ingest route (NOT under /api/):

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /internal/iot-alerts | x-internal-secret header | Ingest an alert from ESP32 or IoT gateway; emits Socket.io event to admins |

### Uploads

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/uploads/presign | Optional | Get a pre-signed S3 upload URL; CV purpose is public, others require auth |

Purpose values: cv, content-image, badge-image, iot-evidence. Admin role required for content-image and badge-image.

### Sync

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/sync | Guide | Batch submit offline quiz attempts; payment gate is skipped |

Don't guess. Don't skip Zod validation to save time.