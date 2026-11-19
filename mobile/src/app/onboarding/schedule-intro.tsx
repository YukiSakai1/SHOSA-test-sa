/** 「次は学習スケジュールを一緒に考えよう！」（Figma CH0-20） */
import { router } from 'expo-router';
import { talks } from '@/content/onboarding';
import { TalkLayout } from '@/features/onboarding/components';

export default function Screen() {
  return <TalkLayout bubbleHeight={114} lines={talks.scheduleIntro.lines} onNext={() => router.push('/onboarding/schedule')} />;
}
