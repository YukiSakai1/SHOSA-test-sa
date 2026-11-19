/**
 * プロフィール入力（index.html #screen-ob-profile1、Figma CH0-16'）：性別・名前・出身国・誕生日。
 * すべて入力済みでエラーがないときだけ NEXT が押せる。
 * エラーは「一度触った項目」だけに表示する（入力前から赤字を出さない）。
 * ルールとメッセージは features/onboarding/validation.ts（暫定仕様）。
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { router } from 'expo-router';
import { Animated, FlatList, Image, ImageBackground, Pressable, StyleSheet, Text, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';
import { BottomSheet } from '@/components/BottomSheet';
import { pad2, range, WheelPicker } from '@/components/WheelPicker';
import { profileForm } from '@/content/onboarding';
import { blockProgress, QuestionLayout } from '@/features/onboarding/components';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import { countChars, NAME_MAX_LENGTH, validateProfile, type ProfileField } from '@/features/onboarding/validation';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
import { images } from '@/theme/images';
import { nativeDriver, useReducedMotion } from '@/theme/motion';
import { PressScale } from '@/components/ui';

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

  // index.html と同じく、最初から性別は「男性」、誕生日は 2000/01/01 を選んだ状態にする（名前と出身国は未入力）
  useEffect(() => {
    if (!p.gender || !p.birthday) setProfile({ gender: p.gender ?? 'male', birthday: p.birthday ?? '2000-01-01' });
    // 開いたときに 1回だけ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <QuestionLayout background="#FAF8F2" percent={blockProgress(valid ? 6 : 5)} nextDisabled={!valid} onNext={() => router.push('/onboarding/journey')}>
      {/* QuestionLayout は子要素の間に 10 の間隔を入れるため、フォーム全体を1つにまとめて Figma の縦位置に合わせる */}
      <View>
      <Text style={styles.title}>{tr(profileForm.title)}</Text>
      <Image source={images.goldDivider} style={styles.divider} resizeMode="contain" />

      {/* 性別 */}
      <FieldLabel text={tr(profileForm.gender.label)} />
      <Shake trigger={!!errorFor('gender')} style={styles.genderRow}>
        {profileForm.gender.options.map((g) => {
          const sel = p.gender === g.id;
          return (
            <PressScale
              key={g.id}
              testID={`gender-${g.id}`}
              accessibilityRole="radio"
              accessibilityState={{ checked: sel }}
              onPress={() => {
                setProfile({ gender: g.id });
                touch('gender');
              }}
              containerStyle={{ flex: 1 }}
            >
              {/* index.html：radio_selected / radio_unselected の画像（116×68） */}
              <ImageBackground
                source={sel ? images.radioSelected : images.radioUnselected}
                resizeMode="stretch"
                style={styles.genderChip}
                imageStyle={styles.fill}
              >
                <Text style={[styles.genderText, sel && { color: colors.purple }]}>{tr(g.label)}</Text>
              </ImageBackground>
            </PressScale>
          );
        })}
      </Shake>
      <FieldError text={errorFor('gender')} />

      {/* 名前 */}
      <FieldLabel text={tr(profileForm.name.label)} />
      <Shake trigger={!!errorFor('name')} style={[styles.field, errorFor('name') && styles.fieldError]}>
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
      </Shake>
      <Text style={styles.help}>{tr(profileForm.name.help)}</Text>
      <FieldError text={errorFor('name') ?? (countChars(p.name.trim()) > NAME_MAX_LENGTH && errors.name ? tr(errors.name) : null)} />

      {/* 出身国 */}
      <FieldLabel text={tr(profileForm.country.label)} />
      <SelectField
        testID="country-select"
        value={country ? tr(country.label) : null}
        placeholder={tr(profileForm.country.placeholder)}
        error={!!errorFor('countryId')}
        onPress={() => setSheet('country')}
      />
      <FieldError text={errorFor('countryId')} />

      {/* 誕生日 */}
      <FieldLabel text={tr(profileForm.birthday.label)} />
      <SelectField
        testID="birthday-select"
        value={p.birthday ? p.birthday.replace(/-/g, '/') : null}
        placeholder={tr(profileForm.birthday.placeholder)}
        error={!!errorFor('birthday')}
        onPress={openBirthday}
      />
      <FieldError text={errorFor('birthday')} />
      </View>

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
          showsVerticalScrollIndicator={false}
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
    <Shake trigger={error}>
    <Pressable testID={testID} accessibilityRole="button" onPress={onPress} style={[styles.field, error && styles.fieldError]}>
      <Text style={[styles.input, !value && { color: colors.placeholder }]}>{value ?? placeholder}</Text>
      <Text style={styles.chevron}>∨</Text>
    </Pressable>
    </Shake>
  );
}

/** 項目名。index.html と同じく、入力済みでもチェックマークは出さない */
function FieldLabel({ text }: { text: string }) {
  return (
    <View style={styles.labelRow}>
      <Text style={styles.labelText}>{text}</Text>
    </View>
  );
}


/** エラーが出た瞬間に横に揺れる（要点 CH0-15/16'：エラー時の横揺れ。視差効果を減らす ON のときは揺らさない） */
function Shake({ trigger, style, children }: { trigger: boolean; style?: StyleProp<ViewStyle>; children: ReactNode }) {
  const reduced = useReducedMotion();
  const x = useRef(new Animated.Value(0)).current;
  const was = useRef(trigger);
  useEffect(() => {
    if (trigger && !was.current && !reduced) {
      Animated.sequence(
        [8, -8, 6, -6, 0].map((v) => Animated.timing(x, { toValue: v, duration: 50, useNativeDriver: nativeDriver })),
      ).start();
    }
    was.current = trigger;
  }, [trigger, reduced, x]);
  return <Animated.View style={[style, { transform: [{ translateX: x }] }]}>{children}</Animated.View>;
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
  // 縦位置は index.html（タイトル 73 / 区切り線 110 / 性別 143 / 名前 257 / 出身国 409 / 誕生日 523）
  title: { fontSize: 18, lineHeight: 27, fontWeight: '700', color: colors.text, textAlign: 'center', marginTop: 27 },
  divider: { alignSelf: 'center', width: 240, height: 13, marginTop: 10 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 16, marginTop: 20, marginBottom: 10 },
  labelText: { fontSize: 16, lineHeight: 16, fontWeight: '700', color: colors.text },
  genderRow: { flexDirection: 'row', gap: 6 },
  genderChip: { height: 68, alignItems: 'center', justifyContent: 'center' },
  fill: { width: '100%', height: '100%' },
  genderText: { fontSize: 16, fontWeight: '700', color: colors.text },
  // 入力欄：白・2px #DDDDDD の枠・角丸 10、高さ 68
  field: {
    height: 68,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DDDDDD',
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldError: { borderColor: colors.incorrect },
  input: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text },
  chevron: { fontSize: 14, fontWeight: '800', color: '#9CA3AF' },
  help: { fontSize: 12, lineHeight: 16, color: colors.black, marginTop: 6 },
  error: { fontSize: 12, color: colors.incorrect, marginTop: 4, fontWeight: '700' },
  countryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.goldBorder },
  countryText: { fontSize: 16, fontWeight: '700', color: colors.text },
  wheels: { flexDirection: 'row', gap: 12 },
});
