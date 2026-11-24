// HTE (Host Training Establishment) data: shared search and sort, the admin
// list (selection, pagination, edit, delete) and CSV/TSV upload.
// The students' list is in partner-list.js.

function escapeHteHtml(value) {
  return String(value || "").replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character],
  );
}

function getVisibleHtes(searchTerm, sortField, direction = "asc") {
  const search = searchTerm.trim().toLowerCase();
  return hteList
    .filter((hte) => {
      if (!search) return true;
      return [hte.name, hte.address, hte.contact, hte.email, hte.person]
        .join(" ")
        .toLowerCase()
        .includes(search);
    })
    .sort(
      (left, right) =>
        String(left[sortField] || "").toLowerCase().localeCompare(String(right[sortField] || "").toLowerCase()) *
        (direction === "asc" ? 1 : -1),
    );
}

function getAdminHtes() {
  return getVisibleHtes(hteSearchTerm, hteSortField);
}

function updateHteSearch(value) {
  hteSearchTerm = value;
  currentPageAdmin = 1;
  renderAdminList();
}

function updateHteSort(field) {
  hteSortField = field;
  currentPageAdmin = 1;
  renderAdminList();
}

function adminRowHTML(hte) {
  const id = escapeHteHtml(hte.id);
  const name = escapeHteHtml(hte.name);
  const subtitle = [hte.address, hte.person].filter(Boolean).map(escapeHteHtml).join(" · ");
  return `
    <li>
      <div class="row">
        <input type="checkbox" class="check" onchange="toggleHteSelection('${id}', this.checked)" ${selectedHteIds.has(hte.id) ? "checked" : ""} aria-label="Select ${name}" />
        <span class="row-main">
          <span class="row-title">${name}</span>
          ${subtitle ? `<span class="row-sub">${subtitle}</span>` : ""}
        </span>
        <button type="button" class="btn btn-ghost btn-sm" onclick="openHteEditModal('${id}')" aria-label="Edit ${name}">Edit</button>
        <button type="button" class="btn btn-danger btn-sm" onclick="promptDeleteHte('${id}')" aria-label="Delete ${name}">Delete</button>
      </div>
    </li>`;
}

function adminStateHTML(visibleCount) {
  if (hteLoadState === "loading") return "Loading…";
  if (hteLoadState === "error") return "<strong>The list could not be loaded</strong>Check the internet connection, then reload the page.";
  if (!hteList.length) return "<strong>No companies yet</strong>Add one above, or upload a CSV file.";
  if (!visibleCount) return "<strong>No company matches the search</strong>";
  return "";
}

function renderAdminList() {
  const visible = getAdminHtes();
  const totalPages = Math.ceil(visible.length / itemsPerPage) || 1;
  if (currentPageAdmin > totalPages) currentPageAdmin = totalPages;
  const start = (currentPageAdmin - 1) * itemsPerPage;
  const stateHTML = adminStateHTML(visible.length);

  DOM.adminList.innerHTML = stateHTML
    ? `<li class="list-state">${stateHTML}</li>`
    : visible.slice(start, start + itemsPerPage).map(adminRowHTML).join("");

  document.getElementById("admin-pagination").classList.toggle("hidden", !visible.length);
  document.getElementById("admin-page-info").textContent =
    `Page ${currentPageAdmin} of ${totalPages} · ${visible.length} ${visible.length === 1 ? "company" : "companies"}`;
  document.getElementById("btn-admin-prev").disabled = currentPageAdmin === 1;
  document.getElementById("btn-admin-next").disabled = currentPageAdmin === totalPages;

  const selectAll = document.getElementById("select-all-htes");
  selectAll.checked = visible.length > 0 && visible.every((hte) => selectedHteIds.has(hte.id));
  selectAll.indeterminate = !selectAll.checked && visible.some((hte) => selectedHteIds.has(hte.id));
  document.getElementById("delete-selected-hte").disabled = selectedHteIds.size === 0;
  document.getElementById("delete-all-hte").disabled = hteList.length === 0;
}

// Called after every change to hteList, so both lists stay current.
function renderHteTables() {
  renderPartnerList();
  renderAdminList();
}

function toggleHteSelection(id, checked) {
  if (checked) selectedHteIds.add(id);
  else selectedHteIds.delete(id);
  renderAdminList();
}

function toggleAllHtes(checked) {
  getAdminHtes().forEach((hte) => {
    if (checked) selectedHteIds.add(hte.id);
    else selectedHteIds.delete(hte.id);
  });
  renderAdminList();
}

function changeAdminPage(direction) {
  currentPageAdmin += direction;
  renderAdminList();
}

function promptDeleteHte(id) {
  showConfirm(
    "Remove Partner",
    "Are you sure you want to delete this Host Training Establishment? This will permanently remove it from the list.",
    "Delete Entry",
    () => deleteHte(id),
  );
}

