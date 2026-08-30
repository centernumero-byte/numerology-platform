// =========================================================
// manuals.gs — РАЗДЕЛ «МЕТОДИЧЕСКИЕ ПОСОБИЯ»
// Загружать материалы могут: admin, numerologist.
// Ученицы — только просматривают/скачивают открытые им направления.
// =========================================================

async function renderManuals() {
  await renderMaterialSection({
    section: 'manuals',
    contentType: 'manual',
    subtitle: 'Методическое пособие'
  });
}

// Общая функция отрисовки карточек направления для раздела материалов
// (используется manuals.gs и videos.gs)
async function renderMaterialSection(options) {
  const { section, contentType, subtitle } = options;
  const contentCards = document.getElementById('contentCards');
  if (!contentCards) return;

  contentCards.innerHTML = 'Загрузка...';

  const [accessMap, materialsResult] = await Promise.all([
    getAccessMap(CURRENT_PROFILE.id),
    supabaseClient.from('materials').select('*').eq('section', section)
  ]);

  const materials = materialsResult.data || [];
  const canUpload = CURRENT_PROFILE.role === 'admin' || CURRENT_PROFILE.role === 'numerologist';

  contentCards.innerHTML = DIRECTIONS.map(d => {
    const open = CURRENT_PROFILE.role === 'admin' || accessMap[contentType][d.key];
    const item = findMaterialForDirection(materials, d.key);
    const link = item ? (item.external_url || item.file_url || '') : '';
    const icon = d.icon === 'pythagoras' ? pythagorasIconHtml() : `<div class="card-icon">${d.icon}</div>`;

    let description = subtitle;
    if (!open) description = 'Нет доступа';
    else if (!link) description = canUpload ? 'Материал не добавлен — нажмите, чтобы добавить' : 'Материал пока не добавлен';

    return `
      <div class="card method-card ${open ? '' : 'locked'}" style="position:relative"
           onclick="onMaterialCardClick('${section}', '${contentType}', '${d.key}', ${open}, ${JSON.stringify(link)}, ${JSON.stringify(d.title)}, ${canUpload})">
        ${open ? '' : '<span class="card-lock-icon">🔒</span>'}
        ${icon}
        <div class="card-content">
          <h3>${d.title}</h3>
          <p>${description}</p>
        </div>
      </div>
    `;
  }).join('');
}

function findMaterialForDirection(materials, directionKey) {
  return (materials || []).find(item => {
    const fields = [item.method, item.direction_key, item.type_key, item.slug, item.title].filter(Boolean).map(normalizeKey);
    return fields.includes(normalizeKey(directionKey));
  }) || null;
}

function normalizeKey(value) {
  return String(value || '').toLowerCase().trim().replace(/ё/g, 'е').replace(/[«»"'`]/g, '').replace(/\s+/g, ' ');
}

async function onMaterialCardClick(section, contentType, directionKey, open, link, title, canUpload) {
  if (!open) {
    showNoAccessMessage(title);
    return;
  }

  await logUsage(contentType, directionKey, link ? 'open' : 'view');

  if (link) {
    window.open(link, '_blank', 'noopener,noreferrer');
    return;
  }

  if (canUpload) {
    showMaterialManager(section, directionKey, title);
  } else {
    alert(title + '\n\nМатериал пока не добавлен.');
  }
}

// ---------- ЗАГРУЗКА МАТЕРИАЛА (ссылка или файл) ----------

function showMaterialManager(section, directionKey, title) {
  const old = document.getElementById('materialManager');
  if (old) old.remove();

  const box = document.createElement('div');
  box.id = 'materialManager';

  box.innerHTML = `
    <div class="material-manager-overlay">
      <div class="material-manager">
        <button class="material-manager-close" onclick="document.getElementById('materialManager').remove()">×</button>
        <h2>${title}</h2>

        <label>Вставить ссылку:</label>
        <input id="materialUrlInput" type="url" placeholder="https://..." class="material-manager-input">
        <button class="material-manager-button" onclick="saveMaterialUrl('${section}', '${directionKey}', ${JSON.stringify(title)})">
          🔗 Сохранить ссылку
        </button>

        <div class="material-manager-or">или</div>

        <label>Загрузить файл:</label>
        <input id="materialFileInput" type="file" class="material-manager-input">
        <button class="material-manager-button" onclick="uploadMaterialFile('${section}', '${directionKey}', ${JSON.stringify(title)})">
          📁 Загрузить
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(box);
}

async function saveMaterialUrl(section, directionKey, title) {
  const input = document.getElementById('materialUrlInput');
  const url = input ? input.value.trim() : '';
  if (!url) return;

  const { error } = await supabaseClient.from('materials').insert({
    section,
    method: directionKey,
    title,
    external_url: url,
    uploaded_by: CURRENT_PROFILE.id
  });

  if (error) {
    alert('Не удалось сохранить ссылку: ' + error.message);
    return;
  }

  document.getElementById('materialManager').remove();
  showSection(section === 'manuals' ? 'manuals' : section);
}

async function uploadMaterialFile(section, directionKey, title) {
  const input = document.getElementById('materialFileInput');
  if (!input || !input.files.length) return;

  const file = input.files[0];
  const path = `${section}/${directionKey}/${Date.now()}_${file.name}`;

  const { error: uploadError } = await supabaseClient.storage.from('materials').upload(path, file);

  if (uploadError) {
    alert('Не удалось загрузить файл: ' + uploadError.message);
    return;
  }

  const { data: publicUrlData } = supabaseClient.storage.from('materials').getPublicUrl(path);

  const { error } = await supabaseClient.from('materials').insert({
    section,
    method: directionKey,
    title,
    file_url: publicUrlData ? publicUrlData.publicUrl : null,
    uploaded_by: CURRENT_PROFILE.id
  });

  if (error) {
    alert('Файл загружен, но не удалось сохранить запись: ' + error.message);
    return;
  }

  document.getElementById('materialManager').remove();
  showSection(section);
}
