# Mobile Offline Sync Engine — Design & Implementation Plan

> This document is the authoritative specification for the Park Guide mobile app offline sync system.
> All implementation must follow this spec exactly. Read it fully before touching any file.

---

## 1. Overview

Park guides operate in national parks where mobile connectivity is unreliable. The offline sync engine lets guides:

- **Browse** their enrolled modules and content items (TEXT, INFOGRAPHIC) without a network connection
- **Take quizzes** offline — answers are stored locally and synced when connectivity resumes
- **Have progress marks** (content item viewed events) queued offline and flushed on reconnect

Video and image content still require a network connection. The engine does not attempt to cache binary media.

---

## 2. Scope

### In scope
| Feature | Offline behaviour |
|---|---|
| Course list (enrolled modules) | Read from cache |
| Module content item list | Read from cache |
| TEXT content viewer | Read from cache |
| INFOGRAPHIC content viewer | Read from cache (text body only, no image) |
| QUIZ content viewer | Read questions from cache, save answers to outbox |
| Dashboard stats (enrolled/completed/certs) | Read from cache |
| Content item progress marks | Queue to progress outbox, flush on reconnect |
| Quiz attempt submission | Queue to quiz outbox, flush on reconnect via `POST /api/sync` |

### Out of scope
| Feature | Reason |
|---|---|
| Video playback | Streaming — cannot be cached feasibly |
| S3 image loading | Binary — no presign URL available offline |
| Certification PDF download | Binary |
| Admin screens | Admins are not the offline-first user |
| Notifications | Read-only, non-critical |
| Payments / BillPlz | Requires live payment gateway |

---

## 3. Storage Decision — expo-sqlite

**Storage: `expo-sqlite` v15 (not AsyncStorage)**

**Correction from implementation:** `npx expo install expo-sqlite` on SDK 52 installs `expo-sqlite@~15.1.4`, not v14. The spec was written for v14. The API methods are identical (`openDatabaseAsync`, `execAsync`, `runAsync`, `getFirstAsync`, `getAllAsync`, `withTransactionAsync`), so all implementation code is correct with v15.

`expo-sqlite` v15 works in managed workflow — no `expo prebuild` or native build required. It works in Expo Go, Android emulator, and physical devices identically.

The comment in the old `src/database/db.js` scaffold saying "SQLite disabled for Expo Go" was written for SDK 48 and is **outdated**. SDK 52 with expo-sqlite v15 has no such restriction.

**Why SQLite over AsyncStorage for this app:**

The offline sync engine has two distinct jobs. SQLite wins on the job that matters:

| Job | AsyncStorage | SQLite |
|---|---|---|
| **Cache** (read-only blobs — modules, enrolments, quiz data) | Fine — store JSON, read JSON | Also fine — same result |
| **Outbox** (quiz attempts and progress marks waiting to sync) | Risky — read/modify/write the whole array every time, not atomic | Correct — row-level INSERT, DELETE, UPDATE inside transactions |

For the outbox specifically: if a guide submits a quiz offline and the app crashes mid-write with AsyncStorage, the outbox array may be in a half-finished state. With SQLite, a transaction either completes fully or rolls back — no partial state.

**Installation (run once before implementation):**
```bash
cd apps/mobile
npx expo install expo-sqlite
```
This installs `expo-sqlite@~14.0.x` which is the correct version for SDK 52.

---

## 4. Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                       Guide screens                          │
│   CourseListScreen  LessonScreen  ContentScreen  QuizScreen  │
└──────────┬──────────────┬──────────────┬────────────┬────────┘
           │              │              │            │
           ▼              ▼              ▼            ▼
┌──────────────────────────────────────────────────────────────┐
│                     syncService.js                           │
│   isOnline? ──► API call + write cache                       │
│   offline?  ──► read cache / write outbox                    │
│   on reconnect: flush() drains both outboxes                 │
└──────────────────┬───────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
    SQLite DB             Live API
    (db.js)               (api.js)
     parkguide_offline.db
     - cache table
     - quiz_outbox table
     - progress_outbox table
```

### Component responsibilities

| File | Role |
|---|---|
| `src/database/db.js` | SQLite helpers — initialises DB, exposes clean read/write functions for cache and outboxes |
| `src/services/syncService.js` | Orchestration layer — screens call this, never db.js directly |
| `src/services/connectivityService.js` | Provides `isOnline` hook — **do not modify** |
| `App.js` | Mounts AppState listener to call `syncService.flush()` on foreground |
| Guide screens | Use `syncService` helpers instead of calling API directly |

**Critical rule:** Screens and `syncService.js` must never import from `expo-sqlite` directly. All SQLite access goes through `db.js`. This keeps the storage layer swappable and testable in isolation.

---

## 5. SQLite Database Schema

Database file: `parkguide_offline.db`

Three tables. One `cache` table stores JSON blobs keyed by a string (simple, fast, maintains exact parity with API response shape). Two normalized outbox tables with row-level operations and status tracking.

```sql
PRAGMA journal_mode = WAL;

-- Cache: JSON blobs keyed by a string identifier.
-- One row per cached entity (enrolments list, one module, one quiz, etc.)
CREATE TABLE IF NOT EXISTS cache (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  cached_at  TEXT NOT NULL
);

