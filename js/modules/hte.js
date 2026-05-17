// HTE (Host Training Establishment) Data Operations
// Handles data rendering, pagination, and CSV processing

function generateHteRowHTML(hte, isAdmin = false) {
  const emailHtml = hte.email
    ? `
          <a href="mailto:${hte.email.trim()}" target="_top" class="flex items-center text-gray-600 hover:text-red-800 transition-colors group cursor-pointer w-full">
              <span class="break-all group-hover:underline font-medium" title="Email ${
                hte.email
              }">${hte.email}</span>
          </a>
      `
    : '<span class="text-gray-400 text-xs italic">No email provided</span>';

  const actionHtml = isAdmin
    ? `
          <td class="px-2 sm:px-3 py-2 text-center">
              <button onclick="promptDeleteHte('${hte.id}')" class="text-gray-400 hover:text-red-600 transition-colors p-1" title="Delete Partner"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
          </td>
      `
    : "";

  return `
          <tr class="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
              <td class="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-800">${
                hte.name || ""
              }</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-gray-600">${
                hte.address || ""
              }</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-gray-600 whitespace-nowrap">${
                hte.contact || ""
              }</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3">${emailHtml}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-gray-600 whitespace-nowrap">${
                hte.person || ""
              }</td>
              ${actionHtml}
          </tr>
      `;
}

function renderHteTables() {
  if (hteList.length === 0) {
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

    const totalPages = Math.ceil(hteList.length / itemsPerPage) || 1;

    if (currentPageStudent > totalPages) currentPageStudent = totalPages;
    if (currentPageAdmin > totalPages) currentPageAdmin = totalPages;

    const startStudent = (currentPageStudent - 1) * itemsPerPage;
    const paginatedStudentList = hteList.slice(
      startStudent,
      startStudent + itemsPerPage,
    );

    const startAdmin = (currentPageAdmin - 1) * itemsPerPage;
    const paginatedAdminList = hteList.slice(
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
        infoStudent.innerText = `Page ${currentPageStudent} of ${totalPages} (${hteList.length} items)`;

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
        infoAdmin.innerText = `Page ${currentPageAdmin} of ${totalPages} (${hteList.length} items)`;

      const btnPrevA = document.getElementById("btn-admin-prev");
      if (btnPrevA) btnPrevA.disabled = currentPageAdmin === 1;

      const btnNextA = document.getElementById("btn-admin-next");
      if (btnNextA) btnNextA.disabled = currentPageAdmin === totalPages;
    }
  }
  lucide.createIcons();
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

async function processCsvUpload() {
  console.log("--- TRACE: processCsvUpload() ---");
  const file = DOM.csvUpload.files[0];
  if (!file)
    return showToast(
      "No File Selected",
      "Please select a CSV file first.",
      "warning",
    );

  console.log("Step 1: File selected, beginning read...");
  const reader = new FileReader();
  reader.onload = async function (e) {
    console.log("Step 2: File read complete, parsing lines...");
    const lines = e.target.result.split("\n");
    let newEntries = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const parts = lines[i]
        .split(",")
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
        "No valid entries found in the CSV.",
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
