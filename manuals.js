// ============================================================
// MANUALS.JS
// Методические пособия
// ============================================================

const MATERIALS_TABLE = 'platform_materials';
const MATERIALS_BUCKET = 'methodicals';

const METHODICAL_SECTIONS = {
    adult: 'adult',
    child: 'child',
    compatibility: 'compatibility',
    vedic: 'vedic',
    pythagoras: 'pythagoras'
};

const METHODICAL_NAMES = {
    adult: 'Взрослая матрица',
    child: 'Детская матрица',
    compatibility: 'Матрица совместимости',
    vedic: 'Ведическая нумерология',
    pythagoras: 'Квадрат Пифагора'
};


// ============================================================
// ГЛАВНАЯ СТРАНИЦА МЕТОДИЧЕСКИХ ПОСОБИЙ
// ============================================================

async function loadManuals() {

    const contentCards =
        document.getElementById('contentCards');

    if (!contentCards) return;

    contentCards.innerHTML = `

        <div class="section-title">
            <h2>
                Методические пособия
            </h2>
        </div>

        <div class="cards">

            ${createManualCard(
                'adult',
                '📘',
                'Взрослая<br>матрица'
            )}

            ${createManualCard(
                'child',
                '👶',
                'Детская<br>матрица'
            )}

            ${createManualCard(
                'compatibility',
                '💕',
                'Матрица<br>совместимости'
            )}

            ${createManualCard(
                'vedic',
                'ॐ',
                'Ведическая<br>нумерология'
            )}

            ${createManualCard(
                'pythagoras',
                '🔢',
                'Квадрат<br>Пифагора'
            )}

        </div>
    `;
}


function createManualCard(
    section,
    icon,
    title
) {

    return `

        <div
            class="card"
            onclick="
                openManualSection('${section}')
            "
        >

            <div class="card-icon">
                ${icon}
            </div>

            <div class="card-content">

                <h3>
                    ${title}
                </h3>

                <p>
                    Методическое пособие
                </p>

            </div>

        </div>

    `;
}


// ============================================================
// ОТКРЫТЬ КОНКРЕТНОЕ ПОСОБИЕ
// ============================================================

async function openManualSection(section) {

    const contentCards =
        document.getElementById('contentCards');

    if (!contentCards) return;


    const title =
        METHODICAL_NAMES[section] ||
        'Методическое пособие';


    contentCards.innerHTML = `

        <div class="section-title">

            <h2>
                ${title}
            </h2>

        </div>

        <div
            id="manualMaterials"
            class="cards"
        >

            <div class="table-card">
                Загрузка...
            </div>

        </div>

    `;


    await loadMaterialsForSection(
        section
    );
}


// ============================================================
// ЗАГРУЗКА МАТЕРИАЛОВ
// ============================================================

async function loadMaterialsForSection(section) {

    const container =
        document.getElementById(
            'manualMaterials'
        );

    if (!container) return;


    const {
        data: {
            session
        }
    } =
        await supabaseClient.auth.getSession();


    if (!session) return;


    const userId =
        session.user.id;


    const role =
        String(
            window.currentUserRole ||
            'client'
        ).toLowerCase();


    const isManager =
        typeof isManagerRole === 'function'
            ? isManagerRole(role)
            : [
                'admin',
                'teacher',
                'numerologist',
                'нумеролог',
                'администратор'
            ].includes(role);


    /*
     * Администраторские материалы:
     * видят все.
     *
     * Материалы нумеролога:
     * видит только сам нумеролог
     * и его ученицы.
     *
     * Ученица другого нумеролога
     * эти материалы не получает.
     */


    let query =
        supabaseClient
            .from(MATERIALS_TABLE)
            .select('*')
            .eq(
                'section',
                section
            )
            .order(
                'created_at',
                {
                    ascending: false
                }
            );


    const {
        data,
        error
    } =
        await query;


    if (error) {

        console.error(
            'Ошибка загрузки материалов:',
            error
        );


        container.innerHTML = `

            <div class="table-card">

                Не удалось загрузить
                методические материалы.

            </div>

        `;

        return;
    }


    const materials =
        data || [];


    let visibleMaterials = [];


    if (isManager) {

        /*
         * Администратор видит всё.
         */

        visibleMaterials =
            materials;

    } else {

        /*
         * Для ученицы сначала показываем
         * материалы администратора.
         */

        const adminMaterials =
            materials.filter(function(item) {

                return (
                    !item.created_by ||
                    item.is_admin === true ||
                    item.owner_type === 'admin'
                );

            });


        /*
         * Далее добавляем материалы
         * её нумеролога.
         *
         * Здесь используем доступное
         * поле numerologist_id / created_by.
         */

        const ownMaterials =
            materials.filter(function(item) {

                return (
                    String(item.created_by || '') ===
                    String(
                        window.currentNumerologistId ||
                        ''
                    )
                );

            });


        visibleMaterials =
            [
                ...adminMaterials,
                ...ownMaterials
            ];

    }


    renderMaterials(
        visibleMaterials,
        section,
        isManager
    );
}


