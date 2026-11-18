/* Тил алмаштиргич: Русский / Ўзбекча (кирилл) / Oʻzbekcha (lotin).
   Ўзбек тили фақат администратор «Доступы» бўлимида рухсат берган фойдаланувчиларга кўринади.
   Русская версия работает как раньше — этот файл ничего не меняет, пока выбран русский. */
(function () {
  "use strict";
  var LS_KEY = "np_lang";
  var LANGS = ["ru", "uzc", "uzl"];

  function readLang() {
    try { var v = localStorage.getItem(LS_KEY); return LANGS.indexOf(v) >= 0 ? v : "ru"; } catch (e) { return "ru"; }
  }
  var state = { lang: "ru", allowed: false, observer: null };

  /* ---------- Кирилл → лотин (1995 йилги расмий алифбо) ---------- */
  var VOWELS = "аеёиоуэюяўАЕЁИОУЭЮЯЎ";
  var MAP = {
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "ё": "yo", "ж": "j", "з": "z", "и": "i", "й": "y",
    "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
    "ф": "f", "х": "x", "ч": "ch", "ш": "sh", "щ": "sh", "ъ": "ʼ", "ы": "i", "ь": "", "э": "e", "ю": "yu",
    "я": "ya", "ў": "oʻ", "қ": "q", "ғ": "gʻ", "ҳ": "h"
  };
  function isCyrLetter(ch) { return /[А-Яа-яЁёЎўҚқҒғҲҳ]/.test(ch); }
  function isUpper(ch) { return ch !== ch.toLowerCase() && ch === ch.toUpperCase(); }
  function translit(text) {
    if (!text || !/[А-Яа-яЁёЎўҚқҒғҲҳ]/.test(text)) return text;
    var out = "";
    for (var i = 0; i < text.length; i++) {
      var ch = text[i], lo = ch.toLowerCase(), prev = i > 0 ? text[i - 1] : "", next = text[i + 1] || "";
      var lat;
      if (lo === "е") {
        var wordStart = !prev || !isCyrLetter(prev);
        lat = (wordStart || VOWELS.indexOf(prev) >= 0 || "ъьЪЬ".indexOf(prev) >= 0) ? "ye" : "e";
      } else if (lo === "ц") {
        lat = (prev && VOWELS.indexOf(prev) >= 0) ? "ts" : "s";
      } else if (MAP.hasOwnProperty(lo)) {
        lat = MAP[lo];
      } else { out += ch; continue; }
      if (isUpper(ch) && lat) {
        var allCaps = (next && isUpper(next) && isCyrLetter(next)) || (prev && isUpper(prev) && isCyrLetter(prev) && !(next && isCyrLetter(next) && !isUpper(next)));
        lat = allCaps ? lat.toUpperCase() : lat.charAt(0).toUpperCase() + lat.slice(1);
      }
      out += lat;
    }
    return out;
  }

  /* ---------- Луғат ---------- */
  var dict = null, prefixKeys = null;
  function norm(s) { return String(s).replace(/\s+/g, " ").trim(); }
  function buildDict() {
    dict = new Map();
    var sources = [window.NP_UZ_UI || {}];
    (window.NP_UZ_EXTRA || []).forEach(function (x) { sources.push(x); });
    sources.forEach(function (src) {
      Object.keys(src).forEach(function (k) { dict.set(norm(k), src[k]); });
    });
    // Префикс сифатида фақат интерфейс луғати ишлатилади
    prefixKeys = Object.keys(window.NP_UZ_UI || {}).map(norm).filter(function (k) { return k.length >= 3; })
      .sort(function (a, b) { return b.length - a.length; });
  }
  function out(uz) { return state.lang === "uzl" ? translit(uz) : uz; }

  var MONTHS_GEN = { "января": "январ", "февраля": "феврал", "марта": "март", "апреля": "апрел", "мая": "май", "июня": "июн", "июля": "июл", "августа": "август", "сентября": "сентябр", "октября": "октябр", "ноября": "ноябр", "декабря": "декабр" };

  // Матнни таржима қилиш. Топилмаса — null.
  function translate(raw) {
    if (!dict) buildDict();
    var t = norm(raw);
    if (!t || !/[А-Яа-яЁё]/.test(t)) return null;
    if (dict.has(t)) return out(dict.get(t));
    // Бир нечта қаторли матн: ҳар бир қаторни алоҳида таржима қиламиз
    var lines = String(raw).split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
    if (lines.length > 1) {
      var okAll = true, res = lines.map(function (ln) {
        if (!/[А-Яа-яЁё]/.test(ln)) return ln;
        var r = translate(ln); if (r == null) okAll = false; return r == null ? ln : r;
      });
      if (okAll) return res.join("\n");
    }
    var m;
    if ((m = t.match(/^(\d{4})\s*(года|год|г\.?)$/))) return out(m[1] + " йил");
    if ((m = t.match(/^(\d[\d,.\s\-–—]*)\s*(лет|года|год)$/))) return out(m[1].trim() + " ёш");
    if ((m = t.match(/^(\d+)\s*(года|год)$/))) return out(m[1] + " йил");
    if ((m = t.match(/^(\d{1,2})\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)(\s+\d{4})?(\s*г\.?)?$/))) {
      return out(m[1] + " " + MONTHS_GEN[m[2]] + (m[3] || ""));
    }
    // Формулалар: «(Небо 11 + Земля 5)»
    if (/^\(.*\d.*\)$/.test(t) && /\+/.test(t)) {
      var TERMS = { "Небо": "Осмон", "Земля": "Ер", "Муж. линия": "Эркак чизиғи", "Жен. линия": "Аёл чизиғи", "Личное": "Шахсий", "Социальное": "Ижтимоий", "Духовное": "Маънавий" };
      var f = t, hit = false;
      Object.keys(TERMS).forEach(function (k) { if (f.indexOf(k) >= 0) { f = f.split(k).join(TERMS[k]); hit = true; } });
      if (hit) return out(f);
    }
    // Ёрлиқ + давоми: «Взрослая матрица - Ivanova (01.01.1990)», «Доступ открыт до 12.12.2026»
    for (var i = 0; i < prefixKeys.length; i++) {
      var k = prefixKeys[i];
      if (t.length <= k.length || !t.startsWith(k)) continue;
      var rest = t.slice(k.length);
      var endsWithSep = /[-—:,(]$/.test(k);
      var boundary = /^[\s\d.,:;()\-—«»"'!?/]/.test(rest);
      if (!boundary && !endsWithSep) continue;
      var restHasRu = /[А-Яа-яЁё]/.test(rest);
      if (restHasRu && !endsWithSep) continue;
      var restTr = restHasRu ? (translate(rest) || rest) : rest;
      return out(dict.get(k)) + (state.lang === "uzl" ? translit(restTr) : restTr);
    }
    return null;
  }

  function translateKeepSpaces(raw) {
    var tr = translate(raw);
    if (tr == null) return null;
    var lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0];
    return lead + tr + trail;
  }

  /* ---------- DOM ---------- */
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1, INPUT: 1 };
  var ATTRS = ["placeholder", "title", "aria-label"];

  function skipEl(el) {
    return !el || SKIP[el.tagName] || (el.closest && el.closest("[data-noi18n]"));
  }

  // <br> билан бўлинган сарлавҳалар: «Взрослая<br>матрица»
  function translateBrBlock(el) {
    if (!el.childNodes.length || el.children.length === 0) return false;
    var hasBr = false;
    for (var i = 0; i < el.childNodes.length; i++) {
      var n = el.childNodes[i];
      if (n.nodeType === 1) { if (n.tagName !== "BR") return false; hasBr = true; }
      else if (n.nodeType !== 3) return false;
    }
    if (!hasBr) return false;
    var joined = norm(Array.prototype.map.call(el.childNodes, function (x) { return x.nodeType === 3 ? x.nodeValue : " "; }).join(""));
    var tr = translate(joined);
    if (tr == null) return false;
    el.textContent = tr;
    return true;
  }

  function translateNode(root) {
    if (state.lang === "ru" || !root) return;
    if (root.nodeType === 3) {
      if (skipEl(root.parentElement)) return;
      var tr = translateKeepSpaces(root.nodeValue);
      if (tr != null && tr !== root.nodeValue) root.nodeValue = tr;
      return;
    }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1 && skipEl(root)) return;
    var els = root.querySelectorAll ? root.querySelectorAll("*") : [];
    var list = root.nodeType === 1 ? [root].concat(Array.prototype.slice.call(els)) : Array.prototype.slice.call(els);
    list.forEach(function (el) {
      if (skipEl(el)) return;
      ATTRS.forEach(function (a) {
        var v = el.getAttribute(a);
        if (v) { var tr = translate(v); if (tr != null) el.setAttribute(a, tr); }
      });
      if (el.tagName === "INPUT" && (el.type === "button" || el.type === "submit") && el.value) {
        var tv = translate(el.value); if (tv != null) el.value = tv;
      }
      translateBrBlock(el);
    });
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(function (tn) {
      if (skipEl(tn.parentElement)) return;
      var tr = translateKeepSpaces(tn.nodeValue);
      if (tr != null && tr !== tn.nodeValue) tn.nodeValue = tr;
    });
  }

  function startObserver() {
    if (state.observer || state.lang === "ru") return;
    translateNode(document.body);
    if (document.title) { var tt = translate(document.title); if (tt) document.title = tt; }
    state.observer = new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        if (m.type === "characterData") translateNode(m.target);
        else if (m.type === "attributes") {
          var v = m.target.getAttribute(m.attributeName);
          var tr = v && translate(v);
          if (tr && tr !== v) m.target.setAttribute(m.attributeName, tr);
        } else m.addedNodes.forEach(function (x) { translateNode(x); });
      });
    });
    state.observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }

  /* ---------- PDF ва файллар учун HTML таржимаси ---------- */
  function translateHtml(html) {
    if (state.lang === "ru" || !html) return html;
    try {
      var doc = document.implementation.createHTMLDocument("x");
      doc.body.innerHTML = html;
      // TreeWalker/NodeFilter асосий ҳужжатдан олинади
      var walker = doc.createTreeWalker(doc.body, 4, null), tn, nodes = [];
      while ((tn = walker.nextNode())) nodes.push(tn);
      Array.prototype.forEach.call(doc.body.querySelectorAll("*"), function (el) {
        if (SKIP[el.tagName] || el.closest("[data-noi18n]")) return;
        ATTRS.forEach(function (a) { var v = el.getAttribute(a); if (v) { var t = translate(v); if (t != null) el.setAttribute(a, t); } });
        translateBrBlock(el);
      });
      nodes.forEach(function (n) {
        if (!n.parentElement || SKIP[n.parentElement.tagName] || n.parentElement.closest("[data-noi18n]")) return;
        var t = translateKeepSpaces(n.nodeValue);
        if (t != null) n.nodeValue = t;
      });
      return doc.body.innerHTML;
    } catch (e) { console.warn("i18n PDF:", e); return html; }
  }
  function translateText(s) {
    if (state.lang === "ru" || !s) return s;
    var t = translate(s);
    return t == null ? s : t;
  }

  /* ---------- Алмаштиргич ---------- */
  var SWITCH_CSS = ".np-lang{display:flex;gap:4px;margin:6px 12px 14px;padding:4px;border:1px solid rgba(225,180,52,.35);border-radius:12px;background:rgba(0,0,0,.18)}" +
    ".np-lang button{flex:1;padding:7px 4px;border:0;border-radius:9px;background:transparent;color:#cdbfa0;font-size:12px;line-height:1.15;cursor:pointer;font-family:inherit}" +
    ".np-lang button small{display:block;font-size:10px;opacity:.75}" +
    ".np-lang button.on{background:linear-gradient(90deg,#713199,#5d2789);color:#f8d96d}";

  function renderSwitch() {
    var old = document.getElementById("npLangSwitch");
    if (!state.allowed) { if (old) old.remove(); return; }
    if (old) return;
    var logo = document.querySelector(".sidebar .logo");
    if (!logo) return;
    if (!document.getElementById("npLangCss")) {
      var st = document.createElement("style"); st.id = "npLangCss"; st.textContent = SWITCH_CSS; document.head.appendChild(st);
    }
    var box = document.createElement("div");
    box.id = "npLangSwitch"; box.className = "np-lang"; box.setAttribute("data-noi18n", "");
    box.innerHTML =
      '<button type="button" data-l="ru">Русский</button>' +
      '<button type="button" data-l="uzc">Ўзбекча<small>кирилл</small></button>' +
      '<button type="button" data-l="uzl">Oʻzbekcha<small>lotin</small></button>';
    Array.prototype.forEach.call(box.querySelectorAll("button"), function (b) {
      if (b.dataset.l === state.lang) b.classList.add("on");
      b.addEventListener("click", function () { setLang(b.dataset.l); });
    });
    logo.parentNode.insertBefore(box, logo.nextSibling);
  }

  function setLang(l) {
    if (LANGS.indexOf(l) < 0 || l === state.lang) return;
    try { localStorage.setItem(LS_KEY, l); } catch (e) {}
    // Тоза ҳолатда қайта очамиз — ҳар бир тил мустақил ишлайди
    location.reload();
  }

  // Калькуляторлар матнлари таржимаси (фақат ўзбек тили танланганда юкланади)
  var PACKS = ["uz/adult.js", "uz/child.js"];
  var VER = "20261118c";
  function loadPacks() {
    PACKS.forEach(function (src) {
      var s = document.createElement("script");
      s.src = src + "?v=" + VER;
      s.onload = function () { dict = null; translateNode(document.body); };
      document.head.appendChild(s);
    });
  }

  // checkAuth рухсатни аниқлагач чақирилади
  function init(allowed) {
    state.allowed = !!allowed;
    var wanted = readLang();
    state.lang = state.allowed ? wanted : "ru";
    document.documentElement.setAttribute("data-np-lang", state.lang);
    if (state.lang !== "ru") {
      document.documentElement.lang = state.lang === "uzl" ? "uz-Latn" : "uz-Cyrl";
      startObserver();
      if (!state.packsLoaded) { state.packsLoaded = true; loadPacks(); }
    }
    renderSwitch();
  }

  // Ойна хабарлари (alert / confirm) ҳам таржима қилинади
  var _alert = window.alert, _confirm = window.confirm;
  window.alert = function (msg) { return _alert.call(window, translateMsg(msg)); };
  window.confirm = function (msg) { return _confirm.call(window, translateMsg(msg)); };
  function translateMsg(msg) {
    if (state.lang === "ru" || msg == null) return msg;
    return String(msg).split("\n").map(function (line) { var t = translate(line); return t == null ? line : t; }).join("\n");
  }

  window.NP_I18N = {
    init: init,
    lang: function () { return state.lang; },
    isUz: function () { return state.lang !== "ru"; },
    t: translateText,
    html: translateHtml,
    translit: translit,
    refreshSwitch: renderSwitch,
    translateNode: translateNode
  };
})();
