const modeIcon = document.getElementById('mode-icon');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.classList.add(savedTheme);
    console.log("savedTheme:", savedTheme)
    updateModeIcon(true);
}

function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('theme-tokyo-night-dark', isDarkMode);
    document.body.classList.toggle('light-mode', !isDarkMode);
    document.body.classList.toggle('theme-tokyo-night-light', !isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark-mode' : 'light-mode');
    updateModeIcon();
}

function updateModeIcon(loading) {
    const iconPath = document.body.classList.contains('dark-mode') ? 'moon.svg' : 'sun.svg';
    modeIcon.src = "/static/img/theme/" + iconPath;
    console.log("theme:", localStorage.getItem('theme'), "iconPath:", iconPath)
    if (loading && savedTheme == "light-mode") toggleDarkMode();
}