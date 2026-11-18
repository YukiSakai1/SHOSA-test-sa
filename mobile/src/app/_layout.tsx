import { Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { Chapter2Provider } from '@/features/chapter2/Chapter2Provider';
import { OnboardingProvider } from '@/features/onboarding/OnboardingProvider';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Montserrat_700Bold });
  // フォント読み込み中は何も描かない（読み込みに失敗した場合はシステムフォントで続行）
  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <OnboardingProvider>
          <Chapter2Provider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            {/* 完了画面では戻るジェスチャーで前の問題に戻らせない */}
            <Stack.Screen name="chapter1/complete" options={{ gestureEnabled: false, animation: 'fade' }} />
            <Stack.Screen name="onboarding/complete" options={{ gestureEnabled: false, animation: 'fade' }} />
            <Stack.Screen name="chapter2/complete" options={{ gestureEnabled: false, animation: 'fade' }} />
          </Stack>
          </Chapter2Provider>
        </OnboardingProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
