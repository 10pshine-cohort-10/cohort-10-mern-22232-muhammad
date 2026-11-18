# 01 — Product Requirements Document (PRD)

> **Project:** NoteFlow (working name — final name TBD) · **Program:** 10Pearls Shine, Cohort 10 · **Domain:** MERN (Node.js + React.js)
> **Repository:** `10pshine-cohort-10/cohort-10-mern-22232-muhammad` · **Status:** Planning

---

## 1. Problem & Goal

People need a fast, private place to capture and organize notes. The assignment asks for a full-stack notes app with authentication, rich-text editing, logging, exception handling, unit tests, SonarQube, and Git discipline.

**Our goal is not just to meet the brief — it is to deliver a project that reads like production software:** clean architecture, near-zero SonarQube issues, high test coverage, documented APIs, a polished UI, and a Git history a reviewer enjoys reading.

## 2. Success Criteria (how we will judge "done")

| # | Criterion | Target |
|---|-----------|--------|
| S1 | Every mandatory requirement from the brief is implemented | 100% (see traceability matrix §7) |
| S2 | CodeRabbit HIGH / CRITICAL issues | 0 open at mentor review |
| S3 | SonarQube Quality Gate | Passed — 0 bugs, 0 vulnerabilities, 0 code smells rated Major+, duplication < 3% |
| S4 | Backend test coverage (Mocha/Chai + c8) | ≥ 85% lines |
| S5 | Frontend test coverage (Jest + RTL) | ≥ 75% lines |
| S6 | Lighthouse (production build) | Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95 |
| S7 | Every API documented | OpenAPI/Swagger at `/api/docs` |
| S8 | One-command local setup | `npm run setup` + `npm run dev` documented in README |

## 3. Users

- **Primary user:** an individual who signs up and manages private notes.
- **Reviewers (secondary "users" of the repo):** mentor, CodeRabbit, hiring panel — they read the README, docs, PRs, commit history and test reports.

## 4. Scope

### 4.1 Mandatory (from the brief)

| ID | Feature | Details |
|----|---------|---------|
| F1 | **Sign up / Log in / Log out** | Email + password, validation, hashed passwords (bcrypt), JWT auth. |
| F2 | **Authorization** | A user can only see/edit/delete their own notes (enforced server-side on every query). |
| F3 | **Notes CRUD** | Create, read, update, delete notes. |
| F4 | **Rich-text editor** | Headings, bold/italic/underline/strike, lists, checklists, quotes, code blocks, links. |
| F5 | **Dashboard** | List of user's notes, "New note" button, navigation to editor. |
| F6 | **Pino logging** | HTTP request/response logs, important events, user activities, errors. Request IDs on every log line. |
| F7 | **Global exception handling** | Central error middleware, consistent JSON error shape, meaningful messages, errors logged via Pino. |
| F8 | **MySQL database** | Normalized schema with migrations and seed data. |
| F9 | **Unit tests** | Backend: Mocha + Chai (controllers, services, data-access). Frontend: Jest + React Testing Library. |
| F10 | **SonarQube** | Analysis of backend + frontend, coverage imported, Quality Gate passing. |
| F11 | **Git workflow** | Branching strategy, conventional commits, PRs reviewed by CodeRabbit. |
| F12 | **User profile** *(screen marked optional — we will build it)* | Show user details, edit name, change password, log out. |

### 4.2 Optional features from the brief — we will build ALL of them

| ID | Feature | Our interpretation (brief says "tasks"; we apply it to notes) |
|----|---------|------|
| O1 | **Real-time updates (Socket.IO)** | Changes to a note made in one tab/device appear instantly in other open sessions of the same user. |
| O2 | **Export / Import** | Export all or selected notes as JSON (full fidelity) or Markdown (.zip); import from JSON/Markdown files with validation and a result summary. |
| O3 | **Search & filter** | Full-text search (title + content), filter by tag, pinned, archived; sort by updated/created/title. |

### 4.3 "Stand-out" extras (differentiators — only after mandatory + optional are done)

