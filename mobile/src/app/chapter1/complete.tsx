/** 第1章 クリア画面（Web版 screen-ch101-complete） */
import { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CtaButton, LangToggle } from '@/components/ui';
import { chapter1 } from '@/content/chapter1';
import { markChapter1Completed } from '@/features/chapter1/progress';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
import { images } from '@/theme/images';

export default function Chapter1CompleteScreen() {
  const { tr } = useLang();
  const insets = useSafeAreaInsets();
  const { end } = chapter1;

  // メダルが上から落ちてきて弾む（Web版のトロフィー落下演出の簡易版）
  const drop = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(drop, {
      toValue: 1,
      duration: 900,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
  }, [drop]);
  const translateY = drop.interpolate({ inputRange: [0, 1], outputRange: [-220, 0] });

  const finish = async () => {
    await markChapter1Completed();
    router.dismissTo('/');
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 20 }]}>
      <LangToggle style={styles.lang} />
      <View style={styles.header}>
        <Image source={images.filigreeTop} style={styles.filigree} resizeMode="contain" />
        <Text style={styles.title}>{tr(end.title)}</Text>
        <Image source={images.filigreeBottom} style={styles.filigree} resizeMode="contain" />
      </View>
      <View style={styles.stage}>
        <View style={styles.halo} />
        <Animated.Image source={images.medal} style={[styles.medal, { transform: [{ translateY }] }]} resizeMode="contain" />
      </View>
      <Text style={styles.unlocked}>{tr(end.unlockLabel)}</Text>
      <View style={styles.divider} />
      <Text style={styles.body}>{tr(end.body)}</Text>
      <Text style={styles.note}>{tr(end.note)}</Text>
      <View style={{ flex: 1 }} />
      <CtaButton testID="chapter1-finish" label={tr(end.button)} onPress={() => void finish()} style={styles.cta} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.sky, paddingHorizontal: 24, alignItems: 'center' },
  lang: { alignSelf: 'flex-end' },
  header: { alignItems: 'center', marginTop: 8 },
  filigree: { width: 220, height: 20 },
  title: { fontSize: 28, fontWeight: '900', color: colors.white, marginVertical: 6 },
  stage: { height: 220, width: '100%', alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.25)' },
  medal: { width: 170, height: 170 },
  unlocked: { fontSize: 19, fontWeight: '900', color: colors.white, textAlign: 'center', lineHeight: 28 },
  divider: { height: 1.2, width: 200, backgroundColor: 'rgba(255,255,255,0.8)', marginVertical: 14 },
  body: { fontSize: 14, lineHeight: 22, color: colors.white, textAlign: 'center', fontWeight: '600' },
  note: { fontSize: 12, color: 'rgba(255,255,255,0.9)', marginTop: 10, textAlign: 'center' },
  cta: { backgroundColor: colors.purple },
});
