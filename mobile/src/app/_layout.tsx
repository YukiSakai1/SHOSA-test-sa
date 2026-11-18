import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from '@/i18n/LanguageProvider';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          {/* 1章クリア画面では戻るジェスチャーで問題に戻らせない */}
          <Stack.Screen name="chapter1/complete" options={{ gestureEnabled: false }} />
        </Stack>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
