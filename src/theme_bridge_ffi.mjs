export function readTheme() {
  return window.localStorage.getItem("theme") ?? document.documentElement.dataset.theme ?? "";
}

export function applyTheme(theme) {
  const root = document.documentElement;
  const previousTheme = root.dataset.theme;

  if (previousTheme === theme) {
    return;
  }

  if (previousTheme) {
    root.classList.remove(previousTheme);
  }

  root.classList.add(theme);
  root.dataset.theme = theme;
  window.localStorage.setItem("theme", theme);
}

export function currentYear() {
  return new Date().getFullYear();
}
