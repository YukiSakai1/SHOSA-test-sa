/** IconRef（PNG 画像 or SVG）を描画する */
import { Image, type ImageStyle, type StyleProp } from 'react-native';
import { SvgXml } from 'react-native-svg';
import type { IconRef } from '@/content/types';
import { images } from '@/theme/images';
import { svgIcons } from '@/theme/svgIcons';

export function Icon({ icon, size = 40, style }: { icon: IconRef; size?: number; style?: StyleProp<ImageStyle> }) {
  if ('svg' in icon) return <SvgXml xml={svgIcons[icon.svg]} width={size} height={size} />;
  return <Image source={images[icon.image]} style={[{ width: size, height: size }, style]} resizeMode="contain" />;
}
