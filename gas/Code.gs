// ============================================================
// リューグーレザーズ 革ジャン査定システム - Google Apps Script
// スプレッドシートID: 1NbI-J49c0Ulqds62ZlxeKNLH9c04T26x79hZCYyODto
//
// 【デプロイ手順】
// 1. スプレッドシートを開く → 拡張機能 → Apps Script
// 2. このコードを貼り付けて保存
// 3. デプロイ → 新しいデプロイ → 種類「ウェブアプリ」
// 4. 次のユーザーとして実行: 「自分」
// 5. アクセスできるユーザー: 「全員」
// 6. デプロイ → 生成されたURLをLPの GAS_ENDPOINT に貼り付ける
// ============================================================

const SPREADSHEET_ID = '1NbI-J49c0Ulqds62ZlxeKNLH9c04T26x79hZCYyODto';
const ADMIN_EMAIL = 'lf.hiro422@gmail.com';
const RESULT_SHEET_NAME = '申込データ';

// ============================================================
// GET: 相場マスター・掛け率データを返す
// ============================================================
function doGet(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    const data = getPriceData();
    output.setContent(JSON.stringify({ success: true, data: data }));
  } catch (err) {
    output.setContent(JSON.stringify({ success: false, error: err.message }));
  }

  return output;
}

// ============================================================
// POST: 申込データ受信 → スプレッドシート記録 → メール送信
// ============================================================
function doPost(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    const payload = JSON.parse(e.postData.contents);

    // バリデーション
    if (!payload.customerName || !payload.phone || !payload.email) {
      throw new Error('必須項目（名前・電話番号・メール）が不足しています');
    }

    recordApplication(payload);
    sendAdminEmail(payload);
    sendCustomerEmail(payload);

    output.setContent(JSON.stringify({ success: true, message: '申込を受け付けました' }));
  } catch (err) {
    output.setContent(JSON.stringify({ success: false, error: err.message }));
  }

  return output;
}

// ============================================================
// 相場マスター・掛け率シートを読み込んでJSONで返す
// ============================================================
function getPriceData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // ---------- 相場マスター ----------
  const masterSheet = ss.getSheetByName('相場マスター');
  if (!masterSheet) throw new Error('「相場マスター」シートが見つかりません');

  const masterValues = masterSheet.getDataRange().getValues();
  const prices = [];

  // 1行目はヘッダーなのでi=1からスタート
  // A列: ID, B列: ブランド, C列: モデル, D列: 相場価格
  for (let i = 1; i < masterValues.length; i++) {
    const row = masterValues[i];
    if (row[1] && row[2] && row[3] !== '') {
      prices.push({
        brand: String(row[1]).trim(),
        model: String(row[2]).trim(),
        price: Number(row[3])
      });
    }
  }

  // ---------- 掛け率 ----------
  const rateSheet = ss.getSheetByName('掛け率');
  if (!rateSheet) throw new Error('「掛け率」シートが見つかりません');

  const rateValues = rateSheet.getDataRange().getValues();
  const conditions = {};   // 状態倍率  例: { "S（新品同様）": 1.0, "A（傷・汚れなし）": 0.8, ... }
  const adjustments = {};  // 調整金額  例: { "サイズ": { "S": -10000, "M": -5000, ... }, ... }

  // C列のカテゴリ名は先頭行にしか入力されていないためキャリーフォワードする
  let currentAdjCat = '';

  for (let i = 1; i < rateValues.length; i++) {
    const row = rateValues[i];

    // A列: 状態ラベル, B列: 倍率
    if (row[0] != null && row[0] !== '') {
      const label = String(row[0]).trim();
      const mult  = Number(row[1]);
      if (label && !isNaN(mult)) {
        conditions[label] = mult;
      }
    }

    // C列: カテゴリ（空欄の場合は直前の値を引き継ぐ）, D列: オプション名, E列: 加減額
    if (row[2] != null && row[2] !== '') {
      currentAdjCat = String(row[2]).trim();
    }
    if (currentAdjCat && row[3] != null && row[3] !== '') {
      const opt = String(row[3]).trim();
      const amt = Number(row[4]);
      if (opt) {
        if (!adjustments[currentAdjCat]) adjustments[currentAdjCat] = {};
        adjustments[currentAdjCat][opt] = isNaN(amt) ? 0 : amt;
      }
    }
  }

  return { prices: prices, conditions: conditions, adjustments: adjustments };
}

