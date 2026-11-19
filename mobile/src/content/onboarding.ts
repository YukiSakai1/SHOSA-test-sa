/**
 * 0章（オンボーディング）のコンテンツ。
 * 文言は Web版 src/onboarding_data.ts（index.html で表示される文言）に合わせている。
 * Figma と違う箇所は docs/design-qa.md を参照。
 */
import type {
  AptitudeQuestion,
  ChoiceOption,
  HearingQuestion,
  JourneyStep,
  Localized,
  RoleResult,
} from './types';

/* ---------- 言語選択（CH0-08） ---------- */
export const languageOptions: (ChoiceOption & { lang: 'ja' | 'en' })[] = [
  { id: 'ja', lang: 'ja', label: { ja: 'NORMAL JAPANESE', en: 'NORMAL JAPANESE' }, icon: { image: 'flagJapan' } },
  { id: 'en', lang: 'en', label: { ja: 'ENGLISH', en: 'ENGLISH' }, icon: { image: 'flagUsa' } },
];

/* ---------- イントロスライド（CH0-03〜06） ---------- */
export const intro = {
  welcome: {
    badge: { ja: 'WELCOME TO', en: 'WELCOME TO' },
    title: {
      ja: '日本のホテルで\nはたらく未来のために\nいっしょに学ぼう。',
      en: "Welcome to SHOSA\n\nLet's learn together\nfor a future working\nin Japanese hotels.",
    },
    button: { ja: 'START', en: 'START' },
  },
  features: {
    title: {
      ja: '日本のホテルで働くための\nSkill・ConfidenceをGET！',
      en: 'Gain the Skills and Confidence\nto work in a Japanese hotel!',
    },
    labels: [
      { ja: 'AIチューター', en: 'AI Tutor' },
      { ja: 'ロールプレイ\n練習', en: 'Role-play\npractice' },
      { ja: 'ホテル接客\nトレーニング', en: 'Hotel service\ntraining' },
      { ja: '日本語応対\n学習', en: 'Japanese for\nguest service' },
    ] as Localized[],
    lead: {
      // index.html と同じ位置で改行
      ja: 'SHOSA PASSPORTは、\n接客用語・Hospitality\nを学びながら、',
      en: 'SHOSA PASSPORT is an app where you\nlearn hotel service language and Hospitality,',
    },
    sub: {
      ja: 'あなたに合ったpositionや\n成長ポイントを見つけられる\nアプリケーションです。',
      en: 'while discovering the position that suits you\nand the areas where you can grow.',
    },
    button: { ja: 'NEXT', en: 'NEXT' },
  },
  steps: {
    title: { ja: '学ぶ→練習する→成長する', en: 'Learn → Practice → Grow' },
    items: [
      { head: { ja: '診断', en: 'Assess' }, body: { ja: '自分に合った学習方法を知る', en: 'Find your best way to learn' }, icon: 'stepIconAssess' },
      { head: { ja: '体験', en: 'Experience' }, body: { ja: 'ホテル接客を体験する', en: 'Hotel guest service' }, icon: 'stepIconExperience' },
      { head: { ja: '学習', en: 'Learn' }, body: { ja: '体系的にスキルを学ぶ', en: 'Systematically acquire skills' }, icon: 'stepIconLearn' },
      { head: { ja: 'スコア化', en: 'Scoring' }, body: { ja: '強みと課題をレポート', en: 'Strengths & challenges' }, icon: 'stepIconScore' },
    ] as const,
    desc: {
      ja: 'あなた専用の学習プランを作成し、\n苦手な部分をトレーニングします。',
      en: "We'll create your personal study plan\nand train you on your weak spots.",
    },
    button: { ja: 'NEXT', en: 'NEXT' },
  },
  certification: {
    title: {
      ja: '学びを活かして、検定受験\n日本での就職をサポート',
      en: 'Take the exam and get\nsupport for jobs in Japan',
    },
    caption: { ja: '画像はイメージです', en: 'Image is for illustration purposes' },
    reportLead: { ja: '検定の結果は、あなたの', en: 'Your exam results become your Report on' },
    badges: [
      { ja: '強み', en: 'Strengths' },
      { ja: '成長ログ', en: 'Growth log' },
      { ja: '向いている職種', en: 'Best-fit roles' },
    ] as Localized[],
    reportTail: { ja: 'をReport.', en: '' },
    desc: {
      ja: '学ぶだけではなく、「できる」を証明する。\nそれがSHOSAです。',
      en: "Don't just learn.\nProve what you can do.\nThat's SHOSA.",
    },
    button: { ja: 'START', en: 'START' },
  },
} as const;

