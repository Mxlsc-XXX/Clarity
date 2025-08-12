// workspace.js
// Lógica da aba Workspace

document.addEventListener('DOMContentLoaded', () => {
    const wsSave = document.getElementById('workspace-save');
    if (wsSave) {
        wsSave.addEventListener('click', () => {
            const txt = document.getElementById('workspace-draft').value;
            localStorage.setItem('clarity-ws-draft', txt);
            const fb = document.getElementById('workspace-feedback');
            fb.classList.remove('hidden');
            setTimeout(() => fb.classList.add('hidden'), 1200);
        });
        // Carregar rascunho salvo
        const saved = localStorage.getItem('clarity-ws-draft');
        if (saved) document.getElementById('workspace-draft').value = saved;
    }
});
