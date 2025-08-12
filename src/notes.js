import { supabase } from './supabaseClient.js';

window.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('note-editor');
  const preview = document.getElementById('note-preview');
  const saveBtn = document.getElementById('save-note');
  const noteList = document.getElementById('notes-list');
  const createBtn = document.getElementById('create-note');
  const searchInput = document.getElementById('search-notes');
  const filterKeyword = document.getElementById('filter-keyword');
  // Modal de leitura
  let readModal = document.getElementById('note-read-modal');
  if (!readModal) {
    readModal = document.createElement('div');
    readModal.id = 'note-read-modal';
    readModal.className = 'fixed inset-0 flex items-center justify-center z-50 hidden';
    readModal.innerHTML = `
      <div id="note-read-content" style="background:rgba(255,255,255,0.97);border-radius:18px;box-shadow:0 4px 32px 0 rgba(180,150,110,0.13);max-width:420px;width:90vw;padding:2.2rem 2rem;display:flex;flex-direction:column;gap:1.2rem;align-items:stretch;position:relative;">
        <button id="close-read-modal" style="position:absolute;top:1.2rem;right:1.2rem;background:none;border:none;font-size:1.5rem;color:#bfa074;cursor:pointer;">&times;</button>
        <h4 id="read-title" style="font-size:1.5rem;font-weight:700;color:#7c5c3b;"></h4>
        <span id="read-category" style="font-size:0.95rem;color:#bfa074;font-weight:600;"></span>
        <div id="read-content" style="margin-top:0.5rem;font-size:1.08rem;color:#5c4631;line-height:1.6;"></div>
      </div>
    `;
    document.body.appendChild(readModal);
  }

  let notes = [];
  let editingNoteId = null;

  editor.addEventListener('input', () => {
    preview.innerHTML = marked.parse(editor.value);
  });

  function renderNotes(filteredNotes = notes) {
    noteList.innerHTML = '';
    filteredNotes.forEach((note, index) => {
      const div = document.createElement('div');
      div.className = 'note-card bg-white p-4 rounded shadow flex flex-col gap-2 transition hover:shadow-lg cursor-pointer';
      div.style.background = 'rgba(255,255,255,0.92)';
      div.style.border = '1.5px solid #e7cba9';
      div.style.boxShadow = '0 2px 8px 0 rgba(180,150,110,0.08)';
      div.style.marginBottom = '0.5rem';


      // Título
      const title = document.createElement('h4');
      title.className = 'note-title font-bold text-lg';
      // Se note.title existir, usa, senão pega a primeira linha do conteúdo
      let noteTitle = note.title || (note.content ? note.content.split('\n')[0].slice(0, 30) : `Nota ${index + 1}`);
      title.textContent = noteTitle;
      title.style.color = '#7c5c3b';
      title.style.marginBottom = '0.2rem';

      // Prévia da descrição (apenas o conteúdo após o título)
      const previewDesc = document.createElement('div');
      previewDesc.className = 'text-sm';
      let previewText = '';
      if (note.content) {
        const lines = note.content.split('\n');
        // Remove linhas vazias do início
        let descLines = lines.slice(1);
        while (descLines.length && descLines[0].trim() === '') descLines.shift();
        previewText = descLines.join(' ').replace(/[#*_`>\-]/g, '').slice(0, 60);
        if (previewText.length > 55) previewText += '...';
      }
      previewDesc.textContent = previewText;
      previewDesc.style.color = '#a08a6a';
      previewDesc.style.marginBottom = '0.1rem';

      // Categoria
      const category = document.createElement('span');
      category.className = 'text-xs';
      category.textContent = note.category || 'Sem categoria';
      category.style.color = '#bfa074';
      category.style.fontWeight = '600';
      category.style.marginBottom = '0.2rem';

      // Ações
      const actions = document.createElement('div');
      actions.className = 'flex gap-2 mt-2';
      actions.style.marginTop = '0.5rem';

      const editBtn = document.createElement('button');
      editBtn.textContent = '✏️ editar';
      editBtn.className = 'edit-btn';
      editBtn.onclick = (e) => {
        e.stopPropagation();
        editor.value = note.content;
        preview.innerHTML = marked.parse(note.content);
        editingNoteId = index;
        document.getElementById('note-modal').classList.remove('hidden');
      };

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '🗑️ deletar';
      deleteBtn.className = 'delete-btn';
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteNote(index);
      };

      actions.append(editBtn, deleteBtn);
      div.append(title, previewDesc, category, actions);


      // Clique no card para abrir modal de leitura
      div.addEventListener('click', (e) => {
        if (e.target === editBtn || e.target === deleteBtn) return;
        document.getElementById('read-title').textContent = note.title || `Nota ${index + 1}`;
        document.getElementById('read-category').textContent = note.category || 'Sem categoria';
        document.getElementById('read-content').innerHTML = marked.parse(note.content || '');
        // QoL: Adiciona botões extras no modal de leitura
        const modalContent = document.getElementById('note-read-content');
        let qolBar = document.getElementById('read-qol-bar');
        if (!qolBar) {
          qolBar = document.createElement('div');
          qolBar.id = 'read-qol-bar';
          qolBar.style.display = 'flex';
          qolBar.style.gap = '0.5rem';
          qolBar.style.marginBottom = '0.7rem';
          modalContent.insertBefore(qolBar, modalContent.children[1]);
        }
        qolBar.innerHTML = '';
        // Copiar título
        const copyTitleBtn = document.createElement('button');
        copyTitleBtn.textContent = 'Copiar título';
        copyTitleBtn.className = 'bg-yellow-900 text-yellow-100 rounded px-2 py-1 text-xs';
        copyTitleBtn.onclick = () => {
          navigator.clipboard.writeText(note.title || '');
        };
        // Copiar conteúdo
        const copyContentBtn = document.createElement('button');
        copyContentBtn.textContent = 'Copiar conteúdo';
        copyContentBtn.className = 'bg-yellow-900 text-yellow-100 rounded px-2 py-1 text-xs';
        copyContentBtn.onclick = () => {
          navigator.clipboard.writeText(note.content || '');
        };
        // Editar nota
        const editFromModalBtn = document.createElement('button');
        editFromModalBtn.textContent = 'Editar';
        editFromModalBtn.className = 'bg-blue-700 text-white rounded px-2 py-1 text-xs';
        editFromModalBtn.onclick = () => {
          editor.value = note.content;
          preview.innerHTML = marked.parse(note.content);
          document.getElementById('note-title').value = note.title || '';
          document.getElementById('note-category').value = note.category || '';
          editingNoteId = index;
          readModal.classList.add('hidden');
          document.getElementById('note-modal').classList.remove('hidden');
        };
        qolBar.append(copyTitleBtn, copyContentBtn, editFromModalBtn);
        // Animação de entrada
        modalContent.classList.remove('note-modal-out');
        modalContent.classList.add('note-modal-in');
        readModal.classList.remove('hidden');
      });

      noteList.appendChild(div);
    });
  }
  // Fechar modal de leitura
  document.body.addEventListener('click', (e) => {
    if (e.target.id === 'close-read-modal' || e.target.id === 'note-read-modal') {
      const modalContent = document.getElementById('note-read-content');
      if (modalContent) {
        modalContent.classList.remove('note-modal-in');
        modalContent.classList.add('note-modal-out');
        setTimeout(() => {
          readModal.classList.add('hidden');
          modalContent.classList.remove('note-modal-out');
        }, 280);
      } else {
        readModal.classList.add('hidden');
      }
    }
  });

  createBtn.addEventListener('click', () => {
    document.getElementById('note-modal').classList.remove('hidden');
    editor.value = '';
    preview.innerHTML = '';
    editingNoteId = null;
  });

  saveBtn.addEventListener('click', async () => {
    const content = editor.value.trim();
    if (!content) return;

    // Pega o valor do campo de título, se existir
    const titleInput = document.getElementById('note-title');
    let title = '';
    if (titleInput && titleInput.value.trim()) {
      title = titleInput.value.trim().slice(0, 60);
    } else {
      // Se não houver campo de título, usa a primeira linha do conteúdo
      title = content.split('\n')[0].slice(0, 60);
    }

    const newNote = {
      title,
      content,
      category: document.getElementById('note-category').value || 'Geral',
      createdAt: new Date().toISOString(),
    };

    if (editingNoteId !== null) {
      notes[editingNoteId] = newNote;
    } else {
      notes.unshift(newNote);
    }

    await saveNotesToSupabase();
    renderNotes();
    editor.value = '';
    if (titleInput) titleInput.value = '';
    preview.innerHTML = '';
    editingNoteId = null;

    document.getElementById('note-modal').classList.add('hidden');
  });

  async function deleteNote(index) {
    if (confirm('Tem certeza que quer deletar esta nota?')) {
      notes.splice(index, 1);
      await saveNotesToSupabase();
      renderNotes();
    }
  }

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    renderNotes(notes.filter(n => n.content.toLowerCase().includes(query)));
  });

  filterKeyword.addEventListener('input', () => {
    const keyword = filterKeyword.value.trim().toLowerCase();
    // Remove qualquer animação antiga
    noteList.querySelectorAll('.note-card').forEach(card => {
      card.classList.remove('fade-in', 'fade-out');
    });
    if (!keyword) {
      // Fade out todos os cards, depois mostra todos com fade in
      const cards = Array.from(noteList.querySelectorAll('.note-card'));
      if (cards.length) {
        let finished = 0;
        cards.forEach(card => {
          card.classList.add('fade-out');
          card.addEventListener('animationend', () => {
            finished++;
            card.remove();
            if (finished === cards.length) {
              renderNotes(notes);
              setTimeout(() => {
                noteList.querySelectorAll('.note-card').forEach(c => {
                  c.classList.add('fade-in');
                  setTimeout(() => c.classList.remove('fade-in'), 250);
                });
              }, 30);
            }
          }, { once: true });
        });
      } else {
        renderNotes(notes);
      }
      return;
    }
    const filtered = notes.filter(n =>
      (n.title && n.title.toLowerCase().includes(keyword)) ||
      (n.content && n.content.toLowerCase().includes(keyword))
    );
    // Fade out todos os cards antigos, depois fade in nos novos
    const cards = Array.from(noteList.querySelectorAll('.note-card'));
    let finished = 0;
    cards.forEach(card => {
      card.classList.add('fade-out');
      card.addEventListener('animationend', () => {
        finished++;
        card.remove();
        if (finished === cards.length) {
          renderNotes(filtered);
          setTimeout(() => {
            noteList.querySelectorAll('.note-card').forEach(c => {
              c.classList.add('fade-in');
              setTimeout(() => c.classList.remove('fade-in'), 250);
            });
          }, 30);
        }
      }, { once: true });
    });
  });

  async function loadNotesFromSupabase() {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      window.location.href = 'login.html';
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('user_data')
      .eq('email', email)
      .single();
    if (error) {
      console.error('Erro ao carregar notas:', error.message);
      return;
    }
    if (data && data.user_data && data.user_data.notes) {
      notes = data.user_data.notes;
      renderNotes();
    }
  }

  async function saveNotesToSupabase() {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('user_data')
      .eq('email', email)
      .single();
    if (fetchError) {
      console.error('Erro ao buscar dados para salvar:', fetchError.message);
      return;
    }

    const currentData = data?.user_data || {};
    const newUserData = {
      ...currentData,
      notes,
    };

    const { error } = await supabase
      .from('profiles')
      .upsert({ email, user_data: newUserData }, { onConflict: 'email' });
    if (error) {
      console.error('Erro ao salvar notas:', error.message);
    }
  }


  // Cancelar botão do modal
  document.getElementById('cancel-note').addEventListener('click', () => {
    document.getElementById('note-modal').classList.add('hidden');
  });

  // Carrega as notas quando tudo estiver pronto
  loadNotesFromSupabase();
});
