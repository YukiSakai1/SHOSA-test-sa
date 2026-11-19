/**
 * 柄つきの背景。index.html / Figma のタイル柄を SVG の Pattern で敷き詰める。
 * - diamond：菱形とドット（pattern_turquoise.svg / pattern_beige.svg と同じ。元は 180px タイル）
 * - lines：細い菱形の線と端のドット（index.html の --shosa-beige-pattern。95.46px タイル、#E6D8BD の 25%）
 * - image：画像を並べる（tileImage。例：カーペット carpet_beige.jpg を幅 200 で）
 *
 * 注意（Web）：Svg は width / height を属性で渡さないと 300×150 のままになり、柄が見えなくなる。
 * また、同じページに複数の画面が残るため、Pattern の id は画面ごとに変える（useId）。
 */
import { useState, type ReactNode } from 'react';
import { StyleSheet, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, G, Image as SvgImage, Path, Pattern, Polygon, Rect } from 'react-native-svg';
import { useSvgId } from '@/lib/useSvgId';

interface Props {
  color: string;
  /** 模様の色（rgba 推奨） */
  patternColor: string;
  /** タイルの一辺（px） */
  tile?: number;
  variant?: 'diamond' | 'lines' | 'image';
  /** variant="image" のときに並べる画像と、その高さ（幅は tile） */
  tileImage?: ImageSourcePropType;
  tileHeight?: number;
  /** タイルの横位置。center は CSS の background-position: center top と同じ（タイルの中心を画面の中心に合わせる） */
  align?: 'left' | 'center';
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

export function PatternBackground({
  color,
  patternColor,
  tile = 140,
  variant = 'diamond',
  tileImage,
  tileHeight,
  align = 'left',
  style,
  children,
}: Props) {
  const tileH = variant === 'image' && tileHeight ? tileHeight : tile;
  const id = useSvgId('tile');
  const [width, setWidth] = useState(0);
  // background-position: center → タイルの左端 = (幅 - タイル) / 2 を、タイルの幅で割った余り
  const x = align === 'center' && width > 0 ? (((width - tile) / 2) % tile + tile) % tile : 0;
  return (
    <View style={[{ flex: 1, backgroundColor: color }, style]} onLayout={align === 'center' ? (e) => setWidth(e.nativeEvent.layout.width) : undefined}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" pointerEvents="none">
        <Defs>
          <Pattern id={id} patternUnits="userSpaceOnUse" x={x} y={0} width={tile} height={tileH}>
            {variant === 'image' && tileImage ? (
              <SvgImage href={tileImage} width={tile} height={tileH} preserveAspectRatio="none" />
            ) : variant === 'lines' ? (
              <LinesTile tile={tile} color={patternColor} />
            ) : (
              <DiamondTile tile={tile} color={patternColor} />
            )}
          </Pattern>
        </Defs>
        <Rect x={0} y={0} width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
      {children}
    </View>
  );
}

function DiamondTile({ tile, color }: { tile: number; color: string }) {
  const s = tile / 180; // 元の SVG（180px タイル）からの縮尺
  const p = (pts: number[][]) => pts.map(([px, py]) => `${px! * s},${py! * s}`).join(' ');
  return (
    <>
      <Polygon points={p([[8.13, 8.13], [43.23, 46.77], [81.87, 81.87], [46.77, 43.23]])} fill={color} />
      <Polygon points={p([[171.87, 8.13], [133.23, 43.23], [98.13, 81.87], [136.77, 46.77]])} fill={color} />
      <Polygon points={p([[8.13, 171.87], [46.77, 136.77], [81.87, 98.13], [43.23, 133.23]])} fill={color} />
      <Polygon points={p([[171.87, 171.87], [136.77, 133.23], [98.13, 98.13], [133.23, 136.77]])} fill={color} />
      {[
        [90, 90],
        [0, 0],
        [180, 0],
        [0, 180],
        [180, 180],
      ].map(([cx, cy], i) => (
        <Circle key={i} cx={cx! * s} cy={cy! * s} r={5.8 * s} fill={color} />
      ))}
    </>
  );
}

function LinesTile({ tile, color }: { tile: number; color: string }) {
  const s = tile / 95.46;
  return (
    <G scale={s} opacity={0.25}>
      <Path
        fill="none"
        stroke={color}
        strokeWidth={2.4}
        d="M43.63 4.1 L4.1 43.63 M51.83 4.1 L91.36 43.63 M91.36 51.83 L51.83 91.36 M43.63 91.36 L4.1 51.83"
      />
      {[
        [47.73, 0],
        [95.46, 47.73],
        [47.73, 95.46],
        [0, 47.73],
      ].map(([cx, cy], i) => (
        <Circle key={i} cx={cx} cy={cy} r={3.22} fill={color} />
      ))}
    </G>
  );
}

export const patterns = {
  // index.html .figma-ch0-01-screen：pattern_turquoise.svg を 160px で敷く（位置は左上から）
  turquoise: { color: '#00C9C3', patternColor: 'rgba(255,255,255,0.22)', tile: 160 },
  // index.html .figma-carousel-screen（イントロ）：同じ柄を 90px で、中央上から
  turquoiseSmall: { color: '#00C9C3', patternColor: 'rgba(255,255,255,0.22)', tile: 90, align: 'center' },
  // Figma（2章で使用）
  beige: { color: '#F6F1E8', patternColor: 'rgba(175,145,110,0.30)' },
  // index.html の 0章（言語選択・ヒアリング・時間・プロフィール・ジャーニー・結果）
  beigeLines: { color: '#F6F1E8', patternColor: '#E6D8BD', tile: 95.46, variant: 'lines' },
  sky: { color: '#6DCAF1', patternColor: 'rgba(255,255,255,0.22)' },
} as const;
