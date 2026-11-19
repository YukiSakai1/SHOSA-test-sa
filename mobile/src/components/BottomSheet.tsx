/**
 * 下からせり上がるシート（時刻・誕生日・出身国の選択で使う）。
 * M-34：開くと下からせり上がり、同時に背景が暗くなる（0.3秒、跳ね返らない。背景のぼかしは未定のためなし）。
 * M-35：決定ボタンで閉じると onConfirm、×・背景で閉じると onClose（どちらも下へ降りて閉じる 0.25秒、弾まない）。
 * ×・背景で閉じたときは、選んだ値を反映しない（呼び出し側で onClose では何も保存しない）。
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { AppModal } from '@/components/AppModal';
import { CtaButton } from '@/components/ui';
import { colors } from '@/theme/colors';
import { motion, useReducedMotion } from '@/theme/motion';

interface Props {
  visible: boolean;
  title: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  children: ReactNode;
  /** シートの背景色（時刻はターコイズ、それ以外はクリーム） */
  tone?: 'turquoise' | 'cream';
}

export function BottomSheet(props: Props) {
  // 閉じるアニメーションが終わるまで Modal を残しておく
  const [mounted, setMounted] = useState(props.visible);
  useEffect(() => {
    if (props.visible) setMounted(true);
  }, [props.visible]);
  if (!mounted) return null;
  return (
    <AppModal visible onRequestClose={props.onClose}>
      <SheetContent {...props} closing={!props.visible} onClosed={() => setMounted(false)} />
    </AppModal>
  );
}

/**
 * Modal の中身。アニメーションは「中身が実際に描画された後」に始める
 * （Web の Modal は中身を少し遅れて描画するため、外側で始めると動かない）。
 */
function SheetContent({
  title,
  confirmLabel,
  onConfirm,
  onClose,
  children,
  tone = 'cream',
  closing,
  onClosed,
}: Props & { closing: boolean; onClosed: () => void }) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const reduced = useReducedMotion();
  const dark = tone === 'turquoise';
  // Web の Modal の中では Animated の値が描画に反映されないことがあるため、
  // requestAnimationFrame で進み具合（0〜1）を計算して描画する。iOS / Android でも同じ動きになる
  const [p, setP] = useState(0);
  const pRef = useRef(0);
  useEffect(() => {
    const from = pRef.current;
    const to = closing ? 0 : 1;
    const duration = reduced ? motion.reducedFadeMs : closing ? motion.sheetCloseMs : motion.sheetOpenMs;
    const ease = closing ? (t: number) => t * t * t : (t: number) => 1 - Math.pow(1 - t, 3);
    const start = Date.now();
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      const v = from + (to - from) * ease(t);
      pRef.current = v;
      setP(v);
      if (t < 1) raf = requestAnimationFrame(tick);
      else if (closing) onClosed();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing]);

  const translateY = reduced ? 0 : (1 - p) * height;

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={[styles.backdrop, { opacity: p }]}>
        <Pressable testID="sheet-backdrop" style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="close" />
      </View>
      <View
        style={[
          styles.sheet,
          { backgroundColor: dark ? colors.turquoise : colors.beige, paddingBottom: insets.bottom + 16, transform: [{ translateY }] },
          reduced && { opacity: p },
        ]}
      >
        <View style={styles.grabber} />
        <View style={styles.titleRow}>
          <View style={{ width: 28 }} />
          <Text style={[styles.title, { color: dark ? colors.white : colors.text }]}>{title}</Text>
          <Pressable testID="sheet-close" accessibilityRole="button" accessibilityLabel="close" hitSlop={10} onPress={onClose}>
            <Svg width={28} height={28} viewBox="0 0 28 28">
              <Path d="M 8,8 L 20,20 M 20,8 L 8,20" stroke={dark ? colors.white : colors.goldDark} strokeWidth={2.6} strokeLinecap="round" />
            </Svg>
          </Pressable>
        </View>
        <View style={styles.body}>{children}</View>
        <CtaButton testID="sheet-confirm" label={confirmLabel} variant={dark ? 'primary' : 'next'} onPress={onConfirm} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: colors.dialogOverlay },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 21, paddingTop: 10, gap: 14 },
  grabber: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.15)' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { flex: 1, fontSize: 18, fontWeight: '700', textAlign: 'center' },
  body: { alignItems: 'center', justifyContent: 'center' },
});
