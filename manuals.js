/* =========================================================
   manuals.js
   Методические пособия + Видео
   Таблица Supabase: platform_materials
   Storage bucket: methodicals
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
        title: 'Нумерология по Пифагору'
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


let materialManagerState = {
    section: '',
    direction: '',
    title: ''
};


// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

function platformEscape(value) {

    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

}


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


function getMaterialSectionTitle(section) {

    if (section === 'manuals') {
        return 'Методические пособия';
    }

    if (section === 'videos') {
        return 'Видео';
    }

    return 'Материалы';

}


function getMaterialSubtitle(section) {

    if (section === 'manuals') {
        return 'Методическое пособие';
    }

    if (section === 'videos') {
        return 'Видео';
    }

    return 'Материал';

}


// ============================================================
// СТИЛИ
// ============================================================

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

        .material-manager-overlay {

            position: fixed;
            inset: 0;
            z-index: 99999;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 20px;

            background:
                rgba(0,0,0,.72);

        }


        .material-manager {

            width: 560px;
            max-width: 95vw;
            max-height: 90vh;

            overflow-y: auto;

            padding: 30px;

            border-radius: 20px;

            background:
                linear-gradient(
                    145deg,
                    #302052,
                    #21163d
                );

            border:
                1px solid #d7aa31;

            color: #f8e7a8;

            box-shadow:
                0 20px 70px
                rgba(0,0,0,.5);

        }


        .material-manager h2 {

            margin:
                0 35px 24px 0;

            color:
                #f6d66c;

            font-family:
                Georgia,
                serif;

            font-weight:
                500;

        }


        .material-manager-button {

            width: 100%;

            padding:
                13px 16px;

            border:
                1px solid #d7aa31;

            border-radius:
                10px;

            background:
                linear-gradient(
                    90deg,
                    #713199,
                    #5d2789
                );

            color:
                #f8d96d;

            cursor:
                pointer;

            font-size:
                16px;

        }


        .material-manager-input {

            width: 100%;

            padding:
                13px;

            margin-bottom:
                12px;

            border:
                1px solid
                rgba(225,180,52,.5);

            border-radius:
                10px;

            background:
                rgba(0,0,0,.2);

            color:
                #fff;

            font-size:
                16px;

            box-sizing:
                border-box;

        }


        .material-manager-or {

            text-align:
                center;

            margin:
                14px 0;

            color:
                #c8bca4;

        }


        .material-manager-close {

            float:
                right;

            border:
                none;

            background:
                none;

            color:
                #f6d66c;

            font-size:
                30px;

            cursor:
                pointer;

        }


        .platform-material-card {

            cursor:
                pointer;

        }


        .platform-material-card.disabled {

            cursor:
                default;

            opacity:
                .82;

        }


        .material-open-button {

            display:
                inline-flex;

            align-items:
                center;

            justify-content:
                center;

            padding:
                10px 18px;

            margin-top:
                10px;

            border:
                1px solid #d7aa31;

            border-radius:
                9px;

            background:
                linear-gradient(
                    90deg,
                    #713199,
                    #5d2789
                );

            color:
                #f8d96d;

            text-decoration:
                none;

            cursor:
                pointer;

        }


        .material-empty {

            width:
                100%;

            padding:
                30px;

            border:
                1px solid
                rgba(225,180,52,.55);

            border-radius:
                18px;

            background:
                linear-gradient(
                    145deg,
                    #302052,
                    #21163d
                );

            color:
                #eee5d0;

            text-align:
                center;

            box-sizing:
                border-box;

        }

    `;


    document.head.appendChild(style);

}


// ============================================================
// ЗАГРУЗКА МАТЕРИАЛОВ
// ============================================================

async function getPlatformMaterials(
    section
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
                .select('*')
                .eq(
                    'section',
                    section
                )
                .order(
                    'created_at',
                    {
                        ascending:
                            true
                    }
                );


        if (error) {

            console.error(
                'Ошибка загрузки материалов:',
                error
            );

            return [];

        }


        return data || [];

    } catch (error) {

        console.error(
            'Ошибка загрузки материалов:',
            error
        );

        return [];

    }

}


// ============================================================
// ПОИСК МАТЕРИАЛА
// ============================================================

function findPlatformMaterial(
    materials,
    direction
) {

    const aliases = {

        adult: [
            'adult',
            'взрослая',
            'взрослая матрица',
            'adult matrix'
        ],

        child: [
            'child',
            'детская',
            'детская матрица',
            'child matrix'
        ],

        compatibility: [
            'compatibility',
            'совместимость',
            'матрица совместимости'
        ],

        vedic: [
            'vedic',
            'ведическая',
            'ведическая нумерология'
        ],

        pythagoras: [
            'pythagoras',
            'пифагор',
            'квадрат пифагора',
            'нумерология по пифагору',
            'психоматрица'
        ]

    };


    const wanted =
        (
            aliases[direction] ||
            [direction]
        )
            .map(
                normalizePlatformValue
            );


    return (
        materials || []
    ).find(
        function(item) {

            const fields = [

                item.direction,
                item.method,
                item.calculator,
                item.type_key,
                item.slug,
                item.title,
                item.name

            ]
                .filter(Boolean)
                .map(
                    normalizePlatformValue
                );


            return fields.some(
                function(field) {

                    return wanted.some(
                        function(alias) {

                            return (
                                field === alias ||
                                field.includes(alias) ||
                                alias.includes(field)
                            );

                        }
                    );

                }
            );

        }
    ) || null;

}


function normalizePlatformValue(
    value
) {

    return String(value || '')
        .toLowerCase()
        .trim()
        .replace(/ё/g, 'е')
        .replace(/[«»"'`]/g, '')
        .replace(/\s+/g, ' ');

}


// ============================================================
// КАРТОЧКИ
// ============================================================

function renderPlatformMaterialCards(
    section,
    materials
) {

    const contentCards =
        document.getElementById(
            'contentCards'
        );


    if (!contentCards) {
        return;
    }


    const subtitle =
        getMaterialSubtitle(
            section
        );


    contentCards.innerHTML = `

        <div
            class="cards"
            style="
                display:grid;
                grid-template-columns:
                    repeat(5,180px);
                gap:20px;
                justify-content:start;
            "
        >

            ${

                PLATFORM_DIRECTIONS
                    .map(
                        function(direction) {

                            const material =
                                findPlatformMaterial(
                                    materials,
                                    direction.key
                                );


                            const link =
                                material
                                    ? (
                                        material.external_url ||
                                        material.file_url ||
                                        ''
                                    )
                                    : '';


                            const icon =
                                direction.key ===
                                'pythagoras'

                                    ? pythagorasIconHtml()

                                    : `
                                        <div class="card-icon">
                                            ${direction.icon}
                                        </div>
                                    `;


                            return `

                                <div
                                    class="
                                        card
                                        method-card
                                        platform-material-card
                                        ${
                                            link
                                                ? ''
                                                : 'disabled'
                                        }
                                    "

                                    ${
                                        link
                                            ? `
                                                onclick="openMaterial(
                                                    ${JSON.stringify(link)},
                                                    ${JSON.stringify(direction.title)}
                                                )
                                              `
                                            : ''
                                    }

                                    role="button"
                                    tabindex="0"
                                >

                                    ${icon}


                                    <div
                                        class="card-content"
                                    >

                                        <h3>
                                            ${direction.title}
                                        </h3>

                                        <p>
                                            ${subtitle}
                                        </p>

                                    </div>

                                </div>

                            `;

                        }
                    )
                    .join('')

            }

        </div>

    `;

}


// ============================================================
// МЕТОДИЧЕСКИЕ ПОСОБИЯ
// ============================================================

async function loadManuals() {

    ensureMaterialStyles();


    const contentCards =
        document.getElementById(
            'contentCards'
        );


    if (!contentCards) {
        return;
    }


    contentCards.innerHTML =
        '<div class="material-empty">Загрузка...</div>';


    const materials =
        await getPlatformMaterials(
            'manuals'
        );


    renderPlatformMaterialCards(
        'manuals',
        materials
    );

}


// ============================================================
// ВИДЕО
// ============================================================

async function loadVideos() {

    ensureMaterialStyles();


    const contentCards =
        document.getElementById(
            'contentCards'
        );


    if (!contentCards) {
        return;
    }


    contentCards.innerHTML =
        '<div class="material-empty">Загрузка...</div>';


    const materials =
        await getPlatformMaterials(
            'videos'
        );


    renderPlatformMaterialCards(
        'videos',
        materials
    );

}


// ============================================================
// ОТКРЫТИЕ МАТЕРИАЛА
// ============================================================

function openMaterial(
    url,
    title
) {

    if (!url) {

        return;

    }


    window.open(
        url,
        '_blank',
        'noopener,noreferrer'
    );

}


// ============================================================
// АДМИНИСТРАТОР:
// ОКНО ДОБАВЛЕНИЯ МАТЕРИАЛА
// ============================================================

function showMaterialManager(
    title,
    section = 'manuals',
    direction = ''
) {

    ensureMaterialStyles();


    const old =
        document.getElementById(
            'materialManager'
        );


    if (old) {
        old.remove();
    }


    materialManagerState = {

        section:
            section,

        direction:
            direction,

        title:
            title || ''

    };


    const box =
        document.createElement(
            'div'
        );


    box.id =
        'materialManager';


    box.innerHTML = `

        <div
            class="material-manager-overlay"
        >

            <div
                class="material-manager"
            >

                <button
                    class="material-manager-close"
                    onclick="
                        document
                            .getElementById(
                                'materialManager'
                            )
                            .remove()
                    "
                >
                    ×
                </button>


                <h2>
                    ${platformEscape(
                        title ||
                        'Материал'
                    )}
                </h2>


                <button
                    class="material-manager-button"
                    onclick="
                        document
                            .getElementById(
                                'materialFileInput'
                            )
                            .click()
                    "
                >
                    📁 Загрузить файл
                </button>


                <input
                    id="materialFileInput"
                    type="file"
                    style="display:none"
                    onchange="
                        uploadMaterialFile(
                            this.files[0]
                        )
                    "
                >


                <div
                    class="material-manager-or"
                >
                    или
                </div>


                <input
                    id="materialUrlInput"
                    class="material-manager-input"
                    type="url"
                    placeholder="Вставьте ссылку"
                >


                <button
                    class="material-manager-button"
                    onclick="
                        saveMaterialUrl()
                    "
                >
                    🔗 Сохранить ссылку
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        box
    );

}


// ============================================================
// СОХРАНЕНИЕ ССЫЛКИ
// ============================================================

async function saveMaterialUrl() {

    if (
        !window.currentUserIsManager
    ) {

        alert(
            'Недостаточно прав.'
        );

        return;

    }


    const input =
        document.getElementById(
            'materialUrlInput'
        );


    const url =
        input
            ?.value
            .trim();


    if (!url) {

        alert(
            'Вставьте ссылку.'
        );

        return;

    }


    try {

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

                    title:
                        materialManagerState.title,

                    external_url:
                        url

                });


        if (error) {
            throw error;
        }


        const manager =
            document.getElementById(
                'materialManager'
            );


        if (manager) {
            manager.remove();
        }


        if (
            materialManagerState.section ===
            'videos'
        ) {

            await loadVideos();

        } else {

            await loadManuals();

        }


    } catch (error) {

        console.error(
            'Ошибка сохранения ссылки:',
            error
        );


        alert(
            error.message ||
            'Не удалось сохранить ссылку.'
        );

    }

}


// ============================================================
// ЗАГРУЗКА ФАЙЛА В STORAGE
// ============================================================

async function uploadMaterialFile(
    file
) {

    if (
        !window.currentUserIsManager
    ) {

        alert(
            'Недостаточно прав.'
        );

        return;

    }


    if (!file) {
        return;
    }


    try {

        const safeName =
            file.name
                .replace(
                    /[^a-zA-Zа-яА-Я0-9._-]/g,
                    '_'
                );


        const timestamp =
            Date.now();


        const path =
            `${
                materialManagerState.section
            }/${
                materialManagerState.direction ||
                'material'
            }/${
                timestamp
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
                        upsert:
                            true
                    }
                );


        if (uploadError) {
            throw uploadError;
        }


        const {
            data
        } =
            supabaseClient
                .storage
                .from(
                    PLATFORM_STORAGE_BUCKET
                )
                .getPublicUrl(
                    path
                );


        const publicUrl =
            data?.publicUrl;


        if (!publicUrl) {

            throw new Error(
                'Не удалось получить ссылку на файл.'
            );

        }


        const {
            error: dbError
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

                    title:
                        materialManagerState.title,

                    file_url:
                        publicUrl

                });


        if (dbError) {
            throw dbError;
        }


        const manager =
            document.getElementById(
                'materialManager'
            );


        if (manager) {
            manager.remove();
        }


        if (
            materialManagerState.section ===
            'videos'
        ) {

            await loadVideos();

        } else {

            await loadManuals();

        }


    } catch (error) {

        console.error(
            'Ошибка загрузки файла:',
            error
        );


        alert(
            error.message ||
            'Не удалось загрузить файл.'
        );

    }

}


// ============================================================
// ТЕСТЫ
// ============================================================

function openTest(
    type,
    title
) {

    showMaterialManager(
        title || 'Тест',
        'tests',
        type || ''
    );

}


// ============================================================
// НАВИГАЦИЯ
// ============================================================

function manualsSetActiveSection(
    section
) {

    document
        .querySelectorAll(
            '.nav-item[data-section]'
        )
        .forEach(
            function(button) {

                button.classList.toggle(
                    'active',
                    button.dataset.section ===
                    section
                );

            }
        );

}


// ============================================================
// МОЯ БИБЛИОТЕКА
// ============================================================

const NUMEROLOGY_LIBRARY_URL =
    'https://drive.google.com/drive/folders/1pGjVPKtGeHm5NKrcg0JLvy5M_XDTAaOv?usp=sharing';


function loadLibrary() {

    const contentCards =
        document.getElementById(
            'contentCards'
        );


    if (!contentCards) {
        return;
    }


    contentCards.innerHTML = `

        <div class="cards">

            <div
                class="
                    card
                    library-main-card
                "
                onclick="openLibraryHome()"
                role="button"
                tabindex="0"
            >

                <div
                    class="
                        card-icon
                        library-icon
                    "
                >
                    📚
                </div>


                <div
                    class="card-content"
                >

                    <h3>
                        Библиотека<br>
                        нумеролога
                    </h3>

                    <p>
                        Все книги и материалы
                    </p>

                </div>

            </div>

        </div>

    `;

}


function openLibraryHome() {

    window.open(
        NUMEROLOGY_LIBRARY_URL,
        '_blank',
        'noopener,noreferrer'
    );

}
