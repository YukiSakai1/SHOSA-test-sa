/** 「あなたのプロフィールを入力してね。」（Figma CH0-15） */
import { router } from 'expo-router';
import { talks } from '@/content/onboarding';
import { TalkLayout } from '@/features/onboarding/components';

export default function Screen() {
  return <TalkLayout bubbleHeight={114} lines={talks.profileIntro.lines} highlight={talks.profileIntro.highlight} onNext={() => router.push('/onboarding/profile')} />;
}
