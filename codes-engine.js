// ================================================================
// ДВИЖОК: Коды Любви, Миллионера и Погашения долгов
// ================================================================

const ALPHABETS = {
  russian: "абвгдеёжзийклмнопрстуфхцчшщъыьэюя",
  english: "abcdefghijklmnopqrstuvwxyz",
  kazakh:  "аәбвгғдеёжзийкқлмнңоөпрстуұүфхһцчшщъыіьэюя",
};
const MASTER_NUMBERS = [11,22,33,44,55,66,77,88,99];

function digitSum(n) {
  return String(Math.abs(n)).split("").reduce((a, c) => a + Number(c), 0);
}
function reduceWithMaster(n) {
  if (MASTER_NUMBERS.includes(n)) return n;
  let d = digitSum(n);
  if (MASTER_NUMBERS.includes(d)) return d;
  while (d > 9) d = digitSum(d);
  return d;
}

// Сумма букв ФИО по алфавиту (а=1,б=2,...) с приведением к 1-9 через каждые 9 букв алфавита
function letterSum(text, alphabetKey) {
  const alphabet = ALPHABETS[alphabetKey] || ALPHABETS.russian;
  const lower = String(text || "").toLowerCase();
  let sum = 0;
  for (const ch of lower) {
    const pos = alphabet.indexOf(ch);
    if (pos >= 0) sum += (pos % 9) + 1;
  }
  return sum;
}
function nameCode(text, alphabetKey) {
  return reduceWithMaster(letterSum(text, alphabetKey));
}

function computeAllCodes(lastName, firstName, middleName, day, month, year, alphabetKey) {
  const firstNameCode = nameCode(firstName, alphabetKey);
  const lastNameCode = nameCode(lastName, alphabetKey);
  const middleNameCode = middleName ? nameCode(middleName, alphabetKey) : 0;

  const fateCode = reduceWithMaster(firstNameCode + lastNameCode + middleNameCode);
  const dayCode = reduceWithMaster(day);
  const monthCode = reduceWithMaster(month);
  const yearCode = reduceWithMaster(digitSum(year));
  const lifePathCode = reduceWithMaster(yearCode + monthCode + dayCode);

  const leftRootCode = reduceWithMaster(firstNameCode + middleNameCode);
  const rightRootCode = reduceWithMaster(lastNameCode + fateCode);
  const heartCode = reduceWithMaster(dayCode + monthCode);
  const soulCode = reduceWithMaster(lifePathCode + yearCode);

  const activationRaw = (firstNameCode + dayCode) * lastNameCode;
  const activationCode = reduceWithMaster(activationRaw);

  // "Единый код" (миллионера) — произведение корневых кодов, полное число (для звезды) и свёрнутое (итог)
  const millionaireRaw = leftRootCode * activationCode * rightRootCode * heartCode * soulCode * leftRootCode;
  const millionaireCode = reduceWithMaster(millionaireRaw);

  return {
    firstNameCode, lastNameCode, middleNameCode, fateCode,
    dayCode, monthCode, yearCode, lifePathCode,
    leftRootCode, rightRootCode, heartCode, soulCode, activationCode,
    millionaireRaw, millionaireCode,
  };
}

// ================================================================
// SVG-ДИАГРАММЫ
// ================================================================

