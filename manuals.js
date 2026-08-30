// ============================================================
// МЕТОДИЧЕСКИЕ ПОСОБИЯ
// Numerology Platform
// ============================================================
//
// 5 направлений:
// 1. Взрослая матрица
// 2. Детская матрица
// 3. Матрица совместимости
// 4. Ведическая нумерология
// 5. Квадрат Пифагора
//
// Supabase:
//   Table  -> materials
//   Storage -> Methodicals
// ============================================================


// ============================================================
// НАСТРОЙКИ
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
// ИКОНКИ
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
// СТИЛИ РАЗДЕЛА
// ============================================================

function injectManualStyles() {

    if (document.getElementById('manualStyles')) {
        return;
    }


    const style = document.createElement('style');

    style.id = 'manualStyles';


    style.textContent = `

        /* ----------------------------------------------------
           КАРТОЧКИ
        ---------------------------------------------------- */

        #manualCards {
            display: flex;
            flex-wrap: nowrap;
            gap: 18px;
            width: 100%;
            align-items: stretch;
        }


        .method-card {
            flex: 1 1 0;
            min-width: 0;
            max-width: 220px;
            min-height: 240px;

            cursor: pointer;

            display: flex;
            flex-direction: column;
            justify-content: space-between;

            text-align: center;

            box-sizing: border-box;
        }


        .method-card .card-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            flex: 1;
        }


        .method-card h3 {
            margin: 12px 8px 8px;
            line-height: 1.15;
        }


        .method-card p {
            margin: 0;
        }


        /* ----------------------------------------------------
           ИКОНКИ
        ---------------------------------------------------- */

        .method-card .card-icon {
            font-size: 52px;
            line-height: 1;
            margin-top: 10px;
        }


        .pythagoras-icon {
            width: 72px;
            margin: 10px auto 0;

            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2px;

            font-size: 16px;
            line-height: 1.2;
            font-weight: 600;
        }


        .pythagoras-icon span {
            display: flex;
            align-items: center;
            justify-content: center;
        }


        /* ----------------------------------------------------
           МОДАЛЬНОЕ ОКНО
        ---------------------------------------------------- */

        .material-manager-overlay {

            position: fixed;
            inset: 0;

            z-index: 99999;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 20px;

            background: rgba(0, 0, 0, 0.65);

            box-sizing: border-box;
        }


        .material-manager {

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

            border: 1px solid rgba(255, 230, 130, 0.8);

            box-shadow:
                0 20px 60px rgba(0, 0, 0, 0.45);

            color: white;
        }


        .material-manager h2 {

            margin: 0 45px 25px 0;

            font-size: 27px;

            color: #fff2a0;
        }


        .material-manager-close {

            position: absolute;

            margin-left: 465px;
            margin-top: -8px;

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

            border: 1px solid rgba(255,255,255,0.65);

            background: rgba(255,255,255,0.12);

            color: white;

            outline: none;

            font-size: 15px;
        }


        .material-manager-input::placeholder {
            color: rgba(255,255,255,0.7);
        }


        .material-manager-input[type="file"] {
            padding: 10px;
        }


        .material-manager-button {

            margin-top: 12px;

            padding: 12px 18px;

            border-radius: 12px;

            border: 1px solid #fff1a0;

            background: rgba(255,255,255,0.14);

            color: white;

            font-size: 15px;
            font-weight: 600;

            cursor: pointer;
        }


        .material-manager-button:hover {
            background: rgba(255,255,255,0.25);
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


        /* ----------------------------------------------------
           СОХРАНЁННЫЙ МАТЕРИАЛ
        ---------------------------------------------------- */

        .manual-status {

            margin-top: 8px;

            font-size: 12px;

            opacity: 0.9;
        }


        /* ----------------------------------------------------
           АДАПТИВ
        ---------------------------------------------------- */

        @media (max-width: 1000px) {

            #manualCards {
                flex-wrap: wrap;
            }

            .method-card {
                flex: 1 1 180px;
                max-width: none;
            }

        }

    `;


    document.head.appendChild(style);

}


// ============================================================
// ПРОВЕРКА АДМИНИСТРАТОРА
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


        // Основной администратор
        if (email === 'centernumero@gmail.com') {
            return true;
        }


        // Если main.js уже определяет администратора
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
// ЗАГРУЗКА СОХРАНЁННЫХ МАТЕРИАЛОВ
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
                'Ошибка получения методических пособий:',
                error
            );

            return [];

        }


        return Array.isArray(data)
            ? data
            : [];

    } catch (error) {

        console.error(
            'Ошибка загрузки материалов:',
            error
        );

        return [];

    }

}