export const introSlideCount = 4;

/* ---------- SHOSA のセリフ画面（CH0-07 / 20 / 15 / 13） ---------- */
export const talks = {
  greet: {
    lines: [
      { ja: 'はじめまして！SHOSAだよ。', en: "Nice to meet you! I'm SHOSA." },
      { ja: '学習をサポートするために\nまずは君のことを教えてね。', en: 'To help you learn,\nfirst tell me a little about yourself.' },
    ],
  },
  scheduleIntro: {
    lines: [{ ja: '次は学習スケジュールを\n一緒に考えよう！', en: "Next, let's plan your\nstudy schedule together!" }],
  },
  profileIntro: {
    // index.html：「プロフィール」だけ黒の太字
    lines: [{ ja: 'あなたの<hl>プロフィール</hl>を\n入力してね。', en: 'Please fill in\nyour <hl>profile</hl>.' }],
    highlight: 'bold',
  },
  aptitudeIntro: {
    // index.html と同じ位置で改行し、「5段階評価」「現在のあなた」を紫の太字にする
    lines: [
      { ja: '各項目について、指定された\n<hl>5段階評価</hl>で回答してね。', en: 'Answer each item using the\n<hl>5-point scale</hl>.' },
      {
        ja: '将来なりたい自分ではなく、\n<hl>現在のあなた</hl>に最も当てはまる\n選択肢を選んでください。',
        en: 'Choose the option that fits\n<hl>you best right now</hl>,\nnot the person you hope to become.',
      },
    ],
  },
} satisfies Record<string, { lines: Localized[]; highlight?: 'purple' | 'bold' }>;

/* ---------- ヒアリング（CH0-09〜11） ---------- */
export const hearings: HearingQuestion[] = [
  {
    key: 'experience',
    question: { ja: 'これまでに経験した\n接客業を教えてね！', en: "Tell me about the service jobs\nyou've done before!" },
    options: [
      { id: 'part_time', label: { ja: '接客アルバイト', en: 'Part-time service job' }, icon: { image: 'iconServicePartTime' } },
      { id: 'restaurant', label: { ja: 'レストラン', en: 'Restaurant' }, icon: { image: 'iconRestaurant' } },
      { id: 'hotel', label: { ja: 'ホテル', en: 'Hotel' }, icon: { image: 'iconHotel' } },
      { id: 'call_center', label: { ja: 'コールセンター', en: 'Call center' }, icon: { image: 'iconCallCenter' } },
      { id: 'none', label: { ja: '未経験', en: 'No experience' }, icon: { image: 'iconBeginner' } },
    ],
  },
  {
    key: 'workStyle',
    question: { ja: '日本でどんな働き方を\nしてみたい？', en: 'What kind of work would you\nlike to try in Japan?' },
    options: [
      { id: 'front_desk', label: { ja: 'Front Deskに立ちたい', en: 'I want to work at the Front Desk' }, icon: { image: 'iconFrontDesk' } },
      { id: 'housekeeping', label: { ja: 'Housekeepingをしたい', en: 'I want to do Housekeeping' }, icon: { image: 'iconHousekeeping' } },
      { id: 'restaurant', label: { ja: 'Restaurant で働きたい', en: 'I want to work in a Restaurant' }, icon: { image: 'iconRestaurant' } },
      { id: 'back_office', label: { ja: 'Back Officeで働きたい', en: 'I want to work in the Back Office' }, icon: { svg: 'backOffice' } },
      { id: 'hotelier', label: { ja: '優秀なホテリエになりたい', en: 'I want to be an excellent hotelier' }, icon: { image: 'iconRestaurantStaff' } },
      { id: 'undecided', label: { ja: 'まだ決まってない', en: "I haven't decided yet" }, icon: { image: 'iconUndecided' } },
    ],
  },
  {
    key: 'interest',
    question: { ja: 'どんな接客に\n興味がある？', en: 'What kind of service\ninterests you?' },
    options: [
      { id: 'omotenashi', label: { ja: '丁寧なおもてなし', en: 'Courteous Omotenashi' }, icon: { svg: 'hospitality' } },
      { id: 'conversation', label: { ja: 'お客様との会話', en: 'Chatting with guests' }, icon: { svg: 'conversation' } },
      { id: 'luxury', label: { ja: '高級ホテルでの接客', en: 'Service at luxury hotels' }, icon: { image: 'iconHotel' } },
      { id: 'foreign_guests', label: { ja: '外国人対応', en: 'Serving international guests' }, icon: { image: 'iconForeignGuests' } },
      { id: 'complaints', label: { ja: 'クレーム対応', en: 'Handling complaints' }, icon: { svg: 'complaintHandling' } },
      { id: 'culture', label: { ja: '日本文化', en: 'Japanese culture' }, icon: { svg: 'japaneseCulture' } },
    ],
  },
  {
    key: 'concern',
    question: { ja: '日本で働くことで\n不安なことはある？', en: "Is there anything you're worried\nabout when working in Japan?" },
    options: [
      { id: 'keigo', label: { ja: '敬語表現', en: 'Keigo (polite Japanese)' }, icon: { svg: 'honorificLanguage' } },
      { id: 'complaints', label: { ja: 'クレーム表現', en: 'Phrases for handling complaints' }, icon: { svg: 'complaintHandling' } },
      { id: 'culture', label: { ja: '日本文化の理解', en: 'Understanding Japanese culture' }, icon: { svg: 'japaneseCulture' } },
      { id: 'relationships', label: { ja: '人間関係', en: 'Relationships at work' }, icon: { svg: 'humanRelationships' } },
      { id: 'mistakes', label: { ja: '間違えること', en: 'Making mistakes' }, icon: { svg: 'makingMistakes' } },
      { id: 'other', label: { ja: 'その他', en: 'Other' }, icon: { svg: 'other' }, hasInput: true },
    ],
  },
];