-- Quiz outbox: one row per pending quiz attempt.
-- client_id is a UUID generated on-device, used to match server responses.
-- status: pending -> syncing (during flush) -> deleted on success
CREATE TABLE IF NOT EXISTS quiz_outbox (
  client_id      TEXT PRIMARY KEY,
  quiz_id        TEXT NOT NULL,
  module_id      TEXT NOT NULL,
  module_title   TEXT NOT NULL,
  quiz_title     TEXT NOT NULL,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  submitted_at   TEXT NOT NULL,
  responses      TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'pending',
  retry_count    INTEGER NOT NULL DEFAULT 0,
  last_error     TEXT,
  created_at     TEXT NOT NULL
);

-- Progress outbox: one row per content item pending a progress mark.
-- PRIMARY KEY on content_item_id deduplicates naturally:
-- marking the same item twice enqueues only one row (idempotent).
CREATE TABLE IF NOT EXISTS progress_outbox (
  content_item_id  TEXT PRIMARY KEY,
  module_id        TEXT NOT NULL,
  queued_at        TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'pending'
);
```

### Cache key naming

The `key` column in the `cache` table uses these exact values:

| key | Content |
|---|---|
| `enrolments` | Full `enrolmentsApi.getMyEnrolments()` response — array with `module`, `progressPct`, `completedAt`, `contentItemProgresses` |
| `module_{moduleId}` | `modulesApi.getOne(moduleId)` response |
| `items_{moduleId}` | `contentItemsApi.getAll(moduleId)` response — array of content items |
| `quiz_{quizId}` | `quizzesApi.getOne(quizId)` response — quiz with questions and options |
| `cert_count` | Integer count of guide's certifications |
| `cache_time` | ISO timestamp of last full cache refresh |

### Quiz outbox `responses` column

Stored as a JSON string. Shape of each item in the parsed array:
```json
{
  "questionId": "uuid",
  "selectedOptionId": "uuid or null",
  "textResponse": "string or null"
}
```

---

## 6. db.js — Full Rewrite

The existing `src/database/db.js` must be completely replaced. The old file uses `courses`/`lessons` terminology from before the API integration and must not be kept or extended.

**The exported function signatures are the interface contract.** `syncService.js` and any other caller must only use these exports — never call `expo-sqlite` directly.

```js
// ─── INITIALISATION ──────────────────────────────────────────────────────────
// Call once on app start. Opens the DB and runs CREATE TABLE IF NOT EXISTS.
// Returns the db instance (used internally — callers do not need it).
initDatabase()


// ─── CACHE — READ ────────────────────────────────────────────────────────────
getCachedEnrolments()              // returns [] if not cached or parse fails
getCachedModuleDetail(moduleId)    // returns null if not cached
getCachedContentItems(moduleId)    // returns [] if not cached
getCachedQuiz(quizId)             // returns null if not cached
getCachedCertCount()              // returns 0 if not cached


// ─── CACHE — WRITE ───────────────────────────────────────────────────────────
// Called by syncService after each successful API call.
setCachedEnrolments(enrolments)
setCachedModuleDetail(moduleId, module)
setCachedContentItems(moduleId, items)
setCachedQuiz(quizId, quiz)
setCachedCertCount(count)
setCacheTime()                    // stamps cache_time key


// ─── QUIZ OUTBOX ─────────────────────────────────────────────────────────────
getQuizOutbox()                   // returns all rows with status = 'pending'
addToQuizOutbox(attempt)          // INSERT OR IGNORE (clientId is PK — safe to call twice)
removeFromQuizOutbox(clientIds)   // DELETE rows by clientId array, inside a transaction
markQuizOutboxSyncing(clientId)   // UPDATE status = 'syncing' (called before network request)
markQuizOutboxFailed(clientId, errorMessage)  // UPDATE status back to 'pending', increment retry_count


// ─── PROGRESS OUTBOX ─────────────────────────────────────────────────────────
getProgressOutbox()                       // returns all rows with status = 'pending'
addToProgressOutbox(contentItemId, moduleId)  // INSERT OR IGNORE (contentItemId is PK)
removeFromProgressOutbox(contentItemIds)  // DELETE rows by contentItemId array


// ─── UTILITY ─────────────────────────────────────────────────────────────────
clearAllCache()   // DELETE all rows from all three tables — call on logout
```

**Implementation rules for every function:**
- Every function is `async`
- Every function is wrapped in `try/catch`
- On error: `console.warn('db.functionName error:', err)` and return the safe default
- Never `throw` — storage failures must be silent and non-crashing
- All multi-row mutations (removeFromQuizOutbox, clearAllCache) use `db.withTransactionAsync()`

**The `markQuizOutboxSyncing` / `markQuizOutboxFailed` pair** exists so that if the app crashes during a flush, rows stuck in `syncing` state are detectable on next launch and can be reset to `pending`. Implement this reset inside `initDatabase()`:
```sql
UPDATE quiz_outbox SET status = 'pending' WHERE status = 'syncing'
```

---

## 7. syncService.js — New File

Location: `src/services/syncService.js`

This is the single orchestrator. **Screens never call `db.js` directly — they call `syncService`.**

### Public API

```js
// Called from App.js whenever the app returns to foreground.
// Drains both outboxes. Safe to call when outboxes are empty or when offline
// (it checks connectivity before doing anything).
flush()

// Called from guide screens on load.
// Online path: fetch from live API, write to cache, return data.
// Offline path: read from SQLite cache, return data (or empty/null if not cached).
loadEnrolments()
loadModuleDetail(moduleId)
loadContentItems(moduleId)
loadQuiz(quizId)

