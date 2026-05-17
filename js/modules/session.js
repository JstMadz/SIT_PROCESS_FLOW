// Admin Session Management - Inactivity Tracking

let inactivityTimer;
const INACTIVITY_LIMIT = 2 * 60 * 1000; // 2 minutes in milliseconds

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    showToast(
      "Session Expired",
      "Admin session automatically logged out due to inactivity.",
      "warning",
    );
    logoutAdmin();
  }, INACTIVITY_LIMIT);
}

function startInactivityTracking() {
  ["mousemove", "mousedown", "keydown", "touchstart", "scroll"].forEach(
    (evt) => {
      document.addEventListener(evt, resetInactivityTimer, true);
    },
  );
  resetInactivityTimer();
}

function stopInactivityTracking() {
  clearTimeout(inactivityTimer);
  ["mousemove", "mousedown", "keydown", "touchstart", "scroll"].forEach(
    (evt) => {
      document.removeEventListener(evt, resetInactivityTimer, true);
    },
  );
}
