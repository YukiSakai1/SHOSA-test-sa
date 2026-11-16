import json

def norm(v):
    if v is None:
        return ''
    return str(v).replace('\u2028', '\n')

with open('scratch/xlsx_sheet1.json', encoding='utf-8') as f:
    s1 = json.load(f)

print('=== SHEET1 ROWS 65-100 ===')
for r in s1:
    if 65 <= r['_row'] <= 100:
        gid = r.get('画面ID') or ''
        fld = r.get('フィールド名') or ''
        ja = norm(r.get('内容（入力欄）'))
        en = norm(r.get('内容（EN)'))
        print(f"{r['_row']:3d} | {gid:12s} | {fld:18s} | JA={repr(ja)} | EN={repr(en)}")

print('\n=== SHEET2 ALL ROWS ===')
with open('scratch/xlsx_sheet2.json', encoding='utf-8') as f:
    s2 = json.load(f)
for r in s2:
    gid = r.get('画面ID') or ''
    tpl = r.get('テンプレ種別') or ''
    fld = r.get('フィールド名') or ''
    ja = norm(r.get('内容（入力欄）'))
    en = norm(r.get('内容（EN)'))
    print(f"{r['_row']:3d} | {gid:14s} | {tpl:16s} | {fld:20s} | JA={repr(ja)} | EN={repr(en)}")
