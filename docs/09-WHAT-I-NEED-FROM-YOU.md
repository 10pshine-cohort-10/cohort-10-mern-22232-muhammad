# 09 — Setup Checklist & Open Questions

## Environment
| Item | Status |
|---|---|
| Node.js (v26) / npm 11 | ✅ |
| Git + identity linked to GitHub account | ✅ |
| GitHub CLI authenticated | ✅ |
| Fork `saimayyazsheikh/cohort-10-mern-22232-muhammad` | ✅ |
| MySQL 8.4 LTS (Windows service `MySQL84`, app user + `noteflow` / `noteflow_test` DBs) | ✅ |
| Java 21 (for local SonarQube) | ✅ |
| Docker | ➖ not required |

## Decisions
| Topic | Decision | Source |
|---|---|---|
| PR strategy | One PR per feature, submitted before starting the next | Mentor (sync-up session) |
| Language | TypeScript (frontend + backend) | CodeRabbit config flags missing TS types as HIGH |
| PR base branch | `develop` (CodeRabbit reviews `main` and `develop`) | `.coderabbit.yaml` |
| Database | MySQL 8.4 | Brief tech stack |

## Open questions for the mentor
1. Final submission deadline?
2. Are feature PRs merged into upstream after review (or should the next feature be stacked on the previous branch)?
3. Is a live deployment expected or a bonus?
4. Is there an evaluation rubric?

## Preferences (defaults — can change any time)
| Item | Default |
|---|---|
| App name | NoteFlow |
| Brand accent | Indigo `#4F46E5` |
| Font | Inter |
| Default theme | System (light/dark auto) |
| Demo account | Seeded |
