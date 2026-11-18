/**
 * プロフィール入力のバリデーション。
 *
 * ⚠️ 仕様は未確定（Slack で「入力フィールドのバリデーション・エラーメッセージの定義」が未決）。
 * ここに書いたルールとメッセージは暫定版で、Figma の注記
 * 「10文字以内でシンプルな名前を設定してください」だけを根拠にしている。
 * 仕様が決まったらこのファイルだけ直せば画面に反映される。
 */
import type { Localized } from '@/content/types';
import type { ProfileInput } from './OnboardingProvider';

export const NAME_MAX_LENGTH = 10;

export type ProfileField = 'gender' | 'name' | 'countryId' | 'birthday';
export type ProfileErrors = Partial<Record<ProfileField, Localized>>;

/** 書記素（見た目の1文字）単位で数える。絵文字や結合文字を1文字として扱う */
export function countChars(s: string): number {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    return [...new Intl.Segmenter().segment(s)].length;
  }
  return [...s].length;
}

export function validateProfile(p: ProfileInput): ProfileErrors {
  const errors: ProfileErrors = {};
  const name = p.name.trim();
  if (!p.gender) errors.gender = { ja: '性別を選択してください', en: 'Please select your gender' };
  if (name.length === 0) {
    errors.name = { ja: '名前を入力してください', en: 'Please enter your name' };
  } else if (countChars(name) > NAME_MAX_LENGTH) {
    errors.name = { ja: `名前は${NAME_MAX_LENGTH}文字以内で入力してください`, en: `Please use ${NAME_MAX_LENGTH} characters or fewer` };
  } else if (/[<>{}\\]/.test(name)) {
    errors.name = { ja: '使用できない記号が含まれています', en: 'Your name contains characters that are not allowed' };
  }
  if (!p.countryId) errors.countryId = { ja: '出身国を選択してください', en: 'Please select your country' };
  if (!p.birthday) errors.birthday = { ja: '誕生日を選択してください', en: 'Please select your birthday' };
  return errors;
}

export function isProfileValid(p: ProfileInput): boolean {
  return Object.keys(validateProfile(p)).length === 0;
}