/** 「その他」の自由入力の最大文字数（仕様未確定のため暫定値） */
export const OTHER_INPUT_MAX_LENGTH = 30;

/* ---------- 学習スケジュール（CH0-22） ---------- */
export const schedule = {
  question: { ja: '学習の時間を決めよう！\n続けやすいタイミングを選んでね。', en: "Let's choose your study time!\nPick a timing that's easy to keep up." },
  notifyLabel: { ja: 'お知らせ時間', en: 'Notify time' },
  editTitle: { ja: 'お知らせ時間を編集', en: 'Edit Notification Time' },
  submit: { ja: '設定を完了する', en: 'Done' },
  // M-38：時間帯を選ぶと、お知らせ時間が下の時刻に変わる（index.html の defaultTimes と同じ）。
  // 「その他」は変えない。ユーザーが時刻を自分で編集した後は、時間帯を選んでも変えない
  defaultTimes: { morning: '07:00', lunch: '12:30', evening: '18:00', night: '21:30' } as Record<string, string>,
  options: [
    { id: 'morning', label: { ja: '朝起きた後', en: 'After waking up' }, icon: { image: 'timeMorning' } },
    { id: 'lunch', label: { ja: 'ランチタイム', en: 'Lunchtime' }, icon: { image: 'timeLunch' } },
    { id: 'evening', label: { ja: '夕食前後', en: 'Around dinner' }, icon: { image: 'timeEvening' } },
    { id: 'night', label: { ja: '寝る前', en: 'Before bed' }, icon: { image: 'timeNight' } },
    { id: 'other', label: { ja: 'その他', en: 'Other' }, icon: { image: 'timeOther' } },
  ] satisfies ChoiceOption[],
  defaultTime: '10:30',
} as const;

