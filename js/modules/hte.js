// HTE (Host Training Establishment) Data Operations
// Handles data rendering, pagination, filtering, and CSV/TSV processing

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

function getVisibleHtes() {
  const search = hteSearchTerm.trim().toLowerCase();
  return hteList
    .filter((hte) => {
      if (!search) return true;
      return [hte.name, hte.address, hte.contact, hte.email, hte.person]
        .join(" ")
        .toLowerCase()
        .includes(search);
    })
    .sort((left, right) => {
      const leftValue = String(left[hteSortField] || "").toLowerCase();
      const rightValue = String(right[hteSortField] || "").toLowerCase();
      return (
        leftValue.localeCompare(rightValue) *
        (hteSortDirection === "asc" ? 1 : -1)
      );
    });
}

function updateHteSearch(value) {
  hteSearchTerm = value;
  currentPageStudent = 1;
  currentPageAdmin = 1;
  renderHteTables();
}

function updateHteSort(field) {
  if (hteSortField === field) {
    hteSortDirection = hteSortDirection === "asc" ? "desc" : "asc";
  } else {
    hteSortField = field;
    hteSortDirection = "asc";
  }
  currentPageStudent = 1;
  currentPageAdmin = 1;
  renderHteTables();
}

function generateHteRowHTML(hte, isAdmin = false) {
  const name = escapeHteHtml(hte.name);
  const address = escapeHteHtml(hte.address);
  const contact = escapeHteHtml(hte.contact);
  const email = escapeHteHtml(hte.email);
  const person = escapeHteHtml(hte.person);
  const emailHtml = hte.email
    ? `
            <a href="mailto:${encodeURIComponent(hte.email.trim())}" target="_top" class="flex min-w-0 items-center text-gray-600 hover:text-red-800 transition-colors group cursor-pointer w-full">
              <span class="block min-w-0 whitespace-normal break-all group-hover:underline font-medium" title="Email ${email}">${email}</span>
          </a>
      `
    : '<span class="text-gray-400 text-xs italic">No email provided</span>';

  const actionHtml = isAdmin
    ? `
          <td class="px-2 sm:px-3 py-2 text-center">
              <button onclick="openHteEditModal('${hte.id}')" class="text-gray-400 hover:text-gray-700 transition-colors p-1" title="Edit Partner"><i data-lucide="pencil" class="w-4 h-4"></i></button>
              <button onclick="promptDeleteHte('${hte.id}')" class="text-gray-400 hover:text-red-600 transition-colors p-1" title="Delete Partner"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
          </td>
      `
    : "";

  return `
          <tr class="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
              ${isAdmin ? `<td class="px-2 py-2 align-top"><input type="checkbox" class="hte-select" value="${hte.id}" onchange="toggleHteSelection('${hte.id}', this.checked)" ${selectedHteIds.has(hte.id) ? "checked" : ""} aria-label="Select ${name}" /></td>` : ""}
              <td class="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-800 break-words">${name}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-gray-600 break-words">${address}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-gray-600 break-words">${contact}</td>
              <td class="min-w-0 align-top px-2 sm:px-4 py-2 sm:py-3">${emailHtml}</td>
              <td class="min-w-0 align-top px-2 sm:px-4 py-2 sm:py-3 text-gray-600 whitespace-normal break-words">${person}</td>
              ${actionHtml}
          </tr>
      `;
}

