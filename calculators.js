// ===== КАЛЬКУЛЯТОРЫ =====

const METHOD_CARDS = [
    {
        key: 'adult',
        title: 'Взрослая<br>матрица',
        icon: '✦',
        description: 'Методическое пособие'
    },
    {
        key: 'child',
        title: 'Детская<br>матрица',
        icon: '👶',
        description: 'Методическое пособие'
    },
    {
        key: 'compatibility',
        title: 'Матрица<br>совместимости',
        icon: '💕',
        description: 'Методическое пособие'
    },
    {
        key: 'vedic',
        title: 'Ведическая<br>нумерология',
        icon: 'ॐ',
        description: 'Методическое пособие'
    },
    {
        key: 'pythagoras',
        title: 'Нумерология<br>по Пифагору',
        icon: 'pythagoras',
        description: 'Методическое пособие'
    }
];


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

    return String(value || '')
        .toLowerCase()
        .trim()
        .replace(/ё/g, 'е')
        .replace(/[«»"'`]/g, '')
        .replace(/\s+/g, ' ');
}


function renderMethodCards() {

    return METHOD_CARDS.map(function(card) {

        const icon =
            card.icon === 'pythagoras'
                ? pythagorasIconHtml()
                : `
                    <div class="card-icon">
                        ${card.icon}
                    </div>
                `;


        return `
            <div
                class="card method-card"
                onclick="openCalculator('${card.key}')"
                role="button"
                tabindex="0"
            >

                ${icon}

                <div class="card-content">

                    <h3>
                        ${card.title}
                    </h3>

                    <p>
                        ${card.description}
                    </p>

                </div>

            </div>
        `;

    }).join('');
}


function renderCalculators() {

    const contentCards =
        document.getElementById(
            'contentCards'
        );


    if (!contentCards) {
        return;
    }


    contentCards.innerHTML =
        renderMethodCards();
}


// ============================================================
// ОТКРЫТИЕ КАЛЬКУЛЯТОРА
// ============================================================

async function openCalculator(type) {

    if (
        !window.currentUserIsManager &&
        !window.currentUserHasAccess
    ) {

        showNoAccessMessage();

        return;
    }


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


    if (!window.currentUserIsManager) {

        const {
            data: access,
            error
        } =
            await supabaseClient
                .from('access_periods')
                .select(
                    `
                        id,
                        status,
                        payment_status,
                        starts_at,
                        ends_at,
                        is_unlimited
                    `
                )
                .eq(
                    'profile_id',
                    session.user.id
                )
                .eq(
                    'status',
                    'active'
                )
                .eq(
                    'payment_status',
                    'paid'
                )
                .limit(1)
                .maybeSingle();


        if (error || !access) {

            showNoAccessMessage();

            return;
        }


        if (
            !access.is_unlimited &&
            access.ends_at &&
            new Date(access.ends_at) < new Date()
        ) {

            showNoAccessMessage();

            return;
        }

    }


    const names = {

        adult:
            'Взрослая матрица',

        child:
            'Детская матрица',

        compatibility:
            'Матрица совместимости',

        vedic:
            'Ведическая нумерология',

        pythagoras:
            'Нумерология по Пифагору'

    };


    const title =
        names[type] ||
        'Расчёт';


    document.body.innerHTML = `

        <div
            style="
                min-height:100vh;
                padding:40px;
                background:
                    linear-gradient(
                        135deg,
                        #17102f,
                        #211443,
                        #17102f
                    );
                color:#f8e7a8;
                font-family:Arial,sans-serif;
            "
        >

            <div
                style="
                    max-width:650px;
                    margin:0 auto;
                    padding:35px;
                    border:1px solid #d7aa31;
                    border-radius:20px;
                    background:
                        linear-gradient(
                            145deg,
                            #302052,
                            #21163d
                        );
                "
            >

                <h1
                    style="
                        margin-top:0;
                        color:#f6d66c;
                        font-family:Georgia,serif;
                        font-weight:500;
                    "
                >
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
                        padding:13px;
                        margin:8px 0 20px;
                        box-sizing:border-box;
                        border:1px solid
                            rgba(225,180,52,.5);
                        border-radius:10px;
                        background:
                            rgba(0,0,0,.2);
                        color:#fff;
                        font-size:16px;
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
                        padding:13px;
                        margin:8px 0 5px;
                        box-sizing:border-box;
                        border:1px solid
                            rgba(225,180,52,.5);
                        border-radius:10px;
                        background:
                            rgba(0,0,0,.2);
                        color:#fff;
                        font-size:16px;
                    "
                >


                <div
                    id="dateError"
                    style="
                        color:#ff9b9b;
                        min-height:22px;
                        margin-bottom:15px;
                    "
                ></div>


                <button
                    onclick="calculate('${type}')"
                    style="
                        width:100%;
                        padding:14px;
                        border:1px solid #d7aa31;
                        border-radius:10px;
                        background:
                            linear-gradient(
                                90deg,
                                #713199,
                                #5d2789
                            );
                        color:#f8d96d;
                        font-size:16px;
                        cursor:pointer;
                    "
                >
                    Рассчитать
                </button>


                <button
                    onclick="returnToPlatform()"
                    style="
                        width:100%;
                        padding:14px;
                        margin-top:10px;
                        border:1px solid
                            rgba(225,180,52,.5);
                        border-radius:10px;
                        background:
                            rgba(0,0,0,.15);
                        color:#f5d46b;
                        font-size:16px;
                        cursor:pointer;
                    "
                >
                    Назад
                </button>


                <div
                    id="result"
                    style="
                        margin-top:30px;
                    "
                ></div>

            </div>

        </div>

    `;
}


// ============================================================
// ВОЗВРАТ НА ПЛАТФОРМУ
// ============================================================

function returnToPlatform() {

    location.reload();

}


// ============================================================
// ФОРМАТ ДАТЫ
// ============================================================

function formatBirthDate(input) {

    let value =
        input.value
            .replace(/\D/g, '');


    if (value.length > 8) {

        value =
            value.substring(0, 8);

    }


    if (value.length > 4) {

        value =
            value.substring(0, 2) +
            '.' +
            value.substring(2, 4) +
            '.' +
            value.substring(4);

    } else if (
        value.length > 2
    ) {

        value =
            value.substring(0, 2) +
            '.' +
            value.substring(2);

    }


    input.value =
        value;
}


// ============================================================
// ПРОВЕРКА ДАТЫ
// ============================================================

function isValidBirthDate(value) {

    const match =
        String(value || '')
            .match(
                /^(\d{2})\.(\d{2})\.(\d{4})$/
            );


    if (!match) {
        return false;
    }


    const day =
        Number(match[1]);

    const month =
        Number(match[2]);

    const year =
        Number(match[3]);


    if (
        year < 1900 ||
        year > 2100
    ) {

        return false;

    }


    const date =
        new Date(
            year,
            month - 1,
            day
        );


    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}


// ============================================================
// РАСЧЁТ
// ============================================================

function calculate(type) {

    const name =
        document
            .getElementById('name')
            ?.value
            .trim();


    const birthDate =
        document
            .getElementById('birthDate')
            ?.value
            .trim();


    const dateError =
        document.getElementById(
            'dateError'
        );


    const result =
        document.getElementById(
            'result'
        );


    if (dateError) {

        dateError.textContent =
            '';

    }


    if (result) {

        result.innerHTML =
            '';

    }


    if (!name) {

        if (dateError) {

            dateError.textContent =
                'Введите имя.';

        }

        return;
    }


    if (!isValidBirthDate(birthDate)) {

        if (dateError) {

            dateError.textContent =
                'Введите корректную дату рождения в формате ДД.ММ.ГГГГ.';

        }

        return;
    }


    if (!result) {
        return;
    }


    result.innerHTML = `

        <div
            style="
                padding:20px;
                border:1px solid
                    rgba(225,180,52,.5);
                border-radius:14px;
                background:
                    rgba(0,0,0,.12);
            "
        >

            <h3
                style="
                    margin-top:0;
                    color:#f6d66c;
                    font-family:Georgia,serif;
                "
            >
                ${titleForCalculator(type)}
            </h3>


            <p>
                Имя:
                <strong>
                    ${escapeCalculatorHtml(name)}
                </strong>
            </p>


            <p>
                Дата рождения:
                <strong>
                    ${escapeCalculatorHtml(birthDate)}
                </strong>
            </p>


            <p
                style="
                    margin-bottom:0;
                    color:#d9d0bd;
                "
            >
                Расчёт будет выполнен
                в соответствии с выбранной
                системой нумерологии.
            </p>

        </div>

    `;
}


// ============================================================
// НАЗВАНИЕ КАЛЬКУЛЯТОРА
// ============================================================

function titleForCalculator(type) {

    const names = {

        adult:
            'Взрослая матрица',

        child:
            'Детская матрица',

        compatibility:
            'Матрица совместимости',

        vedic:
            'Ведическая нумерология',

        pythagoras:
            'Нумерология по Пифагору'

    };


    return (
        names[type] ||
        'Расчёт'
    );
}


// ============================================================
// ЭКРАНИРОВАНИЕ
// ============================================================

function escapeCalculatorHtml(value) {

    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


// ============================================================
// НЕТ ДОСТУПА
// ============================================================

function showNoAccessMessage() {

    const contentCards =
        document.getElementById(
            'contentCards'
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
                Обратитесь к администратору
                или нумерологу для получения
                доступа к этому разделу.
            </p>

        </div>

    `;
}


// ============================================================
// СТАРТ
// ============================================================

document.addEventListener(
    'DOMContentLoaded',
    function () {

        if (
            window.currentUserIsManager ||
            window.currentUserHasAccess
        ) {

            renderCalculators();

        }

    }
);
