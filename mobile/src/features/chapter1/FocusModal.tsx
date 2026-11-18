/**
 * SHOSA Focus モーダル（index.html #modal-ch101-focus / .ch101-focus-*）。
 * 背面を 55% の黒で暗くし、中央にクリーム色のカード（最大幅 340、角丸 20）を出す。
 * 右上に飛び出した ✕、左上に虫めがね、タイトル、金のひし形の区切り線、本文 2段落、チェックリストカード。
 */
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Polygon } from 'react-native-svg';
import { RichText } from '@/components/RichText';
import { PressScale } from '@/components/ui';
import type { Chapter1Lesson } from '@/content/types';
import { useLang } from '@/i18n/LanguageProvider';
import { images } from '@/theme/images';

/** 金のひし形の区切り線（index.html の SVG と同じ） */
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

/**
 * 本文を 2段落にまとめる（index.html の renderCh101FocusModal と同じ）。
 * 全文を文ごとに分け、3文以上なら前半・後半の 2段落にする。
 */
function twoParagraphs(text: string, lang: 'ja' | 'en'): string[] {
  const sentences =
    lang === 'en'
      ? (text.match(/[^.!?]+[.!?]+(?:\s|$)/g) ?? [text])
      : text
          .split('。')
          .filter(Boolean)
          .map((s) => s + '。');
  if (sentences.length < 3) return [text];
  const mid = Math.ceil(sentences.length / 2);
  return [sentences.slice(0, mid).join('').trim(), sentences.slice(mid).join('').trim()];
}

export function FocusModal({ lesson, visible, onClose }: { lesson: Chapter1Lesson; visible: boolean; onClose: () => void }) {
  const { lang, t, tr } = useLang();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}} testID="focus-modal">
          <View style={styles.close}>
            <PressScale accessibilityLabel={t('close')} onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </PressScale>
          </View>
          <Image source={images.iconFocus} style={styles.magnifier} resizeMode="contain" />
          <Text style={styles.title}>{t('focusTitle').toUpperCase()}</Text>
          <View style={styles.divider}>
            <DiamondDivider />
          </View>
          <ScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: 2 }}>
            {twoParagraphs(lesson.focusParagraphs.map((p) => tr(p)).join(lang === 'en' ? ' ' : ''), lang).map((p, i) => (
              <Text key={i} style={styles.para}>
                {p}
              </Text>
            ))}
          </ScrollView>
          {/* .ch101-focus-checklist-card：Frame 342.png を背景にしたカード（最大幅 280） */}
          <View style={styles.checklist}>
            <Image source={images.focusChecklistCard} style={StyleSheet.absoluteFill} resizeMode="stretch" />
            {lesson.focusImage && <Image source={images[lesson.focusImage]} style={styles.checklistImg} resizeMode="contain" />}
            <RichText style={styles.caption} highlightStyle={styles.captionHl}>
              {tr(lesson.focusCaption)}
            </RichText>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center', padding: 31 },
  card: {
    width: '100%',
    maxWidth: 340,
    maxHeight: '90%',
    backgroundColor: '#FAF7F2',
    borderRadius: 20,
    paddingTop: 24,
    paddingHorizontal: 18,
    paddingBottom: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 36,
    elevation: 12,
  },
  // .ch101-focus-modal-close（右上に飛び出す 36 の丸）
  close: { position: 'absolute', top: -12, right: -8, zIndex: 10 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF7F2',
    borderWidth: 2,
    borderColor: '#E6D8BD',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  closeText: { fontSize: 17, fontWeight: '700', color: '#8C8270', lineHeight: 18 },
  // .ch101-focus-modal-magnifier（左上、幅 44）
  magnifier: { position: 'absolute', top: -14, left: 14, width: 44, height: 61, zIndex: 10 },
  title: { fontSize: 18, fontWeight: '800', color: '#2D3748', letterSpacing: 0.8 },
  divider: { marginTop: 10, marginBottom: 14 },
  para: { fontSize: 12.5, lineHeight: 20.6, color: '#2D3748', fontWeight: '600', marginBottom: 10, textAlign: 'center' },
  checklist: { width: '100%', maxWidth: 280, paddingTop: 16, paddingHorizontal: 12, paddingBottom: 14, alignItems: 'center' },
  checklistImg: { width: 78, height: 97, marginBottom: 8 },
  caption: { fontSize: 11.5, lineHeight: 17.25, color: '#4A5568', fontWeight: '700', textAlign: 'center' },
  captionHl: { color: '#715BE1', fontWeight: '800' },
});
