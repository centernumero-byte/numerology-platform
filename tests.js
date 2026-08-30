// =========================================================
// tests.gs — РАЗДЕЛ «ТЕСТЫ»
// Использует общий рендерер renderMaterialSection() из manuals.gs
// =========================================================

async function renderTests() {
  await renderMaterialSection({
    section: 'tests',
    contentType: 'test',
    subtitle: 'Тесты и практики'
  });
}

