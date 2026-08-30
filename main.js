// =========================================================
// NUMEROLOGY PLATFORM — MAIN.JS
// Навигация + авторизация + проверка доступа
// =========================================================

window.currentUserRole = 'client';
window.currentUserIsManager = false;
window.currentUserHasAccess = false;


// =========================================================
// РОЛИ
// =========================================================

const MANAGER_ROLES = [
    'admin',
    'teacher',
    'numerologist',
    'нумеролог',
    'администратор'
];

function isManagerRole(role) {
    return MANAGER_ROLES.includes(
        String(role || '').toLowerCase()
    );
}


// =========================================================
// ПРОВЕРКА АКТИВНОГО ДОСТУПА
// =========================================================

function hasActivePlatformAccess(access) {
    if (!access) return false;

    if (
        String(access.status || '').toLowerCase() !== 'active'
    ) {
        return false;
    }

    if (
        String(access.payment_status || '').toLowerCase() !== 'paid'
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


// =========================================================
// АКТИВНЫЙ ПУНКТ МЕНЮ
// =========================================================

function setActiveSection(section) {

    document
        .querySelectorAll('.nav-item[data-section]')
        .forEach(function(button) {

            button.classList.toggle(
                'active',
                button.dataset.section === section
            );

        });
}


// =========================================================
// ЗАКРЫТЫЙ РАЗДЕЛ
// =========================================================

function renderLockedSection(section) {

    const contentCards =
        document.getElementById('contentCards');

    if (!contentCards) return;


    const titles = {

        calculators: 'Калькуляторы',

        manuals: 'Методические пособия',

        videos: 'Видео',

        tests: 'Тесты',

        library: 'Библиотека нумеролога',

        'my-calculations': 'Мои расчёты'

    };


    contentCards.innerHTML = `

        <div class="dashboard-wrap">

            <div class="dashboard-head">

                <div>

                    <h2>
                        ${titles[section] || 'Раздел платформы'}
                    </h2>

                    <p>
                        Раздел доступен после выдачи доступа.
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
                    в Numerology Platform.<br>

                    Чтобы открыть раздел,
                    администратор или нумеролог
                    должен выдать вам доступ.
                </div>


                <button
                    class="material-manager-button"
                    style="margin-top:24px;"
                    onclick="showSection('access')"
                >
                    Посмотреть статус доступа
                </button>

            </div>

        </div>

    `;
}


// =========================================================
// НАВИГАЦИЯ
// =========================================================

async function showSection(section) {

    const contentCards =
        document.getElementById('contentCards');

    if (!contentCards) return;


    setActiveSection(section);


    // Закрытые разделы проверяем ДО их загрузки

    const protectedSections = [

        'calculators',

        'manuals',

        'videos',

        'tests',

        'library',

        'my-calculations'

    ];


    if (
        !window.currentUserIsManager &&
        protectedSections.includes(section) &&
        !window.currentUserHasAccess
    ) {

        renderLockedSection(section);

        return;
    }


    // =====================================================
    // КАЛЬКУЛЯТОРЫ
    // =====================================================

    if (section === 'calculators') {

        renderCalculators();

        return;
    }


    // =====================================================
    // МЕТОДИЧЕСКИЕ ПОСОБИЯ
    // =====================================================

    if (section === 'manuals') {

        await loadManuals();

        return;
    }


    // =====================================================
    // ВИДЕО
    // =====================================================

    if (section === 'videos') {

        await loadVideos();

        return;
    }


    // =====================================================
    // ТЕСТЫ
    // =====================================================

    if (section === 'tests') {

        await renderTests();

        return;
    }


    // =====================================================
    // БИБЛИОТЕКА
    // =====================================================

    if (section === 'library') {

        await loadLibrary();

        return;
    }


    // =====================================================
    // МОИ РАСЧЁТЫ
    // =====================================================

    if (section === 'my-calculations') {

        renderMyCalculations();

        return;
    }


    // =====================================================
    // ДОСТУПЫ
    // =====================================================

    if (section === 'access') {

        await renderAccess();

        return;
    }


    // =====================================================
    // СТАТИСТИКА
    // =====================================================

    if (section === 'statistics') {

        await renderStatistics();

        return;
    }

}


// =========================================================
// АВТОРИЗАЦИЯ
// =========================================================

async function checkAuth() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    // Нет авторизации

    if (!session) {

        showLogin();

        return;
    }


    const userId = session.user.id;


    // =====================================================
    // ПРОФИЛЬ
    // =====================================================

    const {
        data: profile,
        error: profileError
    } = await supabaseClient

        .from('profiles')

        .select(`
            role,
            first_name,
            last_name,
            middle_name,
            email,
            phone,
            status
        `)

        .eq('id', userId)

        .maybeSingle();


    if (profileError) {

        console.error(
            'Ошибка загрузки профиля:',
            profileError
        );

    }


    // =====================================================
    // РОЛЬ
    // =====================================================

    const role = String(

        profile?.role ||

        session.user.user_metadata?.role ||

        'client'

    ).toLowerCase();


    const isManager =
        isManagerRole(role);


    let hasAccess = false;


    // =====================================================
    // АДМИНИСТРАТОР / НУМЕРОЛОГ
    // =====================================================

    if (isManager) {

        hasAccess = true;

    }

    // =====================================================
    // КЛИЕНТ
    // =====================================================

    else {

        const {
            data: access,
            error: accessError
        } = await supabaseClient

            .from('access_periods')

            .select(`
                id,
                access_kind,
                status,
                starts_at,
                ends_at,
                is_unlimited,
                payment_status
            `)

            .eq('profile_id', userId)

            .eq('access_kind', 'platform')

            .order(
                'starts_at',
                {
                    ascending: false
                }
            )

            .limit(10);


        if (accessError) {

            console.error(
                'Ошибка проверки доступа:',
                accessError
            );

        }

        else {

            hasAccess =
                (access || [])
                    .some(hasActivePlatformAccess);

        }

    }


    // =====================================================
    // СОХРАНЯЕМ СОСТОЯНИЕ
    // =====================================================

    window.currentUserRole =
        role;

    window.currentUserIsManager =
        isManager;

    window.currentUserHasAccess =
        hasAccess;


    // =====================================================
    // ТАЙМЕР БЕЗДЕЙСТВИЯ
    // =====================================================

    startInactivityTimer();


    document.body.style.visibility =
        'visible';


    // =====================================================
    // ИМЯ И EMAIL
    // =====================================================

    const displayName =

        profile?.first_name ||

        profile?.last_name ||

        session.user.user_metadata?.first_name ||

        session.user.email?.split('@')[0] ||

        'Пользователь';


    const nameNode =
        document.getElementById('clientName');


    const emailNode =
        document.getElementById('clientEmail');


    if (nameNode) {

        nameNode.textContent =
            displayName;

    }


    if (emailNode) {

        emailNode.textContent =

            profile?.email ||

            session.user.email ||

            '';

    }


    // =====================================================
    // ПОСЛЕ ВХОДА — КАЛЬКУЛЯТОРЫ
    // =====================================================

    setActiveSection(
        'calculators'
    );


    renderCalculators();

}


// =========================================================
// ВЫХОД
// =========================================================

async function logoutUser() {

    try {

        await supabaseClient.auth.signOut();

    }

    catch (error) {

        console.error(
            'Ошибка выхода:',
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
// АВТОМАТИЧЕСКИЙ ВЫХОД
// =========================================================

const INACTIVITY_LIMIT =
    60 * 60 * 1000;

const LAST_ACTIVITY_KEY =
    'numerology_last_activity';


let inactivityTimer = null;


function updateLastActivity() {

    localStorage.setItem(
        LAST_ACTIVITY_KEY,
        String(Date.now())
    );


    clearTimeout(
        inactivityTimer
    );


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


        await supabaseClient
            .auth
            .signOut();


        showLogin();

        return;

    }


    clearTimeout(
        inactivityTimer
    );


    inactivityTimer = setTimeout(

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
        Date.now() - lastActivity >=
        INACTIVITY_LIMIT
    ) {

        autoLogoutAfterInactivity();

        return;

    }


    updateLastActivity();

}


// =========================================================
// ОТСЛЕЖИВАНИЕ АКТИВНОСТИ
// =========================================================

[
    'click',
    'keydown',
    'mousemove',
    'scroll',
    'touchstart'
].forEach(function(eventName) {

    document.addEventListener(
        eventName,
        function() {

            updateLastActivity();

        },
        {
            passive: true
        }
    );

});


// =========================================================
// ВОЗВРАТ НА ВКЛАДКУ
// =========================================================

document.addEventListener(
    'visibilitychange',
    function() {

        if (!document.hidden) {

            autoLogoutAfterInactivity();

        }

    }
);


// =========================================================
// ЗАПУСК
// =========================================================

document.addEventListener(
    'DOMContentLoaded',
    function() {

        checkAuth();

    }
);
