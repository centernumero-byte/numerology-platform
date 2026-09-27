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

// Техника погашения долгов — круг, разрезанный как пирог на 8 частей, цвета и порядок как в методичке:
// сверху синий (месяц), по часовой: сиреневый (год), розовый (душа), красный (сердце), голубой (имя),
// оранжевый (фамилия), жёлтый (отчество), зелёный (день)
function buildDebtCircleSvg(codes) {
  const sectors = [
    { color: "#3A99DC", name: "Синий", label: "код месяца", value: codes.monthCode, text: "#fff" },
    { color: "#D1A9CA", name: "Сиреневый", label: "код года", value: codes.yearCode, text: "#1d1d1d" },
    { color: "#FCDAD6", name: "Розовый", label: "код души", value: codes.soulCode, text: "#1d1d1d" },
    { color: "#C0202A", name: "Красный", label: "код сердца", value: codes.heartCode, text: "#fff" },
    { color: "#66B9BD", name: "Голубой", label: "код имени", value: codes.firstNameCode, text: "#1d1d1d" },
    { color: "#E3830A", name: "Оранжевый", label: "код фамилии", value: codes.lastNameCode, text: "#1d1d1d" },
    { color: "#F4B819", name: "Жёлтый", label: "код отчества", value: codes.middleNameCode, text: "#1d1d1d" },
    { color: "#A8B42A", name: "Зелёный", label: "код дня", value: codes.dayCode, text: "#1d1d1d" },
  ];
  const cx = 170, cy = 170, R = 160;
  const n = sectors.length;
  const start = -Math.PI / 2 - Math.PI / n; // синий сектор — ровно сверху
  const pt = (t, k) => [cx + R * k * Math.cos(t), cy + R * k * Math.sin(t)];
  const parts = sectors.map((s, i) => {
    const a0 = start + (i / n) * 2 * Math.PI;
    const a1 = start + ((i + 1) / n) * 2 * Math.PI;
    const [x0, y0] = pt(a0, 1), [x1, y1] = pt(a1, 1);
    const [tx, ty] = pt((a0 + a1) / 2, 0.66);
    return `
      <path d="M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)} A${R},${R} 0 0,1 ${x1.toFixed(1)},${y1.toFixed(1)} Z" fill="${s.color}"/>
      <text x="${tx.toFixed(1)}" y="${(ty + 10).toFixed(1)}" text-anchor="middle" font-size="28" font-family="Arial,sans-serif" fill="${s.text}" font-weight="700">${s.value}</text>`;
  }).join("");
  const legend = sectors.map((s) => `<div style="margin:3px 0;"><span style="display:inline-block;width:14px;height:14px;background:${s.color};border-radius:3px;vertical-align:middle;margin-right:8px;"></span>${s.name} — ${s.label}: <b>${s.value}</b></div>`).join("");
  return `<svg viewBox="0 0 340 340" style="width:100%;max-width:340px;">${parts}</svg>
  <div style="color:#e9dfc6;font-size:14px;margin:10px auto 0;display:inline-block;text-align:left;line-height:1.5;">${legend}</div>`;
}

// Купюра в один доллар (схематичный рисунок) с нарисованной звездой кода миллионера
function buildDollarStarSvg(codes) {
  const W = 780, H = 332;
  const ink = "#2e4a36", paper = "#e9eee2", mid = "#b9c7b0";
  const corner = (x, y) => `
    <g transform="translate(${x},${y})">
      <rect x="-30" y="-34" width="60" height="68" rx="14" fill="${paper}" stroke="${ink}" stroke-width="3"/>
      <text x="0" y="17" text-anchor="middle" font-size="48" font-family="Georgia,serif" font-weight="700" fill="${ink}">1</text>
    </g>`;
  // звезда
  const sx = 252, sy = 186, R = 44;
  const pts = [];
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + i * 2 * Math.PI / 5;
    pts.push([sx + R * Math.cos(a), sy + R * Math.sin(a)]);
  }
  const starPath = [0, 2, 4, 1, 3, 0].map((k, i) => (i ? "L" : "M") + pts[k][0].toFixed(1) + "," + pts[k][1].toFixed(1)).join(" ") + "Z";
  // вершины: верх, право, низ-право, низ-лево, лево
  const vals = [codes.activationCode, codes.heartCode, codes.rightRootCode, codes.leftRootCode, codes.soulCode];
  const off = [[0, -12], [22, 8], [14, 26], [-14, 26], [-22, 8]];
  const nums = pts.map((p, i) => `<text x="${(p[0] + off[i][0]).toFixed(1)}" y="${(p[1] + off[i][1]).toFixed(1)}" text-anchor="middle" font-size="26" font-family="'Comic Sans MS','Segoe Print',cursive" fill="#d0112b" font-weight="700">${vals[i]}</text>`).join("");
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:640px;display:block;margin:0 auto;">
    <rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="10" fill="${paper}" stroke="${ink}" stroke-width="4"/>
    <rect x="16" y="16" width="${W - 32}" height="${H - 32}" rx="6" fill="none" stroke="${ink}" stroke-width="2"/>
    <rect x="24" y="24" width="${W - 48}" height="${H - 48}" rx="4" fill="none" stroke="${mid}" stroke-width="6"/>
    <text x="${W / 2}" y="46" text-anchor="middle" font-size="15" letter-spacing="4" font-family="Georgia,serif" font-weight="700" fill="${ink}">FEDERAL RESERVE NOTE</text>
    <text x="${W / 2}" y="80" text-anchor="middle" font-size="30" font-family="Georgia,serif" font-weight="700" fill="${ink}">THE UNITED STATES OF AMERICA</text>
    <text x="100" y="104" font-size="10" font-family="Arial,sans-serif" fill="${ink}">THIS NOTE IS LEGAL TENDER</text>
    <text x="100" y="117" font-size="10" font-family="Arial,sans-serif" fill="${ink}">FOR ALL DEBTS, PUBLIC AND PRIVATE</text>
    <!-- портрет -->
    <ellipse cx="${W / 2}" cy="178" rx="78" ry="98" fill="${mid}" stroke="${ink}" stroke-width="4"/>
    <ellipse cx="${W / 2}" cy="178" rx="68" ry="88" fill="${paper}" stroke="${ink}" stroke-width="1.5"/>
    <circle cx="${W / 2}" cy="160" r="30" fill="${mid}" stroke="${ink}" stroke-width="2"/>
    <path d="M${W / 2 - 55},262 C${W / 2 - 50},205 ${W / 2 + 50},205 ${W / 2 + 55},262 Z" fill="${mid}" stroke="${ink}" stroke-width="2"/>
    <!-- печати -->
    <circle cx="138" cy="246" r="34" fill="${paper}" stroke="#222" stroke-width="5"/>
    <circle cx="138" cy="246" r="23" fill="none" stroke="#222" stroke-width="2" stroke-dasharray="3 3"/>
    <circle cx="602" cy="200" r="40" fill="${paper}" stroke="#2f7d4a" stroke-width="5"/>
    <circle cx="602" cy="200" r="28" fill="none" stroke="#2f7d4a" stroke-width="2" stroke-dasharray="3 3"/>
    <text x="602" y="208" text-anchor="middle" font-size="22" font-family="Georgia,serif" font-weight="700" fill="#2f7d4a">$</text>
    <!-- номинал -->
    <rect x="${W / 2 - 120}" y="${H - 58}" width="240" height="34" rx="4" fill="${paper}" stroke="${ink}" stroke-width="2"/>
    <text x="${W / 2}" y="${H - 33}" text-anchor="middle" font-size="24" letter-spacing="6" font-family="Georgia,serif" font-weight="700" fill="${ink}">ONE DOLLAR</text>
    ${corner(66, 72)}${corner(W - 66, 72)}${corner(66, H - 72)}${corner(W - 66, H - 72)}
    <!-- звезда кода миллионера -->
    <path d="${starPath}" fill="none" stroke="#d0112b" stroke-width="3" stroke-linejoin="round"/>
    ${nums}
  </svg>`;
}

function getFullResult(lastName, firstName, middleName, day, month, year, alphabetKey) {
  const codes = computeAllCodes(lastName, firstName, middleName, day, month, year, alphabetKey || "russian");
  const loveSvg = buildLoveHeartSvg(codes);
  const starSvg = buildMillionaireStarSvg(codes);
  const debtSvg = buildDebtCircleSvg(codes);
  const dollarSvg = buildDollarStarSvg(codes);
  return { codes, loveSvg, starSvg, debtSvg, dollarSvg };
}

window.CodesEngine = { getFullResult, computeAllCodes, nameCode, reduceWithMaster };
