// =========================================================
// MAIN.JS
// Авторизация, Supabase, проверка доступа,
// навигация, мои расчёты, доступы, статистика
// =========================================================


// =========================================================
// SUPABASE
// =========================================================

const SUPABASE_URL =
    "https://skvprhqsxnlacshucncq.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_N0pKMmzNOonoInimmkding_GJnMwsRd";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// =========================================================
// ГЛОБАЛЬНЫЕ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ
// =========================================================

window.currentUserRole = null;
window.currentUserIsManager = false;
window.currentUserHasAccess = false;


// =========================================================
// БЕЗДЕЙСТВИЕ — АВТОМАТИЧЕСКИЙ ВЫХОД ЧЕРЕЗ 1 ЧАС
// =========================================================

const INACTIVITY_LIMIT =
    60 * 60 * 1000;

const LAST_ACTIVITY_KEY =
    "numerology_last_activity";

let inactivityTimer = null;


function updateLastActivity() {

    localStorage.setItem(
        LAST_ACTIVITY_KEY,
        Date.now().toString()
    );

    clearTimeout(inactivityTimer);

    inactivityTimer = setTimeout(
        autoLogoutAfterInactivity,
        INACTIVITY_LIMIT
    );
}


async function autoLogoutAfterInactivity() {

    const lastActivity =
        Number(
            localStorage.getItem(
                LAST_ACTIVITY_KEY
            ) || 0
        );

    const inactiveTime =
        Date.now() - lastActivity;


    if (
        inactiveTime >=
        INACTIVITY_LIMIT
    ) {

        localStorage.removeItem(
            LAST_ACTIVITY_KEY
        );

        await supabaseClient.auth.signOut();

        showLogin();

        return;
    }


    clearTimeout(
        inactivityTimer
    );

    inactivityTimer = setTimeout(
        autoLogoutAfterInactivity,
        INACTIVITY_LIMIT - inactiveTime
    );
}


function startInactivityTimer() {

    const lastActivity =
        Number(
            localStorage.getItem(
                LAST_ACTIVITY_KEY
            ) || 0
        );


    if (
        lastActivity &&
        Date.now() - lastActivity >=
        INACTIVITY_LIMIT
    ) {

        autoLogoutAfterInactivity();

        return;
    }


    updateLastActivity();
}


// Отслеживание активности
[
    "click",
    "keydown",
    "mousemove",
    "scroll",
    "touchstart"
].forEach(function(eventName) {

    document.addEventListener(
        eventName,
        function() {
            updateLastActivity();
        },
        { passive: true }
    );

});


// Проверка при возвращении на вкладку
document.addEventListener(
    "visibilitychange",
    function() {

        if (!document.hidden) {

            autoLogoutAfterInactivity();

        }

    }
);


// =========================================================
// НАВИГАЦИЯ
// =========================================================

function setActiveSection(section) {

    document
        .querySelectorAll(
            ".nav-item[data-section]"
        )
        .forEach(function(btn) {

            btn.classList.toggle(
                "active",
                btn.dataset.section === section
            );

        });

}


// =========================================================
// КАРТОЧКИ НАПРАВЛЕНИЙ
// =========================================================

const METHOD_CARDS = [

    {
        key: "adult",
        title: "Взрослая<br>матрица",
        icon: "✦",
        description:
            "Полный расчёт<br>по дате рождения"
    },

    {
        key: "child",
        title: "Детская<br>матрица",
        icon: "👶",
        description:
            "Анализ и расчёт<br>детской матрицы"
    },

    {
        key: "compatibility",
        title: "Матрица<br>совместимости",
        icon: "💕",
        description:
            "Анализ отношений<br>двух людей"
    },

    {
        key: "vedic",
        title: "Ведическая<br>нумерология",
        icon: "ॐ",
        description:
            "Расчёт по ведической<br>системе"
    },

    {
        key: "pythagoras",
        title: "Квадрат<br>Пифагора",
        icon: "pythagoras",
        description:
            "Психоматрица<br>по Пифагору"
    }

];


// =========================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// =========================================================

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


