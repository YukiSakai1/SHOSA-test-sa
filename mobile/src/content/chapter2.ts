/**
 * 2章「Omotenashi Style 診断（JOB Simulation）」のコンテンツ。
 * 文言は Figma「２章：JOB Simulation」から。
 *
 * ⚠️ Figma にサンプルがあるのは Front Desk の「チェックイン開始」1シナリオ（3問）だけ。
 *    仕様では 1職種あたり 10シナリオ × 3問。シナリオは scenarios に追加すれば画面は自動で増える。
 * ⚠️ 各選択肢がどの行動傾向に当たるか（tendency）は、Figma に明記が無いため
 *    選択肢の文言から推定した（docs/mobile.md の QA 欄に記載）。
 * ⚠️ 「あなたの強み」「これから意識したいこと」は Figma に Communication の例文しか無いため、
 *    他の3つは同じ書き方で仮の文言を入れている（要確認）。英訳もすべて仮。
 */
import type { ImageKey } from '@/theme/images';
import type { Localized } from './types';

export type Tendency = 'Accuracy' | 'Efficiency' | 'Communication' | 'Hospitality';
export const TENDENCIES: Tendency[] = ['Accuracy', 'Efficiency', 'Communication', 'Hospitality'];

/** 4つの行動傾向（Figma CH2-05「日本のホテルで求められるスキル」） */
export const tendencyInfo: Record<Tendency, { emoji: string; label: Localized; desc: Localized; example: Localized }> = {
  Accuracy: {
    emoji: '🎯',
    label: { ja: '正確に扱う', en: 'Handle accurately' },
    desc: {
      ja: '間違いや漏れを防ぐために、確認・照合する力\n「間違えないために、どう行動する？」',
      en: 'The ability to check and verify to prevent errors and omissions\n"How do you act so you don\'t make mistakes?"',
    },
    example: { ja: '例：名前・人数・予約内容を確認する', en: 'e.g. Confirm the name, number of guests and booking details' },
  },
  Efficiency: {
    emoji: '⏰',
    label: { ja: '効率的に進める', en: 'Work efficiently' },
    desc: {
      ja: '仕事を滞らせないために優先順位を考える力\n「仕事を止めないために、どう進める？」',
      en: 'The ability to set priorities so work keeps flowing\n"How do you keep the work from stopping?"',
    },
    example: { ja: '例：混雑時に優先順位をつけて対応する', en: 'e.g. Prioritize tasks when it gets busy' },
  },
  Communication: {
    emoji: '👥',
    label: { ja: '認識を合わせる', en: 'Align understanding' },
    desc: {
      ja: '相手と正しく情報を共有するために、\n聞く・伝える・確認する力\n「認識を合わせるために、どう関わる？」',
      en: 'The ability to listen, explain and confirm\nso information is shared correctly\n"How do you engage to stay on the same page?"',
    },
    example: { ja: '例：お客様の希望を確認してから手配する', en: "e.g. Confirm the guest's wishes before arranging" },
  },
  Hospitality: {
    emoji: '❤️',
    label: { ja: '安心・快適をつくる', en: 'Create comfort' },
    desc: {
      ja: '相手が安心して心地よく過ごせるように、\n相手の状態を考えて行動する力\n「相手にとってよりよい状態にするために、どう動く？」',
      en: "The ability to act with the other person's state in mind\nso they feel safe and comfortable\n\"How do you act to make things better for them?\"",
    },
    example: { ja: '例：待っているお客様に待ち時間の目安を伝える', en: 'e.g. Tell waiting guests roughly how long it will take' },
  },
};

export interface ScenarioChoice {
  text: Localized;
  tendency: Tendency;
}

export interface ScenarioStep {
  situation: Localized;
  choices: ScenarioChoice[];
}

export interface Scenario {
  id: string;
  title: Localized;
  intro: Localized;
  scene: ImageKey;
  steps: ScenarioStep[];
}

export interface Role {
  id: string;
  name: string;
  tagline: Localized;
  card: ImageKey;
  /** この職種で求められる力の順位（Figma CH2-04 左列） */
  required: Tendency[];
  /** 1位の傾向ごとの「あなたの強み」 */
  strengths: Record<Tendency, Localized>;
  /** 「これから意識したいこと」（求められる1位の力についての助言） */
  advice: Localized;
  /** 1位の傾向ごとの Performance Profile の要約 */
  profileSummary: Record<Tendency, Localized>;
  recommendations: Localized[];
  scenarios: Scenario[];
}

