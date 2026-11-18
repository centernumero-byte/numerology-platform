# Usage: python3 uz/src/build.py <name>  -> uz/<name>.js  (только переведённые части)
import json, sys, os, glob
name = sys.argv[1]
d = os.path.join(os.path.dirname(__file__), name)
out, done, total = {}, 0, 0
for ru in sorted(glob.glob(os.path.join(d, 'ru*.json'))):
    total += 1
    uz = ru.replace(os.sep + 'ru', os.sep + 'uz')
    if not os.path.exists(uz): continue
    a, b = json.load(open(ru, encoding='utf-8')), json.load(open(uz, encoding='utf-8'))
    if len(a) != len(b):
        sys.exit('LENGTH MISMATCH %s: %d vs %d' % (uz, len(a), len(b)))
    done += 1
    for k, v in zip(a, b):
        if v: out[k] = v  # айнан бир хил сўзлар ҳам (масалан «интуиция») — лотинчага ўгирилиши учун
js = '(window.NP_UZ_EXTRA = window.NP_UZ_EXTRA || []).push(' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ');\n'
open(os.path.join(os.path.dirname(__file__), '..', name + '.js'), 'w', encoding='utf-8').write(js)
print('%s: %d/%d chunks, %d lines' % (name, done, total, len(out)))
