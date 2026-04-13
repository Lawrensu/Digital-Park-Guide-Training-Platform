# Database Design

## Overview

All structured data is stored in a single PostgreSQL instance accessed via Prisma ORM. Binary assets (videos, images, PDFs, evidence frames) are never stored in the database, only the S3 key is stored as a string reference. Pre-signed URLs are generated on-demand by the API at request time.

---

## Enums

```
Role                  ADMIN | GUIDE
UserStatus            INACTIVE | ACTIVE | SUSPENDED
ApplicationStatus     PENDING | APPROVED | REJECTED
ModuleStatus          DRAFT | PUBLISHED | ARCHIVED
ContentType           VIDEO | IMAGE | TEXT | INFOGRAPHIC | QUIZ
VideoSource           S3 | YOUTUBE
InfographicSubtype    HOTSPOT | SCENARIO | STEPPER
QuestionType          MCQ | TRUE_FALSE | SHORT_ANSWER | LONG_ANSWER
AttemptStatus         PENDING_REVIEW | GRADED
DetectionType         PLANT_DAMAGE | WILDLIFE_DISTURBANCE
AlertStatus           PENDING | CONFIRMED | FALSE_DETECTION
DeviceStatus          ACTIVE | INACTIVE | DECOMMISSIONED
NotificationType      REGISTRATION | IOT_ALERT | MODULE_PUBLISHED | DEADLINE_REMINDER | QUIZ_RESULT | CERTIFICATE_APPROVED | CUSTOM
```

---

## Tables

### `RegistrationApplication`

Permanent audit record of every registration submission. Never deleted after approval or rejection.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| first_name | VARCHAR | |
| last_name | VARCHAR | |
| email | VARCHAR UNIQUE | Used to send approval/rejection email |
| ic_passport_number | VARCHAR | Original submitted identity document number |
| address | TEXT | |
| reason | TEXT | Applicant's stated reason for applying |
| cv_s3_key | VARCHAR | S3 key of uploaded CV PDF |
| status | ApplicationStatus | Default: PENDING |
| rejection_reason | TEXT | Nullable — admin fills if rejecting |
| reviewed_by | UUID FK → User.id | Nullable — null until reviewed |
| reviewed_at | TIMESTAMPTZ | Nullable — null until reviewed |
| submitted_at | TIMESTAMPTZ | Default: now() |

---

### `User`

Created only upon admin approval of a RegistrationApplication. Admins are created via seed or admin-only endpoint.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| application_id | UUID FK → RegistrationApplication.id | Nullable : null for admin accounts created via seed/admin endpoint |
| role | Role | ADMIN or GUIDE |
| username | VARCHAR UNIQUE | Auto-generated for guides (FirstName + 4-digit number) |
| email | VARCHAR UNIQUE | |
| password_hash | VARCHAR | Nullable until guide activates account |
| ic_passport_number | VARCHAR | Nullable — guides only; copied from application on approval |
| status | UserStatus | Default: INACTIVE |
| start_date | DATE | Nullable : guides only; set by admin on approval |
| created_at | TIMESTAMPTZ | Default: now() |
| updated_at | TIMESTAMPTZ | |

---

### `PasswordResetToken`

Handles both initial account activation (24hr link) and standard forgot-password flow. Reused for both flows via the same endpoint.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK → User.id | |
| token_hash | VARCHAR | `crypto.randomBytes(32)` hashed before storage |
| expires_at | TIMESTAMPTZ | 24 hours from creation |
| created_at | TIMESTAMPTZ | Default: now() |

---

### `Module`

A training module created and managed by admins.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| title | VARCHAR | |
| description | TEXT | Admin notes prerequisites here if applicable |
| status | ModuleStatus | Default: DRAFT |
| created_by | UUID FK → User.id | Admin who created it |
| created_at | TIMESTAMPTZ | Default: now() |
| updated_at | TIMESTAMPTZ | |

---

### `ContentItem`

An ordered item inside a module. Type determines which fields are populated.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| module_id | UUID FK → Module.id | |
| order | INTEGER | Position in module content sequence |
| type | ContentType | Determines rendering |
| title | VARCHAR | Nullable |
| video_source | VideoSource | Nullable : populated when type = VIDEO |
| video_url | VARCHAR | Nullable : S3 key or YouTube URL |
| allow_offline | BOOLEAN | Nullable : VIDEO only; true = cache on mobile |
| image_s3_key | VARCHAR | Nullable : populated when type = IMAGE |
| text_content | TEXT | Nullable : HTML/Markdown; populated when type = TEXT |
| infographic_subtype | InfographicSubtype | Nullable : populated when type = INFOGRAPHIC |
| infographic_content | JSONB | Nullable : hotspot/scenario/stepper JSON payload |
| quiz_id | UUID FK → Quiz.id | Nullable : populated when type = QUIZ |
| created_at | TIMESTAMPTZ | Default: now() |
| updated_at | TIMESTAMPTZ | |

---

### `Quiz`

Quiz configuration owned by exactly one module, linked through a ContentItem.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| module_id | UUID FK → Module.id | |
| title | VARCHAR | |
| pass_score_pct | INTEGER | Pass threshold as a percentage (0–100) |
| time_limit_minutes | INTEGER | Nullable : no limit if null |
| retake_price_myr | DECIMAL | Nullable : price per retake in MYR; Billplz integration pending |
| show_score_to_guide | BOOLEAN | Default: true |
| created_at | TIMESTAMPTZ | Default: now() |
| updated_at | TIMESTAMPTZ | |

---

### `Question`

A question belonging to a quiz.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| quiz_id | UUID FK → Quiz.id | |
| type | QuestionType | |
| text | TEXT | Question body |
| max_score | DECIMAL | Marks this question is worth |
| order | INTEGER | Display order within the quiz |
| created_at | TIMESTAMPTZ | Default: now() |

---

### `QuestionOption`

Answer choices for MCQ and TRUE_FALSE questions only.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| question_id | UUID FK → Question.id | |
| text | VARCHAR | Option label |
| is_correct | BOOLEAN | Used for auto-scoring |
| order | INTEGER | Display order |

---

### `Enrolment`

Records a guide's enrolment in a module. Each guide gets their own deadline.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| guide_id | UUID FK → User.id | |
| module_id | UUID FK → Module.id | |
| due_at | TIMESTAMPTZ | Nullable : per-enrolment deadline |
| enrolled_at | TIMESTAMPTZ | Default: now() |

Unique constraint: `(guide_id, module_id)`

---

### `QuizAttempt`

One row per attempt. Retakes append new rows — no overwriting.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| quiz_id | UUID FK → Quiz.id | |
| guide_id | UUID FK → User.id | |
| attempt_number | INTEGER | Incremented per guide per quiz |
| status | AttemptStatus | Default: PENDING_REVIEW |
| total_score | DECIMAL | Nullable : computed after all QuestionAttempts graded |
| submitted_at | TIMESTAMPTZ | Device-side timestamp (used for last-write-wins on sync) |
| graded_at | TIMESTAMPTZ | Nullable : set when status → GRADED |
| graded_by | UUID FK → User.id | Nullable : admin who submitted final grades |
| created_at | TIMESTAMPTZ | Default: now() |

---

### `QuestionAttempt`

One row per question per quiz attempt. MCQ/TrueFalse auto-scored; Short/Long scored by admin.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| quiz_attempt_id | UUID FK → QuizAttempt.id | |
| question_id | UUID FK → Question.id | |
| selected_option_id | UUID FK → QuestionOption.id | Nullable : MCQ/TrueFalse only |
| text_response | TEXT | Nullable : SHORT_ANSWER/LONG_ANSWER only |
| score_awarded | DECIMAL | Nullable until graded |
| is_auto_scored | BOOLEAN | True for MCQ/TrueFalse |

---

### `Certification`

Issued after admin approves a GRADED quiz attempt.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| guide_id | UUID FK → User.id | |
| quiz_attempt_id | UUID FK → QuizAttempt.id | The specific graded attempt that triggered this |
| module_id | UUID FK → Module.id | Denormalised for easy querying |
| company_name | VARCHAR | Admin-filled |
| issuer_name | VARCHAR | Admin-filled |
| issuer_title | VARCHAR | Admin-filled |
| issue_date | DATE | |
| expiry_date | DATE | Nullable |
| pdf_s3_key | VARCHAR | S3 key of generated certificate PDF |
| issued_by | UUID FK → User.id | Admin who approved |
| created_at | TIMESTAMPTZ | Default: now() |

---

### `Badge`

Badge definition. Threshold and description configured by admin.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| name | VARCHAR | |
| description | VARCHAR | e.g., "Finished 3 modules in a row" |
| image_s3_key | VARCHAR | Badge image |
| threshold | INTEGER | Number of certified modules required |
| created_at | TIMESTAMPTZ | Default: now() |

---

### `UserBadge`

