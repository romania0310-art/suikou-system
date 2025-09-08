// あゆみ表記ルール - 横浜市立学校
// PDFファイル「あゆみ表記ルール.pdf」に基づく表記統一ルール
// × → ○ の変換（不適切な表記 → 適切な表記）

// 1. ひらがな表記ルール（×列の表記→○列の表記）
const kanjiToHiraganaRules = [
  { pattern: /いたします/g, replacement: '致します', description: '「いたします」→「致します」' },
  { pattern: /いただく/g, replacement: '頂く', description: '「いただく」→「頂く」' },
  { pattern: /子供/g, replacement: '子ども', description: '「子供」→「子ども」' },
  { pattern: /気をつけ/g, replacement: '気を付け', description: '「気をつけ」→「気を付け」' },
  { pattern: /できる/g, replacement: '出来る', description: '「できる」→「出来る」' },
  { pattern: /わかる/g, replacement: '分かる', description: '「わかる」→「分かる」' },
  { pattern: /とても/g, replacement: '非常に', description: '「とても」→「非常に」' },
  { pattern: /がんばって/g, replacement: '意欲的に取り組み', description: '「がんばって」→「意欲的に取り組み」' },
  { pattern: /みんなの前で/g, replacement: '学級において', description: '「みんなの前で」→「学級において」' },
  { pattern: /お話/g, replacement: '物語', description: '「お話」→「物語」' },
  { pattern: /先生/g, replacement: '教師', description: '「先生」→「教師」' },
  { pattern: /勉強/g, replacement: '学習', description: '「勉強」→「学習」' }
];

// 2. 公用文推敲ルール（文化審議会建議）
const officialDocumentRules = [
  { pattern: /すごく|すごい/g, replacement: '非常に', description: '口語表現を公用文表現に' },
  { pattern: /ちゃんと/g, replacement: '適切に', description: '口語表現を公用文表現に' },
  { pattern: /だんだん/g, replacement: '徐々に', description: '口語表現を公用文表現に' },
  { pattern: /いっぱい/g, replacement: '多く', description: '口語表現を公用文表現に' },
  { pattern: /一生懸命/g, replacement: '熱心に', description: '口語表現を公用文表現に' },
  { pattern: /頑張っている/g, replacement: '意欲的に取り組んでいる', description: '口語表現を公用文表現に' }
];

// 3. 文体統一ルール（です・ます調への変換）
const styleUnificationRules = [
  { pattern: /である$/g, replacement: 'です', description: '文体統一（です・ます調）' },
  { pattern: /である。/g, replacement: 'です。', description: '文体統一（です・ます調）' },
  { pattern: /している$/g, replacement: 'しています', description: '文体統一（です・ます調）' },
  { pattern: /している。/g, replacement: 'しています。', description: '文体統一（です・ます調）' },
  { pattern: /できる$/g, replacement: 'できます', description: '文体統一（です・ます調）' },
  { pattern: /できる。/g, replacement: 'できます。', description: '文体統一（です・ます調）' }
];

// すべてのルールをまとめた配列
const allConversionRules = [
  ...kanjiToHiraganaRules,
  ...officialDocumentRules,
  ...styleUnificationRules
];

// 推敲処理のメイン関数
function applyAyumiRules(text) {
  let result = text.trim();
  
  // 各ルールを順次適用
  for (const rule of allConversionRules) {
    result = result.replace(rule.pattern, rule.replacement);
  }
  
  return result.trim();
}

// 推敲の変更履歴を取得する関数
function getChangeHistory(originalText, revisedText) {
  const changes = [];
  let currentText = originalText;
  
  // 各ルールを適用して変更点を記録
  for (const rule of allConversionRules) {
    const beforeApply = currentText;
    currentText = currentText.replace(rule.pattern, rule.replacement);
    
    if (beforeApply !== currentText) {
      changes.push(rule.description);
    }
  }
  
  return changes;
}