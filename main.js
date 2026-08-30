// ============================================================
// MAIN.JS
// ОСНОВНАЯ ЛОГИКА ПЛАТФОРМЫ
// ============================================================


// ============================================================
// SUPABASE
// ============================================================

const SUPABASE_URL =
    "https://skvprhqsxnlacshucncq.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_N0pKMmzNOonoInimmkding_GJnMwsRd";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ============================================================
// ТЕКУЩИЙ ПОЛЬЗОВАТЕЛЬ
// ============================================================

window.currentUserRole = "";

window.currentUserIsManager = false;

window.currentUserHasAccess = false;


// ============================================================
// РОЛИ
// ============================================================

const MANAGER_ROLES = [
    "admin",
    "teacher",
    "numerologist",
    "нумеролог",
    "администратор"
];


function isManagerRole(role) {

    return MANAGER_ROLES.includes(
        String(role || "").toLowerCase()
    );

}


// ============================================================
// ПРОВЕРКА АКТИВНОГО ДОСТУПА
// ============================================================

function hasActivePlatformAccess(access) {

    if (!access) return false;


    if (
        String(
            access.status || ""
        ).toLowerCase() !== "active"
    ) {

        return false;

    }


    if (
        String(
            access.payment_status || ""
        ).toLowerCase() !== "paid"
    ) {

        return false;

    }


    if (
        !access.is_unlimited &&
        access.ends_at &&
        new Date(access.ends_at) < new Date()
    ) {

        return false;

    }


    return true;

}


// ============================================================
// СООБЩЕНИЕ ОБ ОТСУТСТВИИ ДОСТУПА
// ============================================================

function showNoAccessMessage() {

    alert(
        "У вас нет доступа к этому разделу. " +
        "Обратитесь к администратору или нумерологу."
    );

}


// ============================================================
// АКТИВНЫЙ ПУНКТ МЕНЮ
// ============================================================

function setActiveSection(section) {

    document
        .querySelectorAll(
            ".nav-item[data-section]"
        )
        .forEach(
            function(button) {

                button.classList.toggle(
                    "active",
                    button.dataset.section === section
                );

            }
        );

}


// ============================================================
// ЗАКРЫТЫЙ РАЗДЕЛ
// ============================================================

function renderLockedSection(section) {

    const contentCards =
        document.getElementById(
            "contentCards"
        );


    if (!contentCards) return;


    const titles = {

        calculators:
            "Калькуляторы",

        manuals:
            "Методические пособия",

        videos:
            "Видео",

        tests:
            "Тесты",

        library:
            "Библиотека нумеролога",

        "my-calculations":
            "Мои расчёты"

    };


    contentCards.innerHTML = `

        <div class="dashboard-wrap">

            <div class="dashboard-head">

                <div>

                    <h2>
                        ${
                            titles[section] ||
                            "Раздел платформы"
                        }
                    </h2>

                    <p>
                        Раздел доступен
                        после выдачи доступа.
                    </p>

                </div>


                <div class="dashboard-badge">
                    Доступ закрыт
                </div>

            </div>


            <div
                class="table-card"
                style="
                    text-align:center;
                    padding:55px 30px;
                "
            >

                <div
                    style="
                        font-size:55px;
                        margin-bottom:15px;
                    "
                >
                    🔒
                </div>


                <div
                    style="
                        font-family:Georgia,serif;
                        font-size:27px;
                        color:#f6d66c;
                        margin-bottom:12px;
                    "
                >
                    У вас нет доступа
                    к этому разделу
                </div>


                <div
                    style="
                        font-size:17px;
                        color:#eee5d0;
                        line-height:1.6;
                        max-width:650px;
                        margin:0 auto;
                    "
                >

                    Вы успешно зарегистрированы
                    в Numerology Platform.

                    <br>

                    Чтобы открыть раздел,
                    администратор или нумеролог
                    должен выдать вам доступ.

                </div>


                <button
                    class="material-manager-button"
                    style="margin-top:24px;"
                    onclick="
                        showSection('access')
                    "
                >
                    Посмотреть статус доступа
                </button>

            </div>

        </div>

    `;

}


// ============================================================
// ПЕРЕКЛЮЧЕНИЕ РАЗДЕЛОВ
// ============================================================

