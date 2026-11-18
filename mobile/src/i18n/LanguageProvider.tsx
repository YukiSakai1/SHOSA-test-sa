/**
 * 表示言語の状態。`useLang()` で現在の言語・切り替え・翻訳ヘルパーを取得する。
 *   const { lang, toggleLang, t, tr } = useLang();
 *   t('next')          // UI 固定文言
 *   tr(lesson.title)   // Localized を現在の言語で取り出す
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Animated } from 'react-native';
import { motion, nativeDriver } from '@/theme/motion';
import type { Lang, Localized } from '@/content/types';
import { uiStrings, type UiStringKey } from '@/content/uiStrings';
import { loadItem, saveItem } from '@/lib/storage';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: UiStringKey) => string;
  tr: (text: Localized) => string;
  /** 言語切り替え時のクロスフェード用（LangFade が使う） */
  fade: Animated.Value;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ja');

  useEffect(() => {
    void loadItem('shosa.lang').then((saved) => {
      if (saved) setLangState(saved);
    });
  }, []);

  // M-32 / M-06：文言はクロスフェード（0.3秒＝消える 0.15秒＋出る 0.15秒）で切り替える。レイアウトは動かさない
  const fade = useRef(new Animated.Value(1)).current;
  const setLang = useCallback(
    (next: Lang) => {
      void saveItem('shosa.lang', next);
      const half = motion.langFadeMs / 2;
      Animated.timing(fade, { toValue: 0, duration: half, useNativeDriver: nativeDriver }).start(() => {
        setLangState(next);
        Animated.timing(fade, { toValue: 1, duration: half, useNativeDriver: nativeDriver }).start();
      });
    },
    [fade],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang(lang === 'ja' ? 'en' : 'ja'),
      t: (key) => uiStrings[lang][key],
      tr: (text) => text[lang],
      fade,
    }),
    [lang, setLang, fade],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/** 言語を切り替えたときにクロスフェードさせる範囲（ルートレイアウトで画面全体を包む） */
export function LangFade({ children }: { children: ReactNode }) {
  const { fade } = useLang();
  return <Animated.View style={{ flex: 1, opacity: fade }}>{children}</Animated.View>;
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
  return ctx;
}