| ID | Feature | Why it impresses |
|----|---------|------------------|
| X1 | Tags (colored) | Real organization, many-to-many relation shows DB design skill. |
| X2 | Pin / Archive / Trash (soft delete + restore) | Production-like data lifecycle. |
| X3 | Autosave with "Saving… / Saved" indicator | Modern UX (Notion/Google Docs feel). |
| X4 | Dark / light theme | Polish. |
| X5 | Keyboard shortcuts + command palette (Ctrl+K) | Power-user UX. |
| X6 | Responsive design (mobile → desktop) | Professional finish. |
| X7 | Swagger API docs, Docker Compose, GitHub Actions CI | Engineering maturity. |
| X8 | Live deployment (demo link in README) | Reviewer can try it in 10 seconds. |

### 4.4 Out of scope

Note sharing between users, collaborative co-editing, file attachments, OAuth (Google login), mobile native apps.

## 5. User Stories & Acceptance Criteria

### Authentication
- **US-1** As a visitor I can sign up with name, email, password.
  - Email unique, valid format; password ≥ 8 chars with letter + number; inline errors; on success I'm logged in and redirected to the dashboard.
- **US-2** As a user I can log in.
  - Wrong credentials show a generic "Invalid email or password" (no user enumeration). 5 failed attempts / 15 min → rate-limited (429).
- **US-3** As a user I stay logged in across refreshes (refresh token in httpOnly cookie) and can log out (token revoked).
- **US-4** Unauthenticated access to protected pages redirects to `/login` and returns to the intended page after login.

### Notes
- **US-5** I see my notes on the dashboard (grid/list), newest first, with title, preview, tags, last-edited time; empty state when none.
- **US-6** I can create a note; I land in the editor with focus in the title.
- **US-7** I can edit title/content with rich text; changes autosave (debounced ~800 ms) and also on Save; Cancel returns to dashboard (with unsaved-changes guard).
- **US-8** I can delete a note (moves to Trash, with Undo toast); I can restore or permanently delete from Trash.
- **US-9** I can pin, archive, and tag notes.
- **US-10** I can search and filter; results update as I type (debounced), with the search term highlighted.
- **US-11** I can export notes and import a file; I get a summary ("12 imported, 1 skipped — invalid format").
- **US-12** If I edit a note in another tab, this tab updates in real time.

### Profile
- **US-13** I can see my profile (name, email, member since, note stats), update my name, change my password, and log out.

## 6. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Security | bcrypt (cost 12), JWT access (15 min) + rotating refresh token (7 days, httpOnly, SameSite), Helmet, CORS whitelist, rate limiting, input validation (Zod) on every endpoint, HTML sanitization of rich-text content, parameterized queries only, secrets in `.env` (never committed). |
| Performance | API p95 < 200 ms locally; paginated list endpoints; DB indexes on all filter columns; code-split frontend routes. |
| Accessibility | WCAG 2.1 AA: keyboard navigable, visible focus, labels on inputs, contrast ≥ 4.5:1, ARIA where needed. |
| Reliability | Graceful shutdown, health endpoint `/api/v1/health`, unhandled rejection/exception handlers log and exit cleanly. |
| Observability | Structured JSON logs (Pino), request-id correlation, pretty logs in dev, redaction of passwords/tokens. |
| Maintainability | Layered architecture, ESLint + Prettier, TypeScript strict mode, no file > ~300 lines, SonarQube gate. |

## 7. Requirement Traceability Matrix

| Brief requirement | Where it's covered |
|---|---|
| Sign up, log in, log out | F1 · `02-ARCHITECTURE` §Auth · `04-API` /auth · `05-UI-UX` Screen 1 |
| Notes tied to authenticated user | F2 · `03-DATABASE` notes.user_id FK · service-layer ownership checks |
| Create / edit / delete notes | F3 · `04-API` /notes |
| Rich-text editing | F4 · Tiptap editor (`05-UI-UX` Screen 3) |
| Pino logging (events, errors, HTTP req/res, user activity) | F6 · `06-QUALITY` §Logging |
| DB schema for users, notes, related data | F8 · `03-DATABASE` |
| Global exception middleware + log via Pino | F7 · `06-QUALITY` §Error handling |
| Mocha/Chai backend, Jest frontend; controllers, services, DAL | F9 · `06-QUALITY` §Testing |
| SonarQube + JS/TS rules | F10 · `06-QUALITY` §SonarQube |
| React dashboard: notes, profile | F5, F12 · `05-UI-UX` |
| Git branching + merging | F11 · `07-GIT-WORKFLOW` |
| Optional: Socket.IO, export/import, search & filter | O1–O3 |