// Called from ContentScreen when the guide finishes viewing a content item.
// Online: POST /api/enrolments/me/progress directly.
// Offline: INSERT into progress_outbox.
markProgress(contentItemId, moduleId)

// Called from QuizScreen when the guide submits quiz answers.
// Online: POST /api/quiz-attempts, return the server attempt object.
// Offline: INSERT into quiz_outbox, return { offline: true, clientId }.
submitQuizAttempt({ quizId, moduleId, moduleTitle, quizTitle, responses })
```

### flush() logic (step by step)

```
1. Check connectivity — if offline, return immediately (no-op)

2. Load quiz outbox (status = 'pending')
3. If non-empty:
   a. For each item: markQuizOutboxSyncing(clientId)
   b. POST /api/sync { attempts: outboxItems }
   c. For each result:
      - status === 'accepted': removeFromQuizOutbox([clientId])
      - status === 'rejected': markQuizOutboxFailed(clientId, reason)
        (rejected items stay in the outbox — log them, do not retry indefinitely)
   d. On network error: markQuizOutboxFailed for all in-flight items, stop

4. Load progress outbox (status = 'pending')
5. For each item:
   a. POST /api/enrolments/me/progress { contentItemId }
   b. On 200: removeFromProgressOutbox([contentItemId])
   c. On 404 or 400: removeFromProgressOutbox([contentItemId])
      (stale item — enrolment may no longer exist, safe to discard)
   d. On 5xx or network error: leave in outbox for retry on next flush

6. If any quiz or progress item was successfully synced:
   re-fetch and re-cache enrolments (so progress % reflects the sync)
```

### Key design rules

- `syncService` cannot use `connectivityService.js` (React hooks cannot be called outside components). Connectivity is tracked via a module-level `let _isOnline = true` flag inside `syncService.js`. Export a `setOnlineStatus(bool)` setter. In `App.js` inside `AppInner` (which already calls `useNetworkStatus()`), add a `useEffect` that calls `syncService.setOnlineStatus(isOnline)` whenever `isOnline` changes. This keeps `_isOnline` current without any React dependency inside syncService.
- `syncService` uses `api.js` for all network calls — JWT refresh is handled transparently.
- `flush()` is safe to call multiple times concurrently — use a module-level `_flushing` boolean flag to prevent overlapping flushes.
- **`api.js` error shape (confirmed from source):** the custom fetch wrapper sets `err.status = res.status` on the thrown `Error` object directly. Use `err?.status === 400` not `err?.response?.status`. This applies to the 400/404 discard logic in `flushProgressOutbox`.
- **No `sync.js` in `src/api/`** — `flushQuizOutbox` calls `api.post('/sync', { attempts: payload })` directly from syncService. Do not create a separate api module for this.
- **`POST /api/sync` response shape (CRITICAL):** The sync controller returns `{ success: true, data: { results } }`. After `api.js` strips the `data` wrapper, syncService receives `{ results: [...] }` — NOT a flat array. Access via `response.results` in `flushQuizOutbox`. The spec previously stated the response was a flat array — this was wrong.

### syncService return shapes

`loadEnrolments()` returns `{ modules: [], enrolments: [] }` — always, never throws.
- **Online path:** fetch `modulesApi.getAll({ status: 'PUBLISHED', limit: 100 })` and `enrolmentsApi.getMyEnrolments({ limit: 100 })` in parallel. Cache the enrolments array. Return `{ modules, enrolments }`.
- **Offline path:** read `getCachedEnrolments()`. Derive modules from `cachedEnrolments.map(e => e.module).filter(Boolean)`. Return `{ modules: derived, enrolments: cachedEnrolments }`. Only enrolled modules are visible offline — correct behaviour since unenrolled modules cannot be accessed offline anyway.

`loadModuleDetail(moduleId)` returns `{ module, enrolment }` — either field can be null.
- **Online path:** fetch `modulesApi.getOne(moduleId)`, cache it. Look up the enrolment for this module by reading the cached enrolments list and filtering by `moduleId`. Return `{ module, enrolment }`.
- **Offline path:** read cached module. Read cached enrolments, find by `moduleId`. Return `{ module, enrolment }`.
- Enrolment is required in `LessonScreen` for `contentItemProgresses`, `progressPct`, and `isEnrolled`. The enrolments list must already be cached (guide visits course list before module detail in normal flow).

---

## 8. Screen Integration

### DatabaseContext.js changes (Step 1)

`src/database/DatabaseContext.js` already exists and wraps the entire app (including `AuthProvider`) via `App.js`. It is currently a stub that calls `setDbReady(true)` immediately. This is the correct place to call `initDatabase()` — **not App.js**.

Update the existing `useEffect` inside `DatabaseProvider`:

```js
import { initDatabase } from './db';

// Replace the stub useEffect with:
useEffect(() => {
  initDatabase()
    .then(() => setDbReady(true))
    .catch(() => setDbReady(true)); // degrade gracefully — app works online without offline support
}, []);
```

Both `.then` and `.catch` call `setDbReady(true)` so children always render. SQLite init failure does not crash the app.

### App.js changes

`App.js` already has an `AppInner` component that calls `useNetworkStatus()` and renders `<OfflineBanner>`. Add two new `useEffect` hooks inside `AppInner` — one per step:

**Step 3 — wire setOnlineStatus:**
```js
import { syncService } from './src/services/syncService';

