(function () {
// Кармическая нумерология — расчётное ядро.
// Точная копия формул листа «Рассчет», которые реально попадают в «Расшифровку».
// Вход: { day, month, year, firstName }  (Фамилия/Отчество/пол в отчёт не попадают)

const LETTERS = (() => {
  const t = {};
  'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'.split('').forEach((ch, i) => { t[ch] = (i % 9) + 1; });
  'abcdefghijklmnopqrstuvwxyz'.split('').forEach((ch, i) => { t[ch] = (i % 9) + 1; });
  Object.assign(t, { 'ö': 1, 'ü': 2, 'ß': 3, 'ä': 9 }); // как в таблице файла
  return t;
})();

// «Сворачивание до аркана»: вычитаем 22, пока больше 22 (0 остаётся 0)
const r22 = (x) => { while (x > 22) x -= 22; return x; };
// Сумма: 0 → 22, иначе свернуть
const sum22 = (x) => (x === 0 ? 22 : r22(Math.abs(x)));
// Разность: |a-b|, 0 → 22, иначе свернуть
const diff22 = (a, b) => sum22(Math.abs(a - b));
const digits = (n) => String(n).split('').map(Number);
const digitSum = (n) => digits(n).reduce((s, d) => s + d, 0);

function nameArcana(name) {
  const letters = String(name || '').toLowerCase().slice(0, 32).split('');
  const sum = letters.reduce((s, ch) => s + (LETTERS[ch] || 0), 0);
  return r22(sum); // BJ14
}

function calcKarmic({ day, month, year, firstName }) {
  // Дт, Мт, Гт (AB23, AD23, AF23)
  const Dt = day > 22 ? day - 22 : day;
  const Mt = month;
  const ys = digitSum(year);
  const Gt = ys > 22 ? ys - 22 : ys;

  // Сумма всех цифр даты (AB20 = K15) и её «корень» для границ событий (D48)
  const allDigits = (day < 10 ? [0, day] : digits(day))
    .concat(month < 10 ? [0, month] : digits(month))
    .concat(digits(year));
  const chzp = allDigits.reduce((s, d) => s + d, 0); // AB20
  let root = chzp;
  while (root >= 10) root = digitSum(root);

  const SZ = r22(Dt + Mt + Gt);                         // C22 = V32 (СЗ)
  const TP = r22(Dt + Mt);                              // L29 = V26
  const O29 = r22(Mt + Gt);                             // O29
  const ZK = r22(TP + O29);                             // N30 = V31 (ЗК)
  const L31 = diff22(Dt, Mt);                           // L31 (ОПВ)
  const KU1 = diff22(SZ, L31);                          // N32 = V33
  const KU2 = r22(Dt + L31);                            // K29 = V34
  const KU3 = diff22(Dt, Gt);                           // N26 = V35
  const KU4 = r22(Gt + SZ);                             // R29 = V36

  // Точки препятствия человека (строка 43)
  const TP1 = sum22(Dt + Mt);
  const TP2 = sum22(Dt + Gt);
  const TP3 = sum22(TP1 + TP2);
  const TP4 = sum22(Mt + Gt);
  const TP5 = r22(TP1 + TP2 + TP3 + TP4);

  // Ошибки прошлого воплощения (строка 45)
  const OPV1 = diff22(Dt, Mt);
  const OPV2 = diff22(Dt, Gt);
  const OPV3 = diff22(OPV1, OPV2);
  const OPV4 = diff22(Mt, Gt);
  const OPV5 = r22(OPV1 + OPV2 + OPV3 + OPV4);

  const angel = r22(TP1 + TP4);                         // BJ18
  const talent = r22(angel + Mt);                       // BJ19
  const harmony = r22(Dt + SZ + Mt + angel);            // BJ20
  const karmaWork = r22(SZ + angel);                    // BJ21

  const ev1 = 36 - root;                                // D48
  return {
    month, day, SZ, OPV: [OPV1, OPV2, OPV3, OPV4, OPV5], name: nameArcana(firstName),
    ZK, TP, TPchel: [TP1, TP2, TP3, TP4, TP5], KU: [KU1, KU2, KU3, KU4],
    angel, talent, harmony, karmaWork,
    cycles: [
      { from: 0, to: chzp, value: Dt },
      { from: chzp + 1, to: chzp + 9, value: Mt },
      { from: chzp + 10, to: null, value: Gt },
    ],
    events: [
      { from: 0, to: ev1, plus: TP1, minus: OPV1 },
      { from: ev1 + 1, to: ev1 + 9, plus: TP2, minus: OPV2 },
      { from: ev1 + 10, to: ev1 + 18, plus: TP3, minus: OPV3 },
      { from: ev1 + 19, to: null, plus: TP4, minus: OPV4 },
      { from: null, to: null, plus: TP5, minus: OPV5 },
    ],
  };
}

if (typeof module !== 'undefined' && module.exports) module.exports = { calcKarmic, nameArcana };

// ---------------- Подключение к платформе ----------------
// Порядок и источники текстов — как на листе «Расшифровка» исходного Excel.
function karmicPeriod(from, to) {
  if (from === null) return '∞';
  return from + '-' + (to === null ? '∞' : to);
}

function getKarmicResult(day, month, year, firstName) {
  const T = (typeof window !== 'undefined' && window.KARMIC_TEXTS) || {};
  const t = (table, n) => (T[table] && T[table][n]) || '';
  const r = calcKarmic({ day, month, year, firstName });
  if (!r.name) throw new Error('В имени нет букв для расчёта. Введите имя буквами.');
  const blocks = [];
  const one = (title, table, n) => blocks.push({ title: title + ' — ' + n, entries: [{ number: n, text: t(table, n) }] });

  one('Месяц рождения', 'month', r.month);
  one('Самореализация (СЗ)', 'sz', r.SZ);
  one('День рождения', 'day', r.day);
  blocks.push({
    title: 'Ошибки прошлого воплощения (кармические узлы)',
    entries: r.OPV.map((n, i) => ({ number: (i === 4 ? 'Главный кармический узел 5' : 'Кармический узел ' + (i + 1)) + ': ' + n, text: t('opv', n) })),
  });
  one('Имя', 'name', r.name);
  one('Зона комфорта', 'zk', r.ZK);
  one('Точка препятствия', 'tp', r.TP);
  blocks.push({
    title: 'Точки препятствия человека (числа кармы)',
    entries: r.TPchel.map((n, i) => ({ number: (i === 4 ? 'Главное число кармы 5' : 'Число кармы ' + (i + 1)) + ': ' + n, text: t('tpChel', n) })),
  });
  blocks.push({
    title: 'Кармические уроки',
    entries: r.KU.map((n, i) => ({ number: 'Кармический урок ' + (i + 1) + ': ' + n, text: t(['ku1', 'ku2', 'ku3', 'sz'][i], n) })),
  });
  one('Ангел-покровитель', 'gift', r.angel);
  one('Талант', 'gift', r.talent);
  one('Гармония души', 'harmony', r.harmony);
  one('Проработка кармы', 'mission', r.karmaWork);
  blocks.push({
    title: 'Циклы жизни',
    entries: r.cycles.map((c) => ({ number: 'Цикл ' + karmicPeriod(c.from, c.to) + ' лет: ' + c.value, text: t('cycles', c.value) })),
  });
  blocks.push({
    title: 'События по периодам жизни',
    entries: r.events.flatMap((e) => [
      { number: 'События «+» ' + karmicPeriod(e.from, e.to) + ': ' + e.plus, text: t('eventsPlus', e.plus) },
      { number: 'События «−» ' + karmicPeriod(e.from, e.to) + ': ' + e.minus, text: t('eventsMinus', e.minus) },
    ]),
  });
  return { numbers: r, blocks };
}

if (typeof window !== 'undefined') window.KarmicEngine = { getFullResult: getKarmicResult, calcKarmic, nameArcana };
if (typeof module !== 'undefined' && module.exports) module.exports.getKarmicResult = getKarmicResult;

})();
