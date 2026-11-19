/**
 * はい／いいえの確認ダイアログ。
 * Alert.alert は Web で動かないため、iOS / Android / Web 共通で Modal を使う。
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { PressScale } from '@/components/ui';
import { AppModal } from '@/components/AppModal';

interface Props {
  visible: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ visible, title, body, confirmLabel, cancelLabel, onConfirm, onCancel }: Props) {
  return (
    <AppModal visible={visible} animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          <View style={styles.row}>
            <View style={{ flex: 1 }}><PressScale onPress={onCancel} style={[styles.btn, styles.cancel]}>
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </PressScale></View>
            <View style={{ flex: 1 }}><PressScale onPress={onConfirm} style={[styles.btn, styles.ok]}>
              <Text style={styles.okText}>{confirmLabel}</Text>
            </PressScale></View>
          </View>
        </Pressable>
      </Pressable>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.dialogOverlay, justifyContent: 'center', padding: 28 },
  card: { backgroundColor: colors.beige, borderRadius: 18, padding: 22, gap: 10 },
  title: { fontSize: 17, fontWeight: '800', color: colors.text },
  body: { fontSize: 14, lineHeight: 21, color: colors.text },
  row: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btn: { borderRadius: 999, paddingVertical: 12, alignItems: 'center' },
  cancel: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.goldBorder },
  cancelText: { color: colors.text, fontWeight: '700' },
  ok: { backgroundColor: colors.purple },
  okText: { color: colors.white, fontWeight: '800' },
});
