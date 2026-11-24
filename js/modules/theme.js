// Light / dark theme. Follows the device until the user picks one with the
// sun/moon button; the switch spreads from the button as a circle (patterns §18).
// The <head> script sets the theme before the first paint.

const THEME_KEY = "sit-process-flow:theme";
const darkSchemeQuery = matchMedia("(prefers-color-scheme: dark)");

function isDarkTheme() {
  return document.documentElement.dataset.theme === "dark";
}

function readStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function applyTheme(dark) {
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  updateThemeButton();
}

function updateThemeButton() {
  const label = isDarkTheme() ? "Switch to light mode" : "Switch to dark mode";
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.innerHTML = icon(isDarkTheme() ? "sun" : "moon");
    button.setAttribute("aria-label", label);
    button.title = label;
  });
}

function toggleTheme(event) {
  const dark = !isDarkTheme();
  try {
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  } catch {
    // storage unavailable: the choice lasts until the page closes
  }

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduceMotion) {
    applyTheme(dark);
    return;
  }

  const box = event.currentTarget.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const root = document.documentElement;

  root.classList.add("theme-switching");
  const transition = document.startViewTransition(() => applyTheme(dark));
  transition.ready
    .then(() =>
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 550, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
      ),
    )
    .catch(() => {});
  const done = () => root.classList.remove("theme-switching");
  transition.finished.then(done, done);
}

function setupTheme() {
  updateThemeButton();
  darkSchemeQuery.addEventListener("change", (event) => {
    if (!readStoredTheme()) applyTheme(event.matches);
  });
}
