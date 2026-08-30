// =========================================================
// library.gs — РАЗДЕЛ «БИБЛИОТЕКА НУМЕРОЛОГА»
// Видна всем пользователям платформы. Добавлять/менять ссылку
// может только администратор — нумерологи и ученицы только смотрят.
// =========================================================

async function renderLibrary() {
  const contentCards = document.getElementById('contentCards');
  if (!contentCards) return;

  contentCards.innerHTML = 'Загрузка...';

  const { data } = await supabaseClient
    .from('materials')
    .select('*')
    .eq('section', 'library')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const link = data ? (data.external_url || data.file_url || '') : '';
  const isAdmin = CURRENT_PROFILE.role === 'admin';

  contentCards.innerHTML = `
    <div class="card library-main-card" onclick="openLibrary(${JSON.stringify(link)}, ${isAdmin})" role="button" tabindex="0">
      <div class="card-icon library-icon">📚</div>
      <div class="card-content">
        <h3>Библиотека<br>нумеролога</h3>
        <p>${link ? 'Все книги и материалы' : (isAdmin ? 'Ссылка не добавлена — нажмите, чтобы добавить' : 'Материалы скоро появятся')}</p>
      </div>
    </div>
  `;
}

async function openLibrary(link, isAdmin) {
  await logUsage('library', 'library', link ? 'open' : 'view');

  if (link) {
    window.open(link, '_blank', 'noopener,noreferrer');
    return;
  }

  if (isAdmin) {
    showLibraryManager();
  } else {
    alert('Библиотека пока не наполнена материалами.');
  }
}

function showLibraryManager() {
  const old = document.getElementById('materialManager');
  if (old) old.remove();

  const box = document.createElement('div');
  box.id = 'materialManager';

  box.innerHTML = `
    <div class="material-manager-overlay">
      <div class="material-manager">
        <button class="material-manager-close" onclick="document.getElementById('materialManager').remove()">×</button>
        <h2>Библиотека нумеролога</h2>
        <label>Ссылка на папку с материалами (например, Google Drive):</label>
        <input id="libraryUrlInput" type="url" placeholder="https://..." class="material-manager-input">
        <button class="material-manager-button" onclick="saveLibraryUrl()">🔗 Сохранить ссылку</button>
      </div>
    </div>
  `;

  document.body.appendChild(box);
}

async function saveLibraryUrl() {
  const input = document.getElementById('libraryUrlInput');
  const url = input ? input.value.trim() : '';
  if (!url) return;

  const { error } = await supabaseClient.from('materials').insert({
    section: 'library',
    title: 'Библиотека нумеролога',
    external_url: url,
    uploaded_by: CURRENT_PROFILE.id
  });

  if (error) {
    alert('Не удалось сохранить ссылку: ' + error.message);
    return;
  }

  document.getElementById('materialManager').remove();
  renderLibrary();
}

