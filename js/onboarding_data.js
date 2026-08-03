/* =========================================================
   ONBOARDING DATA — 「0章」登録〜SHOSAパスポート完成までの
   コンテンツ定義。シナリオ担当の人はこのファイルだけ編集すればOK。
   ========================================================= */
const ONBOARDING_DATA = {

  // 1c. 日本語レベル確認（SHOSA Ready CHECK）
  japaneseLevels: [
    "日本語をはじめて学んでいる",
    "よく使う言葉はわかる",
    "簡単な会話ができる",
    "いろいろな話題について話せる",
    "ほとんどの話題について詳しく話せる",
    "接客の日本語を使った経験がある"
  ],

  // 1d/1e. 言語表示設定
  languageOptions: [
    { id: "normal", icon: "🇯🇵", label: "normal Japanese" },
    { id: "easy", icon: "🌱", label: "easy Japanese" },
    { id: "hiragana", icon: "あ", label: "All in hiragana" },
    { id: "english", icon: "🇬🇧", label: "English" }
  ],

  // 1f. キャラクター紹介カルーセル（4枚）
  introSlides: [
    {
      type: "collage",
      title: "Welcome to SHOSA",
      text: "日本のホテルで\nはたらく未来のために\nいっしょに学ぼう。"
    },
    {
      type: "checklist",
      title: "日本のホテルで働くための\nSkill・ConfidenceをGET！",
      images: 3,
      body: "SHOSA PASSPORTは、\n接客用語・Hospitalityを学びながら、\nあなたに合ったpositionや\n成長ポイントを見つけられる\nアプリケーションです。",
      checklist: ["AIチューター", "ロールプレイ練習", "ホテル接客トレーニング", "日本語応対学習"]
    },
    {
      type: "steps",
      title: "学ぶ→練習する→成長する",
      steps: [
        { label: "診断", desc: "自分に合った学習方法を知る" },
        { label: "学習", desc: "ホテル接客を学ぶ" },
        { label: "ロールプレイ", desc: "AIと実践練習" },
        { label: "スコア化", desc: "強みと課題をレポート" }
      ],
      footer: "あなた専用の学習プランを作成し、苦手な部分をトレーニングします。",
      avatarLabel: "AIチューター キャラクター"
    },
    {
      type: "certification",
      title: "学びを活かして、検定受験\n日本での就職をサポート",
      checklist: ["強み", "成長ログ", "向いている職種 を Report."],
      footer: "学ぶだけではなく、「できる」を証明する。それがSHOSAです。",
      buttonLabel: "START"
    }
  ],

  // 1h. ヒアリング（経験・目的・興味・不安の4問）
  hearings: [
    { key: "touchpoint", label: "ヒアリング01", question: "これまでに経験した接客業を教えてね！",
      options: ["接客アルバイト", "レストラン", "ホテル", "コールセンター", "バックオフィス", "未経験"] },
    { key: "purpose", label: "ヒアリング02", question: "日本でどんな働き方をしてみたい？",
      options: ["フロントデスクに立ちたい", "ハウスキーピングをしたい", "レストランで働きたい", "優秀なホテリエになりたい", "バックオフィスで働きたい", "まだ決まってない"] },
    { key: "interest", label: "ヒアリング03", question: "どんな接客に興味がある？",
      options: ["丁寧なおもてなし", "お客様との会話", "高級ホテルでの接客", "外国人対応", "クレーム対応", "日本文化"] },
    { key: "concern", label: "ヒアリング04", question: "日本で働くことで不安なことはある？",
      options: ["敬語表現", "クレーム対応", "日本文化", "人間関係", "面接対策", "間違えること"] }
  ],

  // 1i/1j. 適性診断
  aptitudeIntro: "各項目について、指定された5段階評価で回答してね。将来なりたい自分ではなく、現在のあなたに最も当てはまる選択肢を選んでください。",
  aptitudeQuestions: [
    { dimension: "Hospitality", text: "困っている人を見ると、気になりますか？" },
    { dimension: "Judgement", text: "忙しいときでも、落ち着いて行動できますか？" },
    { dimension: "Observation", text: "新しいルールや文化に、慣れるのは早い方ですか？" },
    { dimension: "Communication", text: "チームで協力する仕事は好きですか？" },
    { dimension: "Accuracy", text: "細かい作業でも、ミスなく正確にこなせる方ですか？" }
  ],

  // 1l. アバター・音声設定（アップロードされたキャラクター画像を使用）
  avatarOptions: [
    { id: "female_01", path: "assets/images/avatars/staff_female_01.jpg" },
    { id: "male_01", path: "assets/images/avatars/staff_male_01.jpg" },
    { id: "male_02", path: "assets/images/avatars/staff_male_02.jpg" },
    { id: "male_03", path: "assets/images/avatars/staff_male_03.jpg" },
    { id: "female_02", path: "assets/images/avatars/staff_female_02.jpg" },
    { id: "female_03", path: "assets/images/avatars/staff_female_03.jpg" }
  ],
  voiceTypes: [
    { id: "A", label: "タイプA", rate: 1.0, pitch: 1.0 },
    { id: "B", label: "タイプB", rate: 0.9, pitch: 1.3 }
  ],

  // 1n. 学習スケジュール作成：時間帯の選択肢
  scheduleTimeOptions: [
    { id: "morning", label: "朝起きた後" },
    { id: "lunch", label: "ランチタイム" },
    { id: "evening", label: "夕食前後" },
    { id: "night", label: "寝る前" },
    { id: "other", label: "その他" }
  ],

  // 1p. 学習スケジュール作成：継続目標日数の選択肢
  scheduleStreakOptions: [3, 5, 14, 30]
};
