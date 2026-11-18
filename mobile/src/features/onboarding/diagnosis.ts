/**
 * 適性診断の採点ロジック（Web版 onboarding.ts の calculateAptitudeResult を移植）。
 * 職種ごとに traits（次元）の平均点を出し、高い順に並べる。
 */
import { aptitudeQuestions, roleResults } from '@/content/onboarding';
import type { AptitudeDimension, RoleResult } from '@/content/types';

/** 未回答の次元に使う点数（Web版と同じ） */
const DEFAULT_SCORE = 4;

export const aptitudeKey = (id: number) => `q${id}`;

export function dimensionScore(answers: Record<string, number>, dimension: AptitudeDimension): number {
  const values = aptitudeQuestions
    .filter((q) => q.dimension === dimension)
    .map((q) => answers[aptitudeKey(q.id)])
    .filter((v): v is number => typeof v === 'number');
  if (values.length === 0) return DEFAULT_SCORE;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export interface RankedRole {
  role: RoleResult;
  /** 0〜100 の一致度 */
  matchPercent: number;
}

export function rankRoles(answers: Record<string, number>): RankedRole[] {
  return roleResults
    .map((role) => {
      const avg = role.traits.reduce((sum, t) => sum + dimensionScore(answers, t), 0) / role.traits.length;
      // 1〜5 の平均を 0〜100% に変換
      return { role, matchPercent: Math.round(((avg - 1) / 4) * 100) };
    })
    .sort((a, b) => b.matchPercent - a.matchPercent);
}

export function isAptitudeComplete(answers: Record<string, number>): boolean {
  return aptitudeQuestions.every((q) => typeof answers[aptitudeKey(q.id)] === 'number');
}