// ============================================================
// ОТОБРАЖЕНИЕ МАТЕРИАЛОВ
// ============================================================

function renderMaterials(
    materials,
    section,
    isManager
) {

    const container =
        document.getElementById(
            'manualMaterials'
        );

    if (!container) return;


    if (!materials.length) {

        container.innerHTML = `

            <div class="table-card">

                <div
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >

                    Пока материалов нет.

                </div>

            </div>

        `;


        if (isManager) {

            container.innerHTML +=
                managerMaterialControls(
                    section
                );

        }

        return;
    }


    container.innerHTML = `

        ${materials.map(function(material) {

            return createMaterialCard(
                material,
                isManager
            );

        }).join('')}


        ${
            isManager
                ? managerMaterialControls(section)
                : ''
        }

    `;
}


// ============================================================
// КАРТОЧКА МАТЕРИАЛА
// ============================================================

function createMaterialCard(
    material,
    isManager
) {

    const name =
        material.name ||
        material.title ||
        'Методическое пособие';


    const url =
        material.url ||
        material.file_url ||
        '';


    const filePath =
        material.file_path ||
        material.path ||
        '';


    const id =
        material.id ||
        '';


    let action = '';


    if (url) {

        action = `

            <button
                class="material-manager-button"
                onclick="
                    openMaterialUrl(
                        '${escapeAttribute(url)}'
                    )
                "
            >
                Открыть
            </button>

        `;

    } else if (filePath) {

        action = `

            <button
                class="material-manager-button"
                onclick="
                    downloadMaterial(
                        '${escapeAttribute(filePath)}',
                        '${escapeAttribute(name)}'
                    )
                "
            >
                Открыть / скачать
            </button>

        `;

    }


    return `

        <div
            class="card"
            style="cursor:default;"
        >

            <div class="card-icon">
                📄
            </div>

            <div class="card-content">

                <h3>
                    ${escapeHtml(name)}
                </h3>

                <p>
                    Методическое пособие
                </p>

                <div
                    style="
                        width:100%;
                        margin-top:15px;
                    "
                >
                    ${action}
                </div>

            </div>

        </div>

    `;
}


// ============================================================
// КНОПКИ НУМЕРОЛОГА / АДМИНИСТРАТОРА
// ============================================================

function managerMaterialControls(section) {

    return `

        <div
            class="table-card"
            style="
                width:100%;
                max-width:560px;
                margin-top:5px;
            "
        >

            <div class="table-title">
                Добавить материал
            </div>


            <input
                id="materialTitle"
                class="material-manager-input"
                type="text"
                placeholder="Название материала"
            >


            <input
                id="materialUrl"
                class="material-manager-input"
                type="url"
                placeholder="Вставьте ссылку"
            >


            <div class="material-manager-or">
                или
            </div>


            <input
                id="materialFile"
                type="file"
                style="
                    display:block;
                    width:100%;
                    margin-bottom:15px;
                    color:#eee5d0;
                "
            >


            <button
                class="material-manager-button"
                onclick="
                    saveMaterial('${section}')
                "
            >
                Сохранить
            </button>


            <div
                id="materialSaveMessage"
                class="auth-message"
            ></div>

        </div>

    `;
}


