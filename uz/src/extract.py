# Usage: python3 uz/src/extract.py <engine.js> <name> [chunk_chars]
import re, json, sys, os
src, name = sys.argv[1], sys.argv[2]
limit = int(sys.argv[3]) if len(sys.argv) > 3 else 9000
s = open(src, encoding='utf-8').read()
seen, lines = set(), []
# Бошқа пакетларда ва UI луғатида аллақачон бор қаторларни ўтказиб юборамиз
import glob
base = os.path.dirname(os.path.abspath(__file__))
for f in glob.glob(os.path.join(base, '*', 'ru*.json')):
    if os.path.basename(os.path.dirname(f)) != name:
        seen.update(json.load(open(f, encoding='utf-8')))
ui = open(os.path.join(base, '..', '..', 'i18n-uz-ui.js'), encoding='utf-8').read()
seen.update(json.loads('"' + k + '"') for k in re.findall(r'^\s*"((?:[^"\\]|\\.)*)"\s*:', ui, re.M))
for l in re.findall(r'"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`|\'((?:[^\'\\\n]|\\.)*)\'', s):
    l = next(x for x in l if x is not None) if any(l) else ''
    if not re.search('[А-Яа-яЁё]', l): continue
    try: v = json.loads('"' + l.replace('\n', '\\n') + '"')
    except Exception: v = l
    for line in re.split(r'\n+', v):
        line = re.sub(r'\s+', ' ', line).strip()
        if '${' in line: continue
        if re.search('[А-Яа-яЁё]', line) and line not in seen:
            seen.add(line); lines.append(line)
d = os.path.join(os.path.dirname(__file__), name)
os.makedirs(d, exist_ok=True)
chunks, cur, n = [], [], 0
for line in lines:
    if cur and n + len(line) > limit:
        chunks.append(cur); cur, n = [], 0
    cur.append(line); n += len(line)
if cur: chunks.append(cur)
for i, c in enumerate(chunks):
    json.dump(c, open(os.path.join(d, 'ru%03d.json' % i), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print(len(lines), sum(map(len, lines)), 'chunks:', len(chunks))