function circleAt(cx, cy, r, value, fill) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="#122522" stroke-width="1.5"/>
    <text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="18" font-family="Georgia,serif" fill="#122522" font-weight="700">${value}</text>`;
}

// Код любви — сердце из 6 чисел: имя+фамилия (левый бугорок), судьба+день (правый бугорок), отчество (центр), месяц (нижняя точка)
function buildLoveHeartSvg(codes) {
  const pts = {
    nameL: [130, 90], surnameL: [170, 70],
    fateR: [230, 70], dayR: [270, 90],
    middleC: [200, 130],
    monthTip: [200, 230],
  };
  const path = `M200,110
    C170,70 100,70 100,120
    C100,170 150,190 200,230
    C250,190 300,170 300,120
    C300,70 230,70 200,110 Z`;
  const c = circleAt;
  return `<svg viewBox="0 0 400 260" style="width:100%;max-width:340px;">
    <path d="${path}" fill="rgba(255,80,120,.18)" stroke="#e05a7a" stroke-width="2.5"/>
    ${c(...pts.nameL, 22, codes.firstNameCode, "#f6d66c")}
    ${c(...pts.surnameL, 22, codes.lastNameCode, "#f6d66c")}
    ${c(...pts.fateR, 22, codes.fateCode, "#8fd98f")}
    ${c(...pts.dayR, 22, codes.dayCode, "#8fd98f")}
    ${c(...pts.middleC, 22, codes.middleNameCode, "#9b6bd6")}
    ${c(...pts.monthTip, 24, codes.monthCode, "#ff9d9d")}
  </svg>`;
}

// Код миллионера — 5-конечная звезда, по вершинам разложены цифры "сырого" итогового числа
function buildMillionaireStarSvg(rawNumber) {
  const digits = String(rawNumber).split("");
  const cx = 200, cy = 190, R = 140;
  const points = [];
  for (let i = 0; i < 5; i++) {
    const angle = -Math.PI / 2 + i * (2 * Math.PI / 5);
    points.push([cx + R * Math.cos(angle), cy + R * Math.sin(angle)]);
  }
  // звезда — соединяем через одну вершину (классический пентакль)
  const order = [0, 2, 4, 1, 3, 0];
  const pathD = order.map((idx, i) => (i === 0 ? "M" : "L") + points[idx][0].toFixed(1) + "," + points[idx][1].toFixed(1)).join(" ") + " Z";
  const digitCircles = points.map((p, i) => circleAt(p[0], p[1], 24, digits[i % digits.length], "#f6d66c")).join("");
  const dollarLabel = `<text x="${cx}" y="${cy + 8}" text-anchor="middle" font-size="42" fill="#8fd98f" font-family="Georgia,serif" font-weight="700">$</text>`;
  return `<svg viewBox="0 0 400 380" style="width:100%;max-width:340px;">
    <path d="${pathD}" fill="rgba(246,214,108,.12)" stroke="#d7aa31" stroke-width="2.5"/>
    ${dollarLabel}
    ${digitCircles}
  </svg>
  <div style="color:#c9bfa8;font-size:13px;margin-top:6px;text-align:center;">Полное число для звезды: <b>${rawNumber}</b> → итоговый код: <b>${MASTER_NUMBERS_PLACEHOLDER}</b></div>`;
}

// Техника погашения долгов — круг, поделённый на 8 цветных секторов с кодами
function buildDebtCircleSvg(codes) {
  const sectors = [
    { label: "Имя", value: codes.firstNameCode, color: "#8fd98f" },
    { label: "Фамилия", value: codes.lastNameCode, color: "#f6d66c" },
    { label: "Отчество", value: codes.middleNameCode, color: "#9b6bd6" },
    { label: "День", value: codes.dayCode, color: "#5b8ef2" },
    { label: "Месяц", value: codes.monthCode, color: "#e0913e" },
    { label: "Год", value: codes.yearCode, color: "#4fc3c0" },
    { label: "Сердце", value: codes.heartCode, color: "#ff9d9d" },
    { label: "Душа", value: codes.soulCode, color: "#d7aa31" },
  ];
  const cx = 200, cy = 200, R = 160, r0 = 60;
  const n = sectors.length;
  const parts = sectors.map((s, i) => {
    const a0 = (i / n) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
    const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
    const xi0 = cx + r0 * Math.cos(a0), yi0 = cy + r0 * Math.sin(a0);
    const xi1 = cx + r0 * Math.cos(a1), yi1 = cy + r0 * Math.sin(a1);
    const mid = (a0 + a1) / 2;
    const lx = cx + (R + 30) * Math.cos(mid), ly = cy + (R + 30) * Math.sin(mid);
    const tx = cx + (r0 + R) / 2 * Math.cos(mid), ty = cy + (r0 + R) / 2 * Math.sin(mid);
    return `
      <path d="M${xi0.toFixed(1)},${yi0.toFixed(1)} L${x0.toFixed(1)},${y0.toFixed(1)} A${R},${R} 0 0,1 ${x1.toFixed(1)},${y1.toFixed(1)} L${xi1.toFixed(1)},${yi1.toFixed(1)} A${r0},${r0} 0 0,0 ${xi0.toFixed(1)},${yi0.toFixed(1)} Z" fill="${s.color}" fill-opacity="0.75" stroke="#122522" stroke-width="1.5"/>
      <text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" font-size="18" font-family="Georgia,serif" fill="#122522" font-weight="700">${s.value}</text>
      <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" font-size="11" fill="#c9bfa8">${s.label}</text>`;
  }).join("");
  return `<svg viewBox="0 0 400 400" style="width:100%;max-width:340px;">${parts}</svg>`;
}

function getFullResult(lastName, firstName, middleName, day, month, year, alphabetKey) {
  const codes = computeAllCodes(lastName, firstName, middleName, day, month, year, alphabetKey || "russian");
  const loveSvg = buildLoveHeartSvg(codes);
  const starSvg = buildMillionaireStarSvg(codes.millionaireRaw).replace("MASTER_NUMBERS_PLACEHOLDER", codes.millionaireCode);
  const debtSvg = buildDebtCircleSvg(codes);
  return { codes, loveSvg, starSvg, debtSvg };
}

window.CodesEngine = { getFullResult, computeAllCodes, nameCode, reduceWithMaster };
