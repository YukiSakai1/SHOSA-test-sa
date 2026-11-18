/**
 * タイトル／ログイン画面（Figma CH0-01）。
 * 認証は未実装（バックエンド未定）のため、どのボタンも次の画面へ進むだけ。
 * 0章が未完了なら 0章（言語選択）へ、1章が未完了なら 1章へ、どちらも終えていれば 2章へ進む。
 */
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { PatternBackground, patterns } from '@/components/PatternBackground';
import { useChapter1Completed } from '@/features/chapter1/progress';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
import { images } from '@/theme/images';
import { svgIcons } from '@/theme/svgIcons';

export default function TitleScreen() {
  const { t } = useLang();
  const insets = useSafeAreaInsets();
  const { record } = useOnboarding();
  const chapter1Done = useChapter1Completed();

  // ホーム画面はデザイン未確定のため、進み具合に応じて次の章へ直接進む
  const start = () => {
    if (!record.completed) router.push('/onboarding/language');
    else if (!chapter1Done) router.push('/chapter1');
    else router.push('/chapter2');
  };

  return (
    <PatternBackground {...patterns.turquoise}>
      <View style={[styles.shieldWrap, { paddingTop: insets.top }]}>
        <Image source={images.titleShield} style={styles.shield} resizeMode="stretch" />
        <View style={[styles.shieldContent, { top: insets.top + 56 }]}>
          <Text style={styles.tagline}>{t('titleTagline')}</Text>
          <Image source={images.logoWhite} style={styles.logo} resizeMode="contain" tintColor={colors.text} />
        </View>
        <View style={styles.mascotWrap}>
          <Image source={images.floorShadow} style={styles.shadow} resizeMode="contain" />
          <Image source={images.mascotFace} style={styles.mascot} resizeMode="contain" />
        </View>
      </View>
      <View style={[styles.buttons, { paddingBottom: insets.bottom + 24 }]}>
        <LoginButton testID="login-google" label={t('loginGoogle')} bg={colors.white} fg={colors.black} icon={svgIcons.google} onPress={start} />
        <LoginButton testID="login-apple" label={t('loginApple')} bg={colors.black} fg={colors.white} icon={svgIcons.apple} onPress={start} />
        <LoginButton testID="login-phone" label={t('loginPhone')} bg={colors.purple} fg={colors.white} onPress={start} />
      </View>
    </PatternBackground>
  );
}

function LoginButton({
  label,
  bg,
  fg,
  icon,
  onPress,
  testID,
}: {
  label: string;
  bg: string;
  fg: string;
  icon?: string;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.login, { backgroundColor: bg, opacity: pressed ? 0.85 : 1 }]}
    >
      {icon && <SvgXml xml={icon} width={18} height={18} />}
      <Text style={[styles.loginText, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shieldWrap: { flex: 1, alignItems: 'center' },
  // Web では画像に width を指定しないと元画像の幅のままになるため、幅も明示する
  shield: { position: 'absolute', top: 0, left: '-5%', width: '110%', height: '100%' },
  shieldContent: { position: 'absolute', alignItems: 'center', gap: 6 },
  tagline: { fontSize: 13, fontWeight: '700', color: colors.text, letterSpacing: 0.3 },
  logo: { width: 260, height: 76 },
  mascotWrap: { position: 'absolute', bottom: '14%', alignItems: 'center' },
  mascot: { width: 198, height: 179 },
  shadow: { position: 'absolute', bottom: -6, width: 140, height: 26 },
  buttons: { paddingHorizontal: 21, gap: 12, paddingTop: 16 },
  login: {
    height: 48,
    borderRadius: 31,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loginText: { fontSize: 17, fontWeight: '600' },
});
