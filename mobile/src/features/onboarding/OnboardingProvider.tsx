/**
 * 0章で入力した内容（ヒアリング・スケジュール・プロフィール・適性診断）の状態。
 * 変更のたびに端末へ保存し、次回起動時に復元する。
 *
 *   const { record, update } = useOnboarding();
 *   update((r) => ({ ...r, profile: { ...r.profile, name } }));
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { HearingKey } from '@/content/types';
import { schedule as scheduleContent } from '@/content/onboarding';
import { loadItem, saveItem } from '@/lib/storage';

export interface HearingAnswer {
  optionId: string;
  /** 「その他」を選んだときの自由入力 */
  otherText?: string;
}

export interface ProfileInput {
  gender: string | null;
  name: string;
  countryId: string | null;
  /** YYYY-MM-DD */
  birthday: string | null;
}

export interface OnboardingRecord {
  hearing: Partial<Record<HearingKey, HearingAnswer>>;
  /** userCustomizedTime：お知らせ時間を自分で編集したら true（以後、時間帯を選んでも時刻は変えない） */
  schedule: { timeSlot: string | null; notifyTime: string; notifyEnabled: boolean; userCustomizedTime?: boolean };
  profile: ProfileInput;
  /** キーは `q${問題番号}`、値は 1〜5 */
  aptitude: Record<string, number>;
  /** 診断結果まで見終わったら true */
  completed: boolean;
}

export const emptyRecord: OnboardingRecord = {
  hearing: {},
  schedule: { timeSlot: null, notifyTime: scheduleContent.defaultTime, notifyEnabled: true },
  profile: { gender: null, name: '', countryId: null, birthday: null },
  aptitude: {},
  completed: false,
};

interface Ctx {
  record: OnboardingRecord;
  loaded: boolean;
  update: (fn: (r: OnboardingRecord) => OnboardingRecord) => void;
  reset: () => void;
}

const OnboardingContext = createContext<Ctx | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [record, setRecord] = useState<OnboardingRecord>(emptyRecord);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void loadItem('shosa.onboarding').then((saved) => {
      if (saved) setRecord({ ...emptyRecord, ...saved });
      setLoaded(true);
    });
  }, []);

  const update = useCallback((fn: (r: OnboardingRecord) => OnboardingRecord) => {
    setRecord((prev) => {
      const next = fn(prev);
      void saveItem('shosa.onboarding', next);
      return next;
    });
  }, []);

  const reset = useCallback(() => update(() => emptyRecord), [update]);

  const value = useMemo(() => ({ record, loaded, update, reset }), [record, loaded, update, reset]);
  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): Ctx {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside <OnboardingProvider>');
  return ctx;
}