// ============================================================
// 申込データをスプレッドシートに記録
// ============================================================
function recordApplication(payload) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(RESULT_SHEET_NAME);

  // シートがなければ新規作成してヘッダーを設定
  if (!sheet) {
    sheet = ss.insertSheet(RESULT_SHEET_NAME);

    const headers = [
      '申込日時', '名前', '郵便番号', '住所', '電話番号', 'メールアドレス',
      'ブランド', 'モデル', '状態', 'サイズ', '素材', 'カラー',
      'カビあり', '臭いあり', '査定金額（円）'
    ];
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);

    // ヘッダー装飾（黒背景・金色フォント）
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#1a1a2e');
    headerRange.setFontColor('#f59e0b');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');

    // 列幅調整
    sheet.setColumnWidth(1, 160);  // 申込日時
    sheet.setColumnWidth(4, 220);  // 住所
    sheet.setColumnWidth(6, 200);  // メール
  }

  // データ行を追加
  sheet.appendRow([
    new Date(),
    payload.customerName || '',
    payload.postalCode   || '',
    payload.address      || '',
    payload.phone        || '',
    payload.email        || '',
    payload.brand        || '',
    payload.model        || '',
    payload.condition    || '',
    payload.size         || '',
    payload.material     || '',
    payload.color        || '',
    payload.hasMold  ? 'あり' : 'なし',
    payload.hasSmell ? 'あり' : 'なし',
    Number(payload.assessmentAmount) || 0
  ]);
}

// ============================================================
// 管理者へメール通知
// ============================================================
function sendAdminEmail(payload) {
  const amount = Number(payload.assessmentAmount).toLocaleString('ja-JP');
  const subject = '【新規本査定申込】' + payload.customerName + ' 様 / ¥' + amount;

  const body = [
    'リューグーレザーズ 本査定申込 通知',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '申込日時: ' + new Date().toLocaleString('ja-JP'),
    '',
    '【お客様情報】',
    '名前　　　: ' + payload.customerName,
    '郵便番号　: ' + payload.postalCode,
    '住所　　　: ' + payload.address,
    '電話番号　: ' + payload.phone,
    'メール　　: ' + payload.email,
    '',
    '【査定内容】',
    'ブランド　: ' + payload.brand,
    'モデル　　: ' + payload.model,
    '状態　　　: ' + payload.condition,
    'サイズ　　: ' + payload.size,
    '素材　　　: ' + payload.material,
    'カラー　　: ' + payload.color,
    'カビ　　　: ' + (payload.hasMold  ? 'あり' : 'なし'),
    '臭い　　　: ' + (payload.hasSmell ? 'あり' : 'なし'),
    '',
    '【簡易査定金額】',
    '¥' + amount,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'スプレッドシートで確認:',
    'https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID
  ].join('\n');

  GmailApp.sendEmail(ADMIN_EMAIL, subject, body);
}

// ============================================================
// お客様へ申込完了メール
// ============================================================
function sendCustomerEmail(payload) {
  if (!payload.email) return;

  const amount = Number(payload.assessmentAmount).toLocaleString('ja-JP');
  const subject = '【リューグーレザーズ】本査定お申し込みを受け付けました';

  const body = [
    payload.customerName + ' 様',
    '',
    'この度はリューグーレザーズリユースへの',
    '本査定お申し込みをいただきありがとうございます。',
    '',
    '以下の内容でお申し込みを受け付けました。',
    '',
    '━━━ 査定内容 ━━━━━━━━━━━━━━━━━━━',
    'ブランド　　: ' + payload.brand,
    'モデル　　　: ' + payload.model,
    '状態　　　　: ' + payload.condition,
    'サイズ　　　: ' + payload.size,
    '素材　　　　: ' + payload.material,
    'カラー　　　: ' + payload.color,
    '簡易査定金額: ¥' + amount,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    '担当のレザーソムリエより、',
    '2営業日以内にご連絡いたします。',
    '今しばらくお待ちくださいませ。',
    '',
    '◆ 梱包キット（段ボール・着払い伝票）は',
    '  無料でご自宅までお届けします。',
    '',
    '◆ 査定金額にご満足いただけない場合は、',
    '  キャンセル料・返送料ともに0円です。',
    '  安心してお待ちください。',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'リューグーレザーズ リユース事業部',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '※このメールは自動送信されています。',
    '  返信はお受けできません。',
    '  お問い合わせはLINEまたはお電話にてご連絡ください。'
  ].join('\n');

  GmailApp.sendEmail(payload.email, subject, body);
}
