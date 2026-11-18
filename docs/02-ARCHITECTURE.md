# 02 — System Architecture & Tech Stack

## 1. High-Level Architecture

```mermaid
flowchart LR
  subgraph Browser
    UI[React 19 SPA<br/>Vite + TypeScript]
  end
  subgraph Server["Node.js API (Express + TypeScript)"]
    MW[Middleware<br/>helmet · cors · rate-limit<br/>pino-http · auth · validate]
    R[Routes] --> C[Controllers] --> S[Services] --> D[Repositories / DAL]
    EH[Global Error Handler]
    WS[Socket.IO Gateway]
  end
  DB[(MySQL 8)]
  LOG[[Pino logs<br/>stdout + rotating file]]
  SQ[SonarQube]

  UI -- REST /api/v1 (JSON, JWT) --> MW --> R
  UI <-- WebSocket (JWT handshake) --> WS
  D --> DB
  S -. emits events .-> WS
  C -. errors .-> EH
  MW --> LOG
  EH --> LOG
  SQ -. static analysis + coverage .- Server
  SQ -. static analysis + coverage .- UI
```

**Pattern:** layered (Route → Controller → Service → Repository). Each layer has one job, which makes unit testing each layer in isolation (as the brief asks: *controllers, services, data-access layers*) straightforward.

| Layer | Responsibility | Knows about HTTP? | Knows about DB? |
|---|---|---|---|
| Route | URL + middleware chain (auth, validation) | yes | no |
| Controller | Read `req`, call service, shape `res` | yes | no |
| Service | Business rules, ownership checks, emits socket events | no | no |
| Repository | All DB queries (Prisma) | no | yes |

## 2. Tech Stack (and why)

### Backend
| Concern | Choice | Reason |
|---|---|---|
| Runtime | Node.js 22.12+ LTS (local: v26) | Required; Vite 8 needs ≥ 22.12. |
| Language | **TypeScript (strict)** | Brief mentions JS/TS rules for SonarQube; TS catches bugs early and impresses reviewers. |
| Framework | Express 5 | Industry standard, native async error propagation. |
| DB | **MySQL 8** | Listed in the required stack. |
| ORM / migrations | Prisma | Type-safe queries, versioned migrations, seeding. Raw SQL fallback for FULLTEXT search. |
| Validation | Zod | One schema → runtime validation + TS types; shared with frontend. |
| Auth | jsonwebtoken + bcrypt | Access token (15 min) in memory, refresh token (7 d) in httpOnly cookie, rotated & stored hashed in DB. |
| Logging | **Pino** + pino-http (+ pino-pretty in dev, pino-roll for files) | Required. |
| Security | helmet, cors, express-rate-limit, sanitize-html | OWASP basics. |
| Real-time | Socket.IO | Optional feature O1. |
| File upload (import) | multer (memory storage, size + mime limits) | Optional feature O2. |
| API docs | swagger-ui-express + OpenAPI 3 (generated from Zod) | Reviewer-friendly. |
| Tests | **Mocha + Chai**, Sinon (stubs), Supertest (HTTP), c8 (coverage → lcov) | Required. |

### Frontend
| Concern | Choice | Reason |
|---|---|---|
| Framework | **React 19** + TypeScript + Vite | Required (React); Vite for speed. |
| Styling | Tailwind CSS + shadcn/ui (Radix primitives) | Clean, accessible, professional look. |
| Routing | React Router | Protected routes, lazy loading. |
| Server state | TanStack Query | Caching, optimistic updates, retries. |
| Client state | Zustand (auth + UI only) | Tiny and simple. |
| Forms | React Hook Form + Zod | Shared validation with backend. |
| Rich text | **Tiptap** | Modern, extensible, outputs clean HTML/JSON. |
| Icons / motion | lucide-react, Framer Motion (subtle) | Polish. |
| Toasts | Sonner | Undo-delete, save feedback. |
| Real-time | socket.io-client | O1. |
| Tests | **Jest** + React Testing Library + MSW (mock API) | Required. |

### Tooling
ESLint (typescript-eslint, react, jsx-a11y) · Prettier · Husky + lint-staged + commitlint (Conventional Commits) · GitHub Actions CI · SonarQube (local, see `06`) · Docker Compose (optional, if Docker Desktop is installed).

## 3. Repository Structure (monorepo, npm workspaces)

