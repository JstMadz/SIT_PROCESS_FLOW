// Main Application Initialization
// DOM cache and initialization logic

// --- DOM ELEMENT CACHE ---
const DOM = {
  modals: [
    document.getElementById("login-modal"),
    document.getElementById("admin-modal"),
    document.getElementById("hte-view-modal"),
  ],
  loginUser: document.getElementById("login-user"),
  loginPass: document.getElementById("login-pass"),
  loginError: document.getElementById("login-error"),
  adminForms: document.getElementById("admin-forms"),
  viewTbody: document.getElementById("hte-view-tbody"),
  emptyState: document.getElementById("hte-view-empty"),
  adminTbody: document.getElementById("admin-hte-tbody"),
  csvUpload: document.getElementById("hte-csv-upload"),
  manualForm: document.getElementById("form-hte-manual"),
};

// Initialize the application
function initializeApp() {
  console.log("Initializing application...");

  // Initialize Firebase
  initializeFirebase();

  // Initialize Lucide icons
  lucide.createIcons();

  // Fetch public data ONLY ONCE when the website starts loading
  loadCloudLinks();
  loadHteData();

  // Setup auth state listener
  setupAuthStateListener();

  console.log("Application initialized successfully!");
}

// Run initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initializeApp);
