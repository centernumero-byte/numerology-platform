// ================================================================
// ДВИЖОК: Коды Любви, Миллионера и Погашения долгов
// ================================================================

const ALPHABETS = {
  russian: "абвгдеёжзийклмнопрстуфхцчшщъыьэюя",
  english: "abcdefghijklmnopqrstuvwxyz",
  kazakh:  "аәбвгғдеёжзийкқлмнңоөпрстуұүфхһцчшщъыіьэюя",
};
const MASTER_NUMBERS = [11,22,33,44,55,66,77,88,99];

// Все формулы повторяют лист «Calculations» Excel-калькулятора «Коды» один в один.

// Сумма первых k цифр числа (как SUM(--MID(n&0,{1..k},1)) в Excel)
function firstDigitsSum(n, k) {
  const s = String(Math.abs(n)) + "0";
  let sum = 0;
  for (let i = 0; i < k && i < s.length; i++) sum += Number(s[i]);
  return sum;
}
function digitSum(n) {
  return String(Math.abs(n)).split("").reduce((a, c) => a + Number(c), 0);
}
// Приведение с мастер-числами (формулы столбца I): 11 — если само число или сумма его первых двух цифр = 11;
// 22…99 — только если само число мастер; иначе цифровой корень MOD(n-1,9)+1
function reduceWithMaster(n) {
  const k = firstDigitsSum(n, 2);
  if (n === 11 || k === 11) return 11;
  if (MASTER_NUMBERS.includes(n)) return n;
  return ((n - 1) % 9 + 9) % 9 + 1;
}
// Код дня / месяца: мастер только если само число 11 или 22
function reduceExactMaster(n) {
  if (MASTER_NUMBERS.includes(n)) return n;
  return ((n - 1) % 9 + 9) % 9 + 1;
}

// Сумма букв по алфавиту (а=1 … и=9, й=1 …); символы вне алфавита (пробел, дефис) не учитываются
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
  const firstNameCode = nameCode(firstName, alphabetKey);                    // I1
  const lastNameCode = nameCode(lastName, alphabetKey);                      // I2
  const middleNameCode = middleName && letterSum(middleName, alphabetKey) ? nameCode(middleName, alphabetKey) : 0; // I3

  const fateCode = firstDigitsSum(firstDigitsSum(firstNameCode + lastNameCode + middleNameCode, 2), 2); // I4
  const dayCode = reduceExactMaster(day);                                    // I5
  const monthCode = reduceExactMaster(month);                                // I6
  const yearSum = digitSum(year);                                            // O2
  const yearStep = (yearSum === 11 || yearSum === 22) ? yearSum : firstDigitsSum(yearSum, 2); // O3
  const yearCode = firstDigitsSum(yearStep, 2);                              // I7
  const daySum = firstDigitsSum(day, 2), monthSum = firstDigitsSum(month, 2); // M3, N3
  const lifePathCode = reduceWithMaster(yearCode + monthSum + daySum);       // I8

  const leftRootCode = reduceWithMaster(firstNameCode + middleNameCode);     // I9
  const rightRootCode = reduceWithMaster(lastNameCode + fateCode);           // I10
  const heartCode = reduceWithMaster(daySum + monthSum);                     // I11
  const soulCode = reduceWithMaster(yearCode + lifePathCode);                // I12

  const activationRaw = (firstNameCode + dayCode) * lastNameCode;            // J13
  const activationCode = reduceWithMaster(activationRaw);                    // I13

  // Единый код (I14): произведение корневых кодов → сумма первых 4 цифр → сумма первых 2 цифр
  const millionaireRaw = leftRootCode * activationCode * rightRootCode * heartCode * soulCode * leftRootCode; // J14
  const millionaireCode = firstDigitsSum(firstDigitsSum(millionaireRaw, 4), 2);

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

// Код любви — сердце из 7 чисел (как на листе «Код любви»): сверху имя, фамилия | судьба, день;
// в центре отчество; ниже месяц; на нижнем острие — год
function buildLoveHeartSvg(codes) {
  const path = `M200,112
    C168,58 88,58 88,122
    C88,182 150,212 200,262
    C250,212 312,182 312,122
    C312,58 232,58 200,112 Z`;
  const c = circleAt;
  return `<svg viewBox="0 0 400 290" style="width:100%;max-width:340px;">
    <path d="${path}" fill="rgba(255,80,120,.18)" stroke="#e05a7a" stroke-width="2.5"/>
    ${c(126, 108, 22, codes.firstNameCode, "#f6d66c")}
    ${c(168, 94, 22, codes.lastNameCode, "#f6d66c")}
    ${c(232, 94, 22, codes.fateCode, "#8fd98f")}
    ${c(274, 108, 22, codes.dayCode, "#8fd98f")}
    ${c(200, 146, 22, codes.middleNameCode, "#9b6bd6")}
    ${c(200, 198, 22, codes.monthCode, "#ff9d9d")}
    ${c(200, 250, 22, codes.yearCode, "#ff9d9d")}
  </svg>`;
}

// Код миллионера — пятиконечная звезда (как на листе «Код миллионера»):
// вверху код активации, слева код души, справа код сердца, внизу слева левый корень, внизу справа правый корень
function buildMillionaireStarSvg(codes) {
  const cx = 200, cy = 196, R = 150;
  const points = [];
  for (let i = 0; i < 5; i++) {
    const angle = -Math.PI / 2 + i * (2 * Math.PI / 5);
    points.push([cx + R * Math.cos(angle), cy + R * Math.sin(angle)]);
  }
  // вершины по часовой стрелке от верхней: верх, право, низ-право, низ-лево, лево
  const values = [codes.activationCode, codes.heartCode, codes.rightRootCode, codes.leftRootCode, codes.soulCode];
  const order = [0, 2, 4, 1, 3, 0];
  const pathD = order.map((idx, i) => (i === 0 ? "M" : "L") + points[idx][0].toFixed(1) + "," + points[idx][1].toFixed(1)).join(" ") + " Z";
  const digitCircles = points.map((p, i) => circleAt(p[0], p[1], 24, values[i], "#f6d66c")).join("");
  const dollarLabel = `<text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="42" fill="#8fd98f" font-family="Georgia,serif" font-weight="700">$</text>`;
  return `<svg viewBox="0 0 400 380" style="width:100%;max-width:340px;">
    <path d="${pathD}" fill="rgba(246,214,108,.12)" stroke="#d7aa31" stroke-width="2.5"/>
    ${dollarLabel}
    ${digitCircles}
  </svg>
  <div style="color:#c9bfa8;font-size:13px;margin-top:6px;text-align:center;line-height:1.5;">Вверху — код активации, слева — код души, справа — код сердца, внизу — левый и правый корень.<br>Единый код: <b>${codes.millionaireRaw}</b> → <b>${codes.millionaireCode}</b></div>`;
}

// Техника погашения долгов — круг из 8 секторов в том же порядке, что на листе «Техника погашения долгов»:
// сверху месяц и год, справа душа и сердце, снизу имя и фамилия, слева отчество и день
function buildDebtCircleSvg(codes) {
  const sectors = [
    { label: "Месяц", value: codes.monthCode, color: "#e0913e" },
    { label: "Год", value: codes.yearCode, color: "#4fc3c0" },
    { label: "Душа", value: codes.soulCode, color: "#d7aa31" },
    { label: "Сердце", value: codes.heartCode, color: "#ff9d9d" },
    { label: "Имя", value: codes.firstNameCode, color: "#8fd98f" },
    { label: "Фамилия", value: codes.lastNameCode, color: "#f6d66c" },
    { label: "Отчество", value: codes.middleNameCode, color: "#9b6bd6" },
    { label: "День", value: codes.dayCode, color: "#5b8ef2" },
  ];
  const cx = 200, cy = 200, R = 150, r0 = 56;
  const n = sectors.length;
  const start = -Math.PI * 3 / 4; // первый сектор — вверху слева
  const parts = sectors.map((s, i) => {
    const a0 = start + (i / n) * 2 * Math.PI;
    const a1 = start + ((i + 1) / n) * 2 * Math.PI;
    const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
    const xi0 = cx + r0 * Math.cos(a0), yi0 = cy + r0 * Math.sin(a0);
    const xi1 = cx + r0 * Math.cos(a1), yi1 = cy + r0 * Math.sin(a1);
    const mid = (a0 + a1) / 2;
    const lx = cx + (R + 26) * Math.cos(mid), ly = cy + (R + 26) * Math.sin(mid) + 4;
    const tx = cx + (r0 + R) / 2 * Math.cos(mid), ty = cy + (r0 + R) / 2 * Math.sin(mid) + 6;
    return `
      <path d="M${xi0.toFixed(1)},${yi0.toFixed(1)} L${x0.toFixed(1)},${y0.toFixed(1)} A${R},${R} 0 0,1 ${x1.toFixed(1)},${y1.toFixed(1)} L${xi1.toFixed(1)},${yi1.toFixed(1)} A${r0},${r0} 0 0,0 ${xi0.toFixed(1)},${yi0.toFixed(1)} Z" fill="${s.color}" fill-opacity="0.75" stroke="#122522" stroke-width="1.5"/>
      <text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" font-size="18" font-family="Georgia,serif" fill="#122522" font-weight="700">${s.value}</text>
      <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" font-size="12" fill="#c9bfa8">${s.label}</text>`;
  }).join("");
  return `<svg viewBox="0 0 400 400" style="width:100%;max-width:340px;">${parts}</svg>`;
}

function getFullResult(lastName, firstName, middleName, day, month, year, alphabetKey) {
  const codes = computeAllCodes(lastName, firstName, middleName, day, month, year, alphabetKey || "russian");
  const loveSvg = buildLoveHeartSvg(codes);
  const starSvg = buildMillionaireStarSvg(codes);
  const debtSvg = buildDebtCircleSvg(codes);
  return { codes, loveSvg, starSvg, debtSvg };
}

window.CodesEngine = { getFullResult, computeAllCodes, nameCode, reduceWithMaster };
