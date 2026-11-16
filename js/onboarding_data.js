"use strict";
/* =========================================================
   ONBOARDING DATA — 「0章」登録〜SHOSAパスポート完成までの
   コンテンツ定義。シナリオ担当の人はこのファイルだけ編集すればOK。
   ========================================================= */
const ONBOARDING_DATA = {
    // 1d/1e. 言語表示設定 (Figma CH0-08)
    languageOptions: [
        { id: "normal", label: "Japanese", flag: "jp" },
        { id: "english", label: "English", flag: "us" }
    ],
    // 1f. キャラクター紹介カルーセル（4枚: Figma CH0-03 〜 CH0-06）
    introSlides: [
        {
            type: "welcome",
            badgeText: "WELCOME TO",
            badgeTextEn: "WELCOME TO",
            logoImg: "assets/images/intro_slide_1_logo.png",
            title: "日本のホテルで\nはたらく未来のために\nいっしょに学ぼう。",
            titleEn: "Welcome to SHOSA\n\nLet's learn together\nfor a future working\nin Japanese hotels.",
            heroImg: "assets/images/intro_slide_1_hero.png",
            buttonLabel: "START",
            buttonLabelEn: "START"
        },
        {
            type: "features",
            title: "日本のホテルで働くための\nSkill・ConfidenceをGET！",
            titleEn: "Gain the Skills and Confidence\nto work in a Japanese hotel!",
            bodyLead: "SHOSA PASSPORTは、\n接客用語・Hospitality\nを学びながら、",
            bodyLeadEn: "SHOSA PASSPORT is an app where you\nlearn hotel service language and Hospitality,",
            bodySub: "あなたに合ったpositionや\n成長ポイントを見つけられる\nアプリケーションです。",
            bodySubEn: "while discovering the position that suits you\nand the areas where you can grow.",
            featuresJa: [
                "✓ AIチューター",
                "✓ ロールプレイ練習",
                "✓ ホテル接客トレーニング",
                "✓ 日本語応対学習"
            ],
            featuresEn: [
                "✓ AI Tutor",
                "✓ Role-play practice",
                "✓ Hotel service training",
                "✓ Japanese for guest service"
            ],
            heroImg: "assets/images/intro_slide_2_hero.png",
            buttonLabel: "NEXT",
            buttonLabelEn: "NEXT"
        },
        {
            type: "steps",
            title: "学ぶ→練習する→成長する",
            titleEn: "Learn → Practice → Grow",
            stepsJa: [
                "診断・・自分に合った学習方法を知る",
                "学習・・ホテル接客を学ぶ",
                "ロールプレイ・・AIと実践練習",
                "スコア化・・強みと課題をレポート"
            ],
            stepsEn: [
                "Assess: Find your best way to learn",
                "Learn: Hotel service",
                "Role-play: Practice with AI",
                "Scoring: Strengths & challenges"
            ],
            desc: "あなた専用の学習プランを作成し、\n苦手な部分をトレーニングします。",
            descEn: "We'll create your personal study plan\nand train you on your weak spots.",
            heroImg: "assets/images/intro_slide_3_hero.png",
            buttonLabel: "NEXT",
            buttonLabelEn: "NEXT"
        },
        {
            type: "certification",
            title: "学びを活かして、検定受験\n日本での就職をサポート",
            titleEn: "Take the exam and get\nsupport for jobs in Japan",
            reportLead: "検定の結果は、あなたの",
            reportLeadEn: "Your exam results become your Report on",
            badges: ["強み", "成長ログ", "向いている職種"],
            badgesEn: ["Strengths", "Growth log", "Best-fit roles"],
            reportTail: "をReport.",
            reportTailEn: "",
            desc: "学ぶだけではなく、「できる」を証明する。\nそれがSHOSAです。",
            descEn: "Don't just learn.\nProve what you can do.\nThat's SHOSA.",
            heroImg: "assets/images/intro_slide_4_hero.png",
            caption: "画像はイメージです",
            captionEn: "Image is for illustration purposes",
            buttonLabel: "START",
            buttonLabelEn: "START"
        }
    ],
    // 1h. ヒアリング（経験・目的・興味・不安の4問: Figma Frame 248 / CH0-08〜11）
    hearings: [
        {
            key: "touchpoint",
            label: "ヒアリング01",
            question: "これまでに経験した\n接客業を教えてね！",
            questionEn: "Tell me about the service jobs\nyou've done before!",
            options: [
                { label: "接客アルバイト", labelEn: "Part-time service job", icon: "assets/images/icon_service_part_time.png" },
                { label: "レストラン", labelEn: "Restaurant", icon: "assets/images/icon_restaurant.png" },
                { label: "ホテル", labelEn: "Hotel", icon: "assets/images/icon_hotel.png" },
                { label: "コールセンター", labelEn: "Call center", icon: "assets/images/icon_call_center.png" },
                { label: "未経験", labelEn: "No experience", icon: "assets/images/icon_beginner.png" }
            ]
        },
        {
            key: "purpose",
            label: "ヒアリング02",
            question: "日本でどんな働き方を\nしてみたい？",
            questionEn: "What kind of work would you\nlike to try in Japan?",
            options: [
                { label: "Front Deskに立ちたい", labelEn: "I want to work at the Front Desk", icon: "assets/images/icon_front_desk.png" },
                { label: "Housekeepingをしたい", labelEn: "I want to do Housekeeping", icon: "assets/images/icon_housekeeping.png" },
                { label: "Restaurant で働きたい", labelEn: "I want to work in a Restaurant", icon: "assets/images/icon_restaurant.png" },
                { label: "Back Officeで働きたい", labelEn: "I want to work in the Back Office", icon: "assets/images/figma/icon_back_office.svg" },
                { label: "優秀なホテリエになりたい", labelEn: "I want to be an excellent hotelier", icon: "assets/images/icon_restaurant_staff.png" },
                { label: "まだ決まってない", labelEn: "I haven't decided yet", icon: "assets/images/icon_undecided.png" }
            ]
        },
        {
            key: "interest",
            label: "ヒアリング03",
            question: "どんな接客に\n興味がある？",
            questionEn: "What kind of service\ninterests you?",
            options: [
                { label: "丁寧なおもてなし", labelEn: "Courteous Omotenashi", icon: "assets/images/figma/icon_hospitality.svg" },
                { label: "お客様との会話", labelEn: "Chatting with guests", icon: "assets/images/figma/icon_conversation.svg" },
                { label: "高級ホテルでの接客", labelEn: "Service at luxury hotels", icon: "assets/images/icon_hotel.png" },
                { label: "外国人対応", labelEn: "Serving international guests", icon: "assets/images/another-country-icon.png" },
                { label: "クレーム対応", labelEn: "Handling complaints", icon: "assets/images/figma/icon_complaint_handling.svg" },
                { label: "日本文化", labelEn: "Japanese culture", icon: "assets/images/figma/icon_japanese_culture.svg" }
            ]
        },
        {
            key: "concern",
            label: "ヒアリング04",
            question: "日本で働くことで\n不安なことはある？",
            questionEn: "Is there anything you're worried\nabout when working in Japan?",
            options: [
                { label: "敬語表現", labelEn: "Keigo (polite Japanese)", icon: "assets/images/figma/icon_honorific_language.svg" },
                { label: "クレーム表現", labelEn: "Phrases for handling complaints", icon: "assets/images/figma/icon_complaint_handling.svg" },
                { label: "日本文化の理解", labelEn: "Understanding Japanese culture", icon: "assets/images/figma/icon_japanese_culture.svg" },
                { label: "人間関係", labelEn: "Relationships at work", icon: "assets/images/figma/icon_human_relationships.svg" },
                { label: "間違えること", labelEn: "Making mistakes", icon: "assets/images/figma/icon_making_mistakes.svg" },
                { label: "その他", labelEn: "Other", icon: "assets/images/figma/icon_other.svg", hasInput: true }
            ]
        }
    ],
    // Q4フォローアップ内容
    q4Followup: {
        "敬語表現": {
            textJa: "接客で必要な敬語表現を一緒に身につけよう！",
            textEn: "Let's master the keigo you need for hospitality together!"
        },
        "クレーム表現": {
            textJa: "どのように対応したらいいか、的確に覚えよう！",
            textEn: "Learn exactly how to handle each situation!"
        },
        "クレーム対応": {
            textJa: "どのように対応したらいいか、的確に覚えよう！",
            textEn: "Learn exactly how to handle each situation!"
        },
        "日本文化の理解": {
            textJa: "バックヤードでの日本独自のルールも体験できるよ！",
            textEn: "Experience Japan's unique back-of-house rules, too!"
        },
        "日本文化": {
            textJa: "バックヤードでの日本独自のルールも体験できるよ！",
            textEn: "Experience Japan's unique back-of-house rules, too!"
        },
        "人間関係": {
            textJa: "シュミレーションやコラムで関係性作りを学ぼう！",
            textEn: "Learn to build relationships through simulations and columns!"
        },
        "間違えること": {
            textJa: "アプリ内でなら、安心して何度でも失敗できるよ◎",
            textEn: "In this app, you can make mistakes as many times as you like!"
        }
    },
    // 1i/1j. 適性診断 (Figma CH0-13 & CH0-14 全18問)
    aptitudeIntro: "各項目について、指定された\n5段階評価で回答してね。\n\n将来なりたい自分ではなく、\n現在のあなたに最も当てはまる\n選択肢を選んでください。",
    aptitudeIntroEn: "Answer each item using the\n5-point scale.\n\nChoose the option that fits\nyou best right now,\nnot the person you hope to become.",
    aptitudeQuestions: [
        {
            id: 1,
            dimension: "Hospitality",
            text: "困っている人を見ると、自分から声をかけたくなる。",
            textEn: "When I see someone in trouble, I want to speak up and help."
        },
        {
            id: 2,
            dimension: "ServiceMindset",
            text: "相手が安心できるように行動したいと思う。",
            textEn: "I want to act in ways that put others at ease."
        },
        {
            id: 3,
            dimension: "Adaptability",
            text: "予定が変わっても、あまり慌てない。",
            textEn: "I don't panic much when plans change."
        },
        {
            id: 4,
            dimension: "Adaptability",
            text: "急なお願いにも柔軟に対応できる方だと思う。",
            textEn: "I think I can flexibly handle sudden requests."
        },
        {
            id: 5,
            dimension: "StressTolerance",
            text: "忙しい状況でも落ち着いて行動できる。",
            textEn: "I can stay calm and act even when things are busy."
        },
        {
            id: 6,
            dimension: "StressTolerance",
            text: "失敗しても、すぐに気持ちを切り替えられる。",
            textEn: "Even after a mistake, I can quickly shift my mindset."
        },
        {
            id: 7,
            dimension: "Observation",
            text: "周りの人の様子の変化によく気づく。",
            textEn: "I often notice changes in the people around me."
        },
        {
            id: 8,
            dimension: "Observation",
            text: "自分の作業だけでなく、周囲の状況も自然と見ている。",
            textEn: "Beyond my own work, I naturally keep an eye on my surroundings."
        },
        {
            id: 9,
            dimension: "WorkplaceCulture",
            text: "自分のことだけでなく、その場全体の雰囲気を大切にしたい。",
            textEn: "I care about the atmosphere of the whole place, not just myself."
        },
        {
            id: 10,
            dimension: "WorkplaceCulture",
            text: "小さな声掛けや気配りは大切だと思う。",
            textEn: "I think small words of care and thoughtful gestures matter."
        },
        {
            id: 11,
            dimension: "Teamwork",
            text: "自分の仕事が終わっても、周りを手伝うことが多い。",
            textEn: "Even after finishing my own work, I often help others."
        },
        {
            id: 12,
            dimension: "Teamwork",
            text: "チーム全体がうまく回ることを大切にしたい。",
            textEn: "I want to make sure the whole team runs smoothly."
        },
        {
            id: 13,
            dimension: "Initiative",
            text: "分からないことは、自分から質問できる。",
            textEn: "When I don't understand something, I can ask questions on my own."
        },
        {
            id: 14,
            dimension: "Initiative",
            text: "必要だと思ったら、自分から行動する方だ。",
            textEn: "If I think something is needed, I take action on my own."
        },
        {
            id: 15,
            dimension: "StressTolerance",
            text: "嫌なことがあっても、表情や態度にはあまり出さない。",
            textEn: "Even when something upsets me, I rarely let it show."
        },
        {
            id: 16,
            dimension: "StressTolerance",
            text: "相手が感情的でも、自分は冷静でいられる。",
            textEn: "Even when someone is emotional, I can stay calm."
        },
        {
            id: 17,
            dimension: "MultiTasking",
            text: "複数の仕事を同時に進めることは苦にならない。",
            textEn: "I don't mind working on multiple tasks at once."
        },
        {
            id: 18,
            dimension: "MultiTasking",
            text: "優先順位を考えながら仕事を進めるのが得意だ。",
            textEn: "I'm good at prioritizing as I work."
        }
    ],
    // 1l. アバター・音声設定（アバター画像は未使用のため空配列）
    avatarOptions: [],
    voiceTypes: [
        { id: "A", label: "タイプA", rate: 1.0, pitch: 1.0 },
        { id: "B", label: "タイプB", rate: 0.9, pitch: 1.3 }
    ],
    // 1n. 学習スケジュール作成：時間帯の選択肢 (Figma iPhone 17 - 110)
    scheduleTimeOptions: [
        { id: "morning", label: "朝起きた後", icon: "assets/images/icon_time_morning.png" },
        { id: "lunch", label: "ランチタイム", icon: "assets/images/icon_time_lunch.png" },
        { id: "evening", label: "夕食前後", icon: "assets/images/icon_time_evening.png" },
        { id: "night", label: "寝る前", icon: "assets/images/icon_time_night.png" },
        { id: "other", label: "その他", icon: "assets/images/icon_time_other.png" }
    ],
    // 1p. 学習スケジュール作成：継続目標日数の選択肢
    scheduleStreakOptions: [3, 5, 14, 30],
    // 1k-2. YOUR JOURNEY (Figma CH0-18)
    journeySteps: [
        {
            step: 0,
            doorNumber: null,
            doorImg: "assets/images/journey_door_open.png",
            isOpen: true,
            isLocked: false,
            title: "✔︎ 自分を知る（適職診断）",
            desc: "適性診断で、あなたに合った職種を見つけましょう。",
            titleEn: "✔︎ Know yourself (Career Match)",
            descEn: "Take the aptitude test to find the role that suits you."
        },
        {
            step: 1,
            doorNumber: "101",
            doorImg: "assets/images/journey_door_101.png",
            isOpen: false,
            isLocked: true,
            lockImg: "assets/images/journey_lock_key.png",
            title: "✔︎ ホテルを知る",
            desc: "ホテルの仕事や基本的流れを学びましょう。",
            titleEn: "✔︎ Get to know hotels",
            descEn: "Learn about hotel work and its basic flow."
        },
        {
            step: 2,
            doorNumber: "201",
            doorImg: "assets/images/journey_door_201.png",
            isOpen: false,
            isLocked: true,
            lockImg: "assets/images/journey_lock_key.png",
            title: "✔︎ 仕事を体験し、自分の行動傾向を知る",
            desc: "職種を体験しながら、あなたの行動傾向を診断しましょう。",
            titleEn: "✔︎ Try the work, know your tendencies",
            descEn: "Experience each role while we assess your behavior tendencies."
        },
        {
            step: 3,
            doorNumber: "301",
            doorImg: "assets/images/journey_door_301.png",
            isOpen: false,
            isLocked: true,
            lockImg: "assets/images/journey_lock_key.png",
            title: "✔︎ 仕事を学ぶ",
            desc: "ホテルの仕事に必要な知識やマナーを体系的に学びましょう。",
            titleEn: "✔︎ Learn the work",
            descEn: "Systematically learn the knowledge and manners needed for hotel work."
        },
        {
            step: 4,
            doorNumber: "401",
            doorImg: "assets/images/journey_door_401.png",
            isOpen: false,
            isLocked: true,
            lockImg: "assets/images/journey_lock_key.png",
            title: "✔︎ 資格試験に挑戦する",
            desc: "学んだことを確認し、あなたの力を証明しましょう。",
            titleEn: "✔︎ Take the certification exam",
            descEn: "Review what you've learned and prove your abilities."
        }
    ],
    // 診断結果 5職種定義（Figma CH0-20 & 参考翻訳内容）
    roleResults: {
        "Front Desk": {
            key: "Front Desk",
            nameJa: "Front Desk",
            nameEn: "Front Desk",
            icon: "assets/images/icon_front_desk.png",
            traits: ["ServiceMindset", "MultiTasking", "StressTolerance"],
            score: "95%",
            strengthsJa: [
                "Service Mindset が高く、お客様への気配りを大切にできます。",
                "Multi-tasking が高く、複数のことを整理しながら対応できます。",
                "Stress Tolerance が高く、プレッシャーのかかる場面でも落ち着いて行動できます。"
            ],
            strengthsEn: [
                "Your Service Mindset is high, so you care about attending to guests.",
                "Your Multi-tasking is high, so you can organize and handle several things at once.",
                "Your Stress Tolerance is high, so you stay calm even in high-pressure moments."
            ]
        },
        "Bell & Door Services": {
            key: "Bell & Door Services",
            nameJa: "Bell & Door Services",
            nameEn: "Bell & Door Services",
            icon: "assets/images/icon_front_desk.png",
            traits: ["ServiceMindset", "Observation", "Initiative"],
            score: "94%",
            strengthsJa: [
                "Service Mindset が高く、お客様が安心できるように行動できます。",
                "Observation が高く、お客様や周囲の小さな変化に気づけます。",
                "Initiative が高く、必要なことを自分から考えて行動する力を活かせます。"
            ],
            strengthsEn: [
                "Your Service Mindset is high, so you act to put guests at ease.",
                "Your Observation is high, so you notice small changes in guests and their surroundings.",
                "Your Initiative is high, so you can make use of your ability to think and act on your own."
            ]
        },
        "Housekeeping": {
            key: "Housekeeping",
            nameJa: "Housekeeping",
            nameEn: "Housekeeping",
            icon: "assets/images/icon_housekeeping.png",
            traits: ["Observation", "Teamwork", "ServiceMindset"],
            score: "90%",
            strengthsJa: [
                "Observation が高く、客室や周囲の小さな変化に気づけます。",
                "Teamwork が高く、周囲と協力しながら仕事を進められます。",
                "Service Mindset が高く、お客様が快適に過ごせることを大切にできます。"
            ],
            strengthsEn: [
                "Your Observation is high, so you notice small changes in rooms and surroundings.",
                "Your Teamwork is high, so you work well with those around you.",
                "Your Service Mindset is high, so you care about making guests comfortable."
            ]
        },
        "Restaurant Service": {
            key: "Restaurant Service",
            nameJa: "Restaurant Service",
            nameEn: "Restaurant Service",
            icon: "assets/images/icon_restaurant.png",
            traits: ["ServiceMindset", "Adaptability", "MultiTasking"],
            score: "92%",
            strengthsJa: [
                "Service Mindset が高く、お客様への気配りを大切にできます。",
                "Adaptability が高く、状況の変化にも柔軟に対応できます。",
                "Multi-tasking が高く、忙しい場面でも複数の仕事を進められます。"
            ],
            strengthsEn: [
                "Your Service Mindset is high, so you care about attending to guests.",
                "Your Adaptability is high, so you respond flexibly when situations change.",
                "Your Multi-tasking is high, so you can juggle several tasks even when it's busy."
            ]
        },
        "Reservations": {
            key: "Reservations",
            nameJa: "Reservations",
            nameEn: "Reservations",
            icon: "assets/images/figma/icon_back_office.svg",
            traits: ["WorkplaceCulture", "Observation", "MultiTasking"],
            score: "89%",
            strengthsJa: [
                "Workplace Culture が高く、周囲との関わりや場の雰囲気を大切にできます。",
                "Observation が高く、予約情報などの小さな違いにも気づけます。",
                "Multi-tasking が高く、複数の情報を整理しながら仕事を進められます。"
            ],
            strengthsEn: [
                "Your Workplace Culture is high, so you value relationships and the atmosphere around you.",
                "Your Observation is high, so you notice small differences, such as in reservation details.",
                "Your Multi-tasking is high, so you can organize multiple pieces of information as you work."
            ]
        }
    },
    // 多言語翻訳辞書 (Figma EN切替)
    i18n: {
        ja: {
            title_subtitle: "Toward the future of working in Japan",
            title_app_name: "SHOSA",
            title_start_btn: "START",
            title_google_btn: "Googleで続ける",
            title_apple_btn: "Appleで続ける",
            title_phone_btn: "電話番号で続ける",
            title_continue_btn: "🏠 続きから（Day選択メニューへ）",
            title_reset_btn: "最初からやり直す（診断・登録情報もリセット）",
            langselect_bubble: "Please select<br>your language setting.",
            langselect_opt_ja: "Japanese",
            langselect_opt_en: "English",
            next: "NEXT",
            start: "START",
            greet_bubble: "はじめまして！SHOSAだよ。<br><br>学習をサポートするために<br>まずは君のことを教えてね。",
            schedule_intro_bubble: "次は学習スケジュールを<br>一緒に考えよう！",
            schedule_title: "学習スケジュール",
            schedule_bubble: "学習の時間を決めよう！<br>続けやすいタイミングを選んでね。",
            schedule_morning: "朝起きた後",
            schedule_lunch: "ランチタイム",
            schedule_evening: "夕食前後",
            schedule_night: "寝る前",
            schedule_other: "その他",
            notify_header: "この時間にお知らせします",
            notify_label: "お知らせ時間",
            time_wheel_title: "お知らせ時間を編集",
            time_wheel_submit: "設定を完了する",
            profile_intro_bubble: "あなたの<strong>プロフィール</strong>を<br>入力してね。",
            profile_title: "プロフィールを入力してください",
            gender_label: "性別",
            gender_male: "男性",
            gender_female: "女性",
            gender_other: "その他",
            name_label: "名前",
            name_placeholder: "あなたのお名前",
            name_help: "アプリ内でのあなたの名前です。<br>10文字以内でシンプルな名前を設定してください。",
            country_label: "出身国",
            country_placeholder: "選択してください",
            country_japan: "日本",
            country_vietnam: "ベトナム",
            country_myanmar: "ミャンマー",
            country_singapore: "シンガポール",
            country_indonesia: "インドネシア",
            country_nepal: "ネパール",
            country_philippines: "フィリピン",
            country_india: "インド",
            country_other: "その他",
            birthdate_label: "誕生日",
            birthdate_placeholder: "選択してください",
            journey_subtitle: "ホテルで働くための、あなたの学びの旅",
            journey_title: "YOUR JOURNEY",
            journey_start: "START",
            aptitude_intro_bubble: "各項目について、指定された<br><strong style=\"color: #715BE1; font-weight: 700;\">5段階評価</strong>で回答してね。<br><br>将来なりたい自分ではなく、<br><strong style=\"color: #715BE1; font-weight: 700;\">現在のあなた</strong>に最も当てはまる<br>選択肢を選んでください。",
            aptitude_likert_disagree: "そう思わない",
            aptitude_likert_agree: "とてもそう思う",
            aptitude_progress_prefix: "適性診断",
            ch19_badge: "適性診断完了！",
            ch19_unlocked: "1章：Omotenashi Mindset が<br>解放されました",
            ch19_desc1: "お疲れ様でした！<br>あなたの選択から、<br>あなたに合った職種を紹介します。",
            ch19_desc2: "「結果を見る」から確認してみよう！",
            ch19_btn: "結果を見る",
            result_badge: "適性診断 結果",
            result_recommend: "あなたにおすすめ",
            result_strengths_title: "あなたの強み",
            result_lock_msg: "2位以降を閲覧するには<br>1章を進めよう！",
            ch101_guide_badge: "101",
            ch101_guide_title: "1章：Omotenashi Mindset",
            ch101_guide_subtitle: "ホテルの一日に寄り添う「プロの思考と選択」",
            ch101_guide_p1: "「<span class=\"ch101-hl-purple\">おもてなし</span>」とは、特別な演出のことだけではありません。<br>それは、ゲストが言葉にする前に求めるものを察し、次の展開を先回りして準備する「<span class=\"ch101-hl-purple\">姿勢</span>」そのものです。",
            ch101_guide_p2: "この章では、あるホテルの1日をゲストの滞在体験を見ながら、日本の宿泊業の現場で求められる『<span class=\"ch101-hl-purple\">目配り・気配り・手配り</span>』の判断軸を身につけていきます。プロの<span class=\"ch101-hl-purple\">Omotenashi Mindset</span>をインストールしましょう！",
            ch101_correct_title: "正解！",
            ch101_result_explanation: "良い香り（A）も良かれと思いがちですが、強い香りはホテルの非日常感を損なうため、無香を保つ配慮（B）がプロの鉄則です。",
            ch101_bubble_text: "海外と日本では『香り』の感覚が違うんだ。プロが大切にする『無香』の意味、知ってる？",
            ch101_focus_btn: "SHOSA Focus",
            ch101_focus_title: "SHOSA FOCUS",
            ch101_focus_p1: "多くの国では、良い香水を身につけることは『相手を歓迎するマナー』とされます。",
            ch101_focus_p2: "しかし、日本のホテル現場では『無香（匂いを残さないこと）』が最高の身だしなみです。さまざまな文化を持つゲストが寛ぐ空間では、どんなに良い香りでも『刺激』になり得ます。",
            ch101_focus_p3: "自身の好みを抑え、空間の快適さを守る『引き算の配慮』がプロの基準です。",
            ch101_checklist_caption: "<span class=\"hl-purple\">「視覚・清潔感」</span>だけでなく<br><span class=\"hl-purple\">「嗅覚・無香」</span>までカバーする<br>プロの身だしなみチェックシート",
            ch101_complete_title: "1章 学習完了！",
            ch101_complete_unlocked: "2章：JOB診断 が解放されました",
            ch101_complete_desc: "プロの仕事を観察し、日本の宿泊業の現場で求められるOmotenashi Mindsetを体験することができました！",
            ch101_complete_review: "※いつでもホーム画面から全レッスンの振り返りが可能です"
        },
        en: {
            title_subtitle: "Toward the future of working in Japan",
            title_app_name: "SHOSA",
            title_start_btn: "START",
            title_google_btn: "Continue with Google",
            title_apple_btn: "Continue with Apple",
            title_phone_btn: "Continue with Phone Number",
            title_continue_btn: "🏠 Resume (Day Menu)",
            title_reset_btn: "Start Over (Reset Profile & Progress)",
            langselect_bubble: "Please select<br>your language setting.",
            langselect_opt_ja: "Japanese",
            langselect_opt_en: "English",
            next: "NEXT",
            start: "START",
            greet_bubble: "Nice to meet you! I'm SHOSA.<br><br>To help you learn,<br>first tell me a little about yourself.",
            schedule_intro_bubble: "Next, let's plan your<br>study schedule together!",
            schedule_title: "Study Schedule",
            schedule_bubble: "Let's choose your study time!<br>Pick a timing that's easy to keep up.",
            schedule_morning: "After waking up",
            schedule_lunch: "Lunchtime",
            schedule_evening: "Around dinner",
            schedule_night: "Before bed",
            schedule_other: "Other",
            notify_header: "We'll remind you at this time",
            notify_label: "Notify time",
            time_wheel_title: "Edit Notification Time",
            time_wheel_submit: "Done",
            profile_intro_bubble: "Please fill in<br>your <strong>profile</strong>.",
            profile_title: "Please enter your profile",
            gender_label: "Gender",
            gender_male: "Male",
            gender_female: "Female",
            gender_other: "Other",
            name_label: "Name",
            name_placeholder: "Your Name",
            name_help: "This is your name in the app.<br>Please choose a simple name of 10 characters or fewer.",
            country_label: "Country",
            country_placeholder: "Select",
            country_japan: "Japan",
            country_vietnam: "Vietnam",
            country_myanmar: "Myanmar",
            country_singapore: "Singapore",
            country_indonesia: "Indonesia",
            country_nepal: "Nepal",
            country_philippines: "Philippines",
            country_india: "India",
            country_other: "Other",
            birthdate_label: "Birthday",
            birthdate_placeholder: "Select",
            journey_subtitle: "Your learning journey to work in hotels",
            journey_title: "YOUR JOURNEY",
            journey_start: "START",
            aptitude_intro_bubble: "Answer each item using the<br><strong style=\"color: #715BE1; font-weight: 700;\">5-point scale</strong>.<br><br>Choose the option that fits<br><strong style=\"color: #715BE1; font-weight: 700;\">you best right now</strong>,<br>not the person you hope to become.",
            aptitude_likert_disagree: "Disagree",
            aptitude_likert_agree: "Agree",
            aptitude_progress_prefix: "Aptitude Test",
            ch19_badge: "Aptitude Test Complete!",
            ch19_unlocked: "Chapter 1: Omotenashi Mindset<br>has been unlocked",
            ch19_desc1: "Well done!<br>Based on your answers,<br>we'll introduce the roles that suit you.",
            ch19_desc2: "Tap “See Results” to check them out!",
            ch19_btn: "See Results",
            result_badge: "Aptitude Test Result",
            result_recommend: "Recommended for you",
            result_strengths_title: "Your strengths",
            result_lock_msg: "To view ranks 2 and below,<br>proceed to Chapter 1!",
            ch101_guide_badge: "101",
            ch101_guide_title: "Chapter 1: Omotenashi Mindset",
            ch101_guide_subtitle: "Follow a hotel day through a pro's thinking and choices",
            ch101_guide_p1: "<span class=\"ch101-hl-purple\">Omotenashi</span> isn't only about special touches.<br>It's an <span class=\"ch101-hl-purple\">attitude</span>: sensing what guests want before they say it, and preparing for what comes next.",
            ch101_guide_p2: "In this chapter, you'll follow one day at a hotel through the guest's stay experience and learn the judgment standards demanded on the floor of Japan's hospitality industry: <span class=\"ch101-hl-purple\">'mekubari, kikubari, tehaibari'</span> (watchful eyes, thoughtful care, and well-prepared arrangements). Let's install a pro's <span class=\"ch101-hl-purple\">Omotenashi Mindset</span>!",
            ch101_correct_title: "Correct!",
            ch101_result_explanation: "A nice scent (A) may seem considerate, but strong fragrance can spoil the hotel's special atmosphere. Staying fragrance-free (B) is the professional rule.",
            ch101_bubble_text: "Views on scent differ between countries and Japan. Do you know why pros go fragrance-free?",
            ch101_focus_btn: "SHOSA Focus",
            ch101_focus_title: "SHOSA FOCUS",
            ch101_focus_p1: "In many countries, wearing good perfume is seen as a way of welcoming others. In Japanese hotels, however, being fragrance-free (leaving no scent behind) is the highest standard of grooming. In a space where guests from many cultures relax, even a lovely fragrance can be an irritant. Setting aside your own preferences to protect the comfort of the space – this 'less-is-more' consideration – is the professional standard.",
            ch101_focus_p2: "",
            ch101_focus_p3: "",
            ch101_checklist_caption: "Professional grooming checklist covering not only<br><span class=\"hl-purple\">\"Visual Cleanliness\"</span> but also<br><span class=\"hl-purple\">\"Fragrance-Free Sense\"</span>",
            ch101_complete_title: "Chapter 1 Complete!",
            ch101_complete_unlocked: "Chapter 2: JOB Assessment has been unlocked",
            ch101_complete_desc: "You observed the work of pros and experienced the Omotenashi Mindset required in Japan's hospitality industry!",
            ch101_complete_review: "*You can review all lessons anytime from the Home screen"
        }
    },
    // ステータス表示（on/offで表示非表示切り替え）
    stats: {
        visible: false,
        items: [
            { icon: "🤝", label: "チーム度", value: 50 },
            { icon: "✨", label: "ゲスト安心", value: 50 }
        ]
    }
};
//# sourceMappingURL=onboarding_data.js.map