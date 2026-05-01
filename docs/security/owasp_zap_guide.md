# OWASP ZAP Security Assessment Guide

---

## Overview

Run OWASP ZAP (Zed Attack Proxy) against the deployed SFC Training Platform to identify and remediate vulnerabilities per SSDLC requirements.

**Scope:** Web application (`https://your-domain.com`) + API (`https://your-domain.com/api`)  
**Tool:** OWASP ZAP 2.15+ (free, open-source)  
**Required output:** Findings report + remediation evidence + reassessment confirmation

---

## Setup

### 1. Install ZAP

Download from: https://www.zaproxy.org/download/

Or via package manager:
```bash
# macOS
brew install --cask owasp-zap

# Windows: use the installer from the site above
```

### 2. Configure the target

- Start ZAP
- Set target URL to the deployed application (or `http://localhost:5173` for local testing against `http://localhost:3000` API)
- For API scanning: import the OpenAPI/REST spec if available, or use the Spider tool

---

## Scan Types to Run

### Automated Scan (start here)

1. Open ZAP
2. Click **Automated Scan**
3. Enter the target URL
4. Select **Standard Scan**
5. Run — ZAP will spider the site and run active/passive scans
6. Export report: **Report → Generate Report → HTML**

### API Scan (separate pass)

Use the ZAP CLI for the API:
```bash
docker run -t ghcr.io/zaproxy/zaproxy:stable zap-api-scan.py \
  -t http://localhost:3000/api \
  -f openapi \
  -r api_scan_report.html
```

Or using baseline scan (faster, passive only):
```bash
docker run -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
  -t http://localhost:3000 \
  -r baseline_report.html
```

### Authentication Setup (for authenticated scans)

ZAP needs a valid session to test authenticated routes:

1. In ZAP: **Tools → Options → Authentication**
2. Configure form-based auth:
   - Login URL: `POST /api/auth/login`
   - Username field: `username`
   - Password field: `password`
   - Login indicator: presence of `accessToken` in response
3. Set a valid test account (create a dedicated ZAP test guide account)

---

## Key Areas to Check

| Area | Risk | What ZAP Looks For |
|------|------|-------------------|
| JWT handling | High | Alg:none attacks, weak secrets |
| SQL injection | High | All API inputs |
| XSS | High | User-supplied content in DOM |
| CSRF | Medium | State-changing requests without CSRF token |
| Insecure headers | Medium | Missing CSP, HSTS, X-Frame-Options |
| Sensitive data exposure | High | Passwords/tokens in responses or logs |
| IDOR | High | Accessing other users' resources by changing IDs |
| File upload | Medium | Upload endpoint accepts non-WebP, oversized files |
| Rate limiting | Medium | Login endpoint, registration endpoint |
| Exposed error details | Low | Stack traces in 500 responses |

---

## Manual Checks (ZAP does not catch these automatically)

- **IDOR:** Try accessing `/api/certifications/:id` with another guide's cert ID using your own token
- **Role bypass:** Attempt admin-only endpoints (`/api/registrations`, `/api/users/admins`) with a guide JWT
- **IoT secret:** Confirm `/internal/iot-alerts` returns 401/403 without the `x-internal-secret` header
- **Refresh token:** Confirm logout invalidates the refresh token in Redis (cannot reuse after logout)

---

## Reporting

After the scan:

1. Export the ZAP HTML report
2. For each **High** or **Medium** finding:
   - Document the vulnerability
   - Implement the fix
   - Re-run ZAP to confirm resolution
3. Place reports in this folder: `docs/security/reports/`
4. Include a summary table in the Sprint 2 report:

| Finding | Severity | Status | Fix Applied |
|---------|----------|--------|-------------|
| Example: Missing HSTS header | Medium | Fixed | Added helmet.js |

---

## Common Fixes for Likely Findings

### Missing Security Headers (Express)

Install helmet:
```bash
pnpm --filter @sfc/api add helmet
```

Add to `apps/api/src/index.js`:
```js
import helmet from 'helmet'
app.use(helmet())
```

### Rate Limiting (Login / Registration)

Install express-rate-limit:
```bash
pnpm --filter @sfc/api add express-rate-limit
```

Apply to auth routes in `apps/api/src/routes/auth.js`:
```js
import rateLimit from 'express-rate-limit'
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 })
router.post('/login', loginLimiter, ...)
```

---

## Files

Place all scan reports here:
```
docs/security/
  owasp_zap_guide.md       ← this file
  reports/
    baseline_report.html   ← initial scan
    api_scan_report.html   ← API scan
    reassessment.html      ← after fixes
```