async function showSection(section) {

    const contentCards =
        document.getElementById(
            "contentCards"
        );


    if (!contentCards) return;


    setActiveSection(
        section
    );


    const protectedSections = [

        "calculators",
        "manuals",
        "videos",
        "tests",
        "library",
        "my-calculations"

    ];


    // Пользователь без доступа
    // видит меню, но не содержимое

    if (
        !window.currentUserIsManager &&
        protectedSections.includes(section) &&
        !window.currentUserHasAccess
    ) {

        renderLockedSection(
            section
        );

        return;

    }


    // КАЛЬКУЛЯТОРЫ

    if (
        section === "calculators"
    ) {

        if (
            typeof renderCalculators ===
            "function"
        ) {

            renderCalculators();

        }

        return;

    }


    // МЕТОДИЧЕСКИЕ ПОСОБИЯ

    if (
        section === "manuals"
    ) {

        if (
            typeof loadManuals ===
            "function"
        ) {

            await loadManuals();

        }

        return;

    }


    // ВИДЕО

    if (
        section === "videos"
    ) {

        if (
            typeof loadVideos ===
            "function"
        ) {

            await loadVideos();

        }

        return;

    }


    // ТЕСТЫ

    if (
        section === "tests"
    ) {

        if (
            typeof renderTests ===
            "function"
        ) {

            await renderTests();

        }

        return;

    }


    // БИБЛИОТЕКА

    if (
        section === "library"
    ) {

        if (
            typeof loadLibrary ===
            "function"
        ) {

            await loadLibrary();

        }

        return;

    }


    // МОИ РАСЧЁТЫ

    if (
        section === "my-calculations"
    ) {

        renderMyCalculations();

        return;

    }


    // ДОСТУПЫ

    if (
        section === "access"
    ) {

        await renderAccess();

        return;

    }


    // СТАТИСТИКА

    if (
        section === "statistics"
    ) {

        await renderStatistics();

        return;

    }

}


// ============================================================
// МОИ РАСЧЁТЫ
// ============================================================

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

                    <strong>
                        0
                    </strong>

                </div>


                <div class="stat-card">

                    <span>
                        За этот месяц
                    </span>

                    <strong>
                        0
                    </strong>

                </div>


                <div class="stat-card">

                    <span>
                        Последний расчёт
                    </span>

                    <strong>
                        —
                    </strong>

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


// ============================================================
// РАЗДЕЛ «ДОСТУПЫ»
// ============================================================

