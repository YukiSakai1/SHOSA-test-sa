"use strict";
/* =========================================================
   GAME DATA — シナリオデータ
   各テキストには "_en" で終わる英訳フィールドがあり、
   画面上の「English >」トグルで表示を切り替えられる。
   ========================================================= */
const GAME_DATA = {
    days: [
        {
            dayTitle: "DAY 1",
            timeLabel: "07:20",
            genreTag: "考えて選ぶ",
            sceneIntro: "ホテルスタッフとして初めての朝。あなたは更衣室で身支度を終えて、朝礼に向かおうとしています。",
            sceneIntro_en: "It's your first morning as hotel staff. You've finished getting ready in the locker room and are about to head to the morning meeting.",
            daySummaryDesc: "忙しい朝の現場で、指示の優先順位を判断し「報連相（ほうれんそう）」の基本を身につけます。",
            npc: {
                name: "チーフ（上司）",
                avatar: "assets/images/mascot_shosa_face.png",
                bannerNeutral: "assets/images/mascot_shosa_face.png",
                bannerHappy: "assets/images/mascot_shosa_face.png",
                bannerWorried: "assets/images/mascot_shosa_face.png"
            },
            story: "朝礼5分前のバックヤード。同僚から「体調が悪く30分遅れる」とメッセージが届きました。",
            story_en: "It's the backyard, 5 minutes before the morning meeting. A colleague messages you: \"I'm not feeling well and will be 30 minutes late.\"",
            hint: "Hint: 日本の職場では、分かった情報をすぐに共有することがチームへの一番の貢献になります。",
            hint_en: "Hint: In Japanese workplaces, sharing information as soon as you know it is the fastest way to help your team.",
            dialogueText: "「おはようございます、○○さん。5分後の07:25から朝礼を始めます。」",
            dialogueText_en: "\"Good morning, ○○. We'll start the morning meeting in 5 minutes, at 7:25.\"",
            gaugeLabel: "チーフの信頼度",
            question: {
                text: "先輩たちは忙しそう。同僚から受けた遅刻連絡、いつ報告する？",
                textEn: "The senior staff look busy. When do you report the tardiness message from your colleague?",
                choices: [
                    { label: "みんなが落ち着いてから、あとでこっそり伝える", quality: "bad",
                        feedback: "「え、今知らせてくれたらシフトを調整できたのに…」チーフは少し困った表情に。",
                        feedback_en: "\"Huh, if you'd told me now I could've adjusted the shift...\" The chief looks a little troubled.",
                        gaugeDelta: -20, teamDelta: -15, guestDelta: 0, points: 20 },
                    { label: "チーフの手が空いた瞬間に、今すぐ伝える", quality: "best",
                        feedback: "「分かりました、教えてくれてありがとう。最初の30分はあなたがポジションに入ってください。」",
                        feedback_en: "\"I see, thanks for telling me. Then please cover the position for the first 30 minutes.\"",
                        gaugeDelta: 25, teamDelta: 20, guestDelta: 0, points: 100 },
                    { label: "同僚に電話で事情を詳しく聞いてから報告する", quality: "okay",
                        feedback: "「そうか、ありがとう。でももう少し早く教えてくれると助かるな。」",
                        feedback_en: "\"I see, thanks. But it would help if you told me a bit sooner next time.\"",
                        gaugeDelta: 5, teamDelta: 5, guestDelta: 0, points: 60 }
                ]
            },
            explanation: {
                lessonNo: "[レッスン1]",
                title: "SHOSAの極意：報連相（ほうれんそう）",
                body: "日本の現場では、1人の遅刻が休憩の順番やポジション配置など、全体のシフトに影響します。<br><br>「体調不良で遅刻すること」自体は仕方ありません。大切なのは、それが分かった瞬間に「理由」と「何分遅れるか」をすぐ上司に共有することです。<br><br>「恐れ入ります」のようなクッション言葉を添えて、事実（ファクト）を先回りで伝える勇気が、自分自身とチームを守ることにつながります。",
                body_en: "In Japanese workplaces, even one person being late can throw off the whole shift — break rotations, position assignments, and more.<br><br>Being late due to illness can't be helped. What matters is sharing the \"reason\" and \"how many minutes late\" with your supervisor the moment you find out.<br><br>Having the courage to proactively share the facts, softened with a cushion word like \"osore irimasu\" (excuse the interruption), protects both you and your team."
            },
            voice: {
                lessonNo: "[レッスン1]",
                script: "恐れ入ります。○○さんが体調不良で30分遅れるそうです。",
                script_en: "Excuse the interruption. ○○-san isn't feeling well and will be about 30 minutes late."
            }
        }
    ]
};
// Chapter 1 Data generated verbatim from 翻訳.xlsx (Sheet2)
const CH1_DATA = {
    "guide": {
        "badgeNumber": "101",
        "titleJa": "1章：Omotenashi Mindset",
        "titleEn": "Chapter 1: Omotenashi Mindset",
        "subtitleJa": "ホテルの一日に寄り添う「プロの思考と選択」",
        "subtitleEn": "Follow a hotel day through a pro's thinking and choices",
        "bodyJa": "「おもてなし」とは、特別な演出のことだけではありません。それは、ゲストが言葉にする前に求めるものを察し、次の展開を先回りして準備する「姿勢」そのものです。この章では、あるホテルの1日をゲストの滞在体験を見ながら、日本の宿泊業の現場で求められる『目配り・気配り・手配り』の判断軸を身につけていきます。プロのOmotenashi Mindsetをインストールしましょう！",
        "bodyEn": "Omotenashi isn't only about special touches. It's an attitude: sensing what guests want before they say it, and preparing for what comes next. In this chapter, you'll follow one day at a hotel through the guest's stay experience and learn the judgment standards demanded on the floor of Japan's hospitality industry: 'mekubari, kikubari, tehaibari' (watchful eyes, thoughtful care, and well-prepared arrangements). Let's install a pro's Omotenashi Mindset!",
        "buttonJa": "START",
        "buttonEn": "START"
    },
    "end": {
        "titleJa": "1章 学習完了！",
        "titleEn": "Chapter 1 Complete!",
        "bodyJa": "プロの仕事を観察し、日本の宿泊業の現場で求められるOmotenashi Mindsetを体験することができました！",
        "bodyEn": "You observed the work of pros and experienced the Omotenashi Mindset required in Japan's hospitality industry!",
        "noteJa": "※いつでもホーム画面から全レッスンの振り返りが可能です",
        "noteEn": "*You can review all lessons anytime from the Home screen",
        "unlockLabelJa": "2章：JOB診断 が解放されました",
        "unlockLabelEn": "Chapter 2: JOB Assessment has been unlocked",
        "buttonJa": "START",
        "buttonEn": "START"
    },
    "common": {
        "correctJa": "正解！",
        "correctEn": "Correct!",
        "incorrectJa": "不正解",
        "incorrectEn": "Incorrect",
        "situationLabel": "SITUATION",
        "questionLabel": "QUESTION"
    },
    "lessons": [
        {
            "id": "L01",
            "time": "12:45",
            "titleJa": "出勤前の身だしなみチェック",
            "titleEn": "Pre-Shift Grooming Check",
            "narrationJa": "時刻は12:45。午後のシフトインを前に、バックヤードの姿見の前へ。",
            "narrationEn": "It's 12:45. Before your afternoon shift begins, you head to the full-length mirror in the back-of-house area.",
            "charImgId": "CH1-CHAR-FRONT-LATE-GROOMING",
            "sceneImg": "assets/images/img.png",
            "shosaImgId": "COMMON-CHAR-SHOSA-NORMAL",
            "speakerJa": "フロントスタッフ",
            "speakerEn": "Front Desk Staff",
            "line1Ja": "（勤務開始まであと15分。持ち物よし、最後は身だしなみチェック。）",
            "line1En": "(15 minutes until my shift. Belongings checked. Last step: a final grooming check.)",
            "line2Ja": "勤務開始直前の最終点検ですね。プロは鏡に映る姿だけでなく、目に見えない部分まで配慮を行き届かせます。",
            "line2En": "This is your last check before the shift begins. Professionals attend not only to what the mirror shows, but also to what can't be seen.",
            "situationTagJa": "姿見の鏡前で身だしなみの最終確認中",
            "situationTagEn": "Doing a final grooming check in front of the mirror",
            "questionJa": "出社前に身だしなみを整える際、『匂い』についてプロとして正しい配慮はどちらですか？",
            "questionEn": "When preparing for work, which is the correct, professional way to handle 'scent'?",
            "choiceAJa": "お客様に良い印象を与えるため、ほのかに香る爽やかな香水を少量つけておく",
            "choiceAEn": "Wear a small amount of light, fresh perfume to make a good impression on guests",
            "choiceBJa": "香水や柔軟剤の強い香りを避け、無香（匂いを残さないこと）を徹底する",
            "choiceBEn": "Avoid strong perfume/softener scents; stay fully fragrance-free (no lingering scent)",
            "correct": "B",
            "reasonJa": "良い香り（A）も良かれと思いがちですが、強い香りはホテルの非日常感を損なうため、無香を保つ配慮（B）がプロの鉄則です。",
            "reasonEn": "A nice scent (A) may seem considerate, but strong fragrance can spoil the hotel's special atmosphere. Staying fragrance-free (B) is the professional rule.",
            "shosaPromptJa": "海外と日本では『香り』の感覚が違うんだ。プロが大切にする『無香』の意味、知ってる？",
            "shosaPromptEn": "Views on scent differ between countries and Japan. Do you know why pros go fragrance-free?",
            "focusTextJa": "多くの国では、良い香水を身につけることは『相手を歓迎するマナー』とされます。しかし、日本のホテル現場では『無香（匂いを残さないこと）』が最高の身だしなみです。さまざまな文化を持つゲストが寛ぐ空間では、どんなに良い香りでも『刺激』になり得ます。自身の好みを抑え、空間の快適さを守る『引き算の配慮』がプロの基準です。",
            "focusTextEn": "In many countries, wearing good perfume is seen as a way of welcoming others. In Japanese hotels, however, being fragrance-free (leaving no scent behind) is the highest standard of grooming. In a space where guests from many cultures relax, even a lovely fragrance can be an irritant. Setting aside your own preferences to protect the comfort of the space – this 'less-is-more' consideration – is the professional standard.",
            "focusImgCaptionJa": "香水のボトルにそっとフタをする手元"
        }
    ]
};
window.CH1_DATA = CH1_DATA;
//# sourceMappingURL=game_data.js.map