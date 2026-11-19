/**
 * ROLE Line Up（Figma CH2-02）。職種カードを選ぶと、シナリオの導入カードがポップアップする。
 * Figma に職種カードがあるのは Front Desk だけ。roles に足せばカードが増える。
 *
 * 場面の画像（ロビー）は上半分だけを画像にしている：
 * - 職種カード 260×422：上 154 が場面（role_scene_card.png）、その上に職種名の白い札、下は白い面に職種の一覧と START
 * - ポップアップ 309×501：上 300 が場面（role_scene_popup.png）、下は白い面にタイトル・説明・START・戻る
 */
import { useState } from 'react';
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppModal } from '@/components/AppModal';
import { CloseButton, CtaButton, PressScale } from '@/components/ui';
import { chapter2, roles, type Role } from '@/content/chapter2';
import { useChapter2 } from '@/features/chapter2/Chapter2Provider';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
import { images } from '@/theme/images';

export default function RolesScreen() {
  const insets = useSafeAreaInsets();
  const { t, tr } = useLang();
  const { record } = useChapter2();
  const [picked, setPicked] = useState<Role | null>(null);
  const r = chapter2.roles;
  const scenario = picked?.scenarios[0];

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <CloseButton label={t('close')} onPress={() => router.dismissTo('/')} />
        <Text style={styles.heading}>{r.heading}</Text>
        <View style={{ width: 32 }} />
      </View>
      <View style={styles.lead}>
        <Text style={styles.leadText}>{tr(r.lead)}</Text>
      </View>
      <ScrollView horizontal contentContainerStyle={styles.cards} showsHorizontalScrollIndicator={false}>
        {roles.map((role) => {
          const done = record.completedRoles.includes(role.id);
          return (
            <View key={role.id} style={styles.card}>
              {/* Web では幅・高さを明示しないと画像が元の大きさで描かれるため、両方指定する */}
              <Image source={images.roleSceneCard} style={styles.cardScene} resizeMode="cover" />
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle}>{`${role.name}\n${tr(role.tagline)}`}</Text>
              </View>
              <View style={styles.cardBottom}>
                <Text style={styles.jobsLabel}>{tr(r.jobsLabel)}</Text>
                {role.scenarios.map((s) => (
                  <View key={s.id} style={styles.sceneRow}>
                    <Text style={styles.sceneText}>{tr(s.title)}</Text>
                    {done && <Text style={styles.resultTag}>{r.resultTag}</Text>}
                  </View>
                ))}
                {/* カード全体をボタンにすると Web でボタンの入れ子になるため、START だけをボタンにする */}
                <CtaButton testID={`role-${role.id}`} variant="primary" size="small" label={tr(r.start)} onPress={() => setPicked(role)} style={{ marginTop: 'auto', alignSelf: 'center', width: 230 }} />
              </View>
            </View>
          );
        })}
      </ScrollView>

      <AppModal visible={!!picked} animationType="fade" onRequestClose={() => setPicked(null)}>
        <View style={styles.backdrop}>
          {picked && scenario && (
            <View style={styles.popup}>
              <Image source={images.roleScenePopup} style={styles.popupScene} resizeMode="cover" />
              <View style={styles.popupBody}>
                <Text style={styles.popupTitle}>{tr(scenario.title)}</Text>
                <Text style={styles.popupText}>{tr(scenario.intro)}</Text>
                <CtaButton
                  testID="scenario-start"
                  variant="primary"
                  label={tr(r.start)}
                  onPress={() => {
                    setPicked(null);
                    router.push({
                      pathname: '/chapter2/[role]/[scenario]/situation/[step]',
                      params: { role: picked.id, scenario: scenario.id, step: '0' },
                    });
                  }}
                />
                <PressScale onPress={() => setPicked(null)} style={styles.backLink}>
                  <Text style={styles.backLinkText}>{tr(r.back)}</Text>
                </PressScale>
              </View>
            </View>
          )}
        </View>
      </AppModal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.playBackground },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 21 },
  heading: { fontSize: 20, fontWeight: '700', color: colors.goldCaption },
  lead: { marginTop: 14, marginHorizontal: 11, backgroundColor: colors.teal, borderRadius: 12, padding: 14 },
  leadText: { fontSize: 16, lineHeight: 24, fontWeight: '700', color: colors.white, textAlign: 'center' },
  cards: { paddingHorizontal: 71, paddingVertical: 20, gap: 16 },
  card: { width: 260, height: 422, backgroundColor: colors.white, borderRadius: 16, overflow: 'hidden' },
  cardScene: { position: 'absolute', top: 0, left: 0, width: 260, height: 154 },
  cardTop: { margin: 12, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 10, padding: 10 },
  cardTitle: { fontSize: 18, lineHeight: 26, fontWeight: '700', color: colors.goldCaption, textAlign: 'center' },
  // 場面（上 154）の下から、白い面に職種の一覧
  cardBottom: { position: 'absolute', top: 154, left: 0, right: 0, bottom: 0, padding: 14 },
  jobsLabel: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 6 },
  sceneRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sceneText: { fontSize: 18, fontWeight: '700', color: colors.black },
  resultTag: { fontSize: 11, fontWeight: '900', color: colors.white, backgroundColor: colors.purple, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  backdrop: { flex: 1, backgroundColor: colors.dialogOverlay, alignItems: 'center', justifyContent: 'center' },
  popup: { width: 309, minHeight: 501, backgroundColor: colors.white, borderRadius: 16, overflow: 'hidden' },
  popupScene: { width: 309, height: 300 },
  popupBody: { padding: 14, gap: 10, alignItems: 'stretch' },
  popupTitle: { fontSize: 20, fontWeight: '700', color: colors.text, textAlign: 'center' },
  popupText: { fontSize: 16, lineHeight: 24, color: colors.black, textAlign: 'center' },
  backLink: { alignSelf: 'center' },
  backLinkText: { fontSize: 16, fontWeight: '700', color: colors.text },
});
