/**
 * タイトル／ログイン画面（index.html .figma-ch0-01-screen）。
 * 認証は未実装（バックエンド未定）のため、どのボタンも次の画面へ進むだけ。
 * 0章が未完了なら 0章（言語選択）へ、1章が未完了なら 1章へ、どちらも終えていれば 2章へ進む。
 */
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { Appear } from '@/components/Appear';
import { PatternBackground, patterns } from '@/components/PatternBackground';
import { PressScale } from '@/components/ui';
import { useChapter1Completed } from '@/features/chapter1/progress';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import { useLang } from '@/i18n/LanguageProvider';
import { colors, fonts } from '@/theme/colors';
import { layout } from '@/theme/layout';
import { nativeDriver, useReducedMotion } from '@/theme/motion';
import { images } from '@/theme/images';
import { svgIcons } from '@/theme/svgIcons';

/** M-26：認証を待つ時間（認証は未実装のため仮。Web版と同じ 0.6秒） */
const FAKE_AUTH_MS = 600;
/** index.html：タグラインの色。ロゴも brightness(0.251) で同じ色に沈めている */
const TITLE_INK = '#404040';

export default function TitleScreen() {
  const { t } = useLang();
  const insets = useSafeAreaInsets();
  const { record, reset } = useOnboarding();
  const chapter1Done = useChapter1Completed();
  const [authing, setAuthing] = useState<'google' | 'apple' | null>(null);
  const [mascotIn, setMascotIn] = useState(false);
  // index.html .ch01-shield-wrap：盾は「画面幅 + 42」の幅で中央に置き、高さは 444:617 の比率。中身も盾の幅に合わせて伸び縮みする
  const { width: windowW } = useWindowDimensions();
  const [screenW, setScreenW] = useState(windowW);
  const shieldW = screenW + 42;
  const shieldH = (shieldW * 617) / 444;
  // index.html では盾と中身はセーフエリアに関係なく画面上端から置く（ボタンだけ下のセーフエリアを空ける）
  const shieldTop = -41;
  const contentTop = shieldTop + shieldW * 0.37; // padding-top: 37%（402 幅で上端 123）
  const logoW = Math.min(shieldW * 0.637, 283);
  const logoH = (logoW * 82) / 283;
  const mascotW = Math.min(shieldW * 0.446, 198);
  const mascotTop = contentTop + 22 + 21 + logoH + 44;

  // ホーム画面はデザイン未確定のため、進み具合に応じて次の章へ直接進む
  const start = () => {
    if (!record.completed) router.push('/onboarding/language');
    else if (!chapter1Done) router.push('/chapter1');
    else router.push('/chapter2');
  };

  // M-26：Google / Apple は押したボタンの中にスピナーを出し、他の2つを押せなくする。電話番号は遷移だけ
  const startWithAuth = (provider: 'google' | 'apple') => {
    setAuthing(provider);
    setTimeout(() => {
      setAuthing(null);
      if (provider === 'google') restartChapter0();
      else start();
    }, FAKE_AUTH_MS);
  };

  // 「Googleで続ける」は毎回 0章の最初（言語選択）から。0章の回答（ヒアリング・プロフィール・適性診断など）も消してやり直す
  // （1章・2章の進み具合はそのまま）
  const restartChapter0 = () => {
    reset();
    router.push('/onboarding/language');
  };

  return (
    <PatternBackground {...patterns.turquoise}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none" onLayout={(e) => setScreenW(e.nativeEvent.layout.width)} />
      <Image source={images.titleShield} style={[styles.shield, { top: shieldTop, width: shieldW, height: shieldH }]} resizeMode="contain" />
      <View style={[styles.shieldContent, { top: contentTop }]}>
        {/* M-19：0.2秒後にフェードイン（下からの移動なし） */}
        <Appear from="none" delay={200} duration={300}>
          <Text style={styles.tagline}>{t('titleTagline')}</Text>
        </Appear>
        {/* M-20：0.4秒後に少し下から上へ動きながらフェードイン */}
        <Appear from="up" delay={400} duration={400} distance={12}>
          <Image source={images.logoWhite} style={{ width: logoW, height: logoH }} resizeMode="contain" tintColor={TITLE_INK} />
        </Appear>
      </View>
      {/* M-21：0.6秒後に下から小さく弾んで登場 → M-23 / M-24 の呼吸へ */}
      <Appear from="pop" delay={600} duration={500} style={[styles.mascotWrap, { top: mascotTop }]} onDone={() => setMascotIn(true)}>
        <BreathingMascot active={mascotIn} width={mascotW} />
      </Appear>
      <View style={{ flex: 1 }} />
      {/* M-22：0.9秒後から、上のボタンから順に 0.1秒ずつずらしてせり上がる（0.3秒） */}
      <View style={[styles.buttons, { paddingBottom: insets.bottom + layout.ctaBottom }]}>
        <Appear from="up" delay={900} duration={300} distance={24}>
          <LoginButton testID="login-google" label={t('loginGoogle')} bg={colors.white} fg={colors.black} icon={svgIcons.google}
            bordered loading={authing === 'google'} disabled={authing !== null} onPress={() => startWithAuth('google')} />
        </Appear>
        <Appear from="up" delay={1000} duration={300} distance={24}>
          <LoginButton testID="login-apple" label={t('loginApple')} bg={colors.black} fg={colors.white} icon={svgIcons.apple}
            iconWidth={14} gap={5} loading={authing === 'apple'} disabled={authing !== null} onPress={() => startWithAuth('apple')} />
        </Appear>
        <Appear from="up" delay={1100} duration={300} distance={24}>
          <LoginButton testID="login-phone" label={t('loginPhone')} bg={colors.purple} fg={colors.white}
            disabled={authing !== null} onPress={start} />
        </Appear>
      </View>
    </PatternBackground>
  );
}

