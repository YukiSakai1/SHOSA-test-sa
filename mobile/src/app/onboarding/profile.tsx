/**
 * プロフィール入力（Figma CH0-16'）：性別・名前・出身国・誕生日。
 * すべて入力済みでエラーがないときだけ NEXT が押せる。
 * エラーは「一度触った項目」だけに表示する（入力前から赤字を出さない）。
 * ルールとメッセージは features/onboarding/validation.ts（暫定仕様）。
 */
import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { BottomSheet } from '@/components/BottomSheet';
import { pad2, range, WheelPicker } from '@/components/WheelPicker';
import { profileForm } from '@/content/onboarding';
import { blockProgress, QuestionLayout } from '@/features/onboarding/components';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import { countChars, NAME_MAX_LENGTH, validateProfile, type ProfileField } from '@/features/onboarding/validation';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';

const THIS_YEAR = new Date().getFullYear();
const YEARS = range(THIS_YEAR - 80, THIS_YEAR - 10);
const MONTHS = range(1, 12);
const daysIn = (y: number, m: number) => new Date(y, m, 0).getDate();

export default function ProfileScreen() {
  const { t, tr } = useLang();
  const { record, update } = useOnboarding();
  const p = record.profile;
  const [touched, setTouched] = useState<Partial<Record<ProfileField, boolean>>>({});
  const [sheet, setSheet] = useState<'country' | 'birthday' | null>(null);
  const [draftBirth, setDraftBirth] = useState({ y: 2000, m: 1, d: 1 });

  const errors = useMemo(() => validateProfile(p), [p]);
  const valid = Object.keys(errors).length === 0;
  const touch = (f: ProfileField) => setTouched((s) => ({ ...s, [f]: true }));
  const setProfile = (patch: Partial<typeof p>) => update((r) => ({ ...r, profile: { ...r.profile, ...patch } }));
  const errorFor = (f: ProfileField) => (touched[f] && errors[f] ? tr(errors[f]) : null);

  const country = profileForm.country.options.find((c) => c.id === p.countryId);

  const openBirthday = () => {
    if (p.birthday) {
      const [y, m, d] = p.birthday.split('-').map(Number);
      setDraftBirth({ y: y!, m: m!, d: d! });
    }
    setSheet('birthday');
  };

  return (
    <QuestionLayout percent={blockProgress(valid ? 6 : 5)} nextDisabled={!valid} onNext={() => router.push('/onboarding/journey')}>
      <Text style={styles.title}>{tr(profileForm.title)}</Text>

      {/* 性別 */}
      <Text style={styles.label}>{tr(profileForm.gender.label)}</Text>
      <View style={styles.genderRow}>
        {profileForm.gender.options.map((g) => {
          const sel = p.gender === g.id;
          return (
            <Pressable
              key={g.id}
              testID={`gender-${g.id}`}
              accessibilityRole="radio"
              accessibilityState={{ checked: sel }}
              onPress={() => {
                setProfile({ gender: g.id });
                touch('gender');
              }}
              style={[styles.genderChip, sel && styles.genderChipSel]}
            >
              <Text style={[styles.genderText, sel && { color: colors.purple }]}>{tr(g.label)}</Text>
            </Pressable>
          );
        })}
      </View>
      <FieldError text={errorFor('gender')} />

      {/* 名前 */}
      <Text style={styles.label}>{tr(profileForm.name.label)}</Text>
      <View style={[styles.field, errorFor('name') && styles.fieldError]}>
        <TextInput
          testID="name-input"
          value={p.name}
          onChangeText={(name) => setProfile({ name })}
          onBlur={() => touch('name')}
          placeholder={tr(profileForm.name.placeholder)}
          placeholderTextColor={colors.placeholder}
          style={styles.input}
          autoCorrect={false}
          returnKeyType="done"
        />
        <Text style={[styles.counter, countChars(p.name.trim()) > NAME_MAX_LENGTH && { color: colors.incorrect }]}>
          {countChars(p.name.trim())}/{NAME_MAX_LENGTH}
        </Text>
      </View>
      <Text style={styles.help}>{tr(profileForm.name.help)}</Text>
      <FieldError text={errorFor('name') ?? (countChars(p.name.trim()) > NAME_MAX_LENGTH && errors.name ? tr(errors.name) : null)} />

      {/* 出身国 */}
      <Text style={styles.label}>{tr(profileForm.country.label)}</Text>
      <SelectField
        testID="country-select"
        value={country ? tr(country.label) : null}
        placeholder={tr(profileForm.country.placeholder)}
        error={!!errorFor('countryId')}
        onPress={() => setSheet('country')}
      />
      <FieldError text={errorFor('countryId')} />

      {/* 誕生日 */}
      <Text style={styles.label}>{tr(profileForm.birthday.label)}</Text>
      <SelectField
        testID="birthday-select"
        value={p.birthday ? p.birthday.replace(/-/g, '/') : null}
        placeholder={tr(profileForm.birthday.placeholder)}
        error={!!errorFor('birthday')}
        onPress={openBirthday}
      />
      <FieldError text={errorFor('birthday')} />

      <BottomSheet
        visible={sheet === 'country'}
        title={tr(profileForm.country.label)}
        confirmLabel={t('close')}
        onClose={() => {
          setSheet(null);
          touch('countryId');
        }}
        onConfirm={() => {
          setSheet(null);
          touch('countryId');
        }}
      >
        <FlatList
          style={{ maxHeight: 320, alignSelf: 'stretch' }}
          data={profileForm.country.options}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <Pressable
              testID={`country-${item.id}`}
              onPress={() => {
                setProfile({ countryId: item.id });
                touch('countryId');
                setSheet(null);
              }}
              style={styles.countryRow}
            >
              <Text style={[styles.countryText, item.id === p.countryId && { color: colors.purple }]}>{tr(item.label)}</Text>
              {item.id === p.countryId && <Text style={{ color: colors.purple }}>✓</Text>}
            </Pressable>
          )}
        />
      </BottomSheet>

      <BottomSheet
        visible={sheet === 'birthday'}
        title={tr(profileForm.birthday.label)}
        confirmLabel={t('done')}
        onClose={() => {
          setSheet(null);
          touch('birthday');
        }}
        onConfirm={() => {
          const d = Math.min(draftBirth.d, daysIn(draftBirth.y, draftBirth.m));
          setProfile({ birthday: `${draftBirth.y}-${pad2(draftBirth.m)}-${pad2(d)}` });
          touch('birthday');
          setSheet(null);
        }}
      >
        <View style={styles.wheels}>
          <WheelPicker testID="wheel-year" values={YEARS} value={draftBirth.y} color={colors.text} width={84} onChange={(y) => setDraftBirth((b) => ({ ...b, y }))} />
          <WheelPicker testID="wheel-month" values={MONTHS} value={draftBirth.m} color={colors.text} format={pad2} onChange={(m) => setDraftBirth((b) => ({ ...b, m }))} />
          <WheelPicker
            testID="wheel-day"
            values={range(1, daysIn(draftBirth.y, draftBirth.m))}
            value={Math.min(draftBirth.d, daysIn(draftBirth.y, draftBirth.m))}
            color={colors.text}
            format={pad2}
            onChange={(d) => setDraftBirth((b) => ({ ...b, d }))}
          />
        </View>
      </BottomSheet>
    </QuestionLayout>
  );
}

