// =========================================================
// main.gs — ЯДРО ПЛАТФОРМЫ
// Supabase, авторизация, регистрация, роли, доступы, навигация
// =========================================================

const SUPABASE_URL = "https://skvprhqsxnlacshucncq.supabase.co";
const SUPABASE_KEY = "sb_publishable_N0pKMmzNOonoInimmkding_GJnMwsRd";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Текущий профиль (заполняется в checkAuth)
let CURRENT_PROFILE = null; // { id, role, full_name, phone, email, curator_id }

// Направления и типы контента — используются во всех файлах *.gs
const DIRECTIONS = [
  { key: 'adult', title: 'Взрослая матрица', icon: '✦' },
  { key: 'child', title: 'Детская матрица', icon: '👶' },
  { key: 'compatibility', title: 'Матрица совместимости', icon: '💕' },
  { key: 'vedic', title: 'Ведическая нумерология', icon: 'ॐ' },
  { key: 'pythagoras', title: 'Квадрат Пифагора', icon: 'pythagoras' }
];

const CONTENT_TYPE_LABELS = {
  calculator: 'Калькуляторы',
  manual: 'Методические пособия',
  video: 'Видео',
  test: 'Тесты'
};

// =========================================================
// АВТОРИЗАЦИЯ / РЕГИСТРАЦИЯ / ВОССТАНОВЛЕНИЕ ПАРОЛЯ
// =========================================================

function showLogin() {
  document.body.style.visibility = "visible";
  document.body.innerHTML = `
    <div class="auth-wrap">
      <h2>Вход в Numerology Platform</h2>

      <input id="loginEmail" class="auth-input" type="email" placeholder="Email">
      <input id="loginPassword" class="auth-input" type="password" placeholder="Пароль">

      <button class="auth-button" onclick="loginUser()">Войти</button>

      <div>
        <button type="button" class="auth-link" onclick="showForgotPassword()">Забыли пароль?</button>
      </div>

      <div>
        <button type="button" class="auth-link" onclick="showRegister()">Зарегистрироваться</button>
      </div>

      <div id="loginError" class="auth-error"></div>
    </div>
  `;
}

async function loginUser() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const errorBox = document.getElementById("loginError");
  errorBox.textContent = "";

  if (!email || !password) {
    errorBox.textContent = "Введите email и пароль.";
    return;
  }

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error) {
    errorBox.textContent = "Неверный email или пароль.";
    return;
  }

  updateLastActivity();
  location.reload();
}

function showForgotPassword() {
  document.body.innerHTML = `
    <div class="auth-wrap">
      <h2>Восстановление пароля</h2>
      <input id="resetEmail" class="auth-input" type="email" placeholder="Введите ваш Email">
      <button class="auth-button" onclick="sendPasswordReset()">Отправить ссылку</button>
      <div id="resetMessage" class="auth-success"></div>
      <button type="button" class="auth-link" onclick="showLogin()">← Вернуться ко входу</button>
    </div>
  `;
  resetSent = false;
}

let resetSent = false;

async function sendPasswordReset() {
  const email = document.getElementById("resetEmail").value.trim();
  const message = document.getElementById("resetMessage");
  message.textContent = "";
  message.className = "";

  if (!email) {
    message.textContent = "Введите ваш Email.";
    message.className = "auth-error";
    return;
  }

  if (resetSent) {
    message.textContent = "Ссылка уже была отправлена. Проверьте вашу почту.";
    message.className = "auth-success";
    return;
  }

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + window.location.pathname
  });

  if (error) {
    message.textContent = "Не удалось отправить письмо. Попробуйте ещё раз.";
    message.className = "auth-error";
    return;
  }

  resetSent = true;
  message.textContent = "Ссылка для восстановления пароля отправлена на вашу почту.";
  message.className = "auth-success";
}

// ---------- РЕГИСТРАЦИЯ ----------

function showRegister() {
  document.body.style.visibility = "visible";
  document.body.innerHTML = `
    <div class="auth-wrap">
      <h2>Создать аккаунт</h2>

      <input id="regLastName" class="auth-input" type="text" placeholder="Фамилия">
      <input id="regFirstName" class="auth-input" type="text" placeholder="Имя">
      <input id="regMiddleName" class="auth-input" type="text" placeholder="Отчество">
      <input id="regPhone" class="auth-input" type="tel" placeholder="Телефон">
      <input id="regEmail" class="auth-input" type="email" placeholder="Email">
      <input id="regPassword" class="auth-input" type="password" placeholder="Пароль">
      <input id="regPasswordConfirm" class="auth-input" type="password" placeholder="Повторите пароль">

      <button class="auth-button" onclick="registerUser()">Создать аккаунт</button>

      <div id="registerMessage" class="auth-error"></div>

      <button type="button" class="auth-link" onclick="showLogin()">← Вернуться ко входу</button>
    </div>
  `;
}

