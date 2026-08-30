// ============================================================
// VIDEOS.JS
// Видео платформы
// ============================================================

const VIDEOS_TABLE = 'platform_materials';

const VIDEO_SECTIONS = {
    adult: 'adult',
    child: 'child',
    compatibility: 'compatibility',
    vedic: 'vedic',
    pythagoras: 'pythagoras'
};

const VIDEO_NAMES = {
    adult: 'Взрослая матрица',
    child: 'Детская матрица',
    compatibility: 'Матрица совместимости',
    vedic: 'Ведическая нумерология',
    pythagoras: 'Квадрат Пифагора'
};


// ============================================================
// РАЗДЕЛ ВИДЕО
// ============================================================

async function loadVideos() {

    const container =
        document.getElementById('contentCards');

    if (!container) return;


    container.innerHTML = `

        <div class="section-title">
            <h2>
                Видео
            </h2>
        </div>

        <div class="cards">

            ${createVideoSectionCard(
                'adult',
                '▶',
                'Взрослая<br>матрица'
            )}

            ${createVideoSectionCard(
                'child',
                '▶',
                'Детская<br>матрица'
            )}

            ${createVideoSectionCard(
                'compatibility',
                '▶',
                'Матрица<br>совместимости'
            )}

            ${createVideoSectionCard(
                'vedic',
                '▶',
                'Ведическая<br>нумерология'
            )}

            ${createVideoSectionCard(
                'pythagoras',
                '▶',
                'Квадрат<br>Пифагора'
            )}

        </div>

    `;
}


function createVideoSectionCard(
    section,
    icon,
    title
) {

    return `

        <div
            class="card"
            onclick="
                openVideoSection('${section}')
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
                    Обучающие видео
                </p>

            </div>

        </div>

    `;
}


// ============================================================
// ОТКРЫТЬ РАЗДЕЛ
// ============================================================

async function openVideoSection(section) {

    const container =
        document.getElementById(
            'contentCards'
        );

    if (!container) return;


    const title =
        VIDEO_NAMES[section] ||
        'Видео';


    container.innerHTML = `

        <div class="section-title">

            <h2>
                ${title}
            </h2>

        </div>


        <div
            id="videoMaterials"
            class="cards"
        >

            <div class="table-card">
                Загрузка...
            </div>

        </div>

    `;


    await loadVideosForSection(
        section
    );
}


// ============================================================
// ЗАГРУЗКА ВИДЕО
// ============================================================

async function loadVideosForSection(section) {

    const container =
        document.getElementById(
            'videoMaterials'
        );

    if (!container) return;


    const {
        data: {
            session
        }
    } =
        await supabaseClient.auth.getSession();


    if (!session) return;


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


    const {
        data,
        error
    } =
        await supabaseClient
            .from(VIDEOS_TABLE)
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


    if (error) {

        console.error(
            'Ошибка загрузки видео:',
            error
        );


        container.innerHTML = `

            <div class="table-card">

                Не удалось загрузить видео.

            </div>

        `;

        return;
    }


    const materials =
        data || [];


    let visibleVideos = [];


    if (isManager) {

        visibleVideos =
            materials;

    } else {

        const adminVideos =
            materials.filter(function(item) {

                return (
                    !item.created_by ||
                    item.is_admin === true ||
                    item.owner_type === 'admin'
                );

            });


        const ownVideos =
            materials.filter(function(item) {

                return (
                    String(item.created_by || '') ===
                    String(
                        window.currentNumerologistId ||
                        ''
                    )
                );

            });


        visibleVideos =
            [
                ...adminVideos,
                ...ownVideos
            ];

    }


    renderVideos(
        visibleVideos,
        section,
        isManager
    );
}


// ============================================================
// ОТОБРАЖЕНИЕ
// ============================================================

function renderVideos(
    videos,
    section,
    isManager
) {

    const container =
        document.getElementById(
            'videoMaterials'
        );

    if (!container) return;


    if (!videos.length) {

        container.innerHTML = `

            <div class="table-card">

                <div
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >

                    Пока видео нет.

                </div>

            </div>

            ${
                isManager
                    ? videoManagerControls(section)
                    : ''
            }

        `;

        return;
    }


    container.innerHTML = `

        ${videos.map(function(video) {

            return createVideoCard(
                video
            );

        }).join('')}


        ${
            isManager
                ? videoManagerControls(section)
                : ''
        }

    `;
}


// ============================================================
// КАРТОЧКА ВИДЕО
// ============================================================

