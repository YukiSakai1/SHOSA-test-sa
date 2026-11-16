import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = openpyxl.load_workbook('翻訳.xlsx')

# Styling definitions
header_fill = PatternFill(start_color='1E7E34', end_color='1E7E34', fill_type='solid') # Fresh professional green
header_font = Font(name='游ゴシック', size=10, bold=True, color='FFFFFF')
suggestion_fill = PatternFill(start_color='E8F5E9', end_color='E8F5E9', fill_type='solid') # Soft green highlight for modified
cell_font = Font(name='游ゴシック', size=9)
cell_align = Alignment(vertical='top', wrap_text=True)

thin_border = Border(
    left=Side(style='thin', color='CCCCCC'),
    right=Side(style='thin', color='CCCCCC'),
    top=Side(style='thin', color='CCCCCC'),
    bottom=Side(style='thin', color='CCCCCC')
)

print('Starting insertion of Suggestion column in １章...')
ws1 = wb['１章']
# Col 8 is 内容（EN), insert at col 9
ws1.insert_cols(9)
ws1.cell(1, 9, '内容（EN修正案 / Suggestion）')
ws1.cell(1, 9).font = header_font
ws1.cell(1, 9).fill = header_fill
ws1.cell(1, 9).alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
ws1.column_dimensions[get_column_letter(9)].width = 45

# Mapping of specific suggestions for １章
suggestions_1 = {
    # L01
    10: ("This is your final check before your shift begins. Professionals pay attention not only to what the mirror shows, but also to what cannot be seen.",
         "【平易化】attend not only to → pay attention not only to（CEFR B1非ネイティブ配慮）"),
    13: ('When grooming before work, which is the correct professional way to handle "scent"?',
         "【表記統一】引用符をダブルクォート（\" \"）に統一"),
    14: ('Wear a small amount of light, fresh perfume to make a good impression on guests', ''),
    15: ('Avoid strong perfume and fabric softener scents; stay fully fragrance-free (leave no scent behind).',
         "【表現洗練】スラッシュをandに変更し、より自然な文に調整"),
    18: ('A nice scent (A) may seem welcoming, but strong scents can disrupt the hotel atmosphere. Staying fragrance-free (B) is the professional rule.',
         "【平易化・表記統一】直感的な語彙に調整"),
    19: ('Views on "scent" differ between Japan and overseas. Do you know why professionals stay "fragrance-free"?',
         "【表記統一】『』をダブルクォートに統一、pros → professionals"),
    20: ('In many countries, wearing nice perfume is seen as a way of welcoming others. In Japanese hotels, however, being "fragrance-free" (leaving no scent behind) is the highest standard of grooming. In a space where guests from diverse cultures relax, even a pleasant fragrance can cause discomfort to some guests. Setting aside personal preferences to protect the comfort of the shared space—this "less-is-more consideration"—is the professional standard.',
         "【難解語彙の平易化・表記統一】irritant → cause discomfort to some guests（B1配慮）、ダブルクォート統一"),

    # L02
    25: ("It is 13:00. Shift change from morning to evening. The Front Desk handover meeting begins.",
         "【簡潔化】より平易で短い文に調整"),
    30: ('Before the busy afternoon, this is a crucial "handover" moment: passing on information accurately within limited time.',
         "【表記統一】引用符をダブルクォートに統一"),
    33: ('With limited meeting time, which approach best ensures information is handed over to the next shift reliably?', ''),
    35: ('Lead with "Conclusion, Key Points, and Guest/Target Person," and communicate high-priority matters concisely.',
         "【表記統一】『結論・要点・対象者』の対訳を明確化"),
    38: ('Explaining events in chronological order (A) takes time and blurs key points; leading with conclusion and key points (B) prevents missed tasks.', ''),
    39: ('Busy shifts need quick handovers! Let\'s see how pros lead with the "conclusion"!',
         "【表記統一】ダブルクォート統一"),
    40: ('Handovers in hotels are races against time, especially during peak check-in. Telling stories chronologically buries key points. By starting with "Conclusion, Key Points, and Target Person," the next shift can prioritize and take action immediately. This accurate information link underpins seamless team service.', ''),

    # L03
    45: ('It is 15:00. Check-in begins, and arriving guests start gathering in the lobby.', ''),
    50: ('You notice waiting guests, and offer a reassuring word with eye contact while handling your current guest.', ''),
    55: ('Keep an eye on waiting guests as well, offering reassurance through eye contact and a brief word.',
         "【表現洗練】目配りのニュアンスをより自然に表現"),
    58: ('Focusing only on the guest in front of you (A) leaves others feeling ignored; keeping an eye on the whole lobby (B) maintains high guest satisfaction.', ''),
    59: ('Just a simple glance can bring peace of mind! Let\'s learn the pro technique of "mekubari" (watchful eyes)!',
         "【用語統一】目配り（mekubari / watchful eyes）を明記"),
    60: ('Check-in peak is when lobby crowds peak too. If front desk staff only look at papers, waiting guests feel anxious. By maintaining "watchful eyes" (mekubari), making brief eye contact, and saying "Thank you for waiting, we will be with you shortly," guests feel cared for and can wait comfortably.', ''),

    # L04
    65: ('It is 17:00. At check-in, a guest asks if a humidifier is available.', ''),
    70: ('You used a "Safety Phrase" to secure time, and immediately coordinated with your team via headset.',
         "【用語統一】セーフティフレーズの対訳反映"),
    75: ('Say "Certainly, let me check for you right away," and ask the back office team via headset.',
         "【接客表現の向上】丁寧な接客フレーズにブラッシュアップ"),
    78: ('Guessing on the spot (A) causes serious complaints; using a safety phrase to check with the team (B) ensures trust.', ''),
    79: ('Never give a vague answer! Let\'s learn how "Safety Phrases" buy time while coordinating with your team.',
         "【用語統一】Safety Phrasesの表記統一"),
    80: ('When asked something you cannot answer immediately, guessing is the biggest risk in hotel service. Professionals instantly use a "safety phrase" like "Certainly, let me confirm that right away" to buy time, then accurately check with colleagues. Handling irregular requests as a team is true hospitality.', ''),

    # L05
    85: ('It is 19:00. Dinner peak at the restaurant, and a waiting line begins to form at the entrance.', ''),
    90: ('You noticed the waiting guests early, offered menus, and provided a clear wait estimate.', ''),
    95: ('Greet waiting guests, provide a wait estimate, and hand them menus so they can choose their meals.', ''),
    98: ('Leaving guests waiting without information (A) breeds frustration; sharing wait times and menus (B) turns wait time into anticipation.', ''),
    99: ('Waiting without information feels twice as long! Let\'s see how pros manage "wait anticipation"!', ''),
    100: ('The feeling of waiting changes completely when guests know how long it will take. By providing a clear estimate ("about 15 minutes") and offering menus in advance, waiting time transforms into enjoyable meal-planning time. Proactive care for unseen guests is the essence of hospitality.', ''),

    # L06 - ネームコール（最重要修正箇所！）
    124: ('Sharing Allergy Information & Addressing Guests by Name',
          "【最重要修正】和製英語「Name-Call」は英語で「悪口・罵倒」を意味するため、「Addressing Guests by Name」に修正"),
    125: ('It is 19:30. At dinner service, you serve a meal with allergen-removed ingredients to a reserved guest.', ''),
    129: ('"Mr./Ms. [Guest Name], here is your sautéed fish, prepared without shrimp."',
          "【表記統一】プレースホルダーをルール統一 [Guest Name]"),
    130: ('Double-checking with the kitchen and serving by addressing the guest by name prevents allergy mix-ups.',
          "【和製英語修正】serve with name-call → serving by addressing the guest by name"),
    132: ('Serving allergy-accommodated meals. Avoiding mix-ups is essential.', ''),
    133: ('When serving a meal with allergy accommodations, which procedure is most appropriate?', ''),
    134: ('Double-check with the kitchen, and serve the dish by addressing the guest by name to confirm allergen removal.',
          "【最重要修正】(name-call)を完全排除し、自然かつ安全な表現に改定"),
    135: ('To protect guest privacy, place the plate silently without speaking their name', ''),
    138: ('Checking with the kitchen (A) is vital, but addressing the guest by name upon serving (B) completely prevents mix-ups.',
          "【和製英語修正】using the guest\'s name at serviceに修正"),
    139: ('Allergy response directly impacts guest safety. Let\'s learn how addressing guests by name provides true peace of mind!',
          "【和製英語修正】using guest names / addressing guests by name"),
    140: ('Allergy care succeeds through precise cooking in the kitchen and clear communication on the dining floor. Staff must double-check the order slip with the kitchen before serving. When presenting the dish, addressing the guest by name—such as "Mr./Ms. [Guest Name], this dish was prepared with shrimp removed"—reassures them that it was customized specifically for them, allowing them to dine with peace of mind.',
          "【最重要修正】name-call（悪口）を排除し、プレースホルダーを [Guest Name] に統一"),

    # L07
    145: ('It is 02:00. The lobby is quiet at late night. You patrol and check security in the silent hotel.', ''),
    150: ('Maintaining quiet footsteps and an alert posture protects the peaceful night for sleeping guests.', ''),
    155: ('Keep your footsteps soft to maintain silence, while walking with alert posture and scanning the surroundings.', ''),
    158: ('Relaxing your posture in an empty lobby (A) lowers safety; walking silently with an alert posture (B) safeguards guest trust.', ''),
    159: ('A professional\'s true attitude shows in an empty lobby. Let\'s see late-night vigilance and silent care!', ''),
    160: ('At 2:00 AM, guests are resting in their rooms. The hotel lobby at night demands absolute quiet and security. Soft footsteps ensure guests are not disturbed, while an alert, dignified walking posture deters suspicious activity. True professionals maintain impeccable posture even when no one is watching.', ''),

    # L08
    165: ('It is 07:30. Morning breakfast venue peak. Guests who wish to relax and guests in a hurry to depart are mixed.', ''),
    170: ('Noticing the guest checking their watch, you immediately checked their schedule and offered breakfast options.', ''),
    175: ('Check if they are in a hurry, give an accurate wait estimate, and offer alternatives such as takeout.', ''),
    178: ('Simply making guests wait their turn (A) is not enough; sensing their rush and offering options (B) is professional care.', ''),
    179: ('Read the "rush" in a guest\'s gestures! Let\'s see the tips for identifying morning guest needs!',
         "【表記統一】ダブルクォート統一"),
    180: ('At the morning breakfast venue, guests who want to relax and those rushing for business or flights are mixed together. Guests checking their watches or looking around anxiously are sending signals that they are pressed for time. Rather than treating everyone the same, offering quick seating or to-go options resolves their unspoken worries.', ''),

    # L09 - 語先後礼・見送り余韻（最重要修正箇所！）
    184: ('Checkout Peak & The Etiquette of Send-off Afterglow',
          "【用語修正】見送り余韻を「Send-off Afterglow」として統一"),
    185: ('It is 10:00. Check-out peak at the front desk—the crucial moment that shapes the lasting final memory of their stay.', ''),
    189: ('"Here is your receipt. Please have a wonderful day." (Gosen-gorei: speak first, then bow)',
          "【スペルミス修正】gosen-goree → Gosen-gorei（礼=rei）、接客文の洗練"),
    190: ('Handing the receipt with both hands and keeping your eyes on the guest until they are out of sight conveys heartfelt hospitality.', ''),
    192: ('Send-off after checkout. Creating the final impression of the stay.', ''),
    193: ('As send-off etiquette after completing checkout, which action is most desirable for a professional?', ''),
    194: ('Bow with "Gosen-gorei" (speak first, then bow), and warmly see the guest off until they are out of sight.',
          "【スペルミス修正】gosen-goree → Gosen-gorei に修正、説明付記"),
    195: ('Bow briefly and immediately begin filing documents for the next guest', ''),
    198: ('Switching to administrative tasks immediately (B) diminishes the experience. Maintaining a mindful send-off until the guest is out of sight (A) leaves a lasting positive impression.',
          "【表現洗練】見送り余韻の意図を明確化"),
    199: ('Your posture in the final seconds shapes the guest\'s memory. Let\'s learn the mindful etiquette of "Send-off Afterglow"!',
          "【用語統一】見送り余韻の対訳反映"),
    200: ('Guests strongly remember their final impression of a hotel stay. Along with fundamentals like handing items with both hands and "speaking first, then bowing" (Gosen-gorei), the "Send-off Afterglow" is essential: after bowing, do not immediately return to your tasks, but keep a caring gaze on the guest until they are out of sight. This courteous final touch creates memorable moments that inspire guests to return.',
          "【スペルミス・用語統一】gosen-goree → Gosen-gorei、Send-off Afterglow の用語統一"),

    # L10
    204: ('Handling Lost Items Found During Room Cleaning', ''),
    205: ('It is 11:00. While cleaning a room after departure, you find a valuable item left behind.', ''),
    209: ('"Ring found beside the bed in Room 205. Reporting room number, location, and time immediately."', ''),
    210: ('Stopping work the moment you find an item, recording accurately, and sharing with the Front Desk right away is exemplary.', ''),
    212: ('Lost item found during room cleaning. Prompt coordination is required.', ''),
    213: ('When discovering a lost item in a room after checkout, what should housekeeping staff do first?', ''),
    214: ('Finish all room cleaning first, then bring it to the Front Desk with the cleaning cart', ''),
    215: ('Record the room number, exact location, and time, and report to the Front Desk immediately from the room.', ''),
    218: ('Reporting together at the end of the shift (A) allows the guest to travel farther away. Reporting accurate details the moment you find it (B) is the iron rule.', ''),
    219: ('A one-minute delay can be too late! Let\'s see how pros handle "Lost & Found" during room cleaning.', ''),
    220: ('Lost items are precious personal property of guests, and speed is everything upon discovery. Without delay, accurately record the "room number, location, item, and time" and inform the Front Desk immediately. Room cleaning is proud, professional work that erases all traces of previous guests—hair, fingerprints, scents—and restores a pristine space.', ''),

    # Chapter 1 Summary
    223: ('Chapter 1: Omotenashi Mindset', ''),
    224: ('Experiencing a Hotel Day Through a Professional\'s Thinking and Choices', ''),
    225: ('"Omotenashi" is not just about special performances. It is a mindset: anticipating what guests need before they speak, and preparing the next step in advance. In this chapter, you will observe a full day at a hotel through the guest\'s stay experience and acquire the key judgment principles required in Japan\'s hospitality industry: "Mekubari, Kikubari, Tehaibari" (Watchful eyes, thoughtful care, well-prepared arrangements). Let\'s master the professional Omotenashi Mindset!',
          "【用語統一・クォート統一】Omotenashi Mindset, 目配り・気配り・手配りの対訳統一"),
    227: ('Chapter 1 Complete!', ''),
    228: ('You observed professional practices and experienced the Omotenashi Mindset required in Japan\'s hospitality industry!', ''),
    229: ('*You can review all lessons anytime from the Home screen.', ''),
    230: ('Chapter 2: JOB Assessment has been unlocked!', '')
}

