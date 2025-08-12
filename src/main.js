const email = localStorage.getItem('userEmail');
const name = localStorage.getItem('userName');

const welcomeMessage = document.getElementById('welcome-message');
const userEmailSpan = document.getElementById('user-email');
const userNameSpan = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');

if (!email) {
    window.location.href = 'login.html';
} else {
    welcomeMessage.textContent = `Hello there, ${name || email}!`;
    userEmailSpan.textContent = email;
    userNameSpan.textContent = name || '-';
}
    logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

document.addEventListener('click', e => {
  const target = e.target;

  // Só ativa no botão logout por enquanto, pode trocar para outros
  if (target.id === 'logout-btn') {
    for (let i = 0; i < 8; i++) { // cria 8 partículas
      const particle = document.createElement('div');
      particle.classList.add('particle');
      const size = Math.random() * 6 + 4; // tamanho entre 4-10px
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';

      // Posição inicial na posição do clique relativa ao botão
      const rect = target.getBoundingClientRect();
      particle.style.left = e.clientX - rect.left - size / 2 + 'px';
      particle.style.top = e.clientY - rect.top - size / 2 + 'px';

      // Movimento aleatório nas direções x e y
      const dx = (Math.random() - 0.5) * 100 + 'px';
      const dy = (Math.random() - 0.5) * 100 + 'px';
      particle.style.setProperty('--dx', dx);
      particle.style.setProperty('--dy', dy);

      target.appendChild(particle);

      // Remove a partícula depois da animação acabar
      particle.addEventListener('animationend', () => {
        particle.remove();
      });
    }
  }
});

document.querySelectorAll('[data-tab]').forEach(tab => {
  tab.addEventListener('click', e => {
    e.preventDefault();
    const target = tab.getAttribute('data-tab');

    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.querySelector(`[data-content="${target}"]`).classList.remove('hidden');
  });
});

function showLoadingScreen() {
    const loading = document.getElementById('loading-screen');
    loading.classList.remove('hidden');
    loading.classList.remove('fade-out');
    
    // Mostra por pelo menos 1 segundo, depois começa o fade
    setTimeout(() => {
        loading.classList.add('fade-out');

        // Espera a transição acabar antes de esconder de vez
        setTimeout(() => {
            loading.classList.add('hidden');
        }, 500); // mesmo tempo da transição no CSS
    }, 1000);
}


// Aguarda o DOM estar pronto antes de ativar o loading
window.addEventListener('DOMContentLoaded', () => {
    showLoadingScreen();
});