/* ---------- プロフィール（CH0-16'） ---------- */
export const profileForm = {
  title: { ja: 'プロフィールを入力してください', en: 'Please enter your profile' },
  gender: {
    label: { ja: '性別', en: 'Gender' },
    options: [
      { id: 'male', label: { ja: '男性', en: 'Male' } },
      { id: 'female', label: { ja: '女性', en: 'Female' } },
      { id: 'other', label: { ja: 'その他', en: 'Other' } },
    ],
  },
  name: {
    label: { ja: '名前', en: 'Name' },
    placeholder: { ja: 'あなたのお名前', en: 'Your Name' },
    help: {
      ja: 'アプリ内でのあなたの名前です。\n10文字以内でシンプルな名前を設定してください。',
      en: 'This is your name in the app.\nPlease choose a simple name of 10 characters or fewer.',
    },
  },
  country: {
    label: { ja: '出身国', en: 'Country' },
    placeholder: { ja: '選択してください', en: 'Select' },
    options: [
      { id: 'JP', label: { ja: '日本', en: 'Japan' } },
      { id: 'VN', label: { ja: 'ベトナム', en: 'Vietnam' } },
      { id: 'MM', label: { ja: 'ミャンマー', en: 'Myanmar' } },
      { id: 'SG', label: { ja: 'シンガポール', en: 'Singapore' } },
      { id: 'ID', label: { ja: 'インドネシア', en: 'Indonesia' } },
      { id: 'NP', label: { ja: 'ネパール', en: 'Nepal' } },
      { id: 'PH', label: { ja: 'フィリピン', en: 'Philippines' } },
      { id: 'IN', label: { ja: 'インド', en: 'India' } },
      { id: 'OTHER', label: { ja: 'その他', en: 'Other' } },
    ],
  },
  birthday: {
    label: { ja: '誕生日', en: 'Birthday' },
    placeholder: { ja: '選択してください', en: 'Select' },
  },
} as const;

/* ---------- YOUR JOURNEY（CH0-18） ---------- */
export const journey = {
  title: 'YOUR JOURNEY',
  subtitle: { ja: 'ホテルで働くための、あなたの学びの旅', en: 'Your learning journey to work in hotels' },
  goal: { ja: 'GOAL', en: 'GOAL' },
  button: { ja: 'START', en: 'START' },
  /** 上から順（ゴール → スタート）に表示する */
  steps: [
    { doorNumber: '401', door: 'door401', locked: true, title: { ja: '資格試験に挑戦する', en: 'Take the certification exam' }, desc: { ja: '学んだことを確認し、\nあなたの力を証明しましょう。', en: "Review what you've learned\nand prove your abilities." } },
    { doorNumber: '301', door: 'door301', locked: true, title: { ja: '仕事を学ぶ', en: 'Learn the work' }, desc: { ja: 'ホテルの仕事に必要な知識や\nマナーを体系的に学びましょう。', en: 'Systematically learn the knowledge and\nmanners needed for hotel work.' } },
    { doorNumber: '201', door: 'door201', locked: true, title: { ja: '仕事を体験し、自分の行動傾向を知る', en: 'Try the work, know your tendencies' }, desc: { ja: '職種を体験しながら、\nあなたの行動傾向を診断しましょう。', en: 'Experience each role while we\nassess your behavior tendencies.' } },
    { doorNumber: '101', door: 'door101', locked: true, title: { ja: 'ホテルを知る', en: 'Get to know hotels' }, desc: { ja: 'ホテルの仕事や基本的流れを学びましょう。', en: 'Learn about hotel work and its basic flow.' } },
    { doorNumber: null, door: 'doorOpen', locked: false, title: { ja: '自分を知る（適職診断）', en: 'Know yourself (Career Match)' }, desc: { ja: '適性診断で、あなたに合った\n職種を見つけましょう。', en: 'Take the aptitude test to find\nthe role that suits you.' } },
  ] satisfies JourneyStep[],
} as const;

/* ---------- 適性診断（CH0-14） ---------- */
export const APTITUDE_PAGE_SIZE = 3;
export const aptitudeScale = {
  min: { ja: 'そう思わない', en: 'Disagree' },
  max: { ja: 'とてもそう思う', en: 'Agree' },
  /** 1（そう思わない）〜 5（とてもそう思う） */
  values: [1, 2, 3, 4, 5] as const,
};

