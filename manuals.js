/* =========================================================
   MANUALS.JS
   Методические пособия + Видео

   ВАЖНО:
   - не создаёт всплывающих окон;
   - при выборе направления открывается полноценная страница;
   - карточки направлений остаются сеткой;
   - методические пособия: файл + внешняя ссылка;
   - видео: видеофайл + внешняя ссылка;
   - файл → "Скачать";
   - ссылка → "Перейти";
   - стили полностью изолированы от остальных разделов.
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

    const name =
        String(path)
            .split('/')
            .pop() || 'Файл';

    return name.replace(
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
   ИЗОЛИРОВАННЫЕ СТИЛИ
   ========================================================= */

function ensureMaterialStyles() {

    if (
        document.getElementById(
            'isolatedPlatformMaterialStyles'
        )
    ) {
        return;
    }

    const style =
        document.createElement('style');

    style.id =
        'isolatedPlatformMaterialStyles';

    style.textContent = `

        .pm-page {
            width: 100%;
            max-width: 1180px;
            margin: 0 auto;
            box-sizing: border-box;
        }

        .pm-back {
            display: inline-flex;
            align-items: center;
            gap: 8px;

            margin: 0 0 18px 0;
            padding: 0;

            border: none;
            background: transparent;

            color: #f6d66c;
            font-size: 16px;
            font-weight: 600;

            cursor: pointer;
        }

        .pm-back:hover {
            text-decoration: underline;
        }

        .pm-page-head {
            width: 100%;

            display: flex;
            align-items: flex-start;
            justify-content: space-between;

            gap: 30px;
            margin-bottom: 24px;

            box-sizing: border-box;
        }

        .pm-page-head-left {
            min-width: 0;
        }

        .pm-page-title {
            margin: 0;

            color: #f6d66c;
            font-family: Georgia, serif;

            font-size: 34px;
            line-height: 1.2;
        }

        .pm-page-subtitle {
            margin: 8px 0 0 0;

            color: #eee5d0;
            font-size: 17px;
        }

        .pm-head-actions {
            flex: 0 0 auto;
        }

        .pm-button {
            min-height: 44px;

            padding: 10px 20px;

            border: 1px solid #d7aa31;
            border-radius: 11px;

            background:
                linear-gradient(
                    135deg,
                    #7642a5,
                    #512879
                );

            color: #f8e7a8;

            font-size: 15px;
            font-weight: 700;

            cursor: pointer;
        }

        .pm-button:hover {
            transform: translateY(-1px);
        }


        /* ---------- ПАНЕЛЬ ДОБАВЛЕНИЯ ---------- */

        .pm-add-panel {
            display: none;

            width: 100%;
            box-sizing: border-box;

            margin-bottom: 24px;
            padding: 22px;

            border: 1px solid
                rgba(215,170,49,.45);

            border-radius: 16px;

            background:
                rgba(20,13,48,.72);
        }

        .pm-add-panel.open {
            display: block;
        }

        .pm-add-panel-title {
            margin-bottom: 18px;

            color: #f6d66c;
            font-family: Georgia, serif;

            font-size: 23px;
            font-weight: 700;
        }

        .pm-add-grid {
            width: 100%;

            display: grid;

            grid-template-columns:
                minmax(0, 1fr)
                minmax(0, 1fr);

            gap: 20px;
        }

        .pm-add-box {
            min-width: 0;

            padding: 20px;

            box-sizing: border-box;

            border: 1px solid
                rgba(215,170,49,.28);

            border-radius: 14px;

            background:
                rgba(255,255,255,.035);
        }

        .pm-add-label {
            display: block;

            margin-bottom: 12px;

            color: #f4ead7;
            font-size: 16px;
            font-weight: 700;
        }

        .pm-file-row {
            width: 100%;

            display: flex;
            align-items: center;

            gap: 12px;
            flex-wrap: wrap;
        }

        .pm-input {
            width: 100%;
            box-sizing: border-box;

            min-height: 44px;

            padding: 11px 13px;

            border: 1px solid
                rgba(215,170,49,.65);

            border-radius: 10px;

            background: #17112f;
            color: #fff;

            outline: none;
        }

        .pm-file-input {
            width: 100%;
            box-sizing: border-box;

            padding: 9px;

            border: 1px solid
                rgba(215,170,49,.45);

            border-radius: 10px;

            background: #17112f;
            color: #eee5d0;
        }

        .pm-status {
            margin-top: 15px;

            min-height: 20px;

            color: #ddd5df;
            font-size: 14px;
            line-height: 1.5;
        }

        .pm-status.ok {
            color: #a9e4b4;
        }

        .pm-status.error {
            color: #ffb0b0;
        }


        /* ---------- СПИСОК ---------- */

        .pm-materials {
            width: 100%;

            display: flex;
            flex-direction: column;

            gap: 12px;
        }

        .pm-material {
            width: 100%;
            box-sizing: border-box;

            display: grid;

            grid-template-columns:
                64px
                minmax(0, 1fr)
                auto;

            align-items: center;

            gap: 18px;

            padding: 17px 20px;

            border: 1px solid
                rgba(215,170,49,.28);

            border-radius: 14px;

            background:
                rgba(15,11,38,.65);
        }

        .pm-material-icon {
            width: 58px;
            height: 58px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 11px;

            background:
                rgba(91,48,139,.55);

            color: #f6d66c;

            font-size: 24px;
            font-weight: 800;
        }

        .pm-material-icon.pdf {
            background: #a93636;
            color: #fff;
            font-size: 16px;
        }

        .pm-material-info {
            min-width: 0;
        }

        .pm-material-name {
            margin-bottom: 6px;

            color: #fff;

            font-size: 18px;
            font-weight: 700;

            overflow-wrap: anywhere;
        }

        .pm-material-meta {
            color: #c9c1ce;

            font-size: 14px;
            line-height: 1.5;

            overflow-wrap: anywhere;
        }

        .pm-material-action {
            display: flex;
            align-items: center;

            gap: 8px;

            white-space: nowrap;
        }

        .pm-open-button {
            min-height: 42px;

            padding: 9px 18px;

            border: 1px solid #d7aa31;
            border-radius: 9px;

            background: #63358d;
            color: #f8e7a8;

            font-size: 15px;
            font-weight: 700;

            cursor: pointer;
        }

        .pm-delete-button {
            min-height: 42px;

            padding: 9px 13px;

            border: 1px solid
                rgba(255,160,160,.35);

            border-radius: 9px;

            background: transparent;
            color: #ffb4b4;

            cursor: pointer;
        }

        .pm-empty {
            width: 100%;
            box-sizing: border-box;

            padding: 50px 25px;

            text-align: center;

            border: 1px dashed
                rgba(215,170,49,.35);

            border-radius: 16px;

            background:
                rgba(15,11,38,.35);

            color: #c9c1ce;
        }

        .pm-empty-title {
            margin-bottom: 8px;

            color: #f6d66c;

            font-family: Georgia, serif;

            font-size: 24px;
            font-weight: 700;
        }


        /* ---------- ТОЛЬКО ДЛЯ ЭТОЙ СТРАНИЦЫ ---------- */

        .pm-direction-cards {
            width: 100%;

            display: grid;

            grid-template-columns:
                repeat(
                    5,
                    minmax(160px, 1fr)
                );

            gap: 20px;

            box-sizing: border-box;
        }

        .pm-direction-card {
            min-width: 0;
            min-height: 260px;

            display: flex;
            flex-direction: column;

            align-items: center;
            justify-content: center;

            padding: 22px 15px;

            box-sizing: border-box;

            border: 1px solid
                rgba(215,170,49,.55);

            border-radius: 17px;

            background:
                linear-gradient(
                    145deg,
                    #304fbc,
                    #293b91
                );

            cursor: pointer;

            text-align: center;
        }

        .pm-direction-card:hover {
            transform: translateY(-2px);
        }

        .pm-direction-icon {
            margin-bottom: 20px;

            font-size: 48px;
        }

        .pm-direction-title {
            color: #f6d66c;

            font-family: Georgia, serif;

            font-size: 20px;
            line-height: 1.25;
            font-weight: 700;
        }

        .pm-direction-subtitle {
            margin-top: 10px;

            color: #fff;

            font-size: 15px;
        }


        @media (max-width: 1050px) {

            .pm-direction-cards {
                grid-template-columns:
                    repeat(3, minmax(170px, 1fr));
            }
        }


        @media (max-width: 800px) {

            .pm-add-grid {
                grid-template-columns: 1fr;
            }

            .pm-page-head {
                flex-direction: column;
            }

            .pm-direction-cards {
                grid-template-columns:
                    repeat(2, minmax(160px, 1fr));
            }

            .pm-material {
                grid-template-columns:
                    55px
                    minmax(0, 1fr);
            }

            .pm-material-action {
                grid-column: 2;
            }
        }


        @media (max-width: 520px) {

            .pm-direction-cards {
                grid-template-columns: 1fr;
            }

            .pm-page-title {
                font-size: 27px;
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

    const subtitle =
        section === 'videos'
            ? 'Видео'
            : 'Методическое пособие';

    contentCards.innerHTML = `

        <div class="pm-direction-cards">

            ${
                PLATFORM_DIRECTIONS
                    .map(item => {

                        return `

                            <div
                                class="pm-direction-card"
                                data-section="${section}"
                                data-direction="${item.key}"
                                onclick="
                                    openPlatformMaterial(
                                        '${section}',
                                        '${item.key}'
                                    )
                                "
                            >

                                <div
                                    class="pm-direction-icon"
                                >
                                    ${item.icon}
                                </div>

                                <div
                                    class="pm-direction-title"
                                >
                                    ${
                                        platformEscape(
                                            item.title
                                        )
                                    }
                                </div>

                                <div
                                    class="pm-direction-subtitle"
                                >
                                    ${subtitle}
                                </div>

                            </div>

                        `;

                    })
                    .join('')
            }

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
   ПОЛУЧЕНИЕ МАТЕРИАЛОВ
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

                                <!-- ФАЙЛ -->

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
                                        style="margin-top:12px;"
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


                                <!-- ССЫЛКА -->

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
                                        style="margin-top:12px;"
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
   СОХРАНИТЬ ССЫЛКУ
   ========================================================= */

async function savePlatformMaterialUrl() {

    if (!isManager()) {
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

    if (!isManager()) {
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
   СТАРЫЕ ИМЕНА — ЧТОБЫ НЕ ЛОМАТЬ INDEX
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
