// Firebase Authentication
// Handles user login, logout, and auth state management

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
    startInactivityTracking();
  } catch (error) {
    console.error("Login Error:", error);
    DOM.loginError.innerText = "Invalid credentials. Try again.";
    DOM.loginError.classList.remove("hidden");
    loginBtn.innerHTML = "Login";
  }
}

async function logoutAdmin() {
  if (auth) {
    await auth.signOut();
    closeModals();
    stopInactivityTracking();
    showToast(
      "Logged Out",
      "You have been securely signed out of the system.",
      "info",
    );
  }
}

function setupAuthStateListener() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("Admin session active.");
    } else {
      console.log("Admin session inactive.");
    }
  });
}
