// =========================================================
// calculators.gs — РАЗДЕЛ «КАЛЬКУЛЯТОРЫ»
// =========================================================

function pythagorasIconHtml() {
  return `
    <div class="card-icon pythagoras-icon">
      <span>1</span><span>4</span><span>7</span>
      <span>2</span><span>5</span><span>8</span>
      <span>3</span><span>6</span><span>9</span>
    </div>
  `;
}

async function renderCalculators() {
  const contentCards = document.getElementById('contentCards');
  if (!contentCards) return;

  contentCards.innerHTML = 'Загрузка...';

  const accessMap = await getAccessMap(CURRENT_PROFILE.id);

  contentCards.innerHTML = DIRECTIONS.map(d => {
    const open = CURRENT_PROFILE.role === 'admin' || accessMap.calculator[d.key];
    const icon = d.icon === 'pythagoras' ? pythagorasIconHtml() : `<div class="card-icon">${d.icon}</div>`;

    return `
      <div class="card method-card ${open ? '' : 'locked'}" style="position:relative"
           onclick="openCalculator('${d.key}', ${open})">
        ${open ? '' : '<span class="card-lock-icon">🔒</span>'}
        ${icon}
        <div class="card-content">
          <h3>${d.title}</h3>
          <p>${open ? 'Полный расчёт по дате рождения' : 'Нет доступа'}</p>
        </div>
      </div>
    `;
  }).join('');
}

async function openCalculator(type, hasAccessFlag) {
  if (!hasAccessFlag) {
    const dir = DIRECTIONS.find(d => d.key === type);
    showNoAccessMessage(dir ? dir.title : 'Калькулятор');
    return;
  }

  await logUsage('calculator', type, 'open');

  const names = {
    adult: "Взрослая матрица",
    child: "Детская матрица",
    compatibility: "Матрица совместимости",
    vedic: "Ведическая нумерология",
    pythagoras: "Квадрат Пифагора"
  };

  const title = names[type] || "Расчёт";

  document.body.innerHTML = `
    <div style="max-width:600px;margin:50px auto;padding:30px;font-family:Arial">
      <h1>${title}</h1>

      <label>Имя</label>
      <input id="name" type="text" style="display:block;width:100%;padding:12px;margin:8px 0 20px">

      <label>Дата рождения</label>
      <input id="birthDate" type="text" placeholder="ДД.ММ.ГГГГ" maxlength="10" inputmode="numeric"
        oninput="formatBirthDate(this)"
        style="display:block;width:100%;padding:12px;margin:8px 0 20px;box-sizing:border-box">
      <div id="dateError" style="color:red;margin-top:-10px;margin-bottom:15px;"></div>

      <button onclick="calculate('${type}')">Рассчитать</button>
      <button onclick="location.reload()">Назад</button>

      <div id="result" style="margin-top:30px"></div>
    </div>
  `;
}

function formatBirthDate(input) {
  let value = input.value.replace(/\D/g, "");
  if (value.length > 8) value = value.substring(0, 8);

  if (value.length > 4) {
    value = value.substring(0, 2) + "." + value.substring(2, 4) + "." + value.substring(4);
  } else if (value.length > 2) {
    value = value.substring(0, 2) + "." + value.substring(2);
  }

  input.value = value;
}

function calculate(type) {
  const name = document.getElementById("name").value.trim();
  const birthDate = document.getElementById("birthDate").value.trim();
  const dateError = document.getElementById("dateError");
  const result = document.getElementById("result");

  dateError.textContent = "";
  result.innerHTML = "";

  if (!name) { dateError.textContent = "Введите имя."; return; }
  if (!birthDate) { dateError.textContent = "Введите дату рождения."; return; }

  const dateParts = birthDate.split(".");
  if (dateParts.length !== 3 || dateParts[0].length !== 2 || dateParts[1].length !== 2 || dateParts[2].length !== 4) {
    dateError.textContent = "Введите дату рождения в формате ДД.ММ.ГГГГ.";
    return;
  }

  const day = Number(dateParts[0]);
  const month = Number(dateParts[1]);
  const year = Number(dateParts[2]);

  if (year < 1900 || year > new Date().getFullYear()) {
    dateError.textContent = "Введите корректный год рождения.";
    return;
  }

  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    dateError.textContent = "Введите корректную дату рождения.";
    return;
  }

  result.innerHTML = `
    <h2>Данные приняты</h2>
    <p>Имя: ${name}</p>
    <p>Дата рождения: ${birthDate}</p>
  `;
}
