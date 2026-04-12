# API Design Guide
**SFC Digital Park Guide Training Platform**
**For: Cyndia (API Developer)**
**Ask before assuming anything not covered here.**

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
│   └── redis.js              ← import this for refresh token storage
├── middleware/
│   ├── validate.js           ← use on every POST and PATCH
│   ├── requireAuth.js        ← use on protected routes
│   └── requireRole.js        ← use on role-restricted routes
├── routes/
│   └── auth.js               ← routes wired, you fill in schemas + controllers
├── controllers/
│   └── auth.js               ← your first task, steps are commented inside
└── schemas/
    └── auth.js               ← your first task, define the Zod shapes
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

You need one endpoint: `POST /api/uploads/presign`. It receives `{ fileName, fileType, folder }` and returns `{ uploadUrl, s3Key }`. Ask Law for the S3 utility.

---

## Domains to Build (in order)

1. **auth** — already scaffolded, start here
2. **registrations** — submit, list, get, approve, reject
3. **users** — list, get, update, create-admin, update-status
4. **modules** — CRUD, publish, archive
5. **content-items** — add, update, reorder, delete within a module
6. **enrolments** — enrol, list, set due date
7. **quizzes** — create, update, manage questions and options
8. **quiz-attempts** — submit, list, get, grade (admin)
9. **certifications** — issue, list, download (pre-signed URL), public verify
10. **badges** — list definitions, get guide's earned badges
11. **notifications** — get own inbox, mark read, send custom (admin)
12. **iot-alerts** — list, get, flag; internal ingest (separate router, not under `/api/`)
13. **uploads** — presign S3 upload URL

---

## Special Cases

**Quiz attempt submission** has two paths:
- All questions MCQ/True-False → auto-score, status = `GRADED`
- Any short/long answer → status = `PENDING_REVIEW`, notify admin
- Admin grades open questions → recalculate total → status = `GRADED` → notify guide

**IoT alert ingest** is not a client-facing endpoint. It's protected by `x-internal-secret` header, not JWT. Keep it on a separate router outside `/api/`.

**Cert downloads** — never return the raw S3 key to the client. Always generate a pre-signed URL on the fly (15min expiry). Ask Law for the utility.

**Offline sync** — mobile batches offline data into one POST on reconnect. Accept an array, use the device-side `completedAt` timestamp (not server time). Never reject an offline submission even if the module is archived.

---

## When You're Stuck

- Need a DB field that doesn't exist → ask Law
- Not sure which RBAC category a route is → ask Law
- Response shape doesn't match what frontend expects → ask Elyn (web) or Xavier (mobile)

Don't guess. Don't skip Zod validation to save time.
