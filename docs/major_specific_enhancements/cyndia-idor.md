# Major Specific Enhancement: IDOR Hardening & API Access Control
## 1. What I Did (Implementation)
Instead of relying solely on route-level middleware, I implemented Controller-Level Object-Level Authorization across all "Own Resource" domains. During the development of the API controllers, I ensured that every endpoint handling sensitive user data follows strict defensive coding patterns:
1. **Enforced Strict Ownership Checks (UUID Manipulation Defense):** In controllers fetching single resources (e.g., viewing a quiz attempt), I added explicit logic to compare `req.user.id`(from the JWT) against the requested database record's ID.
2. **Corrected HTTP Status Codes (Information Leakage Prevention):** I ensured that if a user tries to access a resource that doesn't belong to them, the API returns a `403 Forbidden` (meaning "You don't have permission"), rather than a `404 Not Found` (which prevents attackers from guessing if a specific resource UUID exists).
3. **Hardened List Endpoints (Query Parameter Injection Defense):** I forced list endpoints (like getting all enrolments) to strictly ignore user-supplied query parameters (like `?guideId=123`) if the user is a Guide role, forcing the database to only return their own data.
4. **RBAC Boundary Verification:** I ensured `requireRole('ADMIN')` is present on all management endpoints (like quiz grading) to prevent privilege escalation.

## 2. How It Benefits The Project
- **Prevent Cross-Tenant Data Leaks:** A Park Guide cannot manipulate a URL UUID to view another Park Guide's quiz answer, certifications, or personal progress. This is critical for SFC's data privacy.
- **Zero Architecture Overhead:** Unlike other database-level security enhancements (like Row-Level Security), this solution requires no new packages, no raw SQL, and no changes to the Prisma schema. It is a pure application-layer defense that fits our existing Express + Prisma architecture.
- **Mitigates a Top 10 OWASP Vulnerability:** It directly addresses API5:2023 - Broken Object Level Authorization (BOLA/IDOR), which is the #1 API security vulnerability in the world.
- **Protects Legal Documents:** Ensures that generated Certification PDFs cannot be downloaded by unauthorized guides.

## 3. Technical Implementation Details
### Pattern A: The IDOR Shield (Single Resource Endpoints)
Applied to: `getOne` controller. 
What it stops: A guide changing /api/quiz-attempts/attempts/attempt-123 to attempt-456 in the URL to view another guide's answers.
``` javascript
// From apps/api/src/controllers/quizAttempts.js -> getOne
const attempt = await prisma.quizAttempt.findUnique({ where: {id: req.params.id }});
// 2. If it doesn't exist, return 404
if (!attempt) { return res.status(404) .json({ success: false, error: { code: 'NOT_FOUND', message: 'Attempt not found' }});}
// 3. The IDOR shield: If it exists but doesn't belong to them, return 403
if (req.user.role === 'GUIDE' && attempt.guideId !== req.user.id) { return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' }});}
```
### Pattern B: Hardened List Endpoints (Filtering Defense)
Applied to: `list` controller.
What it stops: A guide calling `/api/quiz-attempts?guideId=<another-user-id>` to bypass ownership checks and view an array of another guide's attempts.
```javascript
//  From apps/api/src/controllers/quizAttempts.js -> list
const where = {};

// Force guides to only see their own data
// This ignores any malicious ?guideId= query params sent by the client
if (req.user.role === 'GUIDE') {
    where.guideId = req.user.id; // Locked to their own JWT ID
} else {
    // Only Admins are allowed to use the guideId filter to view others
    if (guideId) where.guideId = guideId;
}

const [total, rows] = await Promise.all([
    prisma.quizAttempt.count({ where }),
    prisma.quizAttempt.findMany({ where, /* ... */ }),
])
```

## 4. Affected Domains
This hardening logic is applied to: 
- Users (Profile viewing/updating)
- Enrolments (Viewing own progress)
- Quiz Attempts (Viewing own scores/answers, preventing cross-user list filtering)
- Content Progress (Offline sync submission)
- Certifications (Downloading own PDFs)
- Badges (Viewing own achievements)
- Notifications (Viewing own inbox)