/**
 * M-23：上下に 3px、2秒周期でゆっくり呼吸する。M-24：足元の影も呼吸に合わせて伸び縮みする。
 * M-27：視差効果を減らす ON のときは止める。M-25（まばたき）は目の別素材が必要なため未実装（要相談）。
 */
function BreathingMascot({ active, width }: { active: boolean; width: number }) {
  const reduced = useReducedMotion();
  const b = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!active || reduced) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(b, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: nativeDriver }),
        Animated.timing(b, { toValue: 0, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: nativeDriver }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, reduced, b]);
  const translateY = b.interpolate({ inputRange: [0, 1], outputRange: [0, -3] });
  const shadowScale = b.interpolate({ inputRange: [0, 1], outputRange: [1, 0.92] });
  return (
    <View style={{ alignItems: 'center' }}>
      <Animated.Image source={images.floorShadow} style={[styles.shadow, { transform: [{ scaleX: shadowScale }] }]} resizeMode="contain" />
      <Animated.Image source={images.mascotFace} style={[{ width, height: (width * 179) / 198 }, { transform: [{ translateY }] }]} resizeMode="contain" />
    </View>
  );
}

function LoginButton({
  label,
  bg,
  fg,
  icon,
  onPress,
  loading = false,
  disabled = false,
  bordered = false,
  iconWidth = 20,
  gap = 11,
  testID,
}: {
  label: string;
  bg: string;
  fg: string;
  icon?: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  /** Google だけ 1px #747775 の枠線 */
  bordered?: boolean;
  iconWidth?: number;
  gap?: number;
  testID: string;
}) {
  return (
    <PressScale testID={testID} disabled={disabled} onPress={onPress} style={[styles.login, { backgroundColor: bg, gap }, bordered && styles.loginBorder]}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon && <SvgXml xml={icon} width={iconWidth} height={20} />}
          <Text style={[styles.loginText, { color: fg }]}>{label}</Text>
        </>
      )}
    </PressScale>
  );
}

const styles = StyleSheet.create({
  // Web では画像に width を指定しないと元画像の幅のままになるため、幅も明示する
  shield: { position: 'absolute', left: -21 },
  // タグライン（15px）→ 21 → ロゴ（283×82）
  shieldContent: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  // index.html のタグラインは Roboto（Web は Google Fonts を読み込む）
  tagline: { fontSize: 15, lineHeight: 22, fontWeight: '700', color: TITLE_INK, marginBottom: 21, fontFamily: fonts.roboto },
  mascotWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  // .ch01-mascot-shadow：132×30、マスコットの上端から 158
  shadow: { position: 'absolute', top: 158, width: 132, height: 30 },
  // Figma CH0-01 の Frame 95：幅 342（左右 30）、高さ 54、間隔 18
  // .ch01-bottom-actions：最大幅 342 で中央（広い画面でも伸ばさない）
  buttons: { width: '100%', maxWidth: 342 + 60, alignSelf: 'center', paddingHorizontal: 30, gap: 18, paddingTop: 16 },
  login: {
    height: 54,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBorder: { borderWidth: 1, borderColor: '#747775' },
  loginText: { fontSize: 19, fontWeight: '600' },
});
