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
      title: "\u65E5\u672C\u306E\u30DB\u30C6\u30EB\u3067\n\u306F\u305F\u3089\u304F\u672A\u6765\u306E\u305F\u3081\u306B\n\u3044\u3063\u3057\u3087\u306B\u5B66\u307C\u3046\u3002",
      titleEn: "Welcome to SHOSA\n\nLet's learn together\nfor a future working\nin Japanese hotels.",
      heroImg: "assets/images/intro_slide_1_hero.png",
      buttonLabel: "START",
      buttonLabelEn: "START"
    },
    {
      type: "features",
      title: "\u65E5\u672C\u306E\u30DB\u30C6\u30EB\u3067\u50CD\u304F\u305F\u3081\u306E\nSkill\u30FBConfidence\u3092GET\uFF01",
      titleEn: "Gain the Skills and Confidence\nto work in a Japanese hotel!",
      bodyLead: "SHOSA PASSPORT\u306F\u3001\n\u63A5\u5BA2\u7528\u8A9E\u30FBHospitality\n\u3092\u5B66\u3073\u306A\u304C\u3089\u3001",
      bodyLeadEn: "SHOSA PASSPORT is an app where you\nlearn hotel service language and Hospitality,",
      bodySub: "\u3042\u306A\u305F\u306B\u5408\u3063\u305Fposition\u3084\n\u6210\u9577\u30DD\u30A4\u30F3\u30C8\u3092\u898B\u3064\u3051\u3089\u308C\u308B\n\u30A2\u30D7\u30EA\u30B1\u30FC\u30B7\u30E7\u30F3\u3067\u3059\u3002",
      bodySubEn: "while discovering the position that suits you\nand the areas where you can grow.",
      featuresJa: [
        "\u2713 AI\u30C1\u30E5\u30FC\u30BF\u30FC",
        "\u2713 \u30ED\u30FC\u30EB\u30D7\u30EC\u30A4\u7DF4\u7FD2",
        "\u2713 \u30DB\u30C6\u30EB\u63A5\u5BA2\u30C8\u30EC\u30FC\u30CB\u30F3\u30B0",
        "\u2713 \u65E5\u672C\u8A9E\u5FDC\u5BFE\u5B66\u7FD2"
      ],
      featuresEn: [
        "\u2713 AI Tutor",
        "\u2713 Role-play practice",
        "\u2713 Hotel service training",
        "\u2713 Japanese for guest service"
      ],
      heroImg: "assets/images/intro_slide_2_hero.png",
      buttonLabel: "NEXT",
      buttonLabelEn: "NEXT"
    },
    {
      type: "steps",
      title: "\u5B66\u3076\u2192\u7DF4\u7FD2\u3059\u308B\u2192\u6210\u9577\u3059\u308B",
      titleEn: "Learn \u2192 Practice \u2192 Grow",
      stepsJa: [
        "\u8A3A\u65AD\u30FB\u30FB\u81EA\u5206\u306B\u5408\u3063\u305F\u5B66\u7FD2\u65B9\u6CD5\u3092\u77E5\u308B",
        "\u5B66\u7FD2\u30FB\u30FB\u30DB\u30C6\u30EB\u63A5\u5BA2\u3092\u5B66\u3076",
        "\u30ED\u30FC\u30EB\u30D7\u30EC\u30A4\u30FB\u30FBAI\u3068\u5B9F\u8DF5\u7DF4\u7FD2",
        "\u30B9\u30B3\u30A2\u5316\u30FB\u30FB\u5F37\u307F\u3068\u8AB2\u984C\u3092\u30EC\u30DD\u30FC\u30C8"
      ],
      stepsEn: [
        "Assess: Find your best way to learn",
        "Learn: Hotel service",
        "Role-play: Practice with AI",
        "Scoring: Strengths & challenges"
      ],
      desc: "\u3042\u306A\u305F\u5C02\u7528\u306E\u5B66\u7FD2\u30D7\u30E9\u30F3\u3092\u4F5C\u6210\u3057\u3001\n\u82E6\u624B\u306A\u90E8\u5206\u3092\u30C8\u30EC\u30FC\u30CB\u30F3\u30B0\u3057\u307E\u3059\u3002",
      descEn: "We'll create your personal study plan\nand train you on your weak spots.",
      heroImg: "assets/images/intro_slide_3_hero.png",
      buttonLabel: "NEXT",
      buttonLabelEn: "NEXT"
    },
    {
      type: "certification",
      title: "\u5B66\u3073\u3092\u6D3B\u304B\u3057\u3066\u3001\u691C\u5B9A\u53D7\u9A13\n\u65E5\u672C\u3067\u306E\u5C31\u8077\u3092\u30B5\u30DD\u30FC\u30C8",
      titleEn: "Take the exam and get\nsupport for jobs in Japan",
      reportLead: "\u691C\u5B9A\u306E\u7D50\u679C\u306F\u3001\u3042\u306A\u305F\u306E",
      reportLeadEn: "Your exam results become your Report on",
      badges: ["\u5F37\u307F", "\u6210\u9577\u30ED\u30B0", "\u5411\u3044\u3066\u3044\u308B\u8077\u7A2E"],
      badgesEn: ["Strengths", "Growth log", "Best-fit roles"],
      reportTail: "\u3092Report.",
      reportTailEn: "",
      desc: "\u5B66\u3076\u3060\u3051\u3067\u306F\u306A\u304F\u3001\u300C\u3067\u304D\u308B\u300D\u3092\u8A3C\u660E\u3059\u308B\u3002\n\u305D\u308C\u304CSHOSA\u3067\u3059\u3002",
      descEn: "Don't just learn.\nProve what you can do.\nThat's SHOSA.",
      heroImg: "assets/images/intro_slide_4_hero.png",
      caption: "\u753B\u50CF\u306F\u30A4\u30E1\u30FC\u30B8\u3067\u3059",
      captionEn: "Image is for illustration purposes",
      buttonLabel: "START",
      buttonLabelEn: "START"
    }
  ],
  // 1h. ヒアリング（経験・目的・興味・不安の4問: Figma Frame 248 / CH0-08〜11）
  hearings: [
    {
      key: "touchpoint",
      label: "\u30D2\u30A2\u30EA\u30F3\u30B001",
      question: "\u3053\u308C\u307E\u3067\u306B\u7D4C\u9A13\u3057\u305F\n\u63A5\u5BA2\u696D\u3092\u6559\u3048\u3066\u306D\uFF01",
      questionEn: "Tell me about the service jobs\nyou've done before!",
      options: [
        { label: "\u63A5\u5BA2\u30A2\u30EB\u30D0\u30A4\u30C8", labelEn: "Part-time service job", icon: "assets/images/icon_service_part_time.png" },
        { label: "\u30EC\u30B9\u30C8\u30E9\u30F3", labelEn: "Restaurant", icon: "assets/images/icon_restaurant.png" },
        { label: "\u30DB\u30C6\u30EB", labelEn: "Hotel", icon: "assets/images/icon_hotel.png" },
        { label: "\u30B3\u30FC\u30EB\u30BB\u30F3\u30BF\u30FC", labelEn: "Call center", icon: "assets/images/icon_call_center.png" },
        { label: "\u672A\u7D4C\u9A13", labelEn: "No experience", icon: "assets/images/icon_beginner.png" }
      ]
    },
    {
      key: "purpose",
      label: "\u30D2\u30A2\u30EA\u30F3\u30B002",
      question: "\u65E5\u672C\u3067\u3069\u3093\u306A\u50CD\u304D\u65B9\u3092\n\u3057\u3066\u307F\u305F\u3044\uFF1F",
      questionEn: "What kind of work would you\nlike to try in Japan?",
      options: [
        { label: "Front Desk\u306B\u7ACB\u3061\u305F\u3044", labelEn: "I want to work at the Front Desk", icon: "assets/images/icon_front_desk.png" },
        { label: "Housekeeping\u3092\u3057\u305F\u3044", labelEn: "I want to do Housekeeping", icon: "assets/images/icon_housekeeping.png" },
        { label: "Restaurant \u3067\u50CD\u304D\u305F\u3044", labelEn: "I want to work in a Restaurant", icon: "assets/images/icon_restaurant.png" },
        { label: "Back Office\u3067\u50CD\u304D\u305F\u3044", labelEn: "I want to work in the Back Office", icon: "assets/images/figma/icon_back_office.svg" },
        { label: "\u512A\u79C0\u306A\u30DB\u30C6\u30EA\u30A8\u306B\u306A\u308A\u305F\u3044", labelEn: "I want to be an excellent hotelier", icon: "assets/images/icon_restaurant_staff.png" },
        { label: "\u307E\u3060\u6C7A\u307E\u3063\u3066\u306A\u3044", labelEn: "I haven't decided yet", icon: "assets/images/icon_undecided.png" }
      ]
    },
    {
      key: "interest",
      label: "\u30D2\u30A2\u30EA\u30F3\u30B003",
      question: "\u3069\u3093\u306A\u63A5\u5BA2\u306B\n\u8208\u5473\u304C\u3042\u308B\uFF1F",
      questionEn: "What kind of service\ninterests you?",
      options: [
        { label: "\u4E01\u5BE7\u306A\u304A\u3082\u3066\u306A\u3057", labelEn: "Courteous Omotenashi", icon: "assets/images/figma/icon_hospitality.svg" },
        { label: "\u304A\u5BA2\u69D8\u3068\u306E\u4F1A\u8A71", labelEn: "Chatting with guests", icon: "assets/images/figma/icon_conversation.svg" },
        { label: "\u9AD8\u7D1A\u30DB\u30C6\u30EB\u3067\u306E\u63A5\u5BA2", labelEn: "Service at luxury hotels", icon: "assets/images/icon_hotel.png" },
        { label: "\u5916\u56FD\u4EBA\u5BFE\u5FDC", labelEn: "Serving international guests", icon: "assets/images/another-country-icon.png" },
        { label: "\u30AF\u30EC\u30FC\u30E0\u5BFE\u5FDC", labelEn: "Handling complaints", icon: "assets/images/figma/icon_complaint_handling.svg" },
        { label: "\u65E5\u672C\u6587\u5316", labelEn: "Japanese culture", icon: "assets/images/figma/icon_japanese_culture.svg" }
      ]
    },
    {
      key: "concern",
      label: "\u30D2\u30A2\u30EA\u30F3\u30B004",
      question: "\u65E5\u672C\u3067\u50CD\u304F\u3053\u3068\u3067\n\u4E0D\u5B89\u306A\u3053\u3068\u306F\u3042\u308B\uFF1F",
      questionEn: "Is there anything you're worried\nabout when working in Japan?",
      options: [
        { label: "\u656C\u8A9E\u8868\u73FE", labelEn: "Keigo (polite Japanese)", icon: "assets/images/figma/icon_honorific_language.svg" },
        { label: "\u30AF\u30EC\u30FC\u30E0\u8868\u73FE", labelEn: "Phrases for handling complaints", icon: "assets/images/figma/icon_complaint_handling.svg" },
        { label: "\u65E5\u672C\u6587\u5316\u306E\u7406\u89E3", labelEn: "Understanding Japanese culture", icon: "assets/images/figma/icon_japanese_culture.svg" },
        { label: "\u4EBA\u9593\u95A2\u4FC2", labelEn: "Relationships at work", icon: "assets/images/figma/icon_human_relationships.svg" },
        { label: "\u9593\u9055\u3048\u308B\u3053\u3068", labelEn: "Making mistakes", icon: "assets/images/figma/icon_making_mistakes.svg" },
        { label: "\u305D\u306E\u4ED6", labelEn: "Other", icon: "assets/images/figma/icon_other.svg", hasInput: true }
      ]
    }
  ],
  // Q4フォローアップ内容
  q4Followup: {
    "\u656C\u8A9E\u8868\u73FE": {
      textJa: "\u63A5\u5BA2\u3067\u5FC5\u8981\u306A\u656C\u8A9E\u8868\u73FE\u3092\u4E00\u7DD2\u306B\u8EAB\u306B\u3064\u3051\u3088\u3046\uFF01",
      textEn: "Let's master the keigo you need for hospitality together!"
    },
    "\u30AF\u30EC\u30FC\u30E0\u8868\u73FE": {
      textJa: "\u3069\u306E\u3088\u3046\u306B\u5BFE\u5FDC\u3057\u305F\u3089\u3044\u3044\u304B\u3001\u7684\u78BA\u306B\u899A\u3048\u3088\u3046\uFF01",
      textEn: "Learn exactly how to handle each situation!"
    },
    "\u30AF\u30EC\u30FC\u30E0\u5BFE\u5FDC": {
      textJa: "\u3069\u306E\u3088\u3046\u306B\u5BFE\u5FDC\u3057\u305F\u3089\u3044\u3044\u304B\u3001\u7684\u78BA\u306B\u899A\u3048\u3088\u3046\uFF01",
      textEn: "Learn exactly how to handle each situation!"
    },
    "\u65E5\u672C\u6587\u5316\u306E\u7406\u89E3": {
      textJa: "\u30D0\u30C3\u30AF\u30E4\u30FC\u30C9\u3067\u306E\u65E5\u672C\u72EC\u81EA\u306E\u30EB\u30FC\u30EB\u3082\u4F53\u9A13\u3067\u304D\u308B\u3088\uFF01",
      textEn: "Experience Japan's unique back-of-house rules, too!"
    },
    "\u65E5\u672C\u6587\u5316": {
      textJa: "\u30D0\u30C3\u30AF\u30E4\u30FC\u30C9\u3067\u306E\u65E5\u672C\u72EC\u81EA\u306E\u30EB\u30FC\u30EB\u3082\u4F53\u9A13\u3067\u304D\u308B\u3088\uFF01",
      textEn: "Experience Japan's unique back-of-house rules, too!"
    },
    "\u4EBA\u9593\u95A2\u4FC2": {
      textJa: "\u30B7\u30E5\u30DF\u30EC\u30FC\u30B7\u30E7\u30F3\u3084\u30B3\u30E9\u30E0\u3067\u95A2\u4FC2\u6027\u4F5C\u308A\u3092\u5B66\u307C\u3046\uFF01",
      textEn: "Learn to build relationships through simulations and columns!"
    },
    "\u9593\u9055\u3048\u308B\u3053\u3068": {
      textJa: "\u30A2\u30D7\u30EA\u5185\u3067\u306A\u3089\u3001\u5B89\u5FC3\u3057\u3066\u4F55\u5EA6\u3067\u3082\u5931\u6557\u3067\u304D\u308B\u3088\u25CE",
      textEn: "In this app, you can make mistakes as many times as you like!"
    }
  },
  // 1i/1j. 適性診断 (Figma CH0-13 & CH0-14 全18問)
  aptitudeIntro: "\u5404\u9805\u76EE\u306B\u3064\u3044\u3066\u3001\u6307\u5B9A\u3055\u308C\u305F\n5\u6BB5\u968E\u8A55\u4FA1\u3067\u56DE\u7B54\u3057\u3066\u306D\u3002\n\n\u5C06\u6765\u306A\u308A\u305F\u3044\u81EA\u5206\u3067\u306F\u306A\u304F\u3001\n\u73FE\u5728\u306E\u3042\u306A\u305F\u306B\u6700\u3082\u5F53\u3066\u306F\u307E\u308B\n\u9078\u629E\u80A2\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002",
  aptitudeIntroEn: "Answer each item using the\n5-point scale.\n\nChoose the option that fits\nyou best right now,\nnot the person you hope to become.",
  aptitudeQuestions: [
    {
      id: 1,
      dimension: "Hospitality",
      text: "\u56F0\u3063\u3066\u3044\u308B\u4EBA\u3092\u898B\u308B\u3068\u3001\u81EA\u5206\u304B\u3089\u58F0\u3092\u304B\u3051\u305F\u304F\u306A\u308B\u3002",
      textEn: "When I see someone in trouble, I want to speak up and help."
    },
    {
      id: 2,
      dimension: "ServiceMindset",
      text: "\u76F8\u624B\u304C\u5B89\u5FC3\u3067\u304D\u308B\u3088\u3046\u306B\u884C\u52D5\u3057\u305F\u3044\u3068\u601D\u3046\u3002",
      textEn: "I want to act in ways that put others at ease."
    },
    {
      id: 3,
      dimension: "Adaptability",
      text: "\u4E88\u5B9A\u304C\u5909\u308F\u3063\u3066\u3082\u3001\u3042\u307E\u308A\u614C\u3066\u306A\u3044\u3002",
      textEn: "I don't panic much when plans change."
    },
    {
      id: 4,
      dimension: "Adaptability",
      text: "\u6025\u306A\u304A\u9858\u3044\u306B\u3082\u67D4\u8EDF\u306B\u5BFE\u5FDC\u3067\u304D\u308B\u65B9\u3060\u3068\u601D\u3046\u3002",
      textEn: "I think I can flexibly handle sudden requests."
    },
    {
      id: 5,
      dimension: "StressTolerance",
      text: "\u5FD9\u3057\u3044\u72B6\u6CC1\u3067\u3082\u843D\u3061\u7740\u3044\u3066\u884C\u52D5\u3067\u304D\u308B\u3002",
      textEn: "I can stay calm and act even when things are busy."
    },
    {
      id: 6,
      dimension: "StressTolerance",
      text: "\u5931\u6557\u3057\u3066\u3082\u3001\u3059\u3050\u306B\u6C17\u6301\u3061\u3092\u5207\u308A\u66FF\u3048\u3089\u308C\u308B\u3002",
      textEn: "Even after a mistake, I can quickly shift my mindset."
    },
    {
      id: 7,
      dimension: "Observation",
      text: "\u5468\u308A\u306E\u4EBA\u306E\u69D8\u5B50\u306E\u5909\u5316\u306B\u3088\u304F\u6C17\u3065\u304F\u3002",
      textEn: "I often notice changes in the people around me."
    },
    {
      id: 8,
      dimension: "Observation",
      text: "\u81EA\u5206\u306E\u4F5C\u696D\u3060\u3051\u3067\u306A\u304F\u3001\u5468\u56F2\u306E\u72B6\u6CC1\u3082\u81EA\u7136\u3068\u898B\u3066\u3044\u308B\u3002",
      textEn: "Beyond my own work, I naturally keep an eye on my surroundings."
    },
    {
      id: 9,
      dimension: "WorkplaceCulture",
      text: "\u81EA\u5206\u306E\u3053\u3068\u3060\u3051\u3067\u306A\u304F\u3001\u305D\u306E\u5834\u5168\u4F53\u306E\u96F0\u56F2\u6C17\u3092\u5927\u5207\u306B\u3057\u305F\u3044\u3002",
      textEn: "I care about the atmosphere of the whole place, not just myself."
    },
    {
      id: 10,
      dimension: "WorkplaceCulture",
      text: "\u5C0F\u3055\u306A\u58F0\u639B\u3051\u3084\u6C17\u914D\u308A\u306F\u5927\u5207\u3060\u3068\u601D\u3046\u3002",
      textEn: "I think small words of care and thoughtful gestures matter."
    },
    {
      id: 11,
      dimension: "Teamwork",
      text: "\u81EA\u5206\u306E\u4ED5\u4E8B\u304C\u7D42\u308F\u3063\u3066\u3082\u3001\u5468\u308A\u3092\u624B\u4F1D\u3046\u3053\u3068\u304C\u591A\u3044\u3002",
      textEn: "Even after finishing my own work, I often help others."
    },
    {
      id: 12,
      dimension: "Teamwork",
      text: "\u30C1\u30FC\u30E0\u5168\u4F53\u304C\u3046\u307E\u304F\u56DE\u308B\u3053\u3068\u3092\u5927\u5207\u306B\u3057\u305F\u3044\u3002",
      textEn: "I want to make sure the whole team runs smoothly."
    },
    {
      id: 13,
      dimension: "Initiative",
      text: "\u5206\u304B\u3089\u306A\u3044\u3053\u3068\u306F\u3001\u81EA\u5206\u304B\u3089\u8CEA\u554F\u3067\u304D\u308B\u3002",
      textEn: "When I don't understand something, I can ask questions on my own."
    },
    {
      id: 14,
      dimension: "Initiative",
      text: "\u5FC5\u8981\u3060\u3068\u601D\u3063\u305F\u3089\u3001\u81EA\u5206\u304B\u3089\u884C\u52D5\u3059\u308B\u65B9\u3060\u3002",
      textEn: "If I think something is needed, I take action on my own."
    },
    {
      id: 15,
      dimension: "StressTolerance",
      text: "\u5ACC\u306A\u3053\u3068\u304C\u3042\u3063\u3066\u3082\u3001\u8868\u60C5\u3084\u614B\u5EA6\u306B\u306F\u3042\u307E\u308A\u51FA\u3055\u306A\u3044\u3002",
      textEn: "Even when something upsets me, I rarely let it show."
    },
    {
      id: 16,
      dimension: "StressTolerance",
      text: "\u76F8\u624B\u304C\u611F\u60C5\u7684\u3067\u3082\u3001\u81EA\u5206\u306F\u51B7\u9759\u3067\u3044\u3089\u308C\u308B\u3002",
      textEn: "Even when someone is emotional, I can stay calm."
    },
    {
      id: 17,
      dimension: "MultiTasking",
      text: "\u8907\u6570\u306E\u4ED5\u4E8B\u3092\u540C\u6642\u306B\u9032\u3081\u308B\u3053\u3068\u306F\u82E6\u306B\u306A\u3089\u306A\u3044\u3002",
      textEn: "I don't mind working on multiple tasks at once."
    },
    {
      id: 18,
      dimension: "MultiTasking",
      text: "\u512A\u5148\u9806\u4F4D\u3092\u8003\u3048\u306A\u304C\u3089\u4ED5\u4E8B\u3092\u9032\u3081\u308B\u306E\u304C\u5F97\u610F\u3060\u3002",
      textEn: "I'm good at prioritizing as I work."
    }
  ],
  // 1l. アバター・音声設定（アバター画像は未使用のため空配列）
  avatarOptions: [],
  voiceTypes: [
    { id: "A", label: "\u30BF\u30A4\u30D7A", rate: 1, pitch: 1 },
    { id: "B", label: "\u30BF\u30A4\u30D7B", rate: 0.9, pitch: 1.3 }
  ],
  // 1n. 学習スケジュール作成：時間帯の選択肢 (Figma iPhone 17 - 110)
  scheduleTimeOptions: [
    { id: "morning", label: "\u671D\u8D77\u304D\u305F\u5F8C", icon: "assets/images/icon_time_morning.png" },
    { id: "lunch", label: "\u30E9\u30F3\u30C1\u30BF\u30A4\u30E0", icon: "assets/images/icon_time_lunch.png" },
    { id: "evening", label: "\u5915\u98DF\u524D\u5F8C", icon: "assets/images/icon_time_evening.png" },
    { id: "night", label: "\u5BDD\u308B\u524D", icon: "assets/images/icon_time_night.png" },
    { id: "other", label: "\u305D\u306E\u4ED6", icon: "assets/images/icon_time_other.png" }
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
      title: "\u2714\uFE0E \u81EA\u5206\u3092\u77E5\u308B\uFF08\u9069\u8077\u8A3A\u65AD\uFF09",
      desc: "\u9069\u6027\u8A3A\u65AD\u3067\u3001\u3042\u306A\u305F\u306B\u5408\u3063\u305F\u8077\u7A2E\u3092\u898B\u3064\u3051\u307E\u3057\u3087\u3046\u3002",
      titleEn: "\u2714\uFE0E Know yourself (Career Match)",
      descEn: "Take the aptitude test to find the role that suits you."
    },
    {
      step: 1,
      doorNumber: "101",
      doorImg: "assets/images/journey_door_101.png",
      isOpen: false,
      isLocked: true,
      lockImg: "assets/images/journey_lock_key.png",
      title: "\u2714\uFE0E \u30DB\u30C6\u30EB\u3092\u77E5\u308B",
      desc: "\u30DB\u30C6\u30EB\u306E\u4ED5\u4E8B\u3084\u57FA\u672C\u7684\u6D41\u308C\u3092\u5B66\u3073\u307E\u3057\u3087\u3046\u3002",
      titleEn: "\u2714\uFE0E Get to know hotels",
      descEn: "Learn about hotel work and its basic flow."
    },
    {
      step: 2,
      doorNumber: "201",
      doorImg: "assets/images/journey_door_201.png",
      isOpen: false,
      isLocked: true,
      lockImg: "assets/images/journey_lock_key.png",
      title: "\u2714\uFE0E \u4ED5\u4E8B\u3092\u4F53\u9A13\u3057\u3001\u81EA\u5206\u306E\u884C\u52D5\u50BE\u5411\u3092\u77E5\u308B",
      desc: "\u8077\u7A2E\u3092\u4F53\u9A13\u3057\u306A\u304C\u3089\u3001\u3042\u306A\u305F\u306E\u884C\u52D5\u50BE\u5411\u3092\u8A3A\u65AD\u3057\u307E\u3057\u3087\u3046\u3002",
      titleEn: "\u2714\uFE0E Try the work, know your tendencies",
      descEn: "Experience each role while we assess your behavior tendencies."
    },
    {
      step: 3,
      doorNumber: "301",
      doorImg: "assets/images/journey_door_301.png",
      isOpen: false,
      isLocked: true,
      lockImg: "assets/images/journey_lock_key.png",
      title: "\u2714\uFE0E \u4ED5\u4E8B\u3092\u5B66\u3076",
      desc: "\u30DB\u30C6\u30EB\u306E\u4ED5\u4E8B\u306B\u5FC5\u8981\u306A\u77E5\u8B58\u3084\u30DE\u30CA\u30FC\u3092\u4F53\u7CFB\u7684\u306B\u5B66\u3073\u307E\u3057\u3087\u3046\u3002",
      titleEn: "\u2714\uFE0E Learn the work",
      descEn: "Systematically learn the knowledge and manners needed for hotel work."
    },
    {
      step: 4,
      doorNumber: "401",
      doorImg: "assets/images/journey_door_401.png",
      isOpen: false,
      isLocked: true,
      lockImg: "assets/images/journey_lock_key.png",
      title: "\u2714\uFE0E \u8CC7\u683C\u8A66\u9A13\u306B\u6311\u6226\u3059\u308B",
      desc: "\u5B66\u3093\u3060\u3053\u3068\u3092\u78BA\u8A8D\u3057\u3001\u3042\u306A\u305F\u306E\u529B\u3092\u8A3C\u660E\u3057\u307E\u3057\u3087\u3046\u3002",
      titleEn: "\u2714\uFE0E Take the certification exam",
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
        "Service Mindset \u304C\u9AD8\u304F\u3001\u304A\u5BA2\u69D8\u3078\u306E\u6C17\u914D\u308A\u3092\u5927\u5207\u306B\u3067\u304D\u307E\u3059\u3002",
        "Multi-tasking \u304C\u9AD8\u304F\u3001\u8907\u6570\u306E\u3053\u3068\u3092\u6574\u7406\u3057\u306A\u304C\u3089\u5BFE\u5FDC\u3067\u304D\u307E\u3059\u3002",
        "Stress Tolerance \u304C\u9AD8\u304F\u3001\u30D7\u30EC\u30C3\u30B7\u30E3\u30FC\u306E\u304B\u304B\u308B\u5834\u9762\u3067\u3082\u843D\u3061\u7740\u3044\u3066\u884C\u52D5\u3067\u304D\u307E\u3059\u3002"
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
        "Service Mindset \u304C\u9AD8\u304F\u3001\u304A\u5BA2\u69D8\u304C\u5B89\u5FC3\u3067\u304D\u308B\u3088\u3046\u306B\u884C\u52D5\u3067\u304D\u307E\u3059\u3002",
        "Observation \u304C\u9AD8\u304F\u3001\u304A\u5BA2\u69D8\u3084\u5468\u56F2\u306E\u5C0F\u3055\u306A\u5909\u5316\u306B\u6C17\u3065\u3051\u307E\u3059\u3002",
        "Initiative \u304C\u9AD8\u304F\u3001\u5FC5\u8981\u306A\u3053\u3068\u3092\u81EA\u5206\u304B\u3089\u8003\u3048\u3066\u884C\u52D5\u3059\u308B\u529B\u3092\u6D3B\u304B\u305B\u307E\u3059\u3002"
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
        "Observation \u304C\u9AD8\u304F\u3001\u5BA2\u5BA4\u3084\u5468\u56F2\u306E\u5C0F\u3055\u306A\u5909\u5316\u306B\u6C17\u3065\u3051\u307E\u3059\u3002",
        "Teamwork \u304C\u9AD8\u304F\u3001\u5468\u56F2\u3068\u5354\u529B\u3057\u306A\u304C\u3089\u4ED5\u4E8B\u3092\u9032\u3081\u3089\u308C\u307E\u3059\u3002",
        "Service Mindset \u304C\u9AD8\u304F\u3001\u304A\u5BA2\u69D8\u304C\u5FEB\u9069\u306B\u904E\u3054\u305B\u308B\u3053\u3068\u3092\u5927\u5207\u306B\u3067\u304D\u307E\u3059\u3002"
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
        "Service Mindset \u304C\u9AD8\u304F\u3001\u304A\u5BA2\u69D8\u3078\u306E\u6C17\u914D\u308A\u3092\u5927\u5207\u306B\u3067\u304D\u307E\u3059\u3002",
        "Adaptability \u304C\u9AD8\u304F\u3001\u72B6\u6CC1\u306E\u5909\u5316\u306B\u3082\u67D4\u8EDF\u306B\u5BFE\u5FDC\u3067\u304D\u307E\u3059\u3002",
        "Multi-tasking \u304C\u9AD8\u304F\u3001\u5FD9\u3057\u3044\u5834\u9762\u3067\u3082\u8907\u6570\u306E\u4ED5\u4E8B\u3092\u9032\u3081\u3089\u308C\u307E\u3059\u3002"
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
        "Workplace Culture \u304C\u9AD8\u304F\u3001\u5468\u56F2\u3068\u306E\u95A2\u308F\u308A\u3084\u5834\u306E\u96F0\u56F2\u6C17\u3092\u5927\u5207\u306B\u3067\u304D\u307E\u3059\u3002",
        "Observation \u304C\u9AD8\u304F\u3001\u4E88\u7D04\u60C5\u5831\u306A\u3069\u306E\u5C0F\u3055\u306A\u9055\u3044\u306B\u3082\u6C17\u3065\u3051\u307E\u3059\u3002",
        "Multi-tasking \u304C\u9AD8\u304F\u3001\u8907\u6570\u306E\u60C5\u5831\u3092\u6574\u7406\u3057\u306A\u304C\u3089\u4ED5\u4E8B\u3092\u9032\u3081\u3089\u308C\u307E\u3059\u3002"
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
      title_google_btn: "Google\u3067\u7D9A\u3051\u308B",
      title_apple_btn: "Apple\u3067\u7D9A\u3051\u308B",
      title_phone_btn: "\u96FB\u8A71\u756A\u53F7\u3067\u7D9A\u3051\u308B",
      title_continue_btn: "\u{1F3E0} \u7D9A\u304D\u304B\u3089\uFF08Day\u9078\u629E\u30E1\u30CB\u30E5\u30FC\u3078\uFF09",
      title_reset_btn: "\u6700\u521D\u304B\u3089\u3084\u308A\u76F4\u3059\uFF08\u8A3A\u65AD\u30FB\u767B\u9332\u60C5\u5831\u3082\u30EA\u30BB\u30C3\u30C8\uFF09",
      langselect_bubble: "Please select<br>your language setting.",
      langselect_opt_ja: "Japanese",
      langselect_opt_en: "English",
      next: "NEXT",
      start: "START",
      greet_bubble: "\u306F\u3058\u3081\u307E\u3057\u3066\uFF01SHOSA\u3060\u3088\u3002<br><br>\u5B66\u7FD2\u3092\u30B5\u30DD\u30FC\u30C8\u3059\u308B\u305F\u3081\u306B<br>\u307E\u305A\u306F\u541B\u306E\u3053\u3068\u3092\u6559\u3048\u3066\u306D\u3002",
      schedule_intro_bubble: "\u6B21\u306F\u5B66\u7FD2\u30B9\u30B1\u30B8\u30E5\u30FC\u30EB\u3092<br>\u4E00\u7DD2\u306B\u8003\u3048\u3088\u3046\uFF01",
      schedule_title: "\u5B66\u7FD2\u30B9\u30B1\u30B8\u30E5\u30FC\u30EB",
      schedule_bubble: "\u5B66\u7FD2\u306E\u6642\u9593\u3092\u6C7A\u3081\u3088\u3046\uFF01<br>\u7D9A\u3051\u3084\u3059\u3044\u30BF\u30A4\u30DF\u30F3\u30B0\u3092\u9078\u3093\u3067\u306D\u3002",
      schedule_morning: "\u671D\u8D77\u304D\u305F\u5F8C",
      schedule_lunch: "\u30E9\u30F3\u30C1\u30BF\u30A4\u30E0",
      schedule_evening: "\u5915\u98DF\u524D\u5F8C",
      schedule_night: "\u5BDD\u308B\u524D",
      schedule_other: "\u305D\u306E\u4ED6",
      notify_header: "\u3053\u306E\u6642\u9593\u306B\u304A\u77E5\u3089\u305B\u3057\u307E\u3059",
      notify_label: "\u304A\u77E5\u3089\u305B\u6642\u9593",
      time_wheel_title: "\u304A\u77E5\u3089\u305B\u6642\u9593\u3092\u7DE8\u96C6",
      time_wheel_submit: "\u8A2D\u5B9A\u3092\u5B8C\u4E86\u3059\u308B",
      profile_intro_bubble: "\u3042\u306A\u305F\u306E<strong>\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB</strong>\u3092<br>\u5165\u529B\u3057\u3066\u306D\u3002",
      profile_title: "\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
      gender_label: "\u6027\u5225",
      gender_male: "\u7537\u6027",
      gender_female: "\u5973\u6027",
      gender_other: "\u305D\u306E\u4ED6",
      name_label: "\u540D\u524D",
      name_placeholder: "\u3042\u306A\u305F\u306E\u304A\u540D\u524D",
      name_help: "\u30A2\u30D7\u30EA\u5185\u3067\u306E\u3042\u306A\u305F\u306E\u540D\u524D\u3067\u3059\u3002<br>10\u6587\u5B57\u4EE5\u5185\u3067\u30B7\u30F3\u30D7\u30EB\u306A\u540D\u524D\u3092\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      country_label: "\u51FA\u8EAB\u56FD",
      country_placeholder: "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
      country_japan: "\u65E5\u672C",
      country_vietnam: "\u30D9\u30C8\u30CA\u30E0",
      country_myanmar: "\u30DF\u30E3\u30F3\u30DE\u30FC",
      country_singapore: "\u30B7\u30F3\u30AC\u30DD\u30FC\u30EB",
      country_indonesia: "\u30A4\u30F3\u30C9\u30CD\u30B7\u30A2",
      country_nepal: "\u30CD\u30D1\u30FC\u30EB",
      country_philippines: "\u30D5\u30A3\u30EA\u30D4\u30F3",
      country_india: "\u30A4\u30F3\u30C9",
      country_other: "\u305D\u306E\u4ED6",
      birthdate_label: "\u8A95\u751F\u65E5",
      birthdate_placeholder: "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
      journey_subtitle: "\u30DB\u30C6\u30EB\u3067\u50CD\u304F\u305F\u3081\u306E\u3001\u3042\u306A\u305F\u306E\u5B66\u3073\u306E\u65C5",
      journey_title: "YOUR JOURNEY",
      journey_start: "START",
      aptitude_intro_bubble: '\u5404\u9805\u76EE\u306B\u3064\u3044\u3066\u3001\u6307\u5B9A\u3055\u308C\u305F<br><strong style="color: #715BE1; font-weight: 700;">5\u6BB5\u968E\u8A55\u4FA1</strong>\u3067\u56DE\u7B54\u3057\u3066\u306D\u3002<br><br>\u5C06\u6765\u306A\u308A\u305F\u3044\u81EA\u5206\u3067\u306F\u306A\u304F\u3001<br><strong style="color: #715BE1; font-weight: 700;">\u73FE\u5728\u306E\u3042\u306A\u305F</strong>\u306B\u6700\u3082\u5F53\u3066\u306F\u307E\u308B<br>\u9078\u629E\u80A2\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002',
      aptitude_likert_disagree: "\u305D\u3046\u601D\u308F\u306A\u3044",
      aptitude_likert_agree: "\u3068\u3066\u3082\u305D\u3046\u601D\u3046",
      aptitude_progress_prefix: "\u9069\u6027\u8A3A\u65AD",
      ch19_badge: "\u9069\u6027\u8A3A\u65AD\u5B8C\u4E86\uFF01",
      ch19_unlocked: "1\u7AE0\uFF1AOmotenashi Mindset \u304C<br>\u89E3\u653E\u3055\u308C\u307E\u3057\u305F",
      ch19_desc1: "\u304A\u75B2\u308C\u69D8\u3067\u3057\u305F\uFF01<br>\u3042\u306A\u305F\u306E\u9078\u629E\u304B\u3089\u3001<br>\u3042\u306A\u305F\u306B\u5408\u3063\u305F\u8077\u7A2E\u3092\u7D39\u4ECB\u3057\u307E\u3059\u3002",
      ch19_desc2: "\u300C\u7D50\u679C\u3092\u898B\u308B\u300D\u304B\u3089\u78BA\u8A8D\u3057\u3066\u307F\u3088\u3046\uFF01",
      ch19_btn: "\u7D50\u679C\u3092\u898B\u308B",
      result_badge: "\u9069\u6027\u8A3A\u65AD \u7D50\u679C",
      result_recommend: "\u3042\u306A\u305F\u306B\u304A\u3059\u3059\u3081",
      result_strengths_title: "\u3042\u306A\u305F\u306E\u5F37\u307F",
      result_lock_msg: "2\u4F4D\u4EE5\u964D\u3092\u95B2\u89A7\u3059\u308B\u306B\u306F<br>1\u7AE0\u3092\u9032\u3081\u3088\u3046\uFF01",
      ch101_guide_badge: "101",
      ch101_guide_title: "1\u7AE0\uFF1AOmotenashi Mindset",
      ch101_guide_subtitle: "\u30DB\u30C6\u30EB\u306E\u4E00\u65E5\u306B\u5BC4\u308A\u6DFB\u3046\u300C\u30D7\u30ED\u306E\u601D\u8003\u3068\u9078\u629E\u300D",
      ch101_guide_p1: '\u300C<span class="ch101-hl-purple">\u304A\u3082\u3066\u306A\u3057</span>\u300D\u3068\u306F\u3001\u7279\u5225\u306A\u6F14\u51FA\u306E\u3053\u3068\u3060\u3051\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002<br>\u305D\u308C\u306F\u3001\u30B2\u30B9\u30C8\u304C\u8A00\u8449\u306B\u3059\u308B\u524D\u306B\u6C42\u3081\u308B\u3082\u306E\u3092\u5BDF\u3057\u3001\u6B21\u306E\u5C55\u958B\u3092\u5148\u56DE\u308A\u3057\u3066\u6E96\u5099\u3059\u308B\u300C<span class="ch101-hl-purple">\u59FF\u52E2</span>\u300D\u305D\u306E\u3082\u306E\u3067\u3059\u3002',
      ch101_guide_p2: '\u3053\u306E\u7AE0\u3067\u306F\u3001\u3042\u308B\u30DB\u30C6\u30EB\u306E1\u65E5\u3092\u30B2\u30B9\u30C8\u306E\u6EDE\u5728\u4F53\u9A13\u3092\u898B\u306A\u304C\u3089\u3001\u65E5\u672C\u306E\u5BBF\u6CCA\u696D\u306E\u73FE\u5834\u3067\u6C42\u3081\u3089\u308C\u308B\u300E<span class="ch101-hl-purple">\u76EE\u914D\u308A\u30FB\u6C17\u914D\u308A\u30FB\u624B\u914D\u308A</span>\u300F\u306E\u5224\u65AD\u8EF8\u3092\u8EAB\u306B\u3064\u3051\u3066\u3044\u304D\u307E\u3059\u3002\u30D7\u30ED\u306E<span class="ch101-hl-purple">Omotenashi Mindset</span>\u3092\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u3057\u307E\u3057\u3087\u3046\uFF01',
      ch101_correct_title: "\u6B63\u89E3\uFF01",
      ch101_result_explanation: "\u826F\u3044\u9999\u308A\uFF08A\uFF09\u3082\u826F\u304B\u308C\u3068\u601D\u3044\u304C\u3061\u3067\u3059\u304C\u3001\u5F37\u3044\u9999\u308A\u306F\u30DB\u30C6\u30EB\u306E\u975E\u65E5\u5E38\u611F\u3092\u640D\u306A\u3046\u305F\u3081\u3001\u7121\u9999\u3092\u4FDD\u3064\u914D\u616E\uFF08B\uFF09\u304C\u30D7\u30ED\u306E\u9244\u5247\u3067\u3059\u3002",
      ch101_bubble_text: "\u6D77\u5916\u3068\u65E5\u672C\u3067\u306F\u300E\u9999\u308A\u300F\u306E\u611F\u899A\u304C\u9055\u3046\u3093\u3060\u3002\u30D7\u30ED\u304C\u5927\u5207\u306B\u3059\u308B\u300E\u7121\u9999\u300F\u306E\u610F\u5473\u3001\u77E5\u3063\u3066\u308B\uFF1F",
      ch101_focus_btn: "SHOSA Focus",
      ch101_focus_title: "SHOSA FOCUS",
      ch101_focus_p1: "\u591A\u304F\u306E\u56FD\u3067\u306F\u3001\u826F\u3044\u9999\u6C34\u3092\u8EAB\u306B\u3064\u3051\u308B\u3053\u3068\u306F\u300E\u76F8\u624B\u3092\u6B53\u8FCE\u3059\u308B\u30DE\u30CA\u30FC\u300F\u3068\u3055\u308C\u307E\u3059\u3002",
      ch101_focus_p2: "\u3057\u304B\u3057\u3001\u65E5\u672C\u306E\u30DB\u30C6\u30EB\u73FE\u5834\u3067\u306F\u300E\u7121\u9999\uFF08\u5302\u3044\u3092\u6B8B\u3055\u306A\u3044\u3053\u3068\uFF09\u300F\u304C\u6700\u9AD8\u306E\u8EAB\u3060\u3057\u306A\u307F\u3067\u3059\u3002\u3055\u307E\u3056\u307E\u306A\u6587\u5316\u3092\u6301\u3064\u30B2\u30B9\u30C8\u304C\u5BDB\u3050\u7A7A\u9593\u3067\u306F\u3001\u3069\u3093\u306A\u306B\u826F\u3044\u9999\u308A\u3067\u3082\u300E\u523A\u6FC0\u300F\u306B\u306A\u308A\u5F97\u307E\u3059\u3002",
      ch101_focus_p3: "\u81EA\u8EAB\u306E\u597D\u307F\u3092\u6291\u3048\u3001\u7A7A\u9593\u306E\u5FEB\u9069\u3055\u3092\u5B88\u308B\u300E\u5F15\u304D\u7B97\u306E\u914D\u616E\u300F\u304C\u30D7\u30ED\u306E\u57FA\u6E96\u3067\u3059\u3002",
      ch101_checklist_caption: '<span class="hl-purple">\u300C\u8996\u899A\u30FB\u6E05\u6F54\u611F\u300D</span>\u3060\u3051\u3067\u306A\u304F<br><span class="hl-purple">\u300C\u55C5\u899A\u30FB\u7121\u9999\u300D</span>\u307E\u3067\u30AB\u30D0\u30FC\u3059\u308B<br>\u30D7\u30ED\u306E\u8EAB\u3060\u3057\u306A\u307F\u30C1\u30A7\u30C3\u30AF\u30B7\u30FC\u30C8',
      ch101_complete_title: "1\u7AE0 \u5B66\u7FD2\u5B8C\u4E86\uFF01",
      ch101_complete_unlocked: "2\u7AE0\uFF1AJOB\u8A3A\u65AD \u304C\u89E3\u653E\u3055\u308C\u307E\u3057\u305F",
      ch101_complete_desc: "\u30D7\u30ED\u306E\u4ED5\u4E8B\u3092\u89B3\u5BDF\u3057\u3001\u65E5\u672C\u306E\u5BBF\u6CCA\u696D\u306E\u73FE\u5834\u3067\u6C42\u3081\u3089\u308C\u308BOmotenashi Mindset\u3092\u4F53\u9A13\u3059\u308B\u3053\u3068\u304C\u3067\u304D\u307E\u3057\u305F\uFF01",
      ch101_complete_review: "\u203B\u3044\u3064\u3067\u3082\u30DB\u30FC\u30E0\u753B\u9762\u304B\u3089\u5168\u30EC\u30C3\u30B9\u30F3\u306E\u632F\u308A\u8FD4\u308A\u304C\u53EF\u80FD\u3067\u3059"
    },
    en: {
      title_subtitle: "Toward the future of working in Japan",
      title_app_name: "SHOSA",
      title_start_btn: "START",
      title_google_btn: "Continue with Google",
      title_apple_btn: "Continue with Apple",
      title_phone_btn: "Continue with Phone Number",
      title_continue_btn: "\u{1F3E0} Resume (Day Menu)",
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
      aptitude_intro_bubble: 'Answer each item using the<br><strong style="color: #715BE1; font-weight: 700;">5-point scale</strong>.<br><br>Choose the option that fits<br><strong style="color: #715BE1; font-weight: 700;">you best right now</strong>,<br>not the person you hope to become.',
      aptitude_likert_disagree: "Disagree",
      aptitude_likert_agree: "Agree",
      aptitude_progress_prefix: "Aptitude Test",
      ch19_badge: "Aptitude Test Complete!",
      ch19_unlocked: "Chapter 1: Omotenashi Mindset<br>has been unlocked",
      ch19_desc1: "Well done!<br>Based on your answers,<br>we'll introduce the roles that suit you.",
      ch19_desc2: "Tap \u201CSee Results\u201D to check them out!",
      ch19_btn: "See Results",
      result_badge: "Aptitude Test Result",
      result_recommend: "Recommended for you",
      result_strengths_title: "Your strengths",
      result_lock_msg: "To view ranks 2 and below,<br>proceed to Chapter 1!",
      ch101_guide_badge: "101",
      ch101_guide_title: "Chapter 1: Omotenashi Mindset",
      ch101_guide_subtitle: "Follow a hotel day through a pro's thinking and choices",
      ch101_guide_p1: `<span class="ch101-hl-purple">Omotenashi</span> isn't only about special touches.<br>It's an <span class="ch101-hl-purple">attitude</span>: sensing what guests want before they say it, and preparing for what comes next.`,
      ch101_guide_p2: `In this chapter, you'll follow one day at a hotel through the guest's stay experience and learn the judgment standards demanded on the floor of Japan's hospitality industry: <span class="ch101-hl-purple">'mekubari, kikubari, tehaibari'</span> (watchful eyes, thoughtful care, and well-prepared arrangements). Let's install a pro's <span class="ch101-hl-purple">Omotenashi Mindset</span>!`,
      ch101_correct_title: "Correct!",
      ch101_result_explanation: "A nice scent (A) may seem considerate, but strong fragrance can spoil the hotel's special atmosphere. Staying fragrance-free (B) is the professional rule.",
      ch101_bubble_text: "Views on scent differ between countries and Japan. Do you know why pros go fragrance-free?",
      ch101_focus_btn: "SHOSA Focus",
      ch101_focus_title: "SHOSA FOCUS",
      ch101_focus_p1: "In many countries, wearing good perfume is seen as a way of welcoming others. In Japanese hotels, however, being fragrance-free (leaving no scent behind) is the highest standard of grooming. In a space where guests from many cultures relax, even a lovely fragrance can be an irritant. Setting aside your own preferences to protect the comfort of the space \u2013 this 'less-is-more' consideration \u2013 is the professional standard.",
      ch101_focus_p2: "",
      ch101_focus_p3: "",
      ch101_checklist_caption: 'Professional grooming checklist covering not only<br><span class="hl-purple">"Visual Cleanliness"</span> but also<br><span class="hl-purple">"Fragrance-Free Sense"</span>',
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
      { icon: "\u{1F91D}", label: "\u30C1\u30FC\u30E0\u5EA6", value: 50 },
      { icon: "\u2728", label: "\u30B2\u30B9\u30C8\u5B89\u5FC3", value: 50 }
    ]
  }
};