async function registerUser() {
  const lastName = document.getElementById("regLastName").value.trim();
  const firstName = document.getElementById("regFirstName").value.trim();
  const middleName = document.getElementById("regMiddleName").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  const passwordConfirm = document.getElementById("regPasswordConfirm").value;
  const messageBox = document.getElementById("registerMessage");
  messageBox.className = "auth-error";
  messageBox.textContent = "";

  if (!lastName || !firstName || !phone || !email || !password) {
    messageBox.textContent = "Заполните все обязательные поля.";
    return;
  }

  if (password.length < 6) {
    messageBox.textContent = "Пароль должен быть не менее 6 символов.";
    return;
  }

  if (password !== passwordConfirm) {
    messageBox.textContent = "Пароли не совпадают.";
    return;
  }

  const fullName = [lastName, firstName, middleName].filter(Boolean).join(' ');

  const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({
    email, password
  });

  if (signUpError) {
    messageBox.textContent = "Не удалось создать аккаунт: " + signUpError.message;
    return;
  }

  const userId = signUpData.user ? signUpData.user.id : null;

  // Проверяем, было ли для этого email заранее создано приглашение
  // (администратором — для нумеролога, нумерологом — для ученицы)
  let role = 'student';
  let curatorId = null;

  try {
    const { data: invitation } = await supabaseClient
      .from('invitations')
      .select('id, role, curator_id, full_name, phone, used')
      .eq('email', email)
      .eq('used', false)
      .maybeSingle();

    if (invitation) {
      role = invitation.role;
      curatorId = invitation.curator_id;
    }
  } catch (e) {
    console.warn('Приглашение не найдено или недоступно:', e);
  }

  if (userId) {
    await supabaseClient.from('profiles').insert({
      id: userId,
      role,
      full_name: fullName,
      phone,
      email,
      curator_id: curatorId
    });

    try {
      await supabaseClient.from('invitations')
        .update({ used: true })
        .eq('email', email);
    } catch (e) { /* не критично */ }
  }

  messageBox.className = "auth-success";

  if (signUpData.session) {
    // Email-подтверждение отключено в проекте — сразу входим
    messageBox.textContent = "Аккаунт создан. Выполняется вход...";
    updateLastActivity();
    setTimeout(() => location.reload(), 800);
  } else {
    messageBox.textContent = "Аккаунт создан. Проверьте почту, чтобы подтвердить email, затем войдите.";
    setTimeout(() => showLogin(), 2500);
  }
}

// =========================================================
// ПРОВЕРКА СЕССИИ И ЗАГРУЗКА ПРОФИЛЯ
// =========================================================

async function checkAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();

  if (!session) {
    showLogin();
    return;
  }

  const userId = session.user.id;

  const { data: profile, error } = await supabaseClient
    .from('profiles')
    .select('id, role, full_name, phone, email, curator_id')
    .eq('id', userId)
    .maybeSingle();

  if (error || !profile) {
    alert("Не удалось загрузить профиль. Обратитесь к администратору.");
    await supabaseClient.auth.signOut();
    showLogin();
    return;
  }

  CURRENT_PROFILE = profile;

  startInactivityTimer();
  document.body.style.visibility = "visible";
  renderPlatformShell();
  renderNav();
  setActiveSection('calculators');
  renderCalculators();
}

function renderPlatformShell() {
  const roleLabels = { admin: 'Администратор', numerologist: 'Нумеролог', student: 'Ученица' };

  document.body.innerHTML = `
    <div class="platform">
      <aside class="sidebar">
        <div class="logo">
          <div class="logo-symbol">✧</div>
          <div class="logo-title">NUMEROLOGY</div>
          <div class="logo-subtitle">Platform</div>
          <div class="role-badge">${roleLabels[CURRENT_PROFILE.role] || ''}</div>
        </div>

        <div class="nav" id="navContainer"></div>

        <button class="nav-item logout" onclick="logoutUser()">
          <span class="nav-icon">🚪</span> Выйти
        </button>
      </aside>

      <main class="main">
        <div class="top">
          <div class="welcome">
            <h1>Добро пожаловать, <span id="clientName">${CURRENT_PROFILE.full_name || ''}</span>! ✨</h1>
          </div>
          <div class="account">
            <div class="account-icon">♙</div>
            <span id="clientEmail">${CURRENT_PROFILE.email || ''}</span>
          </div>
        </div>

        <div class="cards" id="contentCards"></div>
      </main>
    </div>
  `;
}

function renderNav() {
  const navContainer = document.getElementById('navContainer');
  if (!navContainer) return;

  const items = [
    { key: 'calculators', icon: '▦', title: 'Калькуляторы' },
    { key: 'manuals', icon: '📖', title: 'Методические пособия' },
    { key: 'videos', icon: '▶', title: 'Видео' },
    { key: 'tests', icon: '✎', title: 'Тесты' },
    { key: 'library', icon: '📚', title: 'Библиотека нумеролога' },
    { key: 'my-calculations', icon: '▤', title: 'Мои расчёты' },
    { key: 'access', icon: '🔑', title: 'Доступы' }
  ];

  if (CURRENT_PROFILE.role === 'admin') {
    items.push({ key: 'statistics', icon: '▥', title: 'Отчёты и статистика' });
  }

  navContainer.innerHTML = items.map(item => `
    <button class="nav-item" data-section="${item.key}" onclick="showSection('${item.key}')">
      <span class="nav-icon">${item.icon}</span> ${item.title}
    </button>
  `).join('');
}

function setActiveSection(section) {
  document.querySelectorAll('.nav-item[data-section]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === section);
  });
}

async function showSection(section) {
  const contentCards = document.getElementById('contentCards');
  if (!contentCards) return;

  setActiveSection(section);

  if (section === 'calculators') return renderCalculators();
  if (section === 'manuals') return renderManuals();
  if (section === 'videos') return renderVideos();
  if (section === 'tests') return renderTests();
  if (section === 'library') return renderLibrary();
  if (section === 'my-calculations') return renderMyCalculations();
  if (section === 'access') return renderAccess();
  if (section === 'statistics') return renderStatistics();
}

// =========================================================
// ДВИЖОК ДОСТУПОВ
// =========================================================

// Возвращает { calculator: {adult:true,...}, manual: {...}, video: {...}, test: {...} }
async function getAccessMap(userId) {
  const map = {};
  Object.keys(CONTENT_TYPE_LABELS).forEach(ct => {
    map[ct] = {};
    DIRECTIONS.forEach(d => { map[ct][d.key] = false; });
  });

  if (!userId) return map;

  const { data, error } = await supabaseClient
    .from('access_grants')
    .select('content_type, direction_key, is_open')
    .eq('user_id', userId);

  if (error) {
    console.error('Ошибка загрузки доступов:', error);
    return map;
  }

  (data || []).forEach(row => {
    if (map[row.content_type]) map[row.content_type][row.direction_key] = !!row.is_open;
  });

  return map;
}

async function hasAccess(contentType, directionKey) {
  if (!CURRENT_PROFILE) return false;
  if (CURRENT_PROFILE.role === 'admin') return true;

  const { data, error } = await supabaseClient
    .from('access_grants')
    .select('is_open')
    .eq('user_id', CURRENT_PROFILE.id)
    .eq('content_type', contentType)
    .eq('direction_key', directionKey)
    .maybeSingle();

  if (error || !data) return false;
  return !!data.is_open;
}

