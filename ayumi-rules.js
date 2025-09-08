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
  { pattern: /勉強/g, replacement: '学習', description: '「勉強」→「学習」' },
  
  // 重要な追加ルール
  { pattern: /すばらしい/g, replacement: '素晴らしい', description: '「すばらしい」→「素晴らしい」' },
  { pattern: /たくさん/g, replacement: '沢山', description: '「たくさん」→「沢山」' },
  { pattern: /ていねい/g, replacement: '丁寧', description: '「ていねい」→「丁寧」' },
  { pattern: /なかよく/g, replacement: '仲よく', description: '「なかよく」→「仲よく」' },
  { pattern: /ひとりひとり/g, replacement: '一人一人', description: '「ひとりひとり」→「一人一人」' },
  { pattern: /ひとつひとつ/g, replacement: '一つ一つ', description: '「ひとつひとつ」→「一つ一つ」' },
  { pattern: /みつける/g, replacement: '見つける', description: '「みつける」→「見つける」' },
  { pattern: /はなしあい/g, replacement: '話し合い', description: '「はなしあい」→「話し合い」' },
  { pattern: /とりくみ/g, replacement: '取組', description: '「とりくみ」→「取組」' },
  { pattern: /とりくむ/g, replacement: '取組む', description: '「とりくむ」→「取組む」' },
  
  // 「〜あう」→「〜合う」の変換ルール
  { pattern: /教えあう/g, replacement: '教え合う', description: '「教えあう」→「教え合う」' },
  { pattern: /教えあい/g, replacement: '教え合い', description: '「教えあい」→「教え合い」' },
  { pattern: /学びあう/g, replacement: '学び合う', description: '「学びあう」→「学び合う」' },
  { pattern: /学びあい/g, replacement: '学び合い', description: '「学びあい」→「学び合い」' },
  { pattern: /高めあう/g, replacement: '高め合う', description: '「高めあう」→「高め合う」' },
  { pattern: /高めあい/g, replacement: '高め合い', description: '「高めあい」→「高め合い」' },
  { pattern: /支えあう/g, replacement: '支え合う', description: '「支えあう」→「支え合う」' },
  { pattern: /支えあい/g, replacement: '支え合い', description: '「支えあい」→「支え合い」' },
  { pattern: /助けあう/g, replacement: '助け合う', description: '「助けあう」→「助け合う」' },
  { pattern: /助けあい/g, replacement: '助け合い', description: '「助けあい」→「助け合い」' },
  { pattern: /話しあう/g, replacement: '話し合う', description: '「話しあう」→「話し合う」' },
  { pattern: /話しあい/g, replacement: '話し合い', description: '「話しあい」→「話し合い」' }
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

// 4. 誤字脱字修正ルール
const typoCorrectionRules = [
  { pattern: /子どもらいしく/g, replacement: '子どもらしく', description: '誤字修正：「子どもらいしく」→「子どもらしく」' },
  { pattern: /らいしく/g, replacement: 'らしく', description: '誤字修正：「らいしく」→「らしく」' },
  { pattern: /一所懸命/g, replacement: '一生懸命', description: '誤字修正：「一所懸命」→「一生懸命」' },
  { pattern: /受取る/g, replacement: '受け取る', description: '誤字修正：「受取る」→「受け取る」' },
  { pattern: /申込み/g, replacement: '申し込み', description: '誤字修正：「申込み」→「申し込み」' },
  { pattern: /取組み/g, replacement: '取り組み', description: '誤字修正：「取組み」→「取り組み」' },
  { pattern: /受入れ/g, replacement: '受け入れ', description: '誤字修正：「受入れ」→「受け入れ」' }
];

// 5. 最終調整ルール
const finalAdjustmentRules = [
  { pattern: /。。/g, replacement: '。', description: '句読点の重複除去' },
  { pattern: /  /g, replacement: ' ', description: '余分な空白の除去' },
  { pattern: /多くがんばっ、/g, replacement: '多く意欲的に取り組み、', description: '表現の自然化' },
  { pattern: /取り組んでい、/g, replacement: '取り組んでおり、', description: '表現の自然化' },
  
  // 文末統一ルール（「です・ます調」統一）
  { pattern: /につなげた([。、])/g, replacement: 'につなげました$1', description: '文末統一：「～につなげた」→「～につなげました」' },
  { pattern: /頑張って([。、])/g, replacement: '頑張ってください$1', description: '文末統一：「～頑張って」→「～頑張ってください」' },
  { pattern: /できた([。、])/g, replacement: 'できました$1', description: '文末統一：「～できた」→「～できました」' },
  { pattern: /した([。、])/g, replacement: 'しました$1', description: '文末統一：「～した」→「～しました」' },
  { pattern: /取り組んだ([。、])/g, replacement: '取り組みました$1', description: '文末統一：「～取り組んだ」→「～取り組みました」' },
  { pattern: /発表した([。、])/g, replacement: '発表しました$1', description: '文末統一：「～発表した」→「～発表しました」' },
  { pattern: /頑張った([。、])/g, replacement: '頑張りました$1', description: '文末統一：「～頑張った」→「～頑張りました」' },
  { pattern: /学習した([。、])/g, replacement: '学習しました$1', description: '文末統一：「～学習した」→「～学習しました」' }
];

// すべてのルールをまとめた配列
const allConversionRules = [
  ...kanjiToHiraganaRules,
  ...officialDocumentRules,
  ...styleUnificationRules,
  ...typoCorrectionRules,
  ...finalAdjustmentRules
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