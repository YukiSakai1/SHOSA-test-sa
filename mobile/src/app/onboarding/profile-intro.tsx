/** 「あなたのプロフィールを入力してね。」（Figma CH0-15） */
import { router } from 'expo-router';
import { talks } from '@/content/onboarding';
import { TalkLayout } from '@/features/onboarding/components';

export default function Screen() {
  return <TalkLayout lines={talks.profileIntro.lines} onNext={() => router.push('/onboarding/profile')} />;
}
