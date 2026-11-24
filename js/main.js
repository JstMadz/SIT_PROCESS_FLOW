// Application entry point: DOM cache and start-up

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
  adminList: document.getElementById("admin-hte-list"),
  csvUpload: document.getElementById("hte-csv-upload"),
  manualForm: document.getElementById("form-hte-manual"),
  editForm: document.getElementById("form-hte-edit"),
};

function initializeApp() {
  initializeFirebase();
  renderIcons();
  setupTheme();
  setupModalDismissal();
  syncAllSegPills();
  window.addEventListener("resize", syncAllSegPills);

  // Public data is fetched once, when the page opens.
  loadCloudLinks();
  loadHteData();

  setupAuthStateListener();
}

document.addEventListener("DOMContentLoaded", initializeApp);
