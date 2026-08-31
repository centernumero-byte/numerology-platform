/* =========================================================
   manuals.js
   NUMEROLOGY PLATFORM

   МЕТОДИЧЕСКИЕ ПОСОБИЯ + ВИДЕО

   СХЕМА:

   Методические пособия
        ↓
   Взрослая матрица
        ↓
   полноценная страница
        ↓
   Все материалы
        ↓
   [ Добавить материал ]

   Добавить материал:
        - загрузить файл
        - добавить ссылку

   Для файла:
        [ Скачать ]

   Для ссылки:
        [ Перейти ]

   Видео работает по той же схеме.

   ========================================================= */


/* =========================================================
   НАСТРОЙКИ
   ========================================================= */

const PLATFORM_MATERIALS_TABLE =
    'platform_materials';

const PLATFORM_STORAGE_BUCKET =
    'methodicals';


/* =========================================================
   НАПРАВЛЕНИЯ
   ========================================================= */

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


const PLATFORM_NAMES =
    Object.fromEntries(

        PLATFORM_DIRECTIONS.map(
            item => [
                item.key,
                item.title
            ]
        )

    );


/* =========================================================
   ТЕКУЩИЙ РАЗДЕЛ
   ========================================================= */

let materialManagerState = {

    section: '',

    direction: '',

    title: ''

};


/* =========================================================
   ПРОВЕРКА АДМИНИСТРАТОРА
   ========================================================= */

function isPlatformManager() {

    return (
        window.currentUserIsManager === true
    );

}


/* =========================================================
   ЭКРАНИРОВАНИЕ ТЕКСТА
   ========================================================= */

function platformEscape(value) {

    return String(
        value ?? ''
    )

        .replace(
            /&/g,
            '&amp;'
        )

        .replace(
            /</g,
            '&lt;'
        )

        .replace(
            />/g,
            '&gt;'
        )

        .replace(
            /"/g,
            '&quot;'
        )

        .replace(
            /'/g,
            '&#039;'
        );

}


/* =========================================================
   ДАТА
   ========================================================= */

