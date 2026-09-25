# あきらめラジオ Webサイト

諦めることで見つける、新しい生き方を探すポッドキャストのWebサイトです。

## 🎯 プロジェクト概要

既存のFramerサイトのデザインを維持しつつ、COTENラジオの「All series」のようなデータベース駆動のエピソード表示機能を実装しています。

### 主要機能

- **エピソードデータベース表示**: Googleスプレッドシートのデータを活用
- **フィルタリング機能**: メインジャンル、キーワード、気分で絞り込み
- **レコメンデーション**: スコアリングによるおすすめ3エピソード表示
- **ソート機能**: 新着順、古い順、タイトル順
- **レスポンシブデザイン**: モバイル、タブレット、デスクトップ対応

## 📁 プロジェクト構成

```
akirame-radio/
├── index.html              # メインページ
├── css/
│   ├── reset.css          # CSSリセット
│   ├── variables.css      # CSS変数定義
│   ├── layout.css         # レイアウト
│   ├── components.css     # コンポーネント
│   ├── filter.css         # フィルターセクション
│   ├── episodes.css       # エピソード表示
│   └── responsive.css     # レスポンシブ対応
├── js/
│   ├── main.js           # メインロジック・初期化
│   ├── filter.js         # フィルタリング機能
│   ├── recommend.js      # レコメンデーション機能
│   ├── sort.js           # ソート機能
│   └── ui.js             # UI更新処理
├── data/
│   └── episodes.json     # エピソードデータ
└── README.md
```

## 🚀 使い方

### ローカルで実行

1. **リポジトリをクローン**
   ```bash
   git clone <repository-url>
   cd akirame-radio
   ```

2. **ローカルサーバーを起動**
   
   VSCode Live Serverを使用する場合:
   - VSCodeで`index.html`を開く
   - 右クリック → "Open with Live Server"
   
   Pythonを使用する場合:
   ```bash
   python -m http.server 8000
   ```
   
   Node.jsを使用する場合:
   ```bash
   npx http-server
   ```

3. **ブラウザでアクセス**
   ```
   http://localhost:8000
   ```

### データの更新

1. **Googleスプレッドシートを編集**
   - [スプレッドシート](https://docs.google.com/spreadsheets/d/1rSDvXfLoOUFdWZ-xEki1zcgPaW_RnftpzgDqnOJZvj0/)を開く
   - エピソード情報を追加・編集

2. **CSVとしてエクスポート**
   - ファイル → ダウンロード → カンマ区切り形式(.csv)

3. **JSONに変換**
   - CSVをJSON形式に変換（手動またはツール使用）
   - `data/episodes.json`を更新

4. **サイトに反映**
   - ファイルを保存してブラウザをリロード

## 🎨 デザインシステム

### カラーパレット

- **プライマリー**: `#667eea` (紫)
- **ジャンル別**:
  - 仕事: `#f59e0b` (オレンジ)
  - 恋愛: `#ec4899` (ピンク)
  - 人間関係: `#8b5cf6` (紫)
  - 健康: `#10b981` (緑)
  - お金: `#06b6d4` (シアン)

### ブレークポイント

- モバイル: ~768px
- タブレット: 769px~1024px
- デスクトップ: 1025px~

## 🔧 技術スタック

- **HTML5**: セマンティックマークアップ
- **CSS3**: Flexbox/Grid、カスタムプロパティ
- **Vanilla JavaScript (ES6+)**: モジュール化、クラスベース設計
- **外部ライブラリ**: なし（純粋なHTML/CSS/JS）

## 📊 データ構造

### episodes.json

```json
{
  "metadata": {
    "lastUpdated": "2024-01-15",
    "totalEpisodes": 12
  },
  "genres": ["仕事", "恋愛", "人間関係", "健康", "お金"],
  "moods": ["前向きになりたい", "癒されたい", "共感したい", "学びたい"],
  "episodes": [
    {
      "id": 1,
      "episodeNo": "EP001",
      "title": "エピソードタイトル",
      "date": "2024-01-15",
      "guest": "ゲスト名",
      "mainGenre": "仕事",
      "subTags": ["キャリア", "転職"],
      "mood": "前向きになりたい",
      "summary": "一言要約",
      "spotifyUrl": "https://...",
      "appleUrl": "https://..."
    }
  ]
}
```

## 🌐 デプロイ

### GitHub Pages

```bash
# リポジトリ作成
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/akirame-radio.git
git push -u origin main

# Settings → Pages → Source: main branch
```

### Netlify

1. [Netlify](https://www.netlify.com/)にログイン
2. "New site from Git"をクリック
3. リポジトリを選択
4. デプロイ設定:
   - Build command: (空欄)
   - Publish directory: `.`
5. "Deploy site"をクリック

### Vercel

```bash
# Vercel CLIをインストール
npm i -g vercel

# デプロイ
vercel
```

## 🧪 テスト

### ブラウザ互換性

- ✅ Chrome (最新版)
- ✅ Firefox (最新版)
- ✅ Safari (最新版)
- ✅ Edge (最新版)

### レスポンシブテスト

- ✅ iPhone SE (375px)
- ✅ iPhone 12/13 (390px)
- ✅ iPad (768px)
- ✅ iPad Pro (1024px)
- ✅ デスクトップ (1280px+)

## 📝 ライセンス

© 2026 あきらめラジオ. All rights reserved.

## 🔗 参考リンク

- [既存Framerサイト](https://akirameradio.framer.website/)
- [Googleスプレッドシート](https://docs.google.com/spreadsheets/d/1rSDvXfLoOUFdWZ-xEki1zcgPaW_RnftpzgDqnOJZvj0/)
- [COTENラジオ参考](https://coten.co.jp/services/cotenradio/)

## 📧 お問い合わせ

質問や提案がある場合は、Issueを作成してください。
