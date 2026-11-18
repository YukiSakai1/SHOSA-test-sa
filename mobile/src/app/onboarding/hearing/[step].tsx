/**
 * ヒアリング 4問（Figma CH0-09〜11）。1問1画面、1つ選ぶと NEXT が押せる。
 * 「その他」を選ぶとカードが広がり、自由入力欄が出る（入力しないと NEXT は押せない）。
 */
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { hearings, OTHER_INPUT_MAX_LENGTH } from '@/content/onboarding';
import { blockProgress, OptionCard, QuestionLayout } from '@/features/onboarding/components';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';

export default function HearingScreen() {
  const { step: raw } = useLocalSearchParams<{ step: string }>();
  const { t, tr } = useLang();
  const { record, update } = useOnboarding();
  const index = Number(raw);
  const q = Number.isInteger(index) ? hearings[index] : undefined;
  if (!q) return <Redirect href="/onboarding/language" />;

  const answer = record.hearing[q.key];
  const selected = q.options.find((o) => o.id === answer?.optionId);
  const needsText = !!selected?.hasInput;
  const otherText = answer?.otherText ?? '';
  const canNext = !!selected && (!needsText || otherText.trim().length > 0);

  const choose = (optionId: string) =>
    update((r) => ({ ...r, hearing: { ...r.hearing, [q.key]: { optionId, otherText: r.hearing[q.key]?.otherText } } }));

  const next = () => {
    if (index + 1 < hearings.length) router.push({ pathname: '/onboarding/hearing/[step]', params: { step: String(index + 1) } });
    else router.push('/onboarding/schedule-intro');
  };

  return (
    <QuestionLayout percent={blockProgress(index + 1)} question={q.question} nextDisabled={!canNext} onNext={next}>
      {q.options.map((o) => {
        const isSel = selected?.id === o.id;
        return (
          <OptionCard key={o.id} testID={`option-${o.id}`} label={tr(o.label)} icon={o.icon} selected={isSel} onPress={() => choose(o.id)}>
            {o.hasInput && isSel && (
              <View style={styles.inputWrap}>
                <TextInput
                  testID="other-input"
                  value={otherText}
                  onChangeText={(text) =>
                    update((r) => ({ ...r, hearing: { ...r.hearing, [q.key]: { optionId: o.id, otherText: text } } }))
                  }
                  placeholder={t('otherPlaceholder')}
                  placeholderTextColor={colors.placeholder}
                  maxLength={OTHER_INPUT_MAX_LENGTH}
                  style={styles.input}
                  autoFocus
                />
                <Text style={styles.counter}>
                  {otherText.length}/{OTHER_INPUT_MAX_LENGTH}
                </Text>
              </View>
            )}
          </OptionCard>
        );
      })}
    </QuestionLayout>
  );
}

const styles = StyleSheet.create({
  inputWrap: { marginTop: 10, marginLeft: 54 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.goldBorder,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    paddingVertical: 6,
  },
  counter: { alignSelf: 'flex-end', fontSize: 11, color: colors.placeholder, marginTop: 2 },
});
