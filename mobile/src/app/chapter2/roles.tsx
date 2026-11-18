/**
 * ROLE Line Up（Figma CH2-02）。職種カードを選ぶと、シナリオの導入カードがポップアップする。
 * Figma に職種カードがあるのは Front Desk だけ。roles に足せばカードが増える。
 */
import { useState } from 'react';
import { router } from 'expo-router';
import { ImageBackground, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloseButton, CtaButton } from '@/components/ui';
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
            <View key={role.id}>
              <ImageBackground source={images[role.card]} style={styles.card} imageStyle={styles.cardImg}>
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
                  <CtaButton testID={`role-${role.id}`} variant="primary" label={tr(r.start)} onPress={() => setPicked(role)} style={{ marginTop: 10 }} />
                </View>
              </ImageBackground>
            </View>
          );
        })}
      </ScrollView>

      <Modal visible={!!picked} transparent animationType="fade" onRequestClose={() => setPicked(null)}>
        <View style={styles.backdrop}>
          {picked && scenario && (
            <ImageBackground source={images[scenario.scene]} style={styles.popup} imageStyle={{ borderRadius: 16 }}>
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
              </View>
              <Pressable onPress={() => setPicked(null)} style={styles.backLink}>
                <Text style={styles.backLinkText}>{tr(r.back)}</Text>
              </Pressable>
            </ImageBackground>
          )}
        </View>
      </Modal>
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
  card: { width: 260, height: 422, justifyContent: 'space-between' },
  cardImg: { borderRadius: 16 },
  cardTop: { margin: 12, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 10, padding: 10 },
  cardTitle: { fontSize: 18, lineHeight: 26, fontWeight: '700', color: colors.goldCaption, textAlign: 'center' },
  cardBottom: { margin: 12, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 12, padding: 12 },
  jobsLabel: { fontSize: 14, fontWeight: '700', color: colors.white, marginBottom: 6 },
  sceneRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sceneText: { fontSize: 18, fontWeight: '700', color: colors.white },
  resultTag: { fontSize: 11, fontWeight: '900', color: colors.white, backgroundColor: colors.purple, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  backdrop: { flex: 1, backgroundColor: colors.dialogOverlay, alignItems: 'center', justifyContent: 'center' },
  popup: { width: 309, height: 501, justifyContent: 'flex-end', padding: 14 },
  popupBody: { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 14, padding: 18, gap: 12 },
  popupTitle: { fontSize: 20, fontWeight: '700', color: colors.text, textAlign: 'center' },
  popupText: { fontSize: 16, lineHeight: 24, color: colors.black, textAlign: 'center' },
  backLink: { alignSelf: 'center', marginTop: 12 },
  backLinkText: { fontSize: 16, fontWeight: '700', color: colors.white },
});
