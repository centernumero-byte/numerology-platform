// =========================================================
// VIDEOS.JS
// Раздел «Видео»
// =========================================================

async function loadVideos() {

    const contentCards =
        document.getElementById("contentCards");

    if (!contentCards) return;


    const directions = [
        {
            key: "adult",
            title: "Взрослая матрица",
            icon: "✦"
        },
        {
            key: "child",
            title: "Детская матрица",
            icon: "👶"
        },
        {
            key: "compatibility",
            title: "Матрица совместимости",
            icon: "💕"
        },
        {
            key: "vedic",
            title: "Ведическая нумерология",
            icon: "ॐ"
        },
        {
            key: "pythagoras",
            title: "Квадрат Пифагора",
            icon: "🔢"
        }
    ];


    contentCards.innerHTML = `

        <div class="section-title">
            <h2>Видео</h2>
        </div>

        <div class="cards">

            ${directions.map(item => `

                <div
                    class="card method-card"
                    id="video-${item.key}"
                    onclick="openVideo('${item.key}')"
                >

                    <div class="card-icon">
                        ${item.icon}
                    </div>

                    <div class="card-content">

                        <h3>
                            ${item.title}
                        </h3>

                        <p>
                            Видео
                        </p>

                    </div>

                </div>

            `).join("")}

        </div>

    `;


    await refreshVideoCards();
}


// =========================================================
// ПОЛУЧЕНИЕ ВИДЕО
// =========================================================

async function refreshVideoCards() {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("platform_materials")
            .select("*")
            .eq("section", "videos")
            .order("created_at", {
                ascending: false
            });


        if (error) {

            console.error(
                "Ошибка загрузки видео:",
                error
            );

            return;
        }


        (data || []).forEach(item => {

            const text = (

                (item.title || "") +
                " " +
                (item.direction || "")

            ).toLowerCase();


            let key = null;


            if (
                text.includes("взросл") ||
                text.includes("adult")
            ) {
                key = "adult";
            }

            else if (
                text.includes("детск") ||
                text.includes("child")
            ) {
                key = "child";
            }

            else if (
                text.includes("совмест") ||
                text.includes("compatibility")
            ) {
                key = "compatibility";
            }

            else if (
                text.includes("ведичес") ||
                text.includes("vedic")
            ) {
                key = "vedic";
            }

            else if (
                text.includes("пифагор") ||
                text.includes("pythagoras")
            ) {
                key = "pythagoras";
            }


            if (!key) return;


            const card =
                document.getElementById(
                    `video-${key}`
                );


            if (!card) return;


            const url =
                item.url ||
                item.file_path ||
                "";


            if (url) {

                card.dataset.url = url;

                card.classList.add(
                    "has-material"
                );

                const description =
                    card.querySelector("p");


                if (description) {

                    description.textContent =
                        "Видео доступно";

                }

            }

        });

    }

    catch (error) {

        console.error(
            "Ошибка видео:",
            error
        );

    }

}


// =========================================================
// ОТКРЫТИЕ ВИДЕО
// =========================================================

function openVideo(direction) {

    const card =
        document.getElementById(
            `video-${direction}`
        );


    if (!card) return;


    const url =
        card.dataset.url ||
        "";


    if (!url) {

        alert(
            "Видео пока не добавлено."
        );

        return;
    }


    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );

}


// =========================================================
// ОБНОВЛЕНИЕ РАЗДЕЛА ВИДЕО
// =========================================================

window.loadVideos =
    loadVideos;

window.openVideo =
    openVideo;
