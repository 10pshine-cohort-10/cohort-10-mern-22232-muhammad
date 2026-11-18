# 04 — REST API Specification

Base URL: `/api/v1` · JSON only · Auth: `Authorization: Bearer <accessToken>` (🔒) · Live docs: `/api/docs` (Swagger UI)

**Success envelope**
```json
{ "success": true, "data": { }, "meta": { "page": 1, "limit": 20, "total": 57 } }
```
**Error envelope** — see `02-ARCHITECTURE` §6.

## Auth
| Method | Path | Body | Response | Notes |
|---|---|---|---|---|
| POST | `/auth/register` | `{ name, email, password }` | 201 `{ user, accessToken }` + refresh cookie | 409 if email exists |
| POST | `/auth/login` | `{ email, password }` | 200 `{ user, accessToken }` + cookie | rate limited 5/15 min per IP+email |
| POST | `/auth/refresh` | — (cookie) | 200 `{ accessToken }` + rotated cookie | |
| POST | `/auth/logout` | — (cookie) | 204 | revokes token, clears cookie |

## Users / Profile 🔒
| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/users/me` | — | `{ id, name, email, createdAt, stats: { notes, pinned, archived, trashed, tags } }` |
| PATCH | `/users/me` | `{ name }` | updated user |
| PATCH | `/users/me/password` | `{ currentPassword, newPassword }` | 204, revokes other sessions |
| GET | `/users/me/activity?limit=10` | — | recent activity list |

## Notes 🔒
| Method | Path | Body / Query | Response |
|---|---|---|---|
| GET | `/notes` | `?q=&tag=&status=active\|archived\|trash&pinned=&sort=updatedAt\|createdAt\|title&order=desc&page=1&limit=20` | paginated list (preview, not full HTML) |
| GET | `/notes/:id` | — | full note |
| POST | `/notes` | `{ title, contentHtml, tagIds? }` | 201 note |
| PATCH | `/notes/:id` | `{ title?, contentHtml?, tagIds?, isPinned?, isArchived?, version }` | 200 note · 409 `VERSION_CONFLICT` |
| DELETE | `/notes/:id` | — | 204 (soft delete → Trash) |
| POST | `/notes/:id/restore` | — | 200 note |
| DELETE | `/notes/:id/permanent` | — | 204 (only from Trash) |
| DELETE | `/notes/trash` | — | 204 empty trash |

Rules: every query is scoped `WHERE user_id = :currentUser` → accessing another user's note returns **404** (not 403, to avoid leaking existence). `contentHtml` is sanitized server-side (allow-list of Tiptap tags).

## Tags 🔒
| Method | Path | Body |
|---|---|---|
| GET | `/tags` | — (includes note counts) |
| POST | `/tags` | `{ name, color }` |
| PATCH | `/tags/:id` | `{ name?, color? }` |
| DELETE | `/tags/:id` | — |

## Export / Import 🔒
| Method | Path | Details |
|---|---|---|
| GET | `/transfer/export?format=json\|markdown&ids=` | JSON file or `.zip` of `.md` files (`Content-Disposition: attachment`) |
| POST | `/transfer/import` | `multipart/form-data` `file` (.json / .md / .zip, ≤ 5 MB) → `{ imported, skipped, errors[] }` |

## System
| Method | Path | Response |
|---|---|---|
| GET | `/health` | `{ status: "ok", uptime, db: "up" }` |

## Socket.IO Events
| Direction | Event | Payload |
|---|---|---|
| client → server | `connect` (handshake `auth: { token }`) | — |
| server → client | `note:created` / `note:updated` / `note:deleted` / `note:restored` | `{ note \| id, originSocketId }` |
| server → client | `session:revoked` | forces logout in other tabs |

## HTTP Status Codes Used
200, 201, 204, 400 (validation), 401 (unauthenticated / token expired), 404, 409 (conflict / duplicate), 413 (file too large), 415 (bad file type), 429 (rate limit), 500.
