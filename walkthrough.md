# SIT_PROCESS_FLOW: walkthrough

## 2026-11-01: Login protection to the standing rule

The standing rule for every app with a login: log out after 15 idle minutes with a 30-second in-app "Are you still there?" countdown, throttle wrong passwords on the server, and put a show/hide eye on the password field.

Before: one `setTimeout` signed the admin out after **2 minutes** with no warning, and only after a fresh login. Firebase keeps the admin signed in across reloads, and the Admin button opens the dashboard straight away when Firebase has a user, so after a reload (or on a shared computer where the dashboard was just closed) the admin could edit HTEs and links with **no idle limit at all**. Every sign-in error said "Invalid credentials", including Firebase's "too many attempts" lock.

- `js/modules/session.js` rewritten: 15 minutes, 30-second warning dialog (`#idle-modal`: Log out now / Stay signed in; moving the mouse doesn't dismiss it), idle time from timestamps shared across tabs in `localStorage` (`sit-process-flow:lastActivity`), checked every second. It starts from `onAuthStateChanged`, so restored sessions are tracked too, and a session reopened after more than 15 idle minutes is signed out on load. Log-out says why ("You were logged out after 15 minutes of inactivity.").
- `js/firebase/auth.js`: plain-language messages per Firebase error code (`LOGIN_ERROR_MESSAGES`), including "Too many wrong attempts…" for `auth/too-many-requests`, which is this app's server-side rate limit.
- Show/hide eye inside the password field (`toggleLoginPassword` in `js/modules/ui.js`, lucide eye / eye-off, `aria-label`, `aria-pressed`, 44 px); the login dialog always opens with the password hidden. Fields got `name` and `autocomplete`.
- Separate refactor commit: `index.html` had its opening `<body>`, toast container and confirm dialog twice (duplicate ids); the first copy is removed, pixel-identical before and after.

Verified in Chrome at 1366 px and 344 px with Firebase stubbed and the clock shifted (19 checks): eye toggles and keeps the text; error messages per code; sign-in with the password shown; no warning at 14 minutes; warning with the countdown in the last 30 seconds; Stay keeps the session; one log-out and one message at 15 minutes; a session restored on reload gets the warning and log-out; a session reopened after 20 idle minutes is signed out on load; the password field is empty and hidden afterwards; no page errors.
