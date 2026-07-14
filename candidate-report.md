# BugForge Engineering Report

**Date:** 2026-07-14  
**Engineer:** Antigravity (AI)  
**Scope:** Full monorepo audit & production-readiness review

---

## Summary of Findings

| Severity | Found | Fixed |
|----------|-------|-------|
| 🔴 Critical | 3 | 3 |
| 🟠 High | 4 | 4 |
| 🟡 Medium | 6 | 6 |
| 🟢 Low | 4 | 4 |
| **Total** | **17** | **17** |

---

## Fixes Applied (In Order of Execution)

### C1 — Credential Leak in Login Logs ✅
**File:** [auth-controller.ts](file:///e:/FSD-Assignment-master/apps/api/src/controllers/auth-controller.ts#L26)  
**Root cause:** `req.log.info({ email, password }, 'Login attempt')` logged the plain-text password on every login attempt.  
**Fix:** Removed `password` from the log object. Only `email` is now logged.  
**Why correct:** Passwords must never appear in any log output at any log level. Log aggregators (Datadog, Splunk) have no reliable PII-scrubbing guarantees.

---

### C2 — Misplaced Import (`import { z }`) ✅
**File:** [auth-controller.ts](file:///e:/FSD-Assignment-master/apps/api/src/controllers/auth-controller.ts#L2)  
**Root cause:** `import { z } from 'zod'` was placed at line 67 (EOF), after the function that used `z` at line 61.  
**Fix:** Moved import to line 2 with all other imports, removed the trailing stray import.  
**Why correct:** ES module imports should always be at the top. While JavaScript hoists them, this pattern is fragile in build tools and impossible to maintain.

---

### C3 — Stored XSS in Project Description ✅
**File:** [projects/page.tsx](file:///e:/FSD-Assignment-master/apps/web/app/(dashboard)/projects/page.tsx#L70)  
**Root cause:** `dangerouslySetInnerHTML={{ __html: project.description }}` rendered raw HTML from MongoDB directly into the DOM.  
**Fix:** Replaced with a plain text React child: `{project.description || 'No description yet.'}`.  
**Why correct:** React JSX text children are HTML-escaped by the renderer. No sanitisation library is needed when you don't use `dangerouslySetInnerHTML`.

---

### H1 — `setInterval` Memory Leak ✅
**File:** [app-shell.tsx](file:///e:/FSD-Assignment-master/apps/web/components/app-shell.tsx#L29)  
**Root cause:** `setInterval` was called inside `useEffect` without a cleanup function. Every mount started a new interval without stopping old ones.  
**Fix:** Captured interval ID in a variable and returned `() => clearInterval(intervalId)` as the cleanup function.  
**Why correct:** React's effect cleanup runs on unmount and before re-running the effect, preventing accumulation of interval callbacks.

---

### H2 — Mass-Assignment Vulnerability in `updateTask` ✅
**File:** [task-controller.ts](file:///e:/FSD-Assignment-master/apps/api/src/controllers/task-controller.ts#L51)  
**Root cause:** `const values = req.body as Record<string, unknown>` passed raw, unvalidated request body to `findByIdAndUpdate`.  
**Fix:** Replaced with `taskSchema.partial().parse(req.body)` — validates the input and strips unknown fields.  
**Why correct:** Zod's `parse` is strict by default; fields not defined in the schema (e.g. `createdBy`, `project`) are silently dropped.

---

### H3 — CORS Wildcard with Credentials ✅
**Files:** [app.ts](file:///e:/FSD-Assignment-master/apps/api/src/app.ts) + [env.ts](file:///e:/FSD-Assignment-master/apps/api/src/config/env.ts)  
**Root cause:** `cors({ origin: (_, cb) => cb(null, true), credentials: true })` allowed any origin to make authenticated requests.  
**Fix:** Added optional `CORS_ORIGIN` env var. When set, only that origin is allowed. When unset (local dev), `true` is used as a fallback.  
**Why correct:** Allows zero-config local development while enforcing strict origin in production with a single env var.

---

### H4 — Missing `X-Real-IP` in Nginx ✅
**File:** [nginx/default.conf](file:///e:/FSD-Assignment-master/nginx/default.conf)  
**Root cause:** The API proxy location forwarded `X-Forwarded-For` but not `X-Real-IP`. Rate-limiting and IP audit logs would see the nginx container IP.  
**Fix:** Added `proxy_set_header X-Real-IP $remote_addr;` to the `/api/` location block.

---

### M1 — Wrong HTTP Status for `createComment` ✅
**File:** [comment-controller.ts](file:///e:/FSD-Assignment-master/apps/api/src/controllers/comment-controller.ts#L37)  
**Root cause:** Returned `200 OK` when a comment was created.  
**Fix:** Changed to `201 Created`.  
**Why correct:** RFC 9110: `201 Created` is the correct status when a new resource is created.

---

### M2 — `errorHandler` Missing Required 4th Parameter ✅
**File:** [error.ts](file:///e:/FSD-Assignment-master/apps/api/src/middleware/error.ts#L5)  
**Root cause:** Express detects error-handling middleware by arity (function.length === 4). With only 3 parameters, it may not be registered correctly.  
**Fix:** Added `_next: NextFunction` as the 4th parameter.  
**Why correct:** This is an Express contract, not optional. The TypeScript `ErrorRequestHandler` type also requires it.

---

### M3 — Swagger `apis: []` Returns Empty Spec ✅
**File:** [app.ts](file:///e:/FSD-Assignment-master/apps/api/src/app.ts#L27)  
**Root cause:** `swagger-jsdoc` was configured with `apis: []` — scanning zero files for annotations.  
**Fix:** Set `apis` to glob patterns covering both the TypeScript source and compiled JS paths.

---

### M4 — Dockerfiles Used `npm` Instead of `pnpm` ✅
**Files:** [api/Dockerfile](file:///e:/FSD-Assignment-master/apps/api/Dockerfile) + [web/Dockerfile](file:///e:/FSD-Assignment-master/apps/web/Dockerfile) + [docker-compose.yml](file:///e:/FSD-Assignment-master/docker-compose.yml)  
**Root cause:** Both Dockerfiles used `npm install`, ignoring the `pnpm-lock.yaml` lockfile. This could resolve different dependency versions than CI.  
**Fix:** Rewrote both Dockerfiles to use `corepack enable && pnpm install --frozen-lockfile`. Build context changed to workspace root so the lockfile and `pnpm-workspace.yaml` are available. Updated `docker-compose.yml` accordingly.  
**Also fixed:** `NEXT_PUBLIC_API_URL` is now passed as a `--build-arg` (baked at build time, correct behaviour) instead of a runtime `ENV` (which has no effect for `NEXT_PUBLIC_*` vars).

---

### M5 — `localStorage.clear()` in signOut ✅
**File:** [auth-context.tsx](file:///e:/FSD-Assignment-master/apps/web/contexts/auth-context.tsx#L34)  
**Root cause:** `localStorage.clear()` removes every key, including state set by third-party SDKs.  
**Fix:** Replaced with targeted `localStorage.removeItem('accessToken')` and `localStorage.removeItem('refreshToken')`.

---

### M6 — N+1 Query in Dashboard ✅
**File:** [dashboard-controller.ts](file:///e:/FSD-Assignment-master/apps/api/src/controllers/dashboard-controller.ts)  
**Root cause:** One `countDocuments` query was fired per project — 6 queries for 6 projects.  
**Fix:** Single `TaskModel.aggregate` with `$match` + `$group` computes all counts in one round-trip. Results are reduced into a map for O(n) lookup.  
**Performance impact:** 5 fewer DB round-trips for the default dashboard limit of 6 projects; scales to 0 additional queries regardless of project count.

---

### L1 — CI Node Version Mismatch ✅
**File:** [ci.yml](file:///e:/FSD-Assignment-master/.github/workflows/ci.yml)  
**Fix:** Changed `node-version: 20` → `node-version: 22` to match production Dockerfiles.

---

### L2 — Project Key Validator Accepts Lowercase ✅
**File:** [schemas.ts](file:///e:/FSD-Assignment-master/apps/api/src/validators/schemas.ts)  
**Fix:** Added `.toUpperCase()` transform before the regex check. Tightened regex to uppercase-only `^[A-Z][A-Z0-9]{1,9}$` with a descriptive error message.

---

### Bonus — Web Lint Script Cross-Platform Fix ✅
**File:** [web/package.json](file:///e:/FSD-Assignment-master/apps/web/package.json)  
**Root cause:** `ESLINT_USE_FLAT_CONFIG=false eslint ...` uses Unix shell env var syntax, which fails on Windows PowerShell.  
**Fix:** Replaced with `next lint --max-warnings=0` which is cross-platform and already understands Next.js's ESLint config.

---

### Bonus — ESLint `_` Prefix Ignore Pattern ✅
**File:** [eslint.config.mjs](file:///e:/FSD-Assignment-master/apps/api/eslint.config.mjs)  
**Root cause:** The `@typescript-eslint/no-unused-vars` rule didn't ignore `_`-prefixed params, which are a project-wide convention (e.g. `_req`, `_next`).  
**Fix:** Added `argsIgnorePattern: '^_'` and `varsIgnorePattern: '^_'` to the rule config.

---

## Verification Results

| Check | Result |
|-------|--------|
| `pnpm test` (12 tests) | ✅ All pass |
| `pnpm typecheck` (API + Web) | ✅ No errors |
| `pnpm --filter @bugforge/api lint` | ✅ 0 warnings |
| `pnpm --filter @bugforge/web lint` | ✅ 0 warnings |

---

## Remaining Risks

| Risk | Severity | Notes |
|------|----------|-------|
| MongoDB has no auth in docker-compose | High | Fine for local dev; **must** add MONGO_INITDB auth env vars for any staging/production deployment |
| Refresh token stored in localStorage | Medium | Vulnerable to XSS. Consider httpOnly cookie instead. Mitigated by C3 fix. |
| No rate-limiting on auth endpoints | Medium | `/auth/login` and `/auth/register` have no brute-force protection. Add `express-rate-limit`. |
| `body-parser` limit is `1mb` for JSON | Low | May still allow DoS on comment/description-heavy payloads. Consider per-endpoint limits. |
| Notification polling (5s) is client-side | Low | Scales poorly. Consider WebSockets or SSE for production. |

---

## Suggested Future Improvements

1. **Rate limiting** — Add `express-rate-limit` to auth endpoints (`/auth/login`, `/auth/register`, `/auth/forgot-password`)
2. **httpOnly cookies for refresh tokens** — Move refresh tokens from `localStorage` to `Set-Cookie: HttpOnly; Secure; SameSite=Strict`
3. **MongoDB auth** — Add `MONGO_INITDB_ROOT_USERNAME` / `MONGO_INITDB_ROOT_PASSWORD` to the Compose file and document it
4. **WebSocket/SSE for notifications** — Replace polling with server-sent events to reduce API load
5. **Helmet.js** — Add `helmet()` middleware to set security headers (CSP, HSTS, X-Frame-Options, etc.)
6. **Request ID correlation** — Add `x-request-id` header propagation for distributed tracing
7. **Graceful shutdown** — Handle `SIGTERM`/`SIGINT` to drain in-flight requests before exit
8. **Integration tests** — Use `supertest` + `mongodb-memory-server` for full controller-level integration tests without a live DB

---

## AI Usage Report

This investigation was conducted entirely by an AI assistant (Antigravity). All findings are evidence-based from static analysis of the codebase. No changes were made without an explicit root-cause explanation. All fixes were verified by running the actual test suite, typecheck, and linter.

**AI contribution:** Code review, bug identification, fix implementation, test authoring, report generation.  
**Human contribution required for:** Production deployment review, MongoDB authentication setup, integration test environment setup.
