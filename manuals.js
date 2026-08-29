// ===== МЕТОДИЧЕСКИЕ ПОСОБИЯ =====

async function loadManuals() {
    const contentCards = document.getElementById('contentCards');
    if (!contentCards) return;

    const directions = [
        { key: 'adult', icon: '✦', title: 'Взрослая матрица' },
        { key: 'child', icon: '👶', title: 'Детская матрица' },
        { key: 'compatibility', icon: '💕', title: 'Матрица совместимости' },
        { key: 'vedic', icon: 'ॐ', title: 'Ведическая нумерология' },
        { key: 'pythagoras', icon: '🔢', title: 'Квадрат Пифагора' }
    ];

    contentCards.innerHTML = `
        <div class="cards">
            ${directions.map(item => `
                <div class="card" onclick="openManuals('${item.key}')">
                    <div class="card-icon">${item.icon}</div>
                    <div class="card-content">
                        <h3>${item.title}</h3>
                        <p>${item.title}<br>Методическое пособие</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

async function openManuals(direction) {
    alert('Здесь будет раздел методических пособий.');
}
