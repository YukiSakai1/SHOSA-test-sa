/**
 * ポップアップ（シート・確認ダイアログ・SHOSA Focus など）の入れ物。React Native の Modal の代わりに使う。
 *
 * - iOS / Android：そのまま Modal で画面全体に出す
 * - Web：Modal は body の直下に描かれ、PC ではスマホ枠の外（ブラウザ全体）に広がってしまう。
 *   そこで、スマホ枠の中に置いた入れ物（MODAL_HOST_ID、`app/_layout.tsx` の PhoneFrame）へ描く。
 *   Esc キーで onRequestClose を呼ぶ。
 */
import { useEffect, type ReactElement, type ReactNode } from 'react';
import { Modal, Platform, StyleSheet, View } from 'react-native';

/** Web でポップアップを描く入れ物の id（PhoneFrame の中に置く） */
export const MODAL_HOST_ID = 'app-modal-host';

type CreatePortal = (children: ReactNode, container: Element) => ReactElement;

interface Props {
  visible: boolean;
  onRequestClose: () => void;
  animationType?: 'none' | 'fade' | 'slide';
  children: ReactNode;
}

export function AppModal({ visible, onRequestClose, animationType = 'none', children }: Props) {
  if (Platform.OS !== 'web') {
    return (
      <Modal visible={visible} transparent animationType={animationType} onRequestClose={onRequestClose}>
        {children}
      </Modal>
    );
  }
  return <WebModal visible={visible} onRequestClose={onRequestClose}>{children}</WebModal>;
}

function WebModal({ visible, onRequestClose, children }: Omit<Props, 'animationType'>) {
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onRequestClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, onRequestClose]);

  if (!visible) return null;
  const host = typeof document !== 'undefined' ? document.getElementById(MODAL_HOST_ID) : null;
  const content = <View style={styles.layer}>{children}</View>;
  if (!host) {
    // 入れ物が見つからないときは従来どおり Modal で出す
    return (
      <Modal visible transparent onRequestClose={onRequestClose}>
        {children}
      </Modal>
    );
  }
  // react-dom の型定義は入れていないため、使う関数だけ型を付けて読み込む（Web のときだけ実行される）
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createPortal } = require('react-dom') as { createPortal: CreatePortal };
  return createPortal(content, host);
}

/** PhoneFrame の中に置く入れ物。中身が無いときは触っても下の画面に届く */
export function ModalHost() {
  if (Platform.OS !== 'web') return null;
  return <View nativeID={MODAL_HOST_ID} pointerEvents="box-none" style={styles.host} />;
}

const styles = StyleSheet.create({
  host: { ...StyleSheet.absoluteFill, zIndex: 1000 },
  layer: { ...StyleSheet.absoluteFill },
});
