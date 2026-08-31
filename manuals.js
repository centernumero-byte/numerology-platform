/* =========================================================
   manuals.js
   МЕТОДИЧЕСКИЕ ПОСОБИЯ + ВИДЕО

   Supabase:
   Таблица: platform_materials
   Storage bucket: methodicals

   Структура platform_materials:
   id
   section
   direction
   material_type
   url
   file_path
   created_by
   created_at
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
        PLATFORM_DIRECTIONS.map(
            item => [
                item.key,
                item.title
            ]
        )
    );


/* =========================================================
   СОСТОЯНИЕ ОКНА
   ========================================================= */

let materialManagerState = {

    section: '',

    direction: '',

    title: '',

    material: null

};


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
   ЗАГОЛОВОК РАЗДЕЛА
   ========================================================= */

function getMaterialSectionTitle(section) {

    if (section === 'manuals') {

        return 'Методические пособия';

    }

    if (section === 'videos') {

        return 'Видео';

    }

    return 'Материалы';

}


/* =========================================================
   ПОДЗАГОЛОВОК
   ========================================================= */

function getMaterialSubtitle(section) {

    if (section === 'manuals') {

        return 'Методическое пособие';

    }

    if (section === 'videos') {

        return 'Видео';

    }

    return 'Материал';

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

        /* =====================================================
           КАРТОЧКИ
           ===================================================== */

        #contentCards .cards {

            display: grid !important;

            grid-template-columns:
                repeat(
                    5,
                    minmax(170px, 190px)
                ) !important;

            gap: 22px !important;

            width: 100% !important;

            justify-content: start !important;

            align-items: stretch !important;

        }


        #contentCards .method-card {

            width: 180px !important;

            min-width: 180px !important;

            max-width: 180px !important;

            min-height: 300px !important;

            height: 300px !important;

            box-sizing: border-box !important;

            display: flex !important;

            flex-direction: column !important;

            align-items: center !important;

            justify-content: center !important;

            text-align: center !important;

            cursor: pointer !important;

            overflow: hidden !important;

        }


        #contentCards .method-card .card-content {

            width: 100% !important;

            display: flex !important;

            flex-direction: column !important;

            align-items: center !important;

            justify-content: center !important;

            flex: 0 0 auto !important;

        }


        #contentCards .method-card h3 {

            width: 100% !important;

            margin: 18px 8px 8px !important;

            line-height: 1.2 !important;

            text-align: center !important;

        }


        #contentCards .method-card p {

            margin: 0 !important;

            text-align: center !important;

            line-height: 1.4 !important;

        }


        #contentCards .method-card .card-icon {

            flex: 0 0 auto !important;

            font-size: 58px !important;

            line-height: 1 !important;

        }


        #contentCards .method-card .pythagoras-icon {

            width: 78px !important;

            height: 78px !important;

            display: grid !important;

            grid-template-columns:
                repeat(3, 1fr) !important;

            gap: 3px !important;

            font-size: 17px !important;

            line-height: 1 !important;

        }


        #contentCards .method-card
        .pythagoras-icon span {

            display: flex !important;

            align-items: center !important;

            justify-content: center !important;

        }


        #contentCards .method-card.has-material {

            box-shadow:
                0 10px 30px
                rgba(0,0,0,.28),
                inset 0 0 25px
                rgba(246,214,108,.08) !important;

        }


        /* =====================================================
           ОКНО АДМИНИСТРАТОРА
           ===================================================== */

        .material-manager-overlay {

            position: fixed !important;

            inset: 0 !important;

            z-index: 999999 !important;

            display: flex !important;

            align-items: center !important;

            justify-content: center !important;

            padding: 25px !important;

            background:
                rgba(0,0,0,.78) !important;

            box-sizing: border-box !important;

        }


        .material-manager {

            position: relative !important;

            width: 700px !important;

            max-width: 94vw !important;

            max-height: 90vh !important;

            overflow-y: auto !important;

            padding: 34px !important;

            box-sizing: border-box !important;

            border-radius: 24px !important;

            background:
                linear-gradient(
                    145deg,
                    #302052 0%,
                    #21163d 100%
                ) !important;

            border:
                1px solid
                #d7aa31 !important;

            color: #f8e7a8 !important;

            box-shadow:
                0 25px 80px
                rgba(0,0,0,.65) !important;

        }


        .material-manager h2 {

            margin:
                0 45px 25px 0 !important;

            color: #f6d66c !important;

            font-family:
                Georgia,
                serif !important;

            font-size: 30px !important;

            line-height: 1.2 !important;

        }


        .material-manager-close {

            position: absolute !important;

            right: 18px !important;

            top: 15px !important;

            width: 40px !important;

            height: 40px !important;

            padding: 0 !important;

            border: none !important;

            background:
                transparent !important;

            color: #f6d66c !important;

            font-size: 34px !important;

            line-height: 1 !important;

            cursor: pointer !important;

        }


        .material-manager-label {

            display: block !important;

            margin:
                18px 0 9px !important;

            color: #eee5d0 !important;

            font-weight: 600 !important;

            font-size: 16px !important;

        }


        .material-manager-input {

            width: 100% !important;

            box-sizing: border-box !important;

            padding: 14px 15px !important;

            border-radius: 12px !important;

            border:
                1px solid
                #d7aa31 !important;

            background:
                #17112f !important;

            color: white !important;

            font-size: 16px !important;

            outline: none !important;

        }


        .material-manager-input::placeholder {

            color:
                #aaa1b4 !important;

        }


        .material-manager-button {

            margin-top: 13px !important;

            padding:
                13px 22px !important;

            border-radius: 12px !important;

            border:
                1px solid
                #d7aa31 !important;

            background:
                linear-gradient(
                    90deg,
                    #713199,
                    #5d2789
                ) !important;

            color:
                #f8d96d !important;

            font-size: 16px !important;

            font-weight: 600 !important;

            cursor: pointer !important;

        }


        .material-manager-button:hover {

            filter: brightness(1.08);

        }


        .material-manager-button:disabled {

            opacity: .55 !important;

            cursor: wait !important;

        }


        .material-manager-or {

            margin:
                24px 0 5px !important;

            text-align: center !important;

            color:
                #cfc4b0 !important;

            font-weight: 600 !important;

        }


        .material-manager-status {

            margin-top: 20px !important;

            padding: 14px !important;

            border-radius: 12px !important;

            line-height: 1.5 !important;

            min-height: 24px !important;

        }


        .material-manager-status.ok {

            color: #a9e4b4 !important;

            background:
                rgba(80,180,100,.08) !important;

            border:
                1px solid
                rgba(100,220,120,.25) !important;

        }


        .material-manager-status.error {

            color: #ffb0b0 !important;

            background:
                rgba(220,70,70,.08) !important;

            border:
                1px solid
                rgba(255,100,100,.25) !important;

        }


        .material-manager-current {

            margin:
                0 0 20px !important;

            padding: 17px !important;

            border-radius: 14px !important;

            background:
                rgba(255,255,255,.06) !important;

            border:
                1px solid
                rgba(215,170,49,.35) !important;

            color:
                #eee5d0 !important;

            line-height: 1.5 !important;

        }


        .material-manager-current strong {

            color:
                #f6d66c !important;

        }


        .material-manager-current a {

            color:
                #f6d66c !important;

            word-break:
                break-all !important;

        }


        .material-manager-hint {

            margin-top: 10px !important;

            color:
                #bdb3c5 !important;

            font-size: 13px !important;

            line-height: 1.45 !important;

        }


        /* =====================================================
           АДАПТИВ
           ===================================================== */

        @media (max-width: 1150px) {

            #contentCards .cards {

                grid-template-columns:
                    repeat(
                        4,
                        180px
                    ) !important;

            }

        }


        @media (max-width: 900px) {

            #contentCards .cards {

                grid-template-columns:
                    repeat(
                        3,
                        180px
                    ) !important;

            }

        }


        @media (max-width: 680px) {

            #contentCards .cards {

                grid-template-columns:
                    repeat(
                        2,
                        180px
                    ) !important;

            }

            .material-manager {

                width: 95vw !important;

                padding: 24px !important;

            }

        }


        @media (max-width: 450px) {

            #contentCards .cards {

                grid-template-columns:
                    180px !important;

                justify-content:
                    center !important;

            }

        }

    `;


    document.head.appendChild(style);

}


/* =========================================================
   ТЕКУЩАЯ СЕССИЯ
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
   ПОЛУЧЕНИЕ МАТЕРИАЛА
   ========================================================= */

async function getCurrentMaterial(
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

            .select(
                `
                    id,
                    section,
                    direction,
                    material_type,
                    url,
                    file_path,
                    created_by,
                    created_at
                `
            )

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
            )

            .limit(1)

            .maybeSingle();


    if (error) {

        throw error;

    }


    return data || null;

}


/* =========================================================
   ЗАГРУЗКА КАРТОЧЕК
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


    const title =
        getMaterialSectionTitle(
            section
        );


    const subtitle =
        getMaterialSubtitle(
            section
        );


    contentCards.innerHTML = `

        <div
            class="section-title"
        >

            <h2>
                ${platformEscape(title)}
            </h2>

        </div>


        <div
            class="cards"
            id="platformMaterialCards"
        >

            ${PLATFORM_DIRECTIONS
                .map(item => {

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
                            id="
                                platform-material-${section}-${item.key}
                            "
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
                                    ${platformEscape(
                                        subtitle
                                    )}
                                </p>

                            </div>

                        </div>

                    `;

                })
                .join('')}

        </div>

    `;


    /*
       Ставим клавиатурную навигацию
    */

    const cards =
        document.querySelectorAll(
            '#platformMaterialCards .method-card'
        );


    cards.forEach(card => {

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


    /*
       Загружаем существующие материалы.
    */

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
                    `
                        id,
                        section,
                        direction,
                        material_type,
                        url,
                        file_path,
                        created_at
                    `
                )

                .eq(
                    'section',
                    section
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


        const latestByDirection = {};


        (data || []).forEach(
            item => {

                if (
                    !latestByDirection[
                        item.direction
                    ]
                ) {

                    latestByDirection[
                        item.direction
                    ] = item;

                }

            }
        );


        Object.entries(
            latestByDirection
        ).forEach(
            (
                [
                    direction,
                    item
                ]
            ) => {

                const card =
                    document.getElementById(
                        `platform-material-${section}-${direction}`
                    );


                if (!card) {

                    return;

                }


                card.classList.add(
                    'has-material'
                );


                card.dataset.materialId =
                    item.id || '';


                card.dataset.materialType =
                    item.material_type || '';


                card.dataset.url =
                    item.url || '';


                card.dataset.filePath =
                    item.file_path || '';

            }
        );


    } catch (error) {

        console.error(
            'Ошибка загрузки platform_materials:',
            error
        );

    }

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
   ОТКРЫТИЕ МАТЕРИАЛА
   ========================================================= */

async function openPlatformMaterial(
    section,
    direction
) {

    const title =
        PLATFORM_NAMES[
            direction
        ] || 'Материал';


    try {

        const material =
            await getCurrentMaterial(
                section,
                direction
            );


        /*
           АДМИНИСТРАТОР:

           Всегда открываем полноценное
           окно управления.

           Даже если материал уже существует.
        */

        if (
            window.currentUserIsManager
        ) {

            await showMaterialManager(
                section,
                direction,
                title,
                material
            );

            return;

        }


        /*
           ОБЫЧНЫЙ ПОЛЬЗОВАТЕЛЬ
        */

        if (!material) {

            alert(
                `${title}\n\n` +
                `${getMaterialSubtitle(section)}\n\n` +
                `Материал пока не добавлен.`
            );

            return;

        }


        /*
           Если есть обычная ссылка
        */

        if (material.url) {

            window.open(
                material.url,
                '_blank',
                'noopener,noreferrer'
            );

            return;

        }


        /*
           Если есть файл
        */

        if (
            material.file_path
        ) {

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
                        60 * 60
                    );


            if (error) {

                throw error;

            }


            if (
                !data?.signedUrl
            ) {

                throw new Error(
                    'Не удалось получить ссылку на файл.'
                );

            }


            window.open(
                data.signedUrl,
                '_blank',
                'noopener,noreferrer'
            );

            return;

        }


        alert(
            `${title}\n\nМатериал пока не добавлен.`
        );


    } catch (error) {

        console.error(
            'Ошибка открытия материала:',
            error
        );


        alert(
            'Не удалось открыть материал.\n\n' +
            (
                error.message ||
                error
            )
        );

    }

}


/* =========================================================
   ОКНО УПРАВЛЕНИЯ
   ========================================================= */

async function showMaterialManager(
    section,
    direction,
    title,
    material = null
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

        section,

        direction,

        title,

        material

    };


    const isVideo =
        section === 'videos';


    const accept =
        isVideo

            ? 'video/*,.mp4,.webm,.mov,.m4v'

            : '.pdf,.doc,.docx';


    const currentHtml =
        material

            ? `

                <div
                    class="material-manager-current"
                >

                    <strong>
                        Уже загружено:
                    </strong>

                    <br><br>

                    ${
                        material.url

                            ? `
                                🔗 Ссылка:
                                <br>

                                <a
                                    href="${platformEscape(
                                        material.url
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    ${platformEscape(
                                        material.url
                                    )}
                                </a>
                            `

                            : material.file_path

                                ? `
                                    📁 Файл:
                                    <br>
                                    ${platformEscape(
                                        material.file_path
                                    )}
                                `

                                : `
                                    Материал найден,
                                    но ссылка или файл
                                    не указаны.
                                `
                    }

                </div>

            `

            : `

                <div
                    class="material-manager-current"
                >

                    <strong>
                        Материал ещё не загружен.
                    </strong>

                    <br>

                    Здесь можно добавить
                    ссылку или файл.

                </div>

            `;


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
                    type="button"
                    class="material-manager-close"
                    id="materialManagerClose"
                >
                    ×
                </button>


                <h2>
                    ${platformEscape(title)}
                </h2>


                ${currentHtml}


                <label
                    class="material-manager-label"
                >
                    Вставить ссылку
                </label>


                <input
                    id="materialUrlInput"
                    class="material-manager-input"
                    type="url"
                    placeholder="https://..."
                >


                <button
                    id="saveMaterialUrlButton"
                    type="button"
                    class="material-manager-button"
                >
                    🔗 Сохранить ссылку
                </button>


                <div
                    class="material-manager-or"
                >
                    или
                </div>


                <label
                    class="material-manager-label"
                >
                    Загрузить файл
                </label>


                <input
                    id="materialFileInput"
                    class="material-manager-input"
                    type="file"
                    accept="${accept}"
                >


                <button
                    id="uploadMaterialFileButton"
                    type="button"
                    class="material-manager-button"
                >
                    📁 Загрузить файл
                </button>


                <div
                    class="material-manager-hint"
                >

                    ${
                        isVideo

                            ? `
                                Для видео можно вставить
                                ссылку YouTube/Vimeo
                                или загрузить видеофайл.
                            `

                            : `
                                Для пособия можно вставить
                                ссылку на документ
                                или загрузить PDF, DOC, DOCX.
                            `
                    }

                </div>


                <div
                    id="materialManagerStatus"
                    class="material-manager-status"
                ></div>


            </div>

        </div>

    `;


    document.body.appendChild(
        box
    );


    /*
       Закрытие
    */

    document
        .getElementById(
            'materialManagerClose'
        )
        ?.addEventListener(
            'click',
            () => {

                box.remove();

            }
        );


    /*
       Сохранение ссылки
    */

    document
        .getElementById(
            'saveMaterialUrlButton'
        )
        ?.addEventListener(
            'click',
            async () => {

                await savePlatformMaterialUrl();

            }
        );


    /*
       Загрузка файла
    */

    document
        .getElementById(
            'uploadMaterialFileButton'
        )
        ?.addEventListener(
            'click',
            async () => {

                await uploadPlatformMaterialFile();

            }
        );

}


/* =========================================================
   СТАТУС
   ========================================================= */

function setMaterialManagerStatus(
    text,
    type = ''
) {

    const box =
        document.getElementById(
            'materialManagerStatus'
        );


    if (!box) {

        return;

    }


    box.className =
        'material-manager-status ' +
        type;


    box.textContent =
        text || '';

}


/* =========================================================
   БЛОКИРОВКА КНОПОК
   ========================================================= */

function setMaterialManagerBusy(
    busy
) {

    const saveButton =
        document.getElementById(
            'saveMaterialUrlButton'
        );


    const uploadButton =
        document.getElementById(
            'uploadMaterialFileButton'
        );


    if (saveButton) {

        saveButton.disabled =
            busy;

    }


    if (uploadButton) {

        uploadButton.disabled =
            busy;

    }

}


/* =========================================================
   СОХРАНЕНИЕ ССЫЛКИ
   ========================================================= */

async function savePlatformMaterialUrl() {

    if (
        !window.currentUserIsManager
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
            'materialUrlInput'
        );


    const url =
        input?.value.trim() || '';


    if (!url) {

        setMaterialManagerStatus(
            'Вставьте ссылку.',
            'error'
        );

        return;

    }


    /*
       Проверяем URL
    */

    let parsedUrl;


    try {

        parsedUrl =
            new URL(url);

    } catch (_) {

        setMaterialManagerStatus(
            'Введите корректную ссылку, начинающуюся с https:// или http://',
            'error'
        );

        return;

    }


    if (
        parsedUrl.protocol !==
            'https:' &&

        parsedUrl.protocol !==
            'http:'
    ) {

        setMaterialManagerStatus(
            'Разрешены только http:// и https://',
            'error'
        );

        return;

    }


    setMaterialManagerBusy(
        true
    );


    setMaterialManagerStatus(
        'Сохраняю ссылку...',
        ''
    );


    try {

        const session =
            await getCurrentSession();


        if (!session) {

            throw new Error(
                'Сессия пользователя не найдена. Войдите заново.'
            );

        }


        /*
           ВАЖНО:

           Используем platform_materials.

           НЕ используем external_url.
        */

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


        setMaterialManagerStatus(
            'Ссылка успешно сохранена.',
            'ok'
        );


        await loadPlatformMaterials(
            section
        );


        setTimeout(
            () => {

                document
                    .getElementById(
                        'materialManager'
                    )
                    ?.remove();

            },
            900
        );


    } catch (error) {

        console.error(
            'Ошибка сохранения ссылки:',
            error
        );


        setMaterialManagerStatus(
            'Не удалось сохранить ссылку: ' +
            (
                error.message ||
                error
            ),
            'error'
        );


    } finally {

        setMaterialManagerBusy(
            false
        );

    }

}


/* =========================================================
   БЕЗОПАСНОЕ ИМЯ ФАЙЛА
   ========================================================= */

function makePlatformSafeFileName(
    fileName
) {

    return String(
        fileName ||
        'file'
    )

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

        || 'file';

}


/* =========================================================
   ЗАГРУЗКА ФАЙЛА
   ========================================================= */

async function uploadPlatformMaterialFile() {

    if (
        !window.currentUserIsManager
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
            'materialFileInput'
        );


    const file =
        input?.files?.[0];


    if (!file) {

        setMaterialManagerStatus(
            'Сначала выберите файл.',
            'error'
        );

        return;

    }


    /*
       Проверка типа файла
    */

    if (
        section === 'manuals'
    ) {

        const allowed =
            [
                'pdf',
                'doc',
                'docx'
            ];


        const extension =
            String(
                file.name
                    .split('.')
                    .pop() ||
                    ''
            )
            .toLowerCase();


        if (
            !allowed.includes(
                extension
            )
        ) {

            setMaterialManagerStatus(
                'Для методического пособия разрешены PDF, DOC и DOCX.',
                'error'
            );

            return;

        }

    }


    if (
        section === 'videos'
    ) {

        if (
            file.type &&
            !file.type.startsWith(
                'video/'
            )
        ) {

            setMaterialManagerStatus(
                'Для раздела Видео выберите видеофайл.',
                'error'
            );

            return;

        }

    }


    /*
       Размер
    */

    const maxSize =
        section === 'videos'

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

        setMaterialManagerStatus(

            section === 'videos'

                ? 'Видео слишком большое. Максимум 500 МБ.'

                : 'Файл слишком большой. Максимум 100 МБ.',

            'error'

        );

        return;

    }


    setMaterialManagerBusy(
        true
    );


    setMaterialManagerStatus(
        'Загружаю файл в Storage...',
        ''
    );


    let path = null;


    try {

        const session =
            await getCurrentSession();


        if (!session) {

            throw new Error(
                'Сессия пользователя не найдена. Войдите заново.'
            );

        }


        const safeName =
            makePlatformSafeFileName(
                file.name
            );


        const unique =
            (
                window.crypto &&
                crypto.randomUUID
            )

                ? crypto.randomUUID()

                : Date.now() +
                  '_' +
                  Math.random()
                      .toString(36)
                      .slice(2);


        path =
            `${section}/${direction}/${unique}_${safeName}`;


        /*
           Загрузка в bucket methodicals
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
                            'application/octet-stream'
                    }
                );


        if (uploadError) {

            throw uploadError;

        }


        setMaterialManagerStatus(
            'Файл загружен. Сохраняю запись...',
            ''
        );


        /*
           Запись в platform_materials
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


        if (insertError) {

            /*
               Если запись БД не создалась,
               удаляем файл.
            */

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


        setMaterialManagerStatus(
            'Файл успешно сохранён.',
            'ok'
        );


        await loadPlatformMaterials(
            section
        );


        setTimeout(
            () => {

                document
                    .getElementById(
                        'materialManager'
                    )
                    ?.remove();

            },
            900
        );


    } catch (error) {

        console.error(
            'Ошибка загрузки файла:',
            error
        );


        setMaterialManagerStatus(
            'Не удалось загрузить файл: ' +
            (
                error.message ||
                error
            ),
            'error'
        );


    } finally {

        setMaterialManagerBusy(
            false
        );

    }

}


/* =========================================================
   СТАРЫЕ АЛИАСЫ
   ========================================================= */

async function saveMaterialUrl() {

    await savePlatformMaterialUrl();

}


async function uploadMaterialFile() {

    await uploadPlatformMaterialFile();

}


/* =========================================================
   СОВМЕСТИМОСТЬ
   ========================================================= */

function openTest(
    type,
    title
) {

    if (
        window.currentUserIsManager
    ) {

        showMaterialManager(
            'tests',
            type || 'adult',
            title || 'Тест',
            null
        );

        return;

    }


    alert(
        'Раздел тестов будет подключён отдельно.'
    );

}


/* =========================================================
   СОВМЕСТИМОСТЬ СО СТАРЫМ КОДОМ
   ========================================================= */

async function loadMaterials(
    section
) {

    await loadPlatformMaterials(
        section
    );

}


/* =========================================================
   ОТКРЫТИЕ ВНЕШНЕЙ ССЫЛКИ
   ========================================================= */

function openMaterial(
    url,
    title
) {

    const cleanUrl =
        String(
            url || ''
        ).trim();


    if (cleanUrl) {

        window.open(
            cleanUrl,
            '_blank',
            'noopener,noreferrer'
        );

        return;

    }


    if (title) {

        alert(
            title +
            '\n\nСсылка на материал пока не добавлена.'
        );

    }

}


/* =========================================================
   ГЛОБАЛЬНЫЕ ФУНКЦИИ
   ========================================================= */

window.loadManuals =
    loadManuals;


window.loadVideos =
    loadVideos;


window.loadMaterials =
    loadMaterials;


window.openPlatformMaterial =
    openPlatformMaterial;


window.showMaterialManager =
    showMaterialManager;


window.savePlatformMaterialUrl =
    savePlatformMaterialUrl;


window.uploadPlatformMaterialFile =
    uploadPlatformMaterialFile;


window.saveMaterialUrl =
    saveMaterialUrl;


window.uploadMaterialFile =
    uploadMaterialFile;


window.openMaterial =
    openMaterial;


window.openTest =
    openTest;


/* =========================================================
   ГОТОВО
   ========================================================= */

console.log(
    'manuals.js: методические пособия и видео подключены.'
);
