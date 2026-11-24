// Partner companies table for students: numbered rows (No. follows the current
// sort and filter), filter, sort by company or city (click the heading again to
// reverse), "show more", email and copy.

const PARTNER_BATCH = 20;
let partnerSearch = "";
let partnerSort = { field: "name", direction: "asc" };
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
  const reverse = partnerSort.field === field && partnerSort.direction === "asc";
  partnerSort = { field, direction: reverse ? "desc" : "asc" };
  renderPartnerList();
}

function showMorePartners() {
  partnersShown += PARTNER_BATCH;
  renderPartnerList();
}

function copyPartnerEmail(button) {
  const email = button.dataset.email;
  navigator.clipboard
    .writeText(email)
    .then(() => showToast("Email copied", `${email} is ready to paste.`, "success"))
    .catch(() => showToast("Could not copy", "Select the email address and copy it yourself.", "warning"));
}

function partnerCellHTML(label, value, extraClass = "") {
  const empty = !value;
  return `<td data-label="${label}" class="${extraClass}${empty ? " empty" : ""}">${empty ? '<span class="none">—</span>' : value}</td>`;
}

function partnerEmailHTML(rawEmail) {
  const email = (rawEmail || "").trim();
  if (!email) return "";
  const safe = escapeHteHtml(email);
  return `<div class="email-cell">
      <a href="mailto:${encodeURI(email)}">${safe}</a>
      <button type="button" class="icon-btn" data-email="${safe}" onclick="copyPartnerEmail(this)" aria-label="Copy email address ${safe}" title="Copy email address">${icon("copy")}</button>
    </div>`;
}

function partnerRowHTML(hte, index) {
  return `
    <tr>
      <td class="no">${index + 1}</td>
      <td class="company">${escapeHteHtml(hte.name)}</td>
      ${partnerCellHTML("City / address", escapeHteHtml(hte.address))}
      ${partnerCellHTML("Contact person", escapeHteHtml(hte.person))}
      ${partnerCellHTML("Phone", escapeHteHtml(hte.contact))}
      ${partnerCellHTML("Email", partnerEmailHTML(hte.email))}
    </tr>`;
}

function renderPartnerSortHeadings() {
  document.querySelectorAll("#partner-table th[data-sort]").forEach((th) => {
    const active = th.dataset.sort === partnerSort.field;
    const ascending = partnerSort.direction === "asc";
    if (active) th.setAttribute("aria-sort", ascending ? "ascending" : "descending");
    else th.removeAttribute("aria-sort");
    th.querySelector(".sort-mark").innerHTML = active ? icon(ascending ? "arrowUp" : "arrowDown") : "";
  });
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
      <div class="mt-4"><button type="button" class="btn btn-secondary" onclick="clearPartnerSearch()">Clear filter</button></div>`;
  }
  return "";
}

function renderPartnerList() {
  const visible = getVisibleHtes(partnerSearch, partnerSort.field, partnerSort.direction);
  const shown = visible.slice(0, partnersShown);
  const state = document.getElementById("partner-state");
  const more = document.getElementById("partner-more");
  const stateHTML = partnerStateHTML(visible.length);

  document.getElementById("partner-list").innerHTML = shown.map(partnerRowHTML).join("");
  document.querySelector(".partner-wrap").classList.toggle("hidden", !shown.length);
  renderPartnerSortHeadings();
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
