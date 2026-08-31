// ============================================================
// MANUAL.JS — МЕТОДИЧЕСКИЕ ПОСОБИЯ
// ============================================================

const MANUALS_BUCKET = 'Methodicals';

const MANUAL_DIRECTIONS = [
    {
        key: 'adult',
        icon: '✦',
        title: 'Взрослая матрица'
    },
    {
        key: 'child',
        icon: '👶',
        title: 'Детская матрица'
    },
    {
        key: 'compatibility',
        icon: '💕',
        title: 'Матрица совместимости'
    },
    {
        key: 'vedic',
        icon: 'ॐ',
        title: 'Ведическая нумерология'
    },
    {
        key: 'pythagoras',
        icon: '🔢',
        title: 'Квадрат Пифагора'
    }
];

// ============================================================
// ЭКРАНИРОВАНИЕ
// ============================================================

function manualEscape(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ============================================================
// ОПРЕДЕЛЕНИЕ НАПРАВЛЕНИЯ
// ============================================================

function manualDirectionFromText(value) {

    const text = String(value || '').toLowerCase();

    if (
        text.includes('взросл') ||
        text.includes('adult')
    ) {
        return 'adult';
    }

    if (
        text.includes('детск') ||
        text.includes('child')
    ) {
        return 'child';
    }

    if (
        text.includes('совмест') ||
        text.includes('compatibility')
    ) {
        return 'compatibility';
    }

    if (
        text.includes('ведичес') ||
        text.includes('vedic')
    ) {
        return 'vedic';
    }

    if (
        text.includes('пифагор') ||
        text.includes('pythagoras') ||
        text.includes('психоматриц')
    ) {
        return 'pythagoras';
    }

    return null;
}

// ============================================================
// ИКОНКА
// ============================================================

function manualIconHtml(item) {

    if (item.key === 'pythagoras') {

        return `
            <div class="card-icon pythagoras-icon">
                <span>1</span>
                <span>4</span>
                <span>7</span>
                <span>2</span>
                <span>5</span>
                <span>8</span>
                <span>3</span>
                <span>6</span>
                <span>9</span>
            </div>
        `;
    }

    return `
        <div class="card-icon">
            ${item.icon}
        </div>
    `;
}

// ============================================================
// СТИЛИ
// ============================================================

function injectManualStyles() {

    if (document.getElementById('manualStyles')) {
        return;
    }

    const style = document.createElement('style');

    style.id = 'manualStyles';

    style.textContent = `

        #manualCards {
            display: grid !important;
            grid-template-columns: repeat(5, 180px) !important;
            gap: 20px !important;
            width: 100% !important;
            justify-content: start !important;
            align-items: start !important;
        }

        #manualCards .method-card {
            width: 180px !important;
            min-width: 180px !important;
            max-width: 180px !important;
            height: 250px !important;
            min-height: 250px !important;

            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;

            text-align: center !important;
            box-sizing: border-box !important;

            cursor: pointer !important;
        }

        #manualCards .method-card .card-content {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;

            width: 100% !important;
            flex: 1 !important;
        }

        #manualCards .method-card h3 {
            margin: 14px 8px 8px !important;
            line-height: 1.15 !important;
        }

        #manualCards .method-card p {
            margin: 0 !important;
            font-size: 14px !important;
        }

        #manualCards .card-icon {
            font-size: 52px !important;
            line-height: 1 !important;
            margin-top: 10px !important;
        }

        #manualCards .pythagoras-icon {
            width: 72px !important;
            margin: 10px auto 0 !important;

            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 2px !important;

            font-size: 16px !important;
            line-height: 1.2 !important;
            font-weight: 600 !important;
        }

        #manualCards .pythagoras-icon span {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .manual-status {
            margin-top: 8px;
            font-size: 12px;
            opacity: .85;
        }

        .material-manager-overlay {
            position: fixed;
            inset: 0;
            z-index: 99999;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 20px;

            background: rgba(0,0,0,.65);
            box-sizing: border-box;
        }

        .material-manager {
            position: relative;

            width: min(560px, 95vw);
            max-height: 90vh;
            overflow-y: auto;

            box-sizing: border-box;
            padding: 28px;

            border-radius: 22px;

            background:
                linear-gradient(
                    145deg,
                    #5559d8,
                    #30349e
                );

            border: 1px solid rgba(255,230,130,.8);

            box-shadow:
                0 20px 60px rgba(0,0,0,.45);

            color: white;
        }

        .material-manager h2 {
            margin: 0 45px 25px 0;
            font-size: 27px;
            color: #fff2a0;
        }

        .material-manager-close {
            position: absolute;
            right: 18px;
            top: 14px;

            width: 36px;
            height: 36px;

            border: none;
            background: transparent;

            color: #fff2a0;
            font-size: 30px;
            line-height: 30px;

            cursor: pointer;
        }

        .material-manager label {
            display: block;
            margin: 15px 0 8px;

            font-weight: 600;
            color: white;
        }

        .material-manager-input {
            width: 100%;
            box-sizing: border-box;

            padding: 13px 15px;

            border-radius: 12px;
            border: 1px solid rgba(255,255,255,.65);

            background: rgba(255,255,255,.12);
            color: white;

            outline: none;
            font-size: 15px;
        }

        .material-manager-input::placeholder {
            color: rgba(255,255,255,.7);
        }

        .material-manager-input[type="file"] {
            padding: 10px;
        }

        .material-manager-button {
            margin-top: 12px;

            padding: 12px 18px;

            border-radius: 12px;
            border: 1px solid #fff1a0;

            background: rgba(255,255,255,.14);
            color: white;

            font-size: 15px;
            font-weight: 600;

            cursor: pointer;
        }

        .material-manager-button:hover {
            background: rgba(255,255,255,.25);
        }

        .material-manager-or {
            margin: 20px 0;

            text-align: center;
            color: #fff2a0;
            font-weight: 600;
        }

        #manualActionMessage {
            min-height: 22px;
            margin-top: 18px;
            line-height: 1.5;
        }

        @media (max-width: 1100px) {

            #manualCards {
                grid-template-columns:
                    repeat(3, 180px) !important;
            }
        }

        @media (max-width: 700px) {

            #manualCards {
                grid-template-columns:
                    repeat(2, 180px) !important;
            }
        }

        @media (max-width: 460px) {

            #manualCards {
                grid-template-columns:
                    180px !important;
            }
        }
    `;

    document.head.appendChild(style);
}

// ============================================================
// АДМИНИСТРАТОР
// ============================================================

async function isManualAdmin() {

    try {

        const {
            data: {
                session
            }
        } = await supabaseClient.auth.getSession();

        if (!session || !session.user) {
            return false;
        }

        const email =
            String(session.user.email || '')
                .trim()
                .toLowerCase();

        if (email === 'centernumero@gmail.com') {
            return true;
        }

        if (window.currentUserIsAdmin === true) {
            return true;
        }

        if (
            window.currentUser &&
            (
                window.currentUser.role === 'admin' ||
                window.currentUser.role === 'administrator'
            )
        ) {
            return true;
        }

        return false;

    } catch (error) {

        console.error(
            'Ошибка проверки администратора:',
            error
        );

        return false;
    }
}

// ============================================================
// СЕССИЯ
// ============================================================

async function getManualSession() {

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getSession();

        if (error) {
            console.error(error);
            return null;
        }

        return data?.session || null;

    } catch (error) {

        console.error(error);
        return null;
    }
}

