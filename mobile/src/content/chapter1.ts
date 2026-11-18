/**
 * 第1章「Omotenashi Mindset」のシナリオデータ。
 * Web版 src/game_data.ts の CH1_DATA を Localized 形式に移したもの。
 * レッスンを増やすときは lessons に1件足すだけでよい（画面側の変更は不要）。
 */
import type { Chapter1Data } from './types';

export const chapter1: Chapter1Data = {
  guide: {
    badgeNumber: '101',
    title: { ja: 'Omotenashi Mindset', en: 'Omotenashi Mindset' },
    subtitle: {
      ja: 'ホテルの一日に寄り添う「プロの思考と選択」',
      en: "Follow a hotel day through a pro's thinking and choices",
    },
    paragraphs: [
      {
        ja: '「<hl>おもてなし</hl>」とは、特別な演出のことだけではありません。\nそれは、ゲストが言葉にする前に求めるものを察し、次の展開を先回りして準備する「<hl>姿勢</hl>」そのものです。',
        en: "<hl>Omotenashi</hl> isn't only about special touches.\nIt's an <hl>attitude</hl>: sensing what guests want before they say it, and preparing for what comes next.",
      },
      {
        ja: 'この章では、あるホテルの1日をゲストの滞在体験を見ながら、日本の宿泊業の現場で求められる『<hl>目配り・気配り・手配り</hl>』の判断軸を身につけていきます。プロの<hl>Omotenashi Mindset</hl>をインストールしましょう！',
        en: "In this chapter, you'll follow one day at a hotel through the guest's stay experience and learn the judgment standards demanded on the floor of Japan's hospitality industry: <hl>'mekubari, kikubari, tehaibari'</hl> (watchful eyes, thoughtful care, and well-prepared arrangements). Let's install a pro's <hl>Omotenashi Mindset</hl>!",
      },
    ],
    button: { ja: 'START', en: 'START' },
  },
  end: {
    title: { ja: '1章 学習完了！', en: 'Chapter 1 Complete!' },
    // Figma CH1-END の文言（Web版は「2章：JOB診断」だった）
    unlockLabel: { ja: '2章：Omotenashi Style診断 が\n解放されました', en: 'Chapter 2: Omotenashi Style Assessment\nhas been unlocked' },
    body: {
      // index.html と同じ位置で改行
      ja: 'プロの仕事を観察し、\n日本の宿泊業の現場で求められる\nOmotenashi Mindsetを\n体験することができました！',
      en: "You observed the work of pros and experienced the Omotenashi Mindset required in Japan's hospitality industry!",
    },
    note: {
      ja: '※いつでもホーム画面から全レッスンの振り返りが可能です',
      en: '*You can review all lessons anytime from the Home screen',
    },
    button: { ja: 'START', en: 'START' },
  },
  lessons: [
    {
      id: 'L01',
      time: '12:45',
      title: { ja: '出勤前の身だしなみチェック', en: 'Pre-Shift Grooming Check' },
      narration: {
        ja: '時刻は12:45。午後のシフトインを前に、バックヤードの姿見の前へ。',
        en: "It's 12:45. Before your afternoon shift begins, you head to the full-length mirror in the back-of-house area.",
      },
      sceneImage: 'sceneL01Mirror',
      speaker: { ja: 'フロントスタッフ', en: 'Front Desk Staff' },
      line1: {
        ja: '（勤務開始まであと15分。持ち物よし、最後は身だしなみチェック。）',
        en: '(15 minutes until my shift. Belongings checked. Last step: a final grooming check.)',
      },
      line2: {
        ja: '勤務開始直前の最終点検ですね。プロは鏡に映る姿だけでなく、目に見えない部分まで配慮を行き届かせます。',
        en: "This is your last check before the shift begins. Professionals attend not only to what the mirror shows, but also to what can't be seen.",
      },
      situationTag: {
        ja: '姿見の鏡前で身だしなみの最終確認中',
        en: 'Doing a final grooming check in front of the mirror',
      },
      question: {
        ja: '出社前に身だしなみを整える際、『匂い』についてプロとして正しい配慮はどちらですか？',
        en: "When preparing for work, which is the correct, professional way to handle 'scent'?",
      },
      choices: {
        A: {
          ja: 'お客様に良い印象を与えるため、ほのかに香る爽やかな香水を少量つけておく',
          en: 'Wear a small amount of light, fresh perfume to make a good impression on guests',
        },
        B: {
          ja: '香水や柔軟剤の強い香りを避け、無香（匂いを残さないこと）を徹底する',
          en: 'Avoid strong perfume/softener scents; stay fully fragrance-free (no lingering scent)',
        },
      },
      correct: 'B',
      reason: {
        ja: '良い香り（A）も良かれと思いがちですが、強い香りはホテルの非日常感を損なうため、無香を保つ配慮（B）がプロの鉄則です。',
        en: "A nice scent (A) may seem considerate, but strong fragrance can spoil the hotel's special atmosphere. Staying fragrance-free (B) is the professional rule.",
      },
      shosaPrompt: {
        ja: '海外と日本では『香り』の感覚が違うんだ。プロが大切にする『無香』の意味、知ってる？',
        en: 'Views on scent differ between countries and Japan. Do you know why pros go fragrance-free?',
      },
      // Figma の SHOSA Focus モーダルと同じく3段落に分けて持つ
      focusParagraphs: [
        {
          ja: '多くの国では、良い香水を身につけることは『相手を歓迎するマナー』とされます。',
          en: 'In many countries, wearing good perfume is seen as a way of welcoming others.',
        },
        {
          ja: 'しかし、日本のホテル現場では『無香（匂いを残さないこと）』が最高の身だしなみです。さまざまな文化を持つゲストが寛ぐ空間では、どんなに良い香りでも『刺激』になり得ます。',
          en: 'In Japanese hotels, however, being fragrance-free (leaving no scent behind) is the highest standard of grooming. In a space where guests from many cultures relax, even a lovely fragrance can be an irritant.',
        },
        {
          ja: '自身の好みを抑え、空間の快適さを守る『引き算の配慮』がプロの基準です。',
          en: "Setting aside your own preferences to protect the comfort of the space – this 'less-is-more' consideration – is the professional standard.",
        },
      ],
      focusCaption: {
        ja: '<hl>「視覚・清潔感」</hl>だけでなく\n<hl>「嗅覚・無香」</hl>までカバーする\nプロの身だしなみチェックシート',
        en: 'Professional grooming checklist covering not only\n<hl>"Visual Cleanliness"</hl> but also\n<hl>"Fragrance-Free Sense"</hl>',
      },
      focusImage: 'focusChecklistL01',
    },
  ],
};

export const chapter1LessonCount = chapter1.lessons.length;

/** URL パラメータ（文字列）からレッスン番号を安全に取り出す。範囲外なら null。 */
export function parseLessonIndex(raw: string | string[] | undefined): number | null {
  const n = Number(Array.isArray(raw) ? raw[0] : raw);
  return Number.isInteger(n) && n >= 0 && n < chapter1LessonCount ? n : null;
}
