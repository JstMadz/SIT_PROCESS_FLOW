// Training phase switcher (Pre-deployment / During training / Post-training)

function switchTab(tabId) {
  document.querySelectorAll(".tab-content").forEach((section) => {
    section.classList.toggle("active", section.id === `tab-${tabId}`);
  });
  setSegValue(document.getElementById("phase-seg"), (button) => button.id === `btn-${tabId}`);
  window.scrollTo({ top: 0 });
}
