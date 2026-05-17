// Firebase Database Operations
// Handles all Firestore database queries and updates

// --- CLOUD LINK MANAGEMENT ---
async function loadCloudLinks() {
  try {
    console.log("--- TRACE: loadCloudLinks() ---");
    console.log(
      "Step 1: Attempting to fetch 'settings/app_links' from Firestore...",
    );
    const docRef = await db.collection("settings").doc("app_links").get();

    if (docRef.exists) {
      console.log("Step 2: Links found in Firestore. Updating app...");
      appLinks = { ...defaultLinks, ...docRef.data() };
    } else {
      console.log(
        "Step 2: No links found in Firestore yet. Using default fallbacks.",
      );
    }
    applyLinksToDOM();
    console.log("--- TRACE END ---");
  } catch (error) {
    console.error("Error fetching cloud links Trace:", error);

    // Show UI warning if Database doesn't exist
    if (
      error.message &&
      (error.message.includes("offline") || error.message.includes("not-found"))
    ) {
      showToast(
        "Firestore Not Configured",
        "Please go to the Firebase Console and click 'Create Database' for this project.",
        "error",
      );
    }

    applyLinksToDOM(); // Apply defaults if fetch fails
  }
}

async function saveLinks() {
  console.log("--- TRACE: saveLinks() ---");
  const btn = document.getElementById("btn-save-links");
  const originalText = btn.innerHTML;
  btn.innerHTML =
    '<i data-lucide="loader-2" class="w-3.5 h-3.5 animate-spin"></i> Saving to Cloud...';
  btn.disabled = true;
  lucide.createIcons();

  console.log("Step 1: Gathering input data from Admin panel...");
  Object.keys(defaultLinks).forEach((key) => {
    const inputEl = document.getElementById(`input-${key}`);
    if (inputEl) appLinks[key] = inputEl.value.trim() || "#";
  });

  try {
    console.log("Step 2: Checking if Admin is logged in...");
    if (!auth.currentUser)
      throw new Error("Unauthenticated: No user logged in.");
    console.log("User verified:", auth.currentUser.email);

    console.log("Step 3: Sending links to Firestore (settings/app_links)...");
    await db.collection("settings").doc("app_links").set(appLinks);

    console.log("Step 4: Success!");
    showToast(
      "Links Synchronized",
      "Form URLs have been saved to the cloud successfully.",
      "success",
    );
    applyLinksToDOM();
  } catch (error) {
    console.error("Cloud Save Error Trace:", error);
    showToast("Sync Failed", "Error: " + error.message, "error");
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
    lucide.createIcons();
    console.log("--- TRACE END ---");
  }
}

// --- HTE DATABASE (FIRESTORE LOGIC & PAGINATION) ---
async function loadHteData() {
  try {
    console.log("--- TRACE: loadHteData() ---");
    if (DOM.viewTbody)
      DOM.viewTbody.innerHTML =
        '<tr><td colspan="5" class="text-center py-6 text-gray-400 text-[11px] sm:text-xs">Loading database...</td></tr>';
    if (DOM.adminTbody)
      DOM.adminTbody.innerHTML =
        '<tr><td colspan="6" class="text-center py-6 text-gray-400 text-[11px] sm:text-xs">Loading...</td></tr>';

    console.log("Step 1: Fetching 'htes' collection from Firestore...");
    // Fetch from Firestore collection 'htes', ordered by newest first
    const snapshot = await db
      .collection("htes")
      .orderBy("createdAt", "desc")
      .get();

    console.log(`Step 2: Fetched ${snapshot.size} documents from Firestore.`);
    hteList = [];
    snapshot.forEach((doc) => {
      hteList.push({ id: doc.id, ...doc.data() });
    });

    renderHteTables();
    console.log("--- TRACE END ---");
  } catch (error) {
    console.error("Database fetch failed Trace:", error);

    if (
      error.message &&
      (error.message.includes("offline") || error.message.includes("not-found"))
    ) {
      if (DOM.emptyState) {
        DOM.emptyState.innerHTML = `
               <div class="text-red-500 mb-2"><i data-lucide="database" class="w-8 h-8 mx-auto"></i></div>
               <p class="font-semibold text-red-600">Database Not Found</p>
               <p class="mt-1">Please visit your Firebase Console and click <b>Create Database</b> for project <b>sit-process-app</b>.</p>
           `;
      }
    }

    hteList = [];
    renderHteTables();
  }
}

async function addHteManual() {
  console.log("--- TRACE: addHteManual() ---");
  const name = document.getElementById("hte-name").value.trim();
  if (!name) {
    console.warn("Validation failed: Name is empty.");
    return showToast("Validation Error", "Name of HTE is required!", "warning");
  }

  console.log("Step 1: Gathering HTE Form Data...");
  const newHte = {
    name: name,
    address: document.getElementById("hte-address").value.trim(),
    contact: document.getElementById("hte-contact").value.trim(),
    email: document.getElementById("hte-email").value.trim(),
    person: document.getElementById("hte-person").value.trim(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Cloud Timestamp
  };

  try {
    console.log("Step 2: Checking Authentication...");
    if (!auth.currentUser)
      throw new Error("Unauthenticated: No user logged in.");
    console.log("User verified:", auth.currentUser.email);

    console.log("Step 3: Sending new HTE to Firestore collection 'htes'...");
    const docRef = await db.collection("htes").add(newHte);
    newHte.id = docRef.id; // Map the auto-generated Firebase ID
    console.log("Step 4: HTE successfully added with ID:", docRef.id);

    // Update UI
    hteList.unshift(newHte);
    currentPageAdmin = 1;
    currentPageStudent = 1;
    renderHteTables();
    if (DOM.manualForm) DOM.manualForm.reset();

    showToast(
      "HTE Added",
      "Partner has been securely saved to the database.",
      "success",
    );
  } catch (error) {
    console.error("Add HTE Error Trace:", error);
    showToast("Database Error", "Failed: " + error.message, "error");
  } finally {
    console.log("--- TRACE END ---");
  }
}

async function deleteHte(id) {
  console.log("--- TRACE: deleteHte() ---");
  console.log("Step 1: Attempting to delete HTE with ID:", id);
  try {
    console.log("Step 2: Checking Authentication...");
    if (!auth.currentUser)
      throw new Error("Unauthenticated: No user logged in.");

    console.log("Step 3: Sending delete request to Firestore...");
    await db.collection("htes").doc(id).delete();
    console.log("Step 4: Document successfully deleted from Firestore!");

    // Update UI
    hteList = hteList.filter((hte) => hte.id !== id);
    renderHteTables();
    showToast(
      "Partner Removed",
      "HTE has been deleted from the database.",
      "success",
    );
  } catch (error) {
    console.error("Delete HTE Error Trace:", error);
    showToast("Deletion Error", "Failed: " + error.message, "error");
  } finally {
    console.log("--- TRACE END ---");
  }
}
