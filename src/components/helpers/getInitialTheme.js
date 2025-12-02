export function getInitialTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-theme:dark)").matches;

  if (savedTheme) {
    return savedTheme;
  } else if (prefersDark) {
    return "dark";
  } else {
    const hours = new Date().getHours();
    return hours < 6 || hours >= 21 ? "dark" : "light";
  }
}
