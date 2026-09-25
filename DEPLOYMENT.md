# Vercelへのデプロイ手順

## 方法1: Vercel Web UI（最も簡単・推奨）

### ステップ1: Vercelアカウントの準備
1. https://vercel.com にアクセス
2. GitHubアカウントでサインアップ/ログイン

### ステップ2: プロジェクトのデプロイ
1. Vercelダッシュボードで「Add New...」→「Project」をクリック
2. 「Import Git Repository」の代わりに、下部の「Deploy from a template」セクションを探す
3. または、直接ファイルをドラッグ&ドロップでアップロード

**または、CLIを使わずにGitHubと連携:**

1. GitHubに新しいリポジトリを作成
2. ローカルでGit初期化とプッシュ:
   ```bash
   cd /Users/skayo/Desktop/akirame-radio
   git init
   git add .
   git commit -m "Initial commit: あきらめラジオ公式サイト"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/akirame-radio.git
   git push -u origin main
   ```
3. Vercelで「Import Project」→GitHubリポジトリを選択
4. 「Deploy」をクリック

### ステップ3: デプロイ完了
- 数分後、`https://akirame-radio.vercel.app` のようなURLが発行されます
- カスタムドメインも設定可能

---

## 方法2: Vercel CLI（npm権限修正後）

### 前提条件: npm権限の修正
ターミナルで以下を実行（パスワード入力が必要）:
```bash
sudo chown -R 501:20 "/Users/skayo/.npm"
```

### デプロイコマンド
```bash
cd /Users/skayo/Desktop/akirame-radio

# 初回デプロイ（プレビュー環境）
npx vercel

# 本番環境にデプロイ
npx vercel --prod
```

---

## プロジェクト構成

このプロジェクトは静的HTMLサイトです。以下のファイルが含まれています：

- `index.html` - メインページ
- `css/` - スタイルシート
- `js/` - JavaScript
- `images/` - 画像ファイル
- `fonts/` - フォントファイル
- `vercel.json` - Vercel設定（静的サイトとして配信）

## 注意事項

- Google Sheets CSVは外部URLから読み込まれるため、追加設定は不要
- すべてのリンクは絶対パスまたは相対パスで記述されています
- CORS設定も不要（静的ファイルのみ）
