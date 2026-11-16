import json, re

def norm(v):
    if v is None: return ''
    return str(v).replace('\u2028', '\n')

with open('scratch/xlsx_sheet1.json', encoding='utf-8') as f:
    s1 = json.load(f)

with open('src/onboarding_data.ts', encoding='utf-8') as f:
    ob_data = f.read()

with open('src/onboarding.ts', encoding='utf-8') as f:
    ob_ts = f.read()

with open('index.html', encoding='utf-8') as f:
    html = f.read()

print('--- Check Sheet1 strings presence in onboarding_data.ts / index.html ---')
combined = ob_data + '\n' + ob_ts + '\n' + html
missing = []
for r in s1:
    gid = r.get('画面ID') or ''
    fld = r.get('フィールド名') or ''
    for lang, key in [('JA', '内容（入力欄）'), ('EN', '内容（EN)')]:
        val = norm(r.get(key)).strip()
        if not val or fld in ('イラスト',) or val == 'テキスト':
            continue
        # normalize fullwidth/newline for loose substring check first
        first_line = val.split('\n')[0].strip()
        if first_line and first_line not in combined and first_line.replace("'", "\\'") not in combined:
            missing.append((r['_row'], gid, fld, lang, val))

for m in missing:
    print(m)
print(f'Total potentially missing items: {len(missing)}')

