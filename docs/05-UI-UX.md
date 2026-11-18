# 05 — UI / UX Design Specification

## 1. Design Direction

**"Calm, focused, premium."** Inspired by the clarity of Linear / Notion / Apple Notes — lots of whitespace, one accent color, crisp typography, subtle motion. Nothing flashy; everything intentional.

| Token | Light | Dark |
|---|---|---|
| Background | `#FAFAFA` (zinc-50) | `#09090B` (zinc-950) |
| Surface / cards | `#FFFFFF` | `#18181B` (zinc-900) |
| Border | `#E4E4E7` | `#27272A` |
| Text primary / muted | `#18181B` / `#71717A` | `#FAFAFA` / `#A1A1AA` |
| **Accent (brand)** | `#4F46E5` indigo-600 *(changeable — see `09`)* | `#818CF8` indigo-400 |
| Success / Warning / Danger | `#16A34A` / `#D97706` / `#DC2626` | lighter variants |
| Tag palette | 8 soft pastel colors (bg 15% opacity + solid text) | same |

- **Typography:** *Inter* (UI) · *JetBrains Mono* (code blocks). Scale: 12 / 14 / 16 / 20 / 24 / 32 px. Body 14–16 px, line-height 1.6 in editor.
- **Spacing:** 4-px grid (4, 8, 12, 16, 24, 32, 48). **Radius:** 8 px (inputs/buttons), 12 px (cards), 16 px (modals).
- **Shadows:** almost none — borders do the work; a soft shadow only on hover/popovers.
- **Motion:** 150–200 ms ease-out; card hover lift, modal fade/scale, list item enter/exit. Respect `prefers-reduced-motion`.
- **Icons:** lucide, 16/20 px, 1.5 stroke.

## 2. App Shell (desktop)

```
┌──────────────┬─────────────────────────────────────────────────────────┐
│ ◆ NoteFlow   │  🔍 Search notes…  (Ctrl K)          [⊞ grid|≡ list] [+ New] │
│              ├─────────────────────────────────────────────────────────┤
│ 📝 All notes │  Pinned                                                  │
│ 📌 Pinned    │  ┌────────┐ ┌────────┐ ┌────────┐                        │
│ 🗄 Archive   │  │ Title  │ │ Title  │ │ Title  │                        │
│ 🗑 Trash     │  │ preview│ │ preview│ │ preview│                        │
│              │  │ #tag 2h│ │ #tag 1d│ │    3d  │                        │
│ TAGS      +  │  └────────┘ └────────┘ └────────┘                        │
│ ● Work    12 │  Others                                                  │
│ ● Ideas    5 │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐             │
│ ● Personal 3 │  │        │ │        │ │        │ │        │             │
│              │  └────────┘ └────────┘ └────────┘ └────────┘             │
│ ──────────── │                                                          │
│ (A) Muhammad │                                                          │
│   ☀/☾  ⚙     │                                                          │
└──────────────┴─────────────────────────────────────────────────────────┘
```
Mobile (< 768 px): sidebar becomes a slide-in drawer, floating "+" button bottom-right, cards in a single column.

## 3. Screens

### Screen 1 — Sign Up / Log In  (`/signup`, `/login`)
- Split layout: left = form; right = brand panel (accent gradient, product screenshot/illustration, one-line value prop). Right panel hidden on mobile.
- Components: email, password (show/hide toggle, strength meter on sign-up), name (sign-up), submit with loading spinner, link to switch form, "Try demo account" button.
- Operations: client-side Zod validation → API → store token → redirect to intended page or `/notes`.
- States: inline field errors, server error banner, disabled button while submitting.

### Screen 2 — Dashboard (`/notes`, `/notes?view=archived|trash`, `/notes?tag=…`)
- Components: sidebar nav, search bar, sort dropdown, grid/list toggle, filter chips, note cards (title, 3-line preview, tags, relative time, pin icon, hover "⋯" menu: pin, archive, tags, export, delete), "New note" button.
- Operations: fetch user notes (paginated / infinite scroll), search (debounced 300 ms, highlighted matches), filter, navigate to editor, real-time updates.
- States: **skeleton cards** while loading · **empty state** illustration ("No notes yet — create your first one") · **no results** state for search · error state with retry.
- Trash view: banner "Notes in Trash are deleted after 30 days" + "Empty trash"; cards show Restore / Delete forever.

### Screen 3 — Note Editor (`/notes/new`, `/notes/:id`)
```
← Back   Saved ✓ · edited 2 min ago               [📌] [🏷 Tags] [⋯] [Cancel] [Save]
──────────────────────────────────────────────────────────────────────────────
  Untitled note (big 32px title input)
  #work  #ideas  + add tag
  [B] [I] [U] [S] | H1 H2 H3 | • 1. ☐ | ❝ </> 🔗 | ↶ ↷        (sticky toolbar)
  ────────────────────────────────────────────────
  Rich text content…  (max-width 720 px, centered, comfortable reading width)

                                                       312 words · 2 min read
```
- Components: title input, Tiptap editor with sticky toolbar + bubble menu on selection, tag picker (combobox, create on the fly), save/cancel, status indicator.
- Operations: create / edit, autosave (debounced) + `Ctrl+S`, cancel with unsaved-changes dialog, return to dashboard, 409 conflict dialog ("This note changed in another tab — reload / overwrite").
- Markdown shortcuts work (`#`, `-`, `[]`, `>` , ``` ``` ```).

### Screen 4 — User Profile (`/profile`)
- Components: avatar (initials), name (editable), email, member since, stats cards (total notes, pinned, archived, tags), recent activity timeline, change-password form, export-all button, import button, logout button (also in sidebar).
- Operations: display info, update name, change password, log out.

### Global
- **Command palette (Ctrl+K):** search notes, jump to views, new note, toggle theme, log out.
- **Shortcuts:** `N` new note, `/` focus search, `Ctrl+S` save, `Esc` back. A `?` dialog lists them.
- **Toasts:** "Note moved to Trash — Undo", "Saved", import summary.
- **404 page** and **error boundary** page with friendly copy + "Go home".

## 4. Accessibility Checklist
- All interactive elements reachable with Tab, visible focus ring (accent, 2 px).
- Labels on every input, `aria-live` for save status and toasts.
- Color is never the only signal (tags have names, errors have icons + text).
- Contrast ≥ 4.5:1 checked in both themes.
- Modals trap focus and close on `Esc` (Radix handles this).

## 5. Deliverable Assets
- Screenshots of every screen (light + dark) in `docs/screenshots/` and embedded in README.
- A 60–90 s demo GIF/video linked from README.