// Inside AppInner, after the existing notification useEffect:
useEffect(() => {
  if (isOnline !== null) {
    syncService.setOnlineStatus(isOnline);
  }
}, [isOnline]);
```

**Step 6 — AppState flush trigger:**
```js
import { AppState } from 'react-native';

// Inside AppInner, alongside the above:
useEffect(() => {
  const sub = AppState.addEventListener('change', (nextState) => {
    if (nextState === 'active') {
      syncService.flush(); // fire-and-forget, errors caught inside flush()
    }
  });
  return () => sub.remove();
}, []);
```

Do not call `initDatabase()` in App.js — it is handled by `DatabaseContext.js`.

### CourseListScreen.js

Replace direct `modulesApi.getAll()` + `enrolmentsApi.getMyEnrolments()` calls with `syncService.loadEnrolments()`.

```js
// Before:
const [modules, enrolments] = await Promise.all([
  modulesApi.getAll({ status: 'PUBLISHED' }),
  enrolmentsApi.getMyEnrolments(),
]);

// After:
const { modules, enrolments } = await syncService.loadEnrolments();
```

When offline and no cache: show empty state — "Connect to the internet to load your modules."

### LessonScreen.js

Replace the three-call `Promise.all` (`modulesApi.getOne`, `contentItemsApi.getAll`, `enrolmentsApi.getMyEnrolmentForModule`) with two syncService calls. `loadModuleDetail` returns `{ module, enrolment }` — not just `module`:

```js
// Before:
const [modData, itemsData, enrolData] = await Promise.all([
  modulesApi.getOne(moduleId),
  contentItemsApi.getAll(moduleId),
  enrolmentsApi.getMyEnrolmentForModule(moduleId),
]);
setModule(modData);
setItems(Array.isArray(itemsData) ? itemsData : []);
setEnrolment(enrolData);

// After:
const [{ module: modData, enrolment: enrolData }, itemsData] = await Promise.all([
  syncService.loadModuleDetail(moduleId),
  syncService.loadContentItems(moduleId),
]);
setModule(modData);
setItems(itemsData);
setEnrolment(enrolData);
```

Remove imports of `modulesApi`, `contentItemsApi`, and `enrolmentsApi`. The `handleEnrol` function still calls `enrolmentsApi.enrol(moduleId)` — keep that import only if enrol is needed, otherwise it too can be removed if enrol is out of scope. For this step, keep enrol working online-only.

When offline and `module === null`: show "This module hasn't been loaded yet. Open it while connected first."

### ContentScreen.js

Replace `enrolmentsApi.markProgress(contentItemId)` with `syncService.markProgress(contentItemId, moduleId)`. `moduleId` is already available from `route.params` in ContentScreen.

**Critical — add `moduleId` to both Quiz navigation calls (required for Step 5):**

ContentScreen has two places that navigate to `'Quiz'`. Both currently pass `{ quizId: item.quizId, moduleTitle }`. Add `moduleId` to both:

```js
// 1. Inside the QuizContent sub-component's onTakeQuiz prop:
onTakeQuiz={() => navigation.navigate('Quiz', { quizId: item.quizId, moduleTitle, moduleId })}

// 2. The bottom navigation bar "Take Quiz" button onPress:
onPress={() => navigation.navigate('Quiz', { quizId: item.quizId, moduleTitle, moduleId })}
```

Remove the `enrolmentsApi` import from ContentScreen after replacing `markProgress`. Keep the `contentItemsApi` import — it is used by the `ImageContent` sub-component to fetch presigned image URLs and is unrelated to this change.

### QuizScreen.js

Two changes:

**1. Quiz loading (Step 3):** replace `quizzesApi.getOne(quizId)` with `syncService.loadQuiz(quizId)` inside the `load` callback. The `Promise.allSettled` structure stays — only the quiz fetch changes:

```js
const [quizData, payData] = await Promise.allSettled([
  syncService.loadQuiz(quizId),   // was: quizzesApi.getOne(quizId)
  paymentsApi.getMyStatus(quizId),
]);
```

Remove `quizzesApi` import after this change.

**2. Submission (Step 5):** replace `quizAttemptsApi.submit()` with `syncService.submitQuizAttempt()`.

`moduleId` is **not** in QuizScreen's current `route.params` — it must be added at the ContentScreen navigation call sites (see ContentScreen.js above) before this step. Then add it to the destructure at the top of QuizScreen:

```js
// Update route.params destructure:
const { quizId, moduleTitle, moduleId } = route.params ?? {};
```

Updated submit handler:

```js
// Before:
const attempt = await quizAttemptsApi.submit(quizId, responses);
navigation.navigate('QuizResult', { attemptId: attempt.id, moduleTitle });

// After:
const result = await syncService.submitQuizAttempt({
  quizId, moduleId, moduleTitle, quizTitle: quiz.title, responses,
});
if (result.offline) {
  navigation.navigate('QuizResult', { offline: true, clientId: result.clientId, moduleTitle });
} else {
  navigation.navigate('QuizResult', { attemptId: result.id, moduleTitle });
}
```

Remove `quizAttemptsApi` import after Step 5 — it is no longer used in QuizScreen.

### QuizResultScreen.js

Handle the offline route param. If `route.params.offline === true`, show:
- Title: "Quiz Saved"
- Body: "You're offline. Your answers have been saved and will be submitted automatically when you reconnect."
- No score displayed (score requires server-side processing)
- Button: "Back to Modules"

If `route.params.offline` is false/absent, existing logic applies (fetch attempt by attemptId, display score).

### GuideProfileScreen.js

The current screen uses a Modal for the "Are you sure?" confirmation (triggered by a "Sign Out" button). The outbox check must intercept the Sign Out **button tap** — before `setShowSignOut(true)` is called — not the Modal's confirm button.

Change the Sign Out `TouchableOpacity` `onPress` from `() => setShowSignOut(true)` to an async handler:

```js
import { getQuizOutbox } from '../../database/db';

