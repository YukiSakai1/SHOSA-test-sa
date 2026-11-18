/* =========================================================
   TYPE DEFINITIONS FOR SHOSA GAME
   ========================================================= */

// --- Game Data Types ---
interface GameChoice {
  label: string;
  quality: 'best' | 'okay' | 'bad' | string;
  feedback: string;
  feedback_en?: string;
  gaugeDelta: number;
  teamDelta: number;
  guestDelta: number;
  points: number;
}

interface GameQuestion {
  text: string;
  textEn?: string;
  choices: GameChoice[];
}

interface GameNPC {
  name: string;
  avatar: string;
  bannerNeutral: string;
  bannerHappy: string;
  bannerWorried: string;
}

interface GameExplanation {
  lessonNo: string;
  title: string;
  body: string;
  body_en?: string;
}

interface GameVoice {
  lessonNo: string;
  script: string;
  script_en?: string;
}

interface GameDay {
  dayTitle: string;
  timeLabel: string;
  genreTag: string;
  sceneIntro: string;
  sceneIntro_en?: string;
  daySummaryDesc?: string;
  npc: GameNPC;
  story: string;
  story_en?: string;
  hint: string;
  hint_en?: string;
  dialogueText: string;
  dialogueText_en?: string;
  gaugeLabel: string;
  question: GameQuestion;
  explanation: GameExplanation;
  voice: GameVoice;
}

interface GameData {
  days: GameDay[];
}

// --- Chapter 1 (Sheet2) Data Types ---
interface Chapter1Lesson {
  id: string;
  time: string;
  titleJa: string;
  titleEn: string;
  narrationJa: string;
  narrationEn: string;
  charImgId?: string;
  sceneImg: string;
  shosaImgId?: string;
  speakerJa: string;
  speakerEn: string;
  line1Ja: string;
  line1En: string;
  line2Ja: string;
  line2En: string;
  situationTagJa: string;
  situationTagEn: string;
  questionJa: string;
  questionEn: string;
  choiceAJa: string;
  choiceAEn: string;
  choiceBJa: string;
  choiceBEn: string;
  correct: 'A' | 'B';
  reasonJa: string;
  reasonEn: string;
  shosaPromptJa: string;
  shosaPromptEn: string;
  focusTextJa: string;
  focusTextEn: string;
  focusImgCaptionJa?: string;
}

interface Chapter1Data {
  guide: {
    badgeNumber: string;
    titleJa: string;
    titleEn: string;
    subtitleJa: string;
    subtitleEn: string;
    bodyJa: string;
    bodyEn: string;
    buttonJa: string;
    buttonEn: string;
  };
  end: {
    titleJa: string;
    titleEn: string;
    bodyJa: string;
    bodyEn: string;
    noteJa: string;
    noteEn: string;
    unlockLabelJa: string;
    unlockLabelEn: string;
    buttonJa: string;
    buttonEn: string;
  };
  common: {
    correctJa: string;
    correctEn: string;
    incorrectJa: string;
    incorrectEn: string;
    situationLabel: string;
    questionLabel: string;
  };
  lessons: Chapter1Lesson[];
}

// --- Onboarding Data Types ---
interface LanguageOption {
  id: string;
  label: string;
  flag: string;
  icon?: string;
}

interface IntroSlide {
  type: 'welcome' | 'features' | 'steps' | 'certification' | string;
  badgeText?: string;
  badgeTextEn?: string;
  logoImg?: string;
  title: string;
  titleEn?: string;
  heroImg: string;
  reportBaseImg?: string;
  buttonLabel: string;
  buttonLabelEn?: string;
  bodyLead?: string;
  bodyLeadEn?: string;
  bodySub?: string;
  bodySubEn?: string;
  desc?: string;
  descEn?: string;
  reportLead?: string;
  reportLeadEn?: string;
  badges?: string[];
  badgesEn?: string[];
  reportTail?: string;
  reportTailEn?: string;
  featuresJa?: string[];
  featuresEn?: string[];
  stepsJa?: string[];
  stepsEn?: string[];
  caption?: string;
  captionEn?: string;
}