function SelectField({ value, placeholder, error, onPress, testID }: { value: string | null; placeholder: string; error: boolean; onPress: () => void; testID: string }) {
  return (
    <Pressable testID={testID} accessibilityRole="button" onPress={onPress} style={[styles.field, error && styles.fieldError]}>
      <Text style={[styles.input, !value && { color: colors.placeholder }]}>{value ?? placeholder}</Text>
      <Text style={styles.chevron}>⌄</Text>
    </Pressable>
  );
}

function FieldError({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <Text accessibilityRole="alert" style={styles.error}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center', marginTop: 8, marginBottom: 6 },
  label: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 12 },
  genderRow: { flexDirection: 'row', gap: 10 },
  genderChip: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderChipSel: { borderColor: colors.purple, borderWidth: 2, backgroundColor: '#F1EEFF' },
  genderText: { fontSize: 16, fontWeight: '700', color: colors.text },
  field: {
    height: 52,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldError: { borderColor: colors.incorrect, borderWidth: 1.5 },
  input: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text },
  counter: { fontSize: 12, color: colors.placeholder },
  chevron: { fontSize: 18, color: colors.goldDark, marginTop: -6 },
  help: { fontSize: 12, lineHeight: 18, color: colors.black, marginTop: 6 },
  error: { fontSize: 12, color: colors.incorrect, marginTop: 4, fontWeight: '700' },
  countryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.goldBorder },
  countryText: { fontSize: 16, fontWeight: '700', color: colors.text },
  wheels: { flexDirection: 'row', gap: 12 },
});
