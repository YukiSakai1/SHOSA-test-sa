/** SHOSA のあいさつ（Figma CH0-07） */
import { router } from 'expo-router';
import { talks } from '@/content/onboarding';
import { TalkLayout } from '@/features/onboarding/components';

export default function Screen() {
  return <TalkLayout bubbleHeight={155} lines={talks.greet.lines} onNext={() => router.push({ pathname: '/onboarding/hearing/[step]', params: { step: '0' } })} />;
}