function normalizeKey(value) {

    return String(value || "")
        .toLowerCase()
        .trim()
        .replace(/ё/g, "е")
        .replace(/[«»"'`]/g, "")
        .replace(/\s+/g, " ");

}


function findMaterialForMethod(
    materials,
    card
) {

    const aliases = {

        adult: [
            "adult",
            "взрослая",
            "взрослая матрица",
            "adult matrix"
        ],

        child: [
            "child",
            "детская",
            "детская матрица",
            "child matrix"
        ],

        compatibility: [
            "compatibility",
            "совместимость",
            "матрица совместимости"
        ],

        vedic: [
            "vedic",
            "ведическая",
            "ведическая нумерология"
        ],

        pythagoras: [
            "pythagoras",
            "пифагор",
            "квадрат пифагора",
            "психоматрица"
        ]

    };


    const wanted =
        (
            aliases[card.key] ||
            [card.key]
        )
        .map(normalizeKey);


    return (
        materials || []
    ).find(function(item) {

        const fields = [

            item.method,
            item.calculator,
            item.type_key,
            item.slug,
            item.title

        ]
        .filter(Boolean)
        .map(normalizeKey);


        return fields.some(function(field) {

            return wanted.some(function(alias) {

                return (
                    field === alias ||
                    field.includes(alias) ||
                    alias.includes(field)
                );

            });

        });

    }) || null;

}


// =========================================================
// РЕНДЕР КАРТОЧЕК
// =========================================================

function renderMethodCards(options) {

    const {
        section,
        action,
        materials = [],
        emptyText =
            "Материал пока не добавлен."
    } = options;


    return METHOD_CARDS
        .map(function(card) {

            const item =
                findMaterialForMethod(
                    materials,
                    card
                );


            const link =
                item
                    ? (
                        item.external_url ||
                        item.file_url ||
                        ""
                    )
                    : "";


            const icon =
                card.icon === "pythagoras"

                    ? pythagorasIconHtml()

                    : `
                        <div class="card-icon">
                            ${card.icon}
                        </div>
                    `;


            let click = "";


            if (
                action ===
                "calculator"
            ) {

                click =
                    `onclick="openCalculator('${card.key}')"`;

            }

            else if (
                action ===
                "material"
            ) {

                click =
                    `onclick="openMaterial(${JSON.stringify(
                        String(link || "")
                    )}, ${JSON.stringify(
                        card.title
                    )})"`;

            }

            else if (
                action ===
                "video"
            ) {

                click =
                    `onclick="openMaterial(${JSON.stringify(
                        String(link || "")
                    )}, ${JSON.stringify(
                        card.title
                    )})"`;

            }

            else if (
                action ===
                "test"
            ) {

                click =
                    `onclick="openTest('${card.key}', ${JSON.stringify(
                        card.title
                    )})"`;

            }


            let description =
                card.description;


            if (
                item &&
                item.description
            ) {

                description =
                    item.description;

            }

            else if (
                item &&
                item.type
            ) {

                description =
                    item.type;

            }

            else if (
                action ===
                "material"
            ) {

                description =
                    emptyText;

            }

            else if (
                action ===
                "test"
            ) {

                description =
                    "Тесты и практики";

            }


            return `

                <div
                    class="card method-card"
                    ${click}
                    role="button"
                    tabindex="0"
                >

                    ${icon}

                    <div class="card-content">

                        <h3>
                            ${card.title}
                        </h3>

                        <p>
                            ${description}
                        </p>

                    </div>

                </div>

            `;

        })
        .join("");

}


// =========================================================
// КАЛЬКУЛЯТОРЫ
// =========================================================

function renderCalculators() {

    const contentCards =
        document.getElementById(
            "contentCards"
        );

    if (!contentCards) return;


    contentCards.innerHTML =
        renderMethodCards({

            section:
                "calculators",

            action:
                "calculator"

        });

}


// =========================================================
// ТЕСТЫ
// =========================================================

async function renderTests() {

    await loadMaterials(
        "tests",
        "Тесты",
        "test"
    );

}


// =========================================================
// ОТКРЫТИЕ МАТЕРИАЛА
// =========================================================

function openMaterial(
    url,
    title
) {

    const cleanUrl =
        String(url || "").trim();


    if (cleanUrl) {

        window.open(
            cleanUrl,
            "_blank",
            "noopener,noreferrer"
        );

        return;

    }


    showMaterialManager(
        title ||
        "Материал"
    );

}


// =========================================================
// ОКНО ДОБАВЛЕНИЯ МАТЕРИАЛА
// =========================================================

function showMaterialManager(title) {

    const old =
        document.getElementById(
            "materialManager"
        );

    if (old) old.remove();


    const box =
        document.createElement(
            "div"
        );

    box.id =
        "materialManager";


    box.innerHTML = `

        <div class="material-manager-overlay">

            <div class="material-manager">

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
                    ${title}
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
                            this.files[0],
                            '${String(title)
                                .replace(/'/g, "\\'")}'
                        )
                    "
                >


                <div class="material-manager-or">
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
                        saveMaterialUrl(
                            '${String(title)
                                .replace(/'/g, "\\'")}'
                        )
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


// =========================================================
// ТЕСТ
// =========================================================

function openTest(
    type,
    title
) {

    showMaterialManager(
        title ||
        "Тест"
    );

}


// =========================================================
// ПЕРЕКЛЮЧЕНИЕ РАЗДЕЛОВ
// =========================================================

async function showSection(section) {

    const contentCards =
        document.getElementById(
            "contentCards"
        );

    if (!contentCards) return;


    setActiveSection(
        section
    );


    if (
        section ===
        "calculators"
    ) {

        renderCalculators();

        return;

    }


    if (
        section ===
        "manuals"
    ) {

        await loadManuals();

        return;

    }


    if (
        section ===
        "videos"
    ) {

        await loadMaterials(
            "videos",
            "Видео",
            "material"
        );

        return;

    }


    if (
        section ===
        "tests"
    ) {

        await renderTests();

        return;

    }


    if (
        section ===
        "library"
    ) {

        await loadLibrary();

        return;

    }


    if (
        section ===
        "my-calculations"
    ) {

        renderMyCalculations();

        return;

    }


    if (
        section ===
        "access"
    ) {

        await renderAccess();

        return;

    }


    if (
        section ===
        "statistics"
    ) {

        await renderStatistics();

        return;

    }

}


// =========================================================
// ЗАГРУЗКА МАТЕРИАЛОВ ИЗ SUPABASE
// =========================================================

async function loadMaterials(
    section,
    title,
    action
) {

    const contentCards =
        document.getElementById(
            "contentCards"
        );

    if (!contentCards) return;


    const directions = [

        {
            key: "adult",
            icon: "✦",
            title:
                "Взрослая матрица"
        },

        {
            key: "child",
            icon: "👶",
            title:
                "Детская матрица"
        },

        {
            key: "compatibility",
            icon: "💕",
            title:
                "Матрица совместимости"
        },

        {
            key: "vedic",
            icon: "ॐ",
            title:
                "Ведическая нумерология"
        },

        {
            key: "pythagoras",
            icon: "🔢",
            title:
                "Квадрат Пифагора"
        }

    ];


    let subtitle =
        "Материал";


    if (
        section ===
        "manuals"
    ) {

        subtitle =
            "Методическое пособие";

    }


    if (
        section ===
        "videos"
    ) {

        subtitle =
            "Видео";

    }


    if (
        section ===
        "tests"
    ) {

        subtitle =
            "Тесты и практики";

    }


    contentCards.innerHTML = `

        <div class="cards">

            ${
                directions
                    .map(function(item) {

                        let icon =
                            item.icon;


                        if (
                            item.key ===
                            "pythagoras"
                        ) {

                            icon = `

                                <div class="pythagoras-icon">

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


                        return `

                            <div
                                class="card method-card"
                                id="material-${section}-${item.key}"
                                data-section="${section}"
                                data-direction="${item.key}"
                                onclick="
                                    openPlatformMaterial(
                                        '${section}',
                                        '${item.key}'
                                    )
                                "
                            >

                                <div class="card-icon">
                                    ${icon}
                                </div>


                                <div class="card-content">

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
                    .join("")
            }

        </div>

    `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("materials")
                .select("*")
                .eq(
                    "section",
                    section
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "Ошибка загрузки материалов:",
                error
            );

            return;

        }


        if (
            !data ||
            data.length === 0
        ) {

            return;

        }


        data.forEach(
            function(item) {

                const text = (

                    (item.title || "") +
                    " " +
                    (item.name || "") +
                    " " +
                    (item.slug || "") +
                    " " +
                    (item.type_key || "") +
                    " " +
                    (item.method || "")

                ).toLowerCase();


                let direction =
                    null;


                if (
                    text.includes(
                        "взросл"
                    ) ||
                    text.includes(
                        "adult"
                    )
                ) {

                    direction =
                        "adult";

                }

                else if (
                    text.includes(
                        "детск"
                    ) ||
                    text.includes(
                        "child"
                    )
                ) {

                    direction =
                        "child";

                }

                else if (
                    text.includes(
                        "совмест"
                    ) ||
                    text.includes(
                        "compatibility"
                    )
                ) {

                    direction =
                        "compatibility";

                }

                else if (
                    text.includes(
                        "ведичес"
                    ) ||
                    text.includes(
                        "vedic"
                    )
                ) {

                    direction =
                        "vedic";

                }

                else if (
                    text.includes(
                        "пифагор"
                    ) ||
                    text.includes(
                        "pythagoras"
                    )
                ) {

                    direction =
                        "pythagoras";

                }


                if (!direction)
                    return;


                const link =
                    item.external_url ||
                    item.file_url ||
                    "";


                if (!link)
                    return;


                const card =
                    document.getElementById(
                        `material-${section}-${direction}`
                    );


                if (!card)
                    return;


                card.dataset.url =
                    link;

                card.classList.add(
                    "has-material"
                );

            }
        );


    }

    catch (error) {

        console.error(
            "Ошибка загрузки материалов:",
            error
        );

    }

}


// =========================================================
// ОТКРЫТИЕ МАТЕРИАЛА ПЛАТФОРМЫ
// =========================================================

function openPlatformMaterial(
    section,
    direction
) {

    const card =
        document.getElementById(
            `material-${section}-${direction}`
        );

    if (!card) return;


    const link =
        card.dataset.url ||
        "";


    if (link) {

        window.open(
            link,
            "_blank",
            "noopener,noreferrer"
        );

        return;

    }


    const names = {

        adult:
            "Взрослая матрица",

        child:
            "Детская матрица",

        compatibility:
            "Матрица совместимости",

        vedic:
            "Ведическая нумерология",

        pythagoras:
            "Квадрат Пифагора"

    };


    const types = {

        manuals:
            "методическое пособие",

        videos:
            "видео",

        tests:
            "тесты и практики"

    };


    alert(

        names[direction] +
        "\n\n" +
        types[section] +
        "\n\nСсылка пока не добавлена."

    );

}


// =========================================================
// МОИ РАСЧЁТЫ
// =========================================================

function renderMyCalculations() {

    const contentCards =
        document.getElementById(
            "contentCards"
        );

    if (!contentCards) return;


    contentCards.innerHTML = `

        <div class="dashboard-wrap">

            <div class="dashboard-head">

                <div>

                    <h2>
                        Мои расчёты
                    </h2>

                    <p>
                        История ваших расчётов
                        будет отображаться здесь.
                    </p>

                </div>


                <div class="dashboard-badge">
                    Личный кабинет
                </div>

            </div>


            <div class="stats-grid">

                <div class="stat-card">
                    <span>
                        Всего расчётов
                    </span>
                    <strong>0</strong>
                </div>


                <div class="stat-card">
                    <span>
                        За этот месяц
                    </span>
                    <strong>0</strong>
                </div>


                <div class="stat-card">
                    <span>
                        Последний расчёт
                    </span>
                    <strong>—</strong>
                </div>

            </div>


            <div class="table-card">

                <div class="table-title">
                    История расчётов
                </div>

                <div class="empty-table">
                    Пока нет сохранённых расчётов.
                </div>

            </div>

        </div>

    `;

}


// =========================================================
// ДОСТУПЫ
// =========================================================

async function renderAccess() {

    const contentCards =
        document.getElementById(
            "contentCards"
        );

    if (!contentCards) return;


    contentCards.innerHTML = `

        <div class="dashboard-wrap">

            <div class="dashboard-head">

                <div>

                    <h2>
                        Доступы
                    </h2>

                    <p>
                        Текущий доступ пользователя
                        к платформе.
                    </p>

                </div>

            </div>


            <div
                class="table-card"
                id="accessTable"
            >
                Загрузка...
            </div>

        </div>

    `;


    try {

        const {
            data: {
                session
            }
        } =
            await supabaseClient
                .auth
                .getSession();


        if (!session)
            return;


        const {
            data,
            error
        } =
            await supabaseClient
                .from("access_periods")
                .select(
                    "access_kind, status, starts_at, ends_at, is_unlimited, payment_status"
                )
                .eq(
                    "profile_id",
                    session.user.id
                )
                .order(
                    "starts_at",
                    {
                        ascending: false
                    }
                )
                .limit(10);


        if (error)
            throw error;


        const rows =
            (data || [])
                .map(function(item) {

                    const end =
                        item.is_unlimited

                            ? "Без ограничений"

                            : (
                                item.ends_at
                                    ? new Date(
                                        item.ends_at
                                    ).toLocaleDateString(
                                        "ru-RU"
                                    )
                                    : "—"
                            );


                    return `

                        <tr>

                            <td>
                                ${
                                    item.access_kind ||
                                    "Платформа"
                                }
                            </td>

                            <td>
                                ${
                                    item.status ||
                                    "—"
                                }
                            </td>

                            <td>
                                ${
                                    item.payment_status ||
                                    "—"
                                }
                            </td>

                            <td>
                                ${end}
                            </td>

                        </tr>

                    `;

                })
                .join("");


        document.getElementById(
            "accessTable"
        ).innerHTML = rows

            ? `

                <table class="data-table">

                    <thead>

                        <tr>
                            <th>Доступ</th>
                            <th>Статус</th>
                            <th>Оплата</th>
                            <th>До</th>
                        </tr>

                    </thead>

                    <tbody>
                        ${rows}
                    </tbody>

                </table>

            `

            : `

                <div class="empty-table">
                    Доступы пока не найдены.
                </div>

            `;


    }

    catch (error) {

        console.error(
            "Ошибка загрузки доступов:",
            error
        );


        const box =
            document.getElementById(
                "accessTable"
            );


        if (box) {

            box.innerHTML = `

                <div class="empty-table">
                    Не удалось загрузить
                    данные доступа.
                </div>

            `;

        }

    }

}


// =========================================================
// СТАТИСТИКА
// =========================================================

async function renderStatistics() {

    const contentCards =
        document.getElementById(
            "contentCards"
        );

    if (!contentCards) return;


    contentCards.innerHTML = `

        <div class="dashboard-wrap">

            <div class="dashboard-head">

                <div>

                    <h2>
                        Отчёты и статистика
                    </h2>

                    <p>
                        Основные показатели
                        платформы в одном разделе.
                    </p>

                </div>


                <div class="dashboard-badge">
                    Обзор
                </div>

            </div>


            <div
                class="stats-grid"
                id="platformStats"
            >

                <div class="stat-card">
                    <span>Материалы</span>
                    <strong>…</strong>
                </div>

                <div class="stat-card">
                    <span>Пособия</span>
                    <strong>…</strong>
                </div>

                <div class="stat-card">
                    <span>Видео</span>
                    <strong>…</strong>
                </div>

                <div class="stat-card">
                    <span>Тесты</span>
                    <strong>…</strong>
                </div>

            </div>


            <div class="table-card">

                <div class="table-title">
                    Разделы платформы
                </div>


                <table class="data-table">

                    <thead>

                        <tr>

                            <th>
                                Раздел
                            </th>

                            <th>
                                Количество материалов
                            </th>

                            <th>
                                Состояние
                            </th>

                        </tr>

                    </thead>


                    <tbody id="sectionStats">

                        <tr>
                            <td colspan="3">
                                Загрузка...
                            </td>
                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("materials")
                .select("section");


        if (error)
            throw error;


        const counts = {

            manuals: 0,
            videos: 0,
            tests: 0,
            library: 0

        };


        (data || [])
            .forEach(function(item) {

                if (
                    Object.prototype
                        .hasOwnProperty
                        .call(
                            counts,
                            item.section
                        )
                ) {

                    counts[
                        item.section
                    ]++;

                }

            });


        const total =
            Object.values(counts)
                .reduce(
                    function(a, b) {
                        return a + b;
                    },
                    0
                );


        document.getElementById(
            "platformStats"
        ).innerHTML = `

            <div class="stat-card">
                <span>Материалы</span>
                <strong>
                    ${total}
                </strong>
            </div>

            <div class="stat-card">
                <span>Пособия</span>
                <strong>
                    ${counts.manuals}
                </strong>
            </div>

            <div class="stat-card">
                <span>Видео</span>
                <strong>
                    ${counts.videos}
                </strong>
            </div>

            <div class="stat-card">
                <span>Тесты</span>
                <strong>
                    ${counts.tests}
                </strong>
            </div>

        `;


        document.getElementById(
            "sectionStats"
        ).innerHTML = `

            <tr>

                <td>
                    Методические пособия
                </td>

                <td>
                    ${counts.manuals}
                </td>

                <td>
                    ${
                        counts.manuals
                            ? "Есть материалы"
                            : "Пока пусто"
                    }
                </td>

            </tr>


            <tr>

                <td>
                    Видео
                </td>

                <td>
                    ${counts.videos}
                </td>

                <td>
                    ${
                        counts.videos
                            ? "Есть материалы"
                            : "Пока пусто"
                    }
                </td>

            </tr>


            <tr>

                <td>
                    Тесты
                </td>

                <td>
                    ${counts.tests}
                </td>

                <td>
                    ${
                        counts.tests
                            ? "Есть материалы"
                            : "Пока пусто"
                    }
                </td>

            </tr>


            <tr>

                <td>
                    Библиотека
                </td>

                <td>
                    ${counts.library}
                </td>

                <td>
                    ${
                        counts.library
                            ? "Есть материалы"
                            : "Пока пусто"
                    }
                </td>

            </tr>

        `;

    }

    catch (error) {

        console.error(
            "Ошибка статистики:",
            error
        );

    }

}


// =========================================================
// ВЫХОД
// =========================================================

async function logoutUser() {

    try {

        await supabaseClient
            .auth
            .signOut();

    }

    catch (error) {

        console.error(
            "Ошибка выхода:",
            error
        );

    }


    localStorage.removeItem(
        LAST_ACTIVITY_KEY
    );

    clearTimeout(
        inactivityTimer
    );

    showLogin();

}


// =========================================================
// ОТКРЫТИЕ КАЛЬКУЛЯТОРА
// =========================================================

async function openCalculator(type) {

    const {
        data: {
            session
        }
    } =
        await supabaseClient
            .auth
            .getSession();


    if (!session) {

        showLogin();

        return;

    }


    const {
        data: access,
        error
    } =
        await supabaseClient
            .from("access_periods")
            .select(
                "id, status, payment_status, starts_at, ends_at, is_unlimited"
            )
            .eq(
                "profile_id",
                session.user.id
            )
            .eq(
                "status",
                "active"
            )
            .eq(
                "payment_status",
                "paid"
            )
            .limit(1)
            .maybeSingle();


    if (
        error ||
        !access
    ) {

        alert(
            "У вас нет активного доступа к платформе."
        );

        return;

    }


    if (

        !access.is_unlimited &&
        access.ends_at &&
        new Date(
            access.ends_at
        ) < new Date()

    ) {

        alert(
            "Срок вашего доступа к платформе истёк."
        );

        return;

    }


    const names = {

        adult:
            "Взрослая матрица",

        child:
            "Детская матрица",

        compatibility:
            "Матрица совместимости",

        vedic:
            "Ведическая нумерология",

        pythagoras:
            "Квадрат Пифагора"

    };


    const title =
        names[type] ||
        "Расчёт";


    document.body.innerHTML = `

        <div
            style="
                max-width:600px;
                margin:50px auto;
                padding:30px;
                font-family:Arial
            "
        >

            <h1>
                ${title}
            </h1>


            <label>
                Имя
            </label>


            <input
                id="name"
                type="text"
                style="
                    display:block;
                    width:100%;
                    padding:12px;
                    margin:8px 0 20px
                "
            >


            <label>
                Дата рождения
            </label>


            <input
                id="birthDate"
                type="text"
                placeholder="ДД.ММ.ГГГГ"
                maxlength="10"
                inputmode="numeric"
                oninput="formatBirthDate(this)"
                style="
                    display:block;
                    width:100%;
                    padding:12px;
                    margin:8px 0 20px;
                    box-sizing:border-box
                "
            >


            <div
                id="dateError"
                style="
                    color:red;
                    margin-top:-10px;
                    margin-bottom:15px;
                "
            ></div>


            <button
                onclick="
                    calculate('${type}')
                "
            >
                Рассчитать
            </button>


            <button
                onclick="
                    location.reload()
                "
            >
                Назад
            </button>


            <div
                id="result"
                style="
                    margin-top:30px
                "
            ></div>

        </div>

    `;

}


// =========================================================
// ФОРМАТ ДАТЫ
// =========================================================

function formatBirthDate(input) {

    let value =
        input.value.replace(
            /\D/g,
            ""
        );


    if (
        value.length > 8
    ) {

        value =
            value.substring(
                0,
                8
            );

    }


    if (
        value.length > 4
    ) {

        value =
            value.substring(
                0,
                2
            ) +
            "." +
            value.substring(
                2,
                4
            ) +
            "." +
            value.substring(
                4
            );

    }

    else if (
        value.length > 2
    ) {

        value =
            value.substring(
                0,
                2
            ) +
            "." +
            value.substring(
                2
            );

    }


    input.value =
        value;

}


// =========================================================
// ВРЕМЕННАЯ ФУНКЦИЯ РАСЧЁТА
// =========================================================

function calculate(type) {

    const name =
        document.getElementById(
            "name"
        ).value.trim();


    const birthDate =
        document.getElementById(
            "birthDate"
        ).value.trim();


    const dateError =
        document.getElementById(
            "dateError"
        );


    const result =
        document.getElementById(
            "result"
        );


    dateError.textContent =
        "";

    result.innerHTML =
        "";


    if (!name) {

        dateError.textContent =
            "Введите имя.";

        return;

    }


    if (!birthDate) {

        dateError.textContent =
            "Введите дату рождения.";

        return;

    }


    const dateParts =
        birthDate.split(".");


    if (

        dateParts.length !== 3 ||
        dateParts[0].length !== 2 ||
        dateParts[1].length !== 2 ||
        dateParts[2].length !== 4

    ) {

        dateError.textContent =
            "Введите дату рождения в формате ДД.ММ.ГГГГ.";

        return;

    }


    const day =
        Number(
            dateParts[0]
        );


    const month =
        Number(
            dateParts[1]
        );


    const year =
        Number(
            dateParts[2]
        );


    if (

        year < 1900 ||
        year > new Date()
            .getFullYear()

    ) {

        dateError.textContent =
            "Введите корректный год рождения.";

        return;

    }


    const date =
        new Date(
            year,
            month - 1,
            day
        );


    if (

        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day

    ) {

        dateError.textContent =
            "Введите корректную дату рождения.";

        return;

    }


    result.innerHTML = `

        <h2>
            Данные приняты
        </h2>

        <p>
            Имя: ${escapeHtml(name)}
        </p>

        <p>
            Дата рождения:
            ${escapeHtml(birthDate)}
        </p>

    `;

}


// =========================================================
// ПРОВЕРКА АВТОРИЗАЦИИ
// =========================================================

async function checkAuth() {

    const {
        data: {
            session
        }
    } =
        await supabaseClient
            .auth
            .getSession();


    if (!session) {

        showLogin();

        return;

    }


    const userId =
        session.user.id;


    const {
        data: access,
        error
    } =
        await supabaseClient
            .from("access_periods")
            .select(
                "id, access_kind, status, starts_at, ends_at, is_unlimited, payment_status"
            )
            .eq(
                "profile_id",
                userId
            )
            .eq(
                "status",
                "active"
            )
            .eq(
                "payment_status",
                "paid"
            )
            .limit(1)
            .maybeSingle();


    if (error) {

        alert(
            "Ошибка проверки доступа: " +
            error.message
        );

        showLogin();

        return;

    }


    const {
        data: profile
    } =
        await supabaseClient
            .from("profiles")
            .select(
                "first_name, last_name, email, role, status"
            )
            .eq(
                "id",
                userId
            )
            .maybeSingle();


    const role =
        profile?.role ||
        session.user.user_metadata?.role ||
        "client";


    const isManager =
        role === "manager" ||
        role === "admin" ||
        role === "numerologist";


    const hasAccess =
        Boolean(access);


    /*
       ВАЖНО:

       отсутствие доступа НЕ выкидывает
       пользователя из аккаунта.

       После регистрации пользователь
       может войти, видеть меню и ждать
       выдачи доступа.
    */


    window.currentUserRole =
        role;


    window.currentUserIsManager =
        isManager;


    window.currentUserHasAccess =
        hasAccess;


    startInactivityTimer();


    document.body.style.visibility =
        "visible";


    const displayName =
        profile?.first_name ||
        profile?.last_name ||
        session.user.user_metadata?.first_name ||
        session.user.email?.split("@")[0] ||
        "Пользователь";


    const nameNode =
        document.getElementById(
            "clientName"
        );


    const emailNode =
        document.getElementById(
            "clientEmail"
        );


    if (nameNode) {

        nameNode.textContent =
            displayName;

    }


    if (emailNode) {

        emailNode.textContent =
            profile?.email ||
            session.user.email ||
            "";

    }


    setActiveSection(
        "calculators"
    );


    renderCalculators();

}


// =========================================================
// ЭКРАН ВХОДА
// =========================================================

function showLogin(
    message = ""
) {

    document.body.style.visibility =
        "visible";


    document.body.innerHTML = `

        <div class="auth-shell">

            <div class="auth-card">

                <div class="auth-symbol">
                    ✧
                </div>

                <div class="auth-title">
                    NUMEROLOGY
                </div>

                <div class="auth-subtitle">
                    Platform
                </div>


                <h2>
                    Вход в платформу
                </h2>


                <input
                    id="loginEmail"
                    type="email"
                    placeholder="Email"
                >


                <input
                    id="loginPassword"
                    type="password"
                    placeholder="Пароль"
                >


                <button
                    onclick="loginUser()"
                >
                    Войти
                </button>


                <button
                    class="auth-link"
                    type="button"
                    onclick="showForgotPassword()"
                >
                    Забыли пароль?
                </button>


                <div class="auth-divider">
                    или
                </div>


                <button
                    class="auth-register"
                    type="button"
                    onclick="showRegister()"
                >
                    Зарегистрироваться
                </button>


                <div
                    id="loginError"
                    class="auth-message error"
                >
                    ${escapeHtml(message)}
                </div>

            </div>

        </div>

    `;

}


// =========================================================
// РЕГИСТРАЦИЯ
// =========================================================

function showRegister(
    message = ""
) {

    document.body.style.visibility =
        "visible";


    document.body.innerHTML = `

        <div class="auth-shell">

            <div
                class="auth-card auth-card-register"
            >

                <div class="auth-symbol">
                    ✧
                </div>

                <div class="auth-title">
                    NUMEROLOGY
                </div>

                <div class="auth-subtitle">
                    Platform
                </div>


                <h2>
                    Регистрация
                </h2>


                <p class="auth-description">
                    Создайте аккаунт.
                    После регистрации доступ
                    к разделам открывает
                    администратор или нумеролог.
                </p>


                <div class="auth-grid">

                    <input
                        id="registerLastName"
                        type="text"
                        placeholder="Фамилия *"
                    >

                    <input
                        id="registerFirstName"
                        type="text"
                        placeholder="Имя *"
                    >

                    <input
                        id="registerMiddleName"
                        type="text"
                        placeholder="Отчество"
                    >

                    <input
                        id="registerPhone"
                        type="tel"
                        placeholder="Телефон"
                    >

                    <input
                        id="registerEmail"
                        type="email"
                        placeholder="Email *"
                    >

                    <input
                        id="registerPassword"
                        type="password"
                        placeholder="Пароль *"
                    >

                    <input
                        id="registerPassword2"
                        type="password"
                        placeholder="Повторите пароль *"
                    >

                </div>


                <button
                    onclick="registerUser()"
                >
                    Создать аккаунт
                </button>


                <div
                    id="registerMessage"
                    class="auth-message ${
                        message
                            ? "error"
                            : ""
                    }"
                >
                    ${escapeHtml(message)}
                </div>


                <button
                    class="auth-link"
                    type="button"
                    onclick="showLogin()"
                >
                    ← Вернуться ко входу
                </button>

            </div>

        </div>

    `;

}


// =========================================================
// ЭКРАН ВОССТАНОВЛЕНИЯ ПАРОЛЯ
// =========================================================

let resetSent = false;


function showForgotPassword() {

    document.body.innerHTML = `

        <div
            class="auth-shell"
        >

            <div
                class="auth-card"
            >

                <div class="auth-symbol">
                    ✧
                </div>


                <div class="auth-title">
                    NUMEROLOGY
                </div>


                <div class="auth-subtitle">
                    Platform
                </div>


                <h2>
                    Восстановление пароля
                </h2>


                <input
                    id="resetEmail"
                    type="email"
                    placeholder="Введите ваш Email"
                >


                <button
                    type="button"
                    onclick="sendPasswordReset()"
                >
                    Отправить ссылку
                </button>


                <div
                    id="resetMessage"
                    class="auth-message"
                ></div>


                <button
                    class="auth-link"
                    type="button"
                    onclick="showLogin()"
                >
                    ← Вернуться ко входу
                </button>

            </div>

        </div>

    `;


    resetSent =
        false;

}


// =========================================================
// ОТПРАВКА ВОССТАНОВЛЕНИЯ ПАРОЛЯ
// =========================================================

async function sendPasswordReset() {

    const email =
        document.getElementById(
            "resetEmail"
        ).value.trim();


    const message =
        document.getElementById(
            "resetMessage"
        );


    message.textContent =
        "";


    if (!email) {

        message.textContent =
            "Введите ваш Email.";

        message.className =
            "auth-message error";

        return;

    }


    if (resetSent) {

        message.textContent =
            "Ссылка уже была отправлена. Проверьте вашу почту.";

        message.className =
            "auth-message success";

        return;

    }


    const {
        error
    } =
        await supabaseClient
            .auth
            .resetPasswordForEmail(
                email,
                {
                    redirectTo:
                        window.location.origin +
                        window.location.pathname
                }
            );


    if (error) {

        message.textContent =
            "Не удалось отправить письмо. Попробуйте ещё раз.";

        message.className =
            "auth-message error";

        return;

    }


    resetSent =
        true;


    message.textContent =
        "Ссылка для восстановления пароля отправлена на вашу почту.";

    message.className =
        "auth-message success";

}


// =========================================================
// ВХОД
// =========================================================

async function loginUser() {

    const email =
        document.getElementById(
            "loginEmail"
        )?.value.trim();


    const password =
        document.getElementById(
            "loginPassword"
        )?.value || "";


    const errorBox =
        document.getElementById(
            "loginError"
        );


    if (errorBox)
        errorBox.textContent =
            "";


    if (
        !email ||
        !password
    ) {

        if (errorBox)
            errorBox.textContent =
                "Введите email и пароль.";

        return;

    }


    const {
        error
    } =
        await supabaseClient
            .auth
            .signInWithPassword({

                email,
                password

            });


    if (error) {

        if (errorBox)
            errorBox.textContent =
                "Неверный email или пароль.";

        return;

    }


    updateLastActivity();

    location.reload();

}


// =========================================================
// РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ
// =========================================================

async function registerUser() {

    const lastName =
        document.getElementById(
            "registerLastName"
        )?.value.trim() || "";


    const firstName =
        document.getElementById(
            "registerFirstName"
        )?.value.trim() || "";


    const middleName =
        document.getElementById(
            "registerMiddleName"
        )?.value.trim() || "";


    const phone =
        document.getElementById(
            "registerPhone"
        )?.value.trim() || "";


    const email =
        document.getElementById(
            "registerEmail"
        )?.value.trim() || "";


    const password =
        document.getElementById(
            "registerPassword"
        )?.value || "";


    const password2 =
        document.getElementById(
            "registerPassword2"
        )?.value || "";


    const message =
        document.getElementById(
            "registerMessage"
        );


    function setMessage(
        text,
        ok = false
    ) {

        if (!message)
            return;


        message.textContent =
            text;


        message.className =
            "auth-message " +
            (
                ok
                    ? "success"
                    : "error"
            );

    }


    if (
        !lastName ||
        !firstName ||
        !email ||
        !password ||
        !password2
    ) {

        setMessage(
            "Заполните обязательные поля: фамилия, имя, email и пароль."
        );

        return;

    }


    if (
        password.length < 6
    ) {

        setMessage(
            "Пароль должен содержать минимум 6 символов."
        );

        return;

    }


    if (
        password !== password2
    ) {

        setMessage(
            "Пароли не совпадают."
        );

        return;

    }


    setMessage(
        "Создаю аккаунт...",
        true
    );


    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .signUp({

                email,

                password,

                options: {

                    data: {

                        first_name:
                            firstName,

                        last_name:
                            lastName,

                        middle_name:
                            middleName,

                        phone:
                            phone,

                        role:
                            "client",

                        status:
                            "pending"

                    }

                }

            });


    if (error) {

        setMessage(
            error.message ||
            "Не удалось зарегистрировать пользователя."
        );

        return;

    }


    if (data?.user) {

        const {
            error: profileError
        } =
            await supabaseClient
                .from("profiles")
                .upsert(

                    {

                        id:
                            data.user.id,

                        first_name:
                            firstName,

                        last_name:
                            lastName,

                        middle_name:
                            middleName,

                        email:
                            email,

                        phone:
                            phone,

                        role:
                            "client",

                        status:
                            "pending"

                    },

                    {
                        onConflict:
                            "id"
                    }

                );


        if (profileError) {

            console.warn(
                "Профиль не обновлён из браузера. Проверьте RLS/SQL-триггер:",
                profileError
            );

        }

    }


    if (data.session) {

        setMessage(
            "Регистрация завершена. Сейчас откроется платформа. Доступ к разделам будет закрыт до выдачи доступа.",
            true
        );


        setTimeout(
            function() {
                location.reload();
            },
            900
        );

    }

    else {

        setMessage(
            "Регистрация создана. Проверьте почту, подтвердите email и затем войдите. После регистрации доступ к разделам откроет администратор или нумеролог.",
            true
        );

    }

}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHtml(value) {

    return String(value || "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// =========================================================
// ЗАПУСК
// =========================================================

checkAuth();
