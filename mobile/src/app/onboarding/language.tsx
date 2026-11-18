/** 言語選択（Figma CH0-08）。選ぶとその場でアプリ全体の表示言語が切り替わる */
import { useState } from 'react';
import { router } from 'expo-router';
import { languageOptions } from '@/content/onboarding';
import type { Lang } from '@/content/types';
import { OptionCard, QuestionLayout } from '@/features/onboarding/components';
import { useLang } from '@/i18n/LanguageProvider';

export default function LanguageScreen() {
  const { setLang, tr } = useLang();
  const [selected, setSelected] = useState<Lang | null>(null);

  return (
    <QuestionLayout
      question={{ ja: 'Please select\nyour language setting.', en: 'Please select\nyour language setting.' }}
      showLang={false}
      nextDisabled={!selected}
      onNext={() => router.push({ pathname: '/onboarding/intro/[slide]', params: { slide: '0' } })}
    >
      {languageOptions.map((o) => (
        <OptionCard
          key={o.id}
          testID={`lang-${o.id}`}
          label={tr(o.label)}
          icon={o.icon}
          height={90}
          selected={selected === o.lang}
          onPress={() => {
            setSelected(o.lang);
            setLang(o.lang);
          }}
        />
      ))}
    </QuestionLayout>
  );
}
