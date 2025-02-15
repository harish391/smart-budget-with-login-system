// Check if a user is already logged in
if (localStorage.getItem('loggedInUser')) {
    window.location.href = 'dashboard.html';
  }
  
  // DOM Elements
  const loginForm = document.querySelector('.auth-form');
  const registerForm = document.getElementById('registerForm');
  const showRegister = document.getElementById('showRegister');
  const showLogin = document.getElementById('showLogin');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const loginUsername = document.getElementById('loginUsername');
  const loginPassword = document.getElementById('loginPassword');
  const registerUsername = document.getElementById('registerUsername');
  const registerPassword = document.getElementById('registerPassword');
  
  // Show Register Form
  showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
  });
  
  // Show Login Form
  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'flex';
  });
  
  // Register User
  registerBtn.addEventListener('click', () => {
    const username = registerUsername.value.trim();
    const password = registerPassword.value.trim();
  
    if (username === '' || password === '') {
      alert('Please enter a username and password');
      return;
    }
  
    const users = JSON.parse(localStorage.getItem('users')) || [];
  
    if (users.some((user) => user.username === username)) {
      alert('Username already exists');
      return;
    }
  
    users.push({ username, password, transactions: [] });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful! Please login.');
    registerForm.style.display = 'none';
    loginForm.style.display = 'flex';
  });
  
  // Login User
  loginBtn.addEventListener('click', () => {
    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();
  
    if (username === '' || password === '') {
      alert('Please enter a username and password');
      return;
    }
  
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((u) => u.username === username && u.password === password);
  
    if (!user) {
      alert('Invalid username or password');
      return;
    }
  
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    window.location.href = 'dashboard.html';
  });