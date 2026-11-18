/**
 * 2章の回答（職種ごと・シナリオごと・設問ごとに選んだ行動傾向）を保持し、端末に保存する。
 * 集計は scoring.ts。
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Tendency } from '@/content/chapter2';
import { loadItem, saveItem } from '@/lib/storage';

export interface Chapter2Record {
  /** answers[roleId][`${scenarioId}:${stepIndex}`] = 選んだ行動傾向 */
  answers: Record<string, Record<string, Tendency>>;
  /** 診断まで終えた職種 */
  completedRoles: string[];
}

const empty: Chapter2Record = { answers: {}, completedRoles: [] };

interface Ctx {
  record: Chapter2Record;
  answer: (roleId: string, scenarioId: string, step: number, t: Tendency) => void;
  completeRole: (roleId: string) => void;
}

const Chapter2Context = createContext<Ctx | null>(null);

export const answerKey = (scenarioId: string, step: number) => `${scenarioId}:${step}`;

export function Chapter2Provider({ children }: { children: ReactNode }) {
  const [record, setRecord] = useState<Chapter2Record>(empty);

  useEffect(() => {
    void loadItem('shosa.chapter2').then((saved) => saved && setRecord({ ...empty, ...saved }));
  }, []);

  const mutate = useCallback((fn: (r: Chapter2Record) => Chapter2Record) => {
    setRecord((prev) => {
      const next = fn(prev);
      void saveItem('shosa.chapter2', next);
      return next;
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      record,
      answer: (roleId, scenarioId, step, t) =>
        mutate((r) => ({ ...r, answers: { ...r.answers, [roleId]: { ...r.answers[roleId], [answerKey(scenarioId, step)]: t } } })),
      completeRole: (roleId) =>
        mutate((r) => (r.completedRoles.includes(roleId) ? r : { ...r, completedRoles: [...r.completedRoles, roleId] })),
    }),
    [record, mutate],
  );

  return <Chapter2Context.Provider value={value}>{children}</Chapter2Context.Provider>;
}

export function useChapter2(): Ctx {
  const ctx = useContext(Chapter2Context);
  if (!ctx) throw new Error('useChapter2 must be used inside <Chapter2Provider>');
  return ctx;
}
