# Admin Training Analytics Dashboard

**Role:** Elyn  
**Enhancement type:** Data science — descriptive analytics

---

## Overview

The Admin Training Analytics Dashboard gives administrators a single-page view of training programme health. Instead of reading individual enrolment and quiz records, an admin can spot trends at a glance and decide where to intervene.

The dashboard is purely **descriptive**: it summarises what has already happened. No machine learning or predictive models are involved.

---

## API Endpoint

```
GET /api/analytics/admin-training
Authorization: Bearer <admin token>
```

Returns a single JSON object with five sections:

```json
{
  "success": true,
  "data": {
    "summary": { ... },
    "participation": [ ... ],
    "outcomes": [ ... ],
    "modulePassRates": [ ... ],
    "guideProgress": [ ... ]
  }
}
```

### `summary`

| Field | Type | Description |
|---|---|---|
| `totalEnrolledGuides` | number | Distinct guide accounts with at least one enrolment |
| `activeGuides` | number | Enrolled guides whose account status is `ACTIVE` |
| `inactiveGuides` | number | Enrolled guides whose status is `INACTIVE` or `SUSPENDED` |
| `certificationCompletionRate` | number | `(guides with ≥1 cert / totalEnrolledGuides) × 100`, rounded to nearest integer |

### `participation`

Array for the Participation Overview pie chart:

```json
[
  { "name": "Active",   "value": 95 },
  { "name": "Inactive", "value": 25 }
]
```

### `outcomes`

Array for the Training Outcomes pie chart. Outcome per guide is determined by certification status: a certification is only issued after a guide passes, so it is the definitive pass signal.

```json
[
  { "name": "Passed",      "value": 82 },
  { "name": "Failed",      "value": 18 },
  { "name": "In Progress", "value": 20 }
]
```

- **Passed:** guide has at least one certification  
- **In Progress:** guide is enrolled but has no graded quiz attempt yet  
- **Failed:** guide has a graded attempt but no certification  

### `modulePassRates`

Array for the Module Pass Rate bar chart. Only published modules that have a quiz are included.

```json
[
  { "moduleTitle": "Eco-Tourism Basics", "passRate": 90 },
  { "moduleTitle": "Emergency Response", "passRate": 42 }
]
```

`passRate = (guides certified for that module / guides with a graded attempt for that module) × 100`

If no graded attempts exist for a module, `passRate` is `0`.

### `guideProgress`

Array for the Guide Progress table. Each row represents one enrolled guide.

```json
[
  { "guideId": "...", "guideName": "ali.ranger", "modulesAssigned": 5, "modulesCompleted": 5, "status": "Completed"   },
  { "guideId": "...", "guideName": "sarah.tan",  "modulesAssigned": 5, "modulesCompleted": 3, "status": "In Progress" },
  { "guideId": "...", "guideName": "john.lee",   "modulesAssigned": 5, "modulesCompleted": 2, "status": "At Risk"     }
]
```

Status logic:

| Condition | Status |
|---|---|
| `modulesCompleted == modulesAssigned` (and > 0) | Completed |
| `modulesCompleted / modulesAssigned < 0.5` | At Risk |
| Otherwise | In Progress |

`guideName` is the guide's `username` field.

---

## Frontend

**Route:** `/analytics` (admin-only, protected)  
**Component:** `apps/web/src/pages/admin/Analytics/Analytics.jsx`  
**API client:** `apps/web/src/api/analytics.js`  
**Nav entry:** second item in the admin sidebar, between Dashboard and Registrations  
**Charts library:** Recharts v2

The page renders four panels:

1. **KPI cards** — four summary numbers across the top  
2. **Participation Overview** — pie chart (Active vs Inactive)  
3. **Training Outcomes** — pie chart (Passed / Failed / In Progress)  
4. **Module Pass Rate Analysis** — horizontal bar chart per published module  
5. **Guide Progress Monitoring** — table with completion counts and colour-coded status

Panels 2–5 are conditionally rendered and only appear when the relevant array is non-empty.

---

## Data sources

All data comes from existing tables. No new columns or tables were added.

| Section | Source tables |
|---|---|
| Summary | `Enrolment`, `User`, `Certification` |
| Participation | `Enrolment`, `User` |
| Outcomes | `Enrolment`, `QuizAttempt`, `Certification` |
| Module pass rates | `Module`, `QuizAttempt`, `Certification` |
| Guide progress | `Enrolment`, `User` |

---

## Scope

**Included:**
- Guide enrolment and account status
- Quiz attempt outcomes (graded vs ungraded)
- Module-level pass rates derived from certifications
- Per-guide completion tracking

**Excluded:**
- Predictive modelling
- Per-content-item tracking (only module-level)
- Guides with no enrolments (they have nothing to show)
