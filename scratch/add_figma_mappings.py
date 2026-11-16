import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Load workbooks
wb = openpyxl.load_workbook('翻訳.xlsx')
wb_orig = openpyxl.load_workbook('google_sheets_latest.xlsx', data_only=True)

# 1. Build screen map from 画面リスト
ws_list = wb_orig['画面リスト']
screen_map = {}
for r in range(2, ws_list.max_row+1):
    sid = ws_list.cell(r, 1).value
    name = ws_list.cell(r, 2).value
    sub = ws_list.cell(r, 3).value
    if sid:
        sid_str = str(sid).strip()
        desc = str(name).strip() if name else ''
        if sub and str(sub).strip() != '-' and str(sub).strip() not in desc:
            desc += f' ({str(sub).strip()})'
        screen_map[sid_str] = desc

print(f'Loaded screen map with {len(screen_map)} entries.')

# Color & styling definitions
header_fill = PatternFill(start_color='1E7E34', end_color='1E7E34', fill_type='solid')
header_font = Font(name='游ゴシック', size=10, bold=True, color='FFFFFF')
red_fill = PatternFill(start_color='FFCDD2', end_color='FFCDD2', fill_type='solid')
red_font = Font(name='游ゴシック', size=9, bold=True, color='900C3F')
yellow_fill = PatternFill(start_color='FFF9C4', end_color='FFF9C4', fill_type='solid')
yellow_font = Font(name='游ゴシック', size=9, bold=False, color='333333')
cell_font = Font(name='游ゴシック', size=9)
cell_align = Alignment(vertical='top', wrap_text=True)

thin_border = Border(
    left=Side(style='thin', color='CCCCCC'),
    right=Side(style='thin', color='CCCCCC'),
    top=Side(style='thin', color='CCCCCC'),
    bottom=Side(style='thin', color='CCCCCC')
)

# 2. Update Sheet 1: 【提案】表記ルール・用語定義案
print('Updating Sheet 1: 【提案】表記ルール・用語定義案 with Figma screen mapping...')
ws_prop = wb['【提案】表記ルール・用語定義案']

# Update Title / Overview
ws_prop.cell(1, 1, '【SHOSAアプリ 英語翻訳】先行分（11/16確認出し）提案書・表記ルール・用語定義・Figma画面対応一覧')

# Add header for Figma mapping in Section 2 (表記ルール)
# Col 1: 項目, Col 2: 日本語表記例, Col 3: 英語表記の統一ルール, Col 4: 英語表記例, Col 5: 該当章・Figma画面（新設）
ws_prop.cell(15, 5, '該当章・対応Figma画面 / レイヤー')
ws_prop.cell(15, 5).font = Font(name='游ゴシック', size=9, bold=True, color='FFFFFF')
ws_prop.cell(15, 5).fill = PatternFill(start_color='1B4F72', end_color='1B4F72', fill_type='solid')
ws_prop.column_dimensions['E'].width = 40

figma_rules_map = {
    16: '1章全般（CH1-L01-03 出勤前身だしなみ、CH1-L02-03 等）、3章各問題',
    17: '1章 L06（CH1-L06-02, 04 アレルギー情報共有・ネームコール接遇）',
    18: '1章 各レッスン選択肢画面（テンプレ3: think/judge）、3章 選択肢',
    19: '1章 各レッスン時刻インサート（CH1-L01-01 12:45, CH1-L02-01 13:00 等）',
    20: '0章 ヒアリング画面（CH0-07〜11）、3章 完了画面（CH3-L1-11）',
    21: '1章 各レッスン状況説明画面（テンプレ2: observe スタッフ心の声）',
    22: '1章・2章・3章（テンプレ2 講評[丁寧] vs テンプレ4 誘導[親しみ]）',
    23: '1章 L04 アメニティ対応（CH1-L04-03）、3章 業務スキル対応'
}

for r, figma_info in figma_rules_map.items():
    ws_prop.cell(r, 5, figma_info).font = cell_font
    ws_prop.cell(r, 5).alignment = cell_align
    ws_prop.cell(r, 5).border = thin_border

# Add header for Figma mapping in Section 3 (独自用語・ホテル専門用語)
# Col 1: 用語, Col 2: 分類, Col 3: 英語表記案, Col 4: 日本語定義, Col 5: 該当章・初出Figma画面（新設）
ws_prop.cell(26, 5, '該当章・初出Figma画面 / シーン')
ws_prop.cell(26, 5).font = Font(name='游ゴシック', size=9, bold=True, color='FFFFFF')
ws_prop.cell(26, 5).fill = PatternFill(start_color='1B4F72', end_color='1B4F72', fill_type='solid')

figma_terms_map = {
    27: '1章 L01（CH1-L01-04 【12:45】出勤前の身だしなみチェック 2段階解説）',
    28: '1章 L01（CH1-L01-03, 04 【12:45】出勤前の身だしなみチェック 選択問題・解説）',
    29: '1章 L09（CH1-L09-04 【10:00】チェックアウトピークの見送り余韻 2段階解説）',
    30: '1章 L09（CH1-L09-02, 03, 04 【10:00】チェックアウトピークの見送り余韻）',
    31: '1章 L06（CH1-L06-01〜04 【19:30】アレルギー情報共有・ネームコール接遇）',
    32: '1章 L04（CH1-L04-02, 04 【17:00】アメニティのイレギュラー対応）',
    33: '1章 L02（CH1-L02-04 【13:00】引き継ぎの仕方 2段階解説）',
    34: '1章 ガイダンス（CH1-01）、L03（CH1-L03-04 【15:00】チェックインピークの目配り）',
    35: '1章 全体（CH1-01〜CH1-END）、アプリメインコンセプト',
    36: '3章 L01（CH3-L1-03 予約検索・確認、フロントPMS操作）'
}

for r, figma_info in figma_terms_map.items():
    ws_prop.cell(r, 5, figma_info).font = cell_font
    ws_prop.cell(r, 5).alignment = cell_align
    ws_prop.cell(r, 5).border = thin_border
    if r in [30, 31]:
        ws_prop.cell(r, 5).fill = red_fill
        ws_prop.cell(r, 5).font = red_font
    else:
        ws_prop.cell(r, 5).fill = yellow_fill

# Add section in Section 4 for Figma layout coordination
ws_prop.cell(46, 1, '【Figma上の文字数調整対象フレーム（諏訪様と相談）】').font = Font(name='游ゴシック', size=9, bold=True)
figma_design_items = [
    ('3章 CH3-02', 'JOB選択画面（レストラン・予約業務説明テキスト枠）', '文字数上限+11〜22文字。改行またはフォントサイズ調整相談'),
    ('3章 CH3-L1-03', '選択問題画面（予約確認問題）', '文字数上限+8文字。2択ボタン枠内の行数確認'),
    ('1章 CH1-L01-04', 'L01 結果＆2段階解説画面（SHOSA Focus吹き出し）', '引き算の配慮の解説。スクロールまたはフォントサイズ調整相談')
]
for idx, (f_screen, f_frame, f_note) in enumerate(figma_design_items, 47):
    ws_prop.cell(idx, 1, f_screen).font = cell_font
    ws_prop.cell(idx, 2, f_frame).font = cell_font
    ws_prop.cell(idx, 3, f_note).font = cell_font
    ws_prop.cell(idx, 1).fill = yellow_fill
    ws_prop.cell(idx, 2).fill = yellow_fill
    ws_prop.cell(idx, 3).fill = yellow_fill

print('Updated Sheet 1 with Figma mappings.')

# 3. Update 用語定義 sheet
print('Updating 用語定義 sheet with Figma screen mappings...')
ws_term = wb['用語定義']
# Col 8 is currently 初出/使用例. Let's make it more explicit with Figma screen info
ws_term.cell(1, 8, '初出/該当Figma画面（何章のどれにあたるか）')
ws_term.column_dimensions['H'].width = 45

term_figma_dict = {
    'ネームコール': '1章 L06（CH1-L06-01〜04 【19:30】アレルギー情報共有・ネームコール接遇）',
    '語先後礼': '1章 L09（CH1-L09-02, 04 【10:00】チェックアウトピークの見送り余韻）',
    '引き算の配慮': '1章 L01（CH1-L01-04 【12:45】出勤前の身だしなみチェック 2段階解説）',
    '無香': '1章 L01（CH1-L01-03, 04 【12:45】出勤前の身だしなみチェック）',
    '見送り余韻': '1章 L09（CH1-L09-04 【10:00】チェックアウトピークの見送り余韻）',
    'セーフティフレーズ': '1章 L04（CH1-L04-02, 04 【17:00】アメニティのイレギュラー対応）',
    '報連相': '1章 L02（CH1-L02-04 【13:00】引き継ぎの仕方 申し送りミーティング）',
    '目配り・気配り・手配り': '1章 ガイダンス（CH1-01）、L03（CH1-L03-04 チェックインピーク）',
    'Omotenashi Mindset': '1章 全体（CH1-01〜CH1-END）、アプリ基幹コンセプト',
    'PMS': '3章 L01（CH3-L1-03 予約検索・確認、フロントシステム操作）',
    'OJT': '2章 ガイダンス（CH2-01）、3章 ガイダンス（CH3-01）'
}

for r in range(2, ws_term.max_row+1):
    term = str(ws_term.cell(r, 1).value or '').strip()
    if term in term_figma_dict:
        ws_term.cell(r, 8, term_figma_dict[term]).font = cell_font
        ws_term.cell(r, 8).alignment = cell_align

# 4. Insert Figma screen name column in １章 and ３章
print('Updating １章 and ３章 with Figma Screen Name column...')

# In １章: Col 1 is 画面ID. Insert Figma Screen Name at Col 2
ws1 = wb['１章']
# Check if Col 2 is already 対応Figma画面名
if ws1.cell(1, 2).value != '対応Figma画面名':
    ws1.insert_cols(2)
    ws1.cell(1, 2, '対応Figma画面名').font = header_font
    ws1.cell(1, 2).fill = PatternFill(start_color='1B4F72', end_color='1B4F72', fill_type='solid')
    ws1.cell(1, 2).alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    ws1.column_dimensions['B'].width = 38

for r in range(2, ws1.max_row+1):
    sid = str(ws1.cell(r, 1).value or '').strip()
    if sid in screen_map:
        ws1.cell(r, 2, screen_map[sid]).font = cell_font
        ws1.cell(r, 2).alignment = cell_align
        ws1.cell(r, 2).border = thin_border
    elif not sid and r > 2:
        # copy previous row screen name if same screen
        prev_sid = str(ws1.cell(r-1, 1).value or '').strip()
        if prev_sid in screen_map:
            ws1.cell(r, 2, screen_map[prev_sid]).font = cell_font
            ws1.cell(r, 2).alignment = cell_align
            ws1.cell(r, 2).border = thin_border

# In ３章: Col 1 is 画面ID. Insert Figma Screen Name at Col 2
ws3 = wb['３章']
if ws3.cell(1, 2).value != '対応Figma画面名':
    ws3.insert_cols(2)
    ws3.cell(1, 2, '対応Figma画面名').font = header_font
    ws3.cell(1, 2).fill = PatternFill(start_color='1B4F72', end_color='1B4F72', fill_type='solid')
    ws3.cell(1, 2).alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    ws3.column_dimensions['B'].width = 38

for r in range(2, ws3.max_row+1):
    sid = str(ws3.cell(r, 1).value or '').strip()
    if sid in screen_map:
        ws3.cell(r, 2, screen_map[sid]).font = cell_font
        ws3.cell(r, 2).alignment = cell_align
        ws3.cell(r, 2).border = thin_border
    elif not sid and r > 2:
        prev_sid = str(ws3.cell(r-1, 1).value or '').strip()
        if prev_sid in screen_map:
            ws3.cell(r, 2, screen_map[prev_sid]).font = cell_font
            ws3.cell(r, 2).alignment = cell_align
            ws3.cell(r, 2).border = thin_border

wb.save('翻訳.xlsx')
print('SUCCESS: Updated 翻訳.xlsx with Figma screen mappings across all sheets!')

