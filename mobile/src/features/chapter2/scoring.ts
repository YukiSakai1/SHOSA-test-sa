/**
 * 2章の集計。選んだ回数を行動傾向ごとに数え、多い順に並べる。
 * 同数のときは、その職種で求められる順（role.required）を優先する。
 * ⚠️ 配点ルールは Figma に記載が無いため「選んだ回数」で仮実装している。
 */
import { TENDENCIES, type Role, type Tendency } from '@/content/chapter2';

export interface TendencyScore {
  tendency: Tendency;
  count: number;
  /** 回答全体に占める割合（0〜100） */
  percent: number;
}

export function scoreRole(role: Role, answers: Record<string, Tendency> | undefined): TendencyScore[] {
  const counts = Object.fromEntries(TENDENCIES.map((t) => [t, 0])) as Record<Tendency, number>;
  const values = Object.values(answers ?? {});
  values.forEach((t) => (counts[t] += 1));
  const total = values.length || 1;
  return TENDENCIES.map((t) => ({ tendency: t, count: counts[t], percent: Math.round((counts[t] / total) * 100) })).sort(
    (a, b) => b.count - a.count || role.required.indexOf(a.tendency) - role.required.indexOf(b.tendency),
  );
}
