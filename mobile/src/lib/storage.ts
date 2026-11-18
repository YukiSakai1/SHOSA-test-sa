/**
 * 端末内の保存処理。画面やフックは AsyncStorage を直接触らず、必ずここを通す。
 * バックエンド（未定）が決まったら、この実装を差し替えるかサーバー同期を足す。
 *
 * キーと値の型は StorageSchema で一元管理する。キーを増やすときはここに追記する。
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Lang } from '@/content/types';
import type { Chapter2Record } from '@/features/chapter2/Chapter2Provider';
import type { OnboardingRecord } from '@/features/onboarding/OnboardingProvider';

export interface StorageSchema {
  'shosa.lang': Lang;
  /** 0章の入力内容（ヒアリング・スケジュール・プロフィール・適性診断） */
  'shosa.onboarding': OnboardingRecord;
  'shosa.chapter1.completed': boolean;
  /** 2章の回答と、診断を終えた職種 */
  'shosa.chapter2': Chapter2Record;
}

export type StorageKey = keyof StorageSchema;

export async function loadItem<K extends StorageKey>(key: K): Promise<StorageSchema[K] | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw === null ? null : (JSON.parse(raw) as StorageSchema[K]);
  } catch {
    return null;
  }
}

export async function saveItem<K extends StorageKey>(key: K, value: StorageSchema[K]): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 保存に失敗してもアプリは続行する（次回起動時に初期値になるだけ）
  }
}

export async function clearAll(): Promise<void> {
  const keys: StorageKey[] = ['shosa.lang', 'shosa.onboarding', 'shosa.chapter1.completed', 'shosa.chapter2'];
  await AsyncStorage.multiRemove(keys);
}
