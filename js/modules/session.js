// Admin Session Management - log out after 15 idle minutes, with a 30-second
// "Are you still there?" countdown first. Idle time is measured from timestamps
// shared across tabs in localStorage, so a background tab (where browsers delay
// timers) or a session reopened later logs out as soon as it is checked.

const IDLE_LIMIT_MS = 15 * 60 * 1000;
const IDLE_WARNING_MS = 30 * 1000;
const IDLE_CHECK_MS = 1000;
const LAST_ACTIVITY_KEY = "sit-process-flow:lastActivity";
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "wheel"];

let idleCheckTimer = null;
let lastActivity = 0;
let isIdleWarningOpen = false;

function readStoredActivity() {
  try {
    return Number(localStorage.getItem(LAST_ACTIVITY_KEY)) || 0;
  } catch {
    return 0;
  }
}

function storeActivity(timestamp) {
  try {
    if (timestamp) localStorage.setItem(LAST_ACTIVITY_KEY, String(timestamp));
    else localStorage.removeItem(LAST_ACTIVITY_KEY);
  } catch {
    // storage unavailable: idle time is tracked in this tab only
  }
}

function recordActivity() {
  // Once the countdown shows, only "Stay signed in" keeps the session.
  if (isIdleWarningOpen) return;
  const now = Date.now();
  if (now - lastActivity > 1000) storeActivity(now);
  lastActivity = now;
}

function showIdleWarning(secondsLeft) {
  document.getElementById("idle-countdown").textContent = secondsLeft;
  if (isIdleWarningOpen) return;
  isIdleWarningOpen = true;
  document.getElementById("idle-modal").classList.remove("hidden");
  document.getElementById("btn-idle-stay").focus();
}

function hideIdleWarning() {
  isIdleWarningOpen = false;
  document.getElementById("idle-modal").classList.add("hidden");
}

function stayLoggedIn() {
  lastActivity = Date.now();
  storeActivity(lastActivity);
  hideIdleWarning();
}

function logoutAfterInactivity() {
  // stop first, or the next check would start a second log-out while this one waits for Firebase
  stopInactivityTracking();
  logoutAdmin(`You were logged out after ${IDLE_LIMIT_MS / 60000} minutes of inactivity.`);
}

function checkIdle() {
  const idleFor = Date.now() - Math.max(lastActivity, readStoredActivity());
  if (idleFor >= IDLE_LIMIT_MS) {
    logoutAfterInactivity();
  } else if (idleFor >= IDLE_LIMIT_MS - IDLE_WARNING_MS) {
    showIdleWarning(Math.ceil((IDLE_LIMIT_MS - idleFor) / 1000));
  } else if (isIdleWarningOpen) {
    // another tab confirmed the admin is still there
    hideIdleWarning();
  }
}

// Runs whenever Firebase reports a signed-in admin, including a session it
// restores on page load, so a reload can't skip the idle log-out.
function startInactivityTracking() {
  if (idleCheckTimer) return;
  const stored = readStoredActivity();
  if (stored && Date.now() - stored >= IDLE_LIMIT_MS) {
    logoutAfterInactivity();
    return;
  }
  lastActivity = Date.now();
  storeActivity(lastActivity);
  ACTIVITY_EVENTS.forEach((evt) =>
    document.addEventListener(evt, recordActivity, { capture: true, passive: true }),
  );
  idleCheckTimer = setInterval(checkIdle, IDLE_CHECK_MS);
}

function stopInactivityTracking() {
  hideIdleWarning();
  storeActivity(0);
  if (!idleCheckTimer) return;
  clearInterval(idleCheckTimer);
  idleCheckTimer = null;
  ACTIVITY_EVENTS.forEach((evt) => document.removeEventListener(evt, recordActivity, { capture: true }));
}