export const aptitudeQuestions: AptitudeQuestion[] = [
  { id: 1, dimension: 'Hospitality', text: { ja: '困っている人を見ると、自分から声をかけたくなる。', en: 'When I see someone in trouble, I want to speak up and help.' } },
  { id: 2, dimension: 'ServiceMindset', text: { ja: '相手が安心できるように行動したいと思う。', en: 'I want to act in ways that put others at ease.' } },
  { id: 3, dimension: 'Adaptability', text: { ja: '予定が変わっても、あまり慌てない。', en: "I don't panic much when plans change." } },
  { id: 4, dimension: 'Adaptability', text: { ja: '急なお願いにも柔軟に対応できる方だと思う。', en: 'I think I can flexibly handle sudden requests.' } },
  { id: 5, dimension: 'StressTolerance', text: { ja: '忙しい状況でも落ち着いて行動できる。', en: 'I can stay calm and act even when things are busy.' } },
  { id: 6, dimension: 'StressTolerance', text: { ja: '失敗しても、すぐに気持ちを切り替えられる。', en: 'Even after a mistake, I can quickly shift my mindset.' } },
  { id: 7, dimension: 'Observation', text: { ja: '周りの人の様子の変化によく気づく。', en: 'I often notice changes in the people around me.' } },
  { id: 8, dimension: 'Observation', text: { ja: '自分の作業だけでなく、周囲の状況も自然と見ている。', en: 'Beyond my own work, I naturally keep an eye on my surroundings.' } },
  { id: 9, dimension: 'WorkplaceCulture', text: { ja: '自分のことだけでなく、その場全体の雰囲気を大切にしたい。', en: 'I care about the atmosphere of the whole place, not just myself.' } },
  { id: 10, dimension: 'WorkplaceCulture', text: { ja: '小さな声掛けや気配りは大切だと思う。', en: 'I think small words of care and thoughtful gestures matter.' } },
  { id: 11, dimension: 'Teamwork', text: { ja: '自分の仕事が終わっても、周りを手伝うことが多い。', en: 'Even after finishing my own work, I often help others.' } },
  { id: 12, dimension: 'Teamwork', text: { ja: 'チーム全体がうまく回ることを大切にしたい。', en: 'I want to make sure the whole team runs smoothly.' } },
  { id: 13, dimension: 'Initiative', text: { ja: '分からないことは、自分から質問できる。', en: "When I don't understand something, I can ask questions on my own." } },
  { id: 14, dimension: 'Initiative', text: { ja: '必要だと思ったら、自分から行動する方だ。', en: 'If I think something is needed, I take action on my own.' } },
  { id: 15, dimension: 'StressTolerance', text: { ja: '嫌なことがあっても、表情や態度にはあまり出さない。', en: 'Even when something upsets me, I rarely let it show.' } },
  { id: 16, dimension: 'StressTolerance', text: { ja: '相手が感情的でも、自分は冷静でいられる。', en: 'Even when someone is emotional, I can stay calm.' } },
  { id: 17, dimension: 'MultiTasking', text: { ja: '複数の仕事を同時に進めることは苦にならない。', en: "I don't mind working on multiple tasks at once." } },
  { id: 18, dimension: 'MultiTasking', text: { ja: '優先順位を考えながら仕事を進めるのが得意だ。', en: "I'm good at prioritizing as I work." } },
];

export const aptitudePageCount = Math.ceil(aptitudeQuestions.length / APTITUDE_PAGE_SIZE);

/* ---------- 診断結果（CH0-19 / CH0-20'） ---------- */
export const diagnosisComplete = {
  title: { ja: '適性診断 完了！', en: 'Aptitude Test Complete!' },
  unlocked: { ja: '1章：Omotenashi Mindset が\n解放されました', en: 'Chapter 1: Omotenashi Mindset\nhas been unlocked' },
  body: {
    ja: 'お疲れ様でした！\nあなたの選択から、\nあなたに合った職種を紹介します。',
    en: "Well done!\nBased on your answers,\nwe'll introduce the roles that suit you.",
  },
  hint: { ja: '「結果を見る」から確認してみよう！', en: 'Tap “See Results” to check them out!' },
  button: { ja: '結果を見る', en: 'See Results' },
} as const;