// ============================================================
// СОХРАНЕНИЕ
// ============================================================

async function saveMaterial(section) {

    const title =
        document.getElementById(
            'materialTitle'
        )?.value.trim() || '';


    const url =
        document.getElementById(
            'materialUrl'
        )?.value.trim() || '';


    const fileInput =
        document.getElementById(
            'materialFile'
        );


    const file =
        fileInput?.files?.[0] || null;


    const message =
        document.getElementById(
            'materialSaveMessage'
        );


    if (!title) {

        if (message) {
            message.textContent =
                'Введите название материала.';
        }

        return;
    }


    if (!url && !file) {

        if (message) {
            message.textContent =
                'Вставьте ссылку или выберите файл.';
        }

        return;
    }


    const {
        data: {
            session
        }
    } =
        await supabaseClient.auth.getSession();


    if (!session) return;


    let filePath = null;
    let finalUrl = url || null;


    // ========================================================
    // ЕСЛИ ВЫБРАН ФАЙЛ
    // ========================================================

    if (file) {

        const safeName =
            file.name
                .replace(
                    /[^a-zA-Zа-яА-Я0-9._-]/g,
                    '_'
                );


        filePath =
            `${session.user.id}/${Date.now()}_${safeName}`;


        const {
            error: uploadError
        } =
            await supabaseClient
                .storage
                .from(MATERIALS_BUCKET)
                .upload(
                    filePath,
                    file,
                    {
                        upsert: false
                    }
                );


        if (uploadError) {

            console.error(
                'Ошибка загрузки файла:',
                uploadError
            );


            if (message) {
                message.textContent =
                    'Не удалось загрузить файл.';
            }

            return;
        }

    }


    // ========================================================
    // СОХРАНЯЕМ ЗАПИСЬ В ТАБЛИЦЕ
    // ========================================================

    const {
        error
    } =
        await supabaseClient
            .from(MATERIALS_TABLE)
            .insert({

                name: title,

                title: title,

                section: section,

                material_type:
                    file
                        ? 'file'
                        : 'url',

                url: finalUrl,

                file_path: filePath,

                created_by:
                    session.user.id,

                owner_type:
                    window.currentUserRole ===
                    'admin'
                        ? 'admin'
                        : 'numerologist'

            });


    if (error) {

        console.error(
            'Ошибка сохранения материала:',
            error
        );


        if (message) {
            message.textContent =
                'Не удалось сохранить материал.';
        }

        return;
    }


    if (message) {

        message.textContent =
            'Материал сохранён.';

        message.className =
            'auth-message success';

    }


    await loadMaterialsForSection(
        section
    );
}


// ============================================================
// ОТКРЫТЬ ССЫЛКУ
// ============================================================

function openMaterialUrl(url) {

    if (!url) return;

    window.open(
        url,
        '_blank',
        'noopener,noreferrer'
    );
}


// ============================================================
// СКАЧАТЬ ФАЙЛ ИЗ STORAGE
// ============================================================

async function downloadMaterial(
    filePath,
    fileName
) {

    if (!filePath) return;


    const {
        data,
        error
    } =
        await supabaseClient
            .storage
            .from(MATERIALS_BUCKET)
            .download(
                filePath
            );


    if (error) {

        console.error(
            'Ошибка скачивания:',
            error
        );

        alert(
            'Не удалось открыть файл.'
        );

        return;
    }


    const url =
        URL.createObjectURL(
            data
        );


    const link =
        document.createElement(
            'a'
        );


    link.href = url;

    link.download =
        fileName ||
        'material';


    document.body.appendChild(
        link
    );

    link.click();

    link.remove();


    setTimeout(
        function () {
            URL.revokeObjectURL(url);
        },
        1000
    );
}


// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

function escapeAttribute(value) {

    return String(value || '')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'");
}


if (
    typeof window.loadManuals !==
    'function'
) {

    window.loadManuals =
        loadManuals;

}
