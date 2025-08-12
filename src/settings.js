// settings.js
// Lógica da aba Settings

document.addEventListener('DOMContentLoaded', () => {
    const saveSettings = document.getElementById('save-settings');
    if (saveSettings) {
        saveSettings.addEventListener('click', () => {
            localStorage.setItem('clarity-darkmode', document.getElementById('setting-darkmode').checked);
            localStorage.setItem('clarity-animations', document.getElementById('setting-animations').checked);
            localStorage.setItem('clarity-accessibility', document.getElementById('setting-accessibility').checked);
            const fb = document.getElementById('settings-feedback');
            fb.classList.remove('hidden');
            setTimeout(() => fb.classList.add('hidden'), 1200);
        });
    }
});
