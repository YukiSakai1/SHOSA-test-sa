/** 適性診断の説明（Figma CH0-13） */
import { router } from 'expo-router';
import { talks } from '@/content/onboarding';
import { TalkLayout } from '@/features/onboarding/components';

export default function Screen() {
  return <TalkLayout bubbleHeight={203} lines={talks.aptitudeIntro.lines} onNext={() => router.push({ pathname: '/onboarding/aptitude/[page]', params: { page: '0' } })} />;
}
