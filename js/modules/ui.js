// UI Modules - Modals, Toasts, and Dialog Management

// --- CUSTOM TOAST NOTIFICATION SYSTEM ---
function showToast(title, message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");

  let icon = "";
  let borderClass = "";

  if (type === "success") {
    icon =
      '<i data-lucide="check-circle" class="w-5 h-5 text-emerald-500"></i>';
    borderClass = "border-emerald-500";
  } else if (type === "error") {
    icon = '<i data-lucide="alert-circle" class="w-5 h-5 text-red-500"></i>';
    borderClass = "border-red-500";
  } else if (type === "warning") {
    icon =
      '<i data-lucide="alert-triangle" class="w-5 h-5 text-amber-500"></i>';
    borderClass = "border-amber-500";
  } else {
    icon = '<i data-lucide="info" class="w-5 h-5 text-blue-500"></i>';
    borderClass = "border-blue-500";
  }

  toast.className = `bg-white border-l-4 ${borderClass} p-3 sm:p-4 rounded shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-start gap-3 w-[280px] sm:w-[350px] transform transition-all duration-300 translate-x-[120%] opacity-0 relative overflow-hidden pointer-events-auto`;
  toast.innerHTML = `
      <div class="shrink-0 mt-0.5">${icon}</div>
      <div class="flex-grow pr-4">
          <h4 class="text-sm font-bold text-gray-800 leading-tight">${title}</h4>
          <p class="text-xs text-gray-500 mt-1 leading-relaxed">${message}</p>
      </div>
      <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors p-1" onclick="this.parentElement.remove()">
          <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
  `;

  container.appendChild(toast);
  lucide.createIcons();

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove("translate-x-[120%]", "opacity-0");
  });

  // Auto remove
  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.add("translate-x-[120%]", "opacity-0");
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 300);
    }
  }, 4000);
}

// --- CUSTOM CONFIRMATION MODAL SYSTEM ---
let pendingConfirmAction = null;

function showConfirm(title, message, confirmText, actionCallback) {
  document.getElementById("confirm-title").innerText = title;
  document.getElementById("confirm-message").innerText = message;
  document.getElementById("confirm-btn-text").innerText = confirmText;

  pendingConfirmAction = actionCallback;
  const modal = document.getElementById("confirm-modal");
  modal.classList.remove("hidden");

  // Small pop-in animation
  const modalBox = modal.querySelector("div");
  modalBox.classList.remove("scale-95", "opacity-0");
  modalBox.classList.add("scale-100", "opacity-100");
}

function closeConfirm() {
  const modal = document.getElementById("confirm-modal");
  const modalBox = modal.querySelector("div");
  modalBox.classList.remove("scale-100", "opacity-100");
  modalBox.classList.add("scale-95", "opacity-0");
  setTimeout(() => {
    modal.classList.add("hidden");
    pendingConfirmAction = null;
  }, 150);
}

function executeConfirm() {
  if (pendingConfirmAction) pendingConfirmAction();
  closeConfirm();
}

// --- MODAL MANAGEMENT ---
function closeModals() {
  DOM.modals.forEach((modal) => {
    if (modal) modal.classList.add("hidden");
  });
}

function openLoginModal() {
  if (auth && auth.currentUser) {
    openAdminDashboard();
  } else {
    DOM.modals[0].classList.remove("hidden"); // Login Modal
    DOM.loginError.classList.add("hidden");
    DOM.loginPass.value = "";
    DOM.loginUser.value = "";
    document.getElementById("btn-login-submit").innerHTML = "Login";
  }
}

function openHteModal() {
  DOM.modals[2].classList.remove("hidden"); // HTE View Modal
  renderHteTables();
}

function openAdminDashboard() {
  DOM.adminForms.innerHTML = "";
  Object.keys(defaultLinks).forEach((key) => {
    const val = appLinks[key] || "";
    const label = linkLabels[key] || key;

    DOM.adminForms.innerHTML += `
                    <div>
                        <label class="block text-[10px] font-semibold text-gray-500 mb-1 uppercase">${label}</label>
                        <input type="text" id="input-${key}" value="${val}" class="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-gray-500 text-[11px] sm:text-xs text-gray-700" placeholder="https://...">
                    </div>
                `;
  });

  renderHteTables();
  DOM.modals[1].classList.remove("hidden"); // Admin Modal
}
