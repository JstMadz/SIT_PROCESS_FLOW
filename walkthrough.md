# SIT_PROCESS_FLOW: walkthrough

## 2026-11-25 (later) — Contact numbers for admins only

Owner: students should not see the HTE contact numbers (Data Privacy Act of 2012, Republic Act No. 10173); only admins.

- Partner table for students: the Phone column is gone (No., Company, City / address, Contact person, Email); the freed width went to the other columns.
- Student filter no longer matches contact numbers (`PARTNER_SEARCH_FIELDS` in `js/modules/partner-list.js`); the admin search keeps them (`ADMIN_SEARCH_FIELDS` in `js/modules/hte.js`).
- Admin list rows now show the contact number after the address and contact person, so admins see it without opening Edit.
- Still open (backlog, Privacy): the numbers are hidden on screen but still sent to every browser with the rest of the list.

Verified: 84/84 browser checks (new: no Phone heading or cells, a known number never appears in the student table, filtering by a number finds nothing); admin list shows and finds the number; screenshots at 1440 light/dark, 390, 344 px, no sideways scroll, no errors.

## 2026-11-25 (later) — Post-Training buttons hover like the others (pushed: develop and main)

Pre-merge check over `origin/main..develop`: one-caller abstractions none found; duplicate logic none found; special cases none found; oversized files: `index.html` 561 lines (markup only, already in the backlog). Dead code: an unused chevron icon, removed in a `Refactor` commit.

