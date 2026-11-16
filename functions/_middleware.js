/**
 * Cloudflare Pages Functions ミドルウェア
 * サイト全体（/以下すべて）に簡易Basic認証をかける。
 *
 * 使い方:
 * 1. このファイルをリポジトリの functions/_middleware.js に置く
 *    （既存の index.html / css / js / assets と同じ階層に functions/ フォルダを作る）
 * 2. Cloudflare Pages の管理画面 → Settings → Environment variables で
 *    以下2つを追加する（Production / Preview 両方に設定推奨）
 *      BASIC_AUTH_USER = 任意のユーザー名（例: shosa）
 *      BASIC_AUTH_PASS = 任意のパスワード（例: framelunch2026）
 * 3. デプロイすると、サイトを開いた瞬間にブラウザ標準のログインダイアログが出る。
 *    社内の人にはURLとこのユーザー名・パスワードだけ共有すればOK
 *    （GitHubアカウントやCloudflareアカウントは不要）。
 */
export async function onRequest(context) {
  const { request, env, next } = context;

  const expectedUser = env.BASIC_AUTH_USER;
  const expectedPass = env.BASIC_AUTH_PASS;

  // 環境変数が未設定の場合は誤って全体公開しないよう認証必須のままにする
  if (!expectedUser || !expectedPass) {
    return new Response('Basic auth is not configured (missing environment variables).', {
      status: 500,
    });
  }

  const authHeader = request.headers.get('Authorization');

  if (authHeader && authHeader.startsWith('Basic ')) {
    const base64Credentials = authHeader.slice('Basic '.length);
    const decoded = atob(base64Credentials); // "user:pass"
    const separatorIndex = decoded.indexOf(':');
    const user = decoded.slice(0, separatorIndex);
    const pass = decoded.slice(separatorIndex + 1);

    if (user === expectedUser && pass === expectedPass) {
      // 認証OK。本来のリクエスト（index.htmlや各アセット）を通す
      return next();
    }
  }

  // 未認証・認証失敗 → ブラウザに認証ダイアログを表示させる
  return new Response('認証が必要です / Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="SHOSA (Frame Lunch internal)", charset="UTF-8"',
    },
  });
}