function renderHteTables() {
  const visibleHtes = getVisibleHtes();
  const totalPages = Math.ceil(visibleHtes.length / itemsPerPage) || 1;
  let paginatedAdminList = [];

  if (visibleHtes.length === 0) {
    if (DOM.viewTbody) DOM.viewTbody.innerHTML = "";
    if (DOM.emptyState) DOM.emptyState.classList.remove("hidden");

    const pStudent = document.getElementById("student-pagination");
    if (pStudent) pStudent.classList.add("hidden");

    const pAdmin = document.getElementById("admin-pagination");
    if (pAdmin) pAdmin.classList.add("hidden");
  } else {
    // Check if we previously altered the empty state for the database missing error, and reset it
    if (
      DOM.emptyState &&
      DOM.emptyState.innerHTML.includes("Database Not Found")
    ) {
      DOM.emptyState.innerHTML = "No partner HTEs available at the moment.";
    }
    if (DOM.emptyState) DOM.emptyState.classList.add("hidden");

    if (currentPageStudent > totalPages) currentPageStudent = totalPages;
    if (currentPageAdmin > totalPages) currentPageAdmin = totalPages;

    const startStudent = (currentPageStudent - 1) * itemsPerPage;
    const paginatedStudentList = visibleHtes.slice(
      startStudent,
      startStudent + itemsPerPage,
    );

    const startAdmin = (currentPageAdmin - 1) * itemsPerPage;
    paginatedAdminList = visibleHtes.slice(
      startAdmin,
      startAdmin + itemsPerPage,
    );

    if (DOM.viewTbody) {
      DOM.viewTbody.innerHTML = paginatedStudentList
        .map((hte) => generateHteRowHTML(hte, false))
        .join("");

      const pStudent = document.getElementById("student-pagination");
      if (pStudent) pStudent.classList.remove("hidden");

      const infoStudent = document.getElementById("student-page-info");
      if (infoStudent)
        infoStudent.innerText = `Page ${currentPageStudent} of ${totalPages} (${visibleHtes.length} items)`;

      const btnPrevS = document.getElementById("btn-student-prev");
      if (btnPrevS) btnPrevS.disabled = currentPageStudent === 1;

      const btnNextS = document.getElementById("btn-student-next");
      if (btnNextS) btnNextS.disabled = currentPageStudent === totalPages;
    }

    if (DOM.adminTbody) {
      DOM.adminTbody.innerHTML = paginatedAdminList
        .map((hte) => generateHteRowHTML(hte, true))
        .join("");

      const pAdmin = document.getElementById("admin-pagination");
      if (pAdmin) pAdmin.classList.remove("hidden");

      const infoAdmin = document.getElementById("admin-page-info");
      if (infoAdmin)
        infoAdmin.innerText = `Page ${currentPageAdmin} of ${totalPages} (${visibleHtes.length} items)`;

      const btnPrevA = document.getElementById("btn-admin-prev");
      if (btnPrevA) btnPrevA.disabled = currentPageAdmin === 1;

      const btnNextA = document.getElementById("btn-admin-next");
      if (btnNextA) btnNextA.disabled = currentPageAdmin === totalPages;
    }
  }
  const selectAll = document.getElementById("select-all-htes");
  if (selectAll) {
    selectAll.checked =
      visibleHtes.length > 0 &&
      visibleHtes.every((hte) => selectedHteIds.has(hte.id));
    selectAll.indeterminate =
      !selectAll.checked &&
      visibleHtes.some((hte) => selectedHteIds.has(hte.id));
  }
  const deleteSelected = document.getElementById("delete-selected-hte");
  if (deleteSelected) deleteSelected.disabled = selectedHteIds.size === 0;
  const deleteAll = document.getElementById("delete-all-hte");
  if (deleteAll) deleteAll.disabled = hteList.length === 0;
  lucide.createIcons();
}

function toggleHteSelection(id, checked) {
  if (checked) selectedHteIds.add(id);
  else selectedHteIds.delete(id);
  renderHteTables();
}

function toggleAllHtes(checked) {
  getVisibleHtes().forEach((hte) => {
    if (checked) selectedHteIds.add(hte.id);
    else selectedHteIds.delete(hte.id);
  });
  renderHteTables();
}

function changeStudentPage(direction) {
  currentPageStudent += direction;
  renderHteTables();
}

function changeAdminPage(direction) {
  currentPageAdmin += direction;
  renderHteTables();
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
  document.getElementById("hte-edit-modal").classList.remove("hidden");
  lucide.createIcons();
}

function closeHteEditModal() {
  document.getElementById("hte-edit-modal").classList.add("hidden");
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
      currentPageStudent = 1;
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
