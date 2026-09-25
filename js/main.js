// メインロジック - CSV自動取得版（Spotify/Apple URL対応 + レコメンド機能）

// グローバル変数
let episodesData = [];
let recommendationsData = [];
let currentGenre = 'all';

// CSV URL
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRxzhnH9TSb0AQbWEaCrvR1GqLMu1gI8riqz2WFzY1HlD6KUvuoGqfjjJSmXVWO7h6ce8evf9Zg9_75/pub?output=csv';
const RECOMMEND_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRxzhnH9TSb0AQbWEaCrvR1GqLMu1gI8riqz2WFzY1HlD6KUvuoGqfjjJSmXVWO7h6ce8evf9Zg9_75/pub?gid=1164394768&single=true&output=csv';

// 初期化
async function init() {
  try {
    // ローディング表示
    showLoading();
    
    // CSVデータ読み込み（エピソード + レコメンド）
    episodesData = await loadCSVData();
    recommendationsData = await loadRecommendCSVData();
    
    // イベントリスナー設定
    setupEventListeners();
    
    // 初期表示（ランダム6選）
    renderRandomEpisodes('all');
    
    // レコメンド表示
    renderRecommendations(recommendationsData);
    
  } catch (error) {
    console.error('初期化エラー:', error);
    showError('データの読み込みに失敗しました。ページを再読み込みしてください。');
  }
}

// ローディング表示
function showLoading() {
  const grid = document.getElementById('episodes-grid');
  if (!grid) return;
  
  grid.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">エピソードを読み込んでいます...</p>
    </div>
  `;
}

// CSVデータ読み込み（エピソード）
async function loadCSVData() {
  const response = await fetch(CSV_URL);
  if (!response.ok) {
    throw new Error(`CSVの読み込みに失敗しました: ${response.status}`);
  }
  
  const csvText = await response.text();
  return parseCSV(csvText);
}

// CSVデータ読み込み（レコメンド）
async function loadRecommendCSVData() {
  const response = await fetch(RECOMMEND_CSV_URL);
  if (!response.ok) {
    throw new Error(`レコメンドCSVの読み込みに失敗しました: ${response.status}`);
  }
  
  const csvText = await response.text();
  return parseRecommendCSV(csvText);
}

// CSVパース
function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const episodes = [];
  
  // ヘッダー行をスキップ（1行目）
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // CSVの列を解析（カンマ区切り、ダブルクォート対応）
    const columns = parseCSVLine(line);
    
    // 列が9つ未満、またはメインジャンル（D列/columns[3]）が空の場合はスキップ
    if (columns.length < 9 || !columns[3] || columns[3].trim() === '') {
      continue;
    }
    
    // サブタグをカンマで分割
    const subTags = columns[4] ? columns[4].split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    // 気分をカンマで分割（最初の1つだけ使用）
    const moods = columns[5] ? columns[5].split(',').map(mood => mood.trim()).filter(mood => mood) : [];
    const mood = moods.length > 0 ? moods[0] : '';
    
    // H列（columns[7]）: Spotify URL
    // I列（columns[8]）: Apple Podcast URL
    const spotifyUrl = columns[7] ? columns[7].trim() : '';
    const appleUrl = columns[8] ? columns[8].trim() : '';
    
    episodes.push({
      id: i,
      episodeNo: columns[0] || `EP${String(i).padStart(3, '0')}`,
      title: columns[1] || '無題',
      guest: columns[2] || 'ゲスト未定',
      mainGenre: columns[3].trim(),
      subTags: subTags,
      mood: mood,
      summary: columns[6] || '',
      spotifyUrl: spotifyUrl,
      appleUrl: appleUrl
    });
  }
  
  return episodes;
}

// CSV行のパース（ダブルクォート対応）
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // エスケープされたダブルクォート
        current += '"';
        i++;
      } else {
        // クォートの開始/終了
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // フィールドの区切り
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // 最後のフィールドを追加
  result.push(current);
  
  return result;
}

// レコメンドCSVパース
function parseRecommendCSV(csvText) {
  const lines = csvText.split('\n');
  const recommendations = [];
  
  // ヘッダー行をスキップ（1行目）
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // CSVの列を解析
    const columns = parseCSVLine(line);
    
    // 列が8つ未満の場合はスキップ
    if (columns.length < 8) {
      continue;
    }
    
    // A列：エピソードタイトル
    // B列：エピソード番号
    const episodeTitle = columns[0] ? columns[0].trim() : '';
    const episodeNumber = columns[1] ? columns[1].trim() : '';
    
    // タイトルまたは番号が空の場合はスキップ
    if (!episodeTitle || !episodeNumber) {
      continue;
    }
    
    // エピソード82を除外（企画回のため）
    if (episodeNumber === '82') {
      continue;
    }
    
    // C列：推薦者肩書き
    // D列：推薦者名
    // E列：選定テーマ
    // F列：推薦コメント
    // G列：Spotify URL
    // H列：Apple Podcast URL
    const recommenderTitle = columns[2] ? columns[2].trim() : '';
    const recommenderName = columns[3] ? columns[3].trim() : '';
    const theme = columns[4] ? columns[4].trim() : '';
    const comment = columns[5] ? columns[5].trim() : '';
    const spotifyUrl = columns[6] ? columns[6].trim() : '';
    const appleUrl = columns[7] ? columns[7].trim() : '';
    
    recommendations.push({
      id: i,
      episodeTitle: episodeTitle,
      episodeNumber: episodeNumber,
      recommenderTitle: recommenderTitle,
      recommenderName: recommenderName,
      theme: theme,
      comment: comment,
      spotifyUrl: spotifyUrl,
      appleUrl: appleUrl
    });
  }
  
  return recommendations;
}

// イベントリスナー設定
function setupEventListeners() {
  // ジャンルフィルターボタン
  const genreButtons = document.querySelectorAll('.tag-btn');
  genreButtons.forEach(btn => {
    btn.addEventListener('click', handleGenreClick);
  });
}

// ジャンルクリックハンドラー
function handleGenreClick(e) {
  const genre = e.target.dataset.genre;
  
  // アクティブ状態更新
  document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  e.target.classList.add('active');
  
  // ジャンル変更
  currentGenre = genre;
  
  // ランダム6選を表示
  renderRandomEpisodes(genre);
}

// ランダム6選を表示
function renderRandomEpisodes(genre) {
  // ジャンルでフィルタリング
  let filtered = episodesData;
  if (genre !== 'all') {
    filtered = episodesData.filter(ep => ep.mainGenre === genre);
  }
  
  // ランダムに最大6つ選択
  const randomEpisodes = getRandomEpisodes(filtered, 6);
  
  // レンダリング（フェードイン付き）
  renderEpisodesWithAnimation(randomEpisodes);
}

// Fisher-Yates シャッフルアルゴリズムでランダム選択
function getRandomEpisodes(episodes, count) {
  // 配列をコピー
  const shuffled = [...episodes];
  
  // Fisher-Yates シャッフル
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // 最大count個を返す
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// エピソード一覧レンダリング（アニメーション付き）
function renderEpisodesWithAnimation(episodes) {
  const grid = document.getElementById('episodes-grid');
  if (!grid) return;
  
  if (episodes.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <p class="empty-state-text">該当するエピソードが見つかりませんでした</p>
      </div>
    `;
    return;
  }
  
  // フェードアウト
  grid.style.opacity = '0';
  
  setTimeout(() => {
    // コンテンツ更新
    grid.innerHTML = episodes.map(episode => createEpisodeCard(episode)).join('');
    
    // フェードイン
    setTimeout(() => {
      grid.style.opacity = '1';
    }, 50);
  }, 300);
}