// ============================================================
// ЗАГРУЗКА МАТЕРИАЛОВ
// ============================================================

async function getSavedManuals() {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from('materials')
            .select('*')
            .eq('section', 'manuals');

        if (error) {

            console.error(
                'Ошибка загрузки материалов:',
                error
            );

            return [];
        }

        return Array.isArray(data)
            ? data
            : [];

    } catch (error) {

        console.error(error);
        return [];
    }
}

// ============================================================
// ПОИСК
// ============================================================

function findManualForDirection(
    materials,
    direction
) {

    if (!Array.isArray(materials)) {
        return null;
    }

    for (const item of materials) {

        if (item.method === direction) {
            return item;
        }

        const detected =
            manualDirectionFromText(
                item.method ||
                item.title ||
                ''
            );

        if (detected === direction) {
            return item;
        }
    }

    return null;
}

// ============================================================
// ОТОБРАЖЕНИЕ
// ============================================================

async function loadManuals() {

    injectManualStyles();

    const contentCards =
        document.getElementById('contentCards');

    if (!contentCards) {
        return;
    }

    const materials =
        await getSavedManuals();

    const admin =
        await isManualAdmin();

    contentCards.innerHTML = `

        <div
            class="cards"
            id="manualCards"
        >

            ${MANUAL_DIRECTIONS.map(item => {

                const saved =
                    findManualForDirection(
                        materials,
                        item.key
                    );

                const status =
                    saved
                        ? `<div class="manual-status">Материал загружен</div>`
                        : '';

                return `

                    <div
                        class="card method-card"
                        data-manual-direction="${item.key}"
                        role="button"
                        tabindex="0"
                    >

                        ${manualIconHtml(item)}

                        <div class="card-content">

                            <h3>
                                ${manualEscape(item.title)}
                            </h3>

                            <p>
                                Методическое пособие
                            </p>

                            ${status}

                        </div>

                    </div>

                `;

            }).join('')}

        </div>

    `;

    const cards =
        document.querySelectorAll(
            '#manualCards .method-card'
        );

    cards.forEach(card => {

        const direction =
            card.dataset.manualDirection;

        card.addEventListener(
            'click',
            async () => {

                const item =
                    MANUAL_DIRECTIONS.find(
                        x => x.key === direction
                    );

                if (!item) {
                    return;
                }

                const saved =
                    findManualForDirection(
                        materials,
                        direction
                    );

                if (admin) {

                    openManual(
                        direction,
                        item.title,
                        saved
                    );

                    return;
                }

                if (saved) {

                    await openSavedManual(
                        saved
                    );

                    return;
                }

                alert(
                    'У вас нет доступа к этому материалу.'
                );
            }
        );

        card.addEventListener(
            'keydown',
            event => {

                if (
                    event.key !== 'Enter' &&
                    event.key !== ' '
                ) {
                    return;
                }

                event.preventDefault();

                card.click();
            }
        );

    });
}

