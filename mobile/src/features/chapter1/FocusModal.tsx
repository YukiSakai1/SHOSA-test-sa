/**
 * SHOSA Focus モーダル（Figma CH1-L01-04 の「modal」）。
 * 背面を 74% の黒で暗くし、ほぼ全画面（Figma の y=67〜810、左右 24）のクリーム色（#F6F1E8）のパネルを出す。
 * パネルの上下の角は内側に丸く欠けている（半径 20）。
 * 中：タイトル（20 Bold）→ 金のひし形の区切り線 → 本文 3段落（16 / 24・段落の間は 17）→ チェックリストカード（289×278）。
 * 左上に虫めがね（58×79）、右上に ✕（50×50 の白い丸）。
 * 位置は Figma の画面（402×874、ステータスバー 59 を含む）から。セーフエリアの上端からの距離で置く。
 */
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Line, Path, Polygon, SvgXml } from 'react-native-svg';
import { AppModal } from '@/components/AppModal';
import { RichText } from '@/components/RichText';
import { PressScale } from '@/components/ui';
import type { Chapter1Lesson } from '@/content/types';
import { useLang } from '@/i18n/LanguageProvider';
import { images } from '@/theme/images';

const FIGMA_TOP = 59;
export const PANEL = '#F6F1E8';
export const LINE = '#E6D8BD';

/** パネルの上辺（左右の角が内側に丸く欠けた形、Figma の bg_foucus）。下辺は上下を反転して使う */
export const EDGE_XML = `<svg xmlns="http://www.w3.org/2000/svg" width="355" height="24" viewBox="0 0 355 24"><path d="M355 24 L355 20 C343.95 20 335 11.05 335 0 L20 0 C20 11.05 11.05 20 0 20 L0 24 L355 24 Z" fill="${PANEL}"/></svg>`;

/** 金のひし形の区切り線（index.html の SVG と同じ形） */
export function DiamondDivider({
  color = '#DCC79B',
  lineColor,
  width = 220,
  height = 10,
}: {
  color?: string;
  lineColor?: string;
  width?: number;
  height?: number;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 240 12">
      <Line x1={8} y1={6} x2={86} y2={6} stroke={lineColor ?? color} strokeWidth={1.2} />
      <Polygon points="92,6 95,3 98,6 95,9" fill={color} />
      <Polygon points="102,6 106,2 110,6 106,10" fill={color} />
      <Polygon points="115,6 120,1 125,6 120,11" fill={color} />
      <Polygon points="130,6 134,2 138,6 134,10" fill={color} />
      <Polygon points="142,6 145,3 148,6 145,9" fill={color} />
      <Line x1={154} y1={6} x2={232} y2={6} stroke={lineColor ?? color} strokeWidth={1.2} />
    </Svg>
  );
}

export function FocusModal({ lesson, visible, onClose }: { lesson: Chapter1Lesson; visible: boolean; onClose: () => void }) {
  const { t, tr } = useLang();
  const insets = useSafeAreaInsets();
  const y = (figmaY: number) => insets.top + figmaY - FIGMA_TOP;
  return (
    <AppModal visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* パネル：左右 24、上は y=67、下は画面の下から 64（Figma の y=810） */}
        <Pressable style={[styles.panel, { top: y(67), bottom: insets.bottom + 30 }]} onPress={() => {}} testID="focus-modal">
          <SvgXml xml={EDGE_XML} width="100%" height={24} preserveAspectRatio="none" />
          <View style={styles.body}>
            <Text style={styles.title}>{t('focusTitle')}</Text>
            <View style={styles.divider}>
              <DiamondDivider width={285} height={15} />
            </View>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              {lesson.focusParagraphs.map((p, i) => (
                <Text key={i} style={[styles.para, i > 0 && { marginTop: 17 }]}>
                  {tr(p)}
                </Text>
              ))}
              {/* チェックリストカード（289×278）：白い面・#E6D8BD の枠・角の飾りは画像。絵は Figma「1116」の Frame 1 どおり、カードの左 67・上 11 に 181×168 */}
              <View style={styles.checklist}>
                <Image source={images.focusChecklistCard} style={styles.checklistBg} resizeMode="stretch" />
                {lesson.focusImage && <Image source={images[lesson.focusImage]} style={styles.checklistImg} resizeMode="contain" />}
                <RichText style={styles.caption} highlightStyle={styles.captionHl}>
                  {tr(lesson.focusCaption)}
                </RichText>
              </View>
            </ScrollView>
          </View>
          <SvgXml xml={EDGE_XML} width="100%" height={24} preserveAspectRatio="none" style={{ transform: [{ scaleY: -1 }] }} />
          {/* 虫めがね（左上、58×79）と ✕（右上、50×50） */}
          <Image source={images.iconFocus} style={styles.magnifier} resizeMode="contain" />
          <View style={styles.close}>
            <PressScale accessibilityLabel={t('close')} onPress={onClose} style={styles.closeBtn}>
              <Svg width={23} height={23} viewBox="0 0 23 23">
                <Path d="M2.5 2.5 L20.5 20.5 M20.5 2.5 L2.5 20.5" stroke="#B09D79" strokeWidth={4} strokeLinecap="round" />
              </Svg>
            </PressScale>
          </View>
        </Pressable>
      </Pressable>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.74)' },
  panel: { position: 'absolute', left: 24, right: 23 },
  body: { flex: 1, backgroundColor: PANEL, paddingHorizontal: 33 },
  // タイトル：パネルの上から 34（y=101）、高さ 30（20 Bold・行の高さ 1.5）
  title: { fontSize: 20, lineHeight: 30, fontWeight: '700', color: '#333333', textAlign: 'center', marginTop: 10 },
  // 区切り線：タイトルの下 12（y=143）
  divider: { alignItems: 'center', marginTop: 12, marginHorizontal: -33 },
  scroll: { flex: 1, marginTop: 20 },
  scrollContent: { paddingBottom: 24 },
  para: { fontSize: 16, lineHeight: 24, color: '#000000' },
  checklist: { width: '100%', maxWidth: 289, height: 278, alignSelf: 'center', marginTop: 36, alignItems: 'center' },
  checklistBg: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  // 中央より 13 右（カードの左 67 から幅 181）
  checklistImg: { position: 'absolute', top: 11, width: 181, height: 168, transform: [{ translateX: 13 }] },
  caption: { position: 'absolute', top: 188, left: 40, right: 39, fontSize: 14, lineHeight: 20, color: '#988464', fontWeight: '700', textAlign: 'center' },
  captionHl: { color: '#715BE1', fontWeight: '800' },
  magnifier: { position: 'absolute', top: -9, left: 7, width: 58, height: 79 },
  close: { position: 'absolute', top: -15, right: -15 },
  closeBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: LINE, alignItems: 'center', justifyContent: 'center' },
});
