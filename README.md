# NoteFlow

> A calm, fast and secure full-stack notes app — built with **Node.js, Express, React, TypeScript and MySQL**.
> Cohort 10 — MERN (Node.js + React.js) assignment for the **10Pearls Shine** program, by **Muhammad Saim Ayyaz**.

![CI](https://github.com/saimayyazsheikh/cohort-10-mern-22232-muhammad/actions/workflows/ci.yml/badge.svg)
![Node](https://img.shields.io/badge/node-%3E%3D22-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)

---

## ✨ Features

| Status | Feature |
| :----: | ------- |
|   ✅   | Project foundation: TypeScript monorepo, Express API, React app, design system, light/dark theme |
|   ✅   | Pino logging with request ids, global exception handling, request validation |
|   ✅   | Unit + integration tests (Mocha/Chai backend, Jest/RTL frontend), lint, CI |
|   ⏳   | Sign up / log in / log out with JWT (access + rotating refresh tokens) |
|   ⏳   | Notes CRUD with rich-text editor and autosave |
|   ⏳   | Tags, pin, archive, trash with undo |
|   ⏳   | Full-text search, filters and sorting |
|   ⏳   | Export / import (JSON, Markdown) |
|   ⏳   | Real-time sync across tabs (Socket.IO) |
|   ⏳   | User profile, SonarQube quality gate |

Each feature ships in its own pull request — see the [roadmap](docs/08-ROADMAP.md).

## 🧱 Tech stack

| Layer    | Technologies |
| -------- | ------------ |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, React Router, lucide icons |
| Backend  | Node.js, Express 5, TypeScript, Zod, Pino, Helmet, CORS |
| Database | MySQL 8.4 (Prisma — from the auth feature onwards) |
| Testing  | Mocha, Chai, Sinon, Supertest, c8 · Jest, React Testing Library |
| Quality  | ESLint (typescript-eslint, react-hooks, jsx-a11y), Prettier, Husky, lint-staged, commitlint, SonarQube, GitHub Actions |

## 🚀 Getting started

### Prerequisites

- Node.js **22+** and npm 10+
- MySQL **8.x** running locally (needed from the auth feature onwards)

### Setup

```bash
git clone https://github.com/saimayyazsheikh/cohort-10-mern-22232-muhammad.git
cd cohort-10-mern-22232-muhammad
npm install
cp server/.env.example server/.env   # then adjust values if needed
npm run dev
```

| App          | URL                                  |
| ------------ | ------------------------------------ |
| Frontend     | http://localhost:5173                |
| API          | http://localhost:5000/api/v1         |
| Health check | http://localhost:5000/api/v1/health  |

## 📜 Scripts (run from the repo root)

| Command                 | What it does                                       |
| ----------------------- | -------------------------------------------------- |
| `npm run dev`           | Start API and web app together (hot reload)        |
| `npm test`              | Run backend (Mocha) and frontend (Jest) test suites |
| `npm run test:coverage` | Run tests with coverage reports and thresholds     |
| `npm run lint`          | Lint the whole monorepo                            |
| `npm run typecheck`     | Type-check server and client                       |
| `npm run build`         | Production build of server and client              |
| `npm run format`        | Format all files with Prettier                     |

## 🗂️ Project structure

```
├── client/                 # React + Vite frontend
│   └── src/
│       ├── app/            # router, layouts
│       ├── components/     # shared UI primitives
│       ├── features/       # feature folders (landing, theme, errors, …)
│       └── lib/            # utilities
├── server/                 # Express API
│   ├── src/
│   │   ├── config/         # env validation, logger
│   │   ├── middlewares/    # http logger, validation, 404, error handler
│   │   ├── modules/        # feature modules (routes → controller → service → repository)
│   │   └── utils/          # error classes, response helpers
│   └── test/               # unit + integration tests
└── docs/                   # planning & design documents
```

## 🧪 Quality

- **Backend:** 51 tests, ~99% line coverage (thresholds enforced by c8).
- **Frontend:** 25 tests, ~98% line coverage (thresholds enforced by Jest).
- Every commit is linted and formatted by a pre-commit hook; commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
- CI runs lint, format check, type-check, tests and build on Node 22 and 24.

## 📚 Documentation

| Document | Description |
| -------- | ----------- |
| [Product requirements](docs/01-PRD.md) | Scope, user stories, acceptance criteria |
| [Architecture](docs/02-ARCHITECTURE.md) | System design, stack decisions, flows |
| [Database design](docs/03-DATABASE.md) | ER diagram, tables, indexes |
| [API specification](docs/04-API.md) | Endpoints, payloads, status codes |
| [UI/UX specification](docs/05-UI-UX.md) | Design system and screens |
| [Quality & testing](docs/06-QUALITY-TESTING.md) | Logging, error handling, tests, SonarQube |
| [Git workflow](docs/07-GIT-WORKFLOW.md) | Branching, commits, PR process |
| [Roadmap](docs/08-ROADMAP.md) | Phases and Definition of Done |

## 👤 Author

**Muhammad Saim Ayyaz** — [@saimayyazsheikh](https://github.com/saimayyazsheikh)
