/**
 * 完了画面の共通演出（0章「適性診断 完了！」/ 1章「学習完了！」）。
 * サンバースト背景＋白い円＋メダルが「フェードイン＋拡大」で出る（Figma 注記）。
 */
import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { images, type ImageKey } from '@/theme/images';

interface Props {
  background: string;
  title: string;
  medal: ImageKey;
  children: ReactNode;
  footer: ReactNode;
}

export function Celebration({ background, title, medal, children, footer }: Props) {
  const insets = useSafeAreaInsets();
  const appear = useRef(new Animated.Value(0)).current;
  const body = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    // sequence だと Web で2つ目が始まらないことがあるため、delay 付きの parallel にしている
    Animated.parallel([
      Animated.timing(appear, { toValue: 1, duration: 600, easing: Easing.out(Easing.back(1.6)), useNativeDriver: true }),
      Animated.timing(body, { toValue: 1, duration: 400, delay: 600, useNativeDriver: true }),
    ]).start();
  }, [appear, body]);

  return (
    <View style={[styles.screen, { backgroundColor: background, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 16 }]}>
      <Image source={images.sunburst} style={styles.sunburst} resizeMode="cover" />
      <View style={styles.header}>
        <Image source={images.filigreeTop} style={styles.filigree} resizeMode="contain" />
        <Text style={styles.title}>{title}</Text>
        <Image source={images.filigreeBottom} style={styles.filigree} resizeMode="contain" />
      </View>
      <Animated.View style={[styles.stage, { opacity: appear, transform: [{ scale: appear.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }]}>
        <View style={styles.halo} />
        <Image source={images[medal]} style={styles.medal} resizeMode="contain" />
      </Animated.View>
      <Animated.View style={[styles.body, { opacity: body }]}>{children}</Animated.View>
      <View style={{ flex: 1 }} />
      <View style={styles.footer}>{footer}</View>
    </View>
  );
}

export const celebrationText = StyleSheet.create({
  unlocked: { fontSize: 20, fontWeight: '700', color: colors.white, textAlign: 'center', lineHeight: 28 },
  body: { fontSize: 16, lineHeight: 24, color: colors.white, textAlign: 'center', marginTop: 14 },
  note: { fontSize: 12, color: colors.white, textAlign: 'center', marginTop: 8 },
});

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', paddingHorizontal: 21, overflow: 'hidden' },
  sunburst: { position: 'absolute', top: 40, width: 540, height: 540, opacity: 0.9 },
  header: { alignItems: 'center' },
  filigree: { width: 348, height: 19 },
  title: { fontSize: 22, fontWeight: '700', color: colors.white, marginVertical: 8 },
  stage: { height: 280, width: 280, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  halo: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: colors.white, opacity: 0.25 },
  medal: { width: 180, height: 204 },
  body: { alignSelf: 'stretch', marginTop: 8 },
  footer: { alignSelf: 'stretch', gap: 10 },
});