function promptDeleteSelectedHtes() {
  if (!selectedHteIds.size) return;
  showConfirm(
    "Remove selected partners",
    `Are you sure you want to permanently delete ${selectedHteIds.size} selected HTE partners?`,
    "Delete selected",
    () => deleteHtes([...selectedHteIds]),
  );
}

function promptDeleteAllHtes() {
  if (!hteList.length) return;
  showConfirm(
    "Delete all partners",
    `Are you sure you want to permanently delete all ${hteList.length} HTE partners?`,
    "Delete all",
    () => deleteHtes(hteList.map((hte) => hte.id)),
  );
}

function openHteEditModal(id) {
  const hte = hteList.find((entry) => entry.id === id);
  if (!hte) return;
  document.getElementById("edit-hte-id").value = hte.id;
  document.getElementById("edit-hte-name").value = hte.name || "";
  document.getElementById("edit-hte-address").value = hte.address || "";
  document.getElementById("edit-hte-contact").value = hte.contact || "";
  document.getElementById("edit-hte-email").value = hte.email || "";
  document.getElementById("edit-hte-person").value = hte.person || "";
  const modal = document.getElementById("hte-edit-modal");
  modal.classList.remove("hidden");
  document.getElementById("edit-hte-name").focus();
}

function closeHteEditModal() {
  hideModal(document.getElementById("hte-edit-modal"));
}

async function saveHteEdit() {
  const id = document.getElementById("edit-hte-id").value;
  const updates = {
    name: document.getElementById("edit-hte-name").value.trim(),
    address: document.getElementById("edit-hte-address").value.trim(),
    contact: document.getElementById("edit-hte-contact").value.trim(),
    email: document.getElementById("edit-hte-email").value.trim(),
    person: document.getElementById("edit-hte-person").value.trim(),
  };
  if (!updates.name)
    return showToast("Validation Error", "Name of HTE is required!", "warning");
  try {
    await updateHte(id, updates);
    const index = hteList.findIndex((hte) => hte.id === id);
    if (index !== -1) hteList[index] = { ...hteList[index], ...updates };
    closeHteEditModal();
    renderHteTables();
    showToast("HTE Updated", "Partner details have been saved.", "success");
  } catch (error) {
    showToast("Update Error", "Failed: " + error.message, "error");
  }
}

async function processCsvUpload() {
  console.log("--- TRACE: processCsvUpload() ---");
  const file = DOM.csvUpload.files[0];
  if (!file)
    return showToast(
      "No File Selected",
      "Please select a CSV or TSV file first.",
      "warning",
    );

  console.log("Step 1: File selected, beginning read...");
  const reader = new FileReader();
  reader.onload = async function (e) {
    console.log("Step 2: File read complete, parsing lines...");
    const lines = e.target.result.split(/\r?\n/);
    const delimiter = file.name.toLowerCase().endsWith(".tsv") ? "\t" : ",";
    let newEntries = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const parts = lines[i]
        .split(delimiter)
        .map((s) => s.trim().replace(/^"|"$/g, ""));
      if (parts.length >= 1 && parts[0]) {
        newEntries.push({
          name: parts[0] || "",
          address: parts[1] || "",
          contact: parts[2] || "",
          email: parts[3] || "",
          person: parts[4] || "",
        });
      }
    }

    DOM.csvUpload.value = "";
    console.log(`Step 3: Parsed ${newEntries.length} valid entries.`);
    if (newEntries.length === 0)
      return showToast(
        "Empty Document",
        "No valid entries found in the CSV/TSV file.",
        "warning",
      );

    try {
      console.log("Step 4: Checking Authentication...");
      if (!auth.currentUser)
        throw new Error("Unauthenticated: No user logged in.");

      console.log("Step 5: Initializing Firestore Batch Write...");
      const batch = db.batch();
      const htesRef = db.collection("htes");

      newEntries.forEach((entry) => {
        const docRef = htesRef.doc(); // Auto-generate ID
        batch.set(docRef, {
          ...entry,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        entry.id = docRef.id; // Assign to local object for UI
      });

      console.log("Step 6: Committing Batch to Firestore...");
      await batch.commit();
      console.log("Step 7: Batch commit successful!");

      // Update UI
      hteList = [...newEntries, ...hteList];
      currentPageAdmin = 1;
      renderHteTables();
      showToast(
        "Batch Upload Complete",
        `Successfully added ${newEntries.length} new HTE partners.`,
        "success",
      );
    } catch (error) {
      console.error("CSV Upload Error Trace:", error);
      showToast("Upload Error", "Failed: " + error.message, "error");
    } finally {
      console.log("--- TRACE END ---");
    }
  };
  reader.readAsText(file);
}