async function setAccessGrant(userId, contentType, directionKey, isOpen) {
  return supabaseClient.from('access_grants').upsert({
    user_id: userId,
    content_type: contentType,
    direction_key: directionKey,
    is_open: isOpen,
    granted_by: CURRENT_PROFILE.id,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id,content_type,direction_key' });
}

function curatorReferralText() {
  if (!CURRENT_PROFILE) return '';
  if (CURRENT_PROFILE.role === 'student') return 'Обратитесь к своему нумерологу.';
  if (CURRENT_PROFILE.role === 'numerologist') return 'Обратитесь к администратору.';
  return '';
}

// Показывает сообщение "нет доступа" поверх контента
function showNoAccessMessage(title) {
  const old = document.getElementById('noAccessBox');
  if (old) old.remove();

  const box = document.createElement('div');
  box.id = 'noAccessBox';
  box.innerHTML = `
    <div class="no-access-overlay">
      <div class="no-access-box">
        <h3>${title || 'Доступ ограничен'}</h3>
        <p>У вас нет доступа к этому разделу.</p>
        <p>${curatorReferralText()}</p>
        <button onclick="document.getElementById('noAccessBox').remove()">Понятно</button>
      </div>
    </div>
  `;
  document.body.appendChild(box);
}

async function logUsage(contentType, directionKey, action) {
  if (!CURRENT_PROFILE) return;
  try {
    await supabaseClient.from('usage_logs').insert({
      user_id: CURRENT_PROFILE.id,
      content_type: contentType,
      direction_key: directionKey,
      action
    });
  } catch (e) { /* не критично для UI */ }
}

// =========================================================
// РАЗДЕЛ «ДОСТУПЫ»
// =========================================================

async function renderAccess() {
  const contentCards = document.getElementById('contentCards');
  if (!contentCards) return;

  if (CURRENT_PROFILE.role === 'admin') {
    return renderAccessForManager('numerologist', 'Нумерологи', null);
  }

  if (CURRENT_PROFILE.role === 'numerologist') {
    return renderAccessForManager('student', 'Ученицы', CURRENT_PROFILE.id);
  }

  return renderAccessReadOnly();
}

// Для admin (управляет нумерологами) и numerologist (управляет ученицами)
async function renderAccessForManager(targetRole, targetLabel, curatorFilterId) {
  const contentCards = document.getElementById('contentCards');

  contentCards.innerHTML = `
    <div class="dashboard-wrap">
      <div class="dashboard-head">
        <div>
          <h2>Доступы</h2>
          <p>Управление доступом: ${targetLabel}.</p>
        </div>
      </div>

      <div class="invite-form">
        <h3>Пригласить: ${targetRole === 'numerologist' ? 'нумеролог' : 'ученица'}</h3>
        <input id="inviteLastName" placeholder="Фамилия">
        <input id="inviteFirstName" placeholder="Имя">
        <input id="invitePhone" placeholder="Телефон">
        <input id="inviteEmail" type="email" placeholder="Email">
        <button onclick="createInvitation('${targetRole}')">Пригласить</button>
        <div id="inviteMessage" class="invite-message"></div>
        <p style="font-size:13px;color:#cfc4b0;margin-top:10px;">
          После этого попросите человека зарегистрироваться на платформе с указанным email —
          роль и доступ будут назначены автоматически.
        </p>
      </div>

      <div class="people-list" id="peopleList">Загрузка...</div>
    </div>
  `;

  let query = supabaseClient
    .from('profiles')
    .select('id, full_name, phone, email, role, created_at')
    .eq('role', targetRole);

  if (curatorFilterId) query = query.eq('curator_id', curatorFilterId);

  const { data: people, error } = await query.order('created_at', { ascending: false });

  const peopleList = document.getElementById('peopleList');

  if (error) {
    peopleList.innerHTML = `<div class="empty-table">Не удалось загрузить список.</div>`;
    return;
  }

  if (!people || people.length === 0) {
    peopleList.innerHTML = `<div class="empty-table">Пока никто не зарегистрирован.</div>`;
    return;
  }

  peopleList.innerHTML = people.map(p => `
    <div class="person-row" onclick="togglePersonGrid('${p.id}')">
      <div class="person-row-head">
        <div>
          <div class="person-name">${p.full_name || '(без имени)'}</div>
          <div class="person-meta">${p.email || ''} ${p.phone ? '· ' + p.phone : ''}</div>
        </div>
        <span class="nav-icon">▾</span>
      </div>
      <div class="access-grid-wrap" id="grid-${p.id}"></div>
    </div>
  `).join('');
}

async function togglePersonGrid(personId) {
  const wrap = document.getElementById('grid-' + personId);
  if (!wrap) return;

  const isOpen = wrap.classList.contains('open');
  document.querySelectorAll('.access-grid-wrap.open').forEach(el => el.classList.remove('open'));

  if (isOpen) return;

  wrap.classList.add('open');
  wrap.innerHTML = 'Загрузка...';

  const accessMap = await getAccessMap(personId);

  const contentTypes = Object.keys(CONTENT_TYPE_LABELS);

  wrap.innerHTML = `
    <table class="access-grid" onclick="event.stopPropagation()">
      <thead>
        <tr>
          <th>Раздел</th>
          ${contentTypes.map(ct => `<th>${CONTENT_TYPE_LABELS[ct]}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${DIRECTIONS.map(d => `
          <tr>
            <td>${d.title}</td>
            ${contentTypes.map(ct => `
              <td>
                <input type="checkbox"
                  ${accessMap[ct][d.key] ? 'checked' : ''}
                  onclick="event.stopPropagation()"
                  onchange="onAccessCheckboxChange('${personId}', '${ct}', '${d.key}', this.checked)">
              </td>
            `).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

async function onAccessCheckboxChange(userId, contentType, directionKey, checked) {
  const { error } = await setAccessGrant(userId, contentType, directionKey, checked);
  if (error) {
    alert('Не удалось сохранить изменение доступа: ' + error.message);
  }
}

async function createInvitation(role) {
  const lastName = document.getElementById('inviteLastName').value.trim();
  const firstName = document.getElementById('inviteFirstName').value.trim();
  const phone = document.getElementById('invitePhone').value.trim();
  const email = document.getElementById('inviteEmail').value.trim();
  const messageBox = document.getElementById('inviteMessage');
  messageBox.style.color = '#ff8a8a';

  if (!lastName || !firstName || !email) {
    messageBox.textContent = 'Заполните фамилию, имя и email.';
    return;
  }

  const { error } = await supabaseClient.from('invitations').insert({
    email,
    full_name: [lastName, firstName].filter(Boolean).join(' '),
    phone,
    role,
    curator_id: CURRENT_PROFILE.id,
    invited_by: CURRENT_PROFILE.id
  });

  if (error) {
    messageBox.textContent = 'Не удалось создать приглашение: ' + error.message;
    return;
  }

  messageBox.style.color = '#9be79b';
  messageBox.textContent = 'Приглашение создано. Сообщите email для регистрации.';
  document.getElementById('inviteLastName').value = '';
  document.getElementById('inviteFirstName').value = '';
  document.getElementById('invitePhone').value = '';
  document.getElementById('inviteEmail').value = '';

  renderAccess();
}

// Для ученицы: только просмотр своего доступа
async function renderAccessReadOnly() {
  const contentCards = document.getElementById('contentCards');

  contentCards.innerHTML = `
    <div class="dashboard-wrap">
      <div class="dashboard-head">
        <div>
          <h2>Доступы</h2>
          <p>Разделы, которые вам открыты.</p>
        </div>
      </div>
      <div class="table-card" id="accessTable">Загрузка...</div>
    </div>
  `;

  const accessMap = await getAccessMap(CURRENT_PROFILE.id);
  const contentTypes = Object.keys(CONTENT_TYPE_LABELS);

  const rows = DIRECTIONS.map(d => `
    <tr>
      <td>${d.title}</td>
      ${contentTypes.map(ct => `<td>${accessMap[ct][d.key] ? '✔ открыто' : '— закрыто'}</td>`).join('')}
    </tr>
  `).join('');

  document.getElementById('accessTable').innerHTML = `
    <table class="data-table">
      <thead>
        <tr><th>Раздел</th>${contentTypes.map(ct => `<th>${CONTENT_TYPE_LABELS[ct]}</th>`).join('')}</tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

// =========================================================
// МОИ РАСЧЁТЫ
// =========================================================

function renderMyCalculations() {
  const contentCards = document.getElementById('contentCards');
  if (!contentCards) return;

  contentCards.innerHTML = `
    <div class="dashboard-wrap">
      <div class="dashboard-head">
        <div>
          <h2>Мои расчёты</h2>
          <p>История ваших расчётов будет отображаться здесь.</p>
        </div>
        <div class="dashboard-badge">Личный кабинет</div>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><span>Всего расчётов</span><strong>0</strong></div>
        <div class="stat-card"><span>За этот месяц</span><strong>0</strong></div>
        <div class="stat-card"><span>Последний расчёт</span><strong>—</strong></div>
      </div>
      <div class="table-card">
        <div class="table-title">История расчётов</div>
        <div class="empty-table">Пока нет сохранённых расчётов.</div>
      </div>
    </div>
  `;
}

// =========================================================
// ОТЧЁТЫ И СТАТИСТИКА (только администратор)
// =========================================================

async function renderStatistics() {
  const contentCards = document.getElementById('contentCards');
  if (!contentCards) return;

  contentCards.innerHTML = `
    <div class="dashboard-wrap">
      <div class="dashboard-head">
        <div>
          <h2>Отчёты и статистика</h2>
          <p>Основные показатели платформы.</p>
        </div>
        <div class="dashboard-badge">Обзор</div>
      </div>
      <div class="stats-grid" id="platformStats">
        <div class="stat-card"><span>Нумерологов</span><strong>…</strong></div>
        <div class="stat-card"><span>Учениц</span><strong>…</strong></div>
        <div class="stat-card"><span>Материалов</span><strong>…</strong></div>
        <div class="stat-card"><span>Действий за 7 дней</span><strong>…</strong></div>
      </div>
      <div class="table-card">
        <div class="table-title">Последние действия пользователей</div>
        <table class="data-table">
          <thead><tr><th>Пользователь</th><th>Раздел</th><th>Направление</th><th>Действие</th><th>Когда</th></tr></thead>
          <tbody id="usageRows"><tr><td colspan="5">Загрузка...</td></tr></tbody>
        </table>
      </div>
    </div>
  `;

  try {
    const [{ count: numerologistCount }, { count: studentCount }, { count: materialCount }] = await Promise.all([
      supabaseClient.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'numerologist'),
      supabaseClient.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
      supabaseClient.from('materials').select('id', { count: 'exact', head: true })
    ]);

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: recentActionCount } = await supabaseClient
      .from('usage_logs').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo);

    document.getElementById('platformStats').innerHTML = `
      <div class="stat-card"><span>Нумерологов</span><strong>${numerologistCount ?? 0}</strong></div>
      <div class="stat-card"><span>Учениц</span><strong>${studentCount ?? 0}</strong></div>
      <div class="stat-card"><span>Материалов</span><strong>${materialCount ?? 0}</strong></div>
      <div class="stat-card"><span>Действий за 7 дней</span><strong>${recentActionCount ?? 0}</strong></div>
    `;

    const { data: logs } = await supabaseClient
      .from('usage_logs')
      .select('content_type, direction_key, action, created_at, profiles(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(20);

    const rows = (logs || []).map(l => `
      <tr>
        <td>${l.profiles ? (l.profiles.full_name || l.profiles.email) : '—'}</td>
        <td>${CONTENT_TYPE_LABELS[l.content_type] || l.content_type || '—'}</td>
        <td>${(DIRECTIONS.find(d => d.key === l.direction_key) || {}).title || l.direction_key || '—'}</td>
        <td>${l.action || '—'}</td>
        <td>${new Date(l.created_at).toLocaleString('ru-RU')}</td>
      </tr>
    `).join('');

    document.getElementById('usageRows').innerHTML = rows || `<tr><td colspan="5">Действий пока нет.</td></tr>`;

  } catch (error) {
    console.error('Ошибка статистики:', error);
    document.getElementById('platformStats').innerHTML = `<div class="empty-table">Не удалось загрузить статистику.</div>`;
  }
}

// =========================================================
// ВЫХОД / АВТОВЫХОД ПО БЕЗДЕЙСТВИЮ
// =========================================================

const INACTIVITY_LIMIT = 60 * 60 * 1000; // 1 час
const LAST_ACTIVITY_KEY = "numerology_last_activity";
let inactivityTimer = null;

function updateLastActivity() {
  localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => autoLogoutAfterInactivity(), INACTIVITY_LIMIT);
}

async function autoLogoutAfterInactivity() {
  const lastActivity = Number(localStorage.getItem(LAST_ACTIVITY_KEY) || 0);
  const inactiveTime = Date.now() - lastActivity;

  if (inactiveTime >= INACTIVITY_LIMIT) {
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    await supabaseClient.auth.signOut();
    showLogin();
    return;
  }

  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(autoLogoutAfterInactivity, INACTIVITY_LIMIT - inactiveTime);
}

function startInactivityTimer() {
  const lastActivity = Number(localStorage.getItem(LAST_ACTIVITY_KEY) || 0);
  if (lastActivity && Date.now() - lastActivity >= INACTIVITY_LIMIT) {
    autoLogoutAfterInactivity();
    return;
  }
  updateLastActivity();
}

["click", "keydown", "mousemove", "scroll", "touchstart"].forEach(eventName => {
  document.addEventListener(eventName, () => updateLastActivity(), { passive: true });
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) autoLogoutAfterInactivity();
});

async function logoutUser() {
  try {
    await supabaseClient.auth.signOut();
  } catch (error) {
    console.error('Ошибка выхода:', error);
  }
  localStorage.removeItem(LAST_ACTIVITY_KEY);
  clearTimeout(inactivityTimer);
  CURRENT_PROFILE = null;
  showLogin();
}

// =========================================================
// ЗАПУСК
// =========================================================

checkAuth();
