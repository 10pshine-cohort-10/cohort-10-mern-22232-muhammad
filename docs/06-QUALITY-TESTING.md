# 06 — Logging, Error Handling, Testing & Code Quality

## 1. Logging (Pino)

| What | How |
|---|---|
| HTTP request + response | `pino-http`: method, url, status, response time, request-id, userId (if authed). Health checks excluded. |
| Request correlation | `x-request-id` header (generated if absent), bound to a child logger on `req.log`, returned in response header and error bodies. |
| Important events | `logger.info({ event: 'USER_REGISTERED', userId })`, `NOTE_CREATED`, `NOTE_DELETED`, `EXPORT_COMPLETED`, `IMPORT_COMPLETED`, `SERVER_STARTED`, `DB_CONNECTED`. |
| User activities | Logged via Pino **and** persisted in `activity_logs` (queryable audit). |
| Errors | `warn` for 4xx (expected), `error` with stack for 5xx. |
| Security | `redact: ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.token']`. |
| Output | Dev: `pino-pretty` (colored). Prod: JSON to stdout + daily-rotated file in `logs/` (git-ignored). |
| Levels | Controlled by `LOG_LEVEL`; tests run at `silent`. |

## 2. Exception Handling

1. **Validation middleware** (Zod) → throws `ValidationError` with field details.
2. **Async errors** propagate automatically (Express 5) to the handler.
3. **`notFound` middleware** → 404 for unknown routes.
4. **Global `errorHandler` middleware** (last in chain):
   - Maps `AppError` subclasses → status + code.
   - Maps Prisma errors (`P2002` unique → 409, `P2025` not found → 404).
   - Maps JWT errors → 401 `TOKEN_EXPIRED` / `TOKEN_INVALID`; Multer errors → 413/415.
   - Unknown → 500 "Something went wrong" (stack logged, never leaked).
   - Logs through `req.log` so the request-id is attached.
5. **Process level:** `unhandledRejection` / `uncaughtException` → log fatal → graceful shutdown (close HTTP, sockets, DB).
6. **Frontend:** React Error Boundary per route, axios interceptor converts API errors to toasts / form errors, TanStack Query retry for network errors only.

## 3. Testing Strategy

### Backend — Mocha + Chai (+ Sinon, Supertest, c8)
| Level | What | Example cases |
|---|---|---|
| **Unit — services** | Business logic with repositories stubbed | register hashes password & rejects duplicate email; update throws 404 for other user's note; version conflict → 409; import skips invalid entries |
| **Unit — controllers** | Mock req/res, service stubbed | correct status codes, response envelope, cookie set on login |
| **Unit — repositories (DAL)** | Prisma client stubbed; query shape asserted | list applies `userId` scope + filters + pagination; soft delete sets `deleted_at` |
| **Unit — middleware/utils** | auth, validate, errorHandler, sanitize, token utils | expired token → 401; error handler hides stack on 500 |
| **Integration** | Supertest against `app` + test MySQL DB | full auth flow, CRUD happy path, ownership isolation between two users |

Coverage target ≥ 85% (c8 → `lcov.info` for SonarQube). Commands: `npm test`, `npm run test:coverage`.

### Frontend — Jest + React Testing Library (+ MSW)
| What | Example cases |
|---|---|
| Components | NoteCard renders title/preview/tags; EmptyState; TagPicker creates tag |
| Forms | Login shows validation errors; submits; shows server error |
| Hooks | `useNotes` filters/search params; `useAutosave` debounce |
| Pages (MSW-mocked API) | Dashboard loads notes; delete → toast with Undo; ProtectedRoute redirects |
| Utils | date formatting, html→text, query-string builders |

Coverage target ≥ 75%. Jest config: `ts-jest` / babel, `jsdom`, CSS module mapping, `@/` path alias.

### Manual / E2E checklist (before each PR)
Sign up → create → edit (rich text) → tag → pin → search → archive → delete → undo → restore → export → import → two-tab real-time → logout.

## 4. SonarQube

- **Setup (local, no Docker needed):** download SonarQube Community Build zip → run with the installed Java 21 → `http://localhost:9000`. (Or `docker compose up sonarqube` if Docker is installed.) Scanner via `npx sonarqube-scanner` (or SonarScanner CLI).
- `sonar-project.properties` at repo root:
```
sonar.projectKey=noteflow
sonar.sources=server/src,client/src
sonar.tests=server/test,client/src
sonar.test.inclusions=**/*.test.ts,**/*.test.tsx,**/*.spec.ts
sonar.exclusions=**/node_modules/**,**/dist/**,**/prisma/migrations/**
sonar.javascript.lcov.reportPaths=server/coverage/lcov.info,client/coverage/lcov.info
```
- **Rules:** "Sonar way" profile for JavaScript/TypeScript + a custom Quality Gate: new code coverage ≥ 80%, duplication ≤ 3%, reliability/security/maintainability rating **A**, 0 security hotspots unreviewed.
- **Evidence:** screenshot of the passing dashboard in `docs/screenshots/sonarqube.png` + linked in README.
- Optional: SonarCloud (free for public repos) in GitHub Actions for a live badge.

## 5. Static Quality Gates (local + CI)
| Gate | Tool | When |
|---|---|---|
| Format | Prettier | pre-commit (lint-staged) |
| Lint | ESLint (ts, react, react-hooks, jsx-a11y, sonarjs plugin) | pre-commit + CI |
| Types | `tsc --noEmit` | CI |
| Commit message | commitlint (Conventional Commits) | commit-msg hook |
| Tests + coverage | Mocha / Jest | CI |
| Build | `vite build`, `tsc` | CI |
