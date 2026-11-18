/**
 * `<hl>…</hl>` を紫の太字、`\n` を改行として表示するテキスト。
 * データ側に HTML を持たせないための最小限のマークアップ。
 */
import { Text, type StyleProp, type TextStyle } from 'react-native';
import { colors } from '@/theme/colors';

interface Props {
  children: string;
  style?: StyleProp<TextStyle>;
  highlightStyle?: StyleProp<TextStyle>;
}

export function RichText({ children, style, highlightStyle }: Props) {
  // "a<hl>b</hl>c" → ["a", "b", "c"]：奇数番目が強調部分
  const parts = children.split(/<hl>|<\/hl>/);
  return (
    <Text style={style}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <Text key={i} style={[{ color: colors.purple, fontWeight: '700' }, highlightStyle]}>
            {part}
          </Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
}
