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

**Storage: `expo-sqlite` v14 (not AsyncStorage)**

`expo-sqlite` v14 ships with Expo SDK 52 and works in managed workflow — no `expo prebuild` or native build required. It works in Expo Go, Android emulator, and physical devices identically.

The comment in the existing `src/database/db.js` scaffold saying "SQLite disabled for Expo Go" was written for SDK 48 and is **outdated**. SDK 52 with expo-sqlite v14 has no such restriction.

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

- `syncService` does not import or use `connectivityService.js` (that's a React hook — hooks cannot be called outside components). Instead, connectivity is checked by attempting an API call and catching network errors, OR by reading a module-level `isOnline` flag that App.js keeps updated via NetInfo.
- `syncService` uses `api.js` for all network calls — JWT refresh is handled transparently.
- `flush()` is safe to call multiple times concurrently — use a module-level `_flushing` boolean flag to prevent overlapping flushes.

---

## 8. Screen Integration

### App.js changes

Add AppState listener for flush triggering (alongside the existing notification listener):

```js
import { AppState } from 'react-native';
import { syncService } from './src/services/syncService';
import { initDatabase } from './src/database/db';

// In the root component, on mount:
useEffect(() => {
  // Initialise SQLite on app start
  initDatabase();

  const sub = AppState.addEventListener('change', (nextState) => {
    if (nextState === 'active') {
      syncService.flush();  // fire-and-forget, errors are caught inside flush()
    }
  });
  return () => sub.remove();
}, []);
```

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

Replace `modulesApi.getOne(moduleId)` + `contentItemsApi.getAll(moduleId)` + `enrolmentsApi.getMyEnrolmentForModule(moduleId)` with syncService calls.

```js
const [module, items] = await Promise.all([
  syncService.loadModuleDetail(moduleId),
  syncService.loadContentItems(moduleId),
]);
```

When offline and not cached: "This module hasn't been loaded yet. Open it while connected first."

### ContentScreen.js

Replace `enrolmentsApi.markProgress(contentItemId)` with `syncService.markProgress(contentItemId, moduleId)`.

No other changes — the content body (textContent, videoUrl, etc.) already comes from the content item object passed as a route param from LessonScreen.

### QuizScreen.js

Two changes:

**1. Quiz loading:** replace `quizzesApi.getOne(quizId)` with `syncService.loadQuiz(quizId)`.

**2. Submission:** replace `quizAttemptsApi.submit()` with `syncService.submitQuizAttempt()`.

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

### QuizResultScreen.js

Handle the offline route param. If `route.params.offline === true`, show:
- Title: "Quiz Saved"
- Body: "You're offline. Your answers have been saved and will be submitted automatically when you reconnect."
- No score displayed (score requires server-side processing)
- Button: "Back to Modules"

If `route.params.offline` is false/absent, existing logic applies (fetch attempt by attemptId, display score).

### GuideProfileScreen.js

Before calling `logout()`, check the quiz outbox:

```js
const outbox = await getQuizOutbox();  // import from db.js
if (outbox.length > 0) {
  Alert.alert(
    'Unsynced Quiz Attempts',
    `You have ${outbox.length} quiz attempt(s) that haven't been submitted yet. ` +
    'Connect to the internet and wait for sync before logging out, or your attempts will be lost.',
    [
      { text: 'Stay Logged In', style: 'cancel' },
      { text: 'Log Out Anyway', style: 'destructive', onPress: () => logout() },
    ]
  );
  return;
}
logout();
```

### AuthContext.js

In the `logout()` function, call `clearAllCache()` from `db.js` after clearing SecureStore:

```js
import { clearAllCache } from '../database/db';

// Inside logout():
await clearAllCache();        // wipe SQLite cache and outboxes
await tokenStorage.clearRefresh();
await tokenStorage.clearUser();
clearAccessToken();
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
| `src/services/syncService.js` | **New file** | Orchestration layer |
| `App.js` | **Modify** | `initDatabase()` on mount + AppState flush trigger |
| `src/screens/parkguide/CourseListScreen.js` | **Modify** | Use `syncService.loadEnrolments()` |
| `src/screens/parkguide/LessonScreen.js` | **Modify** | Use `syncService.loadModuleDetail()` + `loadContentItems()` |
| `src/screens/parkguide/ContentScreen.js` | **Modify** | Use `syncService.markProgress()` |
| `src/screens/parkguide/QuizScreen.js` | **Modify** | Use `syncService.loadQuiz()` + `submitQuizAttempt()` |
| `src/screens/parkguide/QuizResultScreen.js` | **Modify** | Handle `{ offline: true }` route param |
| `src/screens/parkguide/GuideProfileScreen.js` | **Modify** | Logout guard — check quiz outbox before logout |
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

`syncService.js` cannot use this hook directly (hooks can only be called from React components). Instead, `flush()` is called from `App.js`'s AppState listener on every foreground event — at which point connectivity is assumed to be available. If the flush fails due to network error, outbox items remain and retry on the next foreground event. This is the correct approach: do not attempt to replicate NetInfo logic inside syncService.