const QUESTION_PROMPT: Localized = {
  ja: 'あなたなら、どのように対応しますか？\n次の中から最も近い行動を選んでください。',
  en: 'How would you respond?\nChoose the action closest to what you would do.',
};

export const chapter2 = {
  guide: {
    badgeNumber: '201',
    title: 'Omotenashi Style 診断',
    subtitle: { ja: '職種を体験しながら、あなたの行動傾向を診断', en: 'Try hotel roles and discover your behavioral tendencies' },
    note: { ja: 'ここでは正解を選ぶ必要はありません', en: "There are no right answers here" },
    body: {
      ja: 'ホテルの現場に入り、目の前のゲストや状況に対して「自分ならどうする？」を選んでみましょう。あなたが何を優先して行動するかを診断します。',
      en: 'Step onto the hotel floor and choose "What would I do?" for the guest or situation in front of you. We will assess what you prioritize when you act.',
    },
    resultsLead: { ja: 'あなたが優先する行動傾向を数値化', en: 'We score the tendencies you prioritize' },
    button: { ja: 'START', en: 'START' },
  },
  roles: {
    heading: 'ROLE Line Up',
    lead: {
      ja: 'どの職種から学習する？\n気になる職種やSCENEを選んで、\nホテルマンのスキルを学んでいこう！',
      en: 'Which role will you start with?\nPick a role or scene that interests you\nand learn the skills of a hotelier!',
    },
    jobsLabel: { ja: 'こんな仕事があります', en: 'Scenes in this role' },
    start: { ja: 'START', en: 'START' },
    back: { ja: 'ROLE選択に戻る', en: 'Back to roles' },
    resultTag: 'RESULT',
  },
  questionPrompt: QUESTION_PROMPT,
  scenarioComplete: {
    title: { ja: '{title}が\n完了しました！', en: '{title}\ncompleted!' },
    body: { ja: '次のScenarioに進みます。', en: 'On to the next Scenario.' },
    button: { ja: 'NEXT', en: 'NEXT' },
  },
  diagnosisComplete: {
    title: { ja: 'Omotenashi Style診断\n完了しました！', en: 'Omotenashi Style Assessment\ncompleted!' },
    body: { ja: '全てのScenarioを体験しました。\nあなたの行動傾向を診断します。', en: "You've experienced every Scenario.\nLet's assess your tendencies." },
    button: { ja: 'VIEW RESULTS', en: 'VIEW RESULTS' },
  },
  result: {
    title: { ja: '診断結果', en: 'Results' },
    lead: { ja: '{role}との相性を見てみよう', en: "Let's see how you fit {role}" },
    requiredLabel: { ja: '{role}で\n求められる力', en: 'What {role}\nrequires' },
    yoursLabel: { ja: 'あなたの行動傾向', en: 'Your tendencies' },
    strengthsLabel: { ja: '{role}でのあなたの強み', en: 'Your strengths in {role}' },
    tendencyLine: { ja: 'あなたは {t} を\n優先する傾向があります。', en: 'You tend to\nprioritize {t}.' },
    adviceLabel: { ja: 'これから意識したいこと', en: 'What to focus on next' },
    button: { ja: 'NEXT', en: 'NEXT' },
  },
  profile: {
    title: { ja: 'あなたの Performance Profile', en: 'Your Performance Profile' },
    featureLabel: { ja: 'あなたの行動傾向の特徴', en: 'Your tendencies' },
    nextLabel: { ja: '次に取り組むこと（おすすめ）', en: 'What to work on next (recommended)' },
    skillsTitle: { ja: '日本のホテルで\n求められるスキル', en: 'Skills required in\nJapanese hotels' },
    button: { ja: 'NEXT', en: 'NEXT' },
  },
  end: {
    title: { ja: '2章 {role}診断完了！', en: 'Chapter 2: {role} Assessment Complete!' },
    lead: { ja: 'ほかの職種も体験してみよう', en: 'Try other roles too' },
    body: {
      ja: '仕事が変わると、求められる力も変わります。\nほかの職種も体験して、自分の得意なことや\n向いている仕事を見つけてみましょう。',
      en: 'Different jobs require different strengths.\nTry other roles to discover what you are good at\nand which work suits you.',
    },
    nextChapter: { ja: 'NEXT CHAPTER', en: 'NEXT CHAPTER' },
    anotherRole: { ja: 'TRY ANOTHER ROLE', en: 'TRY ANOTHER ROLE' },
  },
};

