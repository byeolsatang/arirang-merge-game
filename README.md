# ARIRANG Merge Game

ARIRANG WORLD TOUR を、いろいろな切り口のテーマで遊べる **カスタム前提の drop-and-merge game** です。

このリポジトリは、特定のメンバー版・特定の画像集に固定しません。
「ユンギ 불타오르네集」「爆イケ画像集」「面白エピソード集」「衣装集」など、
テーマごとに画像・音・合成演出を差し替えられる土台として使います。

## 現在の構成

- `index.html` — ゲーム画面
- `styles.css` — UI とエフェクト用 CSS
- `src/game.js` — 落下・衝突・合成・スコアなどゲーム本体
- `src/effects.js` — 合成時の文字・粒・フラッシュ・画面揺れ
- `src/audio.js` — 効果音再生
- `src/config.js` — テーマ読込
- `themes/arirang-base.js` — **普段いじるテーマ設定**
- `assets/` — テーマごとの画像・音声

物理演算は Matter.js を CDN から読み込みます。

## テーマで変更できるもの

`themes/arirang-base.js` にまとめています。

### 1. 各レベルの画像

```js
{ 
  label: "01",
  emoji: "✨",
  asset: "./assets/themes/yoongi-fire/images/01.webp",
  radius: 18,
  score: 1
}
```

`asset` が空なら emoji が表示されるので、素材がまだなくても動作確認できます。

### 2. 合成時の演出

```js
7: {
  text: "ICONIC",
  particles: 30,
  particleEmoji: "🔥",
  flash: true,
  shake: 1,
  sound: "./assets/themes/yoongi-fire/sounds/level-7.mp3"
}
```

レベルごとに次を指定できます。

- ポップアップ文字
- 飛び散るパーツ数
- 飛び散る絵文字
- フラッシュ
- 画面揺れ
- 専用SE

つまり「画像が大きくなるだけ」ではなく、テーマそのものに演出を持たせられます。

### 3. サウンド

```js
audio: {
  drop: "./assets/themes/example/sounds/drop.mp3",
  mergeDefault: "./assets/themes/example/sounds/merge.mp3",
  gameOver: "./assets/themes/example/sounds/game-over.mp3"
}
```

特定レベルだけ別の音にしたい場合は `mergeEffects[level].sound` を指定します。

## 素材フォルダ案

```text
assets/
  themes/
    yoongi-fire/
      images/
        01.webp
        02.webp
        ...
        11.webp
      sounds/
    best-looks/
      images/
      sounds/
    funny-moments/
      images/
      sounds/
```

## 次にやること

次の段階では、1つのテーマファイルを書き換える方式から、

1. 複数テーマを登録
2. ゲーム開始前に THEME SELECT
3. テーマを選んでゲーム開始

という構造へ拡張します。

その後、合成時の専用演出として、紫ハート、紙吹雪、文字バースト、画像ポップアップなどを追加していきます。

## Notes

このベースには BTS / ARIRANG の画像・音声素材そのものは含めていません。
使用する素材の権利・公開範囲は、各テーマを作る際に確認してください。
