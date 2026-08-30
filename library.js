// ============================================================
// LIBRARY.JS
// Библиотека нумеролога
// ============================================================

const NUMEROLOGY_LIBRARY_URL =
    'https://drive.google.com/drive/folders/1pGjVPKtGeHm5NKrcg0JLvy5M_XDTAaOv?usp=sharing';


// ============================================================
// ОТКРЫТИЕ БИБЛИОТЕКИ
// ============================================================

function loadLibrary() {

    const contentCards =
        document.getElementById('contentCards');

    if (!contentCards) return;


    contentCards.innerHTML = `

        <div class="section-title">

            <h2>
                Библиотека нумеролога
            </h2>

        </div>


        <div class="cards">

            <div
                class="card library-main-card"
                onclick="openLibraryHome()"
                role="button"
                tabindex="0"
            >

                <div class="card-icon library-icon">
                    📚
                </div>


                <div class="card-content">

                    <h3>
                        Библиотека<br>
                        нумеролога
                    </h3>

                    <p>
                        Все книги и материалы
                    </p>

                </div>

            </div>

        </div>

    `;
}


// ============================================================
// GOOGLE DRIVE
// ============================================================

function openLibraryHome() {

    if (!NUMEROLOGY_LIBRARY_URL) {
        return;
    }


    window.open(
        NUMEROLOGY_LIBRARY_URL,
        '_blank',
        'noopener,noreferrer'
    );

}


// ============================================================
// КЛАВИАТУРА
// ============================================================

document.addEventListener(
    'keydown',
    function(event) {

        const card =
            event.target.closest(
                '.library-main-card'
            );

        if (!card) return;


        if (
            event.key === 'Enter' ||
            event.key === ' '
        ) {

            event.preventDefault();

            openLibraryHome();

        }

    }
);


// ============================================================
// ГЛОБАЛЬНАЯ ФУНКЦИЯ
// ============================================================

window.loadLibrary =
    loadLibrary;

window.openLibraryHome =
    openLibraryHome;
