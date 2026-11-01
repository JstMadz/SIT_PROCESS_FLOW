# SIT_PROCESS_FLOW: implementation plan

> Backlog. Tick items as they ship and log the work in `walkthrough.md`.

## Backlog

### P1: Security
- [ ] **Login protection to the standing rule.** Rule (owner, 2026-11-01; `~/.claude/skills/dev-playbook/references/patterns.md` §13): log out after 15 idle minutes with a 30-second in-app "Are you still there?" countdown; server-side rate limit of 3 wrong passwords → 30-minute lockout. Today `js/modules/session.js` logs out after **2 minutes** (`INACTIVITY_LIMIT`) with no warning → 15 minutes with a 30-second in-app countdown (Stay signed in / Log out now), measured from timestamps, then the normal sign-out with a message. Sign-in throttling is Firebase Auth's; show `auth/too-many-requests` in plain language.
