# Software Development Enhancement

This document aims to describe the Major Specific Contribution/Enhancement that I did as a Software Development Major. 

## Full-Stack System Architecture and Implementation

Designing and implementing the platform's technical foundation, the API architecture, real-time
event pipeline, payment integration, offline sync strategy, and session security.
The decisions below reflect the trade-offs made and the reasoning behind each.

### Backend Architecture Design

Designed and implemented the full Express API across 16 domains with a consistent
structure and enforced conventions.

**Domain-driven file structure.** Each domain has exactly one route file, one
controller file, one schema file. Any contributor can navigate to an unfamiliar
domain and immediately locate validation, routing, and business logic without
searching.

**Zod validation before the controller.** The `validate(schema)` middleware runs
before any controller so controllers trust `req.body` completely. Validation logic
lives in one place; controllers stay focused on business logic.

**Standard response shape enforced across all endpoints.** Every response follows
`{ success, data }` or `{ success, error: { code, message } }` without exception,
allowing the frontend to handle errors uniformly without per-endpoint special cases.

**S3 keys in the database, never full URLs.** Presigned URLs expire after 15 minutes;
storing them would mean links break silently. Storing only the key and generating
URLs on demand keeps the database clean and decouples storage from access policy.

**Append-only `QuizAttempt`.** Each retake creates a new row; attempts are never
overwritten. This preserves a full audit trail and makes the payment gate
straightforward: check for a `PAID` row before inserting any attempt beyond the
first.

---

### IoT Ingest and Real-time Alert Pipeline

The ingest request comes from AWS IoT Core server-to-server, not from a user
browser. A shared secret (`INTERNAL_SECRET`) rather than JWT is the correct auth
mechanism for machine-to-machine webhooks. The router is mounted at `/internal/`,
outside `/api/`, to make the separation explicit and prevent it from being caught
by API middleware.

For admin dashboard delivery, polling was the obvious alternative but wastes server
resources proportional to connected sessions and introduces latency bounded by the
poll interval. WebSockets push instantly. Socket.io was chosen over raw WebSockets
for its built-in room abstraction and reconnection handling.

Socket connections are authenticated using the same JWT access token as REST
requests. Admins are placed into a shared `admins` room on connect so a single
`io.to('admins').emit()` from the ingest controller reaches all connected admins
simultaneously. The `io` instance is attached to the Express app via
`app.set('io', io)` so any controller can emit events without a circular dependency.

---

### Offline Sync Reconciliation Strategy

The mobile app operates fully offline and batches data into a single `POST /api/sync`
on reconnection. A last-write-wins (LWW) policy was chosen over conflict detection.

Conflict detection compares the device-side state against the server at submission
time and rejects or flags divergent submissions. For this domain it adds complexity
without meaningful benefit: quiz attempts are append-only so there is no conflicting
server state; module content is read-only for guides so they cannot diverge; the
main edge case is when a module archived while a guide is offline should accept the
submission anyway since the guide completed the work in good faith.

LWW is the chosen policy here. Conflict detection is appropriate for systems where
multiple users edit shared documents, which this is not. Each offline item carries a
device-side `completedAt` timestamp so recorded completion time reflects when the
work was done, not when connectivity returned.

---

### BillPlz Payment Integration

The payment gate is enforced server-side in the quiz-attempts controller, not in
the frontend because a frontend-only gate is trivially bypassed by calling the
API directly. For any attempt beyond the first, the controller checks for a `PAID`
Payment row before creating the attempt.

BillPlz was chosen over Stripe because it provides native FPX support, the dominant
online banking method in Malaysia too with no SDK dependency. Stripe does not support
FPX natively and introduces unnecessary complexity for a domestic deployment.

The webhook callback verifies the `X-Signature` HMAC-SHA256 header before trusting
any payload. The callback always returns `200` regardless of outcome so BillPlz
stops retrying. A `BILLPLZ_SANDBOX` flag switches between sandbox and production
without code changes. Live credentials are pending; the integration is complete.

---

### Idle Session Timeout

The silent JWT refresh mechanism means an authenticated session persists
indefinitely as long as the tab stays open. For the admin role this is a real
exposure. A transparent `IdleGuard` wrapper component was added to every
authenticated route, after 14 minutes of inactivity a countdown modal gives the
user 60 seconds to stay logged in before automatic logout.

Client-side idle detection via DOM events is accurate and zero-cost on the server,
keeping the stateless JWT architecture intact. The 14-minute threshold aligns the
warning with the token lifecycle. `useRef` holds the logout callback so listeners
are registered once on mount without re-subscribing, avoiding the stale-closure
problem that a plain `useEffect` dependency would cause.
