// Training phase switcher, shared by the sidebar and the phone tab bar

function switchTab(tabId) {
  activeTab = tabId;
  activeStep = null;
  document.querySelectorAll(".tab-content").forEach((section) => {
    section.classList.toggle("active", section.id === `tab-${tabId}`);
  });
  document.querySelectorAll(".tabbar [data-tab]").forEach((button) => {
    if (button.dataset.tab === tabId) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  renderSidebar();
  window.scrollTo({ top: 0 });
}