// レコメンドレンダリング
function renderRecommendations(recommendations) {
  const grid = document.getElementById('recommend-grid');
  if (!grid) return;
  
  if (recommendations.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <p class="empty-state-text">レコメンドデータがありません</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = recommendations.map(rec => createRecommendCard(rec)).join('');
}

// レコメンドカード生成
function createRecommendCard(rec) {
  // URLの有無をチェック
  const hasSpotifyUrl = rec.spotifyUrl && rec.spotifyUrl.trim() !== '';
  const hasAppleUrl = rec.appleUrl && rec.appleUrl.trim() !== '';
  
  // 推薦者の画像パス
  const avatarSrc = 'images/kayo_sakaguchi.jpg';
  
  // エピソード番号とタイトルを組み合わせて表示（#数字 タイトル の形式）
 const fullTitle = rec.episodeTitle;
  
  return `
    <article class="recommend-card">
      <div class="recommend-card-header">
        <div class="recommender-info-wrapper">
          <img src="${avatarSrc}" alt="${escapeHtml(rec.recommenderName)}" class="recommender-avatar">
          <div class="recommender-info">
            <p class="recommender-title">${escapeHtml(rec.recommenderTitle)}</p>
            <p class="recommender-name">${escapeHtml(rec.recommenderName)}</p>
          </div>
        </div>
        ${rec.theme ? `<span class="theme-badge">${escapeHtml(rec.theme)}</span>` : ''}
      </div>
      
      <h3 class="recommend-episode-title">${escapeHtml(fullTitle)}</h3>
      
      <p class="recommend-comment">${escapeHtml(rec.comment)}</p>
      
      <div class="recommend-footer">
        ${hasSpotifyUrl ? `
          <a href="${escapeHtml(rec.spotifyUrl)}" target="_blank" rel="noopener noreferrer" class="btn-listen btn-spotify">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Spotify
          </a>
        ` : `
          <button class="btn-listen btn-spotify btn-disabled" disabled title="配信URLが未設定です">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Spotify
          </button>
        `}
        ${hasAppleUrl ? `
          <a href="${escapeHtml(rec.appleUrl)}" target="_blank" rel="noopener noreferrer" class="btn-listen btn-apple">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.182c5.423 0 9.818 4.395 9.818 9.818 0 5.423-4.395 9.818-9.818 9.818-5.423 0-9.818-4.395-9.818-9.818 0-5.423 4.395-9.818 9.818-9.818zM12 6c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 7.5c-1.381 0-2.5.672-2.5 1.5v3.75c0 .414.336.75.75.75h3.5c.414 0 .75-.336.75-.75V15c0-.828-1.119-1.5-2.5-1.5z"/>
            </svg>
            Apple
          </a>
        ` : `
          <button class="btn-listen btn-apple btn-disabled" disabled title="配信URLが未設定です">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.182c5.423 0 9.818 4.395 9.818 9.818 0 5.423-4.395 9.818-9.818 9.818-5.423 0-9.818-4.395-9.818-9.818 0-5.423 4.395-9.818 9.818-9.818zM12 6c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 7.5c-1.381 0-2.5.672-2.5 1.5v3.75c0 .414.336.75.75.75h3.5c.414 0 .75-.336.75-.75V15c0-.828-1.119-1.5-2.5-1.5z"/>
            </svg>
            Apple
          </button>
        `}
      </div>
    </article>
  `;
}

// エピソードカード生成（6項目表示 + URL対応）
function createEpisodeCard(episode) {
  // サブタグをタグ風に表示
  const subTagsHtml = episode.subTags
    .map(tag => `<span class="sub-tag">${escapeHtml(tag)}</span>`)
    .join('');
  
  // URLの有無をチェック
  const hasSpotifyUrl = episode.spotifyUrl && episode.spotifyUrl.trim() !== '';
  const hasAppleUrl = episode.appleUrl && episode.appleUrl.trim() !== '';
  
  return `
    <article class="episode-card">
      <div class="episode-header">
        <span class="episode-genre-badge">${escapeHtml(episode.mainGenre)}</span>
      </div>
      
      <h3 class="episode-title">${escapeHtml(episode.title)}</h3>
      
      <div class="episode-meta">
        <p class="episode-guest">
          <span class="meta-label">ゲスト:</span>
          <span class="meta-value">${escapeHtml(episode.guest)}</span>
        </p>
      </div>
      
      <div class="episode-tags">
        ${subTagsHtml}
      </div>
      
      ${episode.mood ? `
        <div class="episode-mood">
          <span class="mood-icon">💭</span>
          <span class="mood-text">${escapeHtml(episode.mood)}</span>
        </div>
      ` : ''}
      
      <p class="episode-summary">${escapeHtml(episode.summary)}</p>
      
      <div class="episode-footer">
        ${hasSpotifyUrl ? `
          <a href="${escapeHtml(episode.spotifyUrl)}" target="_blank" rel="noopener noreferrer" class="btn-listen btn-spotify">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Spotify
          </a>
        ` : `
          <button class="btn-listen btn-spotify btn-disabled" disabled title="配信URLが未設定です">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Spotify
          </button>
        `}
        ${hasAppleUrl ? `
          <a href="${escapeHtml(episode.appleUrl)}" target="_blank" rel="noopener noreferrer" class="btn-listen btn-apple">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.182c5.423 0 9.818 4.395 9.818 9.818 0 5.423-4.395 9.818-9.818 9.818-5.423 0-9.818-4.395-9.818-9.818 0-5.423 4.395-9.818 9.818-9.818zM12 6c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 7.5c-1.381 0-2.5.672-2.5 1.5v3.75c0 .414.336.75.75.75h3.5c.414 0 .75-.336.75-.75V15c0-.828-1.119-1.5-2.5-1.5z"/>
            </svg>
            Apple
          </a>
        ` : `
          <button class="btn-listen btn-apple btn-disabled" disabled title="配信URLが未設定です">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.182c5.423 0 9.818 4.395 9.818 9.818 0 5.423-4.395 9.818-9.818 9.818-5.423 0-9.818-4.395-9.818-9.818 0-5.423 4.395-9.818 9.818-9.818zM12 6c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 7.5c-1.381 0-2.5.672-2.5 1.5v3.75c0 .414.336.75.75.75h3.5c.414 0 .75-.336.75-.75V15c0-.828-1.119-1.5-2.5-1.5z"/>
            </svg>
            Apple
          </button>
        `}
      </div>
    </article>
  `;
}

// HTMLエスケープ
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// エラー表示
function showError(message) {
  const grid = document.getElementById('episodes-grid');
  if (!grid) return;
  
  grid.innerHTML = `
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <p class="error-text">${message}</p>
    </div>
  `;
}

// ページ読み込み時に実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