Awarded badge instance. Created server-side automatically when threshold is met.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK → User.id | |
| badge_id | UUID FK → Badge.id | |
| awarded_at | TIMESTAMPTZ | Default: now() |

Unique constraint: `(user_id, badge_id)`

---

### `IoTDevice`

Registered ESP32 device.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| device_identifier | VARCHAR UNIQUE | e.g., "esp32-001" : matches MQTT client ID |
| current_guide_id | UUID FK → User.id | Nullable : null if unassigned |
| status | DeviceStatus | Default: ACTIVE |
| registered_at | TIMESTAMPTZ | Default: now() |

---

### `DeviceAssignment`

Full historical log of which guide carried which device and when. Required for SFC audit.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| device_id | UUID FK → IoTDevice.id | |
| guide_id | UUID FK → User.id | |
| assigned_at | TIMESTAMPTZ | |
| unassigned_at | TIMESTAMPTZ | Nullable : null means currently active assignment |

---

### `IoTAlert`

One detection event from an ESP32 device.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| device_id | UUID FK → IoTDevice.id | |
| guide_id | UUID FK → User.id | Guide carrying the device at time of detection |
| detection_type | DetectionType | |
| confidence | DECIMAL | Model confidence score (0.0–1.0) |
| evidence_s3_key | VARCHAR | S3 key of captured evidence frame |
| status | AlertStatus | Default: PENDING |
| flagged_by | UUID FK → User.id | Nullable : admin who confirmed/flagged |
| flagged_at | TIMESTAMPTZ | Nullable |
| detected_at | TIMESTAMPTZ | Device-side timestamp from MQTT payload |
| created_at | TIMESTAMPTZ | Server-side record creation time |

---

### `Notification`

In-app inbox. Push notification is fired as a side effect when this row is created — not separately tracked.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK → User.id | Recipient |
| type | NotificationType | |
| reference_id | UUID | Nullable : points to related entity (QuizAttempt, Module, IoTAlert, etc.) |
| reference_type | VARCHAR | Nullable : names the entity type for application-layer resolution |
| title | VARCHAR | |
| body | TEXT | |
| is_read | BOOLEAN | Default: false |
| created_at | TIMESTAMPTZ | Default: now() |

> FK integrity on `reference_id` is enforced at the application layer, not the DB level. This is standard practice for polymorphic notification systems.

---

## Relationship Summary

```
RegistrationApplication ──< User                      (one application → one user, on approval)
User ──< PasswordResetToken                            (one user → many tokens over time)
User (ADMIN) ──< Module                               (admin creates many modules)
Module ──< ContentItem                                (module has many ordered content items)
ContentItem >── Quiz                                  (quiz-type content item points to one quiz)
Quiz ──< Question                                     (quiz has many questions)
Question ──< QuestionOption                           (MCQ/TrueFalse questions have options)
User (GUIDE) ──< Enrolment >── Module                 (guides enrol in modules; join table)
User (GUIDE) ──< QuizAttempt >── Quiz                 (guide attempts quiz; multiple rows per retake)
QuizAttempt ──< QuestionAttempt >── Question          (each attempt has per-question responses)
QuestionAttempt >── QuestionOption                    (MCQ/TrueFalse links selected option)
QuizAttempt ──< Certification                         (one certified attempt → one certificate)
Certification >── Module                              (denormalised module reference)
User (GUIDE) ──< UserBadge >── Badge                  (guides earn badges; join table)
IoTDevice >── User (GUIDE)                            (device currently assigned to one guide)
IoTDevice ──< DeviceAssignment >── User (GUIDE)       (full assignment history)
IoTDevice ──< IoTAlert                                (device produces many alerts)
IoTAlert >── User (GUIDE)                             (alert records which guide was carrying device)
User ──< Notification                                 (user receives many notifications)
```

---

## Design Notes

- All primary keys are UUIDs to avoid enumerable IDs on public-facing endpoints (e.g., certificate verify URL).
- S3 keys are stored as strings; pre-signed URLs are generated on-demand by the API with short expiry (15 minutes).
- `submitted_at` on `QuizAttempt` uses the device-side timestamp to support last-write-wins conflict resolution during offline sync.
- `attempt_number` on `QuizAttempt` increments per `(guide_id, quiz_id)` pair and this is enforced at the application layer before insert.
- `DeviceAssignment.unassigned_at = null` means the assignment is currently active. Only one active assignment per device should exist at any time and this is enforced at the application layer.
- Billplz payment integration is deferred. When implemented, a `Payment` table will reference a specific `QuizAttempt.id` to record which retake was paid for.