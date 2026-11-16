import json

def norm(v):
    if v is None:
        return ''
    return str(v).replace('\u2028', '\n').strip()

with open('scratch/xlsx_sheet2.json', encoding='utf-8') as f:
    rows = json.load(f)

lessons_map = {}
guide = {}
end_data = {}
common = {}

for r in rows:
    gid = norm(r.get('画面ID'))
    fld = norm(r.get('フィールド名'))
    ja = norm(r.get('内容（入力欄）'))
    en = norm(r.get('内容（EN)'))
    if not gid:
        continue
    if gid.startswith('CH1-L'):
        parts = gid.split('-')
        lkey = parts[1] # L01..L11
        step = parts[2] # 01..04
        lobj = lessons_map.setdefault(lkey, {'id': lkey})
        if step == '01':
            if fld == '時刻': lobj['time'] = ja
            elif fld == 'タイトル':
                lobj['titleJa'] = ja
                lobj['titleEn'] = en
            elif fld == 'ナレーション':
                lobj['narrationJa'] = ja
                lobj['narrationEn'] = en
        elif step == '02':
            if 'キャラクター' in fld: lobj['charImgId'] = ja
            elif 'SHOSAさん' in fld: lobj['shosaImgId'] = ja
            elif '発話者名' in fld:
                lobj['speakerJa'] = ja
                lobj['speakerEn'] = en
            elif fld == 'セリフ（1ターン目）':
                lobj['line1Ja'] = ja
                lobj['line1En'] = en
            elif fld == 'セリフ（2ターン目・任意）':
                lobj['line2Ja'] = ja
                lobj['line2En'] = en
        elif step == '03':
            if fld == 'Situationタグ':
                lobj['situationTagJa'] = ja
                lobj['situationTagEn'] = en
            elif fld == '問いかけ':
                lobj['questionJa'] = ja
                lobj['questionEn'] = en
            elif fld == '選択肢A':
                lobj['choiceAJa'] = ja
                lobj['choiceAEn'] = en
            elif fld == '選択肢B':
                lobj['choiceBJa'] = ja
                lobj['choiceBEn'] = en
            elif '正解' in fld:
                lobj['correct'] = ja
        elif step == '04':
            if 'シンプル理由' in fld:
                lobj['reasonJa'] = ja
                lobj['reasonEn'] = en
            elif '誘導セリフ' in fld:
                lobj['shosaPromptJa'] = ja
                lobj['shosaPromptEn'] = en
            elif 'SHOSA Focus' in fld and '画像' not in fld:
                lobj['focusTextJa'] = ja
                lobj['focusTextEn'] = en
            elif '画像' in fld and 'SHOSA Focus' in fld:
                lobj['focusImgCaptionJa'] = ja
    elif gid == 'CH1-GUIDE':
        guide[fld] = {'ja': ja, 'en': en}
    elif gid == 'CH1-END':
        end_data[fld] = {'ja': ja, 'en': en}
    elif gid.startswith('CH1-COMMON'):
        common[gid] = {'field': fld, 'ja': ja, 'en': en}

print('Lessons parsed:', len(lessons_map), list(lessons_map.keys()))
for k, v in lessons_map.items():
    missing = [f for f in ['time','titleJa','titleEn','narrationJa','narrationEn','line1Ja','line1En','line2Ja','line2En','situationTagJa','situationTagEn','questionJa','questionEn','choiceAJa','choiceAEn','choiceBJa','choiceBEn','correct','reasonJa','reasonEn','shosaPromptJa','shosaPromptEn','focusTextJa','focusTextEn'] if not v.get(f)]
    if missing:
        print(f'{k} missing:', missing)
    print(f"{k}: speakerJa={repr(v.get('speakerJa'))} speakerEn={repr(v.get('speakerEn'))} charImg={v.get('charImgId')}")

print('\nGUIDE:', json.dumps(guide, ensure_ascii=False, indent=2))
print('\nEND:', json.dumps(end_data, ensure_ascii=False, indent=2))
print('\nCOMMON:', json.dumps(common, ensure_ascii=False, indent=2))

