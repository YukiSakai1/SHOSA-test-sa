/**
 * 適性診断 結果（index.html #screen-ob-result、Figma CH0-20'）。
 * 1位の職種だけを表示し、2位以降は「1章を進めよう」でロックする。
 * NEXT で 0章を完了扱いにして、1章のガイドへ進む。
 *
 * index.html と同じく、紙のレポート画像（Group 384.png：370×626、見出し・「2位以降を閲覧するには…」の鍵の帯まで描かれている）を
 * (24,33) に置き、その上に 1位の内容（リボン・職種名・割合・アイコン・強み3つ）を重ねる。
 * 背景は「適性診断 完了！」のオレンジ（#FF805C）にベージュの線の柄を重ね、74% の黒で暗くしたもの。
 *
 * M-14：レポートの紙が下からせり上がる（0.6秒）→ M-15：第1位の割合を 0 からカウントアップ（1秒）
 * → M-16：強み3つを上から 0.3秒おきに1つずつ表示 → M-17：最後に 2位以降の鍵の帯（「2位以降を閲覧するには1章を進めよう！」）がフェードインする
 * 紙は鍵の帯を消した画像（resultPaperNoLock）を敷き、帯の部分だけを元の画像から切り出して最後に重ねる
 */
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Polygon } from 'react-native-svg';
import { Appear } from '@/components/Appear';
import { PatternBackground, patterns } from '@/components/PatternBackground';
import { Icon } from '@/components/Icon';
import { CtaButton } from '@/components/ui';
import { diagnosisResult } from '@/content/onboarding';
import { rankRoles } from '@/features/onboarding/diagnosis';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import { useLang } from '@/i18n/LanguageProvider';
import { colors, fonts } from '@/theme/colors';
import { images } from '@/theme/images';
import { layout } from '@/theme/layout';
import { useReducedMotion } from '@/theme/motion';

const PAPER_MS = 600;
const COUNT_MS = 1000;
const STRENGTH_STEP_MS = 300;
/** 強みが出そろってから鍵の帯を出すまでの間 */
const LOCK_PAUSE_MS = 400;
const LOCK_FADE_MS = 500;
const GOLD = '#B09D79';
/** 紙の画像の中で、下の鍵の帯が始まる位置（69.968%）。強みが長くてもこの帯の下に隠れる */
const PAPER_W = 370;
const PAPER_H = 626;
const LOCK_TOP = Math.round(PAPER_H * 0.69968);

export default function DiagnosisResultScreen() {
  const insets = useSafeAreaInsets();
  const { tr } = useLang();
  const { record, update } = useOnboarding();
  const [first] = rankRoles(record.aptitude);
  const r = diagnosisResult;

  const finish = () => {
    update((rec) => ({ ...rec, completed: true }));
    router.dismissTo('/');
    router.push('/chapter1');
  };

  return (
    <PatternBackground {...patterns.beige} color="#FF805C" patternColor="rgba(255,255,255,0.18)">
      <View style={styles.dim} />
      <Appear from="rise" duration={PAPER_MS} distance={120} style={[styles.paper, { top: insets.top + 33 }]}>
        <Image source={images.resultPaperNoLock} style={styles.paperImg} resizeMode="stretch" />
        {first && (
          <View style={styles.content} testID="rank-1">
            <View style={styles.mainRow}>
              <View>
                {/* リボン（右端が 7px 切り欠き） */}
                <View style={styles.ribbon}>
                  <Svg style={StyleSheet.absoluteFill} width={46} height={23}>
                    <Polygon points="0,0 46,0 39,11.5 46,23 0,23" fill={GOLD} />
                  </Svg>
                  <Text style={styles.ribbonNo}>NO</Text>
                  <Text style={styles.ribbonNum}>1</Text>
                </View>
                <View style={styles.nameRow}>
                  <Text style={styles.roleName}>{first.role.name}</Text>
                  <Text style={styles.score}>
                    <CountUp to={first.matchPercent} delay={PAPER_MS} duration={COUNT_MS} />
                    <Text style={styles.percentSign}>%</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.avatar}>
                <Icon icon={first.role.icon} size={50} />
              </View>
            </View>
            <View style={styles.banner}>
              <Text style={styles.bannerText}>{tr(r.strengthsLabel)}</Text>
            </View>
            <View style={styles.strengths}>
              {first.role.strengths.map((s, i) => (
                <Appear key={i} from="none" delay={PAPER_MS + COUNT_MS + i * STRENGTH_STEP_MS} duration={STRENGTH_STEP_MS} style={styles.strengthRow}>
                  <Text style={styles.star}>★</Text>
                  <Text style={styles.strengthText}>{tr(s)}</Text>
                </Appear>
              ))}
            </View>
          </View>
        )}
        {/* .ch20-figma-under：元の画像の下 30%（鍵の帯）を一番上に重ねる。1位の内容が出そろったあと、最後にフェードインする */}
        <Appear
          from="none"
          delay={PAPER_MS + COUNT_MS + (first ? first.role.strengths.length : 0) * STRENGTH_STEP_MS + LOCK_PAUSE_MS}
          duration={LOCK_FADE_MS}
          style={styles.under}
        >
          <View style={styles.underClip} pointerEvents="none" testID="rank-lock">
            <Image source={images.resultPaper} style={[styles.paperImg, { top: -LOCK_TOP }]} resizeMode="stretch" />
          </View>
        </Appear>
      </Appear>
      <View style={[styles.bottom, { top: insets.top + 701 }]}>
        {/* Figma CH0-20'：他の画面の NEXT と同じターコイズ（#00C9C3） */}
        <CtaButton testID="result-next" variant="next" fontSize={18} ledge={{ color: colors.teal, depth: 3 }} label={tr(r.button)} onPress={finish} />
      </View>
    </PatternBackground>
  );
}

