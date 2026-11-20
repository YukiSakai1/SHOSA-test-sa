# 画面マップ（mobile/ を Web で起動したときの URL）

`mobile/` で `npm run web`（Claude Code のプレビューでは `shosa-mobile-web`）を起動すると、http://localhost:8081 で開けます。
下のリンクを開けば、その画面に直接飛べます。Figma の列は `sakaiローカル.fig` のセクション「0章_261016」「1章：Omotenashi Mindset」「２章：JOB Simulation」の画面名です。番号（`0`、`1` …）は 0 から数えます。

- 直接開いた画面は、それまでの回答（ヒアリング・適性診断など）が入っていない状態で表示されます。
- 直接開いたときは履歴が無いので、戻るボタンを押すとタイトル（/）に戻ります。前の画面へ戻る動きを確かめるときは、アプリの中で進んでから押してください。
- 「操作で出る状態」の列は、画面を開いてから操作すると出る表示です。その一部は、下の **確認用の URL** で直接開けます。

## タイトル
| URL | 画面 | Figma | 操作で出る状態 |
|---|---|---|---|
| [/](http://localhost:8081/) | タイトル／ログイン | CH0-01 | |

## 0章：オンボーディング（画面の順）
| URL | 画面 | Figma | 操作で出る状態 |
|---|---|---|---|
| [/onboarding/language](http://localhost:8081/onboarding/language) | 言語選択 | CH0-08（言語） | |
| [/onboarding/intro/0](http://localhost:8081/onboarding/intro/0) | イントロ 1枚目（WELCOME） | CH0-03 | |
| [/onboarding/intro/1](http://localhost:8081/onboarding/intro/1) | イントロ 2枚目（4つの機能） | CH0-04 | |
| [/onboarding/intro/2](http://localhost:8081/onboarding/intro/2) | イントロ 3枚目（学ぶ→練習する→成長する、手順カード） | CH0-05 | |
| [/onboarding/intro/3](http://localhost:8081/onboarding/intro/3) | イントロ 4枚目（検定表） | CH0-06 | |
| [/onboarding/greet](http://localhost:8081/onboarding/greet) | SHOSA が話す：はじめまして | CH0-07 | |
| [/onboarding/hearing/0](http://localhost:8081/onboarding/hearing/0) | ヒアリング 1：経験した接客業 | CH0-08 | 選ぶと NEXT が押せる |
| [/onboarding/hearing/1](http://localhost:8081/onboarding/hearing/1) | ヒアリング 2：働き方 | CH0-09 | |
| [/onboarding/hearing/2](http://localhost:8081/onboarding/hearing/2) | ヒアリング 3：興味のある接客 | CH0-10 | |
| [/onboarding/hearing/3](http://localhost:8081/onboarding/hearing/3) | ヒアリング 4：不安なこと | CH0-11 | 「その他」で入力欄が開く → [?select=other](http://localhost:8081/onboarding/hearing/3?select=other) |
| [/onboarding/schedule-intro](http://localhost:8081/onboarding/schedule-intro) | SHOSA が話す：学習スケジュールの前 | CH0-20 | |
| [/onboarding/schedule](http://localhost:8081/onboarding/schedule) | 学習スケジュール（時間帯・お知らせ時間） | CH0-22 | 時刻を押すと編集シート → [?edit=1](http://localhost:8081/onboarding/schedule?edit=1) |
| [/onboarding/profile-intro](http://localhost:8081/onboarding/profile-intro) | SHOSA が話す：プロフィールの前 | CH0-15 | |
| [/onboarding/profile](http://localhost:8081/onboarding/profile) | プロフィール入力 | CH0-16' | |
| [/onboarding/journey](http://localhost:8081/onboarding/journey) | YOUR JOURNEY | CH0-18 | |
| [/onboarding/aptitude-intro](http://localhost:8081/onboarding/aptitude-intro) | SHOSA が話す：適性診断の前 | CH0-13 | |
| [/onboarding/aptitude/0](http://localhost:8081/onboarding/aptitude/0) | 適性診断 1〜3問 | CH0-14 | 答えると次の問いへ自動でスクロール |
| [/onboarding/aptitude/1](http://localhost:8081/onboarding/aptitude/1) | 適性診断 4〜6問 | CH0-14 | |
| [/onboarding/aptitude/2](http://localhost:8081/onboarding/aptitude/2) | 適性診断 7〜9問 | CH0-14 | |
| [/onboarding/aptitude/3](http://localhost:8081/onboarding/aptitude/3) | 適性診断 10〜12問 | CH0-14 | |
| [/onboarding/aptitude/4](http://localhost:8081/onboarding/aptitude/4) | 適性診断 13〜15問 | CH0-14 | |
| [/onboarding/aptitude/5](http://localhost:8081/onboarding/aptitude/5) | 適性診断 16〜18問 | CH0-14 | |
| [/onboarding/complete](http://localhost:8081/onboarding/complete) | 適性診断 完了！（結果を見る） | CH0-19 | |
| [/onboarding/result](http://localhost:8081/onboarding/result) | 適性診断 結果（1位の職種・鍵の帯） | CH0-20' | 鍵の帯は約4秒後に出る |

## 1章：Omotenashi Mindset（L01：出勤前の身だしなみチェック）
| URL | 画面 | Figma | 操作で出る状態 |
|---|---|---|---|
| [/chapter1](http://localhost:8081/chapter1) | 1章ガイド（101・SHOSA・START） | CH1-GUIDE | |
| [/chapter1/0/situation](http://localhost:8081/chapter1/0/situation) | 状況（SITUATION） | CH1-L01-01 | |
| [/chapter1/0/dialogue](http://localhost:8081/chapter1/0/dialogue) | 会話 1/2（先輩のセリフ） | CH1-L01-02 | 次へを押すと 2/2（SHOSA と吹き出し） → [?turn=2](http://localhost:8081/chapter1/0/dialogue?turn=2) |
| [/chapter1/0/question](http://localhost:8081/chapter1/0/question) | 2択問題 | CH1-L01-03 | |
| [/chapter1/0/result?choice=A](http://localhost:8081/chapter1/0/result?choice=A) | 結果：A を選んだとき（不正解） | CH1-L01-04 | SHOSA Focus を押すとモーダル → [&focus=1](http://localhost:8081/chapter1/0/result?choice=A&focus=1) |
| [/chapter1/0/result?choice=B](http://localhost:8081/chapter1/0/result?choice=B) | 結果：B を選んだとき（正解） | CH1-L01-04 | SHOSA Focus を押すとモーダル → [&focus=1](http://localhost:8081/chapter1/0/result?choice=B&focus=1) |
| [/chapter1/complete](http://localhost:8081/chapter1/complete) | 1章 学習完了 | CH1-END | |

結果画面は `?choice=A` か `?choice=B` が無いと、1章ガイドに戻ります。

## 確認用の URL（操作で出る状態を直接開く）
開発中（`npm run web` / Expo Go）だけ効きます。本番のビルドでは無視されます（`mobile/src/lib/devParams.ts`）。

| URL | 開く状態 |
|---|---|
| [/chapter1/0/dialogue?turn=2](http://localhost:8081/chapter1/0/dialogue?turn=2) | 会話 2/2（SHOSA の顔・影・吹き出し・右下の次へ） |
| [/chapter1/0/result?choice=A&focus=1](http://localhost:8081/chapter1/0/result?choice=A&focus=1) | 結果（不正解）＋ SHOSA Focus のモーダル |
| [/chapter1/0/result?choice=B&focus=1](http://localhost:8081/chapter1/0/result?choice=B&focus=1) | 結果（正解）＋ SHOSA Focus のモーダル |
| [/onboarding/hearing/3?select=other](http://localhost:8081/onboarding/hearing/3?select=other) | ヒアリング 4 で「その他」を選び、入力欄が開いた状態 |
| [/onboarding/schedule?edit=1](http://localhost:8081/onboarding/schedule?edit=1) | お知らせ時間を編集するシート（時・分のホイール） |

`?select=` はどのヒアリングでも使えます（値は選択肢の id。例：[/onboarding/hearing/0?select=hotel](http://localhost:8081/onboarding/hearing/0?select=hotel)）。選んだ答えは端末に保存されるので、続けて別の画面を見るときもそのまま残ります。

## 2章：JOB Simulation（今は非表示）
`mobile/src/lib/features.ts` の `CHAPTER2_ENABLED` が `false` のあいだは、下の URL を開いてもタイトルに戻ります。`true` にすると開けます。
職種は `front_desk`、シナリオは `checkin`（状況と問題が 3回ずつ、`0`〜`2`）です。

| URL | 画面 | Figma |
|---|---|---|
| [/chapter2](http://localhost:8081/chapter2) | 2章ガイド | CH2-S1-01 |
| [/chapter2/roles](http://localhost:8081/chapter2/roles) | ROLE Line Up（職種カードと導入ポップアップ） | CH2-02 |
| [/chapter2/front_desk/checkin/situation/0](http://localhost:8081/chapter2/front_desk/checkin/situation/0) | 状況 1 | CH2-S1-02 |
| [/chapter2/front_desk/checkin/question/0](http://localhost:8081/chapter2/front_desk/checkin/question/0) | 問題 1 | CH2-S1-03 |
| [/chapter2/front_desk/checkin/situation/1](http://localhost:8081/chapter2/front_desk/checkin/situation/1) | 状況 2 | CH2-S1-04 |
| [/chapter2/front_desk/checkin/question/1](http://localhost:8081/chapter2/front_desk/checkin/question/1) | 問題 2 | CH2-S1-05 |
| [/chapter2/front_desk/checkin/situation/2](http://localhost:8081/chapter2/front_desk/checkin/situation/2) | 状況 3 | CH2-S1-06 |
| [/chapter2/front_desk/checkin/question/2](http://localhost:8081/chapter2/front_desk/checkin/question/2) | 問題 3 | CH2-S1-07 |
| [/chapter2/scenario-complete?role=front_desk&scenario=checkin](http://localhost:8081/chapter2/scenario-complete?role=front_desk&scenario=checkin) | シナリオ完了 | CH2-S1-08 |
| [/chapter2/diagnosis-complete?role=front_desk](http://localhost:8081/chapter2/diagnosis-complete?role=front_desk) | 診断完了 | CH2-03 |
| [/chapter2/result?role=front_desk](http://localhost:8081/chapter2/result?role=front_desk) | 診断結果：職種との相性 | CH2-04 / CH2-05 |
| [/chapter2/complete?role=front_desk](http://localhost:8081/chapter2/complete?role=front_desk) | 2章 職種診断完了 | CH2-06 |

画面を足したり URL を変えたりしたら、この表も直してください（画面のファイルは `mobile/src/app/` の下）。
