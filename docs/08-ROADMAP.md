# 08 — Implementation Roadmap

Estimates assume ~6 focused hours/day. Each phase ends with a merged PR, passing CI and a demo-able increment. Adjust dates once the deadline is confirmed (`09`).

| Phase | Goal | Key tasks | Est. | Exit criteria |
|---|---|---|---|---|
| **0. Setup** | Accounts & tools ready | Fork + clone, install MySQL 8, GitHub CLI, VS Code extensions, SonarQube local | 0.5 d | `git`, `node`, `mysql` work; fork cloned |
| **1. Foundation** | Skeleton that runs | npm workspaces, TS configs, ESLint/Prettier, Husky/commitlint, Express app + health route, Pino logger + request-id, error handler, env validation, Vite React app with Tailwind, router, layouts, theme, Mocha + Jest setup, CI workflow | 2 d | `npm run dev` starts both; CI green; PR 1 |
| **2. Auth** | Secure login | Prisma + MySQL connection, users + refresh_tokens schema, register/login/refresh/logout, bcrypt, JWT, rate limit, auth middleware; Signup/Login UI, axios interceptor, protected routes, Zustand auth store; tests | 2.5 d | Full auth flow works; ≥ 85% coverage on auth module; PR 2 |
| **3. Notes core** | Main product | notes + tags schema, repository/service/controller, ownership scoping, pagination, soft delete, version; Dashboard (cards, sidebar, skeletons, empty states), Tiptap editor, save/cancel, autosave, tags, pin/archive/trash/restore; tests | 4 d | All mandatory screens work end-to-end; PR 3 |
| **4. Hardening** | Production quality | Logging review (events, activities, redaction), error mapping complete, activity_logs, integration tests (2-user isolation), frontend tests with MSW, Swagger docs, seed data | 2 d | Backend ≥ 85%, frontend ≥ 75% coverage; PR 4 |
| **5. Optional features** | Stand out | Search (FULLTEXT) + filters + highlight, export JSON/Markdown zip, import with summary, Socket.IO real-time sync, profile page (stats, activity, change password) | 3 d | All 3 optional features done; PR 5 |
| **6. Quality & polish** | Wow factor | SonarQube scan → fix all issues → Quality Gate passed; command palette + shortcuts; responsive QA; a11y + Lighthouse pass; dark mode QA; micro-animations | 2 d | Sonar gate green; Lighthouse targets met |
| **7. Docs & submit** | Presentation | README (badges, screenshots, GIF, architecture, setup, API, testing, decisions), optional deployment, final PR, resolve all CodeRabbit HIGH/CRITICAL, assign mentor | 1.5 d | PR assigned to mentor ✅ |

**Total ≈ 17–18 working days.** If the deadline is shorter, cut in this order: command palette → deployment → Markdown export (keep JSON) → dark mode. Never cut tests, logging, error handling or SonarQube — they're mandatory.

## Definition of Done (every feature)
- Works in UI end-to-end, including loading / empty / error states
- Validated input on client **and** server
- Logged appropriately (Pino)
- Unit tests written and passing; coverage not reduced
- No ESLint / TypeScript / Sonar issues introduced
- Responsive + keyboard accessible
- Committed with conventional commits on a feature branch, merged via PR

## Risks & Mitigations
| Risk | Mitigation |
|---|---|
| MySQL install trouble on Windows | Use MySQL Installer (Community); fallback: Docker Desktop or a free cloud MySQL (e.g., Aiven / TiDB Serverless). |
| Jest + Vite config friction | Use `ts-jest` with a dedicated `tsconfig.jest.json`; set up in Phase 1 with one passing test. |
| SonarQube heavy on RAM | Run it only during Phase 6 scans; stop it otherwise. |
| CodeRabbit flags many issues late | Phase-wise PRs so reviews happen continuously. |
| Scope creep from extras | Extras only after mandatory + optional are complete and green. |
