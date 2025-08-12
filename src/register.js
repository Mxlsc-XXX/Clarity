import { supabase } from './supabaseClient.js';

const btn = document.getElementById('register-btn');
const msg = document.getElementById('msg');

btn.addEventListener('click', async () => {
  msg.textContent = '';
  msg.style.color = '#ffd700';

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !email || !password) {
    msg.textContent = 'Fill all fields!';
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    msg.textContent = 'Error: ' + error.message;
    return;
  }

  // Insere no perfil
  const userId = data.user.id;

  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{ id: userId, name: username, code: password, email }]);

  if (profileError) {
    msg.textContent = 'Error saving username: ' + profileError.message;
    return;
  }

  msg.style.color = '#00ff7f';
  msg.textContent = 'Registration successful! Redirecting...';

  setTimeout(() => {
    window.location.href = 'index.html';
  }, 3000);
});
