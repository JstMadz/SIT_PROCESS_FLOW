# SIT_PROCESS_FLOW: implementation plan

> Backlog. Tick items as they ship and log the work in `walkthrough.md`.

## Backlog

Security (audit 2026-11-07):
- [ ] **Full security audit (on hold, owner 2026-11-08):** 7 doors plus extra checks A to G, not run yet. Setup and tools are listed in the owner's private notes.
- [ ] Owner: review the Firebase rules and sign-up settings against the 7-door checklist. Details are in the private vault note `02_Areas/Security.md`.
- [ ] Carry out the data-access plan in the same vault note, once the owner has answered its three questions.

### P1: Security
- [x] (2026-11-01) **Login protection to the standing rule** (done; see walkthrough). Rule (owner, 2026-11-01; `~/.claude/skills/dev-playbook/references/patterns.md` §13): log out after 15 idle minutes with a 30-second in-app "Are you still there?" countdown; server-side rate limit of 3 wrong passwords → 30-minute lockout. Today `js/modules/session.js` logs out after **2 minutes** (`INACTIVITY_LIMIT`) with no warning → 15 minutes with a 30-second in-app countdown (Stay signed in / Log out now), measured from timestamps, then the normal sign-out with a message. Sign-in throttling is Firebase Auth's; show `auth/too-many-requests` in plain language.

### P2: Found while adding login protection (2026-11-01)
- [ ] Check (and copy into the repo, e.g. `firestore.rules`) the Firestore security rules in the Firebase console: writes to `htes` and `settings/app_links` must require a signed-in admin. The app only hides the admin screens; the rules are the real protection.
- [x] (2026-11-24) Pin lucide to an exact version: done by removing lucide; the seven icons left are inline SVG.
- [x] (2026-11-24) Let Enter submit the admin login (now a `<form>`).

### Design
- [x] (2026-11-24) Calm-luxury redesign of the whole site and a new partner companies list (see walkthrough).
- [ ] Owner: decide whether this redesign needs the research brief (`docs/RESEARCH.md`, layouts-and-research §3); skipped as a restyle with no new features.
- [ ] House rule (SKILL.md §2 Code): no inline `onclick`; the page still wires every control with inline handlers (old pattern, kept in the redesign). Move to `addEventListener` in a `Refactor` commit.
- [ ] Process owner: fill the PAWIM fields marked “to be set” in `docs/project-overview.html` (document code, effective date, record retention) and sign.
- [ ] Tailwind loads from its CDN play script, which Tailwind says is not for production. Swap for a small built CSS file or plain CSS (layout utilities only are left).

## Privacy

- [ ] **Data Privacy Act check (owner rule 2026-11-18), under the Data Privacy Act of 2012 (Republic Act No. 10173), a Philippine law:** run P1–P9 from `~/.claude/skills/dev-playbook/references/data-privacy.md`; start with P1, P2, P4. Cross-repo plan and register: vault `02_Areas/Data Privacy.md`.
