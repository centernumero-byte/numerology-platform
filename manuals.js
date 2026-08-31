/* =========================================================
   MANUALS.JS
   NUMEROLOGY PLATFORM

   МЕТОДИЧЕСКИЕ ПОСОБИЯ + ВИДЕО

   ВАЖНО:

   Эта версия специально отключает влияние
   старой сетки карточек на страницу материалов.

   Страница открывается НЕ как popup,
   НЕ как карточка,
   а как полноценная широкая страница
   внутри основной области платформы.

   ========================================================= */


/* =========================================================
   НАСТРОЙКИ
   ========================================================= */

const PLATFORM_MATERIALS_TABLE = 'platform_materials';

const PLATFORM_STORAGE_BUCKET = 'methodicals';


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
        PLATFORM_DIRECTIONS.map(item => [
            item.key,
            item.title
        ])
    );


/* =========================================================
   СОСТОЯНИЕ
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

    return window.currentUserIsManager === true;

}


/* =========================================================
   ЭКРАНИРОВАНИЕ
   ========================================================= */

function platformEscape(value) {

    return String(value ?? '')

        .replace(/&/g, '&amp;')

        .replace(/</g, '&lt;')

        .replace(/>/g, '&gt;')

        .replace(/"/g, '&quot;')

        .replace(/'/g, '&#039;');

}


/* =========================================================
   ДАТА
   ========================================================= */

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


/* =========================================================
   ИМЯ ФАЙЛА
   ========================================================= */

function platformFileName(path) {

    if (!path) {
        return 'Файл';
    }

    const parts = String(path).split('/');

    const name =
        parts[parts.length - 1] || 'Файл';

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
        await supabaseClient.auth.getSession();

    if (error) {
        throw error;
    }

    return session;

}


/* =========================================================
   ГЛАВНОЕ ИСПРАВЛЕНИЕ ШИРИНЫ
   =========================================================

   Старая платформа использует grid для contentCards.

   Из-за этого pm-page становилась одной маленькой
   карточкой.

   Здесь мы принудительно говорим браузеру:

   contentCards = полноценная широкая область

   pm-page = 100% ширины

   add-panel = 100% ширины

   add-grid = две нормальные колонки

   ========================================================= */

function fixMaterialsLayout() {

    const contentCards =
        document.getElementById(
            'contentCards'
        );

    if (!contentCards) {
        return;
    }


    /*
       Убираем влияние старой grid-сетки
    */

    contentCards.style.setProperty(
        'display',
        'block',
        'important'
    );

    contentCards.style.setProperty(
        'width',
        '100%',
        'important'
    );

    contentCards.style.setProperty(
        'max-width',
        'none',
        'important'
    );

    contentCards.style.setProperty(
        'min-width',
        '0',
        'important'
    );

    contentCards.style.setProperty(
        'box-sizing',
        'border-box',
        'important'
    );

    contentCards.style.setProperty(
        'grid-column',
        '1 / -1',
        'important'
    );

    contentCards.style.setProperty(
        'grid-template-columns',
        'none',
        'important'
    );


    /*
       Также исправляем непосредственного родителя,
       если старая сетка пытается ограничить ширину.
    */

    const parent =
        contentCards.parentElement;

    if (parent) {

        parent.style.setProperty(
            'width',
            '100%',
            'important'
        );

        parent.style.setProperty(
            'max-width',
            'none',
            'important'
        );

        parent.style.setProperty(
            'min-width',
            '0',
            'important'
        );

    }

}


/* =========================================================
   СТИЛИ
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

        /* =================================================
           ГЛАВНОЕ ИСПРАВЛЕНИЕ
           ================================================= */

        #contentCards {

            display: block !important;

            width: 100% !important;

            max-width: none !important;

            min-width: 0 !important;

            box-sizing: border-box !important;

            grid-column: 1 / -1 !important;

        }


        #contentCards > .pm-page {

            display: block !important;

            width: 100% !important;

            max-width: none !important;

            min-width: 0 !important;

            box-sizing: border-box !important;

        }


        /* =================================================
           ПОЛНОЦЕННАЯ СТРАНИЦА
           ================================================= */

        .pm-page {

            width: 100% !important;

            max-width: none !important;

            min-width: 0 !important;

            margin: 0 !important;

            padding: 0 10px 40px 10px;

            box-sizing: border-box;

        }


        /* =================================================
           ВЕРХНЯЯ СТРОКА
           ================================================= */

        .pm-page-head {

            width: 100% !important;

            display: flex !important;

            align-items: flex-start !important;

            justify-content: space-between !important;

            gap: 30px !important;

            margin-bottom: 25px;

            flex-wrap: nowrap !important;

            box-sizing: border-box;

        }


        .pm-page-head > div:first-child {

            flex: 1 1 auto !important;

            min-width: 0 !important;

        }


        .pm-page-title {

            margin: 0;

            color: #f6d66c;

            font-family: Georgia, serif;

            font-size: 34px;

            line-height: 1.2;

            font-weight: 700;

        }


        .pm-page-subtitle {

            margin: 10px 0 0;

            color: #eee5df;

            font-size: 18px;

        }


        /* =================================================
           НАЗАД
           ================================================= */

        .pm-back {

            display: inline-flex;

            align-items: center;

            margin: 0 0 20px 0;

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


        /* =================================================
           КНОПКА ДОБАВИТЬ МАТЕРИАЛ

           ИМЕННО СПРАВА ВВЕРХУ
           ================================================= */

        .pm-page-head .pm-button {

            flex: 0 0 auto !important;

            width: auto !important;

            min-width: 210px;

            white-space: nowrap;

        }


        .pm-button {

            display: inline-flex;

            align-items: center;

            justify-content: center;

            border: 1px solid #d7aa31;

            border-radius: 10px;

            padding: 12px 22px;

            min-height: 48px;

            background:
                linear-gradient(
                    135deg,
                    #7542a4,
                    #52297f
                );

            color: #f8e7a8;

            cursor: pointer;

            font-size: 16px;

            font-weight: 600;

            box-sizing: border-box;

        }


        .pm-button:hover {

            box-shadow:
                0 5px 18px
                rgba(80,38,120,.4);

        }


        /* =================================================
           ПАНЕЛЬ ДОБАВЛЕНИЯ

           ВСЯ ШИРИНА
           ================================================= */

        .pm-add-panel {

            display: none;

            width: 100% !important;

            max-width: none !important;

            box-sizing: border-box;

            margin: 0 0 25px 0;

            padding: 25px;

            border:
                1px solid
                rgba(215,170,49,.45);

            border-radius: 16px;

            background:
                rgba(20,13,48,.82);

        }


        .pm-add-panel.open {

            display: block !important;

        }


        .pm-add-title {

            margin: 0 0 22px;

            color: #f6d66c;

            font-family: Georgia, serif;

            font-size: 24px;

        }


        /* =================================================
           ДВЕ КОЛОНКИ

           ЛЕВАЯ — ФАЙЛ
           ПРАВАЯ — ССЫЛКА
           ================================================= */

        .pm-add-grid {

            display: grid !important;

            grid-template-columns:
                minmax(0, 1fr)
                minmax(0, 1fr) !important;

            width: 100% !important;

            max-width: none !important;

            gap: 22px !important;

            box-sizing: border-box;

        }


        .pm-add-box {

            width: 100% !important;

            min-width: 0 !important;

            box-sizing: border-box;

            padding: 22px;

            border:
                1px solid
                rgba(215,170,49,.30);

            border-radius: 13px;

            background:
                rgba(255,255,255,.035);

        }


        .pm-add-label {

            display: block;

            margin-bottom: 12px;

            color: #eee5d0;

            font-size: 17px;

            font-weight: 600;

        }


        .pm-input {

            display: block;

            width: 100% !important;

            max-width: none !important;

            min-width: 0 !important;

            box-sizing: border-box;

            padding: 13px 14px;

            border:
                1px solid
                rgba(215,170,49,.65);

            border-radius: 10px;

            background: #17112f;

            color: white;

            outline: none;

            font-size: 15px;

        }


        .pm-input[type="file"] {

            min-height: 48px;

        }


        .pm-input::placeholder {

            color: #aaa1b4;

        }


        .pm-add-action {

            margin-top: 15px;

        }


        .pm-add-action .pm-button {

            width: auto !important;

        }


        .pm-status {

            width: 100%;

            margin-top: 18px;

            color: #d9d0dc;

            line-height: 1.45;

        }


        .pm-status.ok {

            color: #a9e4b4;

        }


        .pm-status.error {

            color: #ffb0b0;

        }


        .pm-note {

            margin-top: 18px;

            color: #bcb3c5;

            font-size: 14px;

            line-height: 1.5;

        }


        /* =================================================
           СПИСОК МАТЕРИАЛОВ

           ВСЯ ШИРИНА
           ================================================= */

        .pm-materials {

            display: flex !important;

            flex-direction: column !important;

            width: 100% !important;

            max-width: none !important;

            gap: 12px;

            box-sizing: border-box;

        }


        /* =================================================
           ОДИН МАТЕРИАЛ
           ================================================= */

        .pm-material {

            display: grid !important;

            grid-template-columns:
                64px
                minmax(0,1fr)
                auto !important;

            align-items: center;

            width: 100% !important;

            max-width: none !important;

            min-width: 0 !important;

            box-sizing: border-box;

            gap: 18px;

            padding: 17px 20px;

            border:
                1px solid
                rgba(215,170,49,.28);

            border-radius: 14px;

            background:
                rgba(15,11,38,.68);

        }


        /* =================================================
           ИКОНКА
           ================================================= */

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

            box-sizing: border-box;

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


        /* =================================================
           ИНФОРМАЦИЯ
           ================================================= */

        .pm-material-info {

            min-width: 0;

            width: 100%;

        }


        .pm-material-name {

            margin: 0 0 7px;

            color: white;

            font-size: 18px;

            line-height: 1.3;

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

            margin-top: 4px;

            color: #a99bc0;

            font-size: 13px;

            line-height: 1.4;

            word-break: break-all;

        }


        /* =================================================
           КНОПКА СКАЧАТЬ / ПЕРЕЙТИ

           СПРАВА
           ================================================= */

        .pm-material-action {

            display: flex !important;

            align-items: center;

            justify-content: flex-end;

            gap: 8px;

            white-space: nowrap;

        }


        .pm-action-button {

            display: inline-flex;

            align-items: center;

            justify-content: center;

            min-width: 110px;

            min-height: 42px;

            border:
                1px solid
                #d7aa31;

            border-radius: 9px;

            padding: 9px 17px;

            background: #63358d;

            color: #f8e7a8;

            cursor: pointer;

            font-size: 15px;

            font-weight: 600;

            box-sizing: border-box;

        }


        .pm-action-button:hover {

            background: #7543a2;

        }


        .pm-delete-button {

            border:
                1px solid
                rgba(255,160,160,.35);

            border-radius: 9px;

            padding: 9px 12px;

            min-height: 42px;

            background: transparent;

            color: #ffb4b4;

            cursor: pointer;

        }


        /* =================================================
           НЕТ МАТЕРИАЛОВ
           ================================================= */

        .pm-empty {

            width: 100% !important;

            max-width: none !important;

            box-sizing: border-box;

            padding: 50px 25px;

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

            margin-bottom: 10px;

            color: #f6d66c;

            font-family: Georgia, serif;

            font-size: 24px;

        }


        /* =================================================
           МОБИЛЬНАЯ ВЕРСИЯ
           ================================================= */

        @media (max-width: 900px) {

            .pm-page-head {

                flex-wrap: wrap !important;

            }


            .pm-page-head .pm-button {

                width: auto !important;

            }


            .pm-add-grid {

                grid-template-columns: 1fr !important;

            }

        }


        @media (max-width: 650px) {

            .pm-page {

                padding-left: 5px;

                padding-right: 5px;

            }


            .pm-page-title {

                font-size: 27px;

            }


            .pm-material {

                grid-template-columns:
                    55px
                    minmax(0,1fr) !important;

            }


            .pm-material-action {

                grid-column: 2;

                justify-content: flex-start;

            }

        }

    `;


    document.head.appendChild(style);

}


/* =========================================================
   КАРТОЧКИ НАПРАВЛЕНИЙ
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

    fixMaterialsLayout();


    const subtitle =
        section === 'videos'
            ? 'Видео'
            : 'Методическое пособие';


    contentCards.innerHTML = `

        <div class="cards">

            ${PLATFORM_DIRECTIONS.map(item => {

                return `

                    <div
                        class="card method-card"

                        data-section="${section}"

                        data-direction="${item.key}"

                        onclick="
                            openPlatformMaterial(
                                '${section}',
                                '${item.key}'
                            )
                        "

                        role="button"

                        tabindex="0"
                    >

                        <div
                            class="card-icon"
                        >
                            ${item.icon}
                        </div>


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

            }).join('')}

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
   ПОЛНОЦЕННАЯ СТРАНИЦА
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

    fixMaterialsLayout();


    const title =
        PLATFORM_NAMES[direction]
        ||
        'Материал';


    const pageTitle =
        section === 'videos'

            ? `${title} — видео`

            : `${title} — методическое пособие`;


    materialManagerState = {

        section: section,

        direction: direction,

        title: title

    };


    /*
       ВАЖНО:

       Здесь НЕ создаётся modal.
       НЕ создаётся popup.
       НЕ создаётся окно поверх страницы.

       contentCards полностью заменяется
       полноценной страницей.
    */

    contentCards.innerHTML = `

        <div
            class="pm-page"
        >


            <!-- =====================================
                 НАЗАД
                 ===================================== -->

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


            <!-- =====================================
                 ЗАГОЛОВОК + ДОБАВИТЬ
                 ===================================== -->

            <div
                class="pm-page-head"
            >

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


            <!-- =====================================
                 ДОБАВЛЕНИЕ МАТЕРИАЛА
                 ===================================== -->

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


                                <!-- =================
                                     ФАЙЛ
                                     ================= -->

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


                                <!-- =================
                                     ССЫЛКА
                                     ================= -->

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

                                        ? 'Можно добавить внешнюю ссылку на видео или загрузить видео непосредственно в платформу.'

                                        : 'Можно добавить ссылку на Google Диск, Яндекс Диск, Mail.ru или другой облачный сервис, либо загрузить файл непосредственно в платформу.'
                                }

                            </div>


                        </div>

                      `

                    : ''

            }


            <!-- =====================================
                 СПИСОК
                 ===================================== -->

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


    /*
       После вставки HTML
       ещё раз принудительно исправляем ширину.
    */

    fixMaterialsLayout();


    await renderMaterialList(
        section,
        direction
    );

}


/* =========================================================
   ОТКРЫТЬ / ЗАКРЫТЬ ДОБАВЛЕНИЕ
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
   СТАТУС
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
        (type || '');


    status.textContent =
        text || '';

}


/* =========================================================
   СПИСОК
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
        material.material_type === 'file'
        &&
        material.file_path;


    const isLink =
        material.material_type === 'link'
        &&
        material.url;


    let icon = '🔗';

    let iconClass = '';

    let name = 'Материал';


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
            section === 'videos'
            ||
            [
                'mp4',
                'webm',
                'mov',
                'm4v'
            ].includes(extension)
        ) {

            icon = '▶';

            iconClass = 'video';

        }

        else if (
            extension === 'pdf'
        ) {

            icon = 'PDF';

            iconClass = 'pdf';

        }

        else {

            icon = '📄';

        }

    }


    else if (isLink) {

        icon = '🔗';

        name = 'Внешняя ссылка';

    }


    const date =
        platformFormatDate(
            material.created_at
        );


    let action = '';


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


    if (isLink) {

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

            data-material-id="${material.id}"
        >


            <div
                class="
                    pm-material-icon
                    ${iconClass}
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


                    ${
                        date
                            ? ' • ' +
                              platformEscape(date)
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

    if (!isPlatformManager()) {
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

    } catch (_) {

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

                    section: section,

                    direction: direction,

                    material_type: 'link',

                    url: url,

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

    if (!isPlatformManager()) {
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

                ||
                'file';


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
            'Файл загружен. Сохраняю...',
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

                    section: section,

                    direction: direction,

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


        if (!material?.file_path) {

            throw new Error(
                'Файл не найден.'
            );

        }


        const fileName =
            platformFileName(
                material.file_path
            );


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
                        download: fileName
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


        const link =
            document.createElement('a');


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
   ПЕРЕЙТИ ПО ВНЕШНЕЙ ССЫЛКЕ
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
   УДАЛЕНИЕ
   ========================================================= */

async function deletePlatformMaterial(
    materialId
) {

    if (!isPlatformManager()) {
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


    } catch (error) {

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
   СОВМЕСТИМОСТЬ СО СТАРЫМ INDEX.HTML
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
   СТАРАЯ ФУНКЦИЯ
   ========================================================= */

function openMaterial(
    url,
    title
) {

    if (url) {

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
