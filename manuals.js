// ===== МЕТОДИЧЕСКИЕ ПОСОБИЯ =====

function loadManuals() {
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
                <div
                    class="card method-card"
                    onclick="openManual('${item.key}', '${item.title}')"
                >
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


function openManual(direction, title) {

    const old = document.getElementById('manualWindow');
    if (old) old.remove();

    const box = document.createElement('div');

    box.id = 'manualWindow';

    box.innerHTML = `
        <div style="
            position:fixed;
            inset:0;
            background:rgba(0,0,0,.65);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:99999;
        ">

            <div style="
                width:520px;
                max-width:90%;
                padding:30px;
                border-radius:20px;
                background:#21163f;
                border:1px solid #d7aa31;
                color:#f8e7a8;
                text-align:center;
            ">

                <button
                    onclick="document.getElementById('manualWindow').remove()"
                    style="
                        float:right;
                        background:none;
                        border:none;
                        color:#f6d66c;
                        font-size:28px;
                        cursor:pointer;
                    "
                >×</button>

                <h2 style="
                    font-family:Georgia,serif;
                    color:#f6d66c;
                    margin-top:10px;
                ">
                    ${title}
                </h2>

                <p style="margin:25px 0 10px;">
                    Методическое пособие
                </p>

                <input
                    id="manualUrlInput"
                    type="url"
                    placeholder="Вставьте ссылку"
                    style="
                        width:100%;
                        box-sizing:border-box;
                        padding:14px;
                        border-radius:10px;
                        border:1px solid #d7aa31;
                        background:#17112f;
                        color:white;
                        margin-bottom:15px;
                    "
                >

                <button
                    onclick="saveManualLink('${direction}', '${title}')"
                    style="
                        padding:13px 25px;
                        border-radius:10px;
                        border:1px solid #d7aa31;
                        background:#6b3b8f;
                        color:#f8e7a8;
                        cursor:pointer;
                        font-size:16px;
                    "
                >
                    🔗 Сохранить ссылку
                </button>

                <div style="
                    margin:22px 0;
                    color:#cfc4b0;
                ">
                    или
                </div>

                <input
                    id="manualFileInput"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    style="
                        width:100%;
                        margin-bottom:15px;
                    "
                >

                <button
                    onclick="uploadManualFile('${direction}', '${title}')"
                    style="
                        padding:13px 25px;
                        border-radius:10px;
                        border:1px solid #d7aa31;
                        background:#6b3b8f;
                        color:#f8e7a8;
                        cursor:pointer;
                        font-size:16px;
                    "
                >
                    📁 Загрузить файл
                </button>

            </div>
        </div>
    `;

    document.body.appendChild(box);
}


async function saveManualLink(direction, title) {

    const input = document.getElementById('manualUrlInput');

    const url = input ? input.value.trim() : '';

    if (!url) {
        return;
    }

    console.log('Методическое пособие:', direction);
    console.log('Ссылка:', url);

    alert('Ссылка сохранена');
}


async function uploadManualFile(direction, title) {

    const input = document.getElementById('manualFileInput');

    if (!input || !input.files.length) {
        return;
    }

    const file = input.files[0];

    console.log('Файл:', file.name);
    console.log('Раздел:', direction);

    alert('Файл выбран: ' + file.name);
}
