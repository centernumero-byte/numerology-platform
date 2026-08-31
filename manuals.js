/* =========================================================
   MANUAL.JS
   Методические пособия + Видео
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
    if (!path) return 'Файл';

    const name =
        String(path).split('/').pop() || 'Файл';

    return name.replace(
        /^[0-9a-f-]{20,}_/i,
        ''
    );
}


function platformFormatDate(value) {
    if (!value) return '';

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

    if (error) throw error;

    return session;
}


/* =========================================================
   СТИЛИ
   ВАЖНО:
   - карточки направлений используют СТИЛИ TESTS;
   - свои стили не меняют цвет карточек;
   - форма добавления принудительно располагается
     в две нормальные колонки;
   ========================================================= */

function ensureMaterialStyles() {

    if (
        document.getElementById(
            'platformMaterialStylesV3'
        )
    ) {
        return;
    }

    const style = document.createElement('style');

    style.id =
        'platformMaterialStylesV3';

    style.textContent = `

        /* =================================================
           СТРАНИЦА НАПРАВЛЕНИЯ
           ================================================= */

        #contentCards .pm-page {
            width: 100% !important;
            max-width: 1180px !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
        }


        #contentCards .pm-back {
            display: inline-flex !important;
            align-items: center !important;

            margin: 0 0 18px 0 !important;
            padding: 0 !important;

            border: none !important;
            background: transparent !important;

            color: #f6d66c !important;

            font-size: 16px !important;
            font-weight: 700 !important;

            cursor: pointer !important;
        }


        #contentCards .pm-page-head {
            width: 100% !important;

            display: flex !important;
            align-items: flex-start !important;
            justify-content: space-between !important;

            gap: 30px !important;

            margin: 0 0 25px 0 !important;
            padding: 0 !important;

            box-sizing: border-box !important;
        }


        #contentCards .pm-page-head-left {
            flex: 1 1 auto !important;
            min-width: 0 !important;
        }


        #contentCards .pm-page-title {
            display: block !important;

            margin: 0 !important;
            padding: 0 !important;

            color: #f6d66c !important;

            font-family: Georgia, serif !important;

            font-size: 34px !important;
            line-height: 1.2 !important;

            white-space: normal !important;
        }


        #contentCards .pm-page-subtitle {
            display: block !important;

            margin: 8px 0 0 0 !important;
            padding: 0 !important;

            color: #eee5d0 !important;

            font-size: 16px !important;
            line-height: 1.4 !important;
        }


        #contentCards .pm-head-actions {
            flex: 0 0 auto !important;

            display: block !important;

            margin: 0 !important;
            padding: 0 !important;
        }


        /* =================================================
           КНОПКИ
           ================================================= */

        #contentCards .pm-button {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;

            min-height: 44px !important;

            box-sizing: border-box !important;

            padding: 10px 19px !important;

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

            white-space: nowrap !important;
        }


        #contentCards .pm-button:hover {
            transform: translateY(-1px);
        }


        /* =================================================
           ДОБАВЛЕНИЕ МАТЕРИАЛА
           ================================================= */

        #contentCards .pm-add-panel {
            display: none !important;

            width: 100% !important;

            box-sizing: border-box !important;

            margin: 0 0 25px 0 !important;
            padding: 22px !important;

            border: 1px solid
                rgba(215,170,49,.45) !important;

            border-radius: 16px !important;

            background:
                rgba(20,13,48,.82) !important;
        }


        #contentCards .pm-add-panel.open {
            display: block !important;
        }


        #contentCards .pm-add-panel-title {
            display: block !important;

            margin: 0 0 20px 0 !important;
            padding: 0 !important;

            color: #f6d66c !important;

            font-family: Georgia, serif !important;

            font-size: 23px !important;
            line-height: 1.2 !important;
            font-weight: 700 !important;
        }


        /* САМО ЭТА СЕТКА — ДВЕ КОЛОНКИ */

        #contentCards .pm-add-grid {
            width: 100% !important;

            display: grid !important;

            grid-template-columns:
                minmax(0, 1fr)
                minmax(0, 1fr) !important;

            gap: 20px !important;

            align-items: stretch !important;

            box-sizing: border-box !important;
        }


        #contentCards .pm-add-box {
            width: 100% !important;
            min-width: 0 !important;

            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;

            box-sizing: border-box !important;

            padding: 20px !important;

            border: 1px solid
                rgba(215,170,49,.30) !important;

            border-radius: 14px !important;

            background:
                rgba(255,255,255,.035) !important;
        }


        #contentCards .pm-add-label {
            display: block !important;

            width: 100% !important;

            margin: 0 0 12px 0 !important;
            padding: 0 !important;

            color: #eee5d0 !important;

            font-size: 16px !important;
            line-height: 1.35 !important;
            font-weight: 700 !important;
        }


        #contentCards .pm-file-row {
            width: 100% !important;

            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;

            gap: 12px !important;

            box-sizing: border-box !important;
        }


        #contentCards .pm-input,
        #contentCards .pm-file-input {
            display: block !important;

            width: 100% !important;
            min-width: 0 !important;

            min-height: 44px !important;

            box-sizing: border-box !important;

            padding: 10px 12px !important;

            border: 1px solid
                rgba(215,170,49,.60) !important;

            border-radius: 10px !important;

            background: #17112f !important;
            color: #ffffff !important;

            font-size: 14px !important;
        }


        #contentCards .pm-add-box .pm-button {
            width: auto !important;
            max-width: 100% !important;

            align-self: flex-start !important;

            margin-top: 12px !important;
        }


        #contentCards .pm-status {
            display: block !important;

            width: 100% !important;

            min-height: 20px !important;

            margin: 16px 0 0 0 !important;

            color: #ddd5df !important;

            font-size: 14px !important;
            line-height: 1.5 !important;
        }


        #contentCards .pm-status.ok {
            color: #a9e4b4 !important;
        }


        #contentCards .pm-status.error {
            color: #ffb0b0 !important;
        }


        /* =================================================
           СПИСОК МАТЕРИАЛОВ
           ================================================= */

        #contentCards .pm-materials {
            width: 100% !important;

            display: flex !important;
            flex-direction: column !important;

            gap: 12px !important;
        }


        #contentCards .pm-material {
            width: 100% !important;
            min-width: 0 !important;

            display: grid !important;

            grid-template-columns:
                64px
                minmax(0, 1fr)
                auto !important;

            align-items: center !important;

            gap: 18px !important;

            box-sizing: border-box !important;

            padding: 16px 18px !important;

            border: 1px solid
                rgba(215,170,49,.28) !important;

            border-radius: 14px !important;

            background:
                rgba(15,11,38,.65) !important;
        }


        #contentCards .pm-material-icon {
            width: 58px !important;
            height: 58px !important;

            display: flex !important;
            align-items: center !important;
            justify-content: center !important;

            box-sizing: border-box !important;

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
            min-width: 0 !important;
        }


        #contentCards .pm-material-name {
            margin: 0 0 6px 0 !important;
            padding: 0 !important;

            color: #ffffff !important;

            font-size: 18px !important;
            line-height: 1.3 !important;
            font-weight: 700 !important;

            overflow-wrap: anywhere !important;
        }


        #contentCards .pm-material-meta {
            color: #c9c1ce !important;

            font-size: 14px !important;
            line-height: 1.5 !important;

            overflow-wrap: anywhere !important;
        }


        #contentCards .pm-material-action {
            display: flex !important;
            align-items: center !important;

            gap: 8px !important;

            white-space: nowrap !important;
        }


        #contentCards .pm-open-button {
            min-height: 42px !important;

            box-sizing: border-box !important;

            padding: 9px 18px !important;

            border: 1px solid #d7aa31 !important;
            border-radius: 9px !important;

            background: #63358d !important;
            color: #f8e7a8 !important;

            font-size: 15px !important;
            font-weight: 700 !important;

            cursor: pointer !important;
        }


        #contentCards .pm-delete-button {
            min-height: 42px !important;

            box-sizing: border-box !important;

            padding: 9px 13px !important;

            border: 1px solid
                rgba(255,160,160,.35) !important;

            border-radius: 9px !important;

            background: transparent !important;
            color: #ffb4b4 !important;

            cursor: pointer !important;
        }


        /* =================================================
           ПУСТО
           ================================================= */

        #contentCards .pm-empty {
            width: 100% !important;
            min-height: 150px !important;

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

            background:
                rgba(15,11,38,.35) !important;

            color: #c9c1ce !important;
        }


        #contentCards .pm-empty-title {
            margin: 0 0 9px 0 !important;

            color: #f6d66c !important;

            font-family: Georgia, serif !important;

            font-size: 24px !important;
            line-height: 1.25 !important;
            font-weight: 700 !important;
        }


        /* =================================================
           МОБИЛЬНЫЙ ЭКРАН
           ================================================= */

        @media (max-width: 800px) {

            #contentCards .pm-page-head {
                flex-direction: column !important;
                gap: 15px !important;
            }


            #contentCards .pm-head-actions {
                width: 100% !important;
            }


            #contentCards .pm-head-actions .pm-button {
                width: 100% !important;
            }


            #contentCards .pm-add-grid {
                grid-template-columns:
                    1fr !important;
            }


            #contentCards .pm-material {
                grid-template-columns:
                    56px
                    minmax(0, 1fr) !important;
            }


            #contentCards .pm-material-action {
                grid-column: 2 !important;

                width: 100% !important;

                flex-wrap: wrap !important;
            }


            #contentCards .pm-material-action button {
                flex: 0 0 auto !important;
            }


            #contentCards .pm-page-title {
                font-size: 28px !important;
            }
        }


        /* =================================================
           НАПРАВЛЕНИЯ
           
           ВАЖНО:
           здесь НЕ задаём свой цвет.
           Используются существующие .cards / .card /
           .method-card — те же, что у раздела "Тесты".
           ================================================= */

        #contentCards .pm-direction-wrapper {
            width: 100% !important;
            box-sizing: border-box !important;
        }


        #contentCards .pm-direction-wrapper .cards {
            width: 100% !important;
        }


        #contentCards .pm-direction-wrapper .card.method-card {
            cursor: pointer !important;
        }

    `;

    document.head.appendChild(style);
}


