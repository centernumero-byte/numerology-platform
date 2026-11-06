// Совместимость по чакроанализу: расчёт двух партнёров, диаграмма пары и расшифровка
(function () {
  const CHS = [
    { k: "adj", name: "Аджна", color: "#5b3fc4", glow: "#b9a6ff" },
    { k: "vis", name: "Вишудха", color: "#1e78d8", glow: "#8fd0ff" },
    { k: "ana", name: "Анахата", color: "#2e9e4a", glow: "#9cf0a8" },
    { k: "man", name: "Манипура", color: "#e0b100", glow: "#ffe98a" },
    { k: "sva", name: "Свадхистана", color: "#ef7d12", glow: "#ffc48a" },
    { k: "mul", name: "Муладхара", color: "#d8312f", glow: "#ff9b8f" },
  ];
  const D = () => window.CHAKRA_COMPAT_DATA;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const P = (t) => `<p>${esc(t)}</p>`;
  const H3 = (t) => `<h3 class="ch-h3">${esc(t)}</h3>`;
  const H4 = (t) => `<h4 class="ch-h4">${esc(t)}</h4>`;

  function calc(m, w) {
    const rm = window.ChakraEngine.calculate(m.date, m.hand || "правша", 1, new Date().getFullYear());
    const rw = window.ChakraEngine.calculate(w.date, w.hand || "правша", 1, new Date().getFullYear());
    return { m: Object.assign({}, m, { r: rm }), w: Object.assign({}, w, { r: rw }) };
  }

  // ---------- диаграмма пары ----------
  // Силуэт строится по левой половине и зеркально дополняется справа
  function sym(cx, start, segs) {
    const X = (dx) => (cx + dx).toFixed(1), MX = (dx) => (cx - dx).toFixed(1);
    let d = `M${MX(-start[0])} ${start[1]}`;
    d = `M${X(start[0])} ${start[1]}`;
    segs.forEach((q) => { d += ` C${X(q[0])} ${q[1]} ${X(q[2])} ${q[3]} ${X(q[4])} ${q[5]}`; });
    for (let i = segs.length - 1; i >= 0; i--) {
      const q = segs[i], prev = i === 0 ? start : [segs[i - 1][4], segs[i - 1][5]];
      d += ` C${MX(q[2])} ${q[3]} ${MX(q[0])} ${q[1]} ${MX(prev[0])} ${prev[1]}`;
    }
    return d + " Z";
  }
  const MAN = { start: [-10, 124], segs: [
    [-14, 134, -40, 140, -58, 147], [-72, 153, -78, 168, -78, 188], [-80, 230, -84, 270, -86, 302],
    [-87, 318, -84, 334, -76, 336], [-68, 338, -64, 326, -64, 312], [-62, 270, -60, 232, -56, 206],
    [-54, 250, -50, 290, -48, 326], [-46, 350, -44, 380, -42, 420], [-40, 470, -38, 510, -36, 536],
    [-36, 546, -16, 548, -14, 538], [-12, 500, -10, 440, -8, 392], [-6, 380, -3, 376, 0, 376]] };
  const WOMAN = { start: [-9, 126], segs: [
    [-12, 134, -34, 140, -48, 148], [-60, 154, -64, 168, -64, 184], [-66, 226, -70, 266, -72, 298],
    [-73, 314, -70, 328, -63, 330], [-56, 332, -53, 320, -53, 306], [-52, 270, -50, 236, -46, 208],
    [-44, 228, -32, 240, -30, 256], [-30, 272, -46, 292, -50, 316], [-58, 370, -72, 430, -80, 470],
    [-60, 477, -30, 478, 0, 478]] };
  function figure(cx, female) {
    if (!female) {
      const hair = `<path fill="url(#ccHair)" stroke="#e7c766" stroke-width="1.3" d="M${cx - 26} 84 C${cx - 30} 52 ${cx - 12} 50 ${cx} 52 C${cx + 14} 50 ${cx + 30} 54 ${cx + 26} 84 C${cx + 20} 70 ${cx + 6} 66 ${cx - 6} 68 C${cx - 16} 70 ${cx - 22} 74 ${cx - 26} 84 Z"/>`;
      return `<ellipse cx="${cx}" cy="88" rx="26" ry="32"/>` + hair + `<path d="${sym(cx, MAN.start, MAN.segs)}"/>`;
    }
    const hair = `<path fill="url(#ccHair)" stroke="#e7c766" stroke-width="1.3" d="M${cx - 25} 98 C${cx - 32} 64 ${cx - 18} 52 ${cx} 52 C${cx + 18} 52 ${cx + 32} 64 ${cx + 25} 98 C${cx + 22} 82 ${cx + 16} 72 ${cx + 4} 70 C${cx - 6} 76 ${cx - 16} 80 ${cx - 25} 98 Z"/>`;
    const legs = `<path d="M${cx - 26} 478 L${cx - 22} 534 C${cx - 22} 542 ${cx - 8} 542 ${cx - 9} 534 L${cx - 10} 478 Z"/><path d="M${cx + 26} 478 L${cx + 22} 534 C${cx + 22} 542 ${cx + 8} 542 ${cx + 9} 534 L${cx + 10} 478 Z"/>`;
    return `<ellipse cx="${cx}" cy="90" rx="23" ry="29"/>` + hair + `<path d="${sym(cx, WOMAN.start, WOMAN.segs)}"/>` + legs + `<path d="M${cx - 30} 256 C${cx - 10} 262 ${cx + 10} 262 ${cx + 30} 256" fill="none" stroke-width="2"/>`;
  }

  const GIVES = { adj: "понимание", vis: "умение договариваться", ana: "любовь и заботу", man: "волю и достижения", sva: "радость и удовольствие", mul: "силу и опору" };

  function diagram(res) {
    const W = 820, H = 640, xm = 170, xw = 650;
    const ys = { adj: 86, vis: 142, ana: 198, man: 252, sva: 304, mul: 354 };
    let defs = "", glow = "", dots = "", mid = "";
    function chakra(cx, c, pct, id) {
      const R = 10 + pct / 14, op = (0.45 + pct / 180).toFixed(2), y = ys[c.k];
      defs += `<radialGradient id="cg${id}" cx="45%" cy="40%" r="60%"><stop offset="0%" stop-color="#fff"/><stop offset="30%" stop-color="${c.glow}"/><stop offset="100%" stop-color="${c.color}"/></radialGradient><radialGradient id="cr${id}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${c.glow}" stop-opacity="${op}"/><stop offset="45%" stop-color="${c.color}" stop-opacity="${(op * 0.5).toFixed(2)}"/><stop offset="100%" stop-color="${c.color}" stop-opacity="0"/></radialGradient>`;
      glow += `<circle cx="${cx}" cy="${y}" r="${(R * 2.4 + pct / 6).toFixed(1)}" fill="url(#cr${id})"/>`;
      let rays = "";
      for (let k = 0; k < 12; k++) { const an = k * Math.PI / 6, r1 = R + 2, r2 = R + 5 + pct / 16; rays += `<line x1="${(cx + r1 * Math.cos(an)).toFixed(1)}" y1="${(y + r1 * Math.sin(an)).toFixed(1)}" x2="${(cx + r2 * Math.cos(an)).toFixed(1)}" y2="${(y + r2 * Math.sin(an)).toFixed(1)}" stroke="${c.glow}" stroke-width="1.8" stroke-linecap="round" opacity=".85"/>`; }
      dots += rays + `<circle cx="${cx}" cy="${y}" r="${R.toFixed(1)}" fill="url(#cg${id})" stroke="#fff6d8" stroke-width="1.2"/><text x="${cx}" y="${y + 4.5}" text-anchor="middle" font-size="13" font-weight="700" fill="#2a1240" font-family="Arial, sans-serif">${pct}%</text>`;
    }
    CHS.forEach((c, i) => {
      const a = res.m.r.chakras[c.k], b = res.w.r.chakras[c.k], y = ys[c.k];
      chakra(xm, c, a, "m" + i); chakra(xw, c, b, "w" + i);
      const L = 270, Rr = 550;
      mid += `<text x="410" y="${y - 10}" text-anchor="middle" font-size="14" font-weight="700" fill="${c.glow}" font-family="Arial, sans-serif">${c.name}</text>`;
      if (a === b) {
        mid += `<line x1="${L}" y1="${y + 2}" x2="${Rr}" y2="${y + 2}" stroke="${c.glow}" stroke-width="2" stroke-dasharray="4 5" opacity=".85"/><text x="410" y="${y + 20}" text-anchor="middle" font-size="12" fill="#efe4ff" font-family="Arial, sans-serif">поровну: ${GIVES[c.k]}</text>`;
      } else {
        const toW = a > b, x1 = toW ? L : Rr, x2 = toW ? Rr : L, dir = toW ? 1 : -1;
        mid += `<line x1="${x1}" y1="${y + 2}" x2="${x2 - dir * 12}" y2="${y + 2}" stroke="${c.glow}" stroke-width="3" stroke-linecap="round"/><path d="M${x2} ${y + 2} L${x2 - dir * 15} ${y - 5} L${x2 - dir * 15} ${y + 9} Z" fill="${c.glow}"/><text x="410" y="${y + 20}" text-anchor="middle" font-size="12" fill="#efe4ff" font-family="Arial, sans-serif">${toW ? "Мужчина" : "Женщина"} даёт ${GIVES[c.k]}</text>`;
      }
    });
    const lbl = (x, who, name, date) => `<text x="${x}" y="590" text-anchor="middle" font-size="19" font-weight="700" fill="#f6d66c" font-family="PT Serif, Georgia, serif">${esc(name || who)}</text><text x="${x}" y="612" text-anchor="middle" font-size="13" fill="#e7dcff" font-family="Arial, sans-serif">${esc(who)} · ${esc(date)}</text>`;
    return `<svg class="cc-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Диаграмма чакр пары">
<defs><linearGradient id="ccBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2d1756"/><stop offset="100%" stop-color="#120926"/></linearGradient>
<linearGradient id="ccBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d9c6ff" stop-opacity=".34"/><stop offset="100%" stop-color="#7a54c4" stop-opacity=".22"/></linearGradient>
<linearGradient id="ccHair" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c3a0ff" stop-opacity=".7"/><stop offset="100%" stop-color="#7a4cc8" stop-opacity=".55"/></linearGradient>
<radialGradient id="ccAura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#f6d66c" stop-opacity=".16"/><stop offset="60%" stop-color="#9b6bff" stop-opacity=".09"/><stop offset="100%" stop-color="#9b6bff" stop-opacity="0"/></radialGradient>${defs}</defs>
<rect width="${W}" height="${H}" rx="22" fill="url(#ccBg)"/>
${Array.from({ length: 60 }, (_, k) => `<circle cx="${(k * 137) % W}" cy="${(k * 89) % H}" r="${k % 3 ? 0.8 : 1.4}" fill="#fff" opacity="${k % 2 ? .3 : .55}"/>`).join("")}
<ellipse cx="${xm}" cy="300" rx="180" ry="290" fill="url(#ccAura)"/><ellipse cx="${xw}" cy="300" rx="180" ry="290" fill="url(#ccAura)"/>
<g fill="url(#ccBody)" stroke="#e7c766" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">${figure(xm, false)}${figure(xw, true)}</g>
<line x1="${xm}" y1="60" x2="${xm}" y2="370" stroke="#f6d66c" stroke-width="2" opacity=".28"/><line x1="${xw}" y1="62" x2="${xw}" y2="370" stroke="#f6d66c" stroke-width="2" opacity=".28"/>
${glow}${dots}${mid}
<text x="410" y="36" text-anchor="middle" font-size="15" fill="#f6d66c" font-family="Arial, sans-serif">Стрелка — от более сильной чакры к более слабой</text>
${lbl(xm, "Мужчина", res.m.name, res.m.date)}${lbl(xw, "Женщина", res.w.name, res.w.date)}
</svg>`;
  }

  // ---------- расшифровка ----------
  function sections(res) {
    const d = D(), M = res.m.name || "Мужчина", Wn = res.w.name || "Женщина";
    const rm = res.m.r, rw = res.w.r;
    const out = [];
    out.push(["Как читать совместимость по чакрам", P(d.intro)]);

    // типологии
    const tm = rm.typ, tw = rw.typ, key = Math.min(tm, tw) + "+" + Math.max(tm, tw);
    out.push(["Совместимость типологий: " + tm + " и " + tw,
      H4(M + " — типология " + tm) + P(d.typ[tm] || "") + H4(Wn + " — типология " + tw) + P(d.typ[tw] || "") + H4("Союз " + key) + P(d.pair[key] || "")]);

    // чакры
    let ch = "", mDon = 0, wDon = 0;
    CHS.slice().reverse().forEach((c) => {
      const a = rm.chakras[c.k], b = rw.chakras[c.k], t = d.chakra[c.k];
      const cat = (d.lookup[c.k] || {})[a + "-" + b] || (a === b ? "eq" : a > b ? "m" : "w");
      let txt = "";
      const hi = cat.indexOf("m") === 0 ? M : Wn, lo = cat.indexOf("m") === 0 ? Wn : M;
      if (cat.indexOf("m") === 0) mDon++; if (cat.indexOf("w") === 0) wDon++;
      if (cat.indexOf("eq") === 0) txt = t.eq;
      else if (cat === "sim") txt = t.similar;
      else if (cat === "bw") txt = t.bothWeak;
      else txt = t.hi.replace(/\{HI\}/g, hi).replace(/\{LO\}/g, lo);
      if (cat.indexOf("+bw") > 0 && t.bothWeak) txt += " " + t.bothWeak;
      ch += H4(c.name + ": " + M + " — " + a + "%, " + Wn + " — " + b + "%") + `<p class="ch-intro">${esc(t.about)}</p>` + P(txt);
      if (c.k === "man") ch += P(t.normHigh) + P(t.note);
    });
    out.push(["Совместимость по чакрам", ch]);

    // итог обмена
    let sum;
    if (mDon > wDon) sum = `Больше чакр сильнее у мужчины (${mDon} из 6, у женщины — ${wDon}). Значит, в этой паре мужчина чаще выступает источником энергии, а женщина — получает её и может расти, глядя на его пример. Мужчине важно следить, чтобы отдача не истощала его самого, а женщине — тоже наполнять партнёра в тех сферах, где она сильнее.`;
    else if (wDon > mDon) sum = `Больше чакр сильнее у женщины (${wDon} из 6, у мужчины — ${mDon}). Значит, в этой паре женщина чаще выступает источником энергии, а мужчина — получает её и может расти, глядя на её пример. Женщине важно следить, чтобы отдача не истощала её саму, а мужчине — тоже наполнять партнёршу в тех сферах, где он сильнее.`;
    else sum = `По количеству сильных чакр партнёры уравновешены (по ${mDon} у каждого, остальные одинаковые): каждый что-то даёт другому и что-то получает от него. Это лучший вариант для взаимного развития.`;
    out.push(["Баланс энергии в паре", P(sum) + P(d.vamp)]);

    // супруг по роду
    out.push(["Какой супруг предназначен по роду",
      H4(M + " — род " + rm.rod.up) + P(d.spouse[rm.rod.up] || "") + H4(Wn + " — род " + rw.rod.up) + P(d.spouse[rw.rod.up] || "")]);

    // показатели
    const row = (l, x, y) => `<tr><td>${esc(l)}</td><td>${esc(x)}</td><td>${esc(y)}</td></tr>`;
    const tbl = `<table class="ch-t"><tr><th>Показатель</th><th>${esc(M)}</th><th>${esc(Wn)}</th></tr>` +
      row("Инь (женская энергия)", rm.yin, rw.yin) + row("Ян (мужская энергия)", rm.yang, rw.yang) +
      row("Хочу", rm.want, rw.want) + row("Могу", rm.can, rw.can) + row("Сексуальный потенциал (магнетизм)", rm.sex, rw.sex) +
      row("Эмоциональный тип", rm.emoType.name, rw.emoType.name) + row("«Я» / «Мы»", rm.emoType.ya + " / " + rm.emoType.my, rw.emoType.ya + " / " + rw.emoType.my) + `</table>`;
    const yinT = (r, n) => n + ": " + (Math.abs(r.yin - r.yang) <= 10 ? "женская и мужская энергии в балансе." : r.yin > r.yang ? "преобладает Инь — больше мягкости, деликатности, чувственности." : "преобладает Ян — больше твёрдости, решительности, стремления вести.");
    const wcT = (r, n) => n + ": " + (r.want > r.can ? "«хочу» больше, чем «могу» — много идей и обещаний, но энтузиазм может быстро гаснуть; важны поэтапные шаги и отдых." : r.can > r.want ? "«могу» больше, чем «хочу» — сил больше, чем мотивации; убрав внутренние блоки, можно открыть много ресурсов." : "«хочу» и «могу» в равновесии.");
    const yaT = (r, n) => n + ": " + (Math.abs(r.emoType.ya - r.emoType.my) <= 5 ? "есть задатки и лидера, и командного игрока." : r.emoType.ya > r.emoType.my ? "«Я» больше — лидерские наклонности." : "«Мы» больше — сильнее в команде, чем в роли лидера.");
    out.push(["Инь — Ян, хочу — могу, «Я» — «Мы»", tbl +
      P("Инь — Ян показывают, какими качествами человек пользуется в жизни: при перевесе Инь больше мягкости и чувственности, при перевесе Ян — жёсткости и стремления доминировать. В идеале они в балансе. " + yinT(rm, M) + " " + yinT(rw, Wn)) +
      P("«Хочу — могу» показывает, насколько желания соответствуют реальным силам. " + wcT(rm, M) + " " + wcT(rw, Wn)) +
      P("Сексуальный потенциал (магнетизм) — это харизма, умение притягивать и удерживать внимание; от 1000 и выше человек редко остаётся незамеченным, а при меньших значениях над харизмой просто нужно работать усерднее. В паре: " + M + " — " + rm.sex + ", " + Wn + " — " + rw.sex + ".") +
      P("«Я — Мы» показывает лидерский потенциал. " + yaT(rm, M) + " " + yaT(rw, Wn) + (rm.emoType.ya > rm.emoType.my && rw.emoType.ya > rw.emoType.my ? " Оба склонны к лидерству — важно заранее разделить сферы влияния." : ""))]);

    out.push(["Сочетания чакр", P(d.combos)]);
    return out;
  }

  const CSS = `<style>.cc-svg{width:100%;max-width:820px;height:auto;display:block;margin:0 auto 16px;}</style>`;

  function render(m, w, container) {
    const res = calc(m, w);
    window._lastChakraCompat = res;
    const secs = sections(res);
    const acc = secs.map((s, i) => `<div class="accordion-item"><button type="button" class="accordion-header" onclick="toggleAccordionBody('cc-acc-${i}')"><span>${esc(s[0])}</span><span>▾</span></button><div class="accordion-body hidden" id="cc-acc-${i}" style="white-space:normal;">${s[1]}</div></div>`).join("");
    const title = "Совместимость по чакрам — " + (m.name || "Мужчина") + " и " + (w.name || "Женщина");
    container.innerHTML = CSS + `<div class="ch-wrap" style="max-width:820px;margin:0 auto;">
      <h2 style="font-family:PT Serif,Georgia,serif;color:#f6d66c;text-align:center;margin:0 0 12px;">${esc(title)}</h2>
      ${diagram(res)}
      <div style="margin-top:10px;">${acc}</div>
      <div style="display:flex;gap:12px;margin-top:20px;flex-wrap:wrap;">
        <button type="button" id="calcDownloadBtn" class="material-manager-button" style="width:auto;" onclick="ChakraCompat.download()">Скачать (диаграмма + текст)</button>
        <button type="button" class="material-manager-button" style="width:auto;background:rgba(0,0,0,.15);" onclick="openCalculator('chakra_compat')">Новый расчёт</button>
      </div></div>`;
    return res;
  }

  function download() {
    const res = window._lastChakraCompat; if (!res) return;
    const M = res.m.name || "Мужчина", Wn = res.w.name || "Женщина";
    let body = `<style>.ch-pdf p,.ch-pdf li,.ch-pdf td,.ch-pdf th{font-size:17px !important;line-height:1.55 !important;}
.ch-pdf h1{font-size:24px !important;} .ch-pdf h2{font-size:21px !important;color:#5d2789;font-family:PT Serif,Georgia,serif;border-bottom:1px solid #d7aa31;padding-bottom:4px;}
.ch-h4{color:#5d2789;font-size:18px;margin:14px 0 6px;} .ch-intro{font-style:italic;color:#4a3d5c;}
.ch-t{width:100%;border-collapse:collapse;margin:8px 0;} .ch-t td,.ch-t th{border:1px solid #d9c38a;padding:5px 7px;text-align:left;color:#221733;} .ch-t th{background:#f5eee0;color:#5d2789;}
.cc-svg{width:760px;max-width:100%;height:auto;}</style><div class="ch-pdf">`;
    body += `<h1 style="text-align:center;">Совместимость по чакрам — ${esc(M)} (${esc(res.m.date)}) и ${esc(Wn)} (${esc(res.w.date)})</h1>`;
    body += `<div style="text-align:center;">${diagram(res)}</div><div style="break-after:page;page-break-after:always;"></div>`;
    sections(res).forEach((s) => { body += `<h2>${esc(s[0])}</h2>` + s[1]; });
    body += `</div>`;
    downloadHtmlFile("Совместимость по чакрам - " + M + " " + res.m.date + " и " + Wn + " " + res.w.date + ".html", body);
  }

  window.ChakraCompat = { render, download, calc, sections };
})();
