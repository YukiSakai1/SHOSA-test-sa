import openpyxl
import json

wb = openpyxl.load_workbook('翻訳.xlsx', data_only=True)

def dump_sheet(name):
    ws = wb[name]
    headers = [ws.cell(1, c).value for c in range(1, ws.max_column + 1)]
    rows = []
    for r in range(2, ws.max_row + 1):
        vals = [ws.cell(r, c).value for c in range(1, ws.max_column + 1)]
        if any(v is not None for v in vals):
            obj = {}
            for i, h in enumerate(headers):
                v = vals[i]
                if hasattr(v, 'isoformat'):
                    v = v.strftime('%H:%M') if hasattr(v, 'hour') else str(v)
                obj[str(h)] = v
            obj['_row'] = r
            rows.append(obj)
    return rows

s1 = dump_sheet('Sheet1')
s2 = dump_sheet('Sheet2')

with open('scratch/xlsx_sheet1.json', 'w', encoding='utf-8') as f:
    json.dump(s1, f, ensure_ascii=False, indent=2)

with open('scratch/xlsx_sheet2.json', 'w', encoding='utf-8') as f:
    json.dump(s2, f, ensure_ascii=False, indent=2)

print(f'Dumped Sheet1 ({len(s1)} rows) and Sheet2 ({len(s2)} rows)')

