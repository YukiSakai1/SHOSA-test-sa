/**
 * SHOSA Focus モーダル（Figma CH1-L01-04 モーダル展開後）。
 * 背面を 74% の黒で暗くし、ベージュのカードを下からスライドアップで表示する（Figma 注記）。
 * 本文は段落ごと（focusParagraphs）、下に白枠のチェックリストカード（画像＋キャプション）。
 */
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RichText } from '@/components/RichText';
import { CloseButton, Flourish } from '@/components/ui';
import type { Chapter1Lesson } from '@/content/types';
import { useLang } from '@/i18n/LanguageProvider';
import { colors, fonts } from '@/theme/colors';
import { images } from '@/theme/images';

export function FocusModal({ lesson, visible, onClose }: { lesson: Chapter1Lesson; visible: boolean; onClose: () => void }) {
  const { t, tr } = useLang();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}} testID="focus-modal">
          <View style={styles.magnifierWrap}>
            <Image source={images.iconFocus} style={styles.magnifier} resizeMode="contain" />
          </View>
          <View style={styles.close}>
            <CloseButton label={t('close')} onPress={onClose} />
          </View>
          <Text style={styles.title}>{t('focusTitle')}</Text>
          <Image source={images.goldDivider} style={styles.divider} resizeMode="contain" />
          <ScrollView contentContainerStyle={styles.content}>
            {lesson.focusParagraphs.map((p, i) => (
              <Text key={i} style={styles.para}>
                {tr(p)}
              </Text>
            ))}
            <View style={styles.checklist}>
              <Flourish corner="tl" />
              <Flourish corner="tr" />
              <Flourish corner="bl" />
              <Flourish corner="br" />
              {lesson.focusImage && <Image source={images[lesson.focusImage]} style={styles.checklistImg} resizeMode="contain" />}
              <RichText style={styles.caption} highlightStyle={{ color: colors.goldCaption }}>
                {tr(lesson.focusCaption)}
              </RichText>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 52 },
  card: { backgroundColor: colors.beige, borderRadius: 10, maxHeight: '100%', paddingTop: 30, borderWidth: 1, borderColor: colors.goldBorder },
  magnifierWrap: { position: 'absolute', top: -22, left: 7, zIndex: 1 },
  magnifier: { width: 58, height: 79 },
  close: { position: 'absolute', top: 14, right: 14, zIndex: 1 },
  title: { textAlign: 'center', fontFamily: fonts.montserrat, fontSize: 20, color: colors.text },
  divider: { alignSelf: 'center', width: 240, height: 13, marginTop: 10 },
  content: { paddingHorizontal: 33, paddingTop: 18, paddingBottom: 28 },
  para: { fontSize: 16, lineHeight: 24, color: colors.black, marginBottom: 17 },
  checklist: {
    marginTop: 4,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: colors.goldBorder,
    padding: 22,
    alignItems: 'center',
    gap: 14,
  },
  checklistImg: { width: 160, height: 160 },
  caption: { fontSize: 14, lineHeight: 20, color: colors.goldCaption, fontWeight: '700', textAlign: 'center' },
});