// New async handler replaces () => setShowSignOut(true):
const handleSignOutTap = async () => {
  const outbox = await getQuizOutbox();
  if (outbox.length > 0) {
    Alert.alert(
      'Unsynced Quiz Attempts',
      `You have ${outbox.length} quiz attempt${outbox.length !== 1 ? 's' : ''} that haven't been submitted yet. ` +
      'Connect to the internet and wait for sync before logging out, or your answers will be lost.',
      [
        { text: 'Stay Logged In', style: 'cancel' },
        { text: 'Log Out Anyway', style: 'destructive', onPress: () => logout() },
      ]
    );
    return;
  }
  setShowSignOut(true); // outbox empty — proceed to normal confirmation modal
};
```

The existing Modal and its Cancel/Log Out buttons remain unchanged. `getQuizOutbox` is a direct `db.js` import — this is an intentional exception to the "screens don't call db.js" rule since this is a read-only check with no sync logic.

### AuthContext.js

In the `logout` `useCallback`, add `clearAllCache()` after the API call and before `clearAccessToken()`. The actual order in the file is: `api.post('/auth/logout')` → `clearAccessToken()` → `tokenStorage.clearRefresh()` → `tokenStorage.clearUser()` → `setUser(null)`. Insert `clearAllCache()` between the API call and `clearAccessToken()`:

```js
import { clearAllCache } from '../database/db';

