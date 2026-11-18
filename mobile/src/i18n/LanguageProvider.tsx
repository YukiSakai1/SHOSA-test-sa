/**
 * 表示言語の状態。`useLang()` で現在の言語・切り替え・翻訳ヘルパーを取得する。
 *   const { lang, toggleLang, t, tr } = useLang();
 *   t('next')          // UI 固定文言
 *   tr(lesson.title)   // Localized を現在の言語で取り出す
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Lang, Localized } from '@/content/types';
import { uiStrings, type UiStringKey } from '@/content/uiStrings';
import { loadItem, saveItem } from '@/lib/storage';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: UiStringKey) => string;
  tr: (text: Localized) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ja');

  useEffect(() => {
    void loadItem('shosa.lang').then((saved) => {
      if (saved) setLangState(saved);
    });
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    void saveItem('shosa.lang', next);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang(lang === 'ja' ? 'en' : 'ja'),
      t: (key) => uiStrings[lang][key],
      tr: (text) => text[lang],
    }),
    [lang, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
  return ctx;
}