export const roles: Role[] = [
  {
    id: 'front_desk',
    name: 'Front Desk',
    tagline: { ja: 'ホテルの「受付・案内役」', en: 'The hotel\'s "reception & guide"' },
    card: 'roleFrontDesk',
    required: ['Accuracy', 'Communication', 'Hospitality', 'Efficiency'],
    strengths: {
      // Figma の例文
      Communication: {
        ja: 'Front Deskでも、お客様の希望や状況を理解し、認識を合わせることは重要です。\n相手とのやり取りを大切にできることは、あなたの強みとして活かせそうです。',
        en: "At the Front Desk, understanding guests' wishes and aligning on details matters.\nValuing your interactions with guests can become a real strength.",
      },
      // 以下3つは仮の文言（要確認）
      Accuracy: {
        ja: 'Front Deskでは、予約内容や金額を正確に扱うことがとても重要です。\n確認を怠らない姿勢は、あなたの強みとして活かせそうです。',
        en: 'At the Front Desk, handling bookings and payments accurately is essential.\nYour habit of double-checking can become a real strength.',
      },
      Hospitality: {
        ja: 'Front Deskは、ゲストが最初に出会うホテルの顔です。\n相手の安心を考えて動けることは、あなたの強みとして活かせそうです。',
        en: 'The Front Desk is the first face guests meet.\nActing with their comfort in mind can become a real strength.',
      },
      Efficiency: {
        ja: 'Front Deskは、混雑時に多くの手続きを同時に進める場面があります。\n優先順位を考えて動けることは、あなたの強みとして活かせそうです。',
        en: 'The Front Desk often handles many procedures at once when busy.\nThinking in priorities can become a real strength.',
      },
    },
    advice: {
      ja: 'Front Deskでは、Accuracyも特に重要です。\n「確認する」「照合する」ことを意識しながら学ぶことで、あなたの強みに加えて、Front Deskに必要な力を身につけていきましょう。',
      en: 'Accuracy is especially important at the Front Desk.\nBy learning with "checking" and "verifying" in mind, you can build the skills the Front Desk needs on top of your strengths.',
    },
    profileSummary: {
      Hospitality: {
        ja: '相手の安心や負担を考えた行動を優先する傾向があります。\nゲストが迷わず、安心して過ごせるようにサポートする事を大切にしている傾向が見られました。一方で、正確性や効率性を意識することで、より安定した対応につながります。',
        en: "You tend to prioritize actions that consider others' comfort and burden.\nYou value supporting guests so they never feel lost. Paying attention to accuracy and efficiency will make your service even more stable.",
      },
      // 以下3つは仮の文言（要確認）
      Communication: {
        ja: '相手と情報をすり合わせる行動を優先する傾向があります。\nお客様の希望を確認しながら進める姿勢が見られました。一方で、効率性を意識することで、よりスムーズな対応につながります。',
        en: 'You tend to prioritize aligning information with others.\nYou move forward while confirming guests\' wishes. Paying attention to efficiency will make your service smoother.',
      },
      Accuracy: {
        ja: '間違いを防ぐための確認を優先する傾向があります。\n一つひとつ丁寧に確かめる姿勢が見られました。一方で、相手への声かけを意識することで、より安心感のある対応につながります。',
        en: 'You tend to prioritize checks that prevent mistakes.\nYou verify things carefully one by one. Speaking to guests more often will make them feel even more at ease.',
      },
      Efficiency: {
        ja: '仕事を滞らせない進め方を優先する傾向があります。\n全体の流れを考えて動く姿勢が見られました。一方で、確認や声かけを意識することで、より丁寧な対応につながります。',
        en: 'You tend to prioritize keeping work flowing.\nYou act with the overall flow in mind. Adding checks and words of care will make your service more attentive.',
      },
    },
    recommendations: [
      { ja: '業務を正確に進めるための確認ポイントを見直す', en: 'Review the checkpoints for doing tasks accurately' },
      { ja: '効率的に対応するための優先順位の考え方を学ぶ', en: 'Learn how to set priorities for efficient service' },
    ],
    scenarios: [
      {
        id: 'checkin',
        title: { ja: 'チェックイン開始', en: 'Check-in Begins' },
        intro: {
          ja: '14:00、チェックイン開始。\n複数組のゲストが到着し、\nフロント周辺が混み始めています。',
          en: "14:00 — check-in begins.\nSeveral groups of guests have arrived,\nand the front desk is getting busy.",
        },
        scene: 'roleFrontDesk',
        steps: [
          {
            situation: {
              ja: '14:00。フロントにゲストが到着しました。\nゲストは予約確認のためスマートフォンを手にしています。',
              en: '14:00. A guest arrives at the front desk,\nholding a smartphone to show the booking.',
            },
            choices: [
              { tendency: 'Hospitality', text: { ja: 'ゲストが不安なくチェックインを始められるよう、まず声をかけて手続きを案内する。', en: 'Greet the guest first and guide them so they can start check-in without worry.' } },
              { tendency: 'Communication', text: { ja: 'お客様に名前と予約内容を確認し、これからのチェックインの流れを伝える。', en: 'Confirm the name and booking, then explain how check-in will proceed.' } },
              { tendency: 'Efficiency', text: { ja: '予約確認書から必要な情報をまとめて確認し、手続きをスムーズに進める。', en: 'Check all the needed details from the confirmation at once to keep things moving.' } },
              { tendency: 'Accuracy', text: { ja: '予約内容を一つずつ確認し、間違いがないことを確かめてから手続きを進める。', en: 'Verify the booking item by item and proceed only once nothing is wrong.' } },
            ],
          },
          {
            situation: {
              ja: 'チェックインの手続きを進めています。\n予約内容を確認すると、朝食付きのプランであることが分かりました。\nお客様はまだホテルの施設やサービスについて詳しく知らない様子です。',
              en: "You're processing the check-in.\nThe booking turns out to include breakfast.\nThe guest doesn't seem to know much about the hotel's facilities yet.",
            },
            choices: [
              { tendency: 'Communication', text: { ja: '朝食の利用時間や場所、利用方法をお客様に伝え、認識を合わせる。', en: 'Explain breakfast hours, location and how to use it, so you are on the same page.' } },
              { tendency: 'Efficiency', text: { ja: 'チェックインに必要な手続きを優先して進め、スムーズに完了できるよう対応する。', en: 'Prioritize the required check-in steps so it finishes smoothly.' } },
              { tendency: 'Accuracy', text: { ja: '予約内容と朝食の付帯条件を確認し、間違いがないことを確かめてから正確に案内する。', en: 'Check the booking and breakfast conditions, then give accurate guidance.' } },
            ],
          },
          {
            situation: {
              ja: 'チェックインの手続きが終わりました。\nゲストは鍵を受け取り、これから客室へ向かいます。',
              en: 'Check-in is complete.\nThe guest has the key and is heading to the room.',
            },
            choices: [
              { tendency: 'Hospitality', text: { ja: 'ゲストが迷わず客室へ行けるよう、客室まで一緒に移動しながら案内する。', en: 'Walk the guest to the room so they never get lost.' } },
              { tendency: 'Communication', text: { ja: '客室までの行き方を伝え、エレベーターの場所や利用方法を案内する。', en: 'Explain the way to the room, where the elevators are and how to use them.' } },
              { tendency: 'Efficiency', text: { ja: '必要な案内をまとめて伝え、チェックイン対応を完了して次のお客様の対応に移る。', en: 'Give the key information at once, finish check-in and move on to the next guest.' } },
              { tendency: 'Accuracy', text: { ja: '鍵と客室番号を確認し、間違いがないことを確かめてから渡す。', en: 'Check the key and room number and hand them over only once correct.' } },
            ],
          },
        ],
      },
    ],
  },
];

export function findRole(id: string | string[] | undefined): Role | undefined {
  const v = Array.isArray(id) ? id[0] : id;
  return roles.find((r) => r.id === v);
}

/** "{role}" などの差し込み */
export function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '');
}
