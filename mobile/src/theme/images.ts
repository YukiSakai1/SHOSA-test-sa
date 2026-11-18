/**
 * 画像レジストリ。
 * React Native では画像を `require()` で静的に読み込む必要があるため、
 * データ側はファイルパスではなくこのキー（ImageKey）で画像を指定する。
 * 画像を追加したら assets/images/ に置き、ここに1行足す。
 */
export const images = {
  sceneL01Mirror: require('../../assets/images/scene_l01_mirror.png'),
  mascotFace: require('../../assets/images/mascot_shosa_face.png'),
  mascotIntro: require('../../assets/images/mascot_shosa_intro.png'),
  floorShadow: require('../../assets/images/floor_shadow.png'),
  iconFocus: require('../../assets/images/icon_focus.png'),
  focusChecklistL01: require('../../assets/images/focus_checklist_l01.png'),
  cardBorderSelected: require('../../assets/images/card_border_selected.png'),
  cardBorderUnselected: require('../../assets/images/card_border_unselected.png'),
  medal: require('../../assets/images/medal.png'),
  filigreeTop: require('../../assets/images/decor_filigree_top.png'),
  filigreeBottom: require('../../assets/images/decor_filigree_bottom.png'),
} as const;

export type ImageKey = keyof typeof images;
