import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('login-btn');
  const msg = document.getElementById('msg');

  btn.addEventListener('click', async () => {
    msg.textContent = '';
    msg.style.color = '#ffd700';

    const loginInput = document.getElementById('login-input').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!loginInput || !password) {
      msg.textContent = 'Fill all fields!';
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;

    let query = supabase.from('profiles').select('email, code, name');
    if (emailRegex.test(loginInput)) {
      query = query.eq('email', loginInput);
    } else {
      query = query.eq('name', loginInput);
    }

    const { data, error } = await query.limit(1).single();

    if (error || !data) {
      msg.textContent = 'Invalid credentials!';
      return;
    }

    if (password !== data.code) {
      msg.textContent = 'Invalid credentials!';
      return;
    }

    // Login OK: salva localStorage e redireciona
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('userName', data.name);

    msg.style.color = '#00ff7f';
    msg.textContent = 'Logged in successfully! Redirecting...';

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  });
});

