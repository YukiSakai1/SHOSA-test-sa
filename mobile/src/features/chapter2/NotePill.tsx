/**
 * 2章の注記ラベル（Figma Frame 294：#C6B695 の札。両端は上下の角が内側に丸く欠ける）。
 * 例：「ここでは正解を選ぶ必要はありません」「こんな仕事があります」「例：名前・人数・予約内容を確認する」
 * 端の幅 cap（ガイド・職種カードは 6、スキルの説明は 4）が、角の欠けの半径にもなる。
 */
import { useState } from 'react';
import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

export const NOTE_PILL = '#C6B695';

function Cap({ side, cap, height }: { side: 'left' | 'right'; cap: number; height: number }) {
  // 角の欠け（Figma の Vector：cap×cap。弧の外側を埋める）と、その間の細い四角
  const notch = `M ${cap} 0 C ${cap} ${cap * 0.5517} ${cap * 0.5517} ${cap} 0 ${cap} L ${cap} ${cap} L ${cap} 0 Z`;
  return (
    <Svg
      width={cap}
      height={height}
      viewBox={`0 0 ${cap} ${height}`}
      style={side === 'right' ? { transform: [{ scaleX: -1 }] } : undefined}
    >
      <Path d={notch} fill={NOTE_PILL} />
      <Rect x={0} y={cap} width={cap} height={Math.max(0, height - cap * 2)} fill={NOTE_PILL} />
      <Path d={notch} fill={NOTE_PILL} transform={`translate(0 ${height}) scale(1 -1)`} />
    </Svg>
  );
}

export function NotePill({
  children,
  height = 34,
  cap = 6,
  fontSize = 14,
  lineHeight = 24,
  style,
  textStyle,
}: {
  children: string;
  height?: number;
  cap?: number;
  fontSize?: number;
  lineHeight?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) {
  // 文が複数行になって札が高くなったら、両端の高さもそれに合わせる
  const [h, setH] = useState(height);
  return (
    <View style={[styles.row, { minHeight: height }, style]}>
      <Cap side="left" cap={cap} height={h} />
      <View style={[styles.body, { minHeight: height }]} onLayout={(e) => setH(Math.max(height, Math.round(e.nativeEvent.layout.height)))}>
        <Text style={[styles.text, { fontSize, lineHeight }, textStyle]}>{children}</Text>
      </View>
      <Cap side="right" cap={cap} height={h} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'stretch' },
  body: { flex: 1, backgroundColor: NOTE_PILL, justifyContent: 'center', paddingHorizontal: 6 },
  text: { color: '#FFFFFF', fontWeight: '700', textAlign: 'center' },
});
