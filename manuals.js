/* =========================================================
   MANUAL.JS — ИСПРАВЛЕННАЯ ВЕРСИЯ
   ========================================================= */

const PLATFORM_MATERIALS_TABLE = 'platform_materials';
const PLATFORM_STORAGE_BUCKET = 'methodicals';

const PLATFORM_DIRECTIONS = [
    { key: 'adult', icon: '✦', title: 'Взрослая матрица' },
    { key: 'child', icon: '👶', title: 'Детская матрица' },
    { key: 'compatibility', icon: '💕', title: 'Матрица совместимости' },
    { key: 'vedic', icon: 'ॐ', title: 'Ведическая нумерология' },
    { key: 'pythagoras', icon: '🔢', title: 'Квадрат Пифагора' }
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
   ПРИВЕТСТВИЕ
   На главной странице раздела — ПОКАЗЫВАЕМ.
   Внутри конкретного направления — УБИРАЕМ.
   ========================================================= */

function setPlatformWelcome(show) {

    const elements = document.querySelectorAll(
        'h1, h2, h3, .welcome, .welcome-title, .page-title'
    );

    elements.forEach(el => {

        const text =
            (el.textContent || '').trim();

        if (
            text.includes('Добро пожаловать') ||
            text.includes('Добро пожаловать, Центр Нумера')
        ) {

            el.style.display =
                show ? '' : 'none';
        }
    });
}


/* =========================================================
   СТИЛИ
   ========================================================= */

function ensureMaterialStyles() {

    if (
        document.getElementById(
            'platformMaterialStylesV4'
        )
    ) {
        return;
    }

    const style = document.createElement('style');

    style.id =
        'platformMaterialStylesV4';

    style.textContent = `

        /* ================================================
           КАРТОЧКИ НАПРАВЛЕНИЙ
           Цвета берём те же, что используются в ТЕСТАХ
           ================================================ */

        #contentCards .pm-direction-wrapper {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
        }


        #contentCards .pm-direction-wrapper .cards {
            width: 100% !important;

            display: grid !important;

            grid-template-columns:
                repeat(5, minmax(170px, 1fr)) !important;

            gap: 18px !important;

            align-items: stretch !important;

            box-sizing: border-box !important;
        }


        #contentCards .pm-direction-wrapper .card {
            width: 100% !important;
            min-width: 0 !important;

            box-sizing: border-box !important;

            cursor: pointer !important;
        }


        /* ================================================
           ВНУТРИ НАПРАВЛЕНИЯ
           ================================================ */

        #contentCards .pm-page {
            width: 100% !important;
            max-width: none !important;

            margin: 0 !important;
            padding: 0 !important;

            box-sizing: border-box !important;
        }


        #contentCards .pm-back {
            display: inline-flex !important;

            margin: 0 0 18px 0 !important;
            padding: 0 !important;

            border: none !important;
            background: transparent !important;

            color: #f6d66c !important;

            font-size: 17px !important;
            font-weight: 700 !important;

            cursor: pointer !important;
        }


        #contentCards .pm-page-head {
            width: 100% !important;

            display: flex !important;
            align-items: flex-start !important;
            justify-content: space-between !important;

            gap: 25px !important;

            margin: 0 0 25px 0 !important;
            padding: 0 !important;

            box-sizing: border-box !important;
        }


        #contentCards .pm-page-title {
            margin: 0 !important;
            padding: 0 !important;

            color: #f6d66c !important;

            font-family: Georgia, serif !important;

            font-size: 36px !important;
            line-height: 1.15 !important;
        }


        #contentCards .pm-page-subtitle {
            margin: 8px 0 0 0 !important;

            color: #ffffff !important;

            font-size: 17px !important;
        }


        /* ================================================
           ДОБАВИТЬ МАТЕРИАЛ
           ================================================ */

        #contentCards .pm-add-panel {
            display: none !important;

            width: 100% !important;

            margin: 0 0 30px 0 !important;
            padding: 25px !important;

            box-sizing: border-box !important;

            border: 1px solid
                rgba(215,170,49,.5) !important;

            border-radius: 16px !important;

            background:
                rgba(20,13,48,.85) !important;
        }


        #contentCards .pm-add-panel.open {
            display: block !important;
        }


        #contentCards .pm-add-panel-title {
            margin: 0 0 22px 0 !important;

            color: #f6d66c !important;

            font-family: Georgia, serif !important;

            font-size: 25px !important;
            font-weight: 700 !important;
        }


        /* ДВЕ КОЛОНКИ — БОЛЬШЕ НИКАКОГО НАЛОЖЕНИЯ */

        #contentCards .pm-add-grid {
            width: 100% !important;

            display: grid !important;

            grid-template-columns:
                minmax(0, 1fr)
                minmax(0, 1fr) !important;

            gap: 25px !important;

            box-sizing: border-box !important;
        }


        #contentCards .pm-add-box {
            width: 100% !important;
            min-width: 0 !important;

            display: flex !important;
            flex-direction: column !important;

            box-sizing: border-box !important;

            padding: 22px !important;

            border: 1px solid
                rgba(215,170,49,.35) !important;

            border-radius: 14px !important;

            background:
                rgba(255,255,255,.04) !important;
        }


        #contentCards .pm-add-label {
            display: block !important;

            margin: 0 0 14px 0 !important;

            color: #ffffff !important;

            font-size: 17px !important;
            font-weight: 700 !important;
        }


        #contentCards .pm-file-row {
            width: 100% !important;

            display: flex !important;
            flex-direction: column !important;

            gap: 14px !important;
        }


        #contentCards .pm-input,
        #contentCards .pm-file-input {
            width: 100% !important;
            min-width: 0 !important;

            min-height: 48px !important;

            padding: 11px 14px !important;

            box-sizing: border-box !important;

            border: 1px solid
                rgba(215,170,49,.6) !important;

            border-radius: 10px !important;

            background: #17112f !important;

            color: #ffffff !important;

            font-size: 15px !important;
        }


        #contentCards .pm-add-box .pm-button {
            align-self: flex-start !important;

            margin-top: 12px !important;
        }


        /* ================================================
           КНОПКА
           ================================================ */

        #contentCards .pm-button {
            display: inline-flex !important;

            align-items: center !important;
            justify-content: center !important;

            min-height: 46px !important;

            padding: 10px 20px !important;

            box-sizing: border-box !important;

            border: 1px solid #d7aa31 !important;
            border-radius: 11px !important;

            background:
                linear-gradient(
                    135deg,
                    #7650c9,
                    #5a3ca4
                ) !important;

            color: #ffffff !important;

            font-size: 15px !important;
            font-weight: 700 !important;

            cursor: pointer !important;
        }


        /* ================================================
           МАТЕРИАЛЫ — НА ВСЮ ШИРИНУ СТРАНИЦЫ
           НЕ В ОДИН СТОЛБИК
           ================================================ */

        #contentCards .pm-materials {
            width: 100% !important;

            display: grid !important;

            grid-template-columns:
                repeat(3, minmax(0, 1fr)) !important;

            gap: 20px !important;

            align-items: stretch !important;

            box-sizing: border-box !important;
        }


        #contentCards .pm-material {
            width: 100% !important;
            min-width: 0 !important;

            display: flex !important;
            flex-direction: column !important;

            box-sizing: border-box !important;

            padding: 20px !important;

            border: 1px solid
                rgba(215,170,49,.32) !important;

            border-radius: 15px !important;

            background:
                rgba(15,11,38,.65) !important;
        }


        #contentCards .pm-material-icon {
            width: 58px !important;
            height: 58px !important;

            display: flex !important;

            align-items: center !important;
            justify-content: center !important;

            margin-bottom: 15px !important;

            border-radius: 11px !important;

            background:
                rgba(91,48,139,.55) !important;

            color: #f6d66c !important;

            font-size: 24px !important;
            font-weight: 800 !important;
        }


        #contentCards .pm-material-icon.pdf {
            background: #a93636 !important;
            color: #ffffff !important;

            font-size: 15px !important;
        }


        #contentCards .pm-material-info {
            width: 100% !important;

            min-width: 0 !important;

            flex: 1 !important;
        }


        #contentCards .pm-material-name {
            margin: 0 0 8px 0 !important;

            color: #ffffff !important;

            font-size: 18px !important;
            line-height: 1.35 !important;
            font-weight: 700 !important;

            overflow-wrap: anywhere !important;
        }


        #contentCards .pm-material-meta {
            margin: 0 !important;

            color: #c9c1ce !important;

            font-size: 14px !important;
            line-height: 1.5 !important;

            overflow-wrap: anywhere !important;
        }


        /* ================================================
           КНОПКИ МАТЕРИАЛА
           ================================================ */

        #contentCards .pm-material-action {
            width: 100% !important;

            display: flex !important;

            align-items: center !important;

            gap: 10px !important;

            margin-top: 18px !important;
        }


        #contentCards .pm-open-button {
            flex: 1 !important;

            min-height: 43px !important;

            padding: 9px 14px !important;

            border: 1px solid #d7aa31 !important;
            border-radius: 9px !important;

            background: #63358d !important;

            color: #f8e7a8 !important;

            font-size: 15px !important;
            font-weight: 700 !important;

            cursor: pointer !important;
        }


        #contentCards .pm-delete-button {
            min-height: 43px !important;

            padding: 9px 13px !important;

            border: 1px solid
                rgba(255,160,160,.35) !important;

            border-radius: 9px !important;

            background: transparent !important;

            color: #ffb4b4 !important;

            cursor: pointer !important;
        }


        /* ================================================
           ПУСТО
           ================================================ */

        #contentCards .pm-empty {
            grid-column: 1 / -1 !important;

            width: 100% !important;
            min-height: 180px !important;

            display: flex !important;
            flex-direction: column !important;

            align-items: center !important;
            justify-content: center !important;

            box-sizing: border-box !important;

            padding: 30px !important;

            text-align: center !important;

            border: 1px dashed
                rgba(215,170,49,.35) !important;

            border-radius: 16px !important;

            color: #c9c1ce !important;
        }


        #contentCards .pm-empty-title {
            margin: 0 0 9px 0 !important;

            color: #f6d66c !important;

            font-family: Georgia, serif !important;

            font-size: 25px !important;
            font-weight: 700 !important;
        }


        /* ================================================
           СТАТУС
           ================================================ */

        #contentCards .pm-status {
            width: 100% !important;

            margin-top: 16px !important;

            color: #ddd5df !important;

            font-size: 14px !important;
        }


        #contentCards .pm-status.ok {
            color: #a9e4b4 !important;
        }


        #contentCards .pm-status.error {
            color: #ffb0b0 !important;
        }


        /* ================================================
           АДАПТИВ
           ================================================ */

        @media (max-width: 1100px) {

            #contentCards .pm-direction-wrapper .cards {
                grid-template-columns:
                    repeat(3, minmax(170px, 1fr))
                !important;
            }


            #contentCards .pm-materials {
                grid-template-columns:
                    repeat(2, minmax(0, 1fr))
                !important;
            }
        }


        @media (max-width: 750px) {

            #contentCards .pm-direction-wrapper .cards {
                grid-template-columns:
                    repeat(2, minmax(150px, 1fr))
                !important;
            }


            #contentCards .pm-add-grid {
                grid-template-columns:
                    1fr !important;
            }


            #contentCards .pm-materials {
                grid-template-columns:
                    1fr !important;
            }


            #contentCards .pm-page-head {
                flex-direction: column !important;
            }


            #contentCards .pm-head-actions {
                width: 100% !important;
            }


            #contentCards .pm-head-actions
            .pm-button {
                width: 100% !important;
            }
        }

    `;

    document.head.appendChild(style);
}


/* =========================================================
   ГЛАВНЫЕ КАРТОЧКИ РАЗДЕЛА
   ========================================================= */

async function loadPlatformMaterials(section) {

    const contentCards =
        document.getElementById(
            'contentCards'
        );

    if (!contentCards) return;

    ensureMaterialStyles();

    /* Здесь приветствие ДОЛЖНО быть */
    setPlatformWelcome(true);

    const subtitle =
        section === 'videos'
            ? 'Видео'
            : 'Методическое пособие';


    contentCards.innerHTML = `

        <div class="pm-direction-wrapper">

            <div class="cards">

                ${
                    PLATFORM_DIRECTIONS
                        .map(item => {

                            let icon =
                                `<div class="card-icon">
                                    ${item.icon}
                                 </div>`;


                            if (
                                item.key ===
                                'pythagoras'
                            ) {

                                icon = `
                                    <div
                                        class="card-icon"
                                        style="
                                            font-size:26px;
                                            line-height:1.1;
                                        "
                                    >
                                        ¹²
                                        <br>
                                        ³⁴
                                    </div>
                                `;
                            }


                            return `

                                <div
                                    class="
                                        card
                                        method-card
                                    "
                                    onclick="
                                        openPlatformMaterial(
                                            '${section}',
                                            '${item.key}'
                                        )
                                    "
                                >

                                    ${icon}

                                    <div
                                        class="card-content"
                                    >

                                        <h3>
                                            ${item.title}
                                        </h3>

                                        <p>
                                            ${subtitle}
                                        </p>

                                    </div>

                                </div>

                            `;

                        })
                        .join('')
                }

            </div>

        </div>

    `;
}


/* =========================================================
   РАЗДЕЛЫ СЛЕВА
   ========================================================= */

async function loadManuals() {

    setPlatformWelcome(true);

    await loadPlatformMaterials(
        'manuals'
    );
}


async function loadVideos() {

    setPlatformWelcome(true);

    await loadPlatformMaterials(
        'videos'
    );
}


/* =========================================================
   ОТКРЫТЬ КОНКРЕТНОЕ НАПРАВЛЕНИЕ
   ========================================================= */

async function openPlatformMaterial(
    section,
    direction
) {

    const contentCards =
        document.getElementById(
            'contentCards'
        );

    if (!contentCards) return;

    ensureMaterialStyles();


    /*
     * ВАЖНО:
     * после входа именно во взрослую матрицу,
     * детскую, совместимость и т.д.
     * приветствие УБИРАЕМ.
     */

    setPlatformWelcome(false);


    const title =
        PLATFORM_NAMES[direction] ||
        'Материал';


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

                    <h2
                        class="pm-page-title"
                    >
                        ${title}
                    </h2>

                    <p
                        class="pm-page-subtitle"
                    >
                        Все материалы
                    </p>

                </div>


                ${
                    isManager()
                        ? `

                            <div
                                class="pm-head-actions"
                            >

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


                            <div
                                class="pm-add-grid"
                            >

                                <div
                                    class="pm-add-box"
                                >

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


                                <div
                                    class="pm-add-box"
                                >

                                    <label
                                        class="pm-add-label"
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

                        </div>

                    `
                    : ''
            }


            <div
                id="pmMaterialsList"
                class="pm-materials"
            >

                <div class="pm-empty">
                    Загрузка материалов...
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
   ОСТАЛЬНЫЕ ФУНКЦИИ
   ========================================================= */

function toggleMaterialAddPanel() {

    const panel =
        document.getElementById(
            'pmAddPanel'
        );

    if (!panel) return;

    panel.classList.toggle(
        'open'
    );
}


async function getAllMaterials(
    section,
    direction
) {

    const {
        data,
        error
    } =
        await supabaseClient
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

    if (error) throw error;

    return data || [];
}


async function renderMaterialList(
    section,
    direction
) {

    const list =
        document.getElementById(
            'pmMaterialsList'
        );

    if (!list) return;


    try {

        const materials =
            await getAllMaterials(
                section,
                direction
            );


        if (!materials.length) {

            list.innerHTML = `

                <div class="pm-empty">

                    <div
                        class="pm-empty-title"
                    >
                        Материалов пока нет
                    </div>

                    <div>
                        ${
                            isManager()
                                ? 'Добавьте файл или ссылку выше.'
                                : 'Материалы пока не добавлены.'
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

    }
    catch (error) {

        console.error(
            error
        );

        list.innerHTML = `

            <div class="pm-empty">

                <div
                    class="pm-empty-title"
                >
                    Не удалось загрузить материалы
                </div>

                <div>
                    ${
                        error.message ||
                        String(error)
                    }
                </div>

            </div>

        `;
    }
}


function renderMaterialItem(
    material
) {

    const isFile =
        material.material_type === 'file' &&
        !!material.file_path;


    const icon =
        isFile
            ? (
                material.file_path
                    .toLowerCase()
                    .endsWith('.pdf')
                    ? 'PDF'
                    : '📄'
            )
            : '🔗';


    const name =
        isFile
            ? (
                material.file_path
                    .split('/')
                    .pop() || 'Файл'
            )
            : (
                material.url ||
                'Внешняя ссылка'
            );


    return `

        <div
            class="pm-material"
        >

            <div
                class="
                    pm-material-icon
                    ${
                        icon === 'PDF'
                            ? 'pdf'
                            : ''
                    }
                "
            >
                ${icon}
            </div>


            <div
                class="pm-material-info"
            >

                <div
                    class="pm-material-name"
                >
                    ${platformEscape(name)}
                </div>


                <div
                    class="pm-material-meta"
                >
                    ${
                        isFile
                            ? 'Файл'
                            : 'Внешняя ссылка'
                    }
                </div>

            </div>


            <div
                class="pm-material-action"
            >

                ${
                    isFile
                        ? `
                            <button
                                class="pm-open-button"
                                type="button"
                                onclick="
                                    downloadPlatformMaterial(
                                        '${material.id}'
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
                                        '${material.id}'
                                    )
                                "
                            >
                                Перейти
                            </button>
                        `
                }


                ${
                    isManager()
                        ? `
                            <button
                                class="pm-delete-button"
                                type="button"
                                onclick="
                                    deletePlatformMaterial(
                                        '${material.id}'
                                    )
                                "
                            >
                                Удалить
                            </button>
                        `
                        : ''
                }

            </div>

        </div>

    `;
}


function platformEscape(value) {

    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


function isManager() {

    return window.currentUserIsManager === true;
}


async function getCurrentSession() {

    const {
        data: { session },
        error
    } =
        await supabaseClient.auth.getSession();

    if (error) throw error;

    return session;
}


function setPMStatus(
    text,
    type
) {

    const box =
        document.getElementById(
            'pmStatus'
        );

    if (!box) return;

    box.className =
        'pm-status ' +
        (type || '');

    box.textContent =
        text || '';
}


/* =========================================================
   СОХРАНИТЬ ССЫЛКУ
   ========================================================= */

async function savePlatformMaterialUrl() {

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

    }
    catch (_) {

        setPMStatus(
            'Введите корректную ссылку.',
            'error'
        );

        return;
    }


    try {

        const session =
            await getCurrentSession();


        const {
            error
        } =
            await supabaseClient
                .from(
                    PLATFORM_MATERIALS_TABLE
                )
                .insert({
                    section:
                        materialManagerState.section,

                    direction:
                        materialManagerState.direction,

                    material_type:
                        'link',

                    url,

                    file_path:
                        null,

                    created_by:
                        session.user.id
                });


        if (error) throw error;


        input.value = '';


        setPMStatus(
            'Ссылка сохранена.',
            'ok'
        );


        await renderMaterialList(
            materialManagerState.section,
            materialManagerState.direction
        );

    }
    catch (error) {

        setPMStatus(
            error.message ||
            String(error),
            'error'
        );
    }
}


/* =========================================================
   ЗАГРУЗИТЬ ФАЙЛ
   ========================================================= */

async function uploadPlatformMaterialFile() {

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


    try {

        const session =
            await getCurrentSession();


        const safeName =
            file.name
                .replace(
                    /[^a-zA-Z0-9._-]+/g,
                    '_'
                );


        const unique =
            crypto.randomUUID();


        const path =
            `${
                materialManagerState.section
            }/${
                materialManagerState.direction
            }/${
                unique
            }_${
                safeName
            }`;


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


        const {
            error: insertError
        } =
            await supabaseClient
                .from(
                    PLATFORM_MATERIALS_TABLE
                )
                .insert({
                    section:
                        materialManagerState.section,

                    direction:
                        materialManagerState.direction,

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
            materialManagerState.section,
            materialManagerState.direction
        );

    }
    catch (error) {

        setPMStatus(
            error.message ||
            String(error),
            'error'
        );
    }
}


/* =========================================================
   СКАЧАТЬ
   ========================================================= */

async function downloadPlatformMaterial(
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
                .select(
                    'file_path'
                )
                .eq(
                    'id',
                    materialId
                )
                .single();


        if (error) throw error;


        const {
            data: signed,
            error: signedError
        } =
            await supabaseClient
                .storage
                .from(
                    PLATFORM_STORAGE_BUCKET
                )
                .createSignedUrl(
                    data.file_path,
                    3600
                );


        if (signedError) {
            throw signedError;
        }


        window.open(
            signed.signedUrl,
            '_blank'
        );

    }
    catch (error) {

        alert(
            'Не удалось открыть файл:\n' +
            error.message
        );
    }
}


/* =========================================================
   ОТКРЫТЬ ССЫЛКУ
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
                .select(
                    'url'
                )
                .eq(
                    'id',
                    materialId
                )
                .single();


        if (error) throw error;


        window.open(
            data.url,
            '_blank',
            'noopener,noreferrer'
        );

    }
    catch (error) {

        alert(
            'Не удалось открыть ссылку:\n' +
            error.message
        );
    }
}


/* =========================================================
   УДАЛЕНИЕ
   ========================================================= */

async function deletePlatformMaterial(
    materialId
) {

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
                    'section,direction,file_path'
                )
                .eq(
                    'id',
                    materialId
                )
                .single();


        if (getError) throw getError;


        if (material.file_path) {

            await supabaseClient
                .storage
                .from(
                    PLATFORM_STORAGE_BUCKET
                )
                .remove([
                    material.file_path
                ]);
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


        if (error) throw error;


        await renderMaterialList(
            material.section,
            material.direction
        );

    }
    catch (error) {

        alert(
            'Не удалось удалить материал:\n' +
            error.message
        );
    }
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
    await loadPlatformMaterials(section);
}
