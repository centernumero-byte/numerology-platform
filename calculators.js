// ============================================================
// CALCULATORS.JS
// ============================================================

const CALCULATOR_NAMES = {
    adult: 'Взрослая матрица',
    child: 'Детская матрица',
    compatibility: 'Матрица совместимости',
    vedic: 'Ведическая нумерология',
    pythagoras: 'Квадрат Пифагора'
};


// ============================================================
// КАРТОЧКИ КАЛЬКУЛЯТОРОВ
// ============================================================

function renderCalculators() {

    const contentCards =
        document.getElementById('contentCards');

    if (!contentCards) return;

    contentCards.innerHTML = `

        <div class="cards">

            <div
                class="card"
                onclick="openCalculator('adult')"
            >
                <div class="card-icon">
                    ✦
                </div>

                <div class="card-content">
                    <h3>
                        Взрослая<br>
                        матрица
                    </h3>

                    <p>
                        Полный расчёт<br>
                        по дате рождения
                    </p>
                </div>
            </div>


            <div
                class="card"
                onclick="openCalculator('child')"
            >
                <div class="card-icon">
                    👶
                </div>

                <div class="card-content">
                    <h3>
                        Детская<br>
                        матрица
                    </h3>

                    <p>
                        Анализ и расчёт<br>
                        детской матрицы
                    </p>
                </div>
            </div>


            <div
                class="card"
                onclick="openCalculator('compatibility')"
            >
                <div class="card-icon">
                    💕
                </div>

                <div class="card-content">
                    <h3>
                        Матрица<br>
                        совместимости
                    </h3>

                    <p>
                        Анализ отношений<br>
                        двух людей
                    </p>
                </div>
            </div>


            <div
                class="card"
                onclick="openCalculator('vedic')"
            >
                <div class="card-icon">
                    ॐ
                </div>

                <div class="card-content">
                    <h3>
                        Ведическая<br>
                        нумерология
                    </h3>

                    <p>
                        Расчёт по ведической<br>
                        системе
                    </p>
                </div>
            </div>


            <div
                class="card"
                onclick="openCalculator('pythagoras')"
            >
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

                <div class="card-content">
                    <h3>
                        Квадрат<br>
                        Пифагора
                    </h3>

                    <p>
                        Психоматрица<br>
                        по Пифагору
                    </p>
                </div>
            </div>

        </div>
    `;
}


// ============================================================
// ОТКРЫТИЕ КАЛЬКУЛЯТОРА
// ============================================================

function openCalculator(type) {

    const title =
        CALCULATOR_NAMES[type] ||
        'Калькулятор';


    const contentCards =
        document.getElementById('contentCards');

    if (!contentCards) return;


    contentCards.innerHTML = `

        <div class="section-title">

            <h2>
                ${title}
            </h2>

        </div>


        <div
            class="table-card"
            style="
                max-width:700px;
                margin-top:20px;
            "
        >

            <label>
                Имя
            </label>

            <input
                id="calculatorName"
                type="text"
                class="material-manager-input"
                placeholder="Введите имя"
            >


            <label>
                Дата рождения
            </label>

            <input
                id="calculatorBirthDate"
                type="text"
                class="material-manager-input"
                placeholder="ДД.ММ.ГГГГ"
                maxlength="10"
                inputmode="numeric"
                oninput="formatCalculatorDate(this)"
            >


            <div
                id="calculatorError"
                class="auth-message error"
            ></div>


            <div
                style="
                    display:flex;
                    gap:10px;
                    margin-top:15px;
                "
            >

                <button
                    class="material-manager-button"
                    onclick="
                        calculateCalculator('${type}')
                    "
                >
                    Рассчитать
                </button>


                <button
                    class="material-manager-button"
                    onclick="
                        showSection('calculators')
                    "
                >
                    Назад
                </button>

            </div>


            <div
                id="calculatorResult"
                style="
                    margin-top:25px;
                "
            ></div>

        </div>

    `;
}


// ============================================================
// ДАТА
// ============================================================

function formatCalculatorDate(input) {

    let value =
        String(
            input.value || ''
        ).replace(
            /\D/g,
            ''
        );


    if (value.length > 8) {

        value =
            value.substring(
                0,
                8
            );

    }


    if (value.length > 4) {

        value =
            value.substring(0,2) +
            '.' +
            value.substring(2,4) +
            '.' +
            value.substring(4);

    } else if (value.length > 2) {

        value =
            value.substring(0,2) +
            '.' +
            value.substring(2);

    }


    input.value = value;
}


// ============================================================
// ПРОВЕРКА ДАТЫ
// ============================================================

function isValidCalculatorDate(value) {

    const parts =
        String(value || '').split('.');


    if (
        parts.length !== 3 ||
        parts[0].length !== 2 ||
        parts[1].length !== 2 ||
        parts[2].length !== 4
    ) {
        return false;
    }


    const day =
        Number(parts[0]);

    const month =
        Number(parts[1]);

    const year =
        Number(parts[2]);


    if (
        day < 1 ||
        month < 1 ||
        month > 12 ||
        year < 1900 ||
        year > new Date().getFullYear()
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

async function calculateCalculator(type) {

    const name =
        document.getElementById(
            'calculatorName'
        )?.value.trim() || '';


    const birthDate =
        document.getElementById(
            'calculatorBirthDate'
        )?.value.trim() || '';


    const error =
        document.getElementById(
            'calculatorError'
        );


    const result =
        document.getElementById(
            'calculatorResult'
        );


    if (error) {
        error.textContent = '';
    }


    if (result) {
        result.innerHTML = '';
    }


    if (!name) {

        if (error) {
            error.textContent =
                'Введите имя.';
        }

        return;
    }


    if (!isValidCalculatorDate(birthDate)) {

        if (error) {
            error.textContent =
                'Введите корректную дату в формате ДД.ММ.ГГГГ.';
        }

        return;
    }


    /*
     * Здесь будет подключение конкретного
     * Apps Script каждого калькулятора.
     *
     * Ссылки НЕ прописываем в коде.
     * Они будут храниться в платформе.
     */


    if (result) {

        result.innerHTML = `

            <div class="table-card">

                <div class="table-title">
                    ${escapeCalculatorHtml(
                        CALCULATOR_NAMES[type] ||
                        'Расчёт'
                    )}
                </div>

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

                <p>
                    Ссылка на калькулятор
                    будет подключена через
                    настройки платформы.
                </p>

            </div>

        `;
    }
}


// ============================================================
// ЗАЩИТА HTML
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
// СТАРТОВАЯ ОТРИСОВКА
// ============================================================

if (
    document.readyState === 'loading'
) {

    document.addEventListener(
        'DOMContentLoaded',
        function () {

            if (
                typeof renderCalculators ===
                'function'
            ) {
                renderCalculators();
            }

        }
    );

} else {

    renderCalculators();

}