```
cohort-10-mern-22232-muhammad/
├── .github/
│   ├── workflows/ci.yml            # lint · typecheck · test · build
│   └── pull_request_template.md
├── docs/                           # this planning pack + screenshots
├── server/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   │   ├── app.ts                  # express app (no listen) — testable
│   │   ├── server.ts               # http + socket.io bootstrap, graceful shutdown
│   │   ├── config/                 # env (validated with zod), logger, db client
│   │   ├── middlewares/            # auth, validate, requestId, errorHandler, notFound, rateLimit
│   │   ├── modules/
│   │   │   ├── auth/               # auth.routes|controller|service|repository|schemas.ts
│   │   │   ├── users/
│   │   │   ├── notes/
│   │   │   ├── tags/
│   │   │   └── transfer/           # export / import
│   │   ├── realtime/               # socket gateway + event emitter
│   │   ├── utils/                  # AppError classes, asyncHandler, sanitize, pagination
│   │   └── docs/openapi.ts
│   ├── test/
│   │   ├── unit/                   # controllers, services, repositories (mocked)
│   │   ├── integration/            # supertest against app with test DB
│   │   └── helpers/
│   ├── .env.example
│   └── package.json
├── client/
│   ├── src/
│   │   ├── app/                    # router, providers, layouts
│   │   ├── features/
│   │   │   ├── auth/               # pages, components, hooks, api.ts
│   │   │   ├── notes/              # dashboard, editor, cards, filters
│   │   │   └── profile/
│   │   ├── components/ui/          # shadcn components
│   │   ├── components/common/      # EmptyState, ConfirmDialog, ThemeToggle, CommandPalette
│   │   ├── lib/                    # axios instance + interceptors, socket, queryClient, utils
│   │   ├── store/                  # zustand
│   │   └── styles/
│   ├── test/ (or co-located *.test.tsx)
│   ├── jest.config.ts
│   └── package.json
├── shared/                         # zod schemas + types shared by client & server
├── sonar-project.properties
├── docker-compose.yml              # mysql (+ sonarqube) — optional
├── package.json                    # workspaces + root scripts
└── README.md
```

## 4. Authentication Flow

```mermaid
sequenceDiagram
  participant U as React
  participant A as API
  participant DB as MySQL
  U->>A: POST /auth/login {email, password}
  A->>DB: find user by email
  A->>A: bcrypt.compare
  A->>DB: store hash(refreshToken), expiresAt
  A-->>U: 200 {accessToken, user} + Set-Cookie refreshToken (httpOnly)
  U->>A: GET /notes (Authorization: Bearer access)
  A-->>U: 200 notes
  Note over U,A: access token expires (15 min)
  U->>A: any request → 401 TOKEN_EXPIRED
  U->>A: POST /auth/refresh (cookie)
  A->>DB: verify + rotate refresh token (old revoked)
  A-->>U: new accessToken + new cookie
  U->>A: retry original request (axios interceptor, single-flight)
```

- Reuse of a revoked refresh token ⇒ revoke the whole token family (theft detection).
- Logout ⇒ revoke refresh token, clear cookie, disconnect sockets.
- **Multiple tabs share one refresh cookie**, so refreshes are coordinated to avoid a false "reuse" alarm:
  1. **Client:** a tab takes a Web Lock (`navigator.locks.request('noteflow-refresh')`) before refreshing; others wait, then reuse the new access token broadcast over a `BroadcastChannel` instead of refreshing again.
  2. **Server:** a just-rotated token stays valid for a short grace window (~10 s) and returns the already-issued successor. Reuse **after** the grace window is still treated as theft and revokes the family.

## 5. Real-time Design (Socket.IO)

- Client connects with access token in `auth` handshake; server verifies and joins room `user:<id>`.
- Service layer emits domain events after successful writes: `note:created`, `note:updated`, `note:deleted`, `note:restored`.
- Payload includes `originSocketId` so the tab that made the change ignores its own echo.
- Client listener patches the TanStack Query cache → UI updates instantly, no refetch storm.

## 6. Error Model

All errors return:
```json
{ "success": false, "error": { "code": "NOTE_NOT_FOUND", "message": "Note not found", "details": [], "requestId": "a1b2…" } }
```
Custom classes: `AppError` → `ValidationError (400)`, `UnauthorizedError (401)`, `ForbiddenError (403)`, `NotFoundError (404)`, `ConflictError (409)`, `TooManyRequestsError (429)`. Anything unknown → 500 with a generic message (stack only logged, never sent).

## 7. Environment Variables (`server/.env.example`)

```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_URL=mysql://noteflow:password@localhost:3306/noteflow
JWT_ACCESS_SECRET=change-me
JWT_REFRESH_SECRET=change-me-too
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
LOG_LEVEL=info
LOG_DIR=logs
```
`client/.env.example`: `VITE_API_URL=http://localhost:5000/api/v1`, `VITE_SOCKET_URL=http://localhost:5000`.
