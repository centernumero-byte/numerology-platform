/* =========================================================
   manuals.js
   МЕТОДИЧЕСКИЕ ПОСОБИЯ + ВИДЕО
   ========================================================= */

const PLATFORM_MATERIALS_TABLE = 'platform_materials';
const PLATFORM_STORAGE_BUCKET = 'methodicals';


/* =========================================================
   КАРТОЧКИ
   ========================================================= */

const PLATFORM_DIRECTIONS = [
    {
        key: 'adult',
        icon: '✦',
        title: 'Взрослая<br>матрица'
    },
    {
        key: 'child',
        icon: '👶',
        title: 'Детская<br>матрица'
    },
    {
        key: 'compatibility',
        icon: '💕',
        title: 'Матрица<br>совместимости'
    },
    {
        key: 'vedic',
        icon: 'ॐ',
        title: 'Ведическая<br>нумерология'
    },
    {
        key: 'pythagoras',
        icon: 'pythagoras',
        title: 'Нумерология<br>по Пифагору'
    }
];


const PLATFORM_NAMES = Object.fromEntries(
    PLATFORM_DIRECTIONS.map(item => [
        item.key,
        item.title.replace(/<br>/g, ' ')
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
   СТИЛИ ДЛЯ АДМИНИСТРАТОРА
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

            color:
                #f8e7a8;

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
        }


        .material-manager-close {

            float: right;

            background: none;
            border: none;

            color:
                #f6d66c;

            font-size:
                30px;

            line-height:
                1;

            cursor:
                pointer;
        }


        .material-manager-label {

            display: block;

            margin:
                16px 0 8px;

            color:
                #eee5d0;
        }


        .material-manager-input {

            width:
                100%;

            box-sizing:
                border-box;

            padding:
                13px;

            border-radius:
                10px;

            border:
                1px solid #d7aa31;

            background:
                #17112f;

            color:
                white;

            outline:
                none;
        }


        .material-manager-input::placeholder {

            color:
                #aaa1b4;
        }


        .material-manager-button {

            margin-top:
                12px;

            padding:
                12px 22px;

            border-radius:
                10px;

            border:
                1px solid #d7aa31;

            background:
                #6b3b8f;

            color:
                #f8e7a8;

            cursor:
                pointer;

            font-size:
                16px;
        }


        .material-manager-button:disabled {

            opacity:
                .55;

            cursor:
                wait;
        }


        .material-manager-or {

            margin:
                22px 0 4px;

            text-align:
                center;

            color:
                #cfc4b0;
        }


        .material-manager-status {

            margin-top:
                18px;

            line-height:
                1.45;
        }


        .material-manager-status.ok {

            color:
                #a9e4b4;
        }


        .material-manager-status.error {

            color:
                #ffb0b0;
        }


        .material-manager-current {

            margin:
                15px 0;

            padding:
                12px;

            border-radius:
                10px;

            background:
                rgba(255,255,255,.05);

            border:
                1px solid
                rgba(215,170,49,.35);

            color:
                #eee5d0;
        }


        .material-manager-hint {

            margin-top:
                8px;

            color:
                #bdb3c5;

            font-size:
                13px;

            line-height:
                1.4;
        }

    `;


    document.head.appendChild(style);

}


/* =========================================================
   СЕССИЯ
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
                'id, section, direction, material_type, url, file_path, created_by, created_at'
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
                    ascending:
                        false
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


    /*
       ВАЖНО:
       Здесь НЕТ заголовка
       «Методические пособия»
       или «Видео».

       Показываются сразу карточки.
    */

    const subtitle =
        section === 'videos'
            ? 'Видео'
            : 'Методическое<br>пособие';


    contentCards.innerHTML = `

        <div class="cards">

            ${
                PLATFORM_DIRECTIONS
                    .map(
                        function(item) {

                            const icon =
                                item.key ===
                                'pythagoras'

                                    ? pythagorasIconHtml()

                                    : `
                                        <div class="card-icon">
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
                                            ${item.title}
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
                    'id, section, direction, material_type, url, file_path, created_at'
                )
                .eq(
                    'section',
                    section
                )
                .order(
                    'created_at',
                    {
                        ascending:
                            false
                    }
                );


        if (error) {
            throw error;
        }


        const latestByDirection = {};


        (data || []).forEach(
            function(item) {

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
            function([
                direction,
                item
            ]) {

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
            'Ошибка загрузки материалов:',
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
        ] ||
        'Материал';


    try {

        const material =
            await getCurrentMaterial(
                section,
                direction
            );


        if (!material) {

            if (
                window.currentUserIsManager
            ) {

                showMaterialManager(
                    section,
                    direction,
                    title
                );

            } else {

                alert(
                    `${title}\n\nМатериал пока не добавлен.`
                );

            }

            return;

        }


        if (material.url) {

            window.open(
                material.url,
                '_blank',
                'noopener,noreferrer'
            );

            return;

        }


        if (material.file_path) {

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


        if (
            window.currentUserIsManager
        ) {

            showMaterialManager(
                section,
                direction,
                title
            );

        } else {

            alert(
                `${title}\n\nМатериал пока не добавлен.`
            );

        }


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
   ОКНО АДМИНИСТРАТОРА
   ========================================================= */

function showMaterialManager(
    section,
    direction,
    title
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
        title
    };


    const isVideo =
        section === 'videos';


    const accept =
        isVideo
            ? 'video/*,.mp4,.webm,.mov,.m4v'
            : '.pdf,.doc,.docx';


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
                    ${platformEscape(title)}
                </h2>


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

                    class="material-manager-button"

                    onclick="
                        savePlatformMaterialUrl()
                    "
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

                    class="material-manager-button"

                    onclick="
                        uploadPlatformMaterialFile()
                    "
                >
                    📁 Загрузить файл
                </button>


                <div
                    class="material-manager-hint"
                >
                    ${
                        isVideo

                            ? 'Для видео можно указать ссылку или загрузить видеофайл.'

                            : 'Для пособия можно указать ссылку на документ или загрузить PDF/DOC/DOCX.'
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

}


/* =========================================================
   СТАТУС
   ========================================================= */

function setMaterialManagerStatus(
    text,
    type
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
        (
            type || ''
        );


    box.textContent =
        text || '';

}


function setMaterialManagerBusy(
    busy
) {

    const a =
        document.getElementById(
            'saveMaterialUrlButton'
        );


    const b =
        document.getElementById(
            'uploadMaterialFileButton'
        );


    if (a) {
        a.disabled = busy;
    }


    if (b) {
        b.disabled = busy;
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


    try {

        new URL(url);

    } catch (_) {

        setMaterialManagerStatus(
            'Введите корректную ссылку.',
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


        setMaterialManagerStatus(
            'Ссылка сохранена.',
            'ok'
        );


        await loadPlatformMaterials(
            section
        );


        setTimeout(
            function() {

                document
                    .getElementById(
                        'materialManager'
                    )
                    ?.remove();

            },
            700
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


    const maxSize =
        section === 'videos'

            ? 500 * 1024 * 1024

            : 100 * 1024 * 1024;


    if (
        file.size > maxSize
    ) {

        setMaterialManagerStatus(

            section === 'videos'

                ? 'Видео слишком большое. Максимальный размер — 500 МБ.'

                : 'Файл слишком большой. Максимальный размер — 100 МБ.',

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
                            false
                    }
                );


        if (uploadError) {
            throw uploadError;
        }


        setMaterialManagerStatus(
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


        setMaterialManagerStatus(
            'Файл успешно сохранён.',
            'ok'
        );


        await loadPlatformMaterials(
            section
        );


        setTimeout(
            function() {

                document
                    .getElementById(
                        'materialManager'
                    )
                    ?.remove();

            },
            700
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


async function uploadMaterialFile(
    file
) {

    await uploadPlatformMaterialFile();

}


function openTest(
    type,
    title
) {

    if (
        typeof showMaterialManager ===
        'function' &&
        window.currentUserIsManager
    ) {

        showMaterialManager(
            'tests',
            type || 'adult',
            title || 'Тест'
        );

    } else {

        alert(
            'Раздел тестов будет подключён отдельно.'
        );

    }

}


async function loadMaterials(
    section
) {

    await loadPlatformMaterials(
        section
    );

}


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