// ============================================================
// ПОИСК МАТЕРИАЛА ДЛЯ КОНКРЕТНОГО НАПРАВЛЕНИЯ
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
// ОТРИСОВКА КАРТОЧЕК
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


    // --------------------------------------------------------
    // ОБРАБОТЧИКИ КАРТОЧЕК
    // --------------------------------------------------------

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


                /*
                 * Администратор:
                 * открывает окно управления.
                 */
                if (admin) {

                    openManual(
                        direction,
                        item.title,
                        saved
                    );

                    return;

                }


                /*
                 * Обычный пользователь:
                 * открывает сохранённый материал.
                 */
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
            async event => {

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
// ОКНО УПРАВЛЕНИЯ МЕТОДИЧЕСКИМ ПОСОБИЕМ
// ============================================================

function openManual(
    direction,
    title,
    savedItem = null
) {

    const old =
        document.getElementById(
            'manualWindow'
        );


    if (old) {
        old.remove();
    }


    const box =
        document.createElement('div');


    box.id = 'manualWindow';


    const savedInfo =
        savedItem
            ? `
                <div
                    style="
                        margin-top:20px;
                        padding:14px;
                        border-radius:12px;
                        background:rgba(255,255,255,0.10);
                        border:1px solid rgba(255,255,255,0.25);
                    "
                >
                    <strong>Материал уже сохранён.</strong>
                    <br>
                    <span style="font-size:13px;">
                        Можно открыть его или заменить новым.
                    </span>

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
            : '';


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


                <!-- =========================================
                     ССЫЛКА
                ========================================== -->

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


                <!-- =========================================
                     ФАЙЛ
                ========================================== -->

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


                ${savedInfo}


                <div
                    id="manualActionMessage"
                ></div>


            </div>

        </div>

    `;


    document.body.appendChild(box);


    // --------------------------------------------------------
    // ЗАКРЫТИЕ
    // --------------------------------------------------------

    document
        .getElementById('manualCloseButton')
        ?.addEventListener(
            'click',
            () => {

                box.remove();

            }
        );


    // --------------------------------------------------------
    // СОХРАНЕНИЕ ССЫЛКИ
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // ЗАГРУЗКА ФАЙЛА
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // ОТКРЫТЬ СОХРАНЁННЫЙ
    // --------------------------------------------------------

    document
        .getElementById('openSavedManualButton')
        ?.addEventListener(
            'click',
            async () => {

                if (savedItem) {

                    await openSavedManual(
                        savedItem
                    );

                }

            }
        );

}


// ============================================================
// СООБЩЕНИЕ В ОКНЕ
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
// ПРОВЕРКА СЕССИИ
// ============================================================

async function getManualSession() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                'Ошибка получения сессии:',
                error
            );

            return null;

        }


        return data?.session || null;

    } catch (error) {

        console.error(
            'Ошибка сессии:',
            error
        );

        return null;

    }

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


    // --------------------------------------------------------
    // ПРОВЕРКА URL
    // --------------------------------------------------------

    try {

        const parsed =
            new URL(url);


        if (
            parsed.protocol !== 'http:' &&
            parsed.protocol !== 'https:'
        ) {

            throw new Error(
                'Неверный протокол'
            );

        }

    } catch (error) {

        setManualMessage(
            'Введите корректную ссылку, начинающуюся с https://'
        );

        return;

    }


    setManualMessage(
        'Сохраняю...',
        true
    );


    // --------------------------------------------------------
    // СЕССИЯ
    // --------------------------------------------------------

    const session =
        await getManualSession();


    if (!session) {

        setManualMessage(
            'Сессия закончилась. Войдите в платформу заново.'
        );

        return;

    }


    // --------------------------------------------------------
    // ЗАПИСЬ В MATERIALS
    // --------------------------------------------------------

    const {
        error
    } =
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


    if (error) {

        console.error(
            'Ошибка сохранения ссылки:',
            error
        );


        setManualMessage(
            'Не удалось сохранить ссылку: ' +
            (
                error.message ||
                'ошибка Supabase'
            )
        );


        return;

    }


    setManualMessage(
        'Ссылка сохранена.',
        true
    );


    // --------------------------------------------------------
    // ОБНОВЛЕНИЕ
    // --------------------------------------------------------

    setTimeout(
        async () => {

            const modal =
                document.getElementById(
                    'manualWindow'
                );


            if (modal) {
                modal.remove();
            }


            await loadManuals();

        },
        700
    );

}


// ============================================================
// БЕЗОПАСНОЕ ИМЯ ФАЙЛА
// ============================================================

