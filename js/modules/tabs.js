// Tab Navigation Management

function switchTab(tabId) {
  document
    .querySelectorAll(".tab-content")
    .forEach((t) => t.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove(
      "text-red-800",
      "min-[485px]:border-red-800",
      "max-[484px]:bg-red-50",
    );
    btn.classList.add("text-gray-500", "min-[485px]:border-transparent");
  });

  document.getElementById("tab-" + tabId).classList.add("active");

  const activeBtn = document.getElementById("btn-" + tabId);
  activeBtn.classList.remove("text-gray-500", "min-[485px]:border-transparent");
  activeBtn.classList.add(
    "text-red-800",
    "min-[485px]:border-red-800",
    "max-[484px]:bg-red-50",
  );
}
