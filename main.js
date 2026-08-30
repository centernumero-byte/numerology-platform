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
// ГЛОБАЛЬНЫЕ ПРАВА ПОЛЬЗОВАТЕЛЯ
// ============================================================

window.currentUserRole = "";
window.currentUserIsManager = false;
window.currentUserHasAccess = false;
window.currentUser = null;


// Центр Нумера — главный администратор
const ADMIN_EMAILS = [
    "centernumero@gmail.com"
];


// Допустимые административные роли
const MANAGER_ROLES = [
    "admin",
    "administrator",
    "teacher",
    "numerologist",
    "нумеролог",
    "администратор"
];


// ============================================================
// ПРОВЕРКА АДМИНИСТРАТОРА
// ============================================================

function isManagerRole(role) {

    return MANAGER_ROLES.includes(
        String(role || "")
            .trim()
            .toLowerCase()
    );
}


function isAdminEmail(email) {

    return ADMIN_EMAILS.includes(
        String(email || "")
            .trim()
            .toLowerCase()
    );
}


// ============================================================
// ПРОВЕРКА АКТИВНОГО ДОСТУПА
// ============================================================

function hasActivePlatformAccess(access) {

    if (!access) {
        return false;
    }

    if (
        String(access.status || "")
            .toLowerCase() !== "active"
    ) {
        return false;
    }

    if (
        access.payment_status &&
        String(access.payment_status)
            .toLowerCase() !== "paid"
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
// БЕЗОПАСНЫЙ HTML
// ============================================================

function escapeHtml(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// АКТИВНЫЙ ПУНКТ МЕНЮ
// ============================================================

function setActiveSection(section) {

    document
        .querySelectorAll(
            ".nav-item[data-section]"
        )
        .forEach(function (button) {

            button.classList.toggle(
                "active",
                button.dataset.section === section
            );

        });
}


// ============================================================
// ЗАКРЫТЫЙ РАЗДЕЛ
// ============================================================

function renderLockedSection(section) {

    const contentCards =
        document.getElementById(
            "contentCards"
        );

    if (!contentCards) {
        return;
    }

    contentCards.innerHTML = `

        <div class="access-locked">

            <div class="access-locked-icon">
                🔒
            </div>

            <h2>
                У вас нет доступа
            </h2>

            <p>
                Чтобы открыть этот раздел,
                обратитесь к администратору
                или нумерологу.
            </p>

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

    if (!contentCards) {
        return;
    }

    setActiveSection(section);


    const protectedSections = [
        "calculators",
        "manuals",
        "videos",
        "tests",
        "library",
        "my-calculations"
    ];


    // Администратор имеет доступ ко всем защищённым разделам
    if (
        !window.currentUserIsManager &&
        protectedSections.includes(section) &&
        !window.currentUserHasAccess
    ) {

        renderLockedSection(section);

        return;
    }


    // --------------------------------------------------------
    // КАЛЬКУЛЯТОРЫ
    // --------------------------------------------------------

    if (section === "calculators") {

        if (
            typeof renderCalculators ===
            "function"
        ) {
            renderCalculators();
        }

        return;
    }


    // --------------------------------------------------------
    // МЕТОДИЧЕСКИЕ ПОСОБИЯ
    // --------------------------------------------------------

    if (section === "manuals") {

        if (
            typeof loadManuals ===
            "function"
        ) {
            await loadManuals();
        }

        return;
    }


    // --------------------------------------------------------
    // ВИДЕО
    // --------------------------------------------------------

    if (section === "videos") {

        if (
            typeof loadVideos ===
            "function"
        ) {
            await loadVideos();
        }

        return;
    }


    // --------------------------------------------------------
    // ТЕСТЫ
    // --------------------------------------------------------

    if (section === "tests") {

        if (
            typeof renderTests ===
            "function"
        ) {
            await renderTests();
        }

        return;
    }


    // --------------------------------------------------------
    // БИБЛИОТЕКА
    // --------------------------------------------------------

    if (section === "library") {

        if (
            typeof loadLibrary ===
            "function"
        ) {
            await loadLibrary();
        }

        return;
    }


    // --------------------------------------------------------
    // МОИ РАСЧЁТЫ
    // --------------------------------------------------------

    if (section === "my-calculations") {

        renderMyCalculations();

        return;
    }


    // --------------------------------------------------------
    // ДОСТУПЫ
    // --------------------------------------------------------

    if (section === "access") {

        await renderAccess();

        return;
    }


    // --------------------------------------------------------
    // СТАТИСТИКА
    // --------------------------------------------------------

    if (section === "statistics") {

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

    if (!contentCards) {
        return;
    }

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
// ДОСТУПЫ
// ============================================================

async function renderAccess() {

    const contentCards =
        document.getElementById(
            "contentCards"
        );

    if (!contentCards) {
        return;
    }


    // --------------------------------------------------------
    // ОБЫЧНЫЙ ПОЛЬЗОВАТЕЛЬ
    // --------------------------------------------------------

    if (!window.currentUserIsManager) {

        contentCards.innerHTML = `

            <div class="dashboard-wrap">

                <div class="dashboard-head">

                    <div>

                        <h2>
                            Доступы
                        </h2>

                        <p>
                            Статус доступа к платформе.
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


            if (!session) {
                return;
            }


            const {
                data,
                error
            } =
                await supabaseClient
                    .from("access_periods")
                    .select(`
                        access_kind,
                        status,
                        starts_at,
                        ends_at,
                        is_unlimited,
                        payment_status
                    `)
                    .eq(
                        "profile_id",
                        session.user.id
                    )
                    .order(
                        "starts_at",
                        {
                            ascending: false
                        }
                    );


            if (error) {
                throw error;
            }


            const rows =
                (data || [])
                    .map(function (item) {

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
                                        ).toLocaleDateString(
                                            "ru-RU"
                                        )
                                        : "—"
                                );


                        return `

                            <tr>

                                <td>
                                    ${escapeHtml(
                                        item.access_kind ||
                                        "Платформа"
                                    )}
                                </td>

                                <td>
                                    ${
                                        active
                                            ? "Активен"
                                            : escapeHtml(
                                                item.status ||
                                                "Ожидает"
                                            )
                                    }
                                </td>

                                <td>
                                    ${escapeHtml(
                                        item.payment_status ||
                                        "—"
                                    )}
                                </td>

                                <td>
                                    ${end}
                                </td>

                            </tr>

                        `;

                    })
                    .join("");


            const table =
                document.getElementById(
                    "accessTable"
                );


            if (!table) {
                return;
            }


            table.innerHTML =
                rows
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

                            У вас пока нет
                            выданного доступа.

                            <br><br>

                            Обратитесь
                            к администратору
                            или нумерологу.

                        </div>

                    `;

        } catch (error) {

            console.error(
                "Ошибка загрузки доступа:",
                error
            );


            const table =
                document.getElementById(
                    "accessTable"
                );


            if (table) {

                table.innerHTML = `

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
    // АДМИНИСТРАТОР
    // --------------------------------------------------------

    contentCards.innerHTML = `

        <div class="dashboard-wrap">

            <div class="dashboard-head">

                <div>

                    <h2>
                        Доступы пользователей
                    </h2>

                    <p>
                        Управление доступом
                        зарегистрированных пользователей.
                    </p>

                </div>

                <div class="dashboard-badge">
                    Администратор
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

                    <label>

                        <span
                            style="
                                display:block;
                                margin-bottom:7px;
                            "
                        >
                            Пользователь
                        </span>

                        <select
                            id="accessUserSelect"
                            class="material-manager-input"
                        ></select>

                    </label>


                    <label>

                        <span
                            style="
                                display:block;
                                margin-bottom:7px;
                            "
                        >
                            Доступ
                        </span>

                        <select
                            id="accessKindSelect"
                            class="material-manager-input"
                        >

                            <option value="platform">
                                Платформа
                            </option>

                        </select>

                    </label>


                    <label>

                        <span
                            style="
                                display:block;
                                margin-bottom:7px;
                            "
                        >
                            Срок
                        </span>

                        <select
                            id="accessTermSelect"
                            class="material-manager-input"
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
                        onclick="grantPlatformAccess()"
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

                <div id="adminUsersTable">
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

    const select =
        document.getElementById(
            "accessUserSelect"
        );

    const table =
        document.getElementById(
            "adminUsersTable"
        );


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("profiles")
                .select(`
                    id,
                    first_name,
                    last_name,
                    middle_name,
                    email,
                    phone,
                    role,
                    status
                `)
                .order(
                    "last_name",
                    {
                        ascending: true
                    }
                );


        if (error) {
            throw error;
        }


        const users =
            data || [];


        if (select) {

            select.innerHTML =
                users
                    .map(function (user) {

                        const name =
                            [
                                user.last_name,
                                user.first_name,
                                user.middle_name
                            ]
                                .filter(Boolean)
                                .join(" ");


                        return `

                            <option value="${escapeHtml(
                                user.id
                            )}">

                                ${escapeHtml(
                                    name ||
                                    user.email ||
                                    "Пользователь"
                                )}

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

                    })
                    .join("");

        }


        if (table) {

            if (!users.length) {

                table.innerHTML = `

                    <div class="empty-table">

                        Зарегистрированных
                        пользователей пока нет.

                    </div>

                `;

                return;
            }


            table.innerHTML = `

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
                                Телефон
                            </th>

                            <th>
                                Роль
                            </th>

                            <th>
                                Статус
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            users
                                .map(function (user) {

                                    const name =
                                        [
                                            user.last_name,
                                            user.first_name,
                                            user.middle_name
                                        ]
                                            .filter(Boolean)
                                            .join(" ");


                                    return `

                                        <tr>

                                            <td>
                                                ${escapeHtml(
                                                    name ||
                                                    "—"
                                                )}
                                            </td>

                                            <td>
                                                ${escapeHtml(
                                                    user.email ||
                                                    "—"
                                                )}
                                            </td>

                                            <td>
                                                ${escapeHtml(
                                                    user.phone ||
                                                    "—"
                                                )}
                                            </td>

                                            <td>
                                                ${escapeHtml(
                                                    user.role ||
                                                    "client"
                                                )}
                                            </td>

                                            <td>
                                                ${escapeHtml(
                                                    user.status ||
                                                    "pending"
                                                )}
                                            </td>

                                        </tr>

                                    `;

                                })
                                .join("")
                        }

                    </tbody>

                </table>

            `;

        }

    } catch (error) {

        console.error(
            "Ошибка загрузки пользователей:",
            error
        );


        if (table) {

            table.innerHTML = `

                <div class="empty-table">

                    Не удалось загрузить
                    список пользователей.

                </div>

            `;

        }

    }
}


