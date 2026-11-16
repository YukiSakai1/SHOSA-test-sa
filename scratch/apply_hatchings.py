import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = openpyxl.load_workbook('翻訳.xlsx')

# Color definitions
# Red: Most Critical (和製英語リスク・重大誤解・スペルミス)
red_fill = PatternFill(start_color='FFCDD2', end_color='FFCDD2', fill_type='solid') # Soft Light Red
red_font = Font(name='游ゴシック', size=9, bold=True, color='900C3F')

# Yellow: Important (表記ルール統一・難解語彙平易化・文字数超過・デザイン相談)
yellow_fill = PatternFill(start_color='FFF9C4', end_color='FFF9C4', fill_type='solid') # Soft Light Yellow
yellow_font = Font(name='游ゴシック', size=9, bold=False, color='333333')

# Legend fills
legend_red_fill = PatternFill(start_color='FFCDD2', end_color='FFCDD2', fill_type='solid')
legend_red_font = Font(name='游ゴシック', size=9, bold=True, color='900C3F')
legend_yellow_fill = PatternFill(start_color='FFF9C4', end_color='FFF9C4', fill_type='solid')
legend_yellow_font = Font(name='游ゴシック', size=9, bold=True, color='856404')

thin_border = Border(
    left=Side(style='thin', color='CCCCCC'),
    right=Side(style='thin', color='CCCCCC'),
    top=Side(style='thin', color='CCCCCC'),
    bottom=Side(style='thin', color='CCCCCC')
)

print('Updating Sheet 1: 【提案】表記ルール・用語定義案 ...')
ws_prop = wb['【提案】表記ルール・用語定義案']

# Insert Legend at Row 4
ws_prop.cell(4, 1, '【カラー凡例】').font = Font(name='游ゴシック', size=9, bold=True)
ws_prop.cell(4, 2, '🟥 赤ハッチング：最重要確認（和製英語リスク・誤解防止・スペルミス修正）').fill = legend_red_fill
ws_prop.cell(4, 2).font = legend_red_font
ws_prop.cell(4, 4, '🟨 黄ハッチング：重要確認（表記ルール統一・独自用語案・文字数/UI相談）').fill = legend_yellow_fill
ws_prop.cell(4, 4).font = legend_yellow_font

# Apply Red to Gosen-gorei and Name-Call in proposal
# Let's inspect proposal sheet rows
for r in range(5, ws_prop.max_row+1):
    val_a = str(ws_prop.cell(r, 1).value or '')
    val_b = str(ws_prop.cell(r, 2).value or '')
    val_c = str(ws_prop.cell(r, 3).value or '')
    
    # Check Section 2 (表記ルール)
    if '『』' in val_a or '〇〇様' in val_a:
        ws_prop.cell(r, 1).fill = yellow_fill
        ws_prop.cell(r, 3).fill = yellow_fill
    elif '選択肢' in val_a or '時刻' in val_a:
        ws_prop.cell(r, 1).fill = yellow_fill
        ws_prop.cell(r, 3).fill = yellow_fill
    
    # Check Section 3 (用語定義抜粋)
    if 'ネームコール' in val_a:
        for c in range(1, 6):
            ws_prop.cell(r, c).fill = red_fill
            ws_prop.cell(r, c).font = red_font
    elif '語先後礼' in val_a:
        for c in range(1, 6):
            ws_prop.cell(r, c).fill = red_fill
            ws_prop.cell(r, c).font = red_font
    elif any(term in val_a for term in ['引き算の配慮', '無香', '見送り余韻', 'セーフティフレーズ', '報連相', '目配り・気配り・手配り']):
        for c in range(1, 6):
            ws_prop.cell(r, c).fill = yellow_fill

print('Updating Sheet: １章 ...')
ws1 = wb['１章']

# Critical Red rows in １章: Name-call & Gosen-gorei
red_rows_1 = [124, 129, 130, 134, 138, 139, 140, 189, 194, 200]

# Important Yellow rows in １章: Rule unification, B1 simplification, Safety phrases, Afterglow
yellow_rows_1 = [10, 13, 15, 18, 19, 20, 25, 30, 33, 35, 38, 39, 40, 55, 59, 60, 70, 75, 78, 79, 80, 90, 95, 98, 99, 100, 150, 155, 158, 159, 160, 170, 175, 178, 179, 180, 184, 190, 198, 199, 210, 215, 218, 219, 220, 225]

# Column indices in １章:
# Col 4: 内容（入力欄）
# Col 8: 内容（EN)
# Col 9: 内容（EN修正案 / Suggestion）
# Col 13: 備考

for r in red_rows_1:
    if r <= ws1.max_row:
        # highlight suggestion and remarks in red
        ws1.cell(r, 9).fill = red_fill
        ws1.cell(r, 9).font = red_font
        ws1.cell(r, 13).fill = red_fill
        ws1.cell(r, 13).font = red_font
        # also lightly mark Japanese cell
        ws1.cell(r, 4).fill = red_fill

for r in yellow_rows_1:
    if r <= ws1.max_row and r not in red_rows_1:
        # highlight suggestion and remarks in yellow
        ws1.cell(r, 9).fill = yellow_fill
        ws1.cell(r, 9).font = yellow_font
        if ws1.cell(r, 13).value:
            ws1.cell(r, 13).fill = yellow_fill
            ws1.cell(r, 13).font = yellow_font

print('Updating Sheet: ３章 ...')
ws3 = wb['３章']
# Yellow rows in ３章: Exceeded character counts (Design coordination)
# Col 4: 内容（入力欄）, Col 8: 内容（EN), Col 9: 内容（EN修正案 / Suggestion）, Col 12: 備考
yellow_rows_3 = {
    22: '【文字数超過】業務内容の網羅性維持のため上限+11字。UI枠に応じ諏訪様と調整相談',
    26: '【文字数超過】予約業務項目の網羅性維持のため上限+22字。UI枠に応じ諏訪様と調整相談',
    78: '【文字数微増】簡潔な表現（Asking for the Guest\'s Name）のため+1字',
    92: '【文字数微増】明確化（Searching the Reservation）のため+3字',
    106: '【文字数超過】正確な意味伝達（Confirming reservation details）のため+8字。諏訪様と相談',
    109: '【文字数超過】誤答パターンの正確な説明のため+8字。諏訪様とレイアウト調整相談'
}

for r, memo_text in yellow_rows_3.items():
    if r <= ws3.max_row:
        cur_memo = ws3.cell(r, 12).value or ''
        if memo_text not in cur_memo:
            ws3.cell(r, 12, f'{cur_memo} | {memo_text}' if cur_memo else memo_text)
        ws3.cell(r, 4).fill = yellow_fill
        ws3.cell(r, 9).fill = yellow_fill
        ws3.cell(r, 9).font = yellow_font
        ws3.cell(r, 12).fill = yellow_fill
        ws3.cell(r, 12).font = yellow_font

print('Updating Sheet: 用語定義 ...')
ws_term = wb['用語定義']
# In 用語定義:
# Col 1: 用語（JP）, Col 6: 英語表記案（提案）, Col 7: 選定理由・非ネイティブ向け配慮
for r in range(2, ws_term.max_row+1):
    term = str(ws_term.cell(r, 1).value or '')
    if 'ネームコール' in term or '語先後礼' in term:
        # Red
        for c in range(1, 9):
            ws_term.cell(r, c).fill = red_fill
            if c in [1, 6, 7]:
                ws_term.cell(r, c).font = red_font
    elif any(t in term for t in ['引き算の配慮', '無香', '見送り余韻', 'セーフティフレーズ', '報連相', '目配り・気配り・手配り', 'PMS', 'OJT']):
        # Yellow
        for c in range(1, 9):
            ws_term.cell(r, c).fill = yellow_fill
            if c in [1, 6, 7]:
                ws_term.cell(r, c).font = yellow_font

print('Updating Sheet: 0章 ...')
ws0 = wb['0章']
# Yellow rows in 0章:
# Col 5: 内容（入力欄）, Col 10: 内容（EN修正案 / Suggestion）
yellow_rows_0 = [12, 101, 123]
for r in yellow_rows_0:
    if r <= ws0.max_row:
        ws0.cell(r, 10).fill = yellow_fill
        ws0.cell(r, 10).font = yellow_font

wb.save('翻訳.xlsx')
print('SUCCESS: All hatchings (Red for Critical, Yellow for Important) applied and saved to 翻訳.xlsx!')

