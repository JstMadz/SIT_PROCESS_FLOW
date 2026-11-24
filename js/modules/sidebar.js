// The sidebar on computers (corporate theme, owner-approved 2026-11-24): the three
// phases in words, each opening to its numbered steps, and a menu search. The
// current item is simply filled cardinal: no sliding highlight (owner, 2026-11-24:
// the motion was dizzying). Phones use the bottom tab bar.

const MENU = [
  { id: "pre-deployment", label: "Pre-Deployment" },
  { id: "during-training", label: "During Training" },
  { id: "post-training", label: "Post-Training" },
];

let activeTab = "pre-deployment";
let activeStep = null;
let menuQuery = "";
const openGroups = new Set(["pre-deployment"]);

// Each phase's steps come from the page itself, so the menu never drifts from the content.
function menuSteps(tabId) {
  return [...document.querySelectorAll(`#tab-${tabId} .step-card`)].map((card, index) => ({
    id: card.id,
    label: `${index + 1}. ${card.querySelector("h2").textContent.trim()}`,
  }));
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
  const open = hasSub && (openGroups.has(item.id) || match.stepHit);
  const current = activeTab === item.id;
  const highlighted = current && !(open && match.steps.some((step) => step.id === activeStep));
  const sub = hasSub
    ? `<div class="side-sub${open ? " open" : ""}" id="sub-${item.id}" ${open ? "" : "inert"}><ul>${match.steps
        .map(
          (step) =>
            `<li><button type="button" class="side-step" onclick="goToStep('${item.id}', '${step.id}')" ${
              step.id === activeStep ? 'aria-current="step" data-current' : ""
            }>${escapeHteHtml(step.label)}</button></li>`,
        )
        .join("")}</ul></div>`
    : "";
  return `
    <li>
      <button type="button" class="side-item" onclick="pickMenu('${item.id}')"
        ${current ? 'aria-current="page"' : ""} ${highlighted ? "data-current" : ""}
        ${hasSub ? `aria-expanded="${open}" aria-controls="sub-${item.id}"` : ""}>${item.label}</button>
      ${sub}
    </li>`;
}

function renderSidebar() {
  const forms = menuMatch({ label: "Forms Repository" }).shown
    ? '<li><a href="#" data-link="downloadForms" target="_blank" rel="noopener noreferrer" class="side-item">Forms Repository</a></li>'
    : "";
  document.getElementById("side-list").innerHTML =
    MENU.map(menuItemHTML).join("") + forms;
  applyLinksToDOM();
}

function pickMenu(tabId) {
  if (activeTab === tabId && !activeStep) {
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
  card.scrollIntoView();
  card.focus({ preventScroll: true });
}

function filterMenu(value) {
  menuQuery = value;
  renderSidebar();
}

function setupSidebar() {
  renderSidebar();
}