// ============================================================
// ВЫДАТЬ ДОСТУП
// ============================================================

async function grantPlatformAccess() {

    if (!window.currentUserIsManager) {
        return;
    }


    const userSelect =
        document.getElementById(
            "accessUserSelect"
        );

    const termSelect =
        document.getElementById(
            "accessTermSelect"
        );

    const message =
        document.getElementById(
            "accessAdminMessage"
        );


    const profileId =
        userSelect?.value;


    const term =
        termSelect?.value ||
        "unlimited";


    if (!profileId) {

        if (message) {

            message.textContent =
                "Выберите пользователя.";

        }

        return;
    }


    let endsAt = null;


    if (term !== "unlimited") {

        const date =
            new Date();

        date.setDate(
            date.getDate() +
            Number(term)
        );

        endsAt =
            date.toISOString();
    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from("access_periods")
                .insert({

                    profile_id:
                        profileId,

                    access_kind:
                        "platform",

                    status:
                        "active",

                    starts_at:
                        new Date()
                            .toISOString(),

                    ends_at:
                        endsAt,

                    is_unlimited:
                        term === "unlimited",

                    payment_status:
                        "paid"

                });


        if (error) {
            throw error;
        }


        if (message) {

            message.textContent =
                "Доступ успешно выдан.";

            message.style.color =
                "#a8e6b0";

        }


        await loadAdminUsers();

    } catch (error) {

        console.error(
            "Ошибка выдачи доступа:",
            error
        );


        if (message) {

            message.textContent =
                error.message ||
                "Не удалось выдать доступ.";

            message.style.color =
                "#ff9b9b";

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

    if (!contentCards) {
        return;
    }


    contentCards.innerHTML = `

        <div class="dashboard-wrap">

            <div class="dashboard-head">

                <div>

                    <h2>
                        Отчёты и статистика
                    </h2>

                    <p>
                        Основные показатели платформы.
                    </p>

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

                <div
                    id="sectionStats"
                    class="empty-table"
                >
                    Загрузка...
                </div>

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


        if (error) {
            throw error;
        }


        const counts = {

            manuals: 0,
            videos: 0,
            tests: 0,
            library: 0

        };


        (data || [])
            .forEach(function (item) {

                if (
                    Object.prototype
                        .hasOwnProperty
                        .call(
                            counts,
                            item.section
                        )
                ) {

                    counts[item.section]++;

                }

            });


        const total =
            Object.values(counts)
                .reduce(
                    function (a, b) {
                        return a + b;
                    },
                    0
                );


        const stats =
            document.getElementById(
                "platformStats"
            );


        if (stats) {

            stats.innerHTML = `

                <div class="stat-card">
                    <span>Материалы</span>
                    <strong>${total}</strong>
                </div>

                <div class="stat-card">
                    <span>Пособия</span>
                    <strong>${counts.manuals}</strong>
                </div>

                <div class="stat-card">
                    <span>Видео</span>
                    <strong>${counts.videos}</strong>
                </div>

                <div class="stat-card">
                    <span>Тесты</span>
                    <strong>${counts.tests}</strong>
                </div>

            `;

        }


        const sectionStats =
            document.getElementById(
                "sectionStats"
            );


        if (sectionStats) {

            sectionStats.innerHTML = `

                <table class="data-table">

                    <thead>

                        <tr>

                            <th>
                                Раздел
                            </th>

                            <th>
                                Количество
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>
                            <td>
                                Методические пособия
                            </td>
                            <td>
                                ${counts.manuals}
                            </td>
                        </tr>

                        <tr>
                            <td>
                                Видео
                            </td>
                            <td>
                                ${counts.videos}
                            </td>
                        </tr>

                        <tr>
                            <td>
                                Тесты
                            </td>
                            <td>
                                ${counts.tests}
                            </td>
                        </tr>

                        <tr>
                            <td>
                                Библиотека
                            </td>
                            <td>
                                ${counts.library}
                            </td>
                        </tr>

                    </tbody>

                </table>

            `;

        }

    } catch (error) {

        console.error(
            "Ошибка статистики:",
            error
        );

    }
}


// ============================================================
// ВХОД
// ============================================================

async function loginUser() {

    const email =
        document
            .getElementById(
                "loginEmail"
            )
            ?.value
            .trim()
            .toLowerCase();


    const password =
        document
            .getElementById(
                "loginPassword"
            )
            ?.value || "";


    const errorBox =
        document.getElementById(
            "loginError"
        );


    if (errorBox) {
        errorBox.textContent = "";
    }


    if (!email || !password) {

        if (errorBox) {

            errorBox.textContent =
                "Введите email и пароль.";

        }

        return;
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .signInWithPassword({

                    email:
                        email,

                    password:
                        password

                });


        if (error) {

            console.error(
                "Ошибка входа:",
                error
            );


            if (errorBox) {

                errorBox.textContent =
                    error.message ||
                    "Неверный email или пароль.";

            }

            return;
        }


        if (!data?.user) {

            if (errorBox) {

                errorBox.textContent =
                    "Не удалось выполнить вход.";

            }

            return;
        }


        updateLastActivity();

        location.reload();

    } catch (error) {

        console.error(
            "Ошибка входа:",
            error
        );


        if (errorBox) {

            errorBox.textContent =
                "Ошибка соединения с сервером.";

        }

    }
}


// ============================================================
// РЕГИСТРАЦИЯ
// ============================================================

async function registerUser() {

    const lastName =
        document
            .getElementById(
                "registerLastName"
            )
            ?.value
            .trim() || "";


    const firstName =
        document
            .getElementById(
                "registerFirstName"
            )
            ?.value
            .trim() || "";


    const middleName =
        document
            .getElementById(
                "registerMiddleName"
            )
            ?.value
            .trim() || "";


    const phone =
        document
            .getElementById(
                "registerPhone"
            )
            ?.value
            .trim() || "";


    const email =
        document
            .getElementById(
                "registerEmail"
            )
            ?.value
            .trim()
            .toLowerCase() || "";


    const password =
        document
            .getElementById(
                "registerPassword"
            )
            ?.value || "";


    const password2 =
        document
            .getElementById(
                "registerPassword2"
            )
            ?.value || "";


    const message =
        document.getElementById(
            "registerMessage"
        );


    function setMessage(
        text,
        success = false
    ) {

        if (!message) {
            return;
        }

        message.textContent =
            text;

        message.className =
            "auth-message " +
            (
                success
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


    if (password.length < 6) {

        setMessage(
            "Пароль должен содержать минимум 6 символов."
        );

        return;
    }


    if (password !== password2) {

        setMessage(
            "Пароли не совпадают."
        );

        return;
    }


    setMessage(
        "Создаю аккаунт...",
        true
    );


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .signUp({

                    email:
                        email,

                    password:
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

                        },

                        emailRedirectTo:
                            window.location.origin +
                            window.location.pathname

                    }

                });


        if (error) {

            console.error(
                "Ошибка регистрации:",
                error
            );


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
                    "Профиль не обновлён:",
                    profileError
                );

            }

        }


        if (data?.session) {

            setMessage(
                "Регистрация завершена. Сейчас откроется платформа.",
                true
            );


            setTimeout(
                function () {
                    location.reload();
                },
                900
            );


            return;
        }


        setMessage(
            "Регистрация создана. Подтвердите email и затем войдите. Доступ к разделам открывает администратор или нумеролог.",
            true
        );

    } catch (error) {

        console.error(
            "ОШИБКА РЕГИСТРАЦИИ:",
            error
        );


        setMessage(
            error.message ||
            "Не удалось подключиться к серверу регистрации."
        );

    }
}


// ============================================================
// ПОКАЗ ОКНА ВХОДА
// ============================================================

function showLogin(message = "") {

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
                    type="button"
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


// ============================================================
// РЕГИСТРАЦИЯ — ЭКРАН
// ============================================================

function showRegister(message = "") {

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
                    type="button"
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
// ВОССТАНОВЛЕНИЕ ПАРОЛЯ
// ============================================================

let resetSent = false;


function showForgotPassword() {

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


    resetSent = false;
}


// ============================================================
// ОТПРАВКА ВОССТАНОВЛЕНИЯ
// ============================================================

async function sendPasswordReset() {

    const email =
        document
            .getElementById(
                "resetEmail"
            )
            ?.value
            .trim()
            .toLowerCase();


    const message =
        document.getElementById(
            "resetMessage"
        );


    if (!email) {

        if (message) {

            message.textContent =
                "Введите ваш Email.";

            message.className =
                "auth-message error";

        }

        return;
    }


    if (resetSent) {

        if (message) {

            message.textContent =
                "Ссылка уже была отправлена. Проверьте почту.";

            message.className =
                "auth-message success";

        }

        return;
    }


    try {

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
            throw error;
        }


        resetSent = true;


        if (message) {

            message.textContent =
                "Ссылка для восстановления пароля отправлена на вашу почту.";

            message.className =
                "auth-message success";

        }

    } catch (error) {

        console.error(
            "Ошибка восстановления:",
            error
        );


        if (message) {

            message.textContent =
                error.message ||
                "Не удалось отправить письмо.";

            message.className =
                "auth-message error";

        }

    }
}


// ============================================================
// АВТОМАТИЧЕСКИЙ ВЫХОД
// ============================================================

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


    if (!lastActivity) {

        updateLastActivity();

        return;
    }


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


        try {

            await supabaseClient
                .auth
                .signOut();

        } catch (error) {

            console.error(
                "Ошибка автоматического выхода:",
                error
            );

        }


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


[
    "click",
    "keydown",
    "mousemove",
    "scroll",
    "touchstart"
].forEach(function (eventName) {

    document.addEventListener(
        eventName,
        function () {
            updateLastActivity();
        },
        {
            passive: true
        }
    );

});


document.addEventListener(
    "visibilitychange",
    function () {

        if (!document.hidden) {

            autoLogoutAfterInactivity();

        }

    }
);


// ============================================================
// ПРОВЕРКА АВТОРИЗАЦИИ
// ============================================================

async function checkAuth() {

    try {

        const {
            data: {
                session
            },
            error: sessionError
        } =
            await supabaseClient
                .auth
                .getSession();


        if (sessionError) {

            console.error(
                "Ошибка получения сессии:",
                sessionError
            );


            showLogin(
                "Не удалось проверить авторизацию."
            );

            return;
        }


        if (!session) {

            showLogin();

            return;
        }


        const user =
            session.user;


        window.currentUser =
            user;


        const userId =
            user.id;


        const userEmail =
            String(
                user.email || ""
            )
                .trim()
                .toLowerCase();


        // ------------------------------------------------------
        // ПРОФИЛЬ
        // ------------------------------------------------------

        let profile = null;


        const {
            data: profileData,
            error: profileError
        } =
            await supabaseClient
                .from("profiles")
                .select(`
                    role,
                    first_name,
                    last_name,
                    middle_name,
                    email,
                    phone,
                    status
                `)
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

        } else {

            profile =
                profileData;

        }


        // ------------------------------------------------------
        // ОПРЕДЕЛЯЕМ РОЛЬ
        // ------------------------------------------------------

        const role =
            String(
                profile?.role ||
                user.user_metadata?.role ||
                "client"
            )
                .trim()
                .toLowerCase();


        // ------------------------------------------------------
        // АДМИНИСТРАТОР
        //
        // Если в profiles уже стоит admin —
        // права администратора сохраняются.
        //
        // Для Центра Нумера дополнительно используем
        // email как резервное определение администратора.
        // ------------------------------------------------------

        const isManager =
            isManagerRole(role) ||
            isAdminEmail(userEmail);


        // ------------------------------------------------------
        // ДОСТУП
        // ------------------------------------------------------

        let hasAccess =
            false;


        if (isManager) {

            // Администратор видит всё
            hasAccess = true;

        } else {

            const {
                data: access,
                error: accessError
            } =
                await supabaseClient
                    .from("access_periods")
                    .select(`
                        id,
                        access_kind,
                        status,
                        starts_at,
                        ends_at,
                        is_unlimited,
                        payment_status
                    `)
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
                    );


            if (accessError) {

                console.error(
                    "Ошибка проверки доступа:",
                    accessError
                );

            } else {

                hasAccess =
                    (access || [])
                        .some(
                            hasActivePlatformAccess
                        );

            }

        }


        // ------------------------------------------------------
        // СОХРАНЯЕМ ПРАВА
        // ------------------------------------------------------

        window.currentUserRole =
            isManager
                ? "admin"
                : role;


        window.currentUserIsManager =
            isManager;


        window.currentUserHasAccess =
            hasAccess;


        // ------------------------------------------------------
        // ИМЯ
        // ------------------------------------------------------

        let displayName;


        if (isManager) {

            displayName =
                "Центр Нумера";

        } else {

            displayName =
                profile?.first_name ||
                profile?.last_name ||
                user.user_metadata?.first_name ||
                userEmail.split("@")[0] ||
                "Пользователь";

        }


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
                user.email ||
                "";

        }


        // ------------------------------------------------------
        // ПОКАЗЫВАЕМ СТРАНИЦУ
        // ------------------------------------------------------

        document.body.style.visibility =
            "visible";


        startInactivityTimer();


        setActiveSection(
            "calculators"
        );


        // ------------------------------------------------------
        // ПОКАЗЫВАЕМ ПЯТЬ КАЛЬКУЛЯТОРОВ
        // ------------------------------------------------------

        if (
            typeof renderCalculators ===
            "function"
        ) {

            renderCalculators();

        }

    } catch (error) {

        console.error(
            "Ошибка checkAuth:",
            error
        );


        showLogin(
            "Не удалось подключиться к платформе. Проверьте соединение и попробуйте ещё раз."
        );

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

    } catch (error) {

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


    window.currentUser =
        null;

    window.currentUserRole =
        "";

    window.currentUserIsManager =
        false;

    window.currentUserHasAccess =
        false;


    showLogin();
}


// ============================================================
// СТАРТ
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        checkAuth();

    }
);
