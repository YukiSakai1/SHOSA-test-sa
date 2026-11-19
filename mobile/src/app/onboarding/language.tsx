/**
 * 言語選択（index.html #screen-ob-langselect / .figma-langselect-screen）。
 * ベージュの線の柄の背景に、SHOSA（110×100）としっぽ付きの吹き出し画像（228×76）、
 * チケット型のカード（360×90、間隔 10）、ターコイズの立体 NEXT（高さ 48・18px）。
 * 選ぶとその場でアプリ全体の表示言語が切り替わる。
 * index.html では戻るボタンがあるが、M-31（戻るボタンを出す画面は未定）に合わせて出していない。
 */
import { useState } from 'react';
import { router } from 'expo-router';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Appear } from '@/components/Appear';
import { Icon } from '@/components/Icon';
import { PatternBackground, patterns } from '@/components/PatternBackground';
import { CtaButton, PressScale } from '@/components/ui';
import { languageOptions } from '@/content/onboarding';
import { SmallMascot } from '@/features/onboarding/components';
import type { Lang } from '@/content/types';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
import { centered, layout } from '@/theme/layout';
import { images } from '@/theme/images';

export default function LanguageScreen() {
  const { lang, setLang, t, tr } = useLang();
  const insets = useSafeAreaInsets();
  // index.html（Figma CH0-08 も同じ）は最初から選択済み。いまの表示言語を選んだ状態で始める
  const [selected, setSelected] = useState<Lang>(lang);

  return (
    <PatternBackground {...patterns.beigeLines} align="center" style={{ paddingTop: insets.top }}>
      <Appear from="none" duration={300} style={styles.hero}>
        <SmallMascot />
        <ImageBackground source={images.speechBubbleTail} resizeMode="contain" style={styles.bubble} imageStyle={styles.fill}>
          <Text style={styles.bubbleText}>{'Please select\nyour language setting.'}</Text>
        </ImageBackground>
      </Appear>

      <Appear delay={200} duration={300} style={styles.cards}>
        {languageOptions.map((o) => {
          const on = selected === o.lang;
          return (
            <PressScale
              key={o.id}
              testID={`lang-${o.id}`}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              onPress={() => {
                setSelected(o.lang);
                setLang(o.lang);
              }}
            >
              <ImageBackground
                source={on ? images.cardBorderSelected : images.cardBorderUnselected}
                resizeMode="stretch"
                style={styles.card}
                imageStyle={styles.fill}
              >
                {o.icon && <Icon icon={o.icon} size={40} />}
                <Text style={[styles.cardLabel, on && styles.cardLabelOn]}>{tr(o.label)}</Text>
              </ImageBackground>
            </PressScale>
          );
        })}
      </Appear>

      <View style={{ flex: 1 }} />
      <View style={[styles.bottom, { paddingBottom: insets.bottom + layout.ctaBottom }]}>
        <CtaButton
          testID="onboarding-next"
          fontSize={18}
          ledge={{ color: colors.teal, depth: 3 }}
          label={t('next')}
          onPress={() => router.push({ pathname: '/onboarding/intro/[slide]', params: { slide: '0' } })}
        />
      </View>
    </PatternBackground>
  );
}

const styles = StyleSheet.create({
  // SHOSA は (28,67)、吹き出しは (146,81)
  hero: { ...centered, flexDirection: 'row', alignItems: 'flex-start', marginTop: 67, paddingLeft: 28 },
  bubble: { width: 228, height: 76, marginLeft: 8, marginTop: 14, paddingLeft: 32, justifyContent: 'center' },
  bubbleText: { fontSize: 16, lineHeight: 22, color: colors.black },
  fill: { width: '100%', height: '100%' },
  // カードは y197 から（間隔 10）。左右 21
  cards: { ...centered, marginTop: 33, paddingHorizontal: layout.sideMargin, gap: 10 },
  card: { height: 90, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 34, gap: 22 },
  cardLabel: { fontSize: 15, fontWeight: '700', color: colors.text, letterSpacing: 0.5 },
  cardLabelOn: { color: colors.purple, fontWeight: '800' },
  bottom: { ...centered, paddingHorizontal: layout.sideMargin },
});
