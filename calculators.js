// ============================================================
// CALCULATORS.JS
// КАЛЬКУЛЯТОРЫ NUMEROLOGY PLATFORM
// ============================================================


// ============================================================
// НАЗВАНИЯ КАЛЬКУЛЯТОРОВ
// ============================================================

const CALCULATOR_NAMES = {

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


// ============================================================
// ОТКРЫТИЕ КАЛЬКУЛЯТОРА
// ============================================================

async function openCalculator(type) {

    // Проверяем авторизацию

    const {
        data: {
            session
        }
    } =
        await supabaseClient
            .auth
            .getSession();


    if (!session) {

        if (
            typeof showLogin ===
            "function"
        ) {

            showLogin();

        }

        return;

    }


    // Проверяем доступ к платформе

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


    // Проверяем срок доступа

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


    const title =
        CALCULATOR_NAMES[type] ||
        "Расчёт";


    // ========================================================
    // ФОРМА КАЛЬКУЛЯТОРА
    // ========================================================

    document.body.innerHTML = `

        <div
            style="
                max-width:600px;
                margin:50px auto;
                padding:30px;
                font-family:Arial;
                box-sizing:border-box;
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
                placeholder="Введите имя"
                style="
                    display:block;
                    width:100%;
                    padding:12px;
                    margin:8px 0 20px;
                    box-sizing:border-box;
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
                    margin:8px 0 10px;
                    box-sizing:border-box;
                "
            >


            <div
                id="dateError"
                style="
                    color:red;
                    margin-bottom:15px;
                "
            ></div>


            <button
                onclick="
                    calculate('${type}')
                "
                style="
                    padding:12px 25px;
                    cursor:pointer;
                    margin-right:8px;
                "
            >
                Рассчитать
            </button>


            <button
                onclick="
                    returnToPlatform()
                "
                style="
                    padding:12px 25px;
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

    `;

}


// ============================================================
// ФОРМАТ ДАТЫ ДД.ММ.ГГГГ
// ============================================================

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


// ============================================================
// РАСЧЁТ
// ============================================================

function calculate(type) {

    const nameElement =
        document.getElementById(
            "name"
        );


    const birthDateElement =
        document.getElementById(
            "birthDate"
        );


    const dateError =
        document.getElementById(
            "dateError"
        );


    const result =
        document.getElementById(
            "result"
        );


    const name =
        nameElement
            ? nameElement.value.trim()
            : "";


    const birthDate =
        birthDateElement
            ? birthDateElement.value.trim()
            : "";


    if (dateError) {

        dateError.textContent =
            "";

    }


    if (result) {

        result.innerHTML =
            "";

    }


    // --------------------------------------------------------
    // ПРОВЕРКА ИМЕНИ
    // --------------------------------------------------------

    if (!name) {

        if (dateError) {

            dateError.textContent =
                "Введите имя.";

        }

        return;

    }


    // --------------------------------------------------------
    // ПРОВЕРКА ДАТЫ
    // --------------------------------------------------------

    if (!birthDate) {

        if (dateError) {

            dateError.textContent =
                "Введите дату рождения.";

        }

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

        if (dateError) {

            dateError.textContent =
                "Введите дату рождения в формате ДД.ММ.ГГГГ.";

        }

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


    // --------------------------------------------------------
    // ПРОВЕРКА ГОДА
    // --------------------------------------------------------

    if (

        year < 1900 ||

        year >
        new Date()
            .getFullYear()

    ) {

        if (dateError) {

            dateError.textContent =
                "Введите корректный год рождения.";

        }

        return;

    }


    // --------------------------------------------------------
    // ПРОВЕРКА КАЛЕНДАРНОЙ ДАТЫ
    // --------------------------------------------------------

    const date =
        new Date(
            year,
            month - 1,
            day
        );


    if (

        date.getFullYear() !== year ||

        date.getMonth() !==
            month - 1 ||

        date.getDate() !== day

    ) {

        if (dateError) {

            dateError.textContent =
                "Введите корректную дату рождения.";

        }

        return;

    }


    // ========================================================
    // ПОКА ПОКАЗЫВАЕМ ПРИНЯТЫЕ ДАННЫЕ
    //
    // Реальные Apps Script калькуляторы подключим отдельно.
    // Здесь специально ничего не выдумываем.
    // ========================================================

    if (result) {

        result.innerHTML = `

            <h2>
                Данные приняты
            </h2>


            <p>
                <strong>
                    Калькулятор:
                </strong>

                ${
                    CALCULATOR_NAMES[type] ||
                    "Расчёт"
                }
            </p>


            <p>
                <strong>
                    Имя:
                </strong>

                ${escapeCalculatorHtml(name)}
            </p>


            <p>
                <strong>
                    Дата рождения:
                </strong>

                ${escapeCalculatorHtml(birthDate)}
            </p>

        `;

    }

}


// ============================================================
// ВОЗВРАТ В ПЛАТФОРМУ
// ============================================================

function returnToPlatform() {

    location.reload();

}


// ============================================================
// ЗАЩИТА ВЫВОДА HTML
// ============================================================

function escapeCalculatorHtml(value) {

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
