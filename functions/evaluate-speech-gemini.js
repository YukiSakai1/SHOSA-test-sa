/**
 * POST /evaluate-speech
 * Gemini API版。無料枠（カード登録不要）でテストする場合の実装。
 *
 * 必須の環境変数（Cloudflare Pages の Settings → Environment variables）:
 *   GEMINI_API_KEY = AIzaSyxxxxx（ai.google.dev の Google AI Studio で無料発行）
 *
 * 注意: 無料枠では入力・出力がGoogleのモデル改善に使われる場合があります。
 * 社内の研修データを本格運用する段階では、有料枠（データを学習に使わない設定）
 * への切り替えを検討してください。テスト段階ではまず無料枠でOKです。
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const { transcript, expectedScript, sceneContext } = body || {};
  if (!transcript || !expectedScript) {
    return json({ error: 'missing_transcript_or_expectedScript' }, 400);
  }
  if (transcript.length > 500) {
    return json({ error: 'transcript_too_long' }, 400);
  }

  const prompt = `あなたはホテル接客の日本語コーチです。研修生が発音練習で話した内容を評価してください。

【お手本スクリプト】
${expectedScript}

【研修生が実際に話した内容（音声認識結果）】
${transcript}

【場面】
${sceneContext || 'ホテルスタッフの接客練習'}

以下のJSON形式のみで出力してください（説明文やマークダウンは不要）:
{
  "isAcceptable": true or false,
  "score": 0〜100の整数,
  "feedback": "研修生向けの短い日本語フィードバック（1〜2文）"
}`;

  try {
    const model = 'gemini-2.5-flash'; // 無料枠の主力モデル
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return json({ error: 'gemini_api_error', detail: errText }, 502);
    }

    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return json({ error: 'parse_failed', raw }, 502);
    }

    return json(parsed, 200);
  } catch (err) {
    return json({ error: 'server_error', detail: String(err) }, 500);
  }
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
