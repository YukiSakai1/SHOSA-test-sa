/** 下からせり上がるシート（時刻・誕生日・出身国の選択で使う） */
import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CtaButton } from '@/components/ui';
import { colors } from '@/theme/colors';

interface Props {
  visible: boolean;
  title: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  children: ReactNode;
  /** シートの背景色（時刻はターコイズ、それ以外はクリーム） */
  tone?: 'turquoise' | 'cream';
}

export function BottomSheet({ visible, title, confirmLabel, onConfirm, onClose, children, tone = 'cream' }: Props) {
  const insets = useSafeAreaInsets();
  const dark = tone === 'turquoise';
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: dark ? colors.turquoise : colors.beige, paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.grabber} />
        <Text style={[styles.title, { color: dark ? colors.white : colors.text }]}>{title}</Text>
        <View style={styles.body}>{children}</View>
        <CtaButton testID="sheet-confirm" label={confirmLabel} variant={dark ? 'primary' : 'next'} onPress={onConfirm} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.dialogOverlay },
  sheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 21, paddingTop: 10, gap: 14 },
  grabber: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.15)' },
  title: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  body: { alignItems: 'center', justifyContent: 'center' },
});