function makeManualSafeFileName(
    fileName
) {

    return String(fileName || 'file.pdf')

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
// ЗАГРУЗКА PDF / DOC / DOCX
// ============================================================

async function uploadManualFile(
    direction,
    title
) {

    const input =
        document.getElementById(
            'manualFileInput'
        );


    // --------------------------------------------------------
    // ФАЙЛ ВЫБРАН?
    // --------------------------------------------------------

    if (
        !input ||
        !input.files ||
        !input.files.length
    ) {

        setManualMessage(
            'Сначала выберите PDF, DOC или DOCX файл.'
        );

        return;

    }


    const file =
        input.files[0];


    // --------------------------------------------------------
    // ПРОВЕРКА РАСШИРЕНИЯ
    // --------------------------------------------------------

    const extension =
        String(
            file.name
                .split('.')
                .pop() || ''
        )
            .toLowerCase();


    const allowedExtensions = [
        'pdf',
        'doc',
        'docx'
    ];


    if (
        !allowedExtensions.includes(
            extension
        )
    ) {

        setManualMessage(
            'Можно загрузить только PDF, DOC или DOCX.'
        );

        return;

    }


    // --------------------------------------------------------
    // СЕССИЯ
    // --------------------------------------------------------

    const session =
        await getManualSession();


    if (!session) {

        setManualMessage(
            'Сессия закончилась. Войдите в платформу заново.'
        );

        return;

    }


    setManualMessage(
        'Загружаю файл...',
        true
    );


    // --------------------------------------------------------
    // БЕЗОПАСНОЕ ИМЯ
    // --------------------------------------------------------

    const safeName =
        makeManualSafeFileName(
            file.name
        );


    // --------------------------------------------------------
    // ПУТЬ В STORAGE
    // --------------------------------------------------------

    const filePath =
        `${direction}/${session.user.id}/${Date.now()}_${safeName}`;


    console.log(
        'Загрузка методического пособия:',
        {
            bucket: MANUALS_BUCKET,
            filePath: filePath,
            fileName: file.name,
            size: file.size,
            type: file.type
        }
    );


    // --------------------------------------------------------
    // ЗАГРУЗКА В STORAGE
    // --------------------------------------------------------

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
            'Ошибка загрузки файла в Storage:',
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


    // --------------------------------------------------------
    // ЗАПИСЬ В MATERIALS
    // --------------------------------------------------------

    const {
        error: dbError
    } =
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


    // --------------------------------------------------------
    // ЕСЛИ БАЗА НЕ СОХРАНИЛАСЬ
    // --------------------------------------------------------

    if (dbError) {

        console.error(
            'Ошибка записи материала в materials:',
            dbError
        );


        // Удаляем уже загруженный файл,
        // чтобы не оставался мусор в Storage.

        await supabaseClient
            .storage
            .from(MANUALS_BUCKET)
            .remove([
                filePath
            ]);


        setManualMessage(
            'Файл загрузился в Storage, но не сохранился в базе: ' +
            (
                dbError.message ||
                'ошибка Supabase'
            )
        );


        return;

    }


    // --------------------------------------------------------
    // УСПЕХ
    // --------------------------------------------------------

    setManualMessage(
        'Файл успешно загружен.',
        true
    );


    // --------------------------------------------------------
    // ЗАКРЫВАЕМ ОКНО И ОБНОВЛЯЕМ КАРТОЧКИ
    // --------------------------------------------------------

    setTimeout(
        async () => {

            const modal =
                document.getElementById(
                    'manualWindow'
                );


            if (modal) {
                modal.remove();
            }


            await loadManuals();

        },
        700
    );

}


// ============================================================
// ОТКРЫТИЕ СОХРАНЁННОГО МАТЕРИАЛА
// ============================================================

async function openSavedManual(
    item
) {

    if (!item) {
        return;
    }


    // --------------------------------------------------------
    // ОБЫЧНАЯ ВНЕШНЯЯ ССЫЛКА
    // --------------------------------------------------------

    if (item.external_url) {

        window.open(
            item.external_url,
            '_blank',
            'noopener,noreferrer'
        );

        return;

    }


    // --------------------------------------------------------
    // ФАЙЛ В PRIVATE STORAGE
    // --------------------------------------------------------

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
                'Ошибка создания ссылки на методическое пособие:',
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


        alert(
            'Не удалось получить ссылку на файл.'
        );


        return;

    }


    alert(
        'Материал пока не загружен.'
    );

}


// ============================================================
// УДАЛЕНИЕ МАТЕРИАЛА
// ============================================================

async function deleteManual(
    item
) {

    if (!item) {
        return;
    }


    const confirmed =
        confirm(
            'Удалить этот материал?'
        );


    if (!confirmed) {
        return;
    }


    // --------------------------------------------------------
    // УДАЛЯЕМ ФАЙЛ ИЗ STORAGE
    // --------------------------------------------------------

    if (item.file_url) {

        const {
            error
        } =
            await supabaseClient
                .storage
                .from(MANUALS_BUCKET)
                .remove([
                    item.file_url
                ]);


        if (error) {

            console.error(
                'Ошибка удаления файла:',
                error
            );

        }

    }


    // --------------------------------------------------------
    // УДАЛЯЕМ ЗАПИСЬ ИЗ MATERIALS
    // --------------------------------------------------------

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

            console.error(
                'Ошибка удаления записи:',
                error
            );


            alert(
                'Не удалось удалить материал: ' +
                (
                    error.message ||
                    'ошибка Supabase'
                )
            );


            return;

        }

    }


    await loadManuals();

}


// ============================================================
// ДЕЛАЕМ ФУНКЦИИ ДОСТУПНЫМИ ГЛОБАЛЬНО
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
// АВТОЗАПУСК
// ============================================================

document.addEventListener(
    'DOMContentLoaded',
    () => {

        injectManualStyles();

    }
);
