/**
 * イントロスライド 4枚（Figma CH0-03〜06）。
 * ターコイズ柄の背景に、上がアーチ型に切り抜かれたクリーム色のパネルが重なるレイアウト。
 */
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { PatternBackground, patterns } from '@/components/PatternBackground';
import { CtaButton, Flourish } from '@/components/ui';
import { intro, introSlideCount } from '@/content/onboarding';
import { OnboardingHeader } from '@/features/onboarding/components';
import { useLang } from '@/i18n/LanguageProvider';
import { colors, fonts } from '@/theme/colors';
import { images } from '@/theme/images';
import { svgIcons } from '@/theme/svgIcons';

export default function IntroSlideScreen() {
  const { slide: raw } = useLocalSearchParams<{ slide: string }>();
  const insets = useSafeAreaInsets();
  const { tr } = useLang();
  const index = Number(raw);
  if (!Number.isInteger(index) || index < 0 || index >= introSlideCount) return <Redirect href="/onboarding/language" />;

  const next = () => {
    if (index + 1 < introSlideCount) router.push({ pathname: '/onboarding/intro/[slide]', params: { slide: String(index + 1) } });
    else router.push('/onboarding/greet');
  };

  const kind = (['welcome', 'features', 'steps', 'certification'] as const)[index]!;
  const data = intro[kind];

  return (
    <PatternBackground {...patterns.turquoise} style={{ paddingTop: insets.top }}>
      <OnboardingHeader />
      {kind === 'welcome' ? (
        <View style={styles.welcomeHead}>
          <Text style={styles.badge}>{tr(intro.welcome.badge)}</Text>
          <Image source={images.logoWhite} style={styles.logo} resizeMode="contain" />
        </View>
      ) : (
        <View style={styles.head}>
          <Text style={styles.title}>{tr(data.title)}</Text>
          <Image source={images.goldDivider} style={styles.divider} resizeMode="contain" />
        </View>
      )}
      <View style={styles.panel}>
        <ScrollView contentContainerStyle={styles.panelContent}>
          {kind === 'welcome' && <WelcomeBody />}
          {kind === 'features' && <FeaturesBody />}
          {kind === 'steps' && <StepsBody />}
          {kind === 'certification' && <CertificationBody />}
        </ScrollView>
        <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
          <CtaButton
            testID="onboarding-next"
            label={tr(data.button)}
            variant={kind === 'welcome' ? 'primary' : 'next'}
            onPress={next}
          />
        </View>
      </View>
    </PatternBackground>
  );
}

function WelcomeBody() {
  const { tr } = useLang();
  return (
    <>
      <Image source={images.intro1Hero} style={styles.phoneHero} resizeMode="contain" />
      <Text style={styles.welcomeTitle}>{tr(intro.welcome.title)}</Text>
    </>
  );
}

function FeaturesBody() {
  const { tr } = useLang();
  const bubbles = [images.introBubbleTl, images.introBubbleTr, images.introBubbleBl, images.introBubbleBr];
  return (
    <>
      <View style={styles.featuresStage}>
        <SvgXml xml={svgIcons.phone} width={150} height={250} />
        {bubbles.map((src, i) => (
          <View key={i} style={[styles.bubble, i % 2 === 0 ? { left: 0 } : { right: 0 }, { top: i < 2 ? 20 : 140 }]}>
            <Image source={src} style={styles.bubbleImg} resizeMode="contain" />
            <Text style={styles.bubbleLabel}>{tr(intro.features.labels[i]!)}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.body}>{tr(intro.features.lead)}</Text>
      <Text style={[styles.body, { marginTop: 8 }]}>{tr(intro.features.sub)}</Text>
    </>
  );
}

function StepsBody() {
  const { tr } = useLang();
  return (
    <>
      <View style={styles.stepsCard}>
        <Flourish corner="tl" color={colors.goldBorder} />
        <Flourish corner="tr" color={colors.goldBorder} />
        <Flourish corner="bl" color={colors.goldBorder} />
        <Flourish corner="br" color={colors.goldBorder} />
        {intro.steps.items.map((s, i) => (
          <View key={i} style={styles.stepRow}>
            <Image source={images[s.icon]} style={styles.stepIcon} resizeMode="contain" />
            <Text style={styles.stepHead}>{tr(s.head)}</Text>
            <Text style={styles.stepBody}>{tr(s.body)}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.body}>{tr(intro.steps.desc)}</Text>
    </>
  );
}

function CertificationBody() {
  const { tr } = useLang();
  const c = intro.certification;
  return (
    <>
      <Image source={images.intro4Report} style={styles.report} resizeMode="contain" />
      <Text style={styles.body}>{tr(c.reportLead)}</Text>
      <View style={styles.badgeRow}>
        {c.badges.map((b, i) => (
          <Text key={i} style={styles.reportBadge}>
            ✓ {tr(b)}
          </Text>
        ))}
      </View>
      {tr(c.reportTail) !== '' && <Text style={styles.body}>{tr(c.reportTail)}</Text>}
      <Text style={[styles.body, { marginTop: 10 }]}>{tr(c.desc)}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  welcomeHead: { alignItems: 'center', gap: 4, paddingBottom: 14 },
  badge: { fontFamily: fonts.montserrat, fontSize: 18, color: colors.white, letterSpacing: 1 },
  logo: { width: 200, height: 58 },
  head: { alignItems: 'center', paddingHorizontal: 21, paddingBottom: 12, gap: 8 },
  title: { fontSize: 18, fontWeight: '700', color: colors.white, textAlign: 'center', lineHeight: 27 },
  divider: { width: 120, height: 7, tintColor: colors.white },
  panel: {
    flex: 1,
    backgroundColor: colors.beige,
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
    overflow: 'hidden',
  },
  panelContent: { paddingHorizontal: 21, paddingTop: 36, paddingBottom: 12, alignItems: 'center' },
  bottom: { paddingHorizontal: 21, paddingTop: 8 },
  phoneHero: { width: 209, height: 300 },
  welcomeTitle: { marginTop: 16, fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center', lineHeight: 28 },
  featuresStage: { width: 340, height: 260, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  bubble: { position: 'absolute', width: 96, height: 96, alignItems: 'center', justifyContent: 'center' },
  bubbleImg: { position: 'absolute', width: 96, height: 96 },
  bubbleLabel: { marginTop: 34, fontSize: 12, fontWeight: '700', color: colors.text, textAlign: 'center' },
  body: { fontSize: 16, lineHeight: 26, color: colors.black, textAlign: 'center' },
  stepsCard: {
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    paddingVertical: 24,
    paddingHorizontal: 22,
    gap: 18,
    marginBottom: 18,
  },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepIcon: { width: 40, height: 40 },
  stepHead: { fontSize: 20, fontWeight: '700', color: colors.text },
  stepBody: { flex: 1, fontSize: 14, color: colors.text },
  // 「画像はイメージです」は画像に含まれている
  report: { width: 340, height: 275, marginBottom: 10 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginVertical: 6 },
  reportBadge: { fontSize: 16, fontWeight: '700', color: colors.teal },
});