const logout = useCallback(async () => {
  try { await api.post('/auth/logout', {}); } catch {}
  try { await clearAllCache(); } catch {} // wipe SQLite — wrapped in own try/catch so logout always completes
  clearAccessToken();
  await tokenStorage.clearRefresh();
  await tokenStorage.clearUser();
  setUser(null);
}, []);
```

---

## 9. Cache Refresh Strategy

| Event | Action |
|---|---|
| App cold start + online | `initDatabase()`, then `syncService.flush()` (from AppState active on first render) |
| App foregrounds (AppState active) | `syncService.flush()` — always |
| Guide opens Modules tab | `syncService.loadEnrolments()` — tries API first, falls back to cache |
| Guide opens a module | `syncService.loadModuleDetail()` + `loadContentItems()` |
| Guide opens a quiz screen | `syncService.loadQuiz()` |
| Post-flush success | Re-cache enrolments (reflects updated progressPct) |
| Guide logs out | `clearAllCache()` — wipes all tables |

No background periodic refresh. Data is refreshed when the user navigates to it while online. The cache is a fallback, not a primary store.

---

## 10. Conflict Resolution

The backend `POST /api/sync` endpoint normalises attempt numbers server-side: if a `quizId`/`guideId` pair already has 2 attempts, the next submitted attempt becomes attempt 3 regardless of the `attemptNumber` field the client sends. No client-side conflict resolution is needed.

For progress marks, `POST /api/enrolments/me/progress` is idempotent — the same `contentItemId` can be posted multiple times safely.

The one accepted edge case: a guide takes a quiz offline, pays for a retake online before the outbox is flushed, then syncs. The server creates both as separate attempts. This is correct — both attempts are valid records.

---

## 11. Logout Behaviour

On `clearAllCache()`, all three tables are cleared atomically inside a transaction:
```sql
DELETE FROM cache;
DELETE FROM quiz_outbox;
DELETE FROM progress_outbox;
```

Any unsynced quiz attempts in the outbox are permanently lost on logout. This is acceptable — the logout guard (section 8, GuideProfileScreen.js) warns the guide before this happens.

Guide B logging in after Guide A logs out sees an empty SQLite database — Guide A's data was wiped by `clearAllCache()`.

---

## 12. Implementation Order

Follow this exact sequence. Each step is independently testable before moving to the next.

### Pre-implementation checklist (verify before writing any code)

- [ ] Run `npx expo install expo-sqlite` from `apps/mobile/` — confirm `expo-sqlite ~14.x.x` appears in `package.json`
- [ ] Read `src/services/api.js` to confirm error shape — errors have `err.status` set directly (not `err.response.status`). Already confirmed: the custom fetch wrapper does `err.status = res.status`.
- [ ] Check `src/api/` for a `sync.js` file — there is none. Call `api.post('/sync', { attempts: payload })` directly from syncService.
- [ ] Read `apps/api/src/controllers/sync.js` to confirm the `POST /api/sync` response shape. The `api.js` client strips the `data` wrapper, so syncService receives `[{ clientId, status, serverAttemptId }]` directly.
- [ ] Confirm expo-sqlite v14 method names: `openDatabaseAsync`, `execAsync`, `getAllAsync`, `getFirstAsync`, `runAsync`, `withTransactionAsync`. Verify against the installed package before writing `db.js`.
- [ ] Confirm ContentScreen's two navigation calls to `'Quiz'` — both currently pass `{ quizId, moduleTitle }` without `moduleId`. Both must be updated before Step 5. Locations: `QuizContent` component `onTakeQuiz` prop and the bottom bar "Take Quiz" button `onPress`.
- [ ] Confirm UUID generation approach for `client_id` — check if `expo-crypto` is in `package.json`. If not, use an inline generator (e.g. `Math.random().toString(36).slice(2) + Date.now().toString(36)`) rather than adding a dependency.

### Step 1 — Install expo-sqlite and rewrite db.js
```bash
cd apps/mobile
npx expo install expo-sqlite
```
- Completely replace `src/database/db.js` with the SQLite implementation (section 6)
- Implement `initDatabase()` — opens `parkguide_offline.db`, runs `CREATE TABLE IF NOT EXISTS`, resets any `syncing` rows to `pending`
- Implement all cache read/write functions
- Implement all outbox functions
- **Verify:** Call each exported function in isolation, confirm AsyncStorage is no longer imported anywhere

### Step 2 — syncService.js (online cache-through only)
- Create `src/services/syncService.js`
- Implement `loadEnrolments()`, `loadModuleDetail()`, `loadContentItems()`, `loadQuiz()`
- Online path only for now: fetch from API → write to SQLite cache → return data
- Offline path: read from SQLite cache → return data (or safe default)
- Do not implement `flush()` or outboxes yet
- **Verify:** Navigate all guide screens online — behaviour identical to before. Put device in airplane mode — cached data appears.

### Step 3 — Screen integration
- Update `CourseListScreen.js`, `LessonScreen.js`, `QuizScreen.js` (load only) to call `syncService.load*()`
- Update `ContentScreen.js` to call `syncService.markProgress()` (online path only, no outbox yet)
- Add `initDatabase()` call to `App.js`
- **Verify:** Full online guide flow works identically to before

### Step 4 — Progress outbox
- Implement offline path in `syncService.markProgress()`: call `addToProgressOutbox()`
- Implement `flushProgressOutbox()` inside `syncService.flush()`
- **Verify TC-6:** Enable airplane mode → open a TEXT item (progress queued) → reconnect → foreground app → check progress % updated on server

### Step 5 — Quiz outbox and offline result screen
- Implement offline path in `syncService.submitQuizAttempt()`: call `addToQuizOutbox()`
- Implement `flushQuizOutbox()` inside `syncService.flush()`
- Update `QuizResultScreen.js` to handle `{ offline: true }` route param
- **Verify TC-4 + TC-5:** Take quiz offline → "Quiz saved" screen → reconnect → foreground → attempt in admin grading queue

### Step 6 — App.js flush trigger
- Add AppState listener to `App.js` calling `syncService.flush()` on `active`
- **Verify:** Take quiz offline, background app, reconnect, foreground — auto-sync fires without user action

### Step 7 — Logout guard and cache clear
- Update `GuideProfileScreen.js` with quiz outbox check before logout
- Update `AuthContext.logout()` to call `clearAllCache()`
- **Verify TC-7:** Offline quiz in outbox → tap Log Out → warning shown
- **Verify TC-8:** Guide A caches data → logs out → Guide B logs in offline → no Guide A data visible

### Step 8 — Edge case hardening
- In `initDatabase()`: reset any `status = 'syncing'` rows to `pending` (handles crash-during-flush)
- In all db.js reads: wrap `JSON.parse()` in try/catch, return safe default on corrupt data
- In `syncService.load*()`: if SQLite read returns null/empty and we're offline, show empty state with helpful message rather than an error
- **Verify TC-9:** Kill app → airplane mode → relaunch → dashboard with cached data shown
- **Verify TC-10:** Manually corrupt a cache row → airplane mode → open Modules → empty state, no crash

---

## 13. Testing & Verification Plan

### Environment setup
- Android emulator: use extended controls (`...` → Cellular → No signal) to simulate airplane mode
- `EXPO_PUBLIC_API_BASE=http://10.0.2.2:3000/api` for emulator
- Inspect SQLite DB: install `expo-sqlite` DevTools or use `db.getAllAsync('SELECT * FROM quiz_outbox')` with a temporary debug screen

### 10 Test Cases

| TC | Scenario | Steps | Expected |
|---|---|---|---|
| TC-1 | Module list survives airplane mode | Load Modules online → airplane mode → re-navigate to Modules | Module list shown from cache, offline banner visible |
| TC-2 | Content item list survives airplane mode | Open a module online → airplane mode → re-open same module | Content item list shown from SQLite cache |
| TC-3 | TEXT content survives airplane mode | Open TEXT item online → airplane mode → re-open same item | Text body renders from cache |
| TC-4 | Quiz can be taken offline | Open quiz screen online (caches quiz) → airplane mode → answer all questions → submit | "Quiz Saved" screen, no error alert |
| TC-5 | Offline quiz syncs on reconnect | Complete TC-4 → reconnect → background + foreground app | Attempt appears in admin quiz review queue |
| TC-6 | Progress marks sync on reconnect | Open TEXT item offline → reconnect → foreground | Module progress % increased on dashboard |
| TC-7 | Logout guard fires with pending quiz | Take quiz offline → tap Log Out while still offline | Alert: "You have 1 unsynced attempt" with Stay / Log Out options |
| TC-8 | Logout clears Guide A data | Guide A loads data → logs out → Guide B logs in → airplane mode → open Modules | Empty state (no Guide A data) |
| TC-9 | Cold start offline shows cached data | Load data online → kill app → airplane mode → relaunch | Dashboard and Modules show cached data |
| TC-10 | Corrupt cache row causes empty state not crash | Manually insert invalid JSON in `cache` table → airplane mode → open Modules | Empty state with "Connect to load" message, no crash |

