// UI helpers: icons, toasts, modals, segmented controls and the admin dashboard

// The few icons the page uses (Lucide shapes), drawn inline so no icon library loads.
const ICON_PATHS = {
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
};

function icon(name, extraClass = "") {
  return `<svg class="icon ${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name]}</svg>`;
}

function renderIcons() {
  document.querySelectorAll("i[data-icon]").forEach((el) => {
    el.outerHTML = icon(el.dataset.icon);
  });
}

// --- TOASTS ---
function showToast(title, message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", type === "error" ? "alert" : "status");
  toast.innerHTML = `<span class="toast-dot"></span><div><h4></h4><p></p></div><button type="button" class="icon-btn" aria-label="Dismiss">${icon("x")}</button>`;
  toast.querySelector("h4").textContent = title;
  toast.querySelector("p").textContent = message;
  toast.querySelector("button").onclick = () => toast.remove();
  document.getElementById("toast-container").appendChild(toast);

  setTimeout(() => {
    toast.classList.add("leaving");
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// --- SEGMENTED CONTROLS ---
// The white pill slides under the pressed button.
function syncSegPill(seg) {
  const pressed = seg.querySelector('button[aria-pressed="true"]');
  const pill = seg.querySelector(".seg-pill");
  pill.style.width = `${pressed.offsetWidth}px`;
  pill.style.transform = `translateX(${pressed.offsetLeft}px)`;
}

function setSegValue(seg, isPressed) {
  seg.querySelectorAll("button").forEach((button) => {
    button.setAttribute("aria-pressed", String(isPressed(button)));
  });
  syncSegPill(seg);
}

function syncAllSegPills() {
  document.querySelectorAll(".seg").forEach(syncSegPill);
}

// --- MODALS ---
let modalOpener = null;

function updateScrollLock() {
  const anyOpen = document.querySelector(".modal-overlay:not(.hidden)");
  document.body.classList.toggle("overflow-hidden", Boolean(anyOpen));
}

function openModal(modal, focusTarget) {
  if (!modal.contains(document.activeElement)) modalOpener = document.activeElement;
  modal.classList.remove("hidden");
  updateScrollLock();
  modal.querySelectorAll(".seg").forEach(syncSegPill);
  (focusTarget || modal.querySelector("input:not([type=hidden]), button")).focus();
}

function hideModal(modal) {
  modal.classList.add("hidden");
  updateScrollLock();
}

function closeModals() {
  DOM.modals.forEach(hideModal);
  if (modalOpener && document.contains(modalOpener)) modalOpener.focus();
  modalOpener = null;
}

// Escape or a click on the backdrop closes the top dialog. The idle warning
// stays until the admin answers it.
function closeTopModal() {
  const open = (id) => !document.getElementById(id).classList.contains("hidden");
  if (open("idle-modal")) return;
  if (open("confirm-modal")) closeConfirm();
  else if (open("hte-edit-modal")) closeHteEditModal();
  else closeModals();
}

function setupModalDismissal() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeTopModal();
  });
  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeTopModal();
    });
  });
}

// --- CONFIRMATION DIALOG ---
let pendingConfirmAction = null;

function showConfirm(title, message, confirmText, actionCallback) {
  document.getElementById("confirm-title").innerText = title;
  document.getElementById("confirm-message").innerText = message;
  document.getElementById("confirm-btn-text").innerText = confirmText;
  pendingConfirmAction = actionCallback;
  const modal = document.getElementById("confirm-modal");
  modal.classList.remove("hidden");
  updateScrollLock();
  modal.querySelector("button").focus();
}

function closeConfirm() {
  hideModal(document.getElementById("confirm-modal"));
  pendingConfirmAction = null;
}

function executeConfirm() {
  if (pendingConfirmAction) pendingConfirmAction();
  closeConfirm();
}

// --- SIGN-IN ---
function openLoginModal() {
  if (auth && auth.currentUser) {
    openAdminDashboard();
    return;
  }
  DOM.loginError.classList.add("hidden");
  DOM.loginPass.value = "";
  DOM.loginUser.value = "";
  setLoginPasswordVisible(false);
  document.getElementById("btn-login-submit").textContent = "Sign in";
  openModal(DOM.modals[0], DOM.loginUser);
}

// Show/hide the login password, so an admin can check what they typed
// before signing in (a wrong password counts towards Firebase's lock).
function setLoginPasswordVisible(visible) {
  const button = document.getElementById("btn-toggle-password");
  const label = visible ? "Hide password" : "Show password";
  DOM.loginPass.type = visible ? "text" : "password";
  button.setAttribute("aria-pressed", String(visible));
  button.setAttribute("aria-label", label);
  button.title = label;
  button.innerHTML = icon(visible ? "eyeOff" : "eye");
}

function toggleLoginPassword() {
  setLoginPasswordVisible(DOM.loginPass.type === "password");
}

// --- ADMIN DASHBOARD ---
function switchAdminPanel(panel) {
  setSegValue(document.getElementById("admin-seg"), (button) => button.dataset.panel === panel);
  ["links", "partners"].forEach((name) => {
    document.getElementById(`admin-panel-${name}`).classList.toggle("hidden", name !== panel);
  });
}

function openAdminDashboard() {
  DOM.adminForms.innerHTML = Object.keys(defaultLinks)
    .map((key) => {
      const value = appLinks[key] && appLinks[key] !== "#" ? appLinks[key] : "";
      return `
        <div class="span-6 lg-span-4">
          <label class="field-label" for="input-${key}">${linkLabels[key] || key}</label>
          <input type="text" id="input-${key}" value="${escapeHteHtml(value)}" class="field" placeholder="https://…" />
        </div>`;
    })
    .join("");

  renderHteTables();
  openModal(DOM.modals[1], document.querySelector("#admin-seg button"));
}