async function renderAccess() {

    const contentCards =
        document.getElementById(
            "contentCards"
        );


    if (!contentCards) return;


    // --------------------------------------------------------
    // ОБЫЧНЫЙ КЛИЕНТ
    // --------------------------------------------------------

    if (
        !window.currentUserIsManager
    ) {

        contentCards.innerHTML = `

            <div class="dashboard-wrap">

                <div class="dashboard-head">

                    <div>

                        <h2>
                            Доступы
                        </h2>

                        <p>
                            Здесь отображается
                            статус вашего доступа
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


            if (!session) return;


            const {
                data,
                error
            } =
                await supabaseClient
                    .from(
                        "access_periods"
                    )
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
                (
                    data || []
                )
                .map(
                    function(item) {

                        const active =
                            hasActivePlatformAccess(
                                item
                            );


                        const end =
                            item.is_unlimited

                                ? "Без ограничений"

                                : (
                                    item.ends_at

                                        ? new Date(
                                            item.ends_at
                                        )
                                        .toLocaleDateString(
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
                                        active
                                            ? "Активен"
                                            : (
                                                item.status ||
                                                "Ожидает"
                                            )
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

                    }
                )
                .join("");


            document.getElementById(
                "accessTable"
            ).innerHTML = rows

                ? `

                    <table class="data-table">

                        <thead>

                            <tr>

                                <th>
                                    Доступ
                                </th>

                                <th>
                                    Статус
                                </th>

                                <th>
                                    Оплата
                                </th>

                                <th>
                                    До
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            ${rows}

                        </tbody>

                    </table>

                `

                : `

                    <div class="empty-table">

                        Доступ пока не выдан.

                        <br><br>

                        После регистрации
                        администратор или нумеролог
                        должен открыть вам доступ.

                    </div>

                `;

        }

        catch (error) {

            console.error(
                "Ошибка загрузки доступа:",
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
                        статус доступа.

                    </div>

                `;

            }

        }


        return;

    }


    // --------------------------------------------------------
    // АДМИНИСТРАТОР / НУМЕРОЛОГ
    // --------------------------------------------------------

    contentCards.innerHTML = `

        <div class="dashboard-wrap">

            <div class="dashboard-head">

                <div>

                    <h2>
                        Доступы пользователей
                    </h2>

                    <p>
                        Администратор или нумеролог
                        открывает доступ
                        зарегистрированным клиентам.
                    </p>

                </div>


                <div class="dashboard-badge">
                    Управление
                </div>

            </div>


            <div
                class="table-card"
                style="margin-bottom:18px;"
            >

                <div class="table-title">
                    Выдать доступ
                </div>


                <div
                    style="
                        display:grid;
                        grid-template-columns:
                            2fr 1fr 1fr auto;
                        gap:12px;
                        align-items:end;
                    "
                >

                    <label
                        style="display:block;"
                    >

                        <span
                            style="
                                display:block;
                                margin-bottom:7px;
                                color:#eee5d0;
                            "
                        >
                            Пользователь
                        </span>


                        <select
                            id="accessUserSelect"
                            class="material-manager-input"
                            style="
                                width:100%;
                                padding:12px;
                                border-radius:10px;
                                background:#17112f;
                                color:#fff;
                                border:1px solid #d7aa31;
                            "
                        ></select>

                    </label>


                    <label
                        style="display:block;"
                    >

                        <span
                            style="
                                display:block;
                                margin-bottom:7px;
                                color:#eee5d0;
                            "
                        >
                            Доступ
                        </span>


                        <select
                            id="accessKindSelect"
                            class="material-manager-input"
                            style="
                                width:100%;
                                padding:12px;
                                border-radius:10px;
                                background:#17112f;
                                color:#fff;
                                border:1px solid #d7aa31;
                            "
                        >

                            <option value="platform">
                                Платформа
                            </option>

                        </select>

                    </label>


                    <label
                        style="display:block;"
                    >

                        <span
                            style="
                                display:block;
                                margin-bottom:7px;
                                color:#eee5d0;
                            "
                        >
                            Срок
                        </span>


                        <select
                            id="accessTermSelect"
                            class="material-manager-input"
                            style="
                                width:100%;
                                padding:12px;
                                border-radius:10px;
                                background:#17112f;
                                color:#fff;
                                border:1px solid #d7aa31;
                            "
                        >

                            <option value="unlimited">
                                Без ограничений
                            </option>

                            <option value="30">
                                30 дней
                            </option>

                            <option value="90">
                                90 дней
                            </option>

                            <option value="180">
                                180 дней
                            </option>

                            <option value="365">
                                1 год
                            </option>

                        </select>

                    </label>


                    <button
                        class="material-manager-button"
                        style="height:45px;"
                        onclick="
                            grantPlatformAccess()
                        "
                    >
                        Выдать
                    </button>

                </div>


                <div
                    id="accessAdminMessage"
                    style="margin-top:12px;"
                ></div>

            </div>


            <div class="table-card">

                <div class="table-title">
                    Зарегистрированные пользователи
                </div>


                <div
                    id="adminUsersTable"
                >
                    Загрузка...
                </div>

            </div>

        </div>

    `;


    await loadAdminUsers();

}


// ============================================================
// ЗАГРУЗКА ПОЛЬЗОВАТЕЛЕЙ ДЛЯ АДМИНИСТРАТОРА
// ============================================================