// ============================================================
// ОКНО АДМИНИСТРАТОРА
// ============================================================

function openManual(
    direction,
    title,
    savedItem = null
) {

    const old =
        document.getElementById('manualWindow');

    if (old) {
        old.remove();
    }

    const box =
        document.createElement('div');

    box.id = 'manualWindow';

    box.innerHTML = `

        <div class="material-manager-overlay">

            <div class="material-manager">

                <button
                    type="button"
                    class="material-manager-close"
                    id="manualCloseButton"
                >
                    ×
                </button>

                <h2>
                    ${manualEscape(title)}
                </h2>

                <label>
                    Вставить ссылку
                </label>

                <input
                    id="manualUrlInput"
                    type="url"
                    placeholder="https://..."
                    class="material-manager-input"
                >

                <button
                    type="button"
                    class="material-manager-button"
                    id="saveManualLinkButton"
                >
                    🔗 Сохранить ссылку
                </button>

                <div class="material-manager-or">
                    или
                </div>

                <label>
                    Загрузить файл
                </label>

                <input
                    id="manualFileInput"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    class="material-manager-input"
                >

                <button
                    type="button"
                    class="material-manager-button"
                    id="uploadManualFileButton"
                >
                    📁 Загрузить файл
                </button>

                ${
                    savedItem
                        ? `
                            <div
                                style="
                                    margin-top:20px;
                                    padding:14px;
                                    border-radius:12px;
                                    background:rgba(255,255,255,.10);
                                    border:1px solid rgba(255,255,255,.25);
                                "
                            >

                                <strong>
                                    Материал уже сохранён.
                                </strong>

                                <br><br>

                                <button
                                    type="button"
                                    class="material-manager-button"
                                    id="openSavedManualButton"
                                >
                                    📖 Открыть сохранённый материал
                                </button>

                            </div>
                        `
                        : ''
                }

                <div id="manualActionMessage"></div>

            </div>

        </div>

    `;

    document.body.appendChild(box);

    document
        .getElementById('manualCloseButton')
        ?.addEventListener(
            'click',
            () => box.remove()
        );

    document
        .getElementById('saveManualLinkButton')
        ?.addEventListener(
            'click',
            async () => {

                await saveManualLink(
                    direction,
                    title
                );
            }
        );

    document
        .getElementById('uploadManualFileButton')
        ?.addEventListener(
            'click',
            async () => {

                await uploadManualFile(
                    direction,
                    title
                );
            }
        );

    document
        .getElementById('openSavedManualButton')
        ?.addEventListener(
            'click',
            async () => {

                if (savedItem) {
                    await openSavedManual(savedItem);
                }
            }
        );
}

