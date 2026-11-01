# AGENTS.md: SIT_PROCESS_FLOW (SIT Process Flow, TUP)

> Instructions for any AI agent (Claude Code, Codex, Gemini, Copilot, OpenCode…) working in this repo.
> Owner: Madz Amador. House rules: `~/.claude/skills/dev-playbook/SKILL.md`; global agent rules: `~/Documents/KnowledgeGraph/AGENTS.md`. This file overrides them where they differ.

## 1. What this is
A guide for TUP Manila College of Science students doing their **Supervised Industrial Training (SIT)**: the step-by-step process flow, links to the forms and apps they need, and a searchable list of **Host Training Establishments (HTEs)**. Staff sign in as admin to add, edit and delete HTEs and to change the app links; students only read.

## 2. Stack & commands
- Stack A + Firebase: plain HTML/CSS/JS (Tailwind and lucide from CDNs), Firebase Auth (admin sign-in) and Cloud Firestore (compat SDK). No build, no tests.
- Run: `npx serve .` (Firebase Auth needs http://, not `file://`).
- Verify: as a student, browse the process flow, search and page through HTEs; as admin, sign in, add/edit/delete an HTE, bulk delete, change a link, sign out; phone width.
- Deploy: static hosting of the repo root; Firebase project `tup-sit-app`.

## 3. Project memory
- `implementation_plan.md`: backlog. Read before working. Create `walkthrough.md` on first change and add a dated entry after every change.
- Work on `develop`, never directly on `main`.

## 4. Domain rules (non-negotiable)
1. **Login protection (standing rule):** 15 idle minutes → 30-second in-app "Are you still there?" countdown → sign-out; sign-in throttling via Firebase Auth (`auth/too-many-requests` shown in plain words); a show/hide eye on the password field. Today `js/modules/session.js` signs out after 2 minutes with no warning: see the backlog P1 and `~/.claude/skills/dev-playbook/references/patterns.md` §13.
2. Only signed-in admins may write; students never need an account. Writes are enforced by **Firestore security rules in the Firebase console**, not by hiding buttons.
3. In-app modals and plain-language messages (no `alert`/`confirm`).

## 5. Key files
- `config/firebase-config.js`: Firebase project settings (the web API key is public by design; access is controlled by Auth + Firestore rules).
- `js/firebase/auth.js` (sign-in/out), `js/firebase/database.js` (Firestore: `htes` collection, `settings/app_links` document).
- `js/modules/`: `session.js` (inactivity sign-out), `hte.js` (HTE list, search, pagination, admin table), `tabs.js`, `ui.js`; `js/main.js` wires them; `js/constants.js`.
- `oldVersions/`: earlier pages kept for reference; not served from the main page.

## 6. Gotchas specific to this repo
- The Firestore rules aren't in the repo. Before changing who can write, check (and record) the rules in the Firebase console; a client-only check is no protection.
- No `.gitignore`: `.DS_Store` has been committed. Add one before committing other changes.
- The README is two lines; replace it with a real one (what it is, how to run, structure) when you next touch docs.

## 7. Before you finish
- [ ] Student and admin walk-throughs above pass; phone width checked
- [ ] `walkthrough.md` updated; commit on `develop` with a body that explains why
