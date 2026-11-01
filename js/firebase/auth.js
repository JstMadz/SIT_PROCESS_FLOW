// Firebase Authentication
// Handles user login, logout, and auth state management

// Plain-language sign-in errors. Firebase Auth throttles repeated wrong passwords
// itself (auth/too-many-requests); that is this app's server-side rate limit.
const LOGIN_ERROR_MESSAGES = {
  "auth/invalid-credential": "Wrong email or password.",
  "auth/user-not-found": "Wrong email or password.",
  "auth/wrong-password": "Wrong email or password.",
  "auth/invalid-email": "That email address is not valid.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/too-many-requests": "Too many wrong attempts. Sign-in is paused for a while; try again later.",
  "auth/network-request-failed": "Could not reach the sign-in service. Check your internet connection.",
};

async function attemptLogin() {
  const email = DOM.loginUser.value.trim();
  const pass = DOM.loginPass.value;
  const loginBtn = document.getElementById("btn-login-submit");

  if (!email || !pass) {
    DOM.loginError.innerText = "Please enter both email and password.";
    DOM.loginError.classList.remove("hidden");
    return;
  }

  try {
    loginBtn.innerHTML =
      '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Authenticating...';
    lucide.createIcons();
    DOM.loginError.classList.add("hidden");

    await auth.signInWithEmailAndPassword(email, pass);

    closeModals();
    openAdminDashboard();
    loginBtn.innerHTML = "Login";

    showToast(
      "Authentication Successful",
      "Welcome to the Admin Dashboard.",
      "success",
    );
  } catch (error) {
    console.error("Login Error:", error);
    DOM.loginError.innerText = LOGIN_ERROR_MESSAGES[error.code] || "Sign-in failed. Try again.";
    DOM.loginError.classList.remove("hidden");
    loginBtn.innerHTML = "Login";
  }
}

// reason: shown instead of the usual message (e.g. the idle log-out)
async function logoutAdmin(reason) {
  if (auth) {
    await auth.signOut();
    closeModals();
    stopInactivityTracking();
    showToast(
      "Logged Out",
      reason || "You have been securely signed out of the system.",
      reason ? "warning" : "info",
    );
  }
}

function setupAuthStateListener() {
  auth.onAuthStateChanged((user) => {
    if (user) startInactivityTracking();
    else stopInactivityTracking();
  });
}
