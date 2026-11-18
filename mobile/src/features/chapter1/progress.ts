/** 第1章のクリア状態の読み書き */
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { loadItem, saveItem } from '@/lib/storage';

export function markChapter1Completed(): Promise<void> {
  return saveItem('shosa.chapter1.completed', true);
}

/** 画面が表示されるたびにクリア状態を読み直す */
export function useChapter1Completed(): boolean {
  const [completed, setCompleted] = useState(false);
  useFocusEffect(
    useCallback(() => {
      let active = true;
      void loadItem('shosa.chapter1.completed').then((v) => {
        if (active) setCompleted(v === true);
      });
      return () => {
        active = false;
      };
    }, []),
  );
  return completed;
}
