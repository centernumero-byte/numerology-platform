// ============================================================
// TESTS.JS
// ============================================================

const TESTS_TABLE = 'platform_tests';


// ============================================================
// РАЗДЕЛ ТЕСТОВ
// ============================================================

async function renderTests() {

    const contentCards =
        document.getElementById('contentCards');

    if (!contentCards) return;


    contentCards.innerHTML = `

        <div class="section-title">

            <h2>
                Тесты и практики
            </h2>

        </div>


        <div
            id="testsContainer"
            class="cards"
        >

            <div class="table-card">
                Загрузка...
            </div>

        </div>

    `;


    await loadTests();
}


// ============================================================
// ЗАГРУЗКА ТЕСТОВ
// ============================================================

async function loadTests() {

    const container =
        document.getElementById(
            'testsContainer'
        );

    if (!container) return;


    const {
        data,
        error
    } =
        await supabaseClient
            .from(TESTS_TABLE)
            .select('*')
            .order(
                'created_at',
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            'Ошибка загрузки тестов:',
            error
        );


        container.innerHTML = `

            <div class="table-card">

                <div class="empty-table">
                    Тесты пока недоступны.
                </div>

            </div>

        `;

        return;
    }


    const tests =
        data || [];


    if (!tests.length) {

        container.innerHTML = `

            <div class="table-card">

                <div class="empty-table">
                    Пока тестов нет.
                </div>

            </div>

        `;

        return;
    }


    container.innerHTML =
        tests
            .map(createTestCard)
            .join('');
}


// ============================================================
// КАРТОЧКА ТЕСТА
// ============================================================

function createTestCard(test) {

    const id =
        test.id || '';


    const title =
        test.title ||
        test.name ||
        'Тест';


    const description =
        test.description ||
        'Тест для самопознания';


    return `

        <div
            class="card"
            onclick="
                openTest('${escapeTestAttribute(id)}')
            "
        >

            <div class="card-icon">
                ✎
            </div>


            <div class="card-content">

                <h3>
                    ${escapeHtml(title)}
                </h3>


                <p>
                    ${escapeHtml(description)}
                </p>

            </div>

        </div>

    `;
}


// ============================================================
// ОТКРЫТИЕ ТЕСТА
// ============================================================

async function openTest(testId) {

    if (!testId) return;


    const {
        data: test,
        error
    } =
        await supabaseClient
            .from(TESTS_TABLE)
            .select('*')
            .eq(
                'id',
                testId
            )
            .maybeSingle();


    if (error || !test) {

        alert(
            'Не удалось открыть тест.'
        );

        return;
    }


    renderTestForm(test);
}


// ============================================================
// ФОРМА ТЕСТА
// ============================================================

function renderTestForm(test) {

    const contentCards =
        document.getElementById(
            'contentCards'
        );

    if (!contentCards) return;


    let questions =
        test.questions || [];


    if (
        typeof questions === 'string'
    ) {

        try {

            questions =
                JSON.parse(
                    questions
                );

        } catch (error) {

            questions = [];

        }

    }


    contentCards.innerHTML = `

        <div class="section-title">

            <h2>
                ${escapeHtml(
                    test.title ||
                    test.name ||
                    'Тест'
                )}
            </h2>

        </div>


        <div
            class="table-card"
            style="
                max-width:850px;
            "
        >

            ${
                test.description

                    ? `

                        <p
                            style="
                                color:#eee5d0;
                                line-height:1.6;
                            "
                        >
                            ${escapeHtml(
                                test.description
                            )}
                        </p>

                    `

                    : ''
            }


            <form
                id="testForm"
                onsubmit="
                    submitTest(event, '${escapeTestAttribute(test.id)}')
                "
            >

                ${
                    questions
                        .map(
                            function(question, index) {

                                return renderQuestion(
                                    question,
                                    index
                                );

                            }
                        )
                        .join('')
                }


                <button
                    type="submit"
                    class="material-manager-button"
                    style="
                        margin-top:20px;
                    "
                >
                    Завершить тест
                </button>


                <button
                    type="button"
                    class="material-manager-button"
                    style="
                        margin-top:10px;
                    "
                    onclick="
                        showSection('tests')
                    "
                >
                    Назад к тестам
                </button>

            </form>


            <div
                id="testResult"
                style="
                    margin-top:25px;
                "
            ></div>

        </div>

    `;
}


// ============================================================
// ВОПРОС
// ============================================================

function renderQuestion(
    question,
    index
) {

    const text =
        question.text ||
        question.question ||
        `Вопрос ${index + 1}`;


    const answers =
        question.answers ||
        question.options ||
        [];


    return `

        <div
            style="
                padding:20px 0;
                border-bottom:
                    1px solid
                    rgba(225,180,52,.18);
            "
        >

            <div
                style="
                    color:#f6d66c;
                    font-family:Georgia,serif;
                    font-size:19px;
                    margin-bottom:12px;
                "
            >

                ${index + 1}.
                ${escapeHtml(text)}

            </div>


            ${
                answers
                    .map(
                        function(answer, answerIndex) {

                            const value =
                                typeof answer ===
                                'object'

                                    ? (
                                        answer.value ??
                                        answer.text ??
                                        answer.title ??
                                        answerIndex
                                    )

                                    : answer;


                            const label =
                                typeof answer ===
                                'object'

                                    ? (
                                        answer.text ??
                                        answer.title ??
                                        answer.value ??
                                        ''
                                    )

                                    : answer;


                            return `

                                <label
                                    style="
                                        display:block;
                                        padding:9px 0;
                                        color:#eee5d0;
                                        cursor:pointer;
                                    "
                                >

                                    <input
                                        type="radio"
                                        name="question_${index}"
                                        value="${escapeTestAttribute(value)}"
                                        required
                                    >

                                    ${escapeHtml(label)}

                                </label>

                            `;

                        }
                    )
                    .join('')
            }

        </div>

    `;
}


// ============================================================
// ЗАВЕРШЕНИЕ ТЕСТА
// ============================================================

async function submitTest(
    event,
    testId
) {

    event.preventDefault();


    const form =
        event.target;


    const answers =
        {};


    form
        .querySelectorAll(
            'input[type="radio"]:checked'
        )
        .forEach(function(input) {

            answers[
                input.name
            ] =
                input.value;

        });


    const result =
        document.getElementById(
            'testResult'
        );


    /*
     * Пока сохраняем ответы локально.
     *
     * Система результатов конкретных тестов
     * будет подключена после создания структуры
     * самих тестов.
     */

    localStorage.setItem(
        'numerology_test_' + testId,
        JSON.stringify(answers)
    );


    if (result) {

        result.innerHTML = `

            <div
                class="table-card"
                style="
                    border-color:#d7aa31;
                "
            >

                <div class="table-title">
                    Тест завершён
                </div>

                <p
                    style="
                        color:#eee5d0;
                        line-height:1.6;
                    "
                >
                    Ваши ответы сохранены.
                    Результат теста будет показан
                    после подключения системы
                    интерпретации.
                </p>

            </div>

        `;

    }

}


// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

function escapeTestAttribute(value) {

    return String(value || '')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'");
}


if (
    typeof window.renderTests !==
    'function'
) {

    window.renderTests =
        renderTests;

}


window.openTest =
    openTest;

window.submitTest =
    submitTest;