# Fill suggestions in １章
for r in range(2, ws1.max_row+1):
    orig_en = ws1.cell(r, 8).value
    cell = ws1.cell(r, 9)
    cell.font = cell_font
    cell.alignment = cell_align
    cell.border = thin_border
    
    if r in suggestions_1:
        sug_text, reason = suggestions_1[r]
        cell.value = sug_text
        if reason:
            cell.fill = suggestion_fill
            # also update remarks column (now col 13 because col 9 was inserted)
            cur_note = ws1.cell(r, 13).value or ''
            if cur_note:
                ws1.cell(r, 13, f"{cur_note} | {reason}")
            else:
                ws1.cell(r, 13, reason)
    elif orig_en:
        # keep original if no specific change needed
        cell.value = orig_en

print('Inserted suggestions into １章 successfully!')

# Now 0章
print('Starting insertion of Suggestion column in 0章...')
ws0 = wb['0章']
# Col 9 is 内容（EN), insert at col 10
ws0.insert_cols(10)
ws0.cell(1, 10, '内容（EN修正案 / Suggestion）')
ws0.cell(1, 10).font = header_font
ws0.cell(1, 10).fill = header_fill
ws0.cell(1, 10).alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
ws0.column_dimensions[get_column_letter(10)].width = 45

suggestions_0 = {
    9: ("Welcome to SHOSA\n\nLet's learn together\nfor a future working\nin Japanese hotels.", ""),
    11: ("Gain the Skills and Confidence\nto work in a Japanese hotel!", ""),
    12: ("SHOSA PASSPORT is an app where you learn hotel service Japanese and hospitality, while discovering your best-fit role and growth opportunities.",
         "【平易化・自然な語順】よりシンプルで読みやすい構成に調整"),
    13: ("✓ AI Tutor\n✓ Role-play practice\n✓ Hotel service training\n✓ Japanese for guest service", ""),
    23: ("Your exam results become your Report on:\n✓ Strengths\n✓ Growth log\n✓ Best-fit roles\n\nDon't just learn.\nProve what you can do.\nThat's SHOSA.", ""),
    25: ("Nice to meet you! I'm [Name].\n\nTo help you learn,\nfirst tell me a little about yourself.", ""),
    85: ("This is your name in the app.\nPlease choose a simple name of 10 characters or fewer.", ""),
    96: ("✔︎ Know yourself (Career Match)\nTake the aptitude test to find\nthe role that suits you.", ""),
    101: ("Answer each question using the\n5-point scale.\n\nChoose the option that fits\nyou best right now,\nnot who you wish to become.",
          "【平易化】question / fits you best に調整"),
    123: ("Well done!\nBased on your answers,\nwe'll introduce the roles that suit you.\n\nTap \"See Results\" to explore!",
          "【表記統一】スマートクォート “ ” を \" \" に統一")
}

