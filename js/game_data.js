/* =========================================================
   GAME DATA — 3日間のシナリオ（すべてオリジナルストーリー）
   各テキストには "_en" で終わる英訳フィールドがあり、
   画面上の「English >」トグルで表示を切り替えられる。
   ========================================================= */
const GAME_DATA = {
  days: [
    {
      dayTitle: "DAY 1",
      bgm: "assets/audio/day1_bgm.mp3",
      timeLabel: "07:45",
      daySummaryDesc: "忙しい朝の現場で、指示の優先順位を判断し「報連相（ほうれんそう）」の基本を身につけます。",
      npc: {
        name: "チーフ（上司）",
        avatar: "assets/images/avatars/staff_male_03.jpg",
        bannerNeutral: "assets/images/avatars/staff_male_03_banner_neutral.jpg",
        bannerHappy: "assets/images/avatars/staff_male_03_banner_happy.jpg",
        bannerWorried: "assets/images/avatars/staff_male_03_banner_worried.jpg"
      },
      story: "朝礼5分前のバックヤード。同僚から「体調が悪く30分遅れる」とメッセージが届きました。",
      story_en: "It's the backyard, 5 minutes before the morning meeting. A colleague messages you: \"I'm not feeling well and will be 30 minutes late.\"",
      hint: "Hint: 日本の職場では、分かった情報をすぐに共有することがチームへの一番の貢献になります。",
      hint_en: "Hint: In Japanese workplaces, sharing information as soon as you know it is the fastest way to help your team.",
      dialogueText: "「おはようございます、○○さん。5分後の07:45から朝礼を始めます。」",
      dialogueText_en: "\"Good morning, ○○. We'll start the morning meeting in 5 minutes, at 7:45.\"",
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
    },
    {
      dayTitle: "DAY 2",
      bgm: "assets/audio/day2_bgm.mp3",
      timeLabel: "10:15",
      daySummaryDesc: "フロントで、早朝チェックインを希望するゲストへの言葉づかいと心配りを学びます。",
      npc: {
        name: "先輩スタッフ",
        avatar: "assets/images/avatars/staff_female_03.jpg",
        bannerNeutral: "assets/images/avatars/staff_female_03_banner_neutral.jpg",
        bannerHappy: "assets/images/avatars/staff_female_03_banner_happy.jpg",
        bannerWorried: "assets/images/avatars/staff_female_03_banner_worried.jpg"
      },
      story: "フロント業務中、海外からのゲストが早めに到着。部屋の準備がまだ整っていない状況です。",
      story_en: "You're working the front desk. A guest from overseas has arrived early, and their room isn't ready yet.",
      hint: "Hint: 「恐れ入りますが」のようなクッション言葉を使うと、断りの言葉も柔らかく伝わります。",
      hint_en: "Hint: Adding a cushion word like \"I'm terribly sorry, but...\" softens even a refusal.",
      dialogueText: "「あちらのお客様、まだ13時なのにチェックインを希望されています。今のうちに伝え方を確認しておきましょう。」",
      dialogueText_en: "\"That guest over there is asking to check in even though it's only 1 PM. Let's go over how to explain it before we talk to them.\"",
      gaugeLabel: "ゲストの満足度",
      question: {
        text: "チェックインは15時からですが、お客様は今すぐ部屋に入りたい様子。どう伝える？",
        textEn: "Check-in starts at 3 PM, but the guest wants to enter their room right away. How do you respond?",
        choices: [
          { label: "「まだ無理です。15時まで待ってください」", quality: "bad",
            feedback: "お客様は少し驚いた表情に。ぶっきらぼうな印象を与えてしまいました。",
            feedback_en: "The guest looks a little taken aback — it came across as blunt.",
            gaugeDelta: -25, teamDelta: 0, guestDelta: -20, points: 15 },
          { label: "「恐れ入りますが、お部屋の準備に今しばらくお時間を頂戴しております。お荷物をお預かりし、ロビーでお寛ぎいただけます」", quality: "best",
            feedback: "「そうなのね、ありがとう。じゃあロビーで待たせてもらうわ」お客様は安心した様子です。",
            feedback_en: "\"I see, thank you. I'll wait in the lobby then.\" The guest looks relieved.",
            gaugeDelta: 25, teamDelta: 0, guestDelta: 20, points: 100 },
          { label: "「少々お待ちいただけますか」とだけ伝える", quality: "okay",
            feedback: "「え、いつまで？」お客様はやや不安そう。具体的な情報が足りなかったようです。",
            feedback_en: "\"Oh, until when?\" The guest looks a little uneasy — there wasn't enough concrete information.",
            gaugeDelta: 5, teamDelta: 0, guestDelta: 5, points: 55 }
        ]
      },
      explanation: {
        lessonNo: "[レッスン2]",
        title: "SHOSAの極意：クッション言葉とホスピタリティ",
        body: "お断りやお願いをそのまま伝えると、意図せず冷たい印象になることがあります。<br><br>「恐れ入りますが」「あいにく」のようなクッション言葉を一言添えるだけで、同じ内容でも柔らかく伝わります。<br><br>さらに、「なぜ待つのか」「その間どうすればよいか」という具体的な代案までセットで伝えることが、ゲストの不安を安心に変える一番のポイントです。",
        body_en: "Stating a refusal or request as-is can unintentionally come across as cold.<br><br>Just adding a cushion word like \"I'm terribly sorry, but\" or \"Unfortunately\" makes the same content sound much softer.<br><br>On top of that, clearly explaining \"why\" the guest has to wait and \"what they can do\" in the meantime is the key to turning a guest's anxiety into reassurance."
      },
      voice: {
        lessonNo: "[レッスン2]",
        script: "恐れ入りますが、お部屋の準備に今しばらくお時間を頂戴しております。",
        script_en: "I'm terribly sorry, but we need a little more time to prepare your room."
      }
    },
    {
      dayTitle: "DAY 3（総仕上げ）",
      bgm: "assets/audio/day3_bgm.mp3",
      timeLabel: "18:30",
      daySummaryDesc: "レストランが満席の忙しい時間帯。複数の対応が重なったときの優先順位を判断する、これまでの総仕上げです。",
      npc: {
        name: "チーフ（上司）",
        avatar: "assets/images/avatars/staff_male_01.jpg",
        bannerNeutral: "assets/images/avatars/staff_male_01_banner_neutral.jpg",
        bannerHappy: "assets/images/avatars/staff_male_01_banner_happy.jpg",
        bannerWorried: "assets/images/avatars/staff_male_01_banner_worried.jpg"
      },
      story: "ディナータイムでレストランは満席。予約のお客様を案内中に、別のテーブルでグラスが割れる音。さらに新しいお客様も入り口に立っています。",
      story_en: "It's dinner time and the restaurant is full. Right as you're guiding a guest with a reservation, you hear a glass break at another table — and a new guest has just walked in the door.",
      hint: "Hint: 「安全」と「お客様の不安」に関わることを最優先に。次に目の前の約束、その次に新規対応、という順番が基本です。",
      hint_en: "Hint: Prioritize anything related to safety or a guest's anxiety first. Then the commitment right in front of you (the reservation), then new arrivals — that's the basic order.",
      dialogueText: "「3つの対応が同時に来たね。こういう時こそSHOSAの見せ所だよ。」",
      dialogueText_en: "\"Three things came in at once, huh. This is exactly where SHOSA shows what it's made of.\"",
      gaugeLabel: "チームの信頼度",
      question: {
        text: "予約客の案内中に、グラスが割れる音。同時に新しいお客様も入店。最初に何をする？",
        textEn: "While guiding a reserved guest, you hear glass break. A new guest also just walked in. What do you do first?",
        choices: [
          { label: "予約客の案内を続け、割れたグラスは後で対応する", quality: "okay",
            feedback: "予約のお客様には失礼なく対応できましたが、破片でケガをする方がいないか確認が遅れました。",
            feedback_en: "You were able to guide the reserved guest without being rude, but checking whether anyone was hurt by the broken glass got delayed.",
            gaugeDelta: 5, teamDelta: 0, guestDelta: 0, points: 50 },
          { label: "近くのスタッフに一声かけてグラス対応を頼み、自分は予約客の案内を続ける", quality: "best",
            feedback: "「了解、任せて！」同僚がすぐ対応してくれました。安全確保と接客の両立ができました。",
            feedback_en: "\"Got it, leave it to me!\" A coworker handled it right away. You managed to keep both safety and service running smoothly.",
            gaugeDelta: 25, teamDelta: 20, guestDelta: 15, points: 100 },
          { label: "予約客をそのままにして、自分でグラスの片付けに向かう", quality: "bad",
            feedback: "予約のお客様を置き去りにしてしまい、「案内はどうなったの？」と困惑させてしまいました。",
            feedback_en: "You left the reserved guest and went to clean up the glass yourself. The guest was left confused, wondering \"what happened to my table?\"",
            gaugeDelta: -15, teamDelta: -10, guestDelta: -15, points: 20 }
        ]
      },
      explanation: {
        lessonNo: "[レッスン3]",
        title: "SHOSAの極意：優先順位判断とチームプレー",
        body: "忙しい現場では、複数のことが同時に起こります。すべてを1人で抱え込む必要はありません。<br><br>「安全」に関わることは最優先ですが、それを自分がやるべきか、他のスタッフに頼めることかを一瞬で見極めるのがプロのSHOSAです。<br><br>「お願いします」の一声をかけられるかどうかが、チーム全体の対応スピードと信頼を大きく左右します。",
        body_en: "In a busy workplace, multiple things happen at once. You don't have to handle everything alone.<br><br>Anything related to safety comes first — but the real skill of SHOSA is instantly judging whether it's something you should do yourself, or something you can ask a coworker to handle.<br><br>Whether or not you can say \"could you help with this?\" makes a huge difference to your team's overall response speed and trust."
      },
      voice: {
        lessonNo: "[レッスン3]",
        script: "かしこまりました。すぐ他の者に確認させます。",
        script_en: "Understood. I'll have someone check on that right away."
      }
    }
  ]
};