### Pass criteria
All 10 test cases pass with no unhandled errors or crashes.

---

## 14. Key Constraints & Decisions

| Decision | Rationale |
|---|---|
| expo-sqlite over AsyncStorage | SQLite provides atomic transactions for outbox operations. Outbox read/modify/write on AsyncStorage is not atomic — crash mid-write can leave partial state. SQLite `withTransactionAsync()` rolls back on failure. |
| expo-sqlite v14 (managed workflow) | Works in Expo SDK 52 managed workflow without prebuild. The old db.js comment about "SQLite disabled for Expo Go" was written for SDK 48 and is no longer true. |
| `cache` table stores JSON blobs (not normalized) | The cache exactly mirrors API response shapes. Normalizing would require custom mapping on read and write for no query benefit — guide screens load entire enrolment lists or entire module objects, never individual fields. |
| `quiz_outbox` and `progress_outbox` are normalized | These tables are the "reliable delivery" mechanism. Row-level INSERT/DELETE/UPDATE with transactions gives crash safety that JSON blob storage cannot. |
| `content_item_id` as PK on progress_outbox | Natural deduplication. Marking the same item twice (online path called, then offline path called before page unmounts) inserts only one row. Safe because `POST /api/enrolments/me/progress` is idempotent. |
| No background sync | React Native background tasks have significant platform restrictions. Flush is triggered on app foreground (AppState active). Acceptable for the use case — guides open the app when back in range. |
| No TTL on cache | Cache is refreshed on every successful online load. Stale read-only data is preferable to no data for a guide in the field. |
| Admin screens excluded | Offline sync is a guide-only feature. Admin operations (publishing modules, grading quizzes) require live data and live confirmation. |
| Backend unchanged | `POST /api/sync` and `POST /api/enrolments/me/progress` are already implemented and handle all edge cases (duplicate attempts, idempotent progress marks). |

---

## 15. Files Created / Modified

| File | Status | Change |
|---|---|---|
| `src/database/db.js` | **Full rewrite** | Replace AsyncStorage scaffold with expo-sqlite implementation |
| `src/database/DatabaseContext.js` | **Modify** | Call `initDatabase()` in useEffect (was a no-op stub) |
| `src/services/syncService.js` | **New file** | Orchestration layer |
| `App.js` | **Modify** | `setOnlineStatus` wiring (Step 3) + AppState flush trigger (Step 6) — NOT `initDatabase()` |
| `src/screens/parkguide/CourseListScreen.js` | **Modify** | Use `syncService.loadEnrolments()` |
| `src/screens/parkguide/LessonScreen.js` | **Modify** | Use `syncService.loadModuleDetail()` + `loadContentItems()` |
| `src/screens/parkguide/ContentScreen.js` | **Modify** | Use `syncService.markProgress()`; add `moduleId` to both Quiz navigation calls |
| `src/screens/parkguide/QuizScreen.js` | **Modify** | Use `syncService.loadQuiz()` + `submitQuizAttempt()`; destructure `moduleId` from route.params |
| `src/screens/parkguide/QuizResultScreen.js` | **Modify** | Handle `{ offline: true }` route param |
| `src/screens/parkguide/GuideProfileScreen.js` | **Modify** | Logout guard — intercept Sign Out button tap, check quiz outbox |
| `src/services/AuthContext.js` | **Modify** | Call `clearAllCache()` on logout |

**Backend: zero changes.** All required endpoints are already implemented.

**Package: one addition.** Run `npx expo install expo-sqlite` before Step 1.

---

## 16. API Endpoints Used

| Endpoint | Called by | When |
|---|---|---|
| `GET /enrolments` | `syncService.loadEnrolments()` | Modules tab load — online path |
| `GET /modules/:id` | `syncService.loadModuleDetail()` | Module open — online path |
| `GET /modules/:id/content-items` | `syncService.loadContentItems()` | Module open — online path |
| `GET /quizzes/:id` | `syncService.loadQuiz()` | Quiz screen open — online path |
| `POST /enrolments/me/progress` | `syncService.markProgress()` | Content item viewed (online) or flushed from outbox |
| `POST /quiz-attempts` | `syncService.submitQuizAttempt()` | Quiz submitted — online path only |
| `POST /sync` | `syncService.flush()` → `flushQuizOutbox()` | On reconnect — drains quiz outbox |
| `GET /certifications` | `syncService.loadEnrolments()` | Dashboard cert count — online path |

---

## 17. connectivityService.js — Do Not Modify

`src/services/connectivityService.js` exposes `{ isOnline }` via the `useNetworkStatus()` hook. It uses `@react-native-community/netinfo` with an HTTP polling fallback.

`syncService.js` cannot use this hook directly (hooks can only be called from React components). Instead, `App.js` (`AppInner`) calls `syncService.setOnlineStatus(isOnline)` via a `useEffect` whenever the `isOnline` value from `useNetworkStatus()` changes. This propagates connectivity state into the module-level `_isOnline` flag in syncService without any hook dependency.

---

## 18. Discovered State from Code Audit

These facts were established by reading the actual source files before implementation planning. Where this section and sections 1–17 differ, this section takes precedence.

### DatabaseContext.js already exists
`src/database/DatabaseContext.js` wraps the entire app (including `AuthProvider`) in `App.js`. It is a stub: currently calls `setDbReady(true)` immediately in a `useEffect` with no actual DB work. This is the correct place to call `initDatabase()` — the spec (section 8) was written without knowledge of this file and incorrectly assigned `initDatabase()` to `App.js`. `App.js` only handles `setOnlineStatus` wiring (Step 3) and the AppState flush trigger (Step 6).

