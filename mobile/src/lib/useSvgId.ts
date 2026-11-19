import { useId } from 'react';

/**
 * SVG の id（グラデーション・柄・マスク）を、部品ごとに重ならない名前にする。
 *
 * Web では前の画面も非表示のままページに残る。同じ id が2つあると、ブラウザは最初の1つ
 * （＝非表示の前の画面の中）を使うため、柄やグラデーションが描かれなくなる。
 * SVG の id は必ずこのフックで作り、`fill={\`url(#${id})\`}` のように参照する。
 *
 *   const skyId = useSvgId('sky');
 *   <RadialGradient id={skyId} ... />  <Rect fill={`url(#${skyId})`} />
 */
export function useSvgId(name: string): string {
  return `${name}-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
}
