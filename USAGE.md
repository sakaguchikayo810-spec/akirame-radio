# あきらめラジオ 使用方法ガイド

## 🚀 クイックスタート

### 1. ローカルで実行する

#### 方法A: VSCode Live Server（推奨）

1. VSCodeで`akirame-radio`フォルダを開く
2. [`index.html`](index.html)を右クリック
3. "Open with Live Server"を選択
4. ブラウザが自動的に開きます

#### 方法B: Python

```bash
cd akirame-radio
python -m http.server 8000
```

ブラウザで `http://localhost:8000` を開く

#### 方法C: Node.js

```bash
cd akirame-radio
npx http-server
```

---

## 📝 データの更新方法

### Googleスプレッドシートからデータを更新

1. **スプレッドシートを編集**
   - [Googleスプレッドシート](https://docs.google.com/spreadsheets/d/1rSDvXfLoOUFdWZ-xEki1zcgPaW_RnftpzgDqnOJZvj0/)を開く
   - エピソード情報を追加・編集

2. **CSVとしてダウンロード**
   - ファイル → ダウンロード → カンマ区切り形式(.csv)

3. **JSONに変換**
   
   手動で変換する場合:
   ```json
   {
     "id": 13,
     "episodeNo": "EP013",
     "title": "新しいエピソードタイトル",
     "date": "2024-01-22",
     "guest": "ゲスト名",
     "mainGenre": "仕事",
     "subTags": ["キーワード1", "キーワード2"],
     "mood": "前向きになりたい",
     "summary": "一言要約",
     "spotifyUrl": "https://open.spotify.com/...",
     "appleUrl": "https://podcasts.apple.com/..."
   }
   ```

4. **[`data/episodes.json`](data/episodes.json)を更新**
   - 新しいエピソードを`episodes`配列に追加
   - `metadata.totalEpisodes`を更新
   - `metadata.lastUpdated`を更新

5. **ブラウザをリロード**
   - 変更が即座に反映されます

---

## 🎯 機能の使い方

### フィルタリング機能

#### 1. メインジャンルで絞り込み
- フィルターセクションの「メインジャンル」ボタンをクリック
- 選択したジャンルのエピソードのみ表示されます
- 「すべて」をクリックすると全エピソード表示に戻ります

#### 2. キーワードで検索
- 検索ボックスにキーワードを入力
- タイトル、ゲスト名、要約、タグから検索されます
- リアルタイムで結果が更新されます

#### 3. キーワードタグで絞り込み
- 表示されているタグをクリック
- 複数のタグを選択可能（OR条件）
- 再度クリックで選択解除

#### 4. 気分で絞り込み
- 「今の気分」ドロップダウンから選択
- 選択した気分に合うエピソードが表示されます

#### 5. 複合フィルター
- 複数のフィルターを組み合わせて使用可能
- すべての条件を満たすエピソードが表示されます

#### 6. フィルターをリセット
- 「フィルターをリセット」ボタンをクリック
- すべてのフィルターがクリアされます

### おすすめ機能

- フィルター条件に基づいて、最適な3エピソードを自動表示
- フィルター未選択時は最新3エピソードを表示
- フィルター変更時に自動更新されます

### ソート機能

- 「新着順」: 最新のエピソードから表示
- 「古い順」: 古いエピソードから表示
- 「タイトル順」: タイトルの五十音順で表示

---

## 🎨 カスタマイズ方法

### カラーの変更

[`css/variables.css`](css/variables.css)を編集:

```css
:root {
  --primary-color: #667eea;  /* メインカラー */
  --genre-work: #f59e0b;     /* 仕事カテゴリー */
  --genre-love: #ec4899;     /* 恋愛カテゴリー */
  /* ... */
}
```

### フォントの変更

[`index.html`](index.html)のGoogle Fontsリンクを変更:

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap" rel="stylesheet">
```

[`css/reset.css`](css/reset.css)のfont-familyを変更:

```css
body {
  font-family: 'Noto Sans JP', sans-serif;
}
```

### レイアウトの調整

[`css/layout.css`](css/layout.css)を編集:

```css
.container {
  max-width: var(--container-xl);  /* コンテナ幅 */
}

.episodes-grid {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  /* カード幅を調整 */
}
```

---

## 🌐 デプロイ方法

### GitHub Pagesにデプロイ

```bash
# 1. GitHubリポジトリを作成
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/akirame-radio.git
git push -u origin main

# 2. GitHub Pagesを有効化
# Settings → Pages → Source: main branch → Save
```

サイトURL: `https://username.github.io/akirame-radio/`

### Netlifyにデプロイ

1. [Netlify](https://www.netlify.com/)にログイン
2. "New site from Git"をクリック
3. GitHubリポジトリを選択
4. デプロイ設定:
   - Build command: (空欄)
   - Publish directory: `.`
5. "Deploy site"をクリック

### Vercelにデプロイ

```bash
# Vercel CLIをインストール
npm i -g vercel

# プロジェクトディレクトリで実行
cd akirame-radio
vercel

# 質問に答えてデプロイ完了
```

---

## 🔧 トラブルシューティング

### データが表示されない

**原因**: CORSエラー（ローカルファイルシステムから直接開いている）

**解決方法**: ローカルサーバーを使用してください
```bash
python -m http.server 8000
```

### フィルターが動作しない

**確認事項**:
1. ブラウザのコンソールでエラーを確認
2. [`data/episodes.json`](data/episodes.json)の形式が正しいか確認
3. JavaScriptファイルが正しく読み込まれているか確認

### スタイルが適用されない

**確認事項**:
1. CSSファイルのパスが正しいか確認
2. ブラウザのキャッシュをクリア（Ctrl+Shift+R / Cmd+Shift+R）
3. 開発者ツールでCSSが読み込まれているか確認

### モバイルで表示が崩れる

**確認事項**:
1. [`css/responsive.css`](css/responsive.css)が読み込まれているか確認
2. ビューポートメタタグが設定されているか確認:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

---

## 📊 パフォーマンス最適化

### 画像の最適化

1. WebP形式を使用
2. 適切なサイズにリサイズ
3. Lazy loadingを実装

### JSONファイルの最適化

- 不要なデータを削除
- ファイルサイズを最小化
- 必要に応じてページネーション実装

### キャッシュの活用

サービスワーカーを実装してオフライン対応:

```javascript
// service-worker.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('akirame-radio-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/css/style.css',
        '/js/main.js',
        '/data/episodes.json'
      ]);
    })
  );
});
```

---

## 🧪 テスト方法

### ブラウザテスト

1. Chrome DevToolsを開く（F12）
2. Responsive Design Modeで各デバイスサイズを確認
3. コンソールでエラーがないか確認

### 機能テスト

- [ ] データが正しく読み込まれる
- [ ] ジャンルフィルターが動作する
- [ ] キーワード検索が動作する
- [ ] 気分フィルターが動作する
- [ ] ソート機能が動作する
- [ ] リセットボタンが動作する
- [ ] おすすめが正しく表示される
- [ ] レスポンシブデザインが機能する

### アクセシビリティテスト

- [ ] キーボードで操作できる
- [ ] スクリーンリーダーで読み上げられる
- [ ] 十分なコントラスト比がある
- [ ] フォーカス表示が明確

---

## 📞 サポート

質問や問題がある場合:

1. [`README.md`](README.md)を確認
2. ブラウザのコンソールでエラーを確認
3. GitHubでIssueを作成

---

## 🎓 学習リソース

### HTML/CSS/JavaScript

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS-Tricks](https://css-tricks.com/)
- [JavaScript.info](https://javascript.info/)

### レスポンシブデザイン

- [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)

### デプロイ

- [GitHub Pages Documentation](https://docs.github.com/pages)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)
