/* =========================================================
   MANUALS.JS
   МЕТОДИЧЕСКИЕ ПОСОБИЯ

   Логика:
   1. В разделе "Методические пособия" показываются направления.
   2. При выборе направления открывается полноценная страница.
   3. "Добро пожаловать..." внутри направления скрывается.
   4. Нет всплывающего окна.
   5. Нет вкладок "Методическое пособие / Видео / Ссылки".
   6. В методичках только:
      - загрузить файл
      - добавить внешнюю ссылку
   7. Файл → кнопка "Скачать".
   8. Внешняя ссылка → кнопка "Перейти".
   9. Все материалы сохраняются и отображаются списком.
   10. CSS полностью изолирован от калькуляторов и тестов.
   ========================================================= */


/* =========================================================
   НАСТРОЙКИ
   ========================================================= */

const MANUALS_TABLE = 'platform_materials';
const MANUALS_BUCKET = 'methodicals';


const MANUALS_DIRECTIONS = [
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


/* =========================================================
   ЭКРАНИРОВАНИЕ
   ========================================================= */

function manualsEscape(value) {

    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

}


/* =========================================================
   ОПРЕДЕЛЕНИЕ НАПРАВЛЕНИЯ
   ========================================================= */

function manualsDetectDirection(value) {

    const text =
        String(value || '')
            .toLowerCase();

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


/* =========================================================
   ИКОНКА ПИФАГОРА
   ========================================================= */

function manualsPythagorasIcon() {

    return `
        <div class="manuals-pythagoras-icon">
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
   ИКОНКА НАПРАВЛЕНИЯ
   ========================================================= */

function manualsDirectionIcon(item) {

    if (item.key === 'pythagoras') {

        return manualsPythagorasIcon();

    }

    return `
        <div class="manuals-direction-icon">
            ${item.icon}
        </div>
    `;

}


/* =========================================================
   СТИЛИ
   ВАЖНО:
   НИКАКИХ #contentCards { display:block !important; }
   НИКАКИХ изменений общего .cards.
   ========================================================= */

function injectManualsStyles() {

    if (
        document.getElementById(
            'manualsPageStyles'
        )
    ) {
        return;
    }


    const style =
        document.createElement('style');


    style.id =
        'manualsPageStyles';


    style.textContent = `

        /* =================================================
           СТРАНИЦА МЕТОДИЧЕСКИХ ПОСОБИЙ
           ================================================= */

        .manuals-page {
            width: 100%;
            max-width: none;
            box-sizing: border-box;
        }


        /* =================================================
           СЕТКА НАПРАВЛЕНИЙ

           Только для методичек.
           Не затрагивает калькуляторы и тесты.
           ================================================= */

        .manuals-direction-grid {
            display: grid;
            grid-template-columns:
                repeat(
                    auto-fit,
                    minmax(180px, 1fr)
                );

            gap: 20px;

            width: 100%;
            box-sizing: border-box;

            margin-top: 8px;
        }


        .manuals-direction-card {
            min-width: 0;

            height: 250px;

            box-sizing: border-box;

            display: flex;
            flex-direction: column;

            align-items: center;
            justify-content: center;

            text-align: center;

            padding: 20px;

            border: 1px solid
                rgba(255, 221, 120, .65);

            border-radius: 18px;

            background:
                linear-gradient(
                    145deg,
                    rgba(83, 75, 190, .92),
                    rgba(43, 38, 112, .92)
                );

            cursor: pointer;

            transition:
                transform .2s ease,
                box-shadow .2s ease,
                border-color .2s ease;
        }


        .manuals-direction-card:hover {
            transform: translateY(-3px);

            border-color:
                rgba(255, 225, 125, 1);

            box-shadow:
                0 10px 30px
                rgba(0, 0, 0, .25);
        }


        .manuals-direction-icon {
            display: flex;

            align-items: center;
            justify-content: center;

            width: 70px;
            height: 70px;

            margin-bottom: 14px;

            font-size: 50px;
            line-height: 1;
        }


        .manuals-direction-card h3 {
            margin: 0;

            color: #fff0a0;

            font-family:
                Georgia,
                'Times New Roman',
                serif;

            font-size: 22px;
            line-height: 1.15;
        }


        .manuals-direction-card p {
            margin: 10px 0 0;

            color: white;

            font-size: 15px;
        }


        /* =================================================
           ПИФАГОР
           ================================================= */

        .manuals-pythagoras-icon {

            width: 70px;
            height: 70px;

            display: grid;

            grid-template-columns:
                repeat(3, 1fr);

            grid-template-rows:
                repeat(3, 1fr);

            gap: 3px;

            margin-bottom: 14px;

            padding: 4px;

            box-sizing: border-box;

            border-radius: 10px;

            background:
                rgba(20, 15, 60, .55);

            border:
                1px solid
                rgba(255, 225, 125, .5);

        }


        .manuals-pythagoras-icon span {

            display: flex;

            align-items: center;
            justify-content: center;

            color: #fff0a0;

            font-size: 15px;

            border:
                1px solid
                rgba(255, 225, 125, .3);

            border-radius: 3px;
        }


        /* =================================================
           ВНУТРЕННЯЯ СТРАНИЦА
           ================================================= */

        .manuals-inner-page {

            width: 100%;
            max-width: none;

            box-sizing: border-box;
        }


        .manuals-inner-top {

            display: flex;

            align-items: center;
            justify-content: space-between;

            gap: 20px;

            width: 100%;

            margin-bottom: 8px;
        }


        .manuals-back {

            display: inline-flex;

            align-items: center;

            gap: 7px;

            border: none;

            background: transparent;

            color: #fff0a0;

            font-size: 16px;
            font-weight: 600;

            cursor: pointer;

            padding: 5px 0;
        }


        .manuals-back:hover {
            opacity: .8;
        }


        .manuals-add-button {

            flex-shrink: 0;

            padding: 12px 20px;

            border-radius: 12px;

            border:
                1px solid
                #fff0a0;

            background:
                linear-gradient(
                    135deg,
                    #7044c5,
                    #9259d9
                );

            color: #fff0a0;

            font-size: 15px;
            font-weight: 700;

            cursor: pointer;

            transition:
                transform .15s ease,
                opacity .15s ease;
        }


        .manuals-add-button:hover {
            transform: translateY(-1px);
            opacity: .92;
        }


        .manuals-inner-title {

            margin: 0 0 5px;

            color: #fff0a0;

            font-family:
                Georgia,
                'Times New Roman',
                serif;

            font-size: 34px;
            line-height: 1.15;
        }


        .manuals-all-title {

            margin: 0 0 18px;

            color: white;

            font-size: 17px;
        }


        /* =================================================
           ПАНЕЛЬ ДОБАВЛЕНИЯ

           НЕ popup.
           Она находится прямо на странице.
           ================================================= */

        .manuals-add-panel {

            width: 100%;

            box-sizing: border-box;

            margin-bottom: 22px;

            padding: 24px;

            border-radius: 18px;

            border:
                1px solid
                rgba(255, 225, 125, .55);

            background:
                linear-gradient(
                    145deg,
                    rgba(38, 30, 83, .94),
                    rgba(31, 26, 70, .94)
                );
        }


        .manuals-add-panel-title {

            margin: 0 0 20px;

            color: #fff0a0;

            font-family:
                Georgia,
                'Times New Roman',
                serif;

            font-size: 24px;
        }


        .manuals-add-grid {

            display: grid;

            grid-template-columns:
                minmax(0, 1fr)
                minmax(0, 1fr);

            gap: 22px;

            width: 100%;
        }


        .manuals-add-box {

            min-width: 0;

            box-sizing: border-box;

            padding: 20px;

            border-radius: 14px;

            border:
                1px solid
                rgba(255,255,255,.28);

            background:
                rgba(255,255,255,.045);
        }


        .manuals-add-box-title {

            margin: 0 0 12px;

            color: white;

            font-size: 17px;
            font-weight: 700;
        }


        .manuals-file-input {

            display: block;

            width: 100%;

            box-sizing: border-box;

            padding: 10px;

            border-radius: 10px;

            border:
                1px solid
                rgba(255,255,255,.55);

            background:
                rgba(255,255,255,.08);

            color: white;

            font-size: 14px;
        }


        .manuals-url-input {

            display: block;

            width: 100%;

            box-sizing: border-box;

            padding: 13px 14px;

            border-radius: 10px;

            border:
                1px solid
                rgba(255,255,255,.55);

            background:
                rgba(255,255,255,.08);

            color: white;

            font-size: 15px;

            outline: none;
        }


        .manuals-url-input::placeholder {
            color:
                rgba(255,255,255,.65);
        }


        .manuals-action-button {

            display: inline-flex;

            align-items: center;
            justify-content: center;

            margin-top: 13px;

            padding: 11px 18px;

            border-radius: 10px;

            border:
                1px solid
                #fff0a0;

            background:
                #7044c5;

            color: #fff0a0;

            font-size: 15px;
            font-weight: 700;

            cursor: pointer;
        }


        .manuals-action-button:hover {
            opacity: .9;
        }


        .manuals-action-button:disabled {
            opacity: .5;
            cursor: wait;
        }


        .manuals-add-note {

            margin-top: 18px;

            color:
                rgba(255,255,255,.72);

            font-size: 13px;

            line-height: 1.45;
        }


        .manuals-status {

            min-height: 22px;

            margin-top: 16px;

            font-size: 14px;

            line-height: 1.45;
        }


        .manuals-status.ok {
            color: #b9f6ca;
        }


        .manuals-status.error {
            color: #ffb4b4;
        }


        /* =================================================
           СПИСОК МАТЕРИАЛОВ
           ================================================= */

        .manuals-material-list {

            display: flex;

            flex-direction: column;

            gap: 12px;

            width: 100%;
        }


        .manuals-material-item {

            width: 100%;

            min-width: 0;

            box-sizing: border-box;

            display: flex;

            align-items: center;

            gap: 16px;

            padding: 17px 20px;

            border-radius: 14px;

            border:
                1px solid
                rgba(255, 255, 255, .20);

            background:
                rgba(255,255,255,.045);
        }


        .manuals-material-icon {

            flex: 0 0 48px;

            width: 48px;
            height: 48px;

            display: flex;

            align-items: center;
            justify-content: center;

            border-radius: 10px;

            font-size: 25px;

            background:
                rgba(112,68,197,.65);

            border:
                1px solid
                rgba(255,225,125,.35);
        }


        .manuals-material-info {

            flex: 1 1 auto;

            min-width: 0;
        }


        .manuals-material-name {

            margin: 0;

            color: white;

            font-size: 17px;
            font-weight: 700;

            overflow-wrap: anywhere;
        }


        .manuals-material-type {

            margin-top: 5px;

            color:
                rgba(255,255,255,.65);

            font-size: 13px;

            overflow-wrap: anywhere;
        }


        .manuals-material-action {

            flex: 0 0 auto;

            padding: 10px 18px;

            border-radius: 10px;

            border:
                1px solid
                #fff0a0;

            background:
                #7044c5;

            color: #fff0a0;

            font-size: 14px;
            font-weight: 700;

            cursor: pointer;

            white-space: nowrap;
        }


        .manuals-material-action:hover {
            opacity: .9;
        }


        /* =================================================
           ПУСТОЙ СПИСОК
           ================================================= */

        .manuals-empty {

            width: 100%;

            box-sizing: border-box;

            padding: 45px 25px;

            border-radius: 15px;

            border:
                1px dashed
                rgba(255,255,255,.30);

            text-align: center;

            color:
                rgba(255,255,255,.75);

            font-size: 16px;
        }


        /* =================================================
           АДАПТАЦИЯ
           ================================================= */

        @media (max-width: 850px) {

            .manuals-add-grid {
                grid-template-columns: 1fr;
            }

            .manuals-inner-top {
                align-items: flex-start;
            }

            .manuals-inner-title {
                font-size: 29px;
            }

        }


        @media (max-width: 600px) {

            .manuals-direction-grid {
                grid-template-columns:
                    repeat(2, minmax(0, 1fr));
            }

            .manuals-direction-card {
                height: 220px;
                padding: 14px;
            }

            .manuals-direction-card h3 {
                font-size: 18px;
            }

            .manuals-material-item {
                flex-wrap: wrap;
            }

            .manuals-material-info {
                flex-basis: calc(100% - 70px);
            }

            .manuals-material-action {
                margin-left: 64px;
            }

        }


        @media (max-width: 430px) {

            .manuals-direction-grid {
                grid-template-columns: 1fr;
            }

            .manuals-inner-top {
                flex-direction: column;
            }

            .manuals-add-button {
                align-self: flex-end;
            }

        }

    `;


    document.head.appendChild(style);

}


/* =========================================================
   СЕССИЯ
   ========================================================= */

async function manualsGetSession() {

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

        console.error(error);

        return null;
    }

}


/* =========================================================
   ПРОВЕРКА АДМИНИСТРАТОРА
   ========================================================= */

async function manualsIsManager() {

    if (
        window.currentUserIsManager === true
    ) {
        return true;
    }


    const session =
        await manualsGetSession();


    if (!session?.user) {
        return false;
    }


    const email =
        String(
            session.user.email || ''
        )
            .trim()
            .toLowerCase();


    if (
        email ===
        'centernumero@gmail.com'
    ) {

        window.currentUserIsManager = true;

        return true;
    }


    return false;

}


/* =========================================================
   ПОЛУЧИТЬ ВСЕ МАТЕРИАЛЫ РАЗДЕЛА
   ========================================================= */

async function getAllManualMaterials() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from(MANUALS_TABLE)
                .select(
                    'id, section, direction, material_type, url, file_path, created_by, created_at'
                )
                .eq(
                    'section',
                    'manuals'
                )
                .order(
                    'created_at',
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                'Ошибка получения материалов:',
                error
            );

            return [];

        }


        return Array.isArray(data)
            ? data
            : [];

    } catch (error) {

        console.error(error);

        return [];

    }

}


/* =========================================================
   МАТЕРИАЛЫ КОНКРЕТНОГО НАПРАВЛЕНИЯ
   ========================================================= */

async function getManualMaterialsForDirection(
    direction
) {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from(MANUALS_TABLE)
                .select(
                    'id, section, direction, material_type, url, file_path, created_by, created_at'
                )
                .eq(
                    'section',
                    'manuals'
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

            console.error(
                'Ошибка получения материалов направления:',
                error
            );

            return [];

        }


        return Array.isArray(data)
            ? data
            : [];

    } catch (error) {

        console.error(error);

        return [];

    }

}


/* =========================================================
   НАЙТИ НАЗВАНИЕ НАПРАВЛЕНИЯ
   ========================================================= */

function manualsGetDirectionTitle(
    direction
) {

    const item =
        MANUALS_DIRECTIONS.find(
            x => x.key === direction
        );


    return item
        ? item.title
        : 'Методическое пособие';

}


/* =========================================================
   ПОКАЗ / СКРЫТИЕ WELCOME
   ========================================================= */

function manualsHideWelcome() {

    const welcome =
        document.querySelector(
            '.welcome'
        );


    if (welcome) {

        welcome.dataset.manualsHidden =
            'true';

        welcome.style.display =
            'none';
    }

}


function manualsShowWelcome() {

    const welcome =
        document.querySelector(
            '.welcome'
        );


    if (welcome) {

        welcome.style.display =
            '';

        delete welcome.dataset.manualsHidden;
    }

}


/* =========================================================
   РЕНДЕР РАЗДЕЛА
   ========================================================= */

async function loadManuals() {

    injectManualsStyles();

    manualsShowWelcome();


    const contentCards =
        document.getElementById(
            'contentCards'
        );


    if (!contentCards) {
        return;
    }


    contentCards.innerHTML = `
        <div class="manuals-page">

            <div class="manuals-direction-grid">

                ${MANUALS_DIRECTIONS.map(
                    item => `

                    <div
                        class="manuals-direction-card"
                        data-manual-direction="${item.key}"
                        role="button"
                        tabindex="0"
                    >

                        ${manualsDirectionIcon(item)}

                        <h3>
                            ${manualsEscape(item.title)}
                        </h3>

                        <p>
                            Методическое пособие
                        </p>

                    </div>

                `
                ).join('')}

            </div>

        </div>
    `;


    const cards =
        contentCards.querySelectorAll(
            '[data-manual-direction]'
        );


    cards.forEach(card => {

        const direction =
            card.dataset.manualDirection;


        card.addEventListener(
            'click',
            () => {

                openManualDirection(
                    direction
                );

            }
        );


        card.addEventListener(
            'keydown',
            event => {

                if (
                    event.key === 'Enter' ||
                    event.key === ' '
                ) {

                    event.preventDefault();

                    openManualDirection(
                        direction
                    );

                }

            }
        );

    });

}


/* =========================================================
   ОТКРЫТЬ КОНКРЕТНОЕ НАПРАВЛЕНИЕ
   ========================================================= */

async function openManualDirection(
    direction
) {

    injectManualsStyles();

    manualsHideWelcome();


    const contentCards =
        document.getElementById(
            'contentCards'
        );


    if (!contentCards) {
        return;
    }


    const title =
        manualsGetDirectionTitle(
            direction
        );


    contentCards.innerHTML = `

        <div class="manuals-inner-page">

            <div class="manuals-inner-top">

                <button
                    type="button"
                    class="manuals-back"
                    id="manualsBackButton"
                >
                    ← Назад
                </button>

                <button
                    type="button"
                    class="manuals-add-button"
                    id="manualsAddButton"
                >
                    + Добавить материал
                </button>

            </div>


            <h2 class="manuals-inner-title">
                ${manualsEscape(title)}
            </h2>


            <div class="manuals-all-title">
                Все материалы
            </div>


            <div
                id="manualsAddPanel"
                class="manuals-add-panel"
                style="display:none;"
            >

                <h3 class="manuals-add-panel-title">
                    Добавить материал
                </h3>


                <div class="manuals-add-grid">


                    <!-- ФАЙЛ -->

                    <div class="manuals-add-box">

                        <div class="manuals-add-box-title">
                            Загрузить файл
                        </div>


                        <input
                            id="manualsFileInput"
                            class="manuals-file-input"
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        >


                        <button
                            type="button"
                            class="manuals-action-button"
                            id="manualsUploadButton"
                        >
                            Загрузить файл
                        </button>

                    </div>


                    <!-- ССЫЛКА -->

                    <div class="manuals-add-box">

                        <div class="manuals-add-box-title">
                            Добавить ссылку
                        </div>


                        <input
                            id="manualsUrlInput"
                            class="manuals-url-input"
                            type="url"
                            placeholder="https://..."
                        >


                        <button
                            type="button"
                            class="manuals-action-button"
                            id="manualsSaveLinkButton"
                        >
                            Сохранить ссылку
                        </button>

                    </div>

                </div>


                <div class="manuals-add-note">
                    Можно добавить ссылку на Google Диск,
                    Яндекс Диск, Mail.ru или другой облачный сервис,
                    либо загрузить файл непосредственно в платформу.
                </div>


                <div
                    id="manualsStatus"
                    class="manuals-status"
                ></div>

            </div>


            <div
                id="manualsMaterialList"
                class="manuals-material-list"
            >
                <div class="manuals-empty">
                    Загрузка материалов...
                </div>
            </div>

        </div>
    `;


    document
        .getElementById(
            'manualsBackButton'
        )
        ?.addEventListener(
            'click',
            () => {

                loadManuals();

            }
        );


    document
        .getElementById(
            'manualsAddButton'
        )
        ?.addEventListener(
            'click',
            () => {

                const panel =
                    document.getElementById(
                        'manualsAddPanel'
                    );


                if (!panel) {
                    return;
                }


                if (
                    panel.style.display ===
                    'none'
                ) {

                    panel.style.display =
                        'block';

                } else {

                    panel.style.display =
                        'none';

                }

            }
        );


    document
        .getElementById(
            'manualsUploadButton'
        )
        ?.addEventListener(
            'click',
            () => {

                uploadManualFile(
                    direction
                );

            }
        );


    document
        .getElementById(
            'manualsSaveLinkButton'
        )
        ?.addEventListener(
            'click',
            () => {

                saveManualExternalLink(
                    direction
                );

            }
        );


    await renderManualMaterials(
        direction
    );

}


/* =========================================================
   СТАТУС
   ========================================================= */

function setManualsStatus(
    text,
    type = ''
) {

    const node =
        document.getElementById(
            'manualsStatus'
        );


    if (!node) {
        return;
    }


    node.className =
        'manuals-status ' +
        type;


    node.textContent =
        text || '';

}


/* =========================================================
   РЕНДЕР СПИСКА МАТЕРИАЛОВ
   ========================================================= */

async function renderManualMaterials(
    direction
) {

    const list =
        document.getElementById(
            'manualsMaterialList'
        );


    if (!list) {
        return;
    }


    list.innerHTML = `
        <div class="manuals-empty">
            Загрузка материалов...
        </div>
    `;


    const materials =
        await getManualMaterialsForDirection(
            direction
        );


    if (!materials.length) {

        list.innerHTML = `
            <div class="manuals-empty">
                Материалов пока нет.
            </div>
        `;

        return;

    }


    list.innerHTML =
        materials.map(
            item => {

                const isFile =
                    !!item.file_path;


                const name =
                    isFile
                        ? manualsFileName(
                            item.file_path
                        )
                        : (
                            item.url ||
                            'Внешняя ссылка'
                        );


                const icon =
                    isFile
                        ? '📄'
                        : '🔗';


                const buttonText =
                    isFile
                        ? 'Скачать'
                        : 'Перейти';


                return `

                    <div
                        class="manuals-material-item"
                    >

                        <div
                            class="manuals-material-icon"
                        >
                            ${icon}
                        </div>


                        <div
                            class="manuals-material-info"
                        >

                            <div
                                class="manuals-material-name"
                            >
                                ${manualsEscape(name)}
                            </div>


                            <div
                                class="manuals-material-type"
                            >
                                ${
                                    isFile
                                        ? 'Файл'
                                        : 'Внешняя ссылка'
                                }
                            </div>

                        </div>


                        <button
                            type="button"
                            class="manuals-material-action"
                            data-material-id="${manualsEscape(item.id)}"
                        >
                            ${buttonText}
                        </button>

                    </div>

                `;

            }
        ).join('');


    list
        .querySelectorAll(
            '[data-material-id]'
        )
        .forEach(
            button => {

                const id =
                    button.dataset.materialId;


                button.addEventListener(
                    'click',
                    async () => {

                        const item =
                            materials.find(
                                x =>
                                    String(x.id) ===
                                    String(id)
                            );


                        if (!item) {
                            return;
                        }


                        await openManualMaterial(
                            item
                        );

                    }
                );

            }
        );

}


/* =========================================================
   ИМЯ ФАЙЛА
   ========================================================= */

function manualsFileName(
    path
) {

    const value =
        String(path || '');


    const parts =
        value.split('/');


    return (
        parts[parts.length - 1] ||
        'Файл'
    );

}


/* =========================================================
   СОХРАНИТЬ ВНЕШНЮЮ ССЫЛКУ
   ========================================================= */

async function saveManualExternalLink(
    direction
) {

    const manager =
        await manualsIsManager();


    if (!manager) {

        setManualsStatus(
            'Нет прав для добавления материала.',
            'error'
        );

        return;

    }


    const input =
        document.getElementById(
            'manualsUrlInput'
        );


    const url =
        input?.value.trim() || '';


    if (!url) {

        setManualsStatus(
            'Вставьте ссылку.',
            'error'
        );

        return;

    }


    try {

        const parsed =
            new URL(url);


        if (
            parsed.protocol !== 'http:' &&
            parsed.protocol !== 'https:'
        ) {

            throw new Error();

        }

    } catch {

        setManualsStatus(
            'Введите корректную ссылку https:// или http://',
            'error'
        );

        return;

    }


    const button =
        document.getElementById(
            'manualsSaveLinkButton'
        );


    if (button) {
        button.disabled = true;
    }


    setManualsStatus(
        'Сохраняю ссылку...',
        ''
    );


    try {

        const session =
            await manualsGetSession();


        if (!session) {

            throw new Error(
                'Сессия пользователя не найдена.'
            );

        }


        const {
            error
        } =
            await supabaseClient
                .from(MANUALS_TABLE)
                .insert({

                    section:
                        'manuals',

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


        if (input) {
            input.value = '';
        }


        setManualsStatus(
            'Ссылка сохранена.',
            'ok'
        );


        await renderManualMaterials(
            direction
        );


    } catch (error) {

        console.error(
            'Ошибка сохранения ссылки:',
            error
        );


        setManualsStatus(
            'Не удалось сохранить ссылку: ' +
            (
                error.message ||
                'ошибка базы данных'
            ),
            'error'
        );

    } finally {

        if (button) {
            button.disabled = false;
        }

    }

}


/* =========================================================
   БЕЗОПАСНОЕ ИМЯ ФАЙЛА
   ========================================================= */

function manualsSafeFileName(
    name
) {

    return String(
        name || 'file'
    )

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

}


/* =========================================================
   ЗАГРУЗИТЬ ФАЙЛ
   ========================================================= */

async function uploadManualFile(
    direction
) {

    const manager =
        await manualsIsManager();


    if (!manager) {

        setManualsStatus(
            'Нет прав для добавления материала.',
            'error'
        );

        return;

    }


    const input =
        document.getElementById(
            'manualsFileInput'
        );


    const file =
        input?.files?.[0];


    if (!file) {

        setManualsStatus(
            'Сначала выберите файл.',
            'error'
        );

        return;

    }


    const extension =
        String(
            file.name
                .split('.')
                .pop() || ''
        )
            .toLowerCase();


    if (
        ![
            'pdf',
            'doc',
            'docx'
        ].includes(extension)
    ) {

        setManualsStatus(
            'Можно загрузить только PDF, DOC или DOCX.',
            'error'
        );

        return;

    }


    const button =
        document.getElementById(
            'manualsUploadButton'
        );


    if (button) {
        button.disabled = true;
    }


    setManualsStatus(
        'Загружаю файл...',
        ''
    );


    try {

        const session =
            await manualsGetSession();


        if (!session) {

            throw new Error(
                'Сессия пользователя не найдена.'
            );

        }


        const safeName =
            manualsSafeFileName(
                file.name
            );


        const unique =
            (
                window.crypto &&
                typeof crypto.randomUUID ===
                    'function'
            )

                ? crypto.randomUUID()

                : (
                    Date.now() +
                    '_' +
                    Math.random()
                        .toString(36)
                        .slice(2)
                );


        const path =
            `manuals/${direction}/${unique}_${safeName}`;


        const {
            error: uploadError
        } =
            await supabaseClient
                .storage
                .from(MANUALS_BUCKET)
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


        setManualsStatus(
            'Файл загружен. Сохраняю запись...',
            ''
        );


        const {
            error: insertError
        } =
            await supabaseClient
                .from(MANUALS_TABLE)
                .insert({

                    section:
                        'manuals',

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
                .from(MANUALS_BUCKET)
                .remove([
                    path
                ]);


            throw insertError;

        }


        if (input) {
            input.value = '';
        }


        setManualsStatus(
            'Файл успешно сохранён.',
            'ok'
        );


        await renderManualMaterials(
            direction
        );


    } catch (error) {

        console.error(
            'Ошибка загрузки файла:',
            error
        );


        setManualsStatus(
            'Не удалось загрузить файл: ' +
            (
                error.message ||
                'ошибка Storage'
            ),
            'error'
        );


    } finally {

        if (button) {
            button.disabled = false;
        }

    }

}


/* =========================================================
   ОТКРЫТЬ / СКАЧАТЬ МАТЕРИАЛ
   ========================================================= */

async function openManualMaterial(
    item
) {

    if (!item) {
        return;
    }


    /* -----------------------------------------
       ВНЕШНЯЯ ССЫЛКА
       ----------------------------------------- */

    if (item.url) {

        window.open(
            item.url,
            '_blank',
            'noopener,noreferrer'
        );

        return;
    }


    /* -----------------------------------------
       ФАЙЛ
       ----------------------------------------- */

    if (item.file_path) {

        try {

            const {
                data,
                error
            } =
                await supabaseClient
                    .storage
                    .from(MANUALS_BUCKET)
                    .createSignedUrl(
                        item.file_path,
                        3600
                    );


            if (error) {
                throw error;
            }


            if (!data?.signedUrl) {

                throw new Error(
                    'Не удалось получить ссылку на файл.'
                );

            }


            /*
             * Открываем signed URL с параметром download.
             * Браузер предложит скачать файл.
             */

            const separator =
                data.signedUrl.includes('?')
                    ? '&'
                    : '?';


            const fileName =
                manualsFileName(
                    item.file_path
                );


            const downloadUrl =
                data.signedUrl +
                separator +
                'download=' +
                encodeURIComponent(
                    fileName
                );


            window.open(
                downloadUrl,
                '_blank',
                'noopener,noreferrer'
            );


        } catch (error) {

            console.error(
                'Ошибка скачивания файла:',
                error
            );


            alert(
                'Не удалось скачать файл.\n\n' +
                (
                    error.message ||
                    'Ошибка Storage'
                )
            );

        }


        return;
    }


    alert(
        'Материал не найден.'
    );

}


/* =========================================================
   СОВМЕСТИМОСТЬ СО СТАРЫМИ ВЫЗОВАМИ
   ========================================================= */

window.loadManuals =
    loadManuals;


window.openManualDirection =
    openManualDirection;


window.openManualMaterial =
    openManualMaterial;


window.saveManualExternalLink =
    saveManualExternalLink;


window.uploadManualFile =
    uploadManualFile;


window.manualsDetectDirection =
    manualsDetectDirection;


/* =========================================================
   АВТОЗАПУСК СТИЛЕЙ
   ========================================================= */

document.addEventListener(
    'DOMContentLoaded',
    () => {

        injectManualsStyles();

    }
);
