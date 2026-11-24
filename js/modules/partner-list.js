// Partner companies list for students: search, sort, "show more", and rows
// that open in place to show who to contact.

const PARTNER_BATCH = 20;
let partnerSearch = "";
let partnerSort = "name";
let partnersShown = PARTNER_BATCH;

function openHteModal() {
  const search = document.getElementById("partner-search");
  // On touch screens, focusing the search box would cover the list with the keyboard.
  const focusTarget = matchMedia("(pointer: fine)").matches ? search : null;
  renderPartnerList();
  openModal(DOM.modals[2], focusTarget);
}

function setPartnerSearch(value) {
  partnerSearch = value;
  partnersShown = PARTNER_BATCH;
  renderPartnerList();
}

function clearPartnerSearch() {
  const search = document.getElementById("partner-search");
  search.value = "";
  setPartnerSearch("");
  search.focus();
}

function setPartnerSort(field) {
  partnerSort = field;
  setSegValue(document.getElementById("partner-sort"), (button) => button.dataset.sort === field);
  renderPartnerList();
}

function showMorePartners() {
  partnersShown += PARTNER_BATCH;
  renderPartnerList();
}

function togglePartnerRow(button) {
  const open = button.getAttribute("aria-expanded") !== "true";
  const panel = document.getElementById(button.getAttribute("aria-controls"));
  button.setAttribute("aria-expanded", String(open));
  panel.classList.toggle("open", open);
  panel.inert = !open;
}

function copyPartnerEmail(button) {
  const email = button.dataset.email;
  navigator.clipboard
    .writeText(email)
    .then(() => showToast("Email copied", `${email} is ready to paste.`, "success"))
    .catch(() => showToast("Could not copy", "Select the email address and copy it yourself.", "warning"));
}

function partnerDetailsHTML(hte) {
  const email = hte.email ? hte.email.trim() : "";
  const rows = [
    ["Contact person", escapeHteHtml(hte.person)],
    ["Phone", escapeHteHtml(hte.contact)],
    [
      "Email",
      email &&
        `<a href="mailto:${encodeURIComponent(email)}">${escapeHteHtml(email)}</a>` +
          `<button type="button" class="link-btn" data-email="${escapeHteHtml(email)}" onclick="copyPartnerEmail(this)">Copy</button>`,
    ],
    ["Address", escapeHteHtml(hte.address)],
  ].filter(([, value]) => value);

  if (!rows.length) {
    return '<p class="details text-secondary">No contact details yet. Ask your SIT coordinator.</p>';
  }
  return `<dl class="details">${rows.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl>`;
}

function partnerRowHTML(hte) {
  const panelId = `partner-${escapeHteHtml(hte.id)}`;
  const address = escapeHteHtml(hte.address);
  const person = escapeHteHtml(hte.person);
  return `
    <li>
      <button type="button" class="row" aria-expanded="false" aria-controls="${panelId}" onclick="togglePartnerRow(this)">
        <span class="row-main">
          <span class="row-title">${escapeHteHtml(hte.name)}</span>
          ${address ? `<span class="row-sub">${address}</span>` : ""}
        </span>
        ${person ? `<span class="row-meta">${person}</span>` : ""}
        ${icon("chevron", "chevron")}
      </button>
      <div class="row-detail" id="${panelId}" inert><div>${partnerDetailsHTML(hte)}</div></div>
    </li>`;
}

function partnerStateHTML(visibleCount) {
  if (hteLoadState === "loading") return "Loading the partner list…";
  if (hteLoadState === "error") {
    return "<strong>The list could not be loaded</strong>Check your internet connection, then reload the page.";
  }
  if (!hteList.length) {
    return "<strong>No partner companies yet</strong>Your SIT coordinator hasn't added any. You can still apply to a company of your own choice (Step 3, Option B).";
  }
  if (!visibleCount) {
    return `<strong>No company matches “${escapeHteHtml(partnerSearch.trim())}”</strong>Try a shorter word or check the spelling.
      <div class="mt-4"><button type="button" class="btn btn-secondary" onclick="clearPartnerSearch()">Clear search</button></div>`;
  }
  return "";
}

function renderPartnerList() {
  const visible = getVisibleHtes(partnerSearch, partnerSort);
  const shown = visible.slice(0, partnersShown);
  const list = document.getElementById("partner-list");
  const state = document.getElementById("partner-state");
  const more = document.getElementById("partner-more");
  const stateHTML = partnerStateHTML(visible.length);

  list.innerHTML = shown.map(partnerRowHTML).join("");
  list.classList.toggle("hidden", !shown.length);
  state.innerHTML = stateHTML;
  state.classList.toggle("hidden", !stateHTML);

  const noun = (count) => `${count} ${count === 1 ? "company" : "companies"}`;
  let count = "";
  if (hteLoadState === "ready" && hteList.length) {
    count = partnerSearch.trim() ? `${noun(visible.length)} of ${hteList.length} match` : noun(hteList.length);
    if (shown.length < visible.length) count += ` · showing ${shown.length}`;
  }
  document.getElementById("partner-count").textContent = count;

  const remaining = visible.length - shown.length;
  more.classList.toggle("hidden", remaining <= 0);
  more.textContent = `Show ${Math.min(PARTNER_BATCH, remaining)} more`;
}
