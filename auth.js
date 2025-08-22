// CraftPanel auth demo con localStorage
const Auth = (() => {
  const USERS_KEY = 'cp_users';
  const SESSION_KEY = 'cp_session';

  function getUsers(){
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch(e){ return []; }
  }
  function setUsers(arr){ localStorage.setItem(USERS_KEY, JSON.stringify(arr)); }

  function setSession(user){ localStorage.setItem(SESSION_KEY, JSON.stringify({ username:user.username, email:user.email })); }
  function getSession(){
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch(e){ return null; }
  }
  function clearSession(){ localStorage.removeItem(SESSION_KEY); }

  function requireLoggedIn(){
    const s = getSession();
    if (!s) window.location.href = 'login.html';
  }
  function requireLoggedOut(){
    const s = getSession();
    if (s) window.location.href = 'dashboard.html';
  }

  function bindLogin(){
    const form = document.getElementById('loginForm');
    form?.addEventListener('submit', (e)=>{
      e.preventDefault();
      const u = document.getElementById('loginUser').value.trim();
      const p = document.getElementById('loginPass').value;
      const users = getUsers();
      const found = users.find(x => x.username.toLowerCase() === u.toLowerCase() && x.password === p);
      if (!found) return alert('Usuario o contraseña incorrectos.');
      setSession(found);
      window.location.href = 'dashboard.html';
    });
  }

  function bindRegister(){
    const form = document.getElementById('regForm');
    form?.addEventListener('submit', (e)=>{
      e.preventDefault();
      const username = document.getElementById('regUser').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPass').value;
      if (username.length < 3) return alert('El usuario debe tener al menos 3 caracteres.');
      if (password.length < 6) return alert('La contraseña debe tener al menos 6 caracteres.');

      const users = getUsers();
      if (users.some(x => x.username.toLowerCase() === username.toLowerCase())){
        return alert('Ese usuario ya existe.');
      }
      const newUser = { username, email, password };
      users.push(newUser);
      setUsers(users);
      setSession(newUser);
      window.location.href = 'dashboard.html';
    });
  }

  function logout(){
    clearSession();
    window.location.href = 'login.html';
  }

  return { requireLoggedIn, requireLoggedOut, bindLogin, bindRegister, logout };
})();
