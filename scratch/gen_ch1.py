import json

def norm(v):
    if v is None:
        return ''
    return str(v).replace('\u2028', '\n').strip()

IMAGE_MAP = {
    'CH1-CHAR-FRONT-LATE-GROOMING': 'assets/images/img.png',
    'CH1-CHAR-FRONT-EARLY-NORMAL': 'assets/images/avatars/staff_male_03_banner_neutral.jpg',
    'CH1-CHAR-FRONT-LATE-SMILE': 'assets/images/avatars/staff_female_03_banner_happy.jpg',
    'CH1-CHAR-FRONT-LATE-INCOM': 'assets/images/avatars/staff_female_03_banner_neutral.jpg',
    'CH1-CHAR-FRONT-LATE-NORMAL': 'assets/images/avatars/staff_female_03_banner_neutral.jpg',
    'CH1-CHAR-RESTAURANT-SMILE': 'assets/images/avatars/staff_male_01_banner_happy.jpg',
    'CH1-CHAR-FRONT-NIGHT-SERIOUS': 'assets/images/avatars/staff_male_03_banner_neutral.jpg',
    'CH1-CHAR-RESTAURANT-GUIDE': 'assets/images/avatars/staff_male_01_banner_neutral.jpg',
    'CH1-CHAR-FRONT-EARLY-RECEIPT': 'assets/images/avatars/staff_male_03_banner_happy.jpg',
    'CH1-CHAR-HOUSEKEEPING-NOTICE': 'assets/images/avatars/staff_female_02.jpg',
}

with open('scratch/xlsx_sheet2.json', encoding='utf-8') as f:
    rows = json.load(f)

lessons_map = {}
guide = {}
end_data = {}

for r in rows:
    gid = norm(r.get('画面ID'))
    fld = norm(r.get('フィールド名'))
    ja = norm(r.get('内容（入力欄）'))
    en = norm(r.get('内容（EN)'))
    if not gid:
        continue
    if gid.startswith('CH1-L'):
        parts = gid.split('-')
        lkey = parts[1]
        step = parts[2]
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
            if 'キャラクター' in fld:
                lobj['charImgId'] = ja
                lobj['sceneImg'] = IMAGE_MAP.get(ja, 'assets/images/img.png')
            elif 'SHOSAさん' in fld:
                lobj['shosaImgId'] = ja
            elif '発話者名' in fld:
                lobj['speakerJa'] = '' if ja.startswith('-（') else ja
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

ch1_data = {
    'guide': {
        'badgeNumber': '101',
        'titleJa': guide['メインタイトル']['ja'],
        'titleEn': guide['メインタイトル']['en'],
        'subtitleJa': guide['サブタイトル']['ja'],
        'subtitleEn': guide['サブタイトル']['en'],
        'bodyJa': guide['本文']['ja'],
        'bodyEn': guide['本文']['en'],
        'buttonJa': guide['ボタンテキスト']['ja'],
        'buttonEn': guide['ボタンテキスト']['en'],
    },
    'end': {
        'titleJa': end_data['メインタイトル']['ja'],
        'titleEn': end_data['メインタイトル']['en'],
        'bodyJa': end_data['本文']['ja'],
        'bodyEn': end_data['本文']['en'],
        'noteJa': end_data['補足']['ja'],
        'noteEn': end_data['補足']['en'],
        'unlockLabelJa': end_data['2章解放ラベル']['ja'],
        'unlockLabelEn': end_data['2章解放ラベル']['en'],
        'buttonJa': end_data['ボタンテキスト']['ja'],
        'buttonEn': end_data['ボタンテキスト']['en'],
    },
    'common': {
        'correctJa': '正解！',
        'correctEn': 'Correct!',
        'incorrectJa': '不正解',
        'incorrectEn': 'Incorrect',
        'situationLabel': 'SITUATION',
        'questionLabel': 'QUESTION',
    },
    'lessons': [lessons_map[k] for k in sorted(lessons_map.keys())],
}

ts = "\n\n// Chapter 1 Data generated verbatim from 翻訳.xlsx (Sheet2)\nconst CH1_DATA: Chapter1Data = " + json.dumps(ch1_data, ensure_ascii=False, indent=2) + ";\nwindow.CH1_DATA = CH1_DATA;\n"
with open('scratch/ch1_block.ts', 'w', encoding='utf-8') as f:
    f.write(ts)
print('Generated scratch/ch1_block.ts, lessons:', len(ch1_data['lessons']), 'chars:', len(ts))

