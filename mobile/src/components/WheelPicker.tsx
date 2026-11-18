/**
 * iOS 風のドラムロール（ホイール）選択。iOS / Android / Web 共通で動く ScrollView 実装。
 * 時刻（時・分）と誕生日（年・月・日）の選択で使う。
 * M-36：指を離すと、いちばん近い数字が中央の帯に吸着する（snapToInterval）。3D の回転はしない。
 */
import { useEffect, useRef, type ComponentRef } from 'react';
import { haptics } from '@/lib/haptics';
import { Platform, ScrollView, StyleSheet, Text, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

const ITEM_H = 40;
const VISIBLE = 5;

interface Props<T extends string | number> {
  values: readonly T[];
  value: T;
  onChange: (v: T) => void;
  format?: (v: T) => string;
  width?: number;
  color?: string;
  testID?: string;
}

export function WheelPicker<T extends string | number>({ values, value, onChange, format, width = 64, color = '#FFFFFF', testID }: Props<T>) {
  const ref = useRef<ComponentRef<typeof ScrollView>>(null);
  const index = Math.max(0, values.indexOf(value));
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    ref.current?.scrollTo({ y: index * ITEM_H, animated: false });
    // 値が外から変わったときだけ位置を合わせる
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const settle = (y: number) => {
    const i = Math.max(0, Math.min(values.length - 1, Math.round(y / ITEM_H)));
    const v = values[i];
    if (v !== undefined && v !== value) onChange(v);
  };

  // M-36：1目盛り動くごとに軽い触覚を出す
  const lastTick = useRef(index);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const tick = Math.round(y / ITEM_H);
    if (tick !== lastTick.current) {
      lastTick.current = tick;
      haptics.select();
    }
    // Web には momentum 終了イベントが無いので、スクロールが止まったら確定する
    if (Platform.OS !== 'web') return;
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => settle(y), 120);
  };

  return (
    <View style={{ width, height: ITEM_H * VISIBLE }} testID={testID}>
      <View pointerEvents="none" style={[styles.selection, { borderColor: color }]} />
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        onMomentumScrollEnd={(e) => settle(e.nativeEvent.contentOffset.y)}
        onScroll={onScroll}
        scrollEventThrottle={32}
        contentContainerStyle={{ paddingVertical: ITEM_H * Math.floor(VISIBLE / 2) }}
      >
        {values.map((v, i) => {
          const d = Math.abs(i - index);
          return (
            <View key={String(v)} style={styles.item}>
              <Text
                style={{
                  color,
                  opacity: d === 0 ? 1 : 0.7,
                  fontSize: d === 0 ? 22 : d === 1 ? 20 : 18,
                  fontWeight: '700',
                }}
              >
                {format ? format(v) : String(v)}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { height: ITEM_H, alignItems: 'center', justifyContent: 'center' },
  selection: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: ITEM_H * Math.floor(VISIBLE / 2),
    height: ITEM_H,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    opacity: 0.4,
  },
});

export const pad2 = (n: number) => String(n).padStart(2, '0');
export const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