export const diagnosisResult = {
  title: { ja: '適性診断 結果', en: 'Aptitude Test Result' },
  heading: 'Recommended Job Types',
  subheading: { ja: 'あなたにおすすめ', en: 'Recommended for you' },
  strengthsLabel: { ja: 'あなたの強み', en: 'Your strengths' },
  lockedNote: { ja: '2位以降を閲覧するには\n1章を進めよう！', en: 'To view ranks 2 and below,\nproceed to Chapter 1!' },
  button: { ja: 'NEXT', en: 'NEXT' },
} as const;

export const roleResults: RoleResult[] = [
  {
    id: 'front_desk',
    name: 'Front Desk',
    icon: { image: 'iconFrontDesk' },
    traits: ['ServiceMindset', 'MultiTasking', 'StressTolerance'],
    strengths: [
      // Figma CH0-20' の文言
      { ja: 'Service Mindset が高く、\nお客様への気配りが得意です。', en: 'Your Service Mindset is high, so you are good at attending to guests.' },
      { ja: 'Multi-tasking が高く、\n忙しい環境でも落ち着いて対応できます。', en: 'Your Multi-tasking is high, so you can stay calm and handle things even in a busy environment.' },
      { ja: 'Stress Tolerance が高く、\nプレッシャーのかかる場面でも力を発揮できます。', en: 'Your Stress Tolerance is high, so you can perform well even in high-pressure moments.' },
    ],
  },
  {
    id: 'bell_door',
    name: 'Bell & Door Services',
    icon: { image: 'iconFrontDesk' },
    traits: ['ServiceMindset', 'Observation', 'Initiative'],
    strengths: [
      { ja: 'Service Mindset が高く、\nお客様が安心できるように行動できます。', en: 'Your Service Mindset is high, so you act to put guests at ease.' },
      { ja: 'Observation が高く、\nお客様や周囲の小さな変化に気づけます。', en: 'Your Observation is high, so you notice small changes in guests and their surroundings.' },
      { ja: 'Initiative が高く、\n必要なことを自分から考えて行動する力を活かせます。', en: 'Your Initiative is high, so you can make use of your ability to think and act on your own.' },
    ],
  },
  {
    id: 'housekeeping',
    name: 'Housekeeping',
    icon: { image: 'iconHousekeeping' },
    traits: ['Observation', 'Teamwork', 'ServiceMindset'],
    strengths: [
      { ja: 'Observation が高く、\n客室や周囲の小さな変化に気づけます。', en: 'Your Observation is high, so you notice small changes in rooms and surroundings.' },
      { ja: 'Teamwork が高く、\n周囲と協力しながら仕事を進められます。', en: 'Your Teamwork is high, so you work well with those around you.' },
      { ja: 'Service Mindset が高く、\nお客様が快適に過ごせることを大切にできます。', en: 'Your Service Mindset is high, so you care about making guests comfortable.' },
    ],
  },
  {
    id: 'restaurant',
    name: 'Restaurant Service',
    icon: { image: 'iconRestaurant' },
    traits: ['ServiceMindset', 'Adaptability', 'MultiTasking'],
    strengths: [
      { ja: 'Service Mindset が高く、\nお客様への気配りを大切にできます。', en: 'Your Service Mindset is high, so you care about attending to guests.' },
      { ja: 'Adaptability が高く、\n状況の変化にも柔軟に対応できます。', en: 'Your Adaptability is high, so you respond flexibly when situations change.' },
      { ja: 'Multi-tasking が高く、\n忙しい場面でも複数の仕事を進められます。', en: "Your Multi-tasking is high, so you can juggle several tasks even when it's busy." },
    ],
  },
  {
    id: 'reservations',
    name: 'Reservations',
    icon: { svg: 'backOffice' },
    traits: ['WorkplaceCulture', 'Observation', 'MultiTasking'],
    strengths: [
      { ja: 'Workplace Culture が高く、\n周囲との関わりや場の雰囲気を大切にできます。', en: 'Your Workplace Culture is high, so you value relationships and the atmosphere around you.' },
      { ja: 'Observation が高く、\n予約情報などの小さな違いにも気づけます。', en: 'Your Observation is high, so you notice small differences, such as in reservation details.' },
      { ja: 'Multi-tasking が高く、\n複数の情報を整理しながら仕事を進められます。', en: 'Your Multi-tasking is high, so you can organize multiple pieces of information as you work.' },
    ],
  },
];