// ============================================================
// СООБЩЕНИЕ
// ============================================================

function setManualMessage(
    text,
    ok = false
) {

    const node =
        document.getElementById(
            'manualActionMessage'
        );

    if (!node) {
        return;
    }

    node.textContent =
        String(text || '');

    node.style.color =
        ok
            ? '#b9f6ca'
            : '#ffb4b4';
}

// ============================================================
// СОХРАНЕНИЕ ССЫЛКИ
// ============================================================

async function saveManualLink(
    direction,
    title
) {

    const input =
        document.getElementById(
            'manualUrlInput'
        );

    const url =
        input
            ? input.value.trim()
            : '';

    if (!url) {

        setManualMessage(
            'Вставьте ссылку.'
        );

        return;
    }

    try {

        const parsed =
            new URL(url);

        if (
            parsed.protocol !== 'http:' &&
            parsed.protocol !== 'https:'
        ) {
            throw new Error();
        }

    } catch {

        setManualMessage(
            'Введите корректную ссылку https://'
        );

        return;
    }

    const session =
        await getManualSession();

    if (!session) {

        setManualMessage(
            'Сессия закончилась. Войдите заново.'
        );

        return;
    }

    setManualMessage(
        'Сохраняю...',
        true
    );

    const oldMaterials =
        await getSavedManuals();

    const oldItem =
        findManualForDirection(
            oldMaterials,
            direction
        );

    let result;

    if (oldItem?.id) {

        result =
            await supabaseClient
                .from('materials')
                .update({
                    section: 'manuals',
                    title: title,
                    type: 'Методическое пособие',
                    method: direction,
                    description: 'Методическое пособие',
                    external_url: url,
                    file_url: null
                })
                .eq('id', oldItem.id);

    } else {

        result =
            await supabaseClient
                .from('materials')
                .insert({
                    section: 'manuals',
                    title: title,
                    type: 'Методическое пособие',
                    method: direction,
                    description: 'Методическое пособие',
                    external_url: url,
                    file_url: null
                });
    }

    if (result.error) {

        console.error(
            'Ошибка сохранения ссылки:',
            result.error
        );

        setManualMessage(
            'Ошибка: ' +
            (
                result.error.message ||
                'не удалось сохранить'
            )
        );

        return;
    }

    setManualMessage(
        'Ссылка сохранена.',
        true
    );

    setTimeout(
        async () => {

            document
                .getElementById('manualWindow')
                ?.remove();

            await loadManuals();

        },
        700
    );
}

// ============================================================
// ИМЯ ФАЙЛА
// ============================================================

function makeManualSafeFileName(
    fileName
) {

    return String(
        fileName || 'file.pdf'
    )
        .replace(
            /[^\wа-яА-ЯёЁ.\- ]+/g,
            '_'
        )
        .replace(
            /\s+/g,
            '_'
        );
}

// ============================================================
// ЗАГРУЗКА ФАЙЛА
// ============================================================

async function uploadManualFile(
    direction,
    title
) {

    const input =
        document.getElementById(
            'manualFileInput'
        );

    if (
        !input ||
        !input.files ||
        !input.files.length
    ) {

        setManualMessage(
            'Сначала выберите PDF, DOC или DOCX.'
        );

        return;
    }

    const file =
        input.files[0];

    const extension =
        String(
            file.name
                .split('.')
                .pop() || ''
        ).toLowerCase();

    if (
        ![
            'pdf',
            'doc',
            'docx'
        ].includes(extension)
    ) {

        setManualMessage(
            'Можно загрузить только PDF, DOC или DOCX.'
        );

        return;
    }

    const session =
        await getManualSession();

    if (!session) {

        setManualMessage(
            'Сессия закончилась. Войдите заново.'
        );

        return;
    }

    setManualMessage(
        'Загружаю файл...',
        true
    );

    const safeName =
        makeManualSafeFileName(
            file.name
        );

    const filePath =
        `${direction}/${session.user.id}/${Date.now()}_${safeName}`;

    const {
        error: uploadError
    } =
        await supabaseClient
            .storage
            .from(MANUALS_BUCKET)
            .upload(
                filePath,
                file,
                {
                    cacheControl: '3600',
                    upsert: false,
                    contentType:
                        file.type ||
                        'application/octet-stream'
                }
            );

    if (uploadError) {

        console.error(
            'Ошибка Storage:',
            uploadError
        );

        setManualMessage(
            'Файл не загрузился: ' +
            (
                uploadError.message ||
                'ошибка Storage'
            )
        );

        return;
    }

    const oldMaterials =
        await getSavedManuals();

    const oldItem =
        findManualForDirection(
            oldMaterials,
            direction
        );

    let result;

    if (oldItem?.id) {

        result =
            await supabaseClient
                .from('materials')
                .update({
                    section: 'manuals',
                    title: title,
                    type: 'Методическое пособие',
                    method: direction,
                    description: 'Методическое пособие',
                    external_url: null,
                    file_url: filePath
                })
                .eq('id', oldItem.id);

    } else {

        result =
            await supabaseClient
                .from('materials')
                .insert({
                    section: 'manuals',
                    title: title,
                    type: 'Методическое пособие',
                    method: direction,
                    description: 'Методическое пособие',
                    external_url: null,
                    file_url: filePath
                });
    }

    if (result.error) {

        console.error(
            'Ошибка materials:',
            result.error
        );

        await supabaseClient
            .storage
            .from(MANUALS_BUCKET)
            .remove([filePath]);

        setManualMessage(
            'Файл загрузился, но запись не сохранилась: ' +
            (
                result.error.message ||
                'ошибка базы данных'
            )
        );

        return;
    }

    setManualMessage(
        'Файл успешно загружен.',
        true
    );

    setTimeout(
        async () => {

            document
                .getElementById('manualWindow')
                ?.remove();

            await loadManuals();

        },
        700
    );
}

// ============================================================
// ОТКРЫТИЕ СОХРАНЁННОГО
// ============================================================

async function openSavedManual(
    item
) {

    if (!item) {
        return;
    }

    if (item.external_url) {

        window.open(
            item.external_url,
            '_blank',
            'noopener,noreferrer'
        );

        return;
    }

    if (item.file_url) {

        const {
            data,
            error
        } =
            await supabaseClient
                .storage
                .from(MANUALS_BUCKET)
                .createSignedUrl(
                    item.file_url,
                    3600
                );

        if (error) {

            console.error(
                'Ошибка открытия файла:',
                error
            );

            alert(
                'Не удалось открыть файл: ' +
                (
                    error.message ||
                    'ошибка Storage'
                )
            );

            return;
        }

        if (data?.signedUrl) {

            window.open(
                data.signedUrl,
                '_blank',
                'noopener,noreferrer'
            );

            return;
        }
    }

    alert(
        'Материал пока не загружен.'
    );
}

// ============================================================
// УДАЛЕНИЕ
// ============================================================

async function deleteManual(
    item
) {

    if (!item) {
        return;
    }

    if (!confirm('Удалить этот материал?')) {
        return;
    }

    if (item.file_url) {

        await supabaseClient
            .storage
            .from(MANUALS_BUCKET)
            .remove([
                item.file_url
            ]);
    }

    if (item.id) {

        const {
            error
        } =
            await supabaseClient
                .from('materials')
                .delete()
                .eq(
                    'id',
                    item.id
                );

        if (error) {

            alert(
                'Не удалось удалить материал: ' +
                (
                    error.message ||
                    'ошибка базы данных'
                )
            );

            return;
        }
    }

    await loadManuals();
}

// ============================================================
// ГЛОБАЛЬНО
// ============================================================

window.loadManuals =
    loadManuals;

window.openManual =
    openManual;

window.saveManualLink =
    saveManualLink;

window.uploadManualFile =
    uploadManualFile;

window.openSavedManual =
    openSavedManual;

window.deleteManual =
    deleteManual;

window.manualDirectionFromText =
    manualDirectionFromText;

// ============================================================
// АВТОЗАПУСК СТИЛЕЙ
// ============================================================

document.addEventListener(
    'DOMContentLoaded',
    () => {
        injectManualStyles();
    }
);