interface HearingOption {
  label: string;
  labelEn?: string;
  icon?: string;
  hasInput?: boolean;
}

interface HearingQuestion {
  key: string;
  label: string;
  question: string;
  questionEn?: string;
  options: HearingOption[];
}

interface AptitudeQuestion {
  id?: number;
  dimension: string;
  text: string;
  textEn?: string;
}

interface AvatarOption {
  id: string;
  path: string;
}

interface VoiceTypeOption {
  id: string;
  label: string;
  rate: number;
  pitch: number;
}

interface ScheduleTimeOption {
  id: string;
  label: string;
  icon: string;
}

interface JourneyStep {
  step: number;
  doorNumber: string | null;
  doorImg: string;
  dotImg?: string;
  mascotImg?: string;
  isOpen: boolean;
  isLocked: boolean;
  lockImg?: string;
  title: string;
  desc: string;
  titleEn?: string;
  descEn?: string;
}

interface I18nDictionary {
  [key: string]: string;
}

interface StatItem {
  icon: string;
  label: string;
  value: number;
}

interface OnboardingData {
  languageOptions: LanguageOption[];
  introSlides: IntroSlide[];
  hearings: HearingQuestion[];
  aptitudeIntro: string;
  aptitudeIntroEn?: string;
  aptitudeQuestions: AptitudeQuestion[];
  avatarOptions: AvatarOption[];
  voiceTypes: VoiceTypeOption[];
  scheduleTimeOptions: ScheduleTimeOption[];
  scheduleStreakOptions: number[];
  journeySteps: JourneyStep[];
  roleResults?: Record<string, any>;
  q4Followup?: Record<string, any>;
  i18n: {
    ja: I18nDictionary;
    en: I18nDictionary;
  };
  stats: {
    visible: boolean;
    items: StatItem[];
  };
}

// --- User Profile & State ---
interface UserProfile {
  gender: string | null;
  name: string;
  country: string;
  birthdate: string;
  avatar: string | null;
  voiceType: string;
}

interface OnboardingSchedule {
  preferredTime: string | null;
  notifyTime: string;
  notifyEnabled: boolean;
  userCustomizedTime?: boolean;
  lessonsPerDay: number;
  days: {
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
  };
  streakGoal: number | null;
}

interface OnboardingState {
  languageSetting: string | null;
  slideIndex: number;
  hearingIndex: number;
  aptitudeIndex: number;
  aptitudePageIndex?: number;
  answers: {
    touchpoint: string | null;
    purpose: string | null;
    interest: string | null;
    concern: string | null;
    [key: string]: any;
  };
  aptitudeScores: Record<string, number>;
  profile: UserProfile;
  schedule: OnboardingSchedule;
}

// --- Window and App Global Declarations ---
interface Window {
  GAME_DATA: GameData;
  CH1_DATA: Chapter1Data;
  ONBOARDING_DATA: OnboardingData;
  renderActiveCh101Screen?: () => void;
  currentAppLang: string;
  PLAYER_NAME: string;
  PLAYER_AVATAR: string;
  obState: any;
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
  onboarding: any;
  $: (id: string) => any;
  showScreen: (id: string) => void;
  goTo: (fn: (...args: any[]) => void, ...args: any[]) => void;
  goBack: () => void;
  updateLangToggleVisuals: () => void;
  devEscSafe: (str: string | null | undefined) => string;
  loadHearing: (i: number) => void;
  loadAptitudeIntro: () => void;
  loadAptitudeQuestion: (i: number) => void;
  loadAptitudeResult: () => void;
  loadProfile: (step: number) => void;
  loadYourJourney: () => void;
  loadScheduleTime: () => void;
  loadScheduleDays: () => void;
  loadScheduleStreak: () => void;
  loadChapter0Complete: () => void;
  startOnboarding: () => void;
  resetAllSavedData: () => void;
  [key: string]: any;
}

