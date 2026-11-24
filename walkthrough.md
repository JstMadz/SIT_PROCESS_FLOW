# SIT_PROCESS_FLOW: walkthrough

## 2026-11-24 (later) — Partner companies as a table; locked dialogs

Owner asked for a table of partners, no redundant buttons, a copy icon, sorting and filtering by company and city, emails that open the user's mail app, and dialogs that close only from their own buttons.

- **Table** (`js/modules/partner-list.js`, styles in new `css/partner-table.css`): Company, City / address, Contact person, Phone, Email, all visible; "—" for a missing value; headings stay visible while scrolling. Click Company or City to sort, again to reverse (`aria-sort`, arrow icon). Filter box above. Narrower than 40rem (container query) each company becomes a card with labels, and the two sort headings stay as a sort bar. "Show 20 more" kept.
- **Email:** the address is a `mailto:` link, so it opens the default mail app on desktop or phone (if one is set up); a copy icon (labelled "Copy email address …") replaces the word Copy.
- **Removed:** the second "View partner companies" button (Step 3, Option A now points to the one at the top of the phase) and the A to Z / By city switch (the headings sort now). Rows no longer open in place.
- **Locked dialogs** (`js/modules/ui.js`): clicking outside and Escape no longer close any dialog; only ×, Cancel, Close or the dialog's answer buttons do. Tab stays inside the top dialog.
- `getVisibleHtes` takes a sort direction (admin list stays A to Z).

Verified with Playwright and Firebase stubbed: 62/62 checks (new: 5 columns, sort and reverse, sort by city, mailto link, copy icon, dash for missing, Escape/outside click/Tab stay inside for the partner list, confirm and idle dialogs, one View partner companies button). Screenshots at 1440 px light/dark, 390 px and 344 px; no sideways scroll, no page errors. Overview artifact republished (System workflow row).

## 2026-11-24 — Calm-luxury redesign and a new partner companies list

Owner asked for the site in the latest house design and a friendlier list of partner companies.

- **Look:** calm-luxury tokens in `css/styles.css` (canvas #F5F5F7, white cards with hairlines, cardinal #9E1B32 as the only accent, dark #D70015 / #FF7782), system fonts (Inter from Google Fonts dropped), tabular numbers, one primary button per view. Light/dark theme follows the device until the sun/moon button is used, then it is remembered (`js/modules/theme.js`, circle ripple from patterns §18, off under reduced motion; set in `<head>` before first paint).
- **Layout:** whole window, one 12-column grid with container-query spans. Glass top bar with a segmented control for the three phases on every width (the phone bottom bar with icon-only buttons is gone; phones get short words). Each phase: an overview card on the left (sticky step list from 960 px) and numbered step cards on the right; phones show "Step N" instead of the timeline numbers.
- **Few icons:** decorative step, list and button icons removed. lucide (`@latest` from unpkg) removed; seven inline SVGs remain (close, search, eye, eye-off, sun, moon, chevron).
- **Partner companies (students), `js/modules/partner-list.js`:** full-screen sheet on phones; search by company, city, contact person, phone or email; A to Z / By city; 20 at a time with "Show 20 more"; each row shows name, address and contact person, and opens in place (grid-rows animation, `inert` while closed) to show phone, email (mail link + Copy) and address. Plain-words states for loading, load failure, empty list and no match (with Clear search). Footer reminds students of Option B. Escape and backdrop close every dialog except the idle warning; focus returns to the opener; the page behind stops scrolling.
- **Admin:** split into Form links / Partner companies; add form on the grid; list rows with checkbox, name, address · person, Edit and Delete words; empty link fields instead of "#"; sign-in is a form, so Enter works; link values are now HTML-escaped in the form.
- Also: `.gitignore` added and `.DS_Store` untracked (separate commit); `loadHteData` keeps a load state instead of writing table rows; `target=_blank` links get `rel="noopener noreferrer"`.

- Project overview page added: `docs/project-overview.html`, published at https://claude.ai/artifact/UtHgXkr5wctDeYeKzMZawt (swimlane flow, PAWIM guide with owner fields “to be set”, workflow, architecture, stack, Firestore data).

Verified with Playwright (Chromium) and Firebase stubbed: 55/55 checks (tabs, missing-link toast, search by city and person, no-match and clear, show more to the end, sort, open/close row, copy email, Escape/backdrop, escaped names, theme switch and memory, sign-in wrong/locked/right with Enter and eye, admin add/search/edit/bulk delete/confirm/Escape, idle warning ignores Escape, save links, sign out, empty and failing database, 1,500 companies search in 29 ms, phone full-screen sheet with no keyboard pop). Screenshots at 1440 px light/dark, 390 px and 344 px: no sideways scroll, no page errors.

## 2026-11-08 — Full security audit added to the backlog

- On hold at the owner's request; the backlog lists what this repo needs before it can run. Nothing else changed.

## 2026-11-01: Login protection to the standing rule

The standing rule for every app with a login: log out after 15 idle minutes with a 30-second in-app "Are you still there?" countdown, throttle wrong passwords on the server, and put a show/hide eye on the password field.

Before: one `setTimeout` signed the admin out after **2 minutes** with no warning, and only after a fresh login. Firebase keeps the admin signed in across reloads, and the Admin button opens the dashboard straight away when Firebase has a user, so after a reload (or on a shared computer where the dashboard was just closed) the admin could edit HTEs and links with **no idle limit at all**. Every sign-in error said "Invalid credentials", including Firebase's "too many attempts" lock.

- `js/modules/session.js` rewritten: 15 minutes, 30-second warning dialog (`#idle-modal`: Log out now / Stay signed in; moving the mouse doesn't dismiss it), idle time from timestamps shared across tabs in `localStorage` (`sit-process-flow:lastActivity`), checked every second. It starts from `onAuthStateChanged`, so restored sessions are tracked too, and a session reopened after more than 15 idle minutes is signed out on load. Log-out says why ("You were logged out after 15 minutes of inactivity.").
- `js/firebase/auth.js`: plain-language messages per Firebase error code (`LOGIN_ERROR_MESSAGES`), including "Too many wrong attempts…" for `auth/too-many-requests`, which is this app's server-side rate limit.
- Show/hide eye inside the password field (`toggleLoginPassword` in `js/modules/ui.js`, lucide eye / eye-off, `aria-label`, `aria-pressed`, 44 px); the login dialog always opens with the password hidden. Fields got `name` and `autocomplete`.
- Separate refactor commit: `index.html` had its opening `<body>`, toast container and confirm dialog twice (duplicate ids); the first copy is removed, pixel-identical before and after.

Verified in Chrome at 1366 px and 344 px with Firebase stubbed and the clock shifted (19 checks): eye toggles and keeps the text; error messages per code; sign-in with the password shown; no warning at 14 minutes; warning with the countdown in the last 30 seconds; Stay keeps the session; one log-out and one message at 15 minutes; a session restored on reload gets the warning and log-out; a session reopened after 20 idle minutes is signed out on load; the password field is empty and hidden afterwards; no page errors.