function createVideoCard(video) {

    const title =
        video.name ||
        video.title ||
        'Видео';


    const url =
        video.url ||
        video.video_url ||
        '';


    const embedUrl =
        convertToEmbedUrl(url);


    return `

        <div
            class="card"
            style="
                width:360px;
                height:auto;
                min-height:330px;
                cursor:default;
            "
        >

            <div
                style="
                    width:100%;
                    aspect-ratio:16/9;
                    border-radius:10px;
                    overflow:hidden;
                    margin-bottom:15px;
                    background:#120d25;
                "
            >

                ${
                    embedUrl

                        ? `

                            <iframe
                                src="${escapeVideoAttribute(
                                    embedUrl
                                )}"
                                style="
                                    width:100%;
                                    height:100%;
                                    border:0;
                                "
                                allow="
                                    accelerometer;
                                    autoplay;
                                    clipboard-write;
                                    encrypted-media;
                                    gyroscope;
                                    picture-in-picture;
                                    web-share
                                "
                                allowfullscreen
                            ></iframe>

                        `

                        : `

                            <div
                                style="
                                    width:100%;
                                    height:100%;
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                    color:#eee5d0;
                                "
                            >
                                Ссылка на видео
                            </div>

                        `
                }

            </div>


            <div class="card-content">

                <h3>
                    ${escapeHtml(
                        title
                    )}
                </h3>


                ${
                    url

                        ? `

                            <button
                                class="material-manager-button"
                                onclick="
                                    openVideoUrl(
                                        '${escapeVideoAttribute(
                                            url
                                        )}'
                                    )
                                "
                            >
                                Открыть видео
                            </button>

                        `

                        : ''
                }

            </div>

        </div>

    `;
}


// ============================================================
// YOUTUBE / GOOGLE DRIVE
// ============================================================

function convertToEmbedUrl(url) {

    if (!url) return '';


    try {

        const parsed =
            new URL(url);


        const host =
            parsed.hostname
                .toLowerCase();


        // YouTube обычная ссылка

        if (
            host.includes(
                'youtube.com'
            )
        ) {

            const videoId =
                parsed.searchParams.get(
                    'v'
                );


            if (videoId) {

                return (
                    'https://www.youtube.com/embed/' +
                    videoId
                );

            }


            if (
                parsed.pathname.startsWith(
                    '/embed/'
                )
            ) {

                return url;

            }

        }


        // YouTube короткая ссылка

        if (
            host ===
            'youtu.be'
        ) {

            const id =
                parsed.pathname
                    .replace(
                        '/',
                        ''
                    );


            if (id) {

                return (
                    'https://www.youtube.com/embed/' +
                    id
                );

            }

        }


        /*
         * Google Drive:
         * не пытаемся превращать неизвестную
         * ссылку в iframe.
         *
         * Она будет открываться отдельной
         * кнопкой.
         */

        return '';

    }

    catch (error) {

        return '';

    }
}


// ============================================================
// ОТКРЫТЬ ВИДЕО
// ============================================================

function openVideoUrl(url) {

    if (!url) return;


    window.open(
        url,
        '_blank',
        'noopener,noreferrer'
    );

}


// ============================================================
// ДОБАВЛЕНИЕ ВИДЕО
// ============================================================

function videoManagerControls(section) {

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
                Добавить видео
            </div>


            <input
                id="videoTitle"
                class="material-manager-input"
                type="text"
                placeholder="Название видео"
            >


            <input
                id="videoUrl"
                class="material-manager-input"
                type="url"
                placeholder="Вставьте ссылку на видео"
            >


            <button
                class="material-manager-button"
                onclick="
                    saveVideo('${section}')
                "
            >
                Сохранить
            </button>


            <div
                id="videoSaveMessage"
                class="auth-message"
            ></div>

        </div>

    `;
}


async function saveVideo(section) {

    const title =
        document.getElementById(
            'videoTitle'
        )?.value.trim() || '';


    const url =
        document.getElementById(
            'videoUrl'
        )?.value.trim() || '';


    const message =
        document.getElementById(
            'videoSaveMessage'
        );


    if (!title) {

        if (message) {

            message.textContent =
                'Введите название видео.';

        }

        return;
    }


    if (!url) {

        if (message) {

            message.textContent =
                'Вставьте ссылку на видео.';

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


    const {
        error
    } =
        await supabaseClient
            .from(VIDEOS_TABLE)
            .insert({

                name: title,

                title: title,

                section: section,

                material_type: 'video',

                url: url,

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
            'Ошибка сохранения видео:',
            error
        );


        if (message) {

            message.textContent =
                'Не удалось сохранить видео.';

        }

        return;
    }


    if (message) {

        message.textContent =
            'Видео сохранено.';

        message.className =
            'auth-message success';

    }


    await loadVideosForSection(
        section
    );
}


// ============================================================
// HTML-БЕЗОПАСНОСТЬ
// ============================================================

function escapeVideoAttribute(value) {

    return String(value || '')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'");
}


if (
    typeof window.loadVideos !==
    'function'
) {

    window.loadVideos =
        loadVideos;

}
