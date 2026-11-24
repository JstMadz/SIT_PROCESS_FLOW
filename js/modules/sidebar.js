// The glass sidebar (bidDocsBuilder's design, dev-playbook calm-luxury-ui.md §6):
// the three phases with their steps as submenus, a menu search, a pill that
// slides to the current item, and a collapsed icon rail (edge handle or Ctrl+\,
// remembered). Phones use the bottom tab bar instead.

const MENU = [
  { id: "pre-deployment", label: "Pre-Deployment", icon: "clipboard" },
  { id: "during-training", label: "During Training", icon: "clock" },
  { id: "post-training", label: "Post-Training", icon: "graduation" },
];
const RAIL_KEY = "sit-process-flow:sidebar-rail";
const RAIL_SHORTCUT = /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘\\" : "Ctrl+\\";

let activeTab = "pre-deployment";
let activeStep = null;
let menuQuery = "";
const openGroups = new Set(["pre-deployment"]);

// Each phase's steps come from the page itself, so the menu never drifts from the content.
function menuSteps(tabId) {
  return [...document.querySelectorAll(`#tab-${tabId} .step-card`)].map((card) => ({
    id: card.id,
    label: card.querySelector("h2").textContent.trim(),
  }));
}

function isRail() {
  return document.documentElement.classList.contains("rail");
}

function menuMatch(item) {
  const query = menuQuery.trim().toLowerCase();
  const hit = (label) => !query || label.toLowerCase().includes(query);
  const steps = item.id ? menuSteps(item.id) : [];
  const hasSub = steps.length > 1;
  if (hit(item.label)) return { shown: true, steps, hasSub, stepHit: false };
  const kept = steps.filter((step) => hit(step.label));
  return { shown: kept.length > 0, steps: kept, hasSub, stepHit: kept.length > 0 };
}

function menuItemHTML(item) {
  const match = menuMatch(item);
  if (!match.shown) return "";
  const { hasSub } = match;
  const open = hasSub && !isRail() && (openGroups.has(item.id) || match.stepHit);
  const current = activeTab === item.id;
  const pillHere = current && !(open && match.steps.some((step) => step.id === activeStep));
  const sub = hasSub
    ? `<div class="side-sub${open ? " open" : ""}" id="sub-${item.id}" ${open ? "" : "inert"}><ul>${match.steps
        .map(
          (step) =>
            `<li><button type="button" class="side-step" onclick="goToStep('${item.id}', '${step.id}')" ${
              step.id === activeStep ? 'aria-current="step" data-pill' : ""
            }>${escapeHteHtml(step.label)}</button></li>`,
        )
        .join("")}</ul></div>`
    : "";
  return `
    <li>
      <button type="button" class="side-item" onclick="pickMenu('${item.id}')" aria-label="${item.label}"
        ${current ? 'aria-current="page"' : ""} ${pillHere ? "data-pill" : ""}
        ${hasSub ? `aria-expanded="${open}" aria-controls="sub-${item.id}"` : ""}>
        ${icon(item.icon, "side-icon")}<span class="side-label">${item.label}</span>
        ${hasSub ? icon("chevron", "side-chev") : ""}<span class="side-tip" aria-hidden="true">${item.label}</span>
      </button>
      ${sub}
    </li>`;
}

function renderSidebar() {
  const list = document.getElementById("side-list");
  list.innerHTML =
    '<li class="side-pill" aria-hidden="true"></li>' +
    MENU.map(menuItemHTML).join("") +
    (menuMatch({ label: "Forms repository" }).shown ? formsMenuItemHTML() : "");
  placeSidePill();
  applyLinksToDOM();
}

function formsMenuItemHTML() {
  return `<li><a href="#" data-link="downloadForms" target="_blank" rel="noopener noreferrer" class="side-item" aria-label="Forms repository">
      ${icon("folder", "side-icon")}<span class="side-label">Forms repository</span><span class="side-tip" aria-hidden="true">Forms repository</span></a></li>`;
}

function placeSidePill() {
  const list = document.getElementById("side-list");
  const pill = list.querySelector(".side-pill");
  const target = list.querySelector("[data-pill]");
  pill.hidden = !target;
  if (!target) return;
  pill.style.transform = `translateY(${target.offsetTop}px)`;
  pill.style.height = `${target.offsetHeight}px`;
}

function pickMenu(tabId) {
  if (isRail()) {
    setRail(false);
    openGroups.add(tabId);
  } else if (activeTab === tabId && !activeStep) {
    if (openGroups.has(tabId)) openGroups.delete(tabId);
    else openGroups.add(tabId);
  } else {
    openGroups.add(tabId);
  }
  switchTab(tabId);
}

function goToStep(tabId, stepId) {
  switchTab(tabId);
  activeStep = stepId;
  renderSidebar();
  const card = document.getElementById(stepId);
  card.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  card.focus({ preventScroll: true });
}

function filterMenu(value) {
  menuQuery = value;
  renderSidebar();
}

function setRail(rail) {
  document.documentElement.classList.toggle("rail", rail);
  try {
    localStorage.setItem(RAIL_KEY, rail ? "1" : "0");
  } catch {
    // storage blocked: the choice lasts for this visit
  }
  const label = rail ? "Show the menu" : "Hide the menu";
  const handle = document.getElementById("side-handle");
  handle.setAttribute("aria-label", label);
  handle.title = `${label} (${RAIL_SHORTCUT})`;
  renderSidebar();
}

function toggleRail() {
  setRail(!isRail());
}

function setupSidebar() {
  let stored = false;
  try {
    stored = localStorage.getItem(RAIL_KEY) === "1";
  } catch {
    // storage blocked: start open
  }
  setRail(stored);
  document.addEventListener("keydown", (event) => {
    if (event.key === "\\" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      toggleRail();
    }
  });
  // The pill follows its item while a submenu opens or closes.
  new ResizeObserver(placeSidePill).observe(document.getElementById("side-list"));
}
