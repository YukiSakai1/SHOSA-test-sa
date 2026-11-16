import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def build_update():
    wb_target = openpyxl.load_workbook('翻訳.xlsx')
    wb_source = openpyxl.load_workbook('google_sheets_latest.xlsx', data_only=True)

    # -------------------------------------------------------------
    # 1. Update ２章 in wb_target
    # -------------------------------------------------------------
    ws2 = wb_target['２章']
    
    # Dict of translations for ２章先行分
    # Format: row_idx: (en_text, note)
    ch2_trans = {
        2: ("Chapter 2: Omotenashi Style Assessment", None),
        3: ("Experience hotel jobs and discover your work style", None),
        4: ("There is no single correct answer here.", None),
        5: ("Step into a hotel workplace and choose what you would do when facing guests and daily situations. You will discover your natural strengths and the work style that fits you best.", None),
        6: ("▼ What you will discover:", None),
        10: ("Which job do you want to learn first? Choose a job or scene that interests you, and let's learn hotelier skills together.", None),
        12: ("Front Desk\nThe hotel's \"Welcome & Guide\"", None),
        13: ("Key duties:\n・Check-in and check-out\n・Assisting guests during their stay\n・Guiding guests around the hotel and local area\n・Handling payments and room keys\n・Night front desk duties", None),
        16: ("Bell & Door Services\nThe hotel's \"First Welcome & Greeter\"", None),
        17: ("Key duties:\n・Supporting guests at arrival and departure\n・Storing and delivering luggage\n・Guiding guests for cars and shuttles\n・Keeping the lobby clean and comfortable\n・Giving directions in the local area", None),
        20: ("Housekeeping\nThe hotel's \"Comfortable Space Creator\"", None),
        21: ("Key duties:\n・Cleaning guest rooms and making beds\n・Tidying stay-over rooms\n・Managing linens and amenities\n・Cleaning public areas\n・Managing and reporting lost property", None),
        24: ("Restaurant Service\nThe hotel's \"Dining Experience Creator\"", None),
        25: ("Key duties:\n・Serving guests at restaurants, banquets, bars, or room service\n・Guiding guests, taking orders, and serving dishes\n・Setting and clearing tables\n・Checking guest allergies and dietary requests\n・Explaining menus and dishes", None),
        28: ("Reservations\nThe hotel's \"Booking Specialist\"", None),
        29: ("Key duties:\n・Taking, changing, and cancelling room bookings\n・Helping guests by phone and email\n・Assisting with room availability and rates\n・Arranging special requests (anniversaries, room types)\n・Sharing booking details with other departments", None),
        32: ("Check-in Begins", None),
        33: ("14:00. Check-in begins. Several groups of guests arrive, and the front desk area starts to get busy.", None),
        36: ("Back to ROLE selection", None),
        37: ("14:00. A guest arrives at the front desk holding a smartphone to check their booking details.", None),
        39: ("Check the guest's name, dates, and number of guests against the system before starting.", None),
        40: ("Search by the booking number on their email and proceed without asking their name again.", None),
        41: ("Read the booking details aloud and ask if there are any changes or requests.", None),
        42: ("Explain the check-in steps and estimated time before getting started.", None),
        43: ("You are proceeding with check-in. Checking the reservation, you see that breakfast is included in the plan.", None),
        45: ("Verify the number and dates of breakfast tickets against the booking before handing them over.", None),
        46: ("Give only the time and venue for breakfast, leaving other details to the hotel guide.", None),
        47: ("Share the breakfast time and venue, then ask what time they plan to visit.", None),
        48: ("Share the busy hours and last entry time so they can enjoy breakfast comfortably.", None),
        49: ("Check-in is complete. The guest receives their room key and is ready to head to their room.", None),
        51: ("Match the room number on the key with the registered details to hand over the correct key.", None),
        52: ("Provide all key info like check-out time at once and move on to the next guest.", None),
        53: ("Explain how to get to the room and elevator, and ask if they have any questions.", None),
        54: ("If the guest has lots of luggage, arrange for a bell staff member to carry it to their room.", None),
        56: ("Check-in Begins", None),
        286: ("How would you respond? Choose the action closest to what you would do.", None),
        287: ("[Scenario Title] complete! Let's move on to the next Scenario.", None)
    }

    # Column mappings in ２章:
    # Col 1: 画面ID, Col 3: フィールド名, Col 5: 内容（入力欄）, Col 6: 文字数上限, Col 7: 現在文字数, Col 8: 判定
    # Col 9: 内容（EN), Col 10: 現在文字数（EN） [or Col 10 is max_len_en, let's check headers]
    # Header check:
    # ['画面ID', 'テンプレ種別', 'フィールド名', '対応Figmaレイヤー名', '内容（入力欄）', '文字数上限', '現在文字数', '判定', '内容（EN)', '現在文字数（EN）', '備考', 'モーション/アニメーション（固有）']
    # Let's inspect column 9 and 10
    for r_idx, (en_val, note_val) in ch2_trans.items():
        ws2.cell(row=r_idx, column=9, value=en_val)
        ws2.cell(row=r_idx, column=10, value=len(en_val) if en_val else 0)
        if note_val:
            ws2.cell(row=r_idx, column=11, value=note_val)

    print("Updated ２章先行分.")

    # -------------------------------------------------------------
    # 2. Add ３章 into wb_target from google_sheets_latest.xlsx
    # -------------------------------------------------------------
    ws3_src = wb_source['3章スクリプト']
    if '３章' in wb_target.sheetnames:
        del wb_target['３章']
    ws3_tgt = wb_target.create_sheet(title='３章')

    # Copy all rows & columns from ws3_src
    for r in ws3_src.iter_rows(values_only=False):
        for c in r:
            ws3_tgt.cell(row=c.row, column=c.column, value=c.value)

    # Dictionary of translations for ３章先行分
    # Column mapping in ３章: Col 1: 画面ID, Col 2: テンプレ種別, Col 3: フィールド名, Col 4: 内容（入力欄）(idx 4),
    # Col 5: 文字数上限, Col 6: 現在文字数, Col 7: 判定, Col 8: 内容（EN) (col 8), Col 9: 文字数上限（EN）, Col 10: 現在文字数（EN）, Col 11: 備考
    ch3_trans = {
        2: "Chapter 3: Hotel Skills",
        3: "Learn job-specific skills and hospitality techniques",
        4: "Even if you are new to hotel work, step right into the workplace. Face the guests and situations in front of you, and experience hotel staff work while thinking, \"What would I do?\"\n\nIn this chapter, rather than just memorizing answers, you will discover your strengths and interests by observing, thinking, and choosing your actions.\n\nWhat kind of strengths will you bring to the hotel floor?",
        7: "Which job do you want to learn first? Choose a job or scene that interests you, and let's learn hotelier skills.",
        9: "Front Desk\nThe hotel's \"Welcome & Guide\"",
        10: "Key duties:\n・Check-in and check-out\n・Assisting guests during their stay\n・Guiding guests around the hotel and local area\n・Handling payments and room keys\n・Night front desk duties",
        13: "Bell & Door Services\nThe hotel's \"First Welcome & Greeter\"",
        14: "Key duties:\n・Supporting guests at arrival and departure\n・Storing and delivering luggage\n・Guiding guests for cars and shuttles\n・Keeping the lobby clean and comfortable\n・Giving directions in the local area",
        17: "Housekeeping\nThe hotel's \"Comfortable Space Creator\"",
        18: "Key duties:\n・Cleaning guest rooms and making beds\n・Tidying stay-over rooms\n・Managing linens and amenities\n・Cleaning public areas\n・Managing and reporting lost property",
        21: "Restaurant Service\nThe hotel's \"Dining Experience Creator\"",
        22: "Key duties:\n・Serving guests at restaurants, banquets, bars, or room service\n・Guiding guests, taking orders, and serving dishes\n・Setting and clearing tables\n・Checking guest allergies and dietary requests\n・Explaining menus and dishes",
        25: "Reservations\nThe hotel's \"Booking Specialist\"",
        26: "Key duties:\n・Taking, changing, and cancelling room bookings\n・Helping guests by phone and email\n・Assisting with room availability and rates\n・Arranging special requests (anniversaries, room types)\n・Sharing booking details with other departments",
        31: "Scene 1: Check-in",
        32: "Learn the flow of welcoming guests, verifying details, handling check-in, and guiding them to their room.",
        34: "Scene 2: Guiding Hotel Facilities",
        35: "Learn how to understand hotel facilities and services and guide guests clearly.",
        37: "Scene 3: Helping In-House Guests",
        38: "Learn how to handle various requests and questions from guests during their stay.",
        40: "Scene 4: Check-out",
        41: "Learn how to handle payments and key returns, and warmly see guests off at departure.",
        43: "Scene 5: Night Operations",
        44: "Learn how to handle night inquiries and issues safely and reliably.",
        48: "[n]/[N] Lessons Complete",
        49: "What you will learn / Study time",
        51: "Approx. [n] min",
        52: "Lesson 1: Reservation Check",
        53: "Verify guest booking details and identify the correct reservation.",
        55: "Lesson 2: Registration & ID Check",
        56: "Check guest ID and accurately register required guest details.",
        58: "Lesson 3: Payment & Deposit",
        59: "Verify payment methods and amounts, and process transactions accurately.",
        61: "Lesson 4: Room Key Issuing",
        62: "Verify room details and issue the correct room key.",
        64: "Lesson 5: Room & Hotel Facilities Guide",
        65: "Guide guests clearly with essential room and hotel facility details.",
        67: "Lesson 6: Seeing Guests Off",
        68: "Escort guests to their room and provide courteous service until the end.",
        72: "Reservation Check",
        73: "Asking the guest's name",
        74: "Searching for the booking",
        75: "Confirming reservation details",
        78: "Asking the guest's name",
        79: "To check the reservation, first verify the guest's name accurately.",
        80: "✓ Ask for their name politely\n✓ Check again if it is hard to hear\n✓ Confirm the spelling as well",
        81: "Proceeding with check-in without clearly hearing the name.",
        83: "When asking for a guest's name at check-in, which is the most appropriate action?",
        84: "Ask bluntly, \"What is your name?\"",
        85: "Ask politely, \"May I have your name, please?\"",
        86: "Check the name on screen without asking the guest directly",
        87: "Keep searching bookings even if you didn't catch their name",
        89: "Correct: B!",
        90: "The guest's name is essential for finding their booking. If it is hard to hear, politely ask again to verify it accurately.",
        92: "Searching for the booking",
        93: "Use key details like booking number and name to search for the correct reservation.",
        94: "✓ Politely ask for required information\n✓ Verify details if unclear\n✓ Get the booking number accurately",
        95: "Searching with incomplete information\nSelecting the wrong reservation",
        97: "You searched bookings and found two under the same name. What is the appropriate action?",
        98: "Pick the first reservation that appears",
        99: "Check extra details like dates to identify the correct booking",
        100: "Ask the guest to choose which one is theirs",
        101: "Proceed with check-in without checking further",
        103: "Correct: B!",
        104: "When multiple bookings share the same name, do not judge by name alone. Check dates and booking numbers to identify the right one.",
        106: "Confirming reservation details",
        107: "Verify stay dates, nights, guest count, and room type needed for check-in.",
        108: "✓ Get necessary details accurately\n✓ Match the details against the booking",
        109: "Checking only part of the reservation details\nRelying only on guest statements without verifying",
        111: "When confirming reservation details at check-in, which action is most appropriate?",
        112: "Confirm only what the guest states verbally",
        113: "Match stay dates, nights, guests, and room type with the reservation system",
        114: "Confirm only the room type and skip the rest",
        115: "Proceed just by seeing that a reservation exists",
        117: "Correct: B!",
        118: "At check-in, it is vital to make sure the guest's understanding matches the booking. Match key items and proceed with accurate details.",
        120: "LESSON 1/6\nReservation Check",
        367: "Key Points",
        368: "Common Mistakes",
        371: "Correct: [X]!",
        373: "Scene [n]: [Scene Name] - Lesson [n] Complete!",
        374: "[n]/[N] Scenes Complete",
        375: "Scene 1: Check-in / Scene 2: Facility Guide / Scene 3: In-House Guest Service / Scene 4: Check-out / Scene 5: Night Operations",
        378: "Scene [n]: [Scene Name] Complete!",
        379: "[n]/[N] Scenes Complete",
        380: "Scene 1: Check-in / Scene 2: Facility Guide / Scene 3: In-House Guest Service / Scene 4: Check-out / Scene 5: Night Operations",
        383: "Chapter 3: [Job Title] Complete!",
        384: "You learned the basic skills for [Job Title]! Practice repeatedly to master them with confidence."
    }

    for r_idx, en_val in ch3_trans.items():
        ws3_tgt.cell(row=r_idx, column=8, value=en_val)
        ws3_tgt.cell(row=r_idx, column=10, value=len(en_val))

    print("Added ３章 with translations.")

    # -------------------------------------------------------------
    # 3. Add 用語定義 into wb_target
    # -------------------------------------------------------------
    ws_term_src = wb_source['用語定義_UI,ホテル用語']
    if '用語定義' in wb_target.sheetnames:
        del wb_target['用語定義']
    ws_term_tgt = wb_target.create_sheet(title='用語定義')

    # Glossaries with English translation proposals and rationale
    term_en_map = {
        'インカム': ('Walkie-Talkie / Headset', '現場で自然に使われる通話機器名称。内線トランシーバーの意'),
        'PMS': ('Reservation System (PMS)', '初学者向けに「Reservation System」を主とし、業界略称PMSを併記'),
        'バゲージカート/バゲージラック': ('Luggage Cart / Luggage Rack', '標準的なホテル用語'),
        'インスペクション指示書/清掃ステータスボード': ('Inspection Sheet / Room Status Board', 'ハウスキーピング標準用語'),
        '姿見(全身鏡)': ('Full-Length Mirror', 'バックヤードでの身だしなみ点検用全身鏡'),
        'チェックイン/チェックアウト(CI/CO)': ('Check-in / Check-out', '略語は避け、平易なフルスペルで表記'),
        'ネームコール': ('Addressing Guests by Name', '直訳のName callは英語で点呼・罵声を意味するため、「Addressing Guests by Name」(お名前呼び)と意訳'),
        '語先後礼': ('Gosen-Gorei (Speaking before bowing)', '日本特有の所作。「言葉が先、お辞儀は後」の補足英語を添えて表記'),
        '見送り余韻': ('Mindful Send-off (Watching over until out of sight)', 'お客様の姿が見えなくなるまで見守る所作。自然で温かみのある英語表現'),
        '引き算の配慮': ('Less-is-More Consideration', '自身の好みを抑え空間の快適さを優先する配慮。英語圏でも通じる「Less is more」を活用'),
        'セーフティフレーズ': ('Safety Phrases', 'とっさに時間稼ぎをしてトラブルを防ぐ定型応答クッション言葉'),
        '無香': ('Fragrance-Free', '香水や柔軟剤の匂いを残さない日本のホテル接客マナーの標準英語'),
        'SHOSA Focus': ('SHOSA Focus', 'UI固有名詞のため変更なし'),
        'Omotenashi Mindset': ('Omotenashi Mindset', '章名・コンセプトのため変更なし'),
        'CHECK（ボタン）': ('CHECK', 'UIボタン標準'),
        'NEXT(ボタン)': ('NEXT', 'UIボタン標準'),
        'START(ボタン)': ('START', 'UIボタン標準'),
        'Chapter': ('Chapter', '学習大分類'),
        'Job': ('Job', '職種'),
        'Scene': ('Scene', 'シチュエーション'),
        'Mission': ('Mission', '実践課題'),
        'Task': ('Task', '内部構造（非表示）'),
        'Action': ('Action', 'SOP最小単位（非表示）'),
        'Front Desk / Bell & Door Services / Housekeeping / Restaurant Service / Reservations': (
            'Front Desk / Bell & Door Services / Housekeeping / Restaurant Service / Reservations', '職種名（英語確定）'
        ),
        'OTA': ('OTA (Online Travel Agent)', '初出時にフルスペルを補足'),
        'ターンダウン': ('Turndown Service', '就寝前ベッド準備サービス'),
        'アップセル': ('Upselling', '上位プラン・サービスの提案販売'),
        'バレーパーキング': ('Valet Parking', '駐車代行サービス'),
        '行動傾向タイプ(Accuracy型/Efficiency型/Communication型/Hospitality型)': (
            'Work Style Types (Accuracy / Efficiency / Communication / Hospitality)', '2章で診断される4つの行動特性'
        ),
        'シナリオ(Scenario) / レッスン(Lesson)': ('Scenario / Lesson', '章別の学習単位'),
        'Situationタグ': ('Situation Tag', '状況説明ラベル')
    }

    # Headers for 用語定義
    term_headers = ['用語（JP）', '分類', 'ふりがな', '定義・説明', '表記ルール・注意点', '英語表記案（提案）', '選定理由・非ネイティブ向け配慮', '初出/使用例']
    ws_term_tgt.append(term_headers)

    for r_idx in range(2, 33):
        row = [ws_term_src.cell(row=r_idx, column=c).value for c in range(1, 7)]
        term = row[0]
        cat = row[1]
        furi = row[2]
        desc = row[3]
        rule = row[4]
        ex = row[5]
        
        en_prop, en_reason = term_en_map.get(term, ('-', '-'))
        ws_term_tgt.append([term, cat, furi, desc, rule, en_prop, en_reason, ex])

    # -------------------------------------------------------------
    # 4. Create 【提案】表記ルール・用語定義案 (Sheet 0)
    # -------------------------------------------------------------
    sheet_title = '【提案】表記ルール・用語定義案'
    if sheet_title in wb_target.sheetnames:
        del wb_target[sheet_title]
    ws_prop = wb_target.create_sheet(title=sheet_title, index=0)

    # Styles
    f_title = Font(name='Meiryo UI', size=16, bold=True, color='1A365D')
    f_sub = Font(name='Meiryo UI', size=10, color='4A5568')
    f_sec_header = Font(name='Meiryo UI', size=12, bold=True, color='FFFFFF')
    f_tbl_header = Font(name='Meiryo UI', size=10, bold=True, color='2D3748')
    f_cell = Font(name='Meiryo UI', size=10, color='1A202C')
    f_cell_bold = Font(name='Meiryo UI', size=10, bold=True, color='1A202C')
    f_highlight = Font(name='Meiryo UI', size=10, bold=True, color='715BE1')
    
    fill_sec = PatternFill(start_color='2B6CB0', end_color='2B6CB0', fill_type='solid') # Navy
    fill_th = PatternFill(start_color='EDF2F7', end_color='EDF2F7', fill_type='solid')  # Light Gray
    fill_alt = PatternFill(start_color='F7FAFC', end_color='F7FAFC', fill_type='solid') # Off White
    fill_badge_done = PatternFill(start_color='C6F6D5', end_color='C6F6D5', fill_type='solid') # Light Green
    fill_badge_ready = PatternFill(start_color='BEE3F8', end_color='BEE3F8', fill_type='solid') # Light Blue

    thin_border_side = Side(style='thin', color='CBD5E0')
    border_all = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)

    # Write document header
    ws_prop['A1'] = "【SHOSAアプリ 英語翻訳】先行分（11/16確認出し）提案書・表記ルール・用語定義一覧"
    ws_prop['A1'].font = f_title
    ws_prop['A2'] = "提出日: 2026年11月16日（月） | 担当者: sakai | 提出先: プロジェクト推進チーム・デザインチーム（諏訪様）"
    ws_prop['A2'].font = f_sub
    ws_prop['A3'] = "本シートは、11/16（月）マイルストーンである「先行分翻訳確認」および「表記ルール・独自用語英語表記の確認依頼」の提出資料です。"
    ws_prop['A3'].font = f_sub

    curr_row = 5

    def add_section_header(title):
        nonlocal curr_row
        ws_prop.cell(row=curr_row, column=1, value=title).font = f_sec_header
        ws_prop.cell(row=curr_row, column=1).fill = fill_sec
        ws_prop.merge_cells(start_row=curr_row, start_column=1, end_row=curr_row, end_column=8)
        ws_prop.row_dimensions[curr_row].height = 28
        curr_row += 1

    # Section 1: 先行分進捗サマリー
    add_section_header("1. 先行分（11/16提出）の進捗ステータス サマリー")
    p1_headers = ['対象章', '先行対象範囲', '行数', '翻訳ステータス', '文字数上限判定', '備考・特記事項']
    for col_idx, h in enumerate(p1_headers, start=1):
        cell = ws_prop.cell(row=curr_row, column=col_idx, value=h)
        cell.font = f_tbl_header
        cell.fill = fill_th
        cell.border = border_all
        cell.alignment = Alignment(horizontal='center', vertical='center')
    curr_row += 1

    p1_data = [
        ['0章（オンボーディング）', '全画面（CH0-01〜CH0-22）', '121項目', '翻訳完了（対応済）', 'OK（ほぼ上限内）', 'アプリ内実装・動作検証済み'],
        ['1章（Mindset）', 'L01およびレッスン共通見出し（2〜21行）', '15項目', '翻訳完了（対応済）', 'OK（長文一部調整済）', 'L01実機・Focusモーダル動作検証済み'],
        ['2章（Style診断）', '導入（CH2-01, 02）＋S1＋共通（2〜56行, 286, 287行）', '33項目', '翻訳完了（反映済）', 'OK（2.2倍目安内）', '「２章」シートの「内容（EN)」列に反映完了'],
        ['3章（Hotel Skills）', '導入（CH3-01〜04）＋L1＋共通（2〜120行, 367〜385行）', '91項目', '翻訳完了（反映済）', 'OK（2.2倍目安内）', '「３章」シートを新設し「内容（EN)」列に反映完了'],
        ['独自用語・専門用語', 'SHOSA独自所作・業界用語・UI用語（全32語）', '32語', '英語表記案 策定完了', 'ー', '本シートSection 3および「用語定義」シートに追記'],
        ['表記ルール', '『』、〇〇様、選択肢(A)(B)、時刻、プレースホルダー等', '8項目', 'ルール統一案 策定完了', 'ー', '本シートSection 2に記載・ご確認依頼']
    ]
    for r in p1_data:
        for c_idx, val in enumerate(r, start=1):
            cell = ws_prop.cell(row=curr_row, column=c_idx, value=val)
            cell.font = f_cell
            cell.border = border_all
            if c_idx == 4:
                cell.fill = fill_badge_done
                cell.font = f_cell_bold
                cell.alignment = Alignment(horizontal='center', vertical='center')
            elif c_idx in [1, 3]:
                cell.alignment = Alignment(horizontal='center', vertical='center')
            else:
                cell.alignment = Alignment(vertical='center')
        curr_row += 1

    curr_row += 1

    # Section 2: 表記ルール統一案
    add_section_header("2. 表記ルールの統一案（ご確認・合意依頼）")
    p2_headers = ['項目', '日本語の表記例', '英語表記の統一ルール（提案）', '英語表記例', '選定理由・狙い（読み手配慮）']
    for col_idx, h in enumerate(p2_headers, start=1):
        cell = ws_prop.cell(row=curr_row, column=col_idx, value=h)
        cell.font = f_tbl_header
        cell.fill = fill_th
        cell.border = border_all
        cell.alignment = Alignment(horizontal='center', vertical='center')
    curr_row += 1

    p2_data = [
        ['『』（二重かぎ括弧・用語）', '『匂い』について、『相手を歓迎するマナー』', 'ダブルクォーテーション（"..."）で囲む', '"scent", "a way of welcoming others"', '英語圏・アジア圏の学習者が最も直感的に「重要語句・引用」と認識できる標準記号。'],
        ['〇〇様（ゲスト呼称）', '「〇〇様、いってらっしゃいませ」', 'Mr./Ms. [Guest Name] または文脈に応じ [Guest Name]-san / the guest', '"Have a wonderful day, Mr. Tanaka."', 'ゲスト直接呼びかけは「Mr./Ms. [Name]」、スタッフ間会話では親しみと現場感を残す「[Name]-san」、説明文では「the guest」を使い分け。'],
        ['選択肢の参照', '「良い香り（A）も良かれと思いがちですが」', '半角大文字＋丸括弧 (A), (B), (C), (D)', '"A nice scent (A) may seem considerate"', '画面上の選択肢ボタン表記（A/B/C/D）と完全一致させ、学習者が設問と解説を瞬時に紐付けられるように統一。'],
        ['時刻の表記', '12:45、13:00、14:00', '24時間表記「HH:MM」を基本（12:45, 13:00）', "It's 12:45. Before your afternoon shift begins...", 'ホテル業界の勤務シフト・引き継ぎ・日報で24時間制が国際標準。文字数も短縮でき画面レイアウトを圧迫しません。'],
        ['プレースホルダー', '[n]、[シナリオタイトル]、[職種名]、[シーン名]', '角括弧を残し内部のみ英訳：[n], [Scenario Title], [Job Title], [Scene Name]', 'Scene [n]: [Scene Name] Complete!', 'システム変数やCMS差し込み箇所であることを明確化し、翻訳後もプログラムが正しく置換できるように記号を維持。'],
        ['スタッフの心の声', '（勤務開始まであと15分。持ち物よし）', '半角括弧 ( ) で囲む', '(15 minutes until my shift. Belongings checked.)', '日本語の（ ）表現を踏襲し、発話セリフと区別。非ネイティブ読者でも「頭の中の独り言」と一目で分かります。'],
        ['SHOSAさんの口調分け', '・テンプレ2（講評）：丁寧\n・テンプレ4（誘導）：親しみ', '・講評：丁寧で落ち着いたトーン（Polite & Courteous, 短縮形なし）\n・誘導：親しみと促し（Warm & Friendly, 短縮形OK, 問いかけ）', '・講評: "This is your last check before the shift begins."\n・誘導: "Do you know why pros go fragrance-free?"', 'メンターとしての知性と親しみやすさを両立。CEFR B1語彙を維持しつつトーンを差別化。'],
        ['接客フレーズの丁寧度', '「確認いたします」「恐れ入ります」', 'Please / Could you / May I を用いたやさしい丁寧表現', '"May I have your name, please?", "Let me check that for you."', '直訳の堅苦しい表現（I shall proceed to verify）を避け、実際のホテル現場で外国人スタッフが使いやすい実践フレーズを採用。']
    ]
    for r in p2_data:
        for c_idx, val in enumerate(r, start=1):
            cell = ws_prop.cell(row=curr_row, column=c_idx, value=val)
            cell.font = f_cell
            cell.border = border_all
            if c_idx == 1:
                cell.font = f_cell_bold
                cell.alignment = Alignment(horizontal='center', vertical='center')
            elif c_idx == 3:
                cell.font = f_highlight
                cell.alignment = Alignment(vertical='center', wrap_text=True)
            else:
                cell.alignment = Alignment(vertical='center', wrap_text=True)
        ws_prop.row_dimensions[curr_row].height = 36
        curr_row += 1

    curr_row += 1

    # Section 3: 独自用語・ホテル専門用語の英語表記一覧案
    add_section_header("3. 独自用語・ホテル専門用語の英語表記一覧案（抜粋）")
    p3_headers = ['用語（日本語）', '分類', '英語表記案（提案）', '日本語の定義・所作', '選定理由・非ネイティブ学習者への配慮']
    for col_idx, h in enumerate(p3_headers, start=1):
        cell = ws_prop.cell(row=curr_row, column=col_idx, value=h)
        cell.font = f_tbl_header
        cell.fill = fill_th
        cell.border = border_all
        cell.alignment = Alignment(horizontal='center', vertical='center')
    curr_row += 1

    p3_data = [
        ['引き算の配慮', 'SHOSA独自技術', 'Less-is-More Consideration', '自身の好みを抑え、空間の快適さを優先する姿勢（例:無香）', '直訳（Subtraction care）は意味不明になるため、国際的格言「Less is more」を借用し、「余計なものを削ぎ落とす配慮」として直感伝達。'],
        ['無香', 'SHOSA独自基準', 'Fragrance-Free', '匂いを残さないよう配慮する、日本のホテル現場の身だしなみ基準', '化粧品やアメニティでも世界共通の「Fragrance-Free」を採用。Scentlessより業界標準として定着。'],
        ['見送り余韻', 'SHOSA独自技術', 'Mindful Send-off (Watching over until out of sight)', 'お客様の姿が見えなくなるまで視線を残してお見送りする所作', '比喩表現。単なる「Seeing off」ではなく、「Mindful（心を込めた）Send-off」とし、カッコ内に具体的な所作行動を補足。'],
        ['語先後礼', 'ビジネス所作', 'Gosen-Gorei (Speaking before bowing)', '言葉を先に言い切り、そのあとでお辞儀をする日本の礼儀作法', '日本特有の所作名「Gosen-Gorei」をそのまま残しつつ、非ネイティブ向けに「Speaking before bowing」を併記。'],
        ['ネームコール', 'SHOSA独自技術', 'Addressing Guests by Name', 'お客様の名前を呼んで接客すること（和製英語）', '和製英語の「Name call」は英語で「点呼」「悪口・罵倒」と誤解されるため、自然なホテル英語「Addressing Guests by Name」に修正。'],
        ['セーフティフレーズ', 'SHOSA独自技術', 'Safety Phrases', 'とっさに時間を稼ぎ、落ち着いて確認するための定型応答フレーズ', 'カタカナ用語の意図そのまま。現場での安心感を与える「Safety Phrases」として統一。'],
        ['報連相', 'ビジネス概念', 'Horenso (Reporting, Communicating, Consulting)', '報告・連絡・相談のチームワーク基本', '日本のビジネス文化学習として「Horenso」を尊重しつつ、3動詞（Report, Communicate, Consult）で意味を補足。'],
        ['目配り・気配り・手配り', 'おもてなし精神', 'Watchful eyes, thoughtful care, well-prepared arrangements', 'ゲストの要望を先回りして準備する判断軸', '直訳ではなく、1章の英文と完全連動させ、3つの所作がリズミカルに理解できる英語表現に統一。'],
        ['Omotenashi Mindset', '章名・基本概念', 'Omotenashi Mindset', '日本の宿泊業で求められるプロの思考OS総称', '依頼方針通りそのまま維持。アプリ全体のコアバリューとして確立。'],
        ['PMS', '業界用語', 'Reservation System (PMS)', '宿泊管理システム（Property Management System）', '初学者向けに「Reservation System」を主見出しとし、実務略称「PMS」を括弧書き併記。']
    ]
    for r in p3_data:
        for c_idx, val in enumerate(r, start=1):
            cell = ws_prop.cell(row=curr_row, column=c_idx, value=val)
            cell.font = f_cell
            cell.border = border_all
            if c_idx == 1:
                cell.font = f_cell_bold
                cell.alignment = Alignment(horizontal='center', vertical='center')
            elif c_idx == 3:
                cell.font = f_highlight
                cell.alignment = Alignment(vertical='center')
            else:
                cell.alignment = Alignment(vertical='center', wrap_text=True)
        ws_prop.row_dimensions[curr_row].height = 36
        curr_row += 1

    curr_row += 1

    # Section 4: 文字数管理 & デザイン（諏訪様）連携方針
    add_section_header("4. 文字数管理およびデザイン調整（諏訪様）連携方針")
    p4_headers = ['区分', '方針・対応ルール', '具体例・アクション']
    for col_idx, h in enumerate(p4_headers, start=1):
        cell = ws_prop.cell(row=curr_row, column=col_idx, value=h)
        cell.font = f_tbl_header
        cell.fill = fill_th
        cell.border = border_all
        cell.alignment = Alignment(horizontal='center', vertical='center')
    curr_row += 1

    p4_data = [
        ['基本上限の考え方', '日本語文字数の2.2倍目安（単語単位で自然な長さを優先）', '上限を10〜20%程度超える場合は、無理に略語化せず意味優先でそのまま入力しています。'],
        ['大幅超過時の対応', 'デザイン側（諏訪様）でレイアウト調整・改行調整が必要な項目', '文字数上限を大きく超え、フォントサイズ縮小や行数追加が必要な箇所は「備考」列に明記します。'],
        ['改行位置の管理', '英語特有の単語途中改行（ハイフネーション崩れ）を防止', 'スマートフォン幅（360〜430px）での表示崩れを防ぐため、適宜フレーズ単位で改行コード（\\n）を調整します。'],
        ['ボタン・ラベル等のUI幅', '固定幅コンポーネント（START, NEXT, チケットカード等）', 'ボタンやタグ類は極小文字数（1〜2語）で完結させ、枠からはみ出さないシンプルな英語に統一しています。']
    ]
    for r in p4_data:
        for c_idx, val in enumerate(r, start=1):
            cell = ws_prop.cell(row=curr_row, column=c_idx, value=val)
            cell.font = f_cell
            cell.border = border_all
            if c_idx == 1:
                cell.font = f_cell_bold
                cell.alignment = Alignment(horizontal='center', vertical='center')
            else:
                cell.alignment = Alignment(vertical='center', wrap_text=True)
        ws_prop.row_dimensions[curr_row].height = 28
        curr_row += 1

    curr_row += 1

    # Section 5: 全体スケジュールと今後の進行ステップ
    add_section_header("5. 全体スケジュールと今後の進行ステップ（11/16〜12/10 FIX）")
    p5_headers = ['日付・マイルストーン', '担当・アクション内容', '成果物・確認ポイント', '状態']
    for col_idx, h in enumerate(p5_headers, start=1):
        cell = ws_prop.cell(row=curr_row, column=col_idx, value=h)
        cell.font = f_tbl_header
        cell.fill = fill_th
        cell.border = border_all
        cell.alignment = Alignment(horizontal='center', vertical='center')
    curr_row += 1

    p5_data = [
        ['11/16（月）本日', '【sakai】先行分翻訳（0章〜3章対象行）および表記ルール・用語定義案の提出', '本シート（提案タブ）＋0章・1章・2章・3章先行分の英訳', '完了（本日提出）'],
        ['11/17（火）', '【プロジェクト推進チーム様】表記ルール・独自用語案のご確認・フィードバック', 'ルール・用語確定、デザイン（諏訪様）への文字数共有', 'レビュー待ち'],
        ['11/18（水）', '【sakai】残り全章の本格翻訳に着手（1章L02〜11、2章S2〜10、3章L2〜6）', '確定した表記ルール・独自用語を全スクリプトに水平展開', '着手予定'],
        ['11/25（水）', '【sakai】中間進捗共有（1章全訳完了・2章進捗50%）', '途中レビュー・長文レイアウト擦り合わせ', '予定'],
        ['12/03（木）', '【sakai】全章ドラフト翻訳完了・セルフチェック（CEFR B1平易度・文字数）', '全スクリプト英訳完了版の提出', '予定'],
        ['12/10（木）', '【プロジェクトチーム全体】最終レビュー・文言確定（FIX）', '全章FIX・アプリ実装用マスターデータ化', 'ゴール']
    ]
    for r in p5_data:
        for c_idx, val in enumerate(r, start=1):
            cell = ws_prop.cell(row=curr_row, column=c_idx, value=val)
            cell.font = f_cell
            cell.border = border_all
            if c_idx == 4 and '完了' in val:
                cell.fill = fill_badge_done
                cell.font = f_cell_bold
                cell.alignment = Alignment(horizontal='center', vertical='center')
            elif c_idx == 4 and 'レビュー待ち' in val:
                cell.fill = fill_badge_ready
                cell.font = f_cell_bold
                cell.alignment = Alignment(horizontal='center', vertical='center')
            elif c_idx in [1, 4]:
                cell.alignment = Alignment(horizontal='center', vertical='center')
            else:
                cell.alignment = Alignment(vertical='center', wrap_text=True)
        ws_prop.row_dimensions[curr_row].height = 26
        curr_row += 1

    # Adjust column widths for ws_prop
    col_widths = {1: 22, 2: 30, 3: 40, 4: 45, 5: 35, 6: 25, 7: 20, 8: 20}
    for col_idx, width in col_widths.items():
        col_letter = get_column_letter(col_idx)
        ws_prop.column_dimensions[col_letter].width = width

    # Save workbook
    wb_target.save('翻訳.xlsx')
    print("Successfully created proposal tab and saved 翻訳.xlsx!")

if __name__ == '__main__':
    build_update()

