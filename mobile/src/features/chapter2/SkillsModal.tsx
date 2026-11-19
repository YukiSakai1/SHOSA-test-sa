/**
 * 「日本のホテルで求められるスキル」モーダル（Figma CH2-05 の modal）。診断結果の「？」で開く。
 * 1章の SHOSA Focus と同じ枠：背面を 74% の黒で暗くし、クリーム色（#F6F1E8）のパネル（上下の角が内側に丸く欠ける）。
 * 中：タイトル（Bold 20・2行）→ 区切り線 → 4つの行動傾向の白いカード（角 10・間隔 12）。
 *   カード：左右 24・上 16・下 20。見出し＝星形の台（50×50・#F6F1E8）に絵（32）＋ 英名と日本語名（Bold 18）
 *   → 8 あけて説明（12 / 18）→ 8 あけて「例：…」の札（#C6B695・端の幅 4）。右上に ✕（50×50）。
 */
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, SvgXml } from 'react-native-svg';
import { AppModal } from '@/components/AppModal';
import { PressScale } from '@/components/ui';
import { chapter2, TENDENCIES, tendencyInfo } from '@/content/chapter2';
import { EDGE_XML, LINE, PANEL } from '@/features/chapter1/FocusModal';
import { NotePill } from '@/features/chapter2/NotePill';
import { useLang } from '@/i18n/LanguageProvider';
import { images } from '@/theme/images';

const FIGMA_TOP = 59;
/** Figma の Frame 221：星形の台（60×60）。モーダルでは 50×50 に縮めて使う */
export const SPARKLE_BADGE_PATH =
  'M 60 30 C 52.47 36.29 60.68 48.74 54.71 54.71 C 48.74 60.68 36.29 52.47 30 60 C 23.71 52.47 11.26 60.68 5.29 54.71 C -0.68 48.74 7.53 36.29 0 30 C 7.53 23.71 -0.68 11.26 5.29 5.29 C 11.26 -0.68 23.71 7.53 30 0 C 36.29 7.53 48.74 -0.68 54.71 5.29 C 60.68 11.26 52.47 23.71 60 30 Z';

/** 星形の台に、行動傾向の絵を重ねたもの */
export function TendencyBadge({ icon, size, iconSize }: { icon: Parameters<typeof Image>[0]['source']; size: number; iconSize: number }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 60 60" style={StyleSheet.absoluteFill}>
        <Path d={SPARKLE_BADGE_PATH} fill={PANEL} />
      </Svg>
      <Image source={icon} style={{ width: iconSize, height: iconSize }} resizeMode="contain" />
    </View>
  );
}

export function SkillsModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t, tr } = useLang();
  const insets = useSafeAreaInsets();
  const y = (figmaY: number) => insets.top + figmaY - FIGMA_TOP;
  return (
    <AppModal visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.panel, { top: y(67), bottom: insets.bottom + 30 }]} onPress={() => {}} testID="skills-modal">
          <SvgXml xml={EDGE_XML} width="100%" height={24} preserveAspectRatio="none" />
          <View style={styles.body}>
            <Text style={styles.title}>{tr(chapter2.skills.title)}</Text>
            <Image source={images.frames} style={styles.divider} resizeMode="contain" />
            <ScrollView style={styles.scroll} contentContainerStyle={styles.cards} showsVerticalScrollIndicator={false}>
              {TENDENCIES.map((k) => {
                const info = tendencyInfo[k];
                return (
                  <View key={k} style={styles.card}>
                    <View style={styles.cardHead}>
                      <TendencyBadge icon={images[info.icon]} size={50} iconSize={32} />
                      <Text style={styles.cardName}>{`${k}\n${tr(info.label)}`}</Text>
                    </View>
                    <Text style={styles.cardDesc}>{tr(info.desc)}</Text>
                    <NotePill height={23} cap={4} fontSize={12} lineHeight={18} style={styles.example}>
                      {tr(info.example)}
                    </NotePill>
                  </View>
                );
              })}
            </ScrollView>
          </View>
          <SvgXml xml={EDGE_XML} width="100%" height={24} preserveAspectRatio="none" style={{ transform: [{ scaleY: -1 }] }} />
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
  body: { flex: 1, backgroundColor: PANEL, paddingHorizontal: 27 },
  title: { fontSize: 20, lineHeight: 30, fontWeight: '700', letterSpacing: 1.5, color: '#333333', textAlign: 'center', marginTop: 10 },
  divider: { alignSelf: 'center', width: 285, height: 15, marginTop: 12 },
  scroll: { flex: 1, marginTop: 20 },
  cards: { gap: 12, paddingBottom: 24 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardName: { flex: 1, fontSize: 18, lineHeight: 24.5, fontWeight: '700', color: '#333333' },
  cardDesc: { fontSize: 12, lineHeight: 18, color: '#000000', marginTop: 8 },
  example: { marginTop: 8 },
  close: { position: 'absolute', top: -15, right: -15 },
  closeBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: LINE, alignItems: 'center', justifyContent: 'center' },
});