for r in range(2, ws0.max_row+1):
    orig_en = ws0.cell(r, 9).value
    cell = ws0.cell(r, 10)
    cell.font = cell_font
    cell.alignment = cell_align
    cell.border = thin_border
    
    if r in suggestions_0:
        sug_text, reason = suggestions_0[r]
        cell.value = sug_text
        if reason:
            cell.fill = suggestion_fill
    elif orig_en:
        cell.value = orig_en

print('Inserted suggestions into 0章 successfully!')

# Now ２章
print('Starting insertion of Suggestion column in ２章...')
ws2 = wb['２章']
# Col 9 is 内容（EN), insert at col 10
ws2.insert_cols(10)
ws2.cell(1, 10, '内容（EN修正案 / Suggestion）')
ws2.cell(1, 10).font = header_font
ws2.cell(1, 10).fill = header_fill
ws2.cell(1, 10).alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
ws2.column_dimensions[get_column_letter(10)].width = 45

for r in range(2, ws2.max_row+1):
    orig_en = ws2.cell(r, 9).value
    cell = ws2.cell(r, 10)
    cell.font = cell_font
    cell.alignment = cell_align
    cell.border = thin_border
    if orig_en:
        cell.value = orig_en

# Now ３章
print('Starting insertion of Suggestion column in ３章...')
ws3 = wb['３章']
# Col 8 is 内容（EN), insert at col 9
ws3.insert_cols(9)
ws3.cell(1, 9, '内容（EN修正案 / Suggestion）')
ws3.cell(1, 9).font = header_font
ws3.cell(1, 9).fill = header_fill
ws3.cell(1, 9).alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
ws3.column_dimensions[get_column_letter(9)].width = 45

for r in range(2, ws3.max_row+1):
    orig_en = ws3.cell(r, 8).value
    cell = ws3.cell(r, 9)
    cell.font = cell_font
    cell.alignment = cell_align
    cell.border = thin_border
    if orig_en:
        cell.value = orig_en

# Update Proposal tab to explain the new Suggestion columns
ws_prop = wb['【提案】表記ルール・用語定義案']
ws_prop.cell(3, 1, '本シートは、11/16（月）先行分翻訳確認および「表記ルール・独自用語英語表記・修正案（Suggestion）」の提出資料です。各章シートに【内容（EN修正案 / Suggestion）】列を新設し、和製英語の排除やスペルミス修正、表記ルールの統一を反映しています。')

try:
    wb.save('翻訳.xlsx')
    print('Successfully saved 翻訳.xlsx with Suggestion columns across all sheets!')
except PermissionError:
    wb.save('翻訳_suggestion版.xlsx')
    print('翻訳.xlsx is currently locked by Excel. Saved to 翻訳_suggestion版.xlsx instead!')
