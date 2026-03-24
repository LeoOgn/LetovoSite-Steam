// ===================== STORAGE HELPERS =====================
const USERS_KEY = 'letovo_users';
const SESSION_KEY = 'letovo_session';

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
}

function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ===================== UI HELPERS =====================
function openModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

function setFieldError(fieldId, errorId, msg) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById(errorId);
  if (msg) {
    field.classList.add('error');
    err.textContent = msg;
  } else {
    field.classList.remove('error');
    err.textContent = '';
  }
}

function clearFormErrors(fields) {
  fields.forEach(({ fieldId, errorId }) => setFieldError(fieldId, errorId, ''));
}

function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

// ===================== AUTH STATE =====================
function updateAuthUI() {
  const user = getSession();
  const authButtons = document.getElementById('authButtons');
  const userMenu = document.getElementById('userMenu');
  const userAvatar = document.getElementById('userAvatar');
  const userNameEl = document.getElementById('userName');

  if (user) {
    authButtons.style.display = 'none';
    userMenu.style.display = 'flex';
    userAvatar.textContent = initials(user.name);
    userNameEl.textContent = user.name;
  } else {
    authButtons.style.display = 'flex';
    userMenu.style.display = 'none';
  }
}

// ===================== VALIDATION =====================
function validateRegister() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const grade = document.getElementById('regClass').value;
  let valid = true;

  clearFormErrors([
    { fieldId: 'regName', errorId: 'regNameError' },
    { fieldId: 'regEmail', errorId: 'regEmailError' },
    { fieldId: 'regPassword', errorId: 'regPasswordError' },
    { fieldId: 'regClass', errorId: 'regClassError' },
  ]);
  document.getElementById('registerError').textContent = '';

  if (!name || name.length < 2) {
    setFieldError('regName', 'regNameError', 'Введите имя и фамилию');
    valid = false;
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError('regEmail', 'regEmailError', 'Введите корректный email');
    valid = false;
  }

  if (!password || password.length < 6) {
    setFieldError('regPassword', 'regPasswordError', 'Пароль должен содержать не менее 6 символов');
    valid = false;
  }

  if (!grade) {
    setFieldError('regClass', 'regClassError', 'Выберите класс');
    valid = false;
  }

  return valid;
}

function validateLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  let valid = true;

  clearFormErrors([
    { fieldId: 'loginEmail', errorId: 'loginEmailError' },
    { fieldId: 'loginPassword', errorId: 'loginPasswordError' },
  ]);
  document.getElementById('loginError').textContent = '';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError('loginEmail', 'loginEmailError', 'Введите корректный email');
    valid = false;
  }

  if (!password) {
    setFieldError('loginPassword', 'loginPasswordError', 'Введите пароль');
    valid = false;
  }

  return valid;
}

// ===================== REGISTER =====================
document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();
  if (!validateRegister()) return;

  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const password = document.getElementById('regPassword').value;
  const grade = document.getElementById('regClass').value;

  const users = getUsers();

  if (users.find(u => u.email === email)) {
    document.getElementById('registerError').textContent = 'Пользователь с таким email уже зарегистрирован';
    return;
  }

  const user = { name, email, password, grade, createdAt: new Date().toISOString() };
  users.push(user);
  saveUsers(users);
  saveSession({ name, email, grade });

  closeModal('registerModal');
  updateAuthUI();
  showToast('Добро пожаловать, ' + name.split(' ')[0] + '!');
  this.reset();
});

// ===================== LOGIN =====================
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  if (!validateLogin()) return;

  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    document.getElementById('loginError').textContent = 'Неверный email или пароль';
    return;
  }

  saveSession({ name: user.name, email: user.email, grade: user.grade });
  closeModal('loginModal');
  updateAuthUI();
  showToast('С возвращением, ' + user.name.split(' ')[0] + '!');
  this.reset();
});

// ===================== LOGOUT =====================
document.getElementById('logoutBtn').addEventListener('click', function () {
  clearSession();
  updateAuthUI();
  showToast('Вы вышли из аккаунта');
});

// ===================== OPEN/CLOSE MODALS =====================
document.getElementById('openRegister').addEventListener('click', () => openModal('registerModal'));
document.getElementById('openLogin').addEventListener('click', () => openModal('loginModal'));

document.getElementById('closeRegister').addEventListener('click', () => closeModal('registerModal'));
document.getElementById('closeLogin').addEventListener('click', () => closeModal('loginModal'));

// Close on overlay click
document.getElementById('registerModal').addEventListener('click', function (e) {
  if (e.target === this) closeModal('registerModal');
});
document.getElementById('loginModal').addEventListener('click', function (e) {
  if (e.target === this) closeModal('loginModal');
});

// Close on Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeModal('registerModal');
    closeModal('loginModal');
  }
});

// Switch between modals
document.getElementById('switchToLogin').addEventListener('click', () => {
  closeModal('registerModal');
  openModal('loginModal');
});
document.getElementById('switchToRegister').addEventListener('click', () => {
  closeModal('loginModal');
  openModal('registerModal');
});

// Hero & banner buttons
document.getElementById('heroRegisterBtn').addEventListener('click', () => {
  const session = getSession();
  if (session) {
    showToast('Вы уже авторизованы!');
  } else {
    openModal('registerModal');
  }
});

// ===================== PASSWORD TOGGLE =====================
document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', function () {
    const target = document.getElementById(this.dataset.target);
    target.type = target.type === 'password' ? 'text' : 'password';
    this.style.color = target.type === 'text' ? '#1a3a6b' : '#aaa';
  });
});

// ===================== INIT =====================
updateAuthUI();
