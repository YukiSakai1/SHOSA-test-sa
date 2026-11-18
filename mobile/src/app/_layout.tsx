import { Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LangFade, LanguageProvider } from '@/i18n/LanguageProvider';
import { Chapter2Provider } from '@/features/chapter2/Chapter2Provider';
import { OnboardingProvider } from '@/features/onboarding/OnboardingProvider';
import { motion, useReducedMotion } from '@/theme/motion';

/** Web（PC のブラウザ）で開いたときは、スマホ幅で中央に表示する。iOS / Android では何もしない */
const WEB_MAX_WIDTH = 480;

function PhoneFrame({ children }: { children: ReactNode }) {
  if (Platform.OS !== 'web') return <>{children}</>;
  return (
    <View style={styles.webOuter}>
      <View style={styles.webInner}>{children}</View>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Montserrat_700Bold });
  const reducedMotion = useReducedMotion();
  // フォント読み込み中は何も描かない（読み込みに失敗した場合はシステムフォントで続行）
  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <OnboardingProvider>
          <Chapter2Provider>
            <StatusBar style="dark" />
            <PhoneFrame>
              <LangFade>
              {/* M-03：右から左へ 0.3秒でスライド（戻る時は逆向き）。M-04：視差効果を減らす ON ならフェードだけ */}
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: reducedMotion ? 'fade' : 'slide_from_right',
                  animationDuration: reducedMotion ? motion.reducedFadeMs : motion.screenMs,
                }}
              >
                {/* 完了画面では戻るジェスチャーで前の問題に戻らせない */}
                <Stack.Screen name="chapter1/complete" options={{ gestureEnabled: false, animation: 'fade' }} />
                <Stack.Screen name="onboarding/complete" options={{ gestureEnabled: false, animation: 'fade' }} />
                <Stack.Screen name="chapter2/complete" options={{ gestureEnabled: false, animation: 'fade' }} />
              </Stack>
              </LangFade>
            </PhoneFrame>
          </Chapter2Provider>
        </OnboardingProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webOuter: { flex: 1, backgroundColor: '#2B2B2B', alignItems: 'center' },
  webInner: { flex: 1, width: '100%', maxWidth: WEB_MAX_WIDTH, overflow: 'hidden' },
});
