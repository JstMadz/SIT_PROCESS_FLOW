// Application Constants and Configuration

// HTE Pagination and Data Management
let hteList = [];
let currentPageStudent = 1;
let currentPageAdmin = 1;
const itemsPerPage = 10;

// Default links to forms and resources
const defaultLinks = {
  downloadForms:
    "https://drive.google.com/drive/folders/18BuvGcVRE6OvLxLcm77it5SV_XKeehpA?usp=sharing",
  appForm: "#",
  waiverForm: "#",
  recLetterForm: "#",
  trainingPlan: "#",
  endorsementForm: "https://forms.gle/AwQEsiFPskFbNa3u8",
  monitoringForm: "https://forms.gle/FJwEWZo1bau6BZmn6",
  moaForm: "#",
  trainingAgreementForm: "#",
  dailyActivity: "#",
  overtimeForm: "#",
  traineeEvalForm: "#",
  hteEvalGformCollege: "#",
  hteEvalGformIrjp: "#",
  narrativeReportForm: "#",
  hteEvalForm: "#",
};

// Labels for form links in admin dashboard
const linkLabels = {
  downloadForms: "Main Downloadable Forms",
  appForm: "Application Form",
  waiverForm: "Waiver Form",
  recLetterForm: "Recommendation Request GForm",
  trainingPlan: "Univ. Training Plan Format",
  endorsementForm: "Endorsement GForm",
  monitoringForm: "Acceptance Monitoring GForm",
  moaForm: "MOA Template",
  trainingAgreementForm: "Training Agreement Template",
  dailyActivity: "Daily Work Activity Form",
  overtimeForm: "Overtime Request Form",
  traineeEvalForm: "Student/Trainee Eval Form",
  hteEvalGformCollege: "HTE Eval GForm (College)",
  hteEvalGformIrjp: "HTE Eval GForm (IRJP)",
  narrativeReportForm: "Narrative Report Form",
  hteEvalForm: "HTE Evaluation Form (File)",
};

// App links storage (will be overwritten by cloud data)
let appLinks = { ...defaultLinks };

// --- LINK MANAGEMENT IN DOM ---
function applyLinksToDOM() {
  document.querySelectorAll("[data-link]").forEach((element) => {
    const key = element.getAttribute("data-link");
    if (appLinks[key] && appLinks[key] !== "#") {
      element.href = appLinks[key];
      element.onclick = null;
    } else if (!appLinks[key] || appLinks[key] === "#") {
      element.href = "#";
      element.onclick = (e) => {
        e.preventDefault();
        showToast(
          "Link Unavailable",
          "This form link has not been updated by the administrator yet.",
          "warning",
        );
      };
    }
  });
}