### moduleId missing from QuizScreen route params
`ContentScreen` navigates to `'Quiz'` with `{ quizId: item.quizId, moduleTitle }`. `moduleId` is not passed. `syncService.submitQuizAttempt()` requires `moduleId` to write to the quiz outbox. This must be fixed in ContentScreen **before Step 5**. There are exactly two navigation calls to `'Quiz'` in ContentScreen: the `QuizContent` sub-component's `onTakeQuiz` prop and the bottom navigation bar's "Take Quiz" button `onPress`. Both need `moduleId` added. `moduleId` is already in scope from `route.params` in ContentScreen. QuizScreen must also add `moduleId` to its `route.params` destructure.

### GuideProfileScreen logout uses a Modal, not Alert.alert
The current logout flow: Sign Out `TouchableOpacity` → `setShowSignOut(true)` → `Modal` renders → user presses "Log Out" inside modal → `logout()`. The outbox guard must intercept at the Sign Out button tap (change its `onPress` to `handleSignOutTap`). If the outbox is non-empty, show `Alert.alert` (which preempts the modal entirely). If empty, call `setShowSignOut(true)` as before — the existing Modal remains unchanged.

### AuthContext.js logout function order
The actual order in `AuthContext.js`: `api.post('/auth/logout')` → `clearAccessToken()` → `tokenStorage.clearRefresh()` → `tokenStorage.clearUser()` → `setUser(null)`. `clearAllCache()` must be inserted after `api.post('/auth/logout')` and before `clearAccessToken()`. Wrap it in its own `try/catch` so SQLite failure never blocks logout from completing.

### api.js error format
The custom fetch wrapper (`src/services/api.js`) sets `err.status = res.status` directly on the thrown `Error` object. It is not Axios — there is no `err.response`. When checking for 400/404 in `flushProgressOutbox`, use `err?.status === 400`. This has been confirmed from the source.

### No sync.js API module
There is no `src/api/sync.js`. The `flushQuizOutbox` function in syncService calls `api.post('/sync', { attempts: payload })` directly using the imported `api` singleton. Do not create a separate API module for this.

### ContentScreen keeps contentItemsApi import
`contentItemsApi` is used by the `ImageContent` sub-component inside ContentScreen to fetch presigned S3 image URLs via `contentItemsApi.getImageUrl()`. This import must stay. Only the `enrolmentsApi` import is removed when switching `markProgress` to syncService.

### UserDashboard is not modified for offline sync
`UserDashboard.js` calls `enrolmentsApi`, `notificationsApi`, and `certificationsApi` directly. It is not in the list of files to modify. Dashboard cert count shows 0 offline — acceptable. Do not add syncService integration to UserDashboard.

### expo-sqlite v14 API (confirmed method names)
- Open: `SQLite.openDatabaseAsync('parkguide_offline.db')`
- DDL: `db.execAsync(sql)` — no params
- Single row: `db.getFirstAsync(sql, [params])`
- Multiple rows: `db.getAllAsync(sql, [params])`
- Write: `db.runAsync(sql, [params])`
- Transaction: `db.withTransactionAsync(async () => { ... })`
- Parameters use `?` placeholders

---

## 19. Risk Register

| Risk | Where it surfaces | Mitigation |
|---|---|---|
| expo-sqlite v14 method names differ from what was planned | Step 1 — db.js | Read the installed package's index.d.ts or README before writing db.js. Method names listed in section 18 are confirmed. |
| `POST /api/sync` response shape unknown | Step 5 — flushQuizOutbox | Read `apps/api/src/controllers/sync.js` before implementing. `api.js` strips the `data` wrapper — syncService receives the array directly. Expected shape: `[{ clientId, status, serverAttemptId }]`. |
| `moduleId` forgotten when updating ContentScreen | Step 3 / Step 5 | There are exactly two navigation calls to `'Quiz'` in ContentScreen. Both must be updated. Do not update only one. |
| `flushProgressOutbox` 400/404 check uses wrong error shape | Step 4 | Use `err?.status === 400` — confirmed from api.js source. Not `err?.response?.status`. |
| `DatabaseContext.dbReady` blocks children rendering | Step 1 | Both `.then` and `.catch` of `initDatabase()` call `setDbReady(true)`. Children always render. SQLite init failure degrades gracefully. |
| Overlapping flush calls on rapid foreground events | Step 6 | The `_flushing` boolean flag in syncService prevents concurrent flushes. Verify it is set to `true` at the start of flush and `false` in the `finally` block. |
| Quiz outbox rows stuck in `syncing` after crash | Step 8 | `initDatabase()` runs `UPDATE quiz_outbox SET status = 'pending' WHERE status = 'syncing'` after the CREATE TABLE statements. Verify this SQL is present in the final db.js. |
| Guide B sees Guide A data after logout | Step 7 | `clearAllCache()` deletes all three tables inside a transaction. Verify the `DELETE FROM` statements cover all three: `cache`, `quiz_outbox`, `progress_outbox`. |
| Corrupt JSON in cache crashes the app | Step 8 | Every `JSON.parse()` in db.js is inside a try/catch that returns the safe default. Verify individually — the outer function try/catch alone is not sufficient if `JSON.parse` is the only thing that throws. |
