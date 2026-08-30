// ===== МЕТОДИЧЕСКИЕ ПОСОБИЯ =====
// Вся логика раздела находится здесь.
// Используются:
//   Supabase table: materials
//   Supabase Storage bucket: methodicals

const MANUALS_BUCKET = 'methodicals';

const MANUAL_DIRECTIONS = [
    { key: 'adult', icon: '✦', title: 'Взрослая матрица' },
    { key: 'child', icon: '👶', title: 'Детская матрица' },
    { key: 'compatibility', icon: '💕', title: 'Матрица совместимости' },
    { key: 'vedic', icon: 'ॐ', title: 'Ведическая нумерология' },
    { key: 'pythagoras', icon: '🔢', title: 'Квадрат Пифагора' }
];

function manualEscape(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function manualDirectionFromText(value) {
    const text = String(value || '').toLowerCase();

    if (text.includes('взросл') || text.includes('adult')) {
        return 'adult';
    }

    if (text.includes('детск') || text.includes('child')) {
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

function manualIconHtml(item) {

    if (item.key === 'pythagoras') {

        return `
            <div class="card-icon pythagoras-icon">
                <span>1</span><span>4</span><span>7</span>
                <span>2</span><span>5</span><span>8</span>
                <span>3</span><span>6</span><span>9</span>
            </div>
        `;
    }

    return `
        <div class="card-icon">
            ${item.icon}
        </div>
    `;
}


// =====================================================
// ЗАГРУЗКА РАЗДЕЛА «МЕТОДИЧЕСКИЕ ПОСОБИЯ»
// =====================================================

async function loadManuals() {

    const contentCards =
        document.getElementById('contentCards');

    if (!contentCards) {
        return;
    }

    contentCards.innerHTML = `
        <div class="section-title">
            <h2>Методические пособия</h2>
        </div>

        <div class="cards" id="manualCards">

            ${MANUAL_DIRECTIONS.map(item => `

                <div
                    class="card method-card"
                    onclick="openManual(
                        '${item.key}',
                        '${manualEscape(item.title)}'
                    )"
                >

                    ${manualIconHtml(item)}

                    <div class="card-content">

                        <h3>
                            ${manualEscape(item.title)}
                        </h3>

                        <p>
                            Методическое пособие
                        </p>

                    </div>

                </div>

            `).join('')}

        </div>
    `;
}


// =====================================================
// ОКНО ДОБАВЛЕНИЯ МЕТОДИЧЕСКОГО ПОСОБИЯ
// =====================================================

function openManual(direction, title) {

    const old =
        document.getElementById('manualWindow');

    if (old) {
        old.remove();
    }

    const box =
        document.createElement('div');

    box.id = 'manualWindow';

    box.innerHTML = `

        <div class="material-manager-overlay">

            <div class="material-manager">

                <button
                    class="material-manager-close"
                    onclick="
                        document
                            .getElementById('manualWindow')
                            .remove()
                    "
                >
                    ×
                </button>


                <h2>
                    ${manualEscape(title)}
                </h2>


                <!-- ССЫЛКА -->

                <label>
                    Вставить ссылку:
                </label>

                <input
                    id="manualUrlInput"
                    type="url"
                    placeholder="https://..."
                    class="material-manager-input"
                >


                <button
                    class="material-manager-button"
                    onclick="
                        saveManualLink(
                            '${direction}',
                            '${manualEscape(title)}'
                        )
                    "
                >
                    🔗 Сохранить ссылку
                </button>


                <div class="material-manager-or">
                    или
                </div>


                <!-- ФАЙЛ -->

                <label>
                    Загрузить файл:
                </label>

                <input
                    id="manualFileInput"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    class="material-manager-input"
                >


                <button
                    class="material-manager-button"
                    onclick="
                        uploadManualFile(
                            '${direction}',
                            '${manualEscape(title)}'
                        )
                    "
                >
                    📁 Загрузить файл
                </button>


                <!-- СООБЩЕНИЕ -->

                <div
                    id="manualActionMessage"
                    style="
                        margin-top:15px;
                        font-size:14px;
                        line-height:1.5;
                    "
                ></div>

            </div>

        </div>

    `;

    document.body.appendChild(box);
}


// =====================================================
// СООБЩЕНИЕ В ОКНЕ
// =====================================================

function setManualMessage(
    text,
    ok = false
) {

    const node =
        document.getElementById(
            'manualActionMessage'
        );

    if (!node) {
        return;
    }

    node.textContent = text;

    node.style.color =
        ok
            ? '#b9f6ca'
            : '#ffb4b4';
}


// =====================================================
// СОХРАНЕНИЕ ССЫЛКИ
// =====================================================

async function saveManualLink(
    direction,
    title
) {

    const input =
        document.getElementById(
            'manualUrlInput'
        );

    const url =
        input
            ? input.value.trim()
            : '';


    if (!url) {

        setManualMessage(
            'Вставьте ссылку.'
        );

        return;
    }


    // Проверяем, что это действительно URL

    try {

        new URL(url);

    } catch (e) {

        setManualMessage(
            'Введите корректную ссылку, начинающуюся с https://'
        );

        return;
    }


    setManualMessage(
        'Сохраняю...',
        true
    );


    // Проверяем авторизацию

    const {
        data: { session }
    } =
        await supabaseClient.auth.getSession();


    if (!session) {

        setManualMessage(
            'Сессия закончилась. Войдите в платформу заново.'
        );

        return;
    }


    // Записываем ссылку в таблицу materials

    const { error } =
        await supabaseClient
            .from('materials')
            .insert({

                section: 'manuals',

                title: title,

                type: 'Методическое пособие',

                method: direction,

                description:
                    'Методическое пособие',

                external_url: url,

                file_url: null

            });


    if (error) {

        console.error(
            'Ошибка сохранения методического пособия:',
            error
        );

        setManualMessage(
            'Не удалось сохранить ссылку: ' +
            (
                error.message ||
                'ошибка Supabase'
            )
        );

        return;
    }


    setManualMessage(
        'Ссылка сохранена.',
        true
    );


    // Закрываем окно и обновляем раздел

    setTimeout(
        async () => {

            const modal =
                document.getElementById(
                    'manualWindow'
                );

            if (modal) {
                modal.remove();
            }

            await loadManuals();

        },
        700
    );
}


// =====================================================
// ЗАГРУЗКА PDF / DOC / DOCX
// =====================================================

async function uploadManualFile(
    direction,
    title
) {

    const input =
        document.getElementById(
            'manualFileInput'
        );


    if (
        !input ||
        !input.files ||
        !input.files.length
    ) {

        setManualMessage(
            'Сначала выберите PDF, DOC или DOCX файл.'
        );

        return;
    }


    const file =
        input.files[0];


    // Разрешённые MIME-типы

    const allowedTypes = [

        'application/pdf',

        'application/msword',

        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

    ];


    const extension =
        String(
            file.name
                .split('.')
                .pop() || ''
        ).toLowerCase();


    // Дополнительно проверяем расширение

    if (
        !allowedTypes.includes(file.type) &&
        ![
            'pdf',
            'doc',
            'docx'
        ].includes(extension)
    ) {

        setManualMessage(
            'Можно загрузить только PDF, DOC или DOCX.'
        );

        return;
    }


    // Проверяем авторизацию

    const {
        data: { session }
    } =
        await supabaseClient.auth.getSession();


    if (!session) {

        setManualMessage(
            'Сессия закончилась. Войдите в платформу заново.'
        );

        return;
    }


    setManualMessage(
        'Загружаю файл...',
        true
    );


    // Безопасное имя файла

    const safeName =
        file.name

            .replace(
                /[^\wа-яА-ЯёЁ.\- ]+/g,
                '_'
            )

            .replace(
                /\s+/g,
                '_'
            );


    // Путь внутри Storage

    const filePath =
        `${direction}/${session.user.id}/${Date.now()}_${safeName}`;


    // =================================================
    // ЗАГРУЗКА В SUPABASE STORAGE
    // =================================================

    const {
        error: uploadError
    } =
        await supabaseClient

            .storage

            .from(MANUALS_BUCKET)

            .upload(
                filePath,
                file,
                {

                    cacheControl: '3600',

                    upsert: false,

                    contentType:
                        file.type ||
                        undefined

                }
            );


    if (uploadError) {

        console.error(
            'Ошибка загрузки файла в Storage:',
            uploadError
        );

        setManualMessage(
            'Файл не загрузился: ' +
            (
                uploadError.message ||
                'ошибка Storage'
            )
        );

        return;
    }


    // =================================================
    // СОХРАНЕНИЕ ИНФОРМАЦИИ В ТАБЛИЦУ MATERIALS
    // =================================================

    const {
        error: dbError
    } =
        await supabaseClient

            .from('materials')

            .insert({

                section: 'manuals',

                title: title,

                type: 'Методическое пособие',

                method: direction,

                description:
                    'Методическое пособие',

                external_url: null,

                file_url: filePath

            });


    if (dbError) {

        console.error(
            'Ошибка записи материала в таблицу materials:',
            dbError
        );


        // Если файл уже загрузился,
        // но запись в БД не создалась,
        // удаляем файл из Storage.

        await supabaseClient

            .storage

            .from(MANUALS_BUCKET)

            .remove([
                filePath
            ]);


        setManualMessage(
            'Файл загрузился в Storage, но не сохранился в базе: ' +
            (
                dbError.message ||
                'ошибка Supabase'
            )
        );

        return;
    }


    setManualMessage(
        'Файл успешно загружен.',
        true
    );


    // Закрываем окно и обновляем раздел

    setTimeout(
        async () => {

            const modal =
                document.getElementById(
                    'manualWindow'
                );

            if (modal) {
                modal.remove();
            }

            await loadManuals();

        },
        700
    );
}


// =====================================================
// ОТКРЫТИЕ УЖЕ СОХРАНЁННОГО МЕТОДИЧЕСКОГО ПОСОБИЯ
// =====================================================

async function openSavedManual(item) {

    if (!item) {
        return;
    }


    // Если это обычная внешняя ссылка
    // (YouTube, Google Drive и т.д.)

    if (item.external_url) {

        window.open(
            item.external_url,
            '_blank',
            'noopener,noreferrer'
        );

        return;
    }


    // Если это файл из Private Storage

    if (item.file_url) {

        const {
            data,
            error
        } =
            await supabaseClient

                .storage

                .from(MANUALS_BUCKET)

                .createSignedUrl(
                    item.file_url,
                    3600
                );


        if (error) {

            console.error(
                'Ошибка создания ссылки на методическое пособие:',
                error
            );

            alert(
                'Не удалось открыть файл: ' +
                (
                    error.message ||
                    'ошибка Storage'
                )
            );

            return;
        }


        if (data?.signedUrl) {

            window.open(
                data.signedUrl,
                '_blank',
                'noopener,noreferrer'
            );

        }
    }
}