async function loadAdminUsers() {

    const box =
        document.getElementById(
            "adminUsersTable"
        );


    const select =
        document.getElementById(
            "accessUserSelect"
        );


    if (!box || !select)
        return;


    try {

        const {
            data: users,
            error: usersError
        } =
            await supabaseClient
                .from("profiles")
                .select(
                    "id, first_name, last_name, middle_name, email, role, status"
                )
                .order(
                    "last_name",
                    {
                        ascending: true
                    }
                );


        if (usersError)
            throw usersError;


        const clientUsers =
            (
                users || []
            ).filter(
                function(user) {

                    const role =
                        String(
                            user.role || ""
                        ).toLowerCase();


                    return !MANAGER_ROLES.includes(
                        role
                    );

                }
            );


        select.innerHTML =
            clientUsers.length

                ? clientUsers
                    .map(
                        function(user) {

                            const name =
                                [
                                    user.last_name,
                                    user.first_name,
                                    user.middle_name
                                ]
                                .filter(Boolean)
                                .join(" ")

                                ||
                                user.email

                                ||
                                user.id;


                            return `

                                <option
                                    value="${user.id}"
                                >
                                    ${escapeHtml(name)}
                                    ${
                                        user.email
                                            ? " — " +
                                              escapeHtml(
                                                  user.email
                                              )
                                            : ""
                                    }
                                </option>

                            `;

                        }
                    )
                    .join("")

                : `
                    <option value="">
                        Клиенты не найдены
                    </option>
                `;


        const ids =
            (
                users || []
            )
            .map(
                function(user) {
                    return user.id;
                }
            );


        let accessMap = {};


        if (ids.length) {

            const {
                data: accesses,
                error: accessError
            } =
                await supabaseClient
                    .from(
                        "access_periods"
                    )
                    .select(
                        "profile_id, access_kind, status, payment_status, starts_at, ends_at, is_unlimited"
                    )
                    .in(
                        "profile_id",
                        ids
                    )
                    .order(
                        "starts_at",
                        {
                            ascending: false
                        }
                    );


            if (accessError)
                throw accessError;


            (
                accesses || []
            )
            .forEach(
                function(access) {

                    if (
                        !accessMap[
                            access.profile_id
                        ]
                    ) {

                        accessMap[
                            access.profile_id
                        ] =
                            access;

                    }

                }
            );

        }


        const rows =
            (
                users || []
            )
            .map(
                function(user) {

                    const name =
                        [
                            user.last_name,
                            user.first_name,
                            user.middle_name
                        ]
                        .filter(Boolean)
                        .join(" ")
                        ||
                        "—";


                    const access =
                        accessMap[
                            user.id
                        ];


                    let accessText =
                        "Нет доступа";


                    if (access) {

                        const expired =
                            !access.is_unlimited &&
                            access.ends_at &&
                            new Date(
                                access.ends_at
                            ) < new Date();


                        accessText =
                            expired

                                ? "Истёк"

                                : (
                                    (
                                        access.status ||
                                        "—"
                                    ) +
                                    " / " +
                                    (
                                        access.payment_status ||
                                        "—"
                                    )
                                );

                    }


                    return `

                        <tr>

                            <td>
                                ${escapeHtml(name)}
                            </td>

                            <td>
                                ${
                                    escapeHtml(
                                        user.email ||
                                        "—"
                                    )
                                }
                            </td>

                            <td>
                                ${
                                    escapeHtml(
                                        user.role ||
                                        "—"
                                    )
                                }
                            </td>

                            <td>
                                ${accessText}
                            </td>

                        </tr>

                    `;

                }
            )
            .join("");


        box.innerHTML = `

            <table class="data-table">

                <thead>

                    <tr>

                        <th>
                            Пользователь
                        </th>

                        <th>
                            Email
                        </th>

                        <th>
                            Роль
                        </th>

                        <th>
                            Доступ
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${
                        rows ||

                        `
                            <tr>
                                <td colspan="4">
                                    Пользователи
                                    не найдены.
                                </td>
                            </tr>
                        `
                    }

                </tbody>

            </table>

        `;

    }

    catch (error) {

        console.error(
            "Ошибка загрузки пользователей:",
            error
        );


        box.innerHTML = `

            <div class="empty-table">

                Не удалось загрузить
                пользователей.

            </div>

        `;

    }

}


// ============================================================
// ВЫДАЧА ДОСТУПА
// ============================================================

