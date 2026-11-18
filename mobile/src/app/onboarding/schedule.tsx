/**
 * 学習スケジュール（Figma CH0-22）。
 * 時間帯を選ぶと「お知らせ時間」の初期値が変わる。時刻をタップするとホイールで編集できる。
 * 「その他」を選ぶと自動で編集シートが開く。
 * NEXT は「時間帯の選択」と「お知らせ ON」の両方がそろったときだけ押せる（Web版 M-37）。
 */
import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { BottomSheet } from '@/components/BottomSheet';
import { pad2, range, WheelPicker } from '@/components/WheelPicker';
import { schedule } from '@/content/onboarding';
import { blockProgress, OptionCard, QuestionLayout } from '@/features/onboarding/components';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';

const HOURS = range(0, 23);
const MINUTES = range(0, 59);

export default function ScheduleScreen() {
  const { t, tr } = useLang();
  const { record, update } = useOnboarding();
  const s = record.schedule;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ h: 10, m: 30 });

  const [hh, mm] = s.notifyTime.split(':');

  const openEditor = () => {
    setDraft({ h: Number(hh), m: Number(mm) });
    setEditing(true);
  };

  const choose = (id: string, defaultTime: string) => {
    update((r) => ({ ...r, schedule: { ...r.schedule, timeSlot: id, notifyTime: defaultTime } }));
    if (id === 'other') {
      const [h, m] = defaultTime.split(':');
      setDraft({ h: Number(h), m: Number(m) });
      setEditing(true);
    }
  };

  return (
    <QuestionLayout
      percent={blockProgress(5)}
      question={schedule.question}
      nextDisabled={!s.timeSlot || !s.notifyEnabled}
      onNext={() => router.push('/onboarding/profile-intro')}
      footer={
        <View style={styles.notifyBar}>
          <Pressable accessibilityRole="button" onPress={openEditor} style={styles.timeTap} testID="notify-time">
            <Text style={styles.notifyLabel}>{tr(schedule.notifyLabel)}</Text>
            <Text style={styles.notifyTime}>
              {hh}:{mm}
            </Text>
          </Pressable>
          <Switch
            value={s.notifyEnabled}
            onValueChange={(v) => update((r) => ({ ...r, schedule: { ...r.schedule, notifyEnabled: v } }))}
            trackColor={{ true: colors.turquoise, false: colors.disabled }}
            thumbColor={colors.white}
            accessibilityLabel={t('notify')}
          />
        </View>
      }
    >
      {schedule.options.map((o) => (
        <OptionCard
          key={o.id}
          testID={`slot-${o.id}`}
          label={tr(o.label)}
          icon={o.icon}
          selected={s.timeSlot === o.id}
          onPress={() => choose(o.id, o.defaultTime)}
        />
      ))}
      <BottomSheet
        visible={editing}
        tone="turquoise"
        title={tr(schedule.editTitle)}
        confirmLabel={t('done')}
        onClose={() => setEditing(false)}
        onConfirm={() => {
          update((r) => ({ ...r, schedule: { ...r.schedule, notifyTime: `${pad2(draft.h)}:${pad2(draft.m)}` } }));
          setEditing(false);
        }}
      >
        <View style={styles.wheels}>
          <WheelPicker testID="wheel-hour" values={HOURS} value={draft.h} onChange={(h) => setDraft((d) => ({ ...d, h }))} />
          <Text style={styles.colon}>:</Text>
          <WheelPicker testID="wheel-minute" values={MINUTES} value={draft.m} format={pad2} onChange={(m) => setDraft((d) => ({ ...d, m }))} />
        </View>
      </BottomSheet>
    </QuestionLayout>
  );
}

const styles = StyleSheet.create({
  notifyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.purple,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  timeTap: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  notifyLabel: { fontSize: 12, color: colors.white },
  notifyTime: { fontSize: 32, fontWeight: '700', color: colors.white },
  wheels: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  colon: { fontSize: 28, fontWeight: '700', color: colors.white },
});
