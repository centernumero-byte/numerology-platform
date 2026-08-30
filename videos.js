// =========================================================
// videos.gs — РАЗДЕЛ «ВИДЕО»
// Использует общий рендерер renderMaterialSection() из manuals.gs
// =========================================================

async function renderVideos() {
  await renderMaterialSection({
    section: 'videos',
    contentType: 'video',
    subtitle: 'Видео'
  });
}