async function grantPlatformAccess() {

    if (
        !window.currentUserIsManager
    )
        return;


    const profileId =
        document.getElementById(
            "accessUserSelect"
        )?.value;


    const term =
        document.getElementById(
            "accessTermSelect"
        )?.value;


    const message =
        document.getElementById(
            "accessAdminMessage"
        );


    if (!profileId) {

        if (message) {

            message.innerHTML = `

                <span
                    style="color:#f3a6a6;"
                >
                    Сначала выберите
                    пользователя.
                </span>

            `;

        }

        return;

    }


    const now =
        new Date();


    let endsAt =
        null;


    const isUnlimited =
        term === "unlimited";


    if (!isUnlimited) {

        endsAt =
            new Date(now);


        endsAt.setDate(
            endsAt.getDate() +
            Number(term)
        );

    }


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
            error
        } =
            await supabaseClient
                .from(
                    "access_periods"
                )
                .insert({

                    profile_id:
                        profileId,

                    access_kind:
                        "platform",

                    status:
                        "active",

                    payment_status:
                        "paid",

                    starts_at:
                        now.toISOString(),

                    ends_at:
                        endsAt
                            ? endsAt.toISOString()
                            : null,

                    is_unlimited:
                        isUnlimited

                });


        if (error)
            throw error;


        if (message) {

            message.innerHTML = `

                <span
                    style="color:#9fe3ae;"
                >
                    Доступ успешно выдан.
                </span>

            `;

        }


        await loadAdminUsers();

    }

    catch (error) {

        console.error(
            "Ошибка выдачи доступа:",
            error
        );


        if (message) {

            message.innerHTML = `

                <span
                    style="color:#f3a6a6;"
                >
                    Не удалось выдать доступ:
                    ${
                        escapeHtml(
                            error.message ||
                            error
                        )
                    }
                </span>

            `;

        }

    }

}


// ============================================================
// СТАТИСТИКА
// ============================================================

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


                    <tbody
                        id="sectionStats"
                    >

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
                .from(
                    "platform_materials"
                )
                .select(
                    "section"
                );


        if (error)
            throw error;


        const counts = {

            manuals: 0,
            videos: 0,
            tests: 0

        };


        (
            data || []
        )
        .forEach(
            function(item) {

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

            }
        );


        const total =
            Object.values(
                counts
            )
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

                <span>
                    Материалы
                </span>

                <strong>
                    ${total}
                </strong>

            </div>


            <div class="stat-card">

                <span>
                    Пособия
                </span>

                <strong>
                    ${counts.manuals}
                </strong>

            </div>


            <div class="stat-card">

                <span>
                    Видео
                </span>

                <strong>
                    ${counts.videos}
                </strong>

            </div>


            <div class="stat-card">

                <span>
                    Тесты
                </span>

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

        `;

    }

    catch (error) {

        console.error(
            "Ошибка статистики:",
            error
        );


        document.getElementById(
            "platformStats"
        ).innerHTML = `

            <div class="stat-card">
                <span>Материалы</span>
                <strong>—</strong>
            </div>

            <div class="stat-card">
                <span>Пособия</span>
                <strong>—</strong>
            </div>

            <div class="stat-card">
                <span>Видео</span>
                <strong>—</strong>
            </div>

            <div class="stat-card">
                <span>Тесты</span>
                <strong>—</strong>
            </div>

        `;


        document.getElementById(
            "sectionStats"
        ).innerHTML = `

            <tr>

                <td colspan="3">

                    Статистика пока недоступна.

                </td>

            </tr>

        `;

    }

}


// ============================================================
// ВЫХОД
// ============================================================

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


// ============================================================
// БЕЗДЕЙСТВИЕ
// ============================================================

const INACTIVITY_LIMIT =
    60 * 60 * 1000;


const LAST_ACTIVITY_KEY =
    "numerology_last_activity";


let inactivityTimer =
    null;


function updateLastActivity() {

    localStorage.setItem(
        LAST_ACTIVITY_KEY,
        Date.now().toString()
    );


    clearTimeout(
        inactivityTimer
    );


    inactivityTimer =
        setTimeout(
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
        Date.now() -
        lastActivity;


    if (
        inactiveTime >=
        INACTIVITY_LIMIT
    ) {

        localStorage.removeItem(
            LAST_ACTIVITY_KEY
        );


        await supabaseClient
            .auth
            .signOut();


        showLogin();


        return;

    }


    clearTimeout(
        inactivityTimer
    );


    inactivityTimer =
        setTimeout(
            autoLogoutAfterInactivity,
            INACTIVITY_LIMIT -
            inactiveTime
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
        Date.now() -
        lastActivity >=
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
]
.forEach(
    function(eventName) {

        document.addEventListener(
            eventName,
            function() {

                updateLastActivity();

            },
            {
                passive: true
            }
        );

    }
);


// Проверка при возвращении
// на вкладку

document.addEventListener(
    "visibilitychange",
    function() {

        if (!document.hidden) {

            autoLogoutAfterInactivity();

        }

    }
);


// ============================================================
// ПРОВЕРКА АВТОРИЗАЦИИ И ДОСТУПА
// ============================================================

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
        data: profile,
        error: profileError
    } =
        await supabaseClient
            .from("profiles")
            .select(
                "role, first_name, last_name, middle_name, email, phone, status"
            )
            .eq(
                "id",
                userId
            )
            .maybeSingle();


    if (profileError) {

        console.error(
            "Ошибка загрузки профиля:",
            profileError
        );

    }


    const role =
        String(
            profile?.role ||
            session.user.user_metadata?.role ||
            "client"
        )
        .toLowerCase();


    const isManager =
        isManagerRole(
            role
        );


    let hasAccess =
        false;


    // Администратор / нумеролог
    // имеет доступ к платформе

    if (isManager) {

        hasAccess =
            true;

    }

    else {

        const {
            data: access,
            error: accessError
        } =
            await supabaseClient
                .from(
                    "access_periods"
                )
                .select(
                    "id, access_kind, status, starts_at, ends_at, is_unlimited, payment_status"
                )
                .eq(
                    "profile_id",
                    userId
                )
                .eq(
                    "access_kind",
                    "platform"
                )
                .order(
                    "starts_at",
                    {
                        ascending: false
                    }
                )
                .limit(10);


        if (accessError) {

            console.error(
                "Ошибка проверки доступа:",
                accessError
            );

        }

        else {

            hasAccess =
                (
                    access || []
                )
                .some(
                    hasActivePlatformAccess
                );

        }

    }


    /*
        ВАЖНО:

        отсутствие доступа НЕ выкидывает
        пользователя из аккаунта.

        Пользователь может войти,
        видеть меню и ждать выдачи доступа.
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


    if (
        typeof renderCalculators ===
        "function"
    ) {

        renderCalculators();

    }

}


// ============================================================
// ЭКРАН ВХОДА
// ============================================================

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
                    onclick="
                        showForgotPassword()
                    "
                >
                    Забыли пароль?
                </button>


                <div class="auth-divider">
                    или
                </div>


                <button
                    class="auth-register"
                    type="button"
                    onclick="
                        showRegister()
                    "
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


// ============================================================
// РЕГИСТРАЦИЯ
// ============================================================

function showRegister(
    message = ""
) {

    document.body.style.visibility =
        "visible";


    document.body.innerHTML = `

        <div class="auth-shell">

            <div
                class="auth-card
                       auth-card-register"
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


