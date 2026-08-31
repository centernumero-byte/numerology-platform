/* =========================================================
   manuals.js
   МЕТОДИЧЕСКИЕ ПОСОБИЯ + ВИДЕО
   ========================================================= */

const PLATFORM_MATERIALS_TABLE = 'platform_materials';
const PLATFORM_STORAGE_BUCKET = 'methodicals';

const PLATFORM_DIRECTIONS = [
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

const PLATFORM_NAMES = Object.fromEntries(
    PLATFORM_DIRECTIONS.map(item => [
        item.key,
        item.title
    ])
);

let materialManagerState = {
    section: '',
    direction: '',
    title: ''
};


/* =========================================================
   ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
   ========================================================= */

function platformEscape(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


function platformFileName(path) {

    if (!path) {
        return 'Файл';
    }

    const raw =
        String(path).split('/').pop() || 'Файл';

    return raw.replace(
        /^[0-9a-f-]{20,}_/i,
        ''
    );
}


function platformFormatDate(value) {

    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toLocaleString(
        'ru-RU',
        {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
    );
}


function isManager() {
    return window.currentUserIsManager === true;
}


async function getCurrentSession() {

    const {
        data: { session },
        error
    } = await supabaseClient.auth.getSession();

    if (error) {
        throw error;
    }

    return session;
}


/* =========================================================
   ПРИВЕТСТВИЕ
   ========================================================= */

function showPlatformWelcome() {

    const welcome =
        document.querySelector('.welcome');

    if (welcome) {
        welcome.style.display = '';
    }
}


function hidePlatformWelcome() {

    const welcome =
        document.querySelector('.welcome');

    if (welcome) {
        welcome.style.display = 'none';
    }
}


/* =========================================================
   СТИЛИ МЕТОДИЧЕСКИХ ПОСОБИЙ И ВИДЕО
   ========================================================= */

function ensureMaterialStyles() {

    if (
        document.getElementById(
            'platformMaterialStyles'
        )
    ) {
        return;
    }

    const style =
        document.createElement('style');

    style.id =
        'platformMaterialStyles';

    style.textContent = `

        /* =====================================================
           ОСНОВНОЙ КОНТЕНТ
           ===================================================== */

        #contentCards.pm-content {
            display: block !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
        }


        /* =====================================================
           5 НАПРАВЛЕНИЙ
           ===================================================== */

        .pm-direction-grid {
            width: 100%;
            display: grid;
            grid-template-columns:
                repeat(5, minmax(0, 1fr));
            gap: 20px;
            align-items: stretch;
            box-sizing: border-box;
        }


        .pm-direction-card {
            width: 100% !important;
            min-width: 0 !important;
            min-height: 250px !important;

            box-sizing: border-box !important;

            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;

            padding: 28px 18px !important;

            border-radius: 18px !important;
            border: 1px solid #d7aa31 !important;

            background:
                linear-gradient(
                    145deg,
                    #302052 0%,
                    #21163d 100%
                ) !important;

            color: #fff !important;

            cursor: pointer;
            text-align: center;

            transition:
                transform .2s ease,
                box-shadow .2s ease;
        }


        .pm-direction-card:hover {
            transform: translateY(-4px);

            box-shadow:
                0 12px 30px rgba(0,0,0,.25),
                0 0 20px rgba(215,170,49,.12);
        }


        .pm-direction-card:focus {
            outline: 2px solid #f6d66c;
            outline-offset: 3px;
        }


        /* =====================================================
           ИКОНКИ
           ===================================================== */

        .pm-direction-card
        .pm-direction-icon {

            width: 80px;
            height: 80px;

            display: flex;
            align-items: center;
            justify-content: center;

            margin-bottom: 18px;

            font-size: 52px;
            line-height: 1;

            color: #f6d66c;
        }


        /* =====================================================
           ЗАГОЛОВКИ НАПРАВЛЕНИЙ
           ===================================================== */

        .pm-direction-card h3 {

            width: 100%;

            margin: 0 0 10px !important;

            color: #f6d66c !important;

            font-family: Georgia, serif !important;

            font-size: 21px !important;
            line-height: 1.18 !important;
            font-weight: 500 !important;
        }


        .pm-direction-card p {

            width: 100%;

            margin: 0 !important;

            color: #eee5d0 !important;

            font-size: 15px !important;
            line-height: 1.35 !important;
        }


        /* =====================================================
           КВАДРАТ ПИФАГОРА
           ===================================================== */

        .pm-pythagoras {

            display: grid;

            grid-template-columns:
                repeat(3, 1fr);

            gap: 3px;

            width: 76px;
            height: 76px;

            padding: 6px;

            box-sizing: border-box;

            border-radius: 10px;

            background:
                rgba(255,255,255,.08);

            margin-bottom: 18px;
        }


        .pm-pythagoras span {

            display: flex;

            align-items: center;
            justify-content: center;

            color: #f6d66c;

            font-size: 16px;
            font-weight: 700;
        }


        /* =====================================================
           СТРАНИЦА КОНКРЕТНОГО НАПРАВЛЕНИЯ
           ===================================================== */

        .pm-page {

            width: 100%;
            max-width: none;

            margin: 0;

            box-sizing: border-box;
        }


        .pm-page-head {

            width: 100%;

            display: flex;

            align-items: flex-start;
            justify-content: space-between;

            gap: 30px;

            margin-bottom: 25px;

            box-sizing: border-box;
        }


        .pm-page-title {

            margin: 0;

            color: #f6d66c;

            font-family: Georgia, serif;

            font-size: 38px;
            line-height: 1.15;
            font-weight: 500;
        }


        .pm-page-subtitle {

            margin: 10px 0 0;

            color: #eee5d0;

            font-size: 17px;
            line-height: 1.4;
        }


        .pm-head-actions {

            flex-shrink: 0;
        }


        /* =====================================================
           КНОПКА НАЗАД
           ===================================================== */

        .pm-back {

            display: inline-flex;
            align-items: center;

            margin-bottom: 18px;

            padding: 0;

            border: none;

            background: transparent;

            color: #f6d66c;

            cursor: pointer;

            font-size: 17px;
            font-weight: 600;
        }


        .pm-back:hover {
            text-decoration: underline;
        }


        /* =====================================================
           КНОПКИ
           ===================================================== */

        .pm-button {

            display: inline-flex;

            align-items: center;
            justify-content: center;

            min-height: 48px;

            box-sizing: border-box;

            padding: 12px 20px;

            border: 1px solid #d7aa31;
            border-radius: 12px;

            background:
                linear-gradient(
                    135deg,
                    #7041b0,
                    #523083
                );

            color: #fff4c7;

            cursor: pointer;

            font-size: 16px;
            font-weight: 700;

            white-space: nowrap;

            transition:
                transform .2s ease,
                box-shadow .2s ease;
        }


        .pm-button:hover {

            transform: translateY(-2px);

            box-shadow:
                0 8px 22px rgba(0,0,0,.25);
        }


        .pm-button:disabled {

            opacity: .55;

            cursor: wait;

            transform: none;
        }


        /* =====================================================
           ПАНЕЛЬ ДОБАВЛЕНИЯ
           ===================================================== */

        .pm-add-panel {

            display: none;

            width: 100%;

            box-sizing: border-box;

            margin: 0 0 28px;

            padding: 25px;

            border:
                1px solid rgba(215,170,49,.55);

            border-radius: 18px;

            background:
                rgba(18,13,48,.85);
        }


        .pm-add-panel.open {
            display: block;
        }


        .pm-add-panel-title {

            margin-bottom: 22px;

            color: #f6d66c;

            font-family: Georgia, serif;

            font-size: 26px;
            font-weight: 700;
        }


        /* =====================================================
           ДВА БЛОКА ДОБАВЛЕНИЯ
           ===================================================== */

        .pm-add-grid {

            width: 100%;

            display: grid;

            grid-template-columns:
                repeat(2, minmax(0, 1fr));

            gap: 24px;

            box-sizing: border-box;
        }


        .pm-add-box {

            width: 100%;
            min-width: 0;

            box-sizing: border-box;

            padding: 22px;

            border:
                1px solid rgba(215,170,49,.3);

            border-radius: 15px;

            background:
                rgba(255,255,255,.045);
        }


        .pm-add-label {

            display: block;

            margin-bottom: 12px;

            color: #fff4d0;

            font-size: 18px;
            font-weight: 700;
        }


        /* =====================================================
           INPUT
           ===================================================== */

        .pm-input,
        .pm-file-input {

            display: block;

            width: 100% !important;
            max-width: 100% !important;

            box-sizing: border-box !important;

            min-height: 48px;

            border:
                1px solid rgba(215,170,49,.7);

            border-radius: 10px;

            background: #17112f;

            color: white;

            outline: none;

            font-size: 15px;
        }


        .pm-input {
            padding: 12px 14px;
        }


        .pm-input::placeholder {
            color: #aaa1b4;
        }


        .pm-input:focus {
            border-color: #f6d66c;
        }


        .pm-file-input {

            margin-bottom: 14px;

            padding: 8px;
        }


        .pm-file-row {

            display: block;

            width: 100%;
        }


        .pm-file-row .pm-button,
        .pm-add-box > .pm-button {

            width: 100%;

            margin-top: 14px;
        }


        /* =====================================================
           СТАТУС
           ===================================================== */

        .pm-status {

            min-height: 22px;

            margin-top: 18px;

            color: #ddd5df;

            font-size: 15px;

            line-height: 1.5;
        }


        .pm-status.ok {
            color: #a9e4b4;
        }


        .pm-status.error {
            color: #ffb0b0;
        }


        .pm-note {

            margin-top: 18px;

            color: #aaa2b4;

            font-size: 13px;

            line-height: 1.5;
        }


        /* =====================================================
           СПИСОК МАТЕРИАЛОВ
           ===================================================== */

        .pm-materials {

            width: 100%;

            display: grid;

            grid-template-columns:
                repeat(
                    auto-fill,
                    minmax(300px, 1fr)
                );

            gap: 20px;

            box-sizing: border-box;
        }


        /* =====================================================
           ОДНА КАРТОЧКА МАТЕРИАЛА
           ===================================================== */

        .pm-material {

            width: 100%;
            min-width: 0;

            box-sizing: border-box;

            display: flex;

            flex-direction: column;

            padding: 22px;

            border:
                1px solid rgba(215,170,49,.35);

            border-radius: 16px;

            background:
                rgba(15,11,38,.75);
        }


        .pm-material-icon {

            width: 64px;
            height: 64px;

            display: flex;

            align-items: center;
            justify-content: center;

            margin-bottom: 15px;

            border-radius: 12px;

            background:
                rgba(91,48,139,.65);

            color: #f6d66c;

            font-size: 28px;
            font-weight: 800;
        }


        .pm-material-icon.pdf {

            background: #9e3434;

            color: white;

            font-size: 17px;
        }


        .pm-material-info {

            min-width: 0;

            flex: 1;
        }


        .pm-material-name {

            margin-bottom: 8px;

            color: white;

            font-size: 19px;
            font-weight: 700;

            line-height: 1.3;

            overflow-wrap: anywhere;

            word-break: break-word;
        }


        .pm-material-meta {

            color: #c9c1ce;

            font-size: 14px;

            line-height: 1.5;

            overflow-wrap: anywhere;

            word-break: break-word;
        }


        /* =====================================================
           КНОПКИ МАТЕРИАЛА
           ===================================================== */

        .pm-material-action {

            display: flex;

            flex-wrap: wrap;

            gap: 8px;

            margin-top: 18px;
        }


        .pm-open-button {

            min-height: 44px;

            padding: 10px 18px;

            border:
                1px solid #d7aa31;

            border-radius: 9px;

            background: #63358d;

            color: #f8e7a8;

            cursor: pointer;

            font-size: 15px;
            font-weight: 700;
        }


        .pm-delete-button {

            min-height: 44px;

            padding: 10px 14px;

            border:
                1px solid rgba(255,160,160,.4);

            border-radius: 9px;

            background: transparent;

            color: #ffb4b4;

            cursor: pointer;

            font-size: 14px;
        }


        /* =====================================================
           ПУСТОЙ РАЗДЕЛ
           ===================================================== */

        .pm-empty {

            width: 100%;

            box-sizing: border-box;

            padding: 55px 25px;

            text-align: center;

            border:
                1px dashed rgba(215,170,49,.4);

            border-radius: 16px;

            color: #c9c1ce;

            background:
                rgba(15,11,38,.35);

            grid-column: 1 / -1;
        }


        .pm-empty-title {

            margin-bottom: 10px;

            color: #f6d66c;

            font-family: Georgia, serif;

            font-size: 25px;
        }


        /* =====================================================
           АДАПТАЦИЯ
           ===================================================== */

        @media (max-width: 1300px) {

            .pm-direction-grid {

                grid-template-columns:
                    repeat(
                        3,
                        minmax(0, 1fr)
                    );
            }
        }


        @media (max-width: 900px) {

            .pm-direction-grid {

                grid-template-columns:
                    repeat(
                        2,
                        minmax(0, 1fr)
                    );

                gap: 15px;
            }


            .pm-add-grid {

                grid-template-columns: 1fr;
            }


            .pm-page-head {

                flex-direction: column;
            }


            .pm-head-actions {

                width: 100%;
            }


            .pm-head-actions .pm-button {

                width: 100%;
            }


            .pm-page-title {

                font-size: 30px;
            }
        }


        @media (max-width: 600px) {

            .pm-direction-grid {

                grid-template-columns: 1fr;
            }


            .pm-direction-card {

                min-height: 210px !important;
            }


            .pm-add-panel {

                padding: 17px;
            }


            .pm-add-box {

                padding: 16px;
            }


            .pm-materials {

                grid-template-columns: 1fr;
            }
        }

    `;

    document.head.appendChild(style);
}


/* =========================================================
   ИКОНКА ПИФАГОРА
   ========================================================= */

function pythagorasIconHtml() {

    return `
        <div class="pm-pythagoras">

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


/* =========================================================
   МЕТОДИЧЕСКИЕ ПОСОБИЯ / ВИДЕО
   ========================================================= */

async function loadPlatformMaterials(section) {

    const contentCards =
        document.getElementById(
            'contentCards'
        );

    if (!contentCards) {
        return;
    }

    ensureMaterialStyles();

    showPlatformWelcome();

    contentCards.classList.add(
        'pm-content'
    );


    const isVideos =
        section === 'videos';


    const subtitle =
        isVideos
            ? 'Видео'
            : 'Методическое пособие';


    contentCards.innerHTML = `

        <div class="pm-direction-grid">

            ${PLATFORM_DIRECTIONS.map(
                item => {

                    const icon =
                        item.key === 'pythagoras'

                            ? pythagorasIconHtml()

                            : `
                                <div class="pm-direction-icon">
                                    ${item.icon}
                                </div>
                            `;


                    return `

                        <div
                            class="pm-direction-card"
                            data-section="${platformEscape(section)}"
                            data-direction="${platformEscape(item.key)}"
                            role="button"
                            tabindex="0"
                            onclick="
                                openPlatformMaterial(
                                    '${platformEscape(section)}',
                                    '${platformEscape(item.key)}'
                                )
                            "
                            onkeydown="
                                if (
                                    event.key === 'Enter' ||
                                    event.key === ' '
                                ) {
                                    event.preventDefault();

                                    openPlatformMaterial(
                                        '${platformEscape(section)}',
                                        '${platformEscape(item.key)}'
                                    );
                                }
                            "
                        >

                            ${icon}

                            <h3>
                                ${platformEscape(item.title)}
                            </h3>

                            <p>
                                ${subtitle}
                            </p>

                        </div>

                    `;
                }
            ).join('')}

        </div>
    `;
}


/* =========================================================
   РАЗДЕЛЫ
   ========================================================= */

async function loadManuals() {

    await loadPlatformMaterials(
        'manuals'
    );
}


async function loadVideos() {

    await loadPlatformMaterials(
        'videos'
    );
}


/* =========================================================
   ОТКРЫТИЕ НАПРАВЛЕНИЯ
   ========================================================= */

async function openPlatformMaterial(
    section,
    direction
) {

    const contentCards =
        document.getElementById(
            'contentCards'
        );

    if (!contentCards) {
        return;
    }

    ensureMaterialStyles();

    hidePlatformWelcome();

    contentCards.classList.add(
        'pm-content'
    );


    const title =
        PLATFORM_NAMES[direction] ||
        'Материал';


    const sectionTitle =
        section === 'videos'

            ? `${title} — видео`

            : `${title} — методическое пособие`;


    materialManagerState = {
        section,
        direction,
        title
    };


    contentCards.innerHTML = `

        <div class="pm-page">


            <button
                class="pm-back"
                type="button"
                onclick="
                    ${
                        section === 'videos'
                            ? 'loadVideos()'
                            : 'loadManuals()'
                    }
                "
            >
                ← Назад
            </button>


            <div class="pm-page-head">

                <div>

                    <h2 class="pm-page-title">
                        ${platformEscape(sectionTitle)}
                    </h2>

                    <p class="pm-page-subtitle">
                        Все материалы
                    </p>

                </div>


                ${
                    isManager()

                        ? `

                            <div class="pm-head-actions">

                                <button
                                    class="pm-button"
                                    type="button"
                                    onclick="
                                        toggleMaterialAddPanel()
                                    "
                                >
                                    ＋ Добавить материал
                                </button>

                            </div>

                        `

                        : ''
                }

            </div>


            ${
                isManager()

                    ? `

                        <div
                            id="pmAddPanel"
                            class="pm-add-panel"
                        >

                            <div
                                class="pm-add-panel-title"
                            >
                                Добавить материал
                            </div>


                            <div class="pm-add-grid">


                                <!-- ЗАГРУЗКА ФАЙЛА -->

                                <div class="pm-add-box">

                                    <label
                                        class="pm-add-label"
                                    >
                                        ${
                                            section === 'videos'
                                                ? 'Загрузить видео'
                                                : 'Загрузить файл'
                                        }
                                    </label>


                                    <div
                                        class="pm-file-row"
                                    >

                                        <input
                                            id="pmFileInput"
                                            class="pm-file-input"
                                            type="file"
                                            accept="${
                                                section === 'videos'
                                                    ? 'video/*,.mp4,.webm,.mov,.m4v'
                                                    : '.pdf,.doc,.docx'
                                            }"
                                        >


                                        <button
                                            class="pm-button"
                                            type="button"
                                            onclick="
                                                uploadPlatformMaterialFile()
                                            "
                                        >
                                            ${
                                                section === 'videos'
                                                    ? 'Загрузить видео'
                                                    : 'Загрузить файл'
                                            }
                                        </button>

                                    </div>

                                </div>


                                <!-- ССЫЛКА -->

                                <div class="pm-add-box">

                                    <label
                                        class="pm-add-label"
                                        for="pmUrlInput"
                                    >
                                        Добавить ссылку
                                    </label>


                                    <input
                                        id="pmUrlInput"
                                        class="pm-input"
                                        type="url"
                                        placeholder="https://..."
                                    >


                                    <button
                                        class="pm-button"
                                        type="button"
                                        onclick="
                                            savePlatformMaterialUrl()
                                        "
                                    >
                                        🔗 Сохранить ссылку
                                    </button>

                                </div>

                            </div>


                            <div
                                id="pmStatus"
                                class="pm-status"
                            ></div>


                            <div class="pm-note">

                                ${
                                    section === 'videos'

                                        ? 'Можно загрузить видеофайл или добавить внешнюю ссылку на видео.'

                                        : 'Можно загрузить PDF/документ или добавить внешнюю ссылку на материал.'
                                }

                            </div>

                        </div>

                    `

                    : ''
            }


            <div
                id="pmMaterialsList"
                class="pm-materials"
            >

                <div class="pm-empty">
                    Загружаю материалы...
                </div>

            </div>

        </div>
    `;


    await renderMaterialList(
        section,
        direction
    );
}


/* =========================================================
   ПАНЕЛЬ ДОБАВЛЕНИЯ
   ========================================================= */

function toggleMaterialAddPanel() {

    const panel =
        document.getElementById(
            'pmAddPanel'
        );

    if (!panel) {
        return;
    }

    panel.classList.toggle(
        'open'
    );
}


/* =========================================================
   ПОЛУЧЕНИЕ МАТЕРИАЛОВ
   ========================================================= */

async function getAllMaterials(
    section,
    direction
) {

    const {
        data,
        error
    } = await supabaseClient
        .from(
            PLATFORM_MATERIALS_TABLE
        )
        .select(`
            id,
            section,
            direction,
            material_type,
            url,
            file_path,
            created_by,
            created_at
        `)
        .eq(
            'section',
            section
        )
        .eq(
            'direction',
            direction
        )
        .order(
            'created_at',
            {
                ascending: false
            }
        );


    if (error) {
        throw error;
    }


    return data || [];
}


/* =========================================================
   СПИСОК МАТЕРИАЛОВ
   ========================================================= */

async function renderMaterialList(
    section,
    direction
) {

    const list =
        document.getElementById(
            'pmMaterialsList'
        );

    if (!list) {
        return;
    }


    try {

        const materials =
            await getAllMaterials(
                section,
                direction
            );


        if (!materials.length) {

            list.innerHTML = `

                <div class="pm-empty">

                    <div class="pm-empty-title">
                        Материалов пока нет
                    </div>

                    <div>

                        ${
                            isManager()

                                ? 'Добавьте первый файл или ссылку выше.'

                                : 'Материалы для этого раздела пока не добавлены.'
                        }

                    </div>

                </div>

            `;

            return;
        }


        list.innerHTML =
            materials
                .map(
                    material =>
                        renderMaterialItem(
                            material
                        )
                )
                .join('');


    } catch (error) {

        console.error(
            'Ошибка получения материалов:',
            error
        );


        list.innerHTML = `

            <div class="pm-empty">

                <div class="pm-empty-title">
                    Не удалось загрузить материалы
                </div>

                <div>
                    ${platformEscape(
                        error.message ||
                        String(error)
                    )}
                </div>

            </div>

        `;
    }
}


/* =========================================================
   ОДИН МАТЕРИАЛ
   ========================================================= */

function renderMaterialItem(
    material
) {

    const isFile =
        material.material_type === 'file' &&
        material.file_path;


    const isLink =
        material.material_type === 'link' &&
        material.url;


    let icon = '🔗';


    if (isFile) {

        const fileName =
            platformFileName(
                material.file_path
            );


        const ext =
            fileName
                .split('.')
                .pop()
                .toLowerCase();


        if (ext === 'pdf') {

            icon = 'PDF';

        } else if (

            [
                'mp4',
                'webm',
                'mov',
                'm4v'
            ].includes(ext)

        ) {

            icon = '▶';

        } else {

            icon = '📄';
        }
    }


    const name =
        isFile

            ? platformFileName(
                material.file_path
            )

            : (
                material.url ||
                'Внешняя ссылка'
            );


    const action =
        isFile

            ? `

                <button
                    class="pm-open-button"
                    type="button"
                    onclick="
                        downloadPlatformMaterial(
                            '${platformEscape(material.id)}'
                        )
                    "
                >
                    Скачать
                </button>

            `

            : `

                <button
                    class="pm-open-button"
                    type="button"
                    onclick="
                        goToPlatformMaterial(
                            '${platformEscape(material.id)}'
                        )
                    "
                >
                    Перейти
                </button>

            `;


    const deleteButton =
        isManager()

            ? `

                <button
                    class="pm-delete-button"
                    type="button"
                    onclick="
                        deletePlatformMaterial(
                            '${platformEscape(material.id)}'
                        )
                    "
                >
                    Удалить
                </button>

            `

            : '';


    return `

        <div
            class="pm-material"
            data-material-id="${platformEscape(material.id)}"
        >

            <div
                class="
                    pm-material-icon
                    ${
                        isFile &&
                        icon === 'PDF'
                            ? 'pdf'
                            : ''
                    }
                "
            >
                ${platformEscape(icon)}
            </div>


            <div class="pm-material-info">

                <div class="pm-material-name">
                    ${platformEscape(name)}
                </div>


                <div class="pm-material-meta">

                    ${
                        isFile
                            ? 'Файл • '
                            : 'Ссылка • '
                    }

                    ${platformEscape(
                        platformFormatDate(
                            material.created_at
                        )
                    )}

                    ${
                        isLink

                            ? `

                                <br>

                                ${platformEscape(
                                    material.url
                                )}

                            `

                            : ''
                    }

                </div>

            </div>


            <div class="pm-material-action">

                ${action}

                ${deleteButton}

            </div>

        </div>

    `;
}


/* =========================================================
   СОХРАНЕНИЕ ССЫЛКИ
   ========================================================= */

async function savePlatformMaterialUrl() {

    if (!isManager()) {
        return;
    }


    const {
        section,
        direction
    } = materialManagerState;


    const input =
        document.getElementById(
            'pmUrlInput'
        );


    const url =
        input?.value.trim() || '';


    if (!url) {

        setPMStatus(
            'Вставьте ссылку.',
            'error'
        );

        return;
    }


    try {

        new URL(url);

    } catch (error) {

        setPMStatus(
            'Введите корректную ссылку.',
            'error'
        );

        return;
    }


    setPMStatus(
        'Сохраняю ссылку...',
        ''
    );


    try {

        const session =
            await getCurrentSession();


        if (!session) {

            throw new Error(
                'Сессия пользователя не найдена.'
            );
        }


        const {
            error
        } =
            await supabaseClient
                .from(
                    PLATFORM_MATERIALS_TABLE
                )
                .insert({

                    section,

                    direction,

                    material_type:
                        'link',

                    url,

                    file_path:
                        null,

                    created_by:
                        session.user.id

                });


        if (error) {
            throw error;
        }


        input.value = '';


        setPMStatus(
            'Ссылка сохранена.',
            'ok'
        );


        await renderMaterialList(
            section,
            direction
        );


    } catch (error) {

        console.error(
            'Ошибка сохранения ссылки:',
            error
        );


        setPMStatus(
            'Не удалось сохранить ссылку: ' +
            (
                error.message ||
                String(error)
            ),
            'error'
        );
    }
}


/* =========================================================
   ЗАГРУЗКА ФАЙЛА / ВИДЕО
   ========================================================= */

async function uploadPlatformMaterialFile() {

    if (!isManager()) {
        return;
    }


    const {
        section,
        direction
    } = materialManagerState;


    const input =
        document.getElementById(
            'pmFileInput'
        );


    const file =
        input?.files?.[0];


    if (!file) {

        setPMStatus(
            'Сначала выберите файл.',
            'error'
        );

        return;
    }


    const maxSize =
        section === 'videos'

            ? 500 * 1024 * 1024

            : 100 * 1024 * 1024;


    if (file.size > maxSize) {

        setPMStatus(

            section === 'videos'

                ? 'Видео слишком большое. Максимальный размер — 500 МБ.'

                : 'Файл слишком большой. Максимальный размер — 100 МБ.',

            'error'
        );

        return;
    }


    setPMStatus(
        'Загружаю файл...',
        ''
    );


    try {

        const session =
            await getCurrentSession();


        if (!session) {

            throw new Error(
                'Сессия пользователя не найдена.'
            );
        }


        const safeName =
            file.name
                .normalize('NFKD')
                .replace(
                    /[^a-zA-Z0-9._-]+/g,
                    '_'
                )
                .replace(
                    /^_+|_+$/g,
                    ''
                )
                || 'file';


        const unique =
            window.crypto &&
            crypto.randomUUID

                ? crypto.randomUUID()

                : Date.now() +
                    '_' +
                    Math.random()
                        .toString(36)
                        .slice(2);


        const path =
            `${section}/${direction}/${unique}_${safeName}`;


        const {
            error: uploadError
        } =
            await supabaseClient
                .storage
                .from(
                    PLATFORM_STORAGE_BUCKET
                )
                .upload(
                    path,
                    file,
                    {
                        cacheControl: '3600',
                        upsert: false,
                        contentType:
                            file.type ||
                            undefined
                    }
                );


        if (uploadError) {
            throw uploadError;
        }


        setPMStatus(
            'Файл загружен. Сохраняю запись...',
            ''
        );


        const {
            error: insertError
        } =
            await supabaseClient
                .from(
                    PLATFORM_MATERIALS_TABLE
                )
                .insert({

                    section,

                    direction,

                    material_type:
                        'file',

                    url:
                        null,

                    file_path:
                        path,

                    created_by:
                        session.user.id

                });


        if (insertError) {

            await supabaseClient
                .storage
                .from(
                    PLATFORM_STORAGE_BUCKET
                )
                .remove([
                    path
                ]);

            throw insertError;
        }


        input.value = '';


        setPMStatus(
            'Файл успешно сохранён.',
            'ok'
        );


        await renderMaterialList(
            section,
            direction
        );


    } catch (error) {

        console.error(
            'Ошибка загрузки файла:',
            error
        );


        setPMStatus(
            'Не удалось загрузить файл: ' +
            (
                error.message ||
                String(error)
            ),
            'error'
        );
    }
}


/* =========================================================
   СКАЧИВАНИЕ
   ========================================================= */

async function downloadPlatformMaterial(
    materialId
) {

    try {

        const {
            data: material,
            error: materialError
        } =
            await supabaseClient
                .from(
                    PLATFORM_MATERIALS_TABLE
                )
                .select(
                    'id, file_path, material_type'
                )
                .eq(
                    'id',
                    materialId
                )
                .single();


        if (materialError) {
            throw materialError;
        }


        if (!material?.file_path) {

            throw new Error(
                'Файл не найден.'
            );
        }


        const {
            data,
            error
        } =
            await supabaseClient
                .storage
                .from(
                    PLATFORM_STORAGE_BUCKET
                )
                .createSignedUrl(
                    material.file_path,
                    60 * 60,
                    {
                        download:
                            platformFileName(
                                material.file_path
                            )
                    }
                );


        if (error) {
            throw error;
        }


        if (!data?.signedUrl) {

            throw new Error(
                'Не удалось получить ссылку на скачивание.'
            );
        }


        window.location.href =
            data.signedUrl;


    } catch (error) {

        console.error(
            'Ошибка скачивания:',
            error
        );


        alert(
            'Не удалось скачать файл.\n\n' +
            (
                error.message ||
                String(error)
            )
        );
    }
}


/* =========================================================
   ОТКРЫТИЕ ССЫЛКИ
   ========================================================= */

async function goToPlatformMaterial(
    materialId
) {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from(
                    PLATFORM_MATERIALS_TABLE
                )
                .select('url')
                .eq(
                    'id',
                    materialId
                )
                .single();


        if (error) {
            throw error;
        }


        if (!data?.url) {

            throw new Error(
                'Ссылка не найдена.'
            );
        }


        window.location.href =
            data.url;


    } catch (error) {

        console.error(
            'Ошибка перехода по ссылке:',
            error
        );


        alert(
            'Не удалось открыть ссылку.\n\n' +
            (
                error.message ||
                String(error)
            )
        );
    }
}


/* =========================================================
   УДАЛЕНИЕ
   ========================================================= */

async function deletePlatformMaterial(
    materialId
) {

    if (!isManager()) {
        return;
    }


    if (
        !confirm(
            'Удалить этот материал?'
        )
    ) {
        return;
    }


    try {

        const {
            data: material,
            error: getError
        } =
            await supabaseClient
                .from(
                    PLATFORM_MATERIALS_TABLE
                )
                .select(
                    'id, section, direction, file_path'
                )
                .eq(
                    'id',
                    materialId
                )
                .single();


        if (getError) {
            throw getError;
        }


        if (material?.file_path) {

            const {
                error: storageError
            } =
                await supabaseClient
                    .storage
                    .from(
                        PLATFORM_STORAGE_BUCKET
                    )
                    .remove([
                        material.file_path
                    ]);


            if (storageError) {

                console.warn(
                    'Не удалось удалить файл из Storage:',
                    storageError
                );
            }
        }


        const {
            error
        } =
            await supabaseClient
                .from(
                    PLATFORM_MATERIALS_TABLE
                )
                .delete()
                .eq(
                    'id',
                    materialId
                );


        if (error) {
            throw error;
        }


        await renderMaterialList(
            material.section,
            material.direction
        );


    } catch (error) {

        console.error(
            'Ошибка удаления материала:',
            error
        );


        alert(
            'Не удалось удалить материал.\n\n' +
            (
                error.message ||
                String(error)
            )
        );
    }
}


/* =========================================================
   СТАТУС
   ========================================================= */

function setPMStatus(
    text,
    type
) {

    const box =
        document.getElementById(
            'pmStatus'
        );

    if (!box) {
        return;
    }


    box.className =
        'pm-status ' +
        (
            type || ''
        );


    box.textContent =
        text || '';
}


/* =========================================================
   СОВМЕСТИМОСТЬ СО СТАРЫМИ ВЫЗОВАМИ
   ========================================================= */

async function saveMaterialUrl() {

    await savePlatformMaterialUrl();
}


async function uploadMaterialFile() {

    await uploadPlatformMaterialFile();
}


async function loadMaterials(section) {

    await loadPlatformMaterials(
        section
    );
}


/* =========================================================
   СТАРАЯ ФУНКЦИЯ ТЕСТОВ
   ========================================================= */

function openTest(
    type,
    title
) {

    alert(
        'Раздел тестов подключается отдельно.'
    );
}


/* =========================================================
   СТАРАЯ ФУНКЦИЯ МАТЕРИАЛОВ
   ========================================================= */

function openMaterial(
    url,
    title
) {

    const cleanUrl =
        String(url || '').trim();


    if (cleanUrl) {

        window.location.href =
            cleanUrl;

        return;
    }


    if (title) {

        alert(
            title +
            '\n\nСсылка на материал пока не добавлена.'
        );
    }
}
