# API Design Guide
**SFC Digital Park Guide Training Platform**  
**For: Cyndia (API Developer)**  
**Ask before assuming anything not covered here.**

---

## Your Responsibility

You own the **API layer**: Express routes, controllers, request validation (Zod schemas), and response shaping. You consume the Prisma models that we define and expose clean endpoints to the frontend.

You do **not** own:
- `prisma/schema.prisma` — Law
- `middleware/requireAuth.js` and `requireRole.js` — Law/Joey
- Docker, CI/CD — Ariq
- AWS IoT Core rules — Faisal

If you need a DB field that doesn't exist yet, tell Law — don't add it yourself.

---

## File Structure

Work inside `apps/api/src/`:

```
routes/         ← one file per domain (auth, modules, enrolments, etc.)
controllers/    ← one file per domain, business logic lives here
schemas/        ← one file per domain, Zod validation schemas
middleware/
validate.js   ← your first task (see below)
```

One route file, one controller file, one schema file per domain. Don't mix domains.

---

## Your First Task — `validate.js` Middleware

Before any endpoint work, write this middleware. It takes a Zod schema, validates `req.body`, and either calls `next()` or returns a 400. Every POST and PATCH in the system will use it.

Think through: how does a middleware receive a schema as a parameter? What does `schema.safeParse()` return, and how do you extract the error details to put in the response?

---

## Conventions — Non-Negotiable

**URLs:** plural nouns, kebab-case, no verbs.
```
✅ GET  /api/training-modules
✅ POST /api/training-modules/:id/enrolments
❌ POST /api/createModule
❌ GET  /api/getModules
```

**HTTP methods:** GET to read, POST to create, PATCH to partially update, PUT to fully replace, DELETE to remove.

**Every response** follows this shape — success or error, no exceptions:
```json
// Success
{ "success": true, "data": { } }

// List
{ "success": true, "data": [ ], "pagination": { "page": 1, "limit": 20, "total": 84, "totalPages": 5 } }

// Error
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [ ] } }
```

**Status codes to use:**

| Situation | Code |
|-----------|------|
| OK, returns data | 200 |
| Created | 201 |
| OK, no body | 204 |
| Validation failed | 400 |
| Not authenticated | 401 |
| Authenticated but no permission | 403 |
| Not found | 404 |
| Duplicate/conflict | 409 |
| Server error | 500 |

---

## Auth Headers

Protected routes require:
```
Authorization: Bearer <access_token>
```

After `requireAuth` runs, you have access to `req.user.id` and `req.user.role` in the controller. Use these for ownership checks.

---

## RBAC — Three Categories

Every route is one of:

1. **Admin only** → `requireAuth`, `requireRole('ADMIN')`
2. **Guide only** → `requireAuth`, `requireRole('GUIDE')`
3. **Own resource** → `requireAuth`, then check `req.user.id === resource.userId` in controller. Both roles can access their own data, not others'. Return 403 if it doesn't match.
4. **Public** → no middleware (login, registration submission, cert verification)

---

## File Uploads

Files never pass through your API. The frontend asks your API for a pre-signed S3 URL, uploads directly to S3, then sends you back the S3 key. You store only the key.

You need one endpoint: `POST /api/uploads/presign`. It receives `{ fileName, fileType, folder }` and returns `{ uploadUrl, s3Key }`. Ask Law for the S3 utility function.

---

## Worked Example — One Domain End to End

Here is the complete pattern for ONE domain. Apply this same structure to every other domain yourself.

**`schemas/registration.schema.js`**
```js
const { z } = require('zod')

const submitRegistrationSchema = z.object({
firstName: z.string().min(1).max(100),
lastName: z.string().min(1).max(100),
email: z.string().email(),
icNumber: z.string().min(1),
address: z.string().min(1),
reason: z.string().min(1),
cvS3Key: z.string().min(1),
})

module.exports = { submitRegistrationSchema }
```

**`routes/registration.routes.js`**
```js
const router = require('express').Router()
const { requireAuth, requireRole } = require('../middleware')
const validate = require('../middleware/validate')
const { submitRegistrationSchema } = require('../schemas/registration.schema')
const ctrl = require('../controllers/registration.controller')

router.post('/', validate(submitRegistrationSchema), ctrl.submit)
router.get('/', requireAuth, requireRole('ADMIN'), ctrl.listAll)
router.get('/:id', requireAuth, requireRole('ADMIN'), ctrl.getOne)
router.patch('/:id/approve', requireAuth, requireRole('ADMIN'), ctrl.approve)
router.patch('/:id/reject', requireAuth, requireRole('ADMIN'), ctrl.reject)

module.exports = router
```

**`controllers/registration.controller.js`**
```js
const { prisma } = require('../lib/prisma')

exports.submit = async (req, res) => {
try {
	const registration = await prisma.registrationRequest.create({ data: req.body })
	return res.status(201).json({ success: true, data: registration })
} catch (err) {
	return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } })
}
}

// You write the rest: listAll, getOne, approve, reject
```

Notice: the controller does not validate, `validate.js` already did that before the controller ran. The controller only queries the DB and shapes the response.

---

## Domains You Need to Cover

Design the routes, controllers, and Zod schemas for each. For each domain, think through: what actions are possible, who can do them (RBAC category), what does the request body need, what does the response return.

- **Auth**: login, token refresh, logout, set password, resend activation, forgot/reset password
- **Registration**: submit, list, approve, reject
- **Users**: list, get profile, update profile, create admin, deactivate
- **Training Modules**: CRUD, publish/archive
- **Content Items**: add/update/reorder/delete within a module
- **Enrolments**: enrol, list, set due date
- **Content Progress**: mark complete, get progress (used by offline sync)
- **Quizzes**: create, update settings, manage questions
- **Quiz Attempts**: submit attempt, list, get detail, grade (admin)
- **Certifications**: issue, list, download, public verify
- **Badges**: list available, get guide's earned badges
- **Notifications**: get own, mark read, send custom (admin)
- **IoT Alerts**: list, get detail, confirm, dismiss, internal ingest endpoint
- **Uploads**: presign

---

## Special Cases to Think Through

**Quiz attempt submission** has a state machine. When a guide submits:
- If all questions are MCQ/True-False → auto-score, status = `GRADED`
- If any short/long answer exists → status = `PENDING_REVIEW`, notify admin
- Admin grades open questions → recalculate total → status = `GRADED` → notify guide

Your controller needs to handle both paths. Think through the branching logic before writing it.

**Offline sync** : The mobile app batches offline progress into one POST when it reconnects. Design a `/api/sync` endpoint that accepts an array of progress records and quiz attempts. Each item includes a `completedAt` timestamp from the device (not server time). Policy: last-write-wins, never reject an offline submission even if the module was archived.

**IoT alert ingest** : AWS IoT Core calls your API when a detection occurs. This is not a client-facing endpoint. It is protected by a shared secret header (`x-internal-secret`), not JWT. Keep it on a separate router, not under `/api/`.

**File downloads (certifications)** : Never return a direct S3 URL stored in the DB. Always generate a pre-signed URL on-demand with a short expiry (15 minutes). Ask Law for the S3 utility.

---

## When You're Stuck

- DB model doesn't have the field you need → ask Law
- Not sure which RBAC category a route is → ask Law
- Frontend says the response shape is wrong → fix the controller
- Don't know what data the frontend needs → ask Elyn (web) or Xavier (mobile)

Don't guess. Don't work around missing DB fields. Don't skip Zod validation to save time.