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

if (typeof module !== 'undefined') module.exports = { calcKarmic, nameArcana };