function platformFormatDate(value) {

    if (!value) {
        return '';
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

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


/* =========================================================
   ИМЯ ФАЙЛА
   ========================================================= */

function platformFileName(path) {

    if (!path) {
        return 'Файл';
    }


    const parts =
        String(path)
            .split('/');


    const name =
        parts[
            parts.length - 1
        ] || 'Файл';


    /*
       Убираем UUID,
       который мы добавляем
       перед именем файла.
    */

    return name.replace(
        /^[0-9a-f-]{20,}_/i,
        ''
    );

}


/* =========================================================
   SESSION
   ========================================================= */

async function getCurrentSession() {

    const {
        data: {
            session
        },
        error
    } =
        await supabaseClient
            .auth
            .getSession();


    if (error) {
        throw error;
    }


    return session;

}


/* =========================================================
   СТИЛИ НОВОЙ СТРАНИЦЫ
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
        document.createElement(
            'style'
        );


    style.id =
        'platformMaterialStyles';


    style.textContent = `

        /* ================================================
           СТРАНИЦА МАТЕРИАЛОВ
           ================================================ */

        .pm-page {

            width: 100%;

            max-width: 1180px;

            margin: 0 auto;

        }


        .pm-page-head {

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 20px;

            margin-bottom: 24px;

            flex-wrap: wrap;

        }


        .pm-page-title {

            margin: 0;

            color: #f6d66c;

            font-family: Georgia, serif;

            font-size: 32px;

            line-height: 1.2;

        }


        .pm-page-subtitle {

            margin: 8px 0 0;

            color: #ddd5df;

            font-size: 17px;

        }


        /* ================================================
           НАЗАД
           ================================================ */

        .pm-back {

            display: inline-flex;

            align-items: center;

            gap: 8px;

            margin-bottom: 18px;

            padding: 0;

            border: none;

            background: transparent;

            color: #f6d66c;

            cursor: pointer;

            font-size: 16px;

        }


        .pm-back:hover {

            text-decoration: underline;

        }


        /* ================================================
           КНОПКА ДОБАВИТЬ
           ================================================ */

        .pm-button {

            border: 1px solid #d7aa31;

            border-radius: 10px;

            padding: 12px 20px;

            background:
                linear-gradient(
                    135deg,
                    #713da0,
                    #4f2878
                );

            color: #f8e7a8;

            cursor: pointer;

            font-size: 16px;

            font-weight: 600;

        }


        .pm-button:hover {

            box-shadow:
                0 5px 18px
                rgba(80, 38, 120, .4);

        }


        /* ================================================
           ПАНЕЛЬ ДОБАВЛЕНИЯ
           ================================================ */

        .pm-add-panel {

            display: none;

            margin-bottom: 22px;

            padding: 22px;

            border: 1px solid
                rgba(215,170,49,.45);

            border-radius: 16px;

            background:
                rgba(20,13,48,.8);

        }


        .pm-add-panel.open {

            display: block;

        }


        .pm-add-title {

            margin: 0 0 20px;

            color: #f6d66c;

            font-family: Georgia, serif;

            font-size: 22px;

        }


        .pm-add-grid {

            display: grid;

            grid-template-columns:
                repeat(
                    2,
                    minmax(0, 1fr)
                );

            gap: 20px;

        }


        .pm-add-box {

            padding: 20px;

            border:
                1px solid
                rgba(215,170,49,.25);

            border-radius: 13px;

            background:
                rgba(255,255,255,.035);

        }


        .pm-add-label {

            display: block;

            margin-bottom: 10px;

            color: #eee5d0;

            font-size: 16px;

            font-weight: 600;

        }


        .pm-input {

            width: 100%;

            box-sizing: border-box;

            padding: 12px;

            border:
                1px solid
                rgba(215,170,49,.65);

            border-radius: 10px;

            background: #17112f;

            color: white;

            outline: none;

            font-size: 15px;

        }


        .pm-input::placeholder {

            color: #aaa1b4;

        }


        .pm-add-action {

            margin-top: 12px;

        }


        .pm-status {

            margin-top: 15px;

            color: #d9d0dc;

            line-height: 1.45;

        }


        .pm-status.ok {

            color: #a9e4b4;

        }


        .pm-status.error {

            color: #ffb0b0;

        }


        /* ================================================
           СПИСОК МАТЕРИАЛОВ
           ================================================ */

        .pm-materials {

            display: flex;

            flex-direction: column;

            gap: 12px;

        }


        .pm-material {

            display: grid;

            grid-template-columns:
                62px
                minmax(0,1fr)
                auto;

            gap: 17px;

            align-items: center;

            padding: 16px 18px;

            border:
                1px solid
                rgba(215,170,49,.25);

            border-radius: 14px;

            background:
                rgba(15,11,38,.68);

        }


        /* ================================================
           ИКОНКА МАТЕРИАЛА
           ================================================ */

        .pm-material-icon {

            width: 58px;

            height: 58px;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 11px;

            background:
                rgba(91,48,139,.6);

            color: #f6d66c;

            font-size: 27px;

        }


        .pm-material-icon.pdf {

            background: #a43838;

            color: white;

            font-size: 17px;

            font-weight: 800;

        }


        .pm-material-icon.video {

            background:
                rgba(85,45,135,.75);

            color: white;

        }


        /* ================================================
           ТЕКСТ
           ================================================ */

        .pm-material-info {

            min-width: 0;

        }


        .pm-material-name {

            margin: 0 0 7px;

            color: white;

            font-size: 18px;

            font-weight: 700;

            word-break: break-word;

        }


        .pm-material-meta {

            color: #c9c1ce;

            font-size: 14px;

            line-height: 1.5;

            word-break: break-word;

        }


        .pm-material-url {

            margin-top: 3px;

            color: #a99bc0;

            font-size: 13px;

            word-break: break-all;

        }


        /* ================================================
           КНОПКИ МАТЕРИАЛА
           ================================================ */

        .pm-material-action {

            display: flex;

            align-items: center;

            gap: 8px;

            white-space: nowrap;

        }


        .pm-action-button {

            border:
                1px solid
                #d7aa31;

            border-radius: 9px;

            padding: 10px 18px;

            background: #63358d;

            color: #f8e7a8;

            cursor: pointer;

            font-size: 15px;

            font-weight: 600;

        }


        .pm-action-button:hover {

            background: #7543a2;

        }


        .pm-delete-button {

            border:
                1px solid
                rgba(255,160,160,.35);

            border-radius: 9px;

            padding: 10px 12px;

            background: transparent;

            color: #ffb4b4;

            cursor: pointer;

        }


        /* ================================================
           ЕСЛИ МАТЕРИАЛОВ НЕТ
           ================================================ */

        .pm-empty {

            padding: 55px 25px;

            text-align: center;

            border:
                1px dashed
                rgba(215,170,49,.35);

            border-radius: 16px;

            color: #c9c1ce;

            background:
                rgba(15,11,38,.35);

        }


        .pm-empty-title {

            margin-bottom: 9px;

            color: #f6d66c;

            font-family: Georgia, serif;

            font-size: 24px;

        }


        /* ================================================
           МОБИЛЬНЫЙ ЭКРАН
           ================================================ */

        @media (max-width: 800px) {

            .pm-add-grid {

                grid-template-columns: 1fr;

            }


            .pm-material {

                grid-template-columns:
                    52px
                    minmax(0,1fr);

            }


            .pm-material-action {

                grid-column: 2;

            }


            .pm-page-title {

                font-size: 26px;

            }

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =========================================================
   ИКОНКА ПИФАГОРА
   ========================================================= */

function pythagorasIconHtml() {

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


/* =========================================================
   СТРАНИЦА РАЗДЕЛА
   ========================================================= */

async function loadPlatformMaterials(
    section
) {

    const contentCards =
        document.getElementById(
            'contentCards'
        );


    if (!contentCards) {
        return;
    }


    ensureMaterialStyles();


    const subtitle =
        section === 'videos'
            ? 'Видео'
            : 'Методическое пособие';


    contentCards.innerHTML = `

        <div class="cards">

            ${PLATFORM_DIRECTIONS.map(
                item => {

                    const icon =
                        item.key ===
                        'pythagoras'

                            ? pythagorasIconHtml()

                            : `
                                <div
                                    class="card-icon"
                                >
                                    ${item.icon}
                                </div>
                            `;


                    return `

                        <div
                            class="card method-card"

                            data-section="
                                ${section}
                            "

                            data-direction="
                                ${item.key}
                            "

                            onclick="
                                openPlatformMaterial(
                                    '${section}',
                                    '${item.key}'
                                )
                            "

                            role="button"

                            tabindex="0"
                        >

                            ${icon}


                            <div
                                class="card-content"
                            >

                                <h3>
                                    ${platformEscape(
                                        item.title
                                    )}
                                </h3>


                                <p>
                                    ${subtitle}
                                </p>

                            </div>

                        </div>

                    `;

                }
            ).join('')}

        </div>

    `;

}


/* =========================================================
   МЕТОДИЧЕСКИЕ ПОСОБИЯ
   ========================================================= */

async function loadManuals() {

    await loadPlatformMaterials(
        'manuals'
    );

}


/* =========================================================
   ВИДЕО
   ========================================================= */

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


    if (error) {
        throw error;
    }


    return data || [];

}


/* =========================================================
   ПОЛНОЦЕННАЯ СТРАНИЦА НАПРАВЛЕНИЯ
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


    const title =
        PLATFORM_NAMES[
            direction
        ]
        ||
        'Материал';


    const pageTitle =
        section === 'videos'

            ? `${title} — видео`

            : `${title} — методическое пособие`;


    materialManagerState = {

        section:
            section,

        direction:
            direction,

        title:
            title

    };


    /*
       ВОТ ЗДЕСЬ ГЛАВНОЕ:

       Мы НЕ создаём popup.

       Мы полностью заменяем
       содержимое contentCards
       полноценной страницей.
    */

    contentCards.innerHTML = `

        <div class="pm-page">


            <!-- =========================================
                 НАЗАД
                 ========================================= -->

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


            <!-- =========================================
                 ЗАГОЛОВОК И КНОПКА
                 ========================================= -->

            <div class="pm-page-head">


                <div>

                    <h2
                        class="pm-page-title"
                    >
                        ${platformEscape(
                            pageTitle
                        )}
                    </h2>


                    <p
                        class="pm-page-subtitle"
                    >
                        Все материалы
                    </p>

                </div>


                ${
                    isPlatformManager()

                        ? `

                            <button
                                class="pm-button"

                                type="button"

                                onclick="
                                    toggleMaterialAddPanel()
                                "
                            >
                                ＋ Добавить материал
                            </button>

                          `

                        : ''
                }


            </div>


            <!-- =========================================
                 ДОБАВЛЕНИЕ
                 ========================================= -->

            ${
                isPlatformManager()

                    ? `

                        <div
                            id="pmAddPanel"

                            class="pm-add-panel"
                        >


                            <h3
                                class="pm-add-title"
                            >
                                Добавить материал
                            </h3>


                            <div
                                class="pm-add-grid"
                            >


                                <!-- ======================
                                     ФАЙЛ
                                     ====================== -->

                                <div
                                    class="pm-add-box"
                                >

                                    <label
                                        class="pm-add-label"
                                    >

                                        ${
                                            section ===
                                            'videos'

                                                ? 'Загрузить видео'

                                                : 'Загрузить файл'

                                        }

                                    </label>


                                    <input
                                        id="pmFileInput"

                                        class="pm-input"

                                        type="file"

                                        accept="${
                                            section ===
                                            'videos'

                                                ? 'video/*,.mp4,.webm,.mov,.m4v'

                                                : '.pdf,.doc,.docx'
                                        }"
                                    />


                                    <div
                                        class="pm-add-action"
                                    >

                                        <button
                                            class="pm-button"

                                            type="button"

                                            onclick="
                                                uploadPlatformMaterialFile()
                                            "
                                        >

                                            ${
                                                section ===
                                                'videos'

                                                    ? 'Загрузить видео'

                                                    : 'Загрузить файл'

                                            }

                                        </button>

                                    </div>

                                </div>


                                <!-- ======================
                                     ССЫЛКА
                                     ====================== -->

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
                                    />


                                    <div
                                        class="pm-add-action"
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


                            </div>


                            <div
                                id="pmStatus"

                                class="pm-status"
                            ></div>


                            <div
                                class="pm-note"
                            >

                                ${
                                    section ===
                                    'videos'

                                        ? 'Можно добавить внешнюю ссылку на видео или загрузить видеофайл непосредственно в платформу.'

                                        : 'Можно добавить ссылку на Google Диск, Яндекс Диск, Mail.ru или другой облачный сервис, либо загрузить файл непосредственно в платформу.'
                                }

                            </div>


                        </div>

                      `

                    : ''

            }


            <!-- =========================================
                 ВСЕ МАТЕРИАЛЫ
                 ========================================= -->

            <div
                id="pmMaterialsList"

                class="pm-materials"
            >

                <div
                    class="pm-empty"
                >

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
   ОТКРЫТЬ ПАНЕЛЬ ДОБАВЛЕНИЯ
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
   ПОКАЗАТЬ СТАТУС
   ========================================================= */

function setPMStatus(
    text,
    type
) {

    const status =
        document.getElementById(
            'pmStatus'
        );


    if (!status) {
        return;
    }


    status.className =
        'pm-status ' +
        (
            type ||
            ''
        );


    status.textContent =
        text || '';

}


/* =========================================================
   ОТРИСОВКА ВСЕХ МАТЕРИАЛОВ
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


        if (
            !materials.length
        ) {

            list.innerHTML = `

                <div
                    class="pm-empty"
                >

                    <div
                        class="pm-empty-title"
                    >
                        Материалов пока нет
                    </div>


                    <div>
                        ${
                            isPlatformManager()

                                ? 'Добавьте первый файл или ссылку.'

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
                            material,
                            section
                        )
                )

                .join('');


    } catch (error) {

        console.error(
            'Ошибка получения материалов:',
            error
        );


        list.innerHTML = `

            <div
                class="pm-empty"
            >

                <div
                    class="pm-empty-title"
                >
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
    material,
    section
) {

    const isFile =
        material.material_type ===
            'file'
        &&
        material.file_path;


    const isLink =
        material.material_type ===
            'link'
        &&
        material.url;


    let icon =
        '🔗';


    let iconClass =
        '';


    let name =
        'Материал';


    if (isFile) {

        const fileName =
            platformFileName(
                material.file_path
            );


        name =
            fileName;


        const extension =
            fileName
                .split('.')
                .pop()
                .toLowerCase();


        if (
            section ===
            'videos'
            ||
            [
                'mp4',
                'webm',
                'mov',
                'm4v'
            ].includes(
                extension
            )
        ) {

            icon =
                '▶';

            iconClass =
                'video';

        }

        else if (
            extension ===
            'pdf'
        ) {

            icon =
                'PDF';

            iconClass =
                'pdf';

        }

        else {

            icon =
                '📄';

        }

    }


    else if (isLink) {

        icon =
            '🔗';


        name =
            'Внешняя ссылка';

    }


    const date =
        platformFormatDate(
            material.created_at
        );


    let action =
        '';


    if (isFile) {

        action = `

            <button
                class="pm-action-button"

                type="button"

                onclick="
                    downloadPlatformMaterial(
                        '${material.id}'
                    )
                "
            >
                Скачать
            </button>

        `;

    }


    else if (isLink) {

        action = `

            <button
                class="pm-action-button"

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

    }


    const deleteButton =
        isPlatformManager()

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

            data-material-id="
                ${material.id}
            "
        >


            <!-- =========================================
                 ИКОНКА
                 ========================================= -->

            <div
                class="
                    pm-material-icon
                    ${iconClass}
                "
            >

                ${platformEscape(
                    icon
                )}

            </div>


            <!-- =========================================
                 ИНФОРМАЦИЯ
                 ========================================= -->

            <div
                class="pm-material-info"
            >

                <div
                    class="pm-material-name"
                >

                    ${platformEscape(
                        name
                    )}

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
                        date
                            ? ' • ' +
                              platformEscape(
                                  date
                              )

                            : ''
                    }

                </div>


                ${
                    isLink

                        ? `

                            <div
                                class="pm-material-url"
                            >
                                ${platformEscape(
                                    material.url
                                )}
                            </div>

                          `

                        : ''
                }

            </div>


            <!-- =========================================
                 ДЕЙСТВИЯ
                 ========================================= -->

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
   СОХРАНИТЬ ВНЕШНЮЮ ССЫЛКУ
   ========================================================= */