/** M-15：0 から to までカウントアップする（点滅させない） */
function CountUp({ to, delay, duration }: { to: number; delay: number; duration: number }) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? to : 0);
  useEffect(() => {
    if (reduced) {
      setN(to);
      return;
    }
    let raf = 0;
    const timer = setTimeout(() => {
      const start = Date.now();
      const tick = () => {
        const p = Math.min(1, (Date.now() - start) / duration);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [to, delay, duration, reduced]);
  return <>{n}</>;
}

const styles = StyleSheet.create({
  dim: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.74)' },
  paper: {
    position: 'absolute',
    left: 24,
    width: PAPER_W,
    height: PAPER_H,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
  },
  paperImg: { position: 'absolute', left: 0, top: 0, width: PAPER_W, height: PAPER_H },
  // 1位の内容：紙の左上から (23,160)、幅 310
  content: { position: 'absolute', left: 23, top: 160, width: 310 },
  mainRow: { flexDirection: 'row', justifyContent: 'space-between', height: 78 },
  ribbon: { width: 46, height: 23, marginTop: 8, flexDirection: 'row', alignItems: 'center', paddingLeft: 6 },
  ribbonNo: { fontSize: 10, fontWeight: '800', color: colors.white },
  ribbonNum: { fontSize: 19, lineHeight: 19, fontWeight: '700', color: colors.white },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 2, height: 32 },
  roleName: { fontFamily: fonts.montserrat, fontSize: 19, lineHeight: 19, color: colors.black, marginTop: 11 },
  score: { fontSize: 32, lineHeight: 32, fontWeight: '700', color: GOLD },
  percentSign: { fontSize: 17, lineHeight: 32, fontWeight: '900' },
  avatar: { width: 78, height: 78, borderRadius: 39, backgroundColor: colors.beige, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  banner: { height: 20, marginTop: 13, backgroundColor: GOLD, paddingHorizontal: 5, justifyContent: 'center' },
  bannerText: { fontSize: 11.5, lineHeight: 20, fontWeight: '700', color: colors.white },
  strengths: { marginTop: 13, gap: 12 },
  strengthRow: { flexDirection: 'row', gap: 6 },
  star: { fontSize: 18, lineHeight: 18, color: '#F8B600' },
  strengthText: { flex: 1, fontSize: 12, lineHeight: 18, color: colors.black },
  under: { position: 'absolute', left: 0, top: LOCK_TOP, width: PAPER_W, height: PAPER_H - LOCK_TOP },
  underClip: { width: PAPER_W, height: PAPER_H - LOCK_TOP, overflow: 'hidden' },
  // index.html：NEXT は左 21・幅 360（画面が広くても中央に寄せない）
  bottom: { position: 'absolute', left: layout.sideMargin, width: 360, maxWidth: '89.5%' },
});