/* =========================================================
   КАРТОЧКИ НАПРАВЛЕНИЙ
   Используем ТЕ ЖЕ .cards и .card, что у ТЕСТОВ.
   ========================================================= */

async function loadPlatformMaterials(section) {

    const contentCards =
        document.getElementById(
            'contentCards'
        );

    if (!contentCards) return;

    ensureMaterialStyles();

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
                                            font-size: 26px;
                                            line-height: 1.1;
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
                                    data-section="${section}"
                                    data-direction="${item.key}"
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
                                            ${
                                                platformEscape(
                                                    item.title
                                                )
                                            }
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
   ПОЛУЧИТЬ МАТЕРИАЛЫ
   ========================================================= */

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


/* =========================================================
   СТРАНИЦА НАПРАВЛЕНИЯ
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

                <div
                    class="pm-page-head-left"
                >

                    <h2
                        class="pm-page-title"
                    >
                        ${platformEscape(title)}
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

                                <!-- =====================
                                     ФАЙЛ
                                     ===================== -->

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


                                <!-- =====================
                                     ССЫЛКА
                                     ===================== -->

                                <div
                                    class="pm-add-box"
                                >

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

    if (!panel) return;

    panel.classList.toggle(
        'open'
    );
}


/* =========================================================
   РЕНДЕР МАТЕРИАЛОВ
   ========================================================= */

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
            'Ошибка получения материалов:',
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
                        platformEscape(
                            error.message ||
                            String(error)
                        )
                    }
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
        !!material.file_path;


    const isLink =
        material.material_type === 'link' &&
        !!material.url;


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

        }
        else if (
            [
                'mp4',
                'webm',
                'mov',
                'm4v'
            ].includes(ext)
        ) {

            icon = '▶';

        }
        else {

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

            `;


    const deleteButton =
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

            : '';


    return `

        <div
            class="pm-material"
            data-material-id="${material.id}"
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


            <div
                class="pm-material-info"
            >

                <div
                    class="pm-material-name"
                >
                    ${
                        platformEscape(
                            name
                        )
                    }
                </div>


                <div
                    class="pm-material-meta"
                >

                    ${
                        isFile
                            ? 'Файл'
                            : 'Внешняя ссылка'
                    }

                    ${
                        material.created_at
                            ? ' • ' +
                              platformEscape(
                                  platformFormatDate(
                                      material.created_at
                                  )
                              )
                            : ''
                    }

                    ${
                        isLink
                            ? `
                                <br>
                                ${
                                    platformEscape(
                                        material.url
                                    )
                                }
                            `
                            : ''
                    }

                </div>

            </div>


            <div
                class="pm-material-action"
            >

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

    if (!isManager()) return;


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

    }
    catch (_) {

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
                    material_type: 'link',
                    url,
                    file_path: null,
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

    }
    catch (error) {

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

    if (!isManager()) return;


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
                    material_type: 'file',
                    url: null,
                    file_path: path,
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

    }
    catch (error) {

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
                    'id,file_path,material_type'
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

    }
    catch (error) {

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


        window.open(
            data.url,
            '_blank',
            'noopener,noreferrer'
        );

    }
    catch (error) {

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

    if (!isManager()) return;


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
                    'id,section,direction,file_path'
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


        if (error) {
            throw error;
        }


        await renderMaterialList(
            material.section,
            material.direction
        );

    }
    catch (error) {

        console.error(
            'Ошибка удаления:',
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

    if (!box) return;


    box.className =
        'pm-status ' +
        (
            type || ''
        );


    box.textContent =
        text || '';
}


/* =========================================================
   СТАРЫЕ ИМЕНА ФУНКЦИЙ
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
