import { Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat';
import { router, Stack, usePathname } from 'expo-router';
import { CHAPTER2_ENABLED } from '@/lib/features';
import { StatusBar } from 'expo-status-bar';
import { useEffect, type ComponentProps, type ReactNode } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaFrameContext, SafeAreaInsetsContext, SafeAreaProvider } from 'react-native-safe-area-context';
import { ModalHost } from '@/components/AppModal';
import { PatternBackground, patterns } from '@/components/PatternBackground';
import { images } from '@/theme/images';
import { LangFade, LanguageProvider } from '@/i18n/LanguageProvider';
import { Chapter2Provider } from '@/features/chapter2/Chapter2Provider';
import { OnboardingProvider } from '@/features/onboarding/OnboardingProvider';
import { motion, useReducedMotion } from '@/theme/motion';

/**
 * Web で開いたときの表示（iOS / Android では何もしない）。index.html の .device-container と同じにする。
 * - 幅 501 以上かつ高さ 620 以上（PC・タブレット）：402×874 のスマホ枠を中央に置き、画面に収まるよう縮小する。
 *   iPhone のセーフエリア（上 59・下 34）があるものとして並べる（index.html の --safe-top / --safe-bottom と同じ）
 * - それ以外（スマホのブラウザ）：画面いっぱいに表示する
 */
const STAGE_W = 402;
const STAGE_H = 874;
const STAGE_INSETS = { top: 59, bottom: 34, left: 0, right: 0 };
const STAGE_FRAME = { x: 0, y: 0, width: STAGE_W, height: STAGE_H };

/**
 * スマホ枠の外（PC の背景）。index.html の body:has(...) と同じく、表示中の画面で変える。
 * - タイトル・イントロ・1章ガイド：ターコイズの菱形（90px、中央から）
 * - SHOSA が話す画面：カーペット（carpet_beige.jpg を幅 200 で）
 * - それ以外：#FAF8F2 にベージュの菱形とドットの柄（スタート画面と同じ形。128px、中央から）
 * スマホ枠は画面に合わせて縮小される（scale）ので、枠の外の柄も同じ縮小率にして、枠の中の柄と同じ見た目の大きさにそろえる。
 */
const TALK_SCREENS = ['/onboarding/greet', '/onboarding/schedule-intro', '/onboarding/profile-intro', '/onboarding/aptitude-intro'];
function backdropFor(pathname: string, scale: number): ComponentProps<typeof PatternBackground> {
  if (pathname === '/' || pathname.startsWith('/onboarding/intro') || pathname === '/chapter1') {
    return { ...patterns.turquoiseSmall, tile: patterns.turquoiseSmall.tile * scale };
  }
  if (TALK_SCREENS.includes(pathname)) {
    return { color: '#BFA889', patternColor: 'transparent', variant: 'image', tileImage: images.carpetBeige, tile: 200 * scale, tileHeight: ((200 * 181) / 522) * scale };
  }
  return { ...patterns.beige, tile: patterns.beige.tile * scale, color: '#FAF8F2', align: 'center' };
}

function PhoneFrame({ children }: { children: ReactNode }) {
  const { width: w, height: h } = useWindowDimensions();
  const pathname = usePathname();
  if (Platform.OS !== 'web') return <>{children}</>;
  const framed = w > 500 && h >= 620;
  if (!framed)
    return (
      <View style={styles.webFull}>
        {children}
        <ModalHost />
      </View>
    );
  // 894 = 874 + 枠 14 + 外側の線 6、420 = 402 + 14 + 4（index.html の --stage-scale と同じ計算）
  const scale = Math.min(1, (h - 32) / 894, (w - 32) / 420);
  return (
    <PatternBackground {...backdropFor(pathname, scale)} style={styles.webOuter}>
      <View style={[styles.stageOutline, { transform: [{ scale }] }]}>
        <View style={styles.stage}>
          <SafeAreaFrameContext.Provider value={STAGE_FRAME}>
            <SafeAreaInsetsContext.Provider value={STAGE_INSETS}>
              {children}
              {/* ポップアップはスマホ枠の中に出す（components/AppModal.tsx） */}
              <ModalHost />
            </SafeAreaInsetsContext.Provider>
          </SafeAreaFrameContext.Provider>
        </View>
      </View>
    </PatternBackground>
  );
}

/**
 * Web だけ：index.html と同じく Google Fonts の Roboto（EN / JP ボタンの文字）を読み込む。
 * iOS / Android ではアプリに同梱していないため何もしない。
 */
function useWebRobotoFont() {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const id = 'google-font-roboto';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap';
    document.head.appendChild(link);
  }, []);
}

/** 2章を出さないあいだ、/chapter2 以下の画面を開こうとしたらタイトルへ戻す */
function Chapter2Guard() {
  const pathname = usePathname();
  useEffect(() => {
    if (!CHAPTER2_ENABLED && pathname.startsWith('/chapter2')) router.replace('/');
  }, [pathname]);
  return null;
}

export default function RootLayout() {
  useWebRobotoFont();
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
              <Chapter2Guard />
              </LangFade>
            </PhoneFrame>
          </Chapter2Provider>
        </OnboardingProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webFull: { flex: 1, overflow: 'hidden' },
  webOuter: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  // .device-container（PC）：外側に金の線（2px・1px 離す）、黒い枠 7px、角丸 44、影
  stageOutline: {
    padding: 1,
    borderWidth: 2,
    borderColor: 'rgba(196,162,101,0.75)',
    borderRadius: 47,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
  },
  stage: {
    width: STAGE_W + 14,
    height: STAGE_H + 14,
    borderWidth: 7,
    borderColor: '#1C1C1F',
    borderRadius: 44,
    backgroundColor: '#FAF8F2',
    overflow: 'hidden',
  },
});
