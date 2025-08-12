// files.js
// Lógica da aba Files

document.addEventListener('DOMContentLoaded', () => {
    const filesList = document.getElementById('files-list');
    const addFileBtn = document.getElementById('add-file');
    // Substitui input de texto por input file (criado dinamicamente)
    let fileInput = document.getElementById('file-input');
    if (fileInput && fileInput.type !== 'file') {
        const parent = fileInput.parentElement;
        const newInput = document.createElement('input');
        newInput.type = 'file';
        newInput.id = 'file-input';
        newInput.className = fileInput.className;
        newInput.style = fileInput.style;
        parent.replaceChild(newInput, fileInput);
        fileInput = newInput;
    }

    // Carrega arquivos do localStorage
    function loadFiles() {
        filesList.innerHTML = '';
        const files = JSON.parse(localStorage.getItem('clarity-files') || '[]');
        files.forEach((f, idx) => {
            const li = document.createElement('li');
            li.innerHTML = `<span class='font-semibold'>${f.name}</span> <span class='ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded'>${f.size}</span> <button class='ml-2 text-xs text-red-600 underline remove-file' data-idx='${idx}'>Remover</button>`;
            filesList.appendChild(li);
        });
    }

    // Salva arquivos no localStorage
    function saveFiles(files) {
        localStorage.setItem('clarity-files', JSON.stringify(files));
        loadFiles();
    }

    // Adiciona arquivo
    if (addFileBtn && fileInput && filesList) {
        addFileBtn.addEventListener('click', () => {
            if (!fileInput.files || !fileInput.files.length) return;
            const file = fileInput.files[0];
            const files = JSON.parse(localStorage.getItem('clarity-files') || '[]');
            // Salva apenas nome e tamanho (não armazena binário localmente)
            files.push({ name: file.name, size: (file.size / 1024).toFixed(1) + ' KB' });
            saveFiles(files);
            fileInput.value = '';
        });
    }

    // Remover arquivo
    filesList.addEventListener('click', e => {
        if (e.target.classList.contains('remove-file')) {
            const idx = +e.target.getAttribute('data-idx');
            const files = JSON.parse(localStorage.getItem('clarity-files') || '[]');
            files.splice(idx, 1);
            saveFiles(files);
        }
    });

    loadFiles();
});
