// ============================================================
// MAIN.JS
// Авторизация • навигация • роли • доступы
// ============================================================

window.currentUserRole = 'client';
window.currentUserIsManager = false;
window.currentUserHasAccess = false;

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

function setActiveSection(section) {
    document
        .querySelectorAll('.nav-item[data-section]')
        .forEach(function (button) {
            button.classList.toggle(
                'active',
                button.dataset.section === section
            );
        });
}

async function showSection(section) {

    setActiveSection(section);

    const contentCards =
        document.getElementById('contentCards');

    if (!contentCards) return;

    if (section === 'calculators') {
        if (typeof renderCalculators === 'function') {
            renderCalculators();
        }
        return;
    }

    if (section === 'manuals') {
        if (typeof loadManuals === 'function') {
            await loadManuals();
        }
        return;
    }

    if (section === 'videos') {
        if (typeof loadVideos === 'function') {
            await loadVideos();
        }
        return;
    }

    if (section === 'tests') {
        if (typeof renderTests === 'function') {
            await renderTests();
        }
        return;
    }

    if (section === 'library') {
        if (typeof loadLibrary === 'function') {
            await loadLibrary();
        }
        return;
    }

    if (section === 'my-calculations') {
        if (typeof renderMyCalculations === 'function') {
            await renderMyCalculations();
        }
        return;
    }

    if (section === 'access') {
        if (typeof renderAccess === 'function') {
            await renderAccess();
        }
        return;
    }

    if (section === 'statistics') {
        if (typeof renderStatistics === 'function') {
            await renderStatistics();
        }
        return;
    }
}

async function checkAuth() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {
        if (typeof showLogin === 'function') {
            showLogin();
        }
        return;
    }

    const userId = session.user.id;

    const {
        data: profile
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

    const role = String(
        profile?.role ||
        session.user.user_metadata?.role ||
        'client'
    ).toLowerCase();

    const isManager =
        isManagerRole(role);

    let hasAccess = false;

    if (isManager) {

        hasAccess = true;

    } else {

        const {
            data: access
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
            .order(
                'starts_at',
                { ascending: false }
            );

        hasAccess =
            (access || []).some(function (item) {

                if (
                    String(item.status || '').toLowerCase() !==
                    'active'
                ) {
                    return false;
                }

                if (
                    item.payment_status &&
                    String(item.payment_status).toLowerCase() !==
                    'paid'
                ) {
                    return false;
                }

                if (
                    !item.is_unlimited &&
                    item.ends_at &&
                    new Date(item.ends_at) < new Date()
                ) {
                    return false;
                }

                return true;
            });
    }

    window.currentUserRole = role;
    window.currentUserIsManager = isManager;
    window.currentUserHasAccess = hasAccess;

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
        nameNode.textContent = displayName;
    }

    if (emailNode) {
        emailNode.textContent =
            profile?.email ||
            session.user.email ||
            '';
    }

    document.body.style.visibility = 'visible';

    startInactivityTimer();

    setActiveSection('calculators');

    if (typeof renderCalculators === 'function') {
        renderCalculators();
    }
}

async function logoutUser() {

    await supabaseClient.auth.signOut();

    localStorage.removeItem(
        LAST_ACTIVITY_KEY
    );

    clearTimeout(
        inactivityTimer
    );

    if (typeof showLogin === 'function') {
        showLogin();
    }
}


// ============================================================
// ВХОД
// ============================================================

async function loginUser() {

    const email =
        document.getElementById(
            'loginEmail'
        )?.value.trim();

    const password =
        document.getElementById(
            'loginPassword'
        )?.value || '';

    const errorBox =
        document.getElementById(
            'loginError'
        );

    if (errorBox) {
        errorBox.textContent = '';
    }

    if (!email || !password) {

        if (errorBox) {
            errorBox.textContent =
                'Введите email и пароль.';
        }

        return;
    }

    const {
        error
    } =
        await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

    if (error) {

        if (errorBox) {
            errorBox.textContent =
                'Неверный email или пароль.';
        }

        return;
    }

    updateLastActivity();

    location.reload();
}


// ============================================================
// ВОССТАНОВЛЕНИЕ ПАРОЛЯ
// ============================================================

async function sendPasswordReset() {

    const email =
        document.getElementById(
            'resetEmail'
        )?.value.trim();

    const message =
        document.getElementById(
            'resetMessage'
        );

    if (!email) {

        if (message) {
            message.textContent =
                'Введите ваш Email.';
        }

        return;
    }

    const {
        error
    } =
        await supabaseClient.auth.resetPasswordForEmail(
            email,
            {
                redirectTo:
                    window.location.origin +
                    window.location.pathname
            }
        );

    if (error) {

        if (message) {
            message.textContent =
                'Не удалось отправить письмо.';
        }

        return;
    }

    if (message) {
        message.textContent =
            'Ссылка для восстановления пароля отправлена на вашу почту.';
    }
}


// ============================================================
// БЕЗОПАСНЫЙ ВЫВОД
// ============================================================

function escapeHtml(value) {

    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


// ============================================================
// АВТОВЫХОД
// ============================================================

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
        Date.now() - lastActivity;

    if (
        inactiveTime >=
        INACTIVITY_LIMIT
    ) {

        localStorage.removeItem(
            LAST_ACTIVITY_KEY
        );

        await supabaseClient.auth.signOut();

        if (typeof showLogin === 'function') {
            showLogin();
        }

        return;
    }

    clearTimeout(
        inactivityTimer
    );

    inactivityTimer =
        setTimeout(
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

[
    'click',
    'keydown',
    'mousemove',
    'scroll',
    'touchstart'
].forEach(function (eventName) {

    document.addEventListener(
        eventName,
        updateLastActivity,
        { passive: true }
    );

});

document.addEventListener(
    'visibilitychange',
    function () {

        if (!document.hidden) {
            autoLogoutAfterInactivity();
        }

    }
);


// ============================================================
// СТАРТ
// ============================================================

document.addEventListener(
    'DOMContentLoaded',
    function () {

        checkAuth();

    }
);
