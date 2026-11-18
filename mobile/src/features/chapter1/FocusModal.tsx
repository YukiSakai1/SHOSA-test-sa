/** SHOSA Focus モーダル（Web版 modal-ch101-focus）：もう一歩踏み込んだ解説 */
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RichText } from '@/components/RichText';
import type { Chapter1Lesson, Lang } from '@/content/types';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
import { images } from '@/theme/images';

/** 長い解説を読みやすいよう2段落に分ける（3文以上のとき） */
export function splitIntoParagraphs(text: string, lang: Lang): string[] {
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
        <Pressable style={styles.card} onPress={() => {}}>
          <Image source={images.iconFocus} style={styles.magnifier} />
          <Pressable accessibilityRole="button" accessibilityLabel={t('close')} hitSlop={10} onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>{t('focusTitle')}</Text>
            <View style={styles.divider} />
            {splitIntoParagraphs(tr(lesson.focusText), lang).map((p, i) => (
              <Text key={i} style={styles.para}>
                {p}
              </Text>
            ))}
            <View style={styles.checklist}>
              {lesson.focusImage && (
                <Image source={images[lesson.focusImage]} style={styles.checklistImg} resizeMode="contain" />
              )}
              <RichText style={styles.caption}>{tr(lesson.focusCaption)}</RichText>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', padding: 20 },
  card: { backgroundColor: colors.cream, borderRadius: 20, maxHeight: '88%', paddingTop: 18 },
  magnifier: { position: 'absolute', top: -22, left: 14, width: 56, height: 56, zIndex: 1 },
  close: { position: 'absolute', top: 12, right: 14, zIndex: 1 },
  closeText: { fontSize: 20, color: colors.textMuted, fontWeight: '700' },
  content: { padding: 22, paddingTop: 16 },
  title: { textAlign: 'center', fontSize: 18, fontWeight: '900', color: colors.gold, letterSpacing: 3 },
  divider: { height: 1.2, backgroundColor: '#DCC79B', marginVertical: 14, marginHorizontal: 30 },
  para: { fontSize: 14, lineHeight: 23, color: colors.text, marginBottom: 12 },
  checklist: {
    marginTop: 6,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checklistImg: { width: 72, height: 72 },
  caption: { flex: 1, fontSize: 13, lineHeight: 20, color: colors.text },
});
