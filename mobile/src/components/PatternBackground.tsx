/**
 * Figma の PATTERN 塗り（菱形とドットのタイル）を再現する背景。
 * 0章（ターコイズ／ベージュ）と1章ガイド（スカイ）で使う。
 */
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Pattern, Polygon, Rect } from 'react-native-svg';

const TILE = 140;

interface Props {
  color: string;
  /** 模様の色（rgba 推奨） */
  patternColor: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

export function PatternBackground({ color, patternColor, style, children }: Props) {
  const s = TILE / 180; // 元の SVG（180px タイル）からの縮尺
  const p = (pts: number[][]) => pts.map(([x, y]) => `${x! * s},${y! * s}`).join(' ');
  return (
    <View style={[{ flex: 1, backgroundColor: color }, style]}>
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <Pattern id="tile" patternUnits="userSpaceOnUse" width={TILE} height={TILE}>
            <Polygon points={p([[8.13, 8.13], [43.23, 46.77], [81.87, 81.87], [46.77, 43.23]])} fill={patternColor} />
            <Polygon points={p([[171.87, 8.13], [133.23, 43.23], [98.13, 81.87], [136.77, 46.77]])} fill={patternColor} />
            <Polygon points={p([[8.13, 171.87], [46.77, 136.77], [81.87, 98.13], [43.23, 133.23]])} fill={patternColor} />
            <Polygon points={p([[171.87, 171.87], [136.77, 133.23], [98.13, 98.13], [133.23, 136.77]])} fill={patternColor} />
            {[
              [90, 90],
              [0, 0],
              [180, 0],
              [0, 180],
              [180, 180],
            ].map(([cx, cy], i) => (
              <Circle key={i} cx={cx! * s} cy={cy! * s} r={5.8 * s} fill={patternColor} />
            ))}
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#tile)" />
      </Svg>
      {children}
    </View>
  );
}

export const patterns = {
  turquoise: { color: '#00C9C3', patternColor: 'rgba(255,255,255,0.22)' },
  beige: { color: '#F6F1E8', patternColor: 'rgba(175,145,110,0.30)' },
  sky: { color: '#6DCAF1', patternColor: 'rgba(255,255,255,0.22)' },
} as const;
