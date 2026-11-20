/**
 * 確認用の URL パラメータ（docs/route-map.md）。操作しないと出ない状態を、URL から直接開くためのもの。
 * 開発中（__DEV__）だけ効く。本番のビルドでは常に undefined を返すので、外から状態を変えられない。
 * 例：/chapter1/0/dialogue?turn=2、/chapter1/0/result?choice=A&focus=1、/onboarding/hearing/3?select=other、/onboarding/schedule?edit=1
 */
export function devParam(value: string | string[] | undefined): string | undefined {
  if (!__DEV__) return undefined;
  return Array.isArray(value) ? value[0] : value;
}