// ============================================================
// ЭКРАН ВОССТАНОВЛЕНИЯ ПАРОЛЯ
// ============================================================

let resetSent =
    false;


function showForgotPassword() {

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
                    Восстановление пароля
                </h2>


                <input
                    id="resetEmail"
                    type="email"
                    placeholder="Введите ваш Email"
                >


                <button
                    type="button"
                    onclick="
                        sendPasswordReset()
                    "
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
                    onclick="
                        showLogin()
                    "
                >
                    ← Вернуться ко входу
                </button>

            </div>

        </div>

    `;


    resetSent =
        false;

}


// ============================================================
// ВОССТАНОВЛЕНИЕ ПАРОЛЯ
// ============================================================

async function sendPasswordReset() {

    const email =
        document.getElementById(
            "resetEmail"
        )?.value.trim();


    const message =
        document.getElementById(
            "resetMessage"
        );


    if (!message)
        return;


    message.textContent =
        "";


    message.className =
        "auth-message";


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


// ============================================================
// ВХОД
// ============================================================

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


// ============================================================
// РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ
// ============================================================

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
                .from(
                    "profiles"
                )
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
                "Профиль не обновлён:",
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


// ============================================================
// ЭКРАНИРОВАНИЕ HTML
// ============================================================

function escapeHtml(value) {

    return String(
        value || ""
    )
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


// ============================================================
// ЗАПУСК
// ============================================================

checkAuth();
