/**
 * 学習スケジュール（index.html #screen-ob-schedule-time、Figma CH0-22）。
 * - M-33：時間帯カードは1つだけ選べる（選ぶと紫になり枠が一瞬ふくらむ）
 * - M-38：時間帯を選ぶと時刻が既定値に変わる（朝 07:00・ランチ 12:30・夕食前後 18:00・寝る前 21:30）。
 *         ただし時刻を自分で編集した後は変えない。「その他」も変えない。時刻が変わったときは数字がクロスフェード（0.2秒）
 * - M-34 / M-35 / M-36：時刻をタップすると編集シート（ホイール）が開く
 * - M-37：トグルは軽い触覚付き。NEXT は「時間帯の選択」と「お知らせ ON」の両方がそろったときだけ押せる
 * 「その他」を選ぶと編集シートを自動で開く（Web版と同じ）。
 */
import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomSheet } from '@/components/BottomSheet';
import { pad2, range, WheelPicker } from '@/components/WheelPicker';
import { schedule } from '@/content/onboarding';
import { blockProgress, OptionCard, QuestionLayout } from '@/features/onboarding/components';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import { useLang } from '@/i18n/LanguageProvider';
import { haptics } from '@/lib/haptics';
import { colors } from '@/theme/colors';
import { motion, nativeDriver } from '@/theme/motion';

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

  const choose = (id: string) => {
    update((r) => {
      // 自分で時刻を編集した後でなければ、時間帯の既定の時刻に変える（index.html と同じ）
      const preset = schedule.defaultTimes[id];
      const notifyTime = !r.schedule.userCustomizedTime && preset ? preset : r.schedule.notifyTime;
      return { ...r, schedule: { ...r.schedule, timeSlot: id, notifyTime } };
    });
    if (id === 'other') openEditor();
  };

  // M-38：時刻が変わったら数字をクロスフェード
  const timeOpacity = useRef(new Animated.Value(1)).current;
  const shownTime = useRef(s.notifyTime);
  useEffect(() => {
    if (shownTime.current === s.notifyTime) return;
    shownTime.current = s.notifyTime;
    timeOpacity.setValue(0);
    Animated.timing(timeOpacity, { toValue: 1, duration: motion.timeFadeMs, useNativeDriver: nativeDriver }).start();
  }, [s.notifyTime, timeOpacity]);

  return (
    <QuestionLayout
      percent={blockProgress(5)}
      question={schedule.question}
      nextDisabled={!s.timeSlot || !s.notifyEnabled}
      onNext={() => router.push('/onboarding/profile-intro')}
      heroVariant="schedule"
    >
      {schedule.options.map((o) => (
        <OptionCard
          key={o.id}
          testID={`slot-${o.id}`}
          label={tr(o.label)}
          icon={o.icon}
          selected={s.timeSlot === o.id}
          onPress={() => choose(o.id)}
        />
      ))}
      {/* index.html .schedule-notify-card：選択肢の下 27 に置く紫の帯（360×73、角丸 14）。時刻は帯の中央 */}
      <View style={styles.notifyBar}>
        <Text style={styles.notifyLabel}>{tr(schedule.notifyLabel)}</Text>
        <View style={styles.timeTap} pointerEvents="box-none">
          <Pressable accessibilityRole="button" onPress={openEditor} testID="notify-time" hitSlop={8}>
            <Animated.Text style={[styles.notifyTime, { opacity: timeOpacity }]}>
              {hh}:{mm}
            </Animated.Text>
          </Pressable>
        </View>
        <IosToggle
          value={s.notifyEnabled}
          accessibilityLabel={t('notify')}
          onChange={(v) => {
            haptics.select();
            update((r) => ({ ...r, schedule: { ...r.schedule, notifyEnabled: v } }));
          }}
        />
      </View>
      <BottomSheet
        visible={editing}
        tone="turquoise"
        title={tr(schedule.editTitle)}
        confirmLabel={tr(schedule.submit)}
        onClose={() => setEditing(false)}
        onConfirm={() => {
          update((r) => ({ ...r, schedule: { ...r.schedule, notifyTime: `${pad2(draft.h)}:${pad2(draft.m)}`, userCustomizedTime: true } }));
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

/** index.html .schedule-notify-ios-toggle：53×32 のトグル（ON はターコイズ）。白いつまみが 0.2秒で動く */
function IosToggle({ value, onChange, accessibilityLabel }: { value: boolean; onChange: (v: boolean) => void; accessibilityLabel: string }) {
  const x = useRef(new Animated.Value(value ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(x, { toValue: value ? 1 : 0, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
  }, [value, x]);
  const bg = x.interpolate({ inputRange: [0, 1], outputRange: ['#D1D1D6', colors.turquoise] });
  const left = x.interpolate({ inputRange: [0, 1], outputRange: [2, 23] });
  return (
    <Pressable
      testID="notify-toggle"
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      hitSlop={8}
    >
      <Animated.View style={[styles.toggle, { backgroundColor: bg }]}>
        <Animated.View style={[styles.knob, { left }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  notifyBar: {
    height: 73,
    marginTop: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.purple,
    borderRadius: 14,
    paddingHorizontal: 20,
  },
  notifyLabel: { fontSize: 12, lineHeight: 12, color: colors.white },
  timeTap: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  notifyTime: { fontSize: 32, lineHeight: 32, fontWeight: '700', color: colors.white },
  toggle: { width: 53, height: 32, borderRadius: 16 },
  knob: {
    position: 'absolute',
    top: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  wheels: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  colon: { fontSize: 28, fontWeight: '700', color: colors.white },
});