async function savePlatformMaterialUrl() {

    if (
        !isPlatformManager()
    ) {
        return;
    }


    const {
        section,
        direction
    } =
        materialManagerState;


    const input =
        document.getElementById(
            'pmUrlInput'
        );


    const url =
        input?.value.trim()
        ||
        '';


    if (!url) {

        setPMStatus(
            'Вставьте ссылку.',
            'error'
        );

        return;

    }


    try {

        new URL(
            url
        );

    } catch (_) {

        setPMStatus(
            'Введите корректную ссылку, начинающуюся с https:// или http://.',
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

                    section:
                        section,

                    direction:
                        direction,

                    material_type:
                        'link',

                    url:
                        url,

                    file_path:
                        null,

                    created_by:
                        session.user.id

                });


        if (error) {
            throw error;
        }


        input.value =
            '';


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
   ЗАГРУЗИТЬ ФАЙЛ / ВИДЕО
   ========================================================= */

async function uploadPlatformMaterialFile() {

    if (
        !isPlatformManager()
    ) {
        return;
    }


    const {
        section,
        direction
    } =
        materialManagerState;


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


    /*
       Лимит:

       Методические пособия:
       100 МБ

       Видео:
       500 МБ
    */

    const maxSize =
        section ===
        'videos'

            ? 500 *
              1024 *
              1024

            : 100 *
              1024 *
              1024;


    if (
        file.size >
        maxSize
    ) {

        setPMStatus(

            section ===
            'videos'

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


        /*
           Нормализуем имя файла
        */

        const safeName =
            file.name

                .normalize(
                    'NFKD'
                )

                .replace(
                    /[^a-zA-Z0-9._-]+/g,
                    '_'
                )

                .replace(
                    /^_+|_+$/g,
                    ''
                )

                ||
                'file';


        /*
           Уникальное имя
        */

        const unique =
            window.crypto &&
            typeof crypto.randomUUID ===
                'function'

                ? crypto.randomUUID()

                : Date.now() +
                  '_' +
                  Math.random()
                    .toString(36)
                    .slice(2);


        /*
           Путь в Storage

           manuals/adult/...
           videos/adult/...
        */

        const path =
            `${section}/${direction}/${unique}_${safeName}`;


        /*
           Загружаем в Storage
        */

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

                        cacheControl:
                            '3600',

                        upsert:
                            false,

                        contentType:
                            file.type ||
                            undefined

                    }
                );


        if (uploadError) {
            throw uploadError;
        }


        setPMStatus(
            'Файл загружен. Сохраняю информацию...',
            ''
        );


        /*
           Записываем материал
           в platform_materials
        */

        const {
            error: insertError
        } =
            await supabaseClient

                .from(
                    PLATFORM_MATERIALS_TABLE
                )

                .insert({

                    section:
                        section,

                    direction:
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


        /*
           Если запись в таблицу
           не создалась —
           удаляем файл.
        */

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


        input.value =
            '';


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
   СКАЧАТЬ ФАЙЛ
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


        if (
            !material?.file_path
        ) {

            throw new Error(
                'Файл не найден.'
            );

        }


        const fileName =
            platformFileName(
                material.file_path
            );


        /*
           Создаём временную
           ссылку на приватный файл.

           download заставляет
           браузер скачать файл.
        */

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
                            fileName

                    }

                );


        if (error) {
            throw error;
        }


        if (
            !data?.signedUrl
        ) {

            throw new Error(
                'Не удалось получить ссылку на скачивание.'
            );

        }


        /*
           Именно скачивание,
           а не открытие файла.
        */

        const link =
            document.createElement(
                'a'
            );


        link.href =
            data.signedUrl;


        link.download =
            fileName;


        link.target =
            '_blank';


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


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
   ПЕРЕЙТИ ПО ССЫЛКЕ
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


        if (error) {
            throw error;
        }


        if (!data?.url) {

            throw new Error(
                'Ссылка не найдена.'
            );

        }


        /*
           Ссылка ведёт
           непосредственно туда,
           куда её добавил администратор:

           Google Диск
           Яндекс Диск
           Mail.ru
           YouTube
           любой другой сервис.
        */

        window.open(
            data.url,
            '_blank',
            'noopener,noreferrer'
        );


    } catch (error) {

        console.error(
            'Ошибка открытия ссылки:',
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
   УДАЛИТЬ МАТЕРИАЛ
   ========================================================= */

async function deletePlatformMaterial(
    materialId
) {

    if (
        !isPlatformManager()
    ) {
        return;
    }


    const confirmed =
        confirm(
            'Удалить этот материал?'
        );


    if (!confirmed) {
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


        /*
           Если это файл —
           удаляем его из Storage.
        */

        if (
            material?.file_path
        ) {

            const {
                error:
                    storageError
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
                    'Ошибка удаления файла из Storage:',
                    storageError
                );

            }

        }


        /*
           Удаляем запись
           из platform_materials.
        */

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


        /*
           Обновляем страницу
        */

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
   СОВМЕСТИМОСТЬ СО СТАРЫМ INDEX.HTML
   ---------------------------------------------------------
   Оставляем старые имена функций,
   чтобы index.html не ломался.
   ========================================================= */

async function saveMaterialUrl() {

    await savePlatformMaterialUrl();

}


async function uploadMaterialFile() {

    await uploadPlatformMaterialFile();

}


async function loadMaterials(
    section
) {

    await loadPlatformMaterials(
        section
    );

}


/* =========================================================
   СТАРАЯ ФУНКЦИЯ OPEN MATERIAL
   ========================================================= */

function openMaterial(
    url,
    title
) {

    if (
        url
    ) {

        window.open(
            url,
            '_blank',
            'noopener,noreferrer'
        );

        return;

    }


    if (title) {

        alert(
            title +
            '\n\nМатериал пока не добавлен.'
        );

    }

}


/* =========================================================
   КОНЕЦ MANUALS.JS
   ========================================================= */
