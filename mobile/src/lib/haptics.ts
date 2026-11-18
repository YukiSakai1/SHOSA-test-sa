/**
 * 触覚フィードバック（M-01 / M-07 / M-36 / M-37 / CH0-19 成功）。
 * Web では何もしない。端末が対応していなくても例外を出さない。
 */
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const enabled = Platform.OS === 'ios' || Platform.OS === 'android';

export const haptics = {
  /** ボタンを押した瞬間（M-01） */
  tap: () => enabled && void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}),
  /** 選択・ホイールの1目盛り・トグル（M-07 / M-36 / M-37） */
  select: () => enabled && void Haptics.selectionAsync().catch(() => {}),
  /** 診断完了など成功の瞬間（CH0-19） */
  success: () => enabled && void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}),
};