Owner: the Post-Training buttons did not react on hover like the buttons in Pre-Deployment and During Training. Root cause: the five template and GForm links still carried `style="background: var(--surface)"` from the earlier design, and an inline style beats the shared `.btn-secondary:hover` tint. Removed the inline styles; the buttons now use the shared style only (full width inside their grey boxes, like Step 4's Request Form).

Verified: computed colours at rest and on hover are identical for a Pre-Deployment, a During Training and a Post-Training button in light and dark mode; 81/81 browser checks.

## 2026-11-25 (later) — White header and footer in light mode, cardinal in dark

Owner: in light mode the top band and the footer bar should be white like the live site; cardinal red in dark mode.

- New band tokens in `css/tokens.css` (`--band`, `--band-ink`, `--band-ink-2`, `--band-edge`, `--band-button`): light = white with dark text, grey subtitle and a hairline edge; dark = cardinal #9E1B32 with white text. `css/sidebar.css` uses them for the band, its phone theme button and the desktop footer bar.
- The partner list's title bar now uses the accent instead of the band colour, so it stays cardinal in both themes (it would otherwise have turned white with white text).

Verified: 81/81 browser checks; computed colours checked per theme (light: band and footer white, partner title cardinal; dark: all cardinal); screenshots at 1440 px light/dark, 390 and 344 px; no sideways scroll, no errors.

## 2026-11-25 — Floating sidebar

Owner approved the sample (https://claude.ai/artifact/LZMA5BDV1NxhuZSLpxN2SC#artboard-Floating) and chose to keep the cardinal band, footer and buttons (their grey edits in the sample were a try-out). Transparent logos were tried in the sample and undone at the owner's request; the logos keep their white circles.

- The desktop sidebar is now a floating white card: 1rem gap from the band, the footer bar and the window edge, 1rem rounded corners, a full hairline border and a soft shadow. Inside, rem-based corners: menu items 0.625rem, steps and search 0.5rem, Light/Dark 0.5rem / 0.375rem.

Verified: 81/81 browser checks; measured at 900 and 700 px window heights, scrolled and not: sidebar 16 px from the band, the left edge and the footer. Screenshots in light and dark at 1440 px; phones unchanged (390 and 344 px, no sideways scroll, no errors).

## 2026-11-24 (final) — Fixed band and footer, one-line credit, icon-only capsule tabs, no sliding highlight

- **Fixed frame on computers:** the cardinal band stays at the top and a new cardinal footer bar (© TUP Industrial Relations and Job Placement Office) stays at the bottom; the sidebar fills the space between, so its foot is always in view. On phones the band stays at the top and the tab bar holds the bottom, so the © line goes back into the page.
- **Credit:** "Created by: Ino Amador" on one line (no wrap), in the sidebar foot and the phone footer; still the 5-click admin door.
- **Phone tab bar:** icons only in a rounded capsule (iPhone-style, centred, max 340 px, frosted white), the current tab a filled cardinal circle; each icon keeps its name as `aria-label` and `title` for screen readers and long-press hints.
- **Animation removed** (owner: it made them dizzy). Root cause of the jump: every click rebuilt the menu, so the sliding highlight started again from the top before moving to the chosen item. The current item is now simply filled cardinal; submenus show and hide without animating; clicking a step jumps straight to it instead of a smooth scroll.

Verified with Playwright and Firebase stubbed: 81/81 checks (new: no sliding highlight and the current step filled, creator on one line, footer bar fixed at the bottom and band at the top, icon-only tabs with spoken names, capsule shape, band and tab bar fixed while scrolling on phones). Screenshots at 1440 px light/dark, 390 and 344 px; no sideways scroll, no page errors. Overview artifact republished.

## 2026-11-24 (late night) — Corporate theme, words-only sidebar, numbered partner list

Owner approved the mockup (https://claude.ai/artifact/LZMA5BDV1NxhuZSLpxN2SC, "It's perfect") and the suggested answers: no collapse on desktop, copy icon kept, charcoal dark mode.

- **Theme** (`css/tokens.css`): plain cardinal #9E1B32, white and light gray #F0F1F3; charcoal (#1B1D20 / #25282C) in dark mode with the same cardinal. 8 px cards, 6 px controls, 10 px dialogs, flat shadows. Glass, the red wash and the soft rounded look are gone. Secondary buttons are cardinal outlines; step numbers are filled cardinal; phase and step labels cardinal.
- **Frame** (`css/sidebar.css`): a cardinal band on top (logos, "Supervised Industrial Training", university · college · department), fixed while scrolling; on computers a white sidebar under it with words only (no icons, no rail, no handle): search, phases with numbered steps ("1. Document Submission…"), Forms Repository, and a foot with "Created by" and **Light | Dark** words that always stays in view (checked at 900 and 700 px window heights, scrolled and not). The current item is a cardinal pill with white text.
- **Phones:** the band shows "SIT Process Flow" and the sun/moon button; the floating tab bar keeps its icons (now white with the current tab filled cardinal). Icons appear only there and on small controls (close, copy, password eye, sort arrow).
- **Partner list:** a **No.** column (numbers follow the current sort and filter), cardinal title bar, cardinal line under the headings, striped rows; phone cards start with "No. N". Email column a little wider.
- `theme.js`: `chooseTheme(dark)` for the Light / Dark words; `toggleTheme` for the phone button. `sidebar.js`: rail, icons and shortcut removed.

Verified with Playwright and Firebase stubbed: 77/77 checks (new: No. column and numbering, numbers follow the sort, sidebar has no icons and no handle, numbered steps in the sidebar, Light/Dark words; the idle-warning check now uses real idle time instead of a hand-opened dialog, which the app's own idle check could close). Screenshots at 1440 px light/dark, 390 and 344 px; no sideways scroll, no page errors. Overview artifact republished.

## 2026-11-24 (night) — Glass sidebar like bidDocsBuilder; floating tab bar on phones

Owner asked for bidDocsBuilder's left sidebar, with the creator's name and the theme switch at its foot unaffected by scrolling, and icons on phones.

- **Desktop sidebar** (`js/modules/sidebar.js`, `css/sidebar.css`; design from bidDocsBuilder `Sidebar.tsx` / calm-luxury-ui.md §6): floating glass panel over the cardinal/gray wash; TUP, CHED and College of Science logos with the title; "Search the menu" (finds phases and steps, opens the group of a matching step); Pre-Deployment and During Training open to their steps (built from the page's own step cards, so the menu can't drift from the content), click a step to jump to it; Post-Training; Forms repository. A pill slides to the current phase or step. Edge handle or Ctrl+\ (⌘\ on a Mac) collapses to a 76 px icon rail with names on hover, remembered (`sit-process-flow:sidebar-rail`, applied before first paint); clicking a rail icon reopens the sidebar on that phase. The foot ("Created by", still the 5-click admin door, and the theme button) is fixed with the sidebar, so scrolling never moves it.
- **Phones (under 768 px):** a slim glass top bar (logo, title, theme) and a floating bottom tab bar with an icon and the full name for each phase plus Forms Repository. Bottom placement and icon-with-label follow Apple's tab bar and Material's navigation bar guidance for 3–5 main sections (thumb reach; icon-only tabs are harder to recognise). "Created by" moves to the page footer on phones.
- Removed: the top bar with the phase switcher and the summary card with its step list (the sidebar does both). Phase titles are now a plain heading above the steps; the steps use the full width.

Verified with Playwright and Firebase stubbed: 75/75 checks (new: step link scrolls to the step, pill position, foot stays put while scrolling, menu search, Ctrl+\ rail and its memory after reload, rail icon reopens, tab bar hidden on desktop, phone tab bar switches phase, icons and full names, floats at the bottom while scrolling, creator name still opens sign-in on phones). Screenshots 1440 px light/dark (open and rail), 390 and 344 px; no sideways scroll, no page errors. Overview artifact republished.

## 2026-11-24 (evening) — Full phase names on phones, partner button back in Option A, phone cards

- **Phase names:** phones showed "Before / During / After", which aren't SIT terms. The switcher now shows Pre-Deployment, During Training and Post-Training at every width (13 px, two lines allowed under 520 px); the phase headings use the same spelling.
- **Partner list button:** back under Step 3, Option A, as the original design had it (now the phase's one primary button); removed from the phase summary card.
- **Phone cards:** reproduced on the live list (143 companies) at 390 and 344 px. "Achieve Without Borders, Inc." squeezed its address and email into a narrow column beside a 112 px label, and the email broke mid-word. Labels now sit above each value at full width, and words only break when they can't fit (`overflow-wrap: break-word`).
- **Not a display bug:** about 30 stored addresses have their parts joined with no space (e.g. "Building1184 Quezon AvenueBarangay PaligsahanQuezon City"); the source sheet joined street, barangay and city before upload. Logged in the backlog; an admin can fix each one with Edit.

Verified: 62/62 browser checks; live-data screenshots at 344 and 390 px (Makati filter, Step 3, phase bar); no sideways scroll.

## 2026-11-24 (later) — Partner companies as a table; locked dialogs (pushed: develop and main at 8a0221d)

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
