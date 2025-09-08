// あゆみ表記ルール - 横浜市立学校
// PDFファイル「あゆみ表記ルール.pdf」に基づく表記統一ルール
// × → ○ の変換（不適切な表記 → 適切な表記）

export interface ConversionRule {
  pattern: string | RegExp;
  replacement: string;
  description: string;
}

// 1. ひらがな表記ルール（×列の表記→○列の表記）
export const kanjiToHiraganaRules: ConversionRule[] = [
  { pattern: /いたします/g, replacement: '致します', description: '「いたします」→「致します」' },
  { pattern: /いただく/g, replacement: '頂く', description: '「いただく」→「頂く」' },
  { pattern: /かかり/g, replacement: '係', description: '「かかり」→「係」' },
  { pattern: /（えを）かく/g, replacement: '（絵を）描く', description: '「（えを）かく」→「（絵を）描く」' },
  { pattern: /かたづける/g, replacement: '片付ける', description: '「かたづける」→「片付ける」' },
  { pattern: /かたより/g, replacement: '偏り', description: '「かたより」→「偏り」' },
  { pattern: /かちづける/g, replacement: '価値付ける', description: '「かちづける」→「価値付ける」' },
  { pattern: /かなう/g, replacement: '叶う', description: '「かなう」→「叶う」' },
  { pattern: /きくばり/g, replacement: '気配り', description: '「きくばり」→「気配り」' },
  { pattern: /きもち/g, replacement: '気持ち', description: '「きもち」→「気持ち」' },
  { pattern: /きをつける/g, replacement: '気を付ける', description: '「きをつける」→「気を付ける」' },
  { pattern: /気をつけ/g, replacement: '気を付け', description: '「気をつけ」→「気を付け」' },
  { pattern: /くりかえす/g, replacement: '繰り返す', description: '「くりかえす」→「繰り返す」' },
  { pattern: /ごい/g, replacement: '語彙', description: '「ごい」→「語彙」' },
  { pattern: /こえかけ/g, replacement: '声掛け', description: '「こえかけ」→「声掛け」' },
  { pattern: /こころがける/g, replacement: '心掛ける', description: '「こころがける」→「心掛ける」' },
  { pattern: /こたえ/g, replacement: '答え', description: '「こたえ」→「答え」' },
  { pattern: /ことばづかい/g, replacement: '言葉遣い', description: '「ことばづかい」→「言葉遣い」' },
  { pattern: /子供/g, replacement: '子ども', description: '「子供」→「子ども」' },
  { pattern: /しかた/g, replacement: '仕方', description: '「しかた」→「仕方」' },
  { pattern: /しくみ/g, replacement: '仕組み', description: '「しくみ」→「仕組み」' },
  { pattern: /したがって/g, replacement: '従って', description: '「したがって」→「従って」' },
  { pattern: /じゅうぶん/g, replacement: '充分', description: '「じゅうぶん」→「充分」' },
  { pattern: /じょうきょう/g, replacement: '情況', description: '「じょうきょう」→「情況」' },
  { pattern: /じぶんたち/g, replacement: '自分達', description: '「じぶんたち」→「自分達」' },
  { pattern: /ずいぶん/g, replacement: '随分', description: '「ずいぶん」→「随分」' },
  { pattern: /すこやか/g, replacement: '健やか', description: '「すこやか」→「健やか」' },
  { pattern: /すなわち/g, replacement: '即ち', description: '「すなわち」→「即ち」' },
  { pattern: /すべて/g, replacement: '全て', description: '「すべて」→「全て」' },
  { pattern: /すすんで/g, replacement: '進んで', description: '「すすんで」→「進んで」' },
  { pattern: /すてき/g, replacement: '素敵', description: '「すてき」→「素敵」' },
  { pattern: /すばらしい/g, replacement: '素晴らしい', description: '「すばらしい」→「素晴らしい」' },
  { pattern: /せっかく/g, replacement: '折角', description: '「せっかく」→「折角」' },
  { pattern: /ぜひ/g, replacement: '是非', description: '「ぜひ」→「是非」' },
  { pattern: /そばで/g, replacement: '側で', description: '「そばで」→「側で」' },
  { pattern: /そろう/g, replacement: '揃う', description: '「そろう」→「揃う」' },
  { pattern: /たくさん/g, replacement: '沢山', description: '「たくさん」→「沢山」' },
  { pattern: /たしかな/g, replacement: '確かな', description: '「たしかな」→「確かな」' },
  { pattern: /たとえば/g, replacement: '例えば', description: '「たとえば」→「例えば」' },
  { pattern: /ちかづく/g, replacement: '近づく', description: '「ちかづく」→「近づく」' },
  { pattern: /ついきゅう/g, replacement: '追究', description: '「ついきゅう」→「追究」' },
  { pattern: /ついに/g, replacement: '遂に', description: '「ついに」→「遂に」' },
  { pattern: /つとめる/g, replacement: '努める', description: '「つとめる」→「努める」' },
  { pattern: /つまづき/g, replacement: 'つまずき', description: '「つまづき」→「つまずき」' },
  { pattern: /ていねい/g, replacement: '丁寧', description: '「ていねい」→「丁寧」' },
  { pattern: /てがかり/g, replacement: '手掛かり', description: '「てがかり」→「手掛かり」' },
  { pattern: /てきかく/g, replacement: '的確', description: '「てきかく」→「的確」' },
  { pattern: /できる/g, replacement: '出来る', description: '「できる」→「出来る」' },
  { pattern: /てだて/g, replacement: '手立て', description: '「てだて」→「手立て」' },
  { pattern: /どうきづけ/g, replacement: '動機付け', description: '「どうきづけ」→「動機付け」' },
  { pattern: /どうし/g, replacement: '同士', description: '「どうし」→「同士」' },
  { pattern: /とおして/g, replacement: '通して', description: '「とおして」→「通して」' },
  { pattern: /とおり/g, replacement: '通り', description: '「とおり」→「通り」' },
  { pattern: /とくに/g, replacement: '特に', description: '「とくに」→「特に」' },
  { pattern: /ともなう/g, replacement: '伴う', description: '「ともなう」→「伴う」' },
  { pattern: /ともに/g, replacement: '共に', description: '「ともに」→「共に」' },
  { pattern: /とらえる/g, replacement: '捉える', description: '「とらえる」→「捉える」' },
  { pattern: /とりあげる/g, replacement: '取り上げる', description: '「とりあげる」→「取り上げる」' },
  { pattern: /とりあつかう/g, replacement: '取扱う', description: '「とりあつかう」→「取扱う」' },
  { pattern: /とりくみ/g, replacement: '取組', description: '「とりくみ」→「取組」' },
  { pattern: /とりくむ/g, replacement: '取組む', description: '「とりくむ」→「取組む」' },
  { pattern: /なお/g, replacement: '尚', description: '「なお」→「尚」' },
  { pattern: /なかよく/g, replacement: '仲よく', description: '「なかよく」→「仲よく」' },
  { pattern: /なぜ/g, replacement: '何故', description: '「なぜ」→「何故」' },
  { pattern: /など/g, replacement: '等', description: '「など」→「等」' },
  { pattern: /なれる/g, replacement: '慣れる', description: '「なれる」→「慣れる」' },
  { pattern: /はかる/g, replacement: '図る', description: '「はかる」→「図る」' },
  { pattern: /はぐくむ/g, replacement: '育む', description: '「はぐくむ」→「育む」' },
  { pattern: /はげまし/g, replacement: '励まし', description: '「はげまし」→「励まし」' },
  { pattern: /はじめ/g, replacement: '始め', description: '「はじめ」→「始め」' },
  { pattern: /はなしあい/g, replacement: '話合い', description: '「はなしあい」→「話合い」' },
  { pattern: /はなしあう/g, replacement: '話し合う', description: '「はなしあう」→「話し合う」' },
  { pattern: /ひごろ/g, replacement: '日頃', description: '「ひごろ」→「日頃」' },
  { pattern: /ひとつひとつ/g, replacement: '一つ一つ', description: '「ひとつひとつ」→「一つ一つ」' },
  { pattern: /ひとりひとり/g, replacement: '一人一人', description: '「ひとりひとり」→「一人一人」' },
  { pattern: /ふだん/g, replacement: '普段', description: '「ふだん」→「普段」' },
  { pattern: /ふでづかい/g, replacement: '筆遣い', description: '「ふでづかい」→「筆遣い」' },
  { pattern: /ふまえて/g, replacement: '踏まえて', description: '「ふまえて」→「踏まえて」' },
  { pattern: /ふりかえり/g, replacement: '振り返り', description: '「ふりかえり」→「振り返り」' },
  { pattern: /ふれあい/g, replacement: '触れ合い', description: '「ふれあい」→「触れ合い」' },
  { pattern: /ふんいき/g, replacement: '雰囲気', description: '「ふんいき」→「雰囲気」' },
  { pattern: /ほか/g, replacement: '他', description: '「ほか」→「他」' },
  { pattern: /まさに/g, replacement: '正に', description: '「まさに」→「正に」' },
  { pattern: /まじめ/g, replacement: '真面目', description: '「まじめ」→「真面目」' },
  { pattern: /ますます/g, replacement: '益々', description: '「ますます」→「益々」' },
  { pattern: /まちがい/g, replacement: '間違い', description: '「まちがい」→「間違い」' },
  { pattern: /まね/g, replacement: '真似', description: '「まね」→「真似」' },
  { pattern: /みいだす/g, replacement: '見出す', description: '「みいだす」→「見出す」' },
  { pattern: /みすえる/g, replacement: '見据える', description: '「みすえる」→「見据える」' },
  { pattern: /みつける/g, replacement: '見つける', description: '「みつける」→「見つける」' },
  { pattern: /みとる/g, replacement: '見取る', description: '「みとる」→「見取る」' },
  { pattern: /みにつける/g, replacement: '身につける', description: '「みにつける」→「身につける」' },
  { pattern: /みのまわり/g, replacement: '身の回り', description: '「みのまわり」→「身の回り」' },
  { pattern: /みずやり/g, replacement: '水やり', description: '「みずやり」→「水やり」' },
  { pattern: /むすびつく/g, replacement: '結びつく', description: '「むすびつく」→「結びつく」' },
  { pattern: /めあて/g, replacement: '目当て', description: '「めあて」→「目当て」' },
  { pattern: /めざす/g, replacement: '目指す', description: '「めざす」→「目指す」' },
  { pattern: /めばえ/g, replacement: '芽生え', description: '「めばえ」→「芽生え」' },
  { pattern: /もちあじ/g, replacement: '持ち味', description: '「もちあじ」→「持ち味」' },
  { pattern: /もとづく/g, replacement: '基づく', description: '「もとづく」→「基づく」' },
  { pattern: /ゆだねる/g, replacement: '委ねる', description: '「ゆだねる」→「委ねる」' },
  { pattern: /よい/g, replacement: '良い', description: '「よい」→「良い」' },
  { pattern: /よりどころ/g, replacement: '拠り所', description: '「よりどころ」→「拠り所」' },
  { pattern: /わかる/g, replacement: '分かる', description: '「わかる」→「分かる」' },
  { pattern: /わけ/g, replacement: '訳', description: '「わけ」→「訳」' },
  { pattern: /わたし/g, replacement: '私', description: '「わたし」→「私」' },
  { pattern: /わたしたち/g, replacement: '私たち', description: '「わたしたち」→「私たち」' },
  
  // 「あう」→「合う」の変換ルール（動詞・名詞形）
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
  { pattern: /協力しあう/g, replacement: '協力し合う', description: '「協力しあう」→「協力し合う」' },
  { pattern: /協力しあい/g, replacement: '協力し合い', description: '「協力しあい」→「協力し合い」' },
  { pattern: /話しあう/g, replacement: '話し合う', description: '「話しあう」→「話し合う」' },
  { pattern: /話しあい/g, replacement: '話し合い', description: '「話しあい」→「話し合い」' }
];

// 2. 漢字表記ルール（ひらがな→漢字変換）- 重要度の高いもの
export const hiraganaToKanjiRules: ConversionRule[] = [
  { pattern: /挨拶/g, replacement: 'あいさつ', description: '「挨拶」→「あいさつ」' },
  { pattern: /（成果）を上げる/g, replacement: '（成果）をあげる', description: '「（成果）を上げる」→「（成果）をあげる」' },
  { pattern: /（～に）当たって/g, replacement: '（～に）あたって', description: '「（～に）当たって」→「（～に）あたって」' },
  { pattern: /表す/g, replacement: 'あらわす', description: '「表す」→「あらわす」' },
  { pattern: /有り難い/g, replacement: 'ありがたい', description: '「有り難い」→「ありがたい」' },
  { pattern: /生かす/g, replacement: 'いかす', description: '「生かす」→「いかす」' },
  { pattern: /生き生きと/g, replacement: 'いきいきと', description: '「生き生きと」→「いきいきと」' },
  { pattern: /一緒に/g, replacement: 'いっしょに', description: '「一緒に」→「いっしょに」' },
  { pattern: /一番/g, replacement: 'いちばん', description: '「一番」→「いちばん」' },
  { pattern: /促す/g, replacement: 'うながす', description: '「促す」→「うながす」' },
  { pattern: /生み出す/g, replacement: '生みだす', description: '「生み出す」→「生みだす」' },
  { pattern: /（協力を）得る/g, replacement: '（協力を）える', description: '「（協力を）得る」→「（協力を）える」' },
  { pattern: /大いに/g, replacement: 'おおいに', description: '「大いに」→「おおいに」' },
  { pattern: /補う/g, replacement: 'おぎなう', description: '「補う」→「おぎなう」' },
  { pattern: /面白い/g, replacement: 'おもしろい', description: '「面白い」→「おもしろい」' }
];

// 3. 表現の統一ルール
export const unificationRules: ConversionRule[] = [
  { pattern: /高齢者/g, replacement: 'お年寄り', description: '「高齢者」→「お年寄り」' },
  { pattern: /はなしあい/g, replacement: '話し合い', description: '「はなしあい」→「話し合い」（名詞）' }
];

// 4. 公用文推敲ルール（文化審議会建議）
export const officialDocumentRules: ConversionRule[] = [
  // 口語的表現の公用文化
  { pattern: /とても|すごく|すごい/g, replacement: '非常に', description: '口語表現を公用文表現に' },
  { pattern: /ちゃんと/g, replacement: '適切に', description: '口語表現を公用文表現に' },
  { pattern: /だんだん/g, replacement: '徐々に', description: '口語表現を公用文表現に' },
  { pattern: /いっぱい/g, replacement: '多く', description: '口語表現を公用文表現に' },
  { pattern: /一生懸命/g, replacement: '熱心に', description: '口語表現を公用文表現に' },
  { pattern: /頑張って([^い])/g, replacement: '意欲的に取り組み$1', description: '口語表現を公用文表現に' },
  { pattern: /頑張っている/g, replacement: '意欲的に取り組んでいる', description: '口語表現を公用文表現に' },
  
  // 学校場面の用語を正式化
  { pattern: /みんなの前で/g, replacement: '学級において', description: '学校用語の正式化' },
  { pattern: /お友達/g, replacement: 'ほかの児童', description: '学校用語の正式化' },
  { pattern: /先生/g, replacement: '教師', description: '学校用語の正式化' },
  { pattern: /勉強/g, replacement: '学習', description: '学校用語の正式化' },
  { pattern: /お話/g, replacement: '物語', description: '学校用語の正式化' },
  { pattern: /テスト/g, replacement: '評価', description: '学校用語の正式化' },
  
  // 能力・技能に関する表現の客観化
  { pattern: /([^。]*?)が上手/g, replacement: '$1に優れている', description: '能力表現の客観化' },
  { pattern: /([^。]*?)が得意/g, replacement: '$1について高い能力を示している', description: '能力表現の客観化' },
  { pattern: /よく考えて/g, replacement: '論理的に思考し', description: '能力表現の客観化' },
  { pattern: /よくできる/g, replacement: '適切に実行できる', description: '能力表現の客観化' },
  { pattern: /上手にできる/g, replacement: '効果的に行うことができる', description: '能力表現の客観化' },
  
  // 評価表現の客観化・標準化
  { pattern: /とても良い/g, replacement: '優れている', description: '評価表現の客観化' },
  { pattern: /良くなりました/g, replacement: '向上している', description: '評価表現の客観化' },
  { pattern: /できるけど/g, replacement: 'できるが', description: '評価表現の客観化' },
  { pattern: /きちんと/g, replacement: '正確に', description: '評価表現の客観化' },
  { pattern: /しっかりと/g, replacement: '確実に', description: '評価表現の客観化' }
];

// 5. 文体統一ルール（です・ます調への変換）
export const styleUnificationRules: ConversionRule[] = [
  // である調から丁寧語への変換
  { pattern: /である$/g, replacement: 'です', description: '文体統一（です・ます調）' },
  { pattern: /である。/g, replacement: 'です。', description: '文体統一（です・ます調）' },
  
  // 動詞の語尾変換（〜る → 〜ます）
  { pattern: /取り組んでいる$/g, replacement: '取り組んでいます', description: '文体統一（です・ます調）' },
  { pattern: /取り組んでいる。/g, replacement: '取り組んでいます。', description: '文体統一（です・ます調）' },
  { pattern: /できる$/g, replacement: 'できます', description: '文体統一（です・ます調）' },
  { pattern: /できる。/g, replacement: 'できます。', description: '文体統一（です・ます調）' },
  { pattern: /している$/g, replacement: 'しています', description: '文体統一（です・ます調）' },
  { pattern: /している。/g, replacement: 'しています。', description: '文体統一（です・ます調）' },
  { pattern: /見せている$/g, replacement: '見せています', description: '文体統一（です・ます調）' },
  { pattern: /見せている。/g, replacement: '見せています。', description: '文体統一（です・ます調）' },
  
  // 一般的な「〜ている。」パターンの変換（漢字・ひらがな・カタカナ対応）
  { pattern: /([一-龯あ-んア-ヴー]+)ている。/g, replacement: '$1ています。', description: '文体統一（です・ます調）' },
  { pattern: /([一-龯あ-んア-ヴー]+)ている$/g, replacement: '$1ています', description: '文体統一（です・ます調）' },
  
  // 具体的な動詞パターンも追加（確実な変換のため）
  { pattern: /深めている。/g, replacement: '深めています。', description: '文体統一（です・ます調）' },
  { pattern: /深めている$/g, replacement: '深めています', description: '文体統一（です・ます調）' },
  { pattern: /学んでいる。/g, replacement: '学んでいます。', description: '文体統一（です・ます調）' },
  { pattern: /学んでいる$/g, replacement: '学んでいます', description: '文体統一（です・ます調）' },
  { pattern: /考えている。/g, replacement: '考えています。', description: '文体統一（です・ます調）' },
  { pattern: /考えている$/g, replacement: '考えています', description: '文体統一（です・ます調）' },
  { pattern: /頑張っている。/g, replacement: '頑張っています。', description: '文体統一（です・ます調）' },
  { pattern: /頑張っている$/g, replacement: '頑張っています', description: '文体統一（です・ます調）' },
  { pattern: /努力している。/g, replacement: '努力しています。', description: '文体統一（です・ます調）' },
  { pattern: /努力している$/g, replacement: '努力しています', description: '文体統一（です・ます調）' },
  
  // 過去形の変換（〜た → 〜ました）
  { pattern: /した$/g, replacement: 'しました', description: '文体統一（です・ます調）' },
  { pattern: /した。/g, replacement: 'しました。', description: '文体統一（です・ます調）' },
  { pattern: /できた$/g, replacement: 'できました', description: '文体統一（です・ます調）' },
  { pattern: /できた。/g, replacement: 'できました。', description: '文体統一（です・ます調）' },
  
  // 具体的な過去形パターン（重複回避のため個別指定）
  { pattern: /つなげた。/g, replacement: 'つなげました。', description: '文体統一（です・ます調）' },
  { pattern: /つなげた$/g, replacement: 'つなげました', description: '文体統一（です・ます調）' },
  { pattern: /解決した。/g, replacement: '解決しました。', description: '文体統一（です・ます調）' },
  { pattern: /解決した$/g, replacement: '解決しました', description: '文体統一（です・ます調）' },
  { pattern: /挑戦した。/g, replacement: '挑戦しました。', description: '文体統一（です・ます調）' },
  { pattern: /挑戦した$/g, replacement: '挑戦しました', description: '文体統一（です・ます調）' },
  { pattern: /完成した。/g, replacement: '完成しました。', description: '文体統一（です・ます調）' },
  { pattern: /完成した$/g, replacement: '完成しました', description: '文体統一（です・ます調）' },
  { pattern: /成長した。/g, replacement: '成長しました。', description: '文体統一（です・ます調）' },
  { pattern: /成長した$/g, replacement: '成長しました', description: '文体統一（です・ます調）' },
  
  // 具体的な過去形パターンも追加（確実な変換のため）
  { pattern: /つなげた。/g, replacement: 'つなげました。', description: '文体統一（です・ます調）' },
  { pattern: /つなげた$/g, replacement: 'つなげました', description: '文体統一（です・ます調）' },
  { pattern: /学んだ。/g, replacement: '学びました。', description: '文体統一（です・ます調）' },
  { pattern: /学んだ$/g, replacement: '学びました', description: '文体統一（です・ます調）' },
  { pattern: /頑張った。/g, replacement: '頑張りました。', description: '文体統一（です・ます調）' },
  { pattern: /頑張った$/g, replacement: '頑張りました', description: '文体統一（です・ます調）' }
];

// 6. 最終調整ルール
export const finalAdjustmentRules: ConversionRule[] = [
  // 不自然な語尾や重複を修正
  { pattern: /りる。/g, replacement: 'る。', description: '語尾の修正' },
  { pattern: /きりる。/g, replacement: 'く。', description: '語尾の修正' },
  { pattern: /もに取り組んでいる/g, replacement: 'も意欲的に取り組んでいる', description: '表現の自然化' },
  { pattern: /がんばっ、/g, replacement: 'に意欲的に取り組み、', description: '表現の自然化' },
  { pattern: /取り組んでい、/g, replacement: '取り組んでおり、', description: '表現の自然化' },
  { pattern: /しっかりやる/g, replacement: '確実に行う', description: '表現の自然化' },
  
  // 文章の流れと接続の改善
  { pattern: /([^。]*?)て、([^。]*?)。/g, replacement: '$1、$2。', description: '接続の改善' },
  { pattern: /できて/g, replacement: 'でき', description: '接続の改善' },
  { pattern: /速くて/g, replacement: '速く', description: '接続の改善' },
  { pattern: /良くて/g, replacement: '良く', description: '接続の改善' },
  { pattern: /大きくて/g, replacement: '大きく', description: '接続の改善' },
  
  // 最終的な語尾調整
  { pattern: /りる。/g, replacement: 'る。', description: '語尾の最終調整' },
  { pattern: /きりる。/g, replacement: 'く。', description: '語尾の最終調整' },
  { pattern: /。。/g, replacement: '。', description: '句読点の重複除去' },
  { pattern: /  /g, replacement: ' ', description: '余分な空白の除去' }
];

// 7. 誤字脱字修正ルール（タイピングミス修正）
export const typoCorrectionRules: ConversionRule[] = [
  // よくある誤字パターン
  { pattern: /子どもらいしく/g, replacement: '子どもらしく', description: '誤字修正：「子どもらいしく」→「子どもらしく」' },
  { pattern: /らいしく/g, replacement: 'らしく', description: '誤字修正：「らいしく」→「らしく」' },
  { pattern: /一所懸命/g, replacement: '一生懸命', description: '誤字修正：「一所懸命」→「一生懸命」' },
  { pattern: /以上/g, replacement: 'いじょう', description: '誤字修正：「以上」→「いじょう」' },
  { pattern: /意外/g, replacement: 'いがい', description: '誤字修正：「意外」→「いがい」' },
  { pattern: /雰囲気/g, replacement: 'ふんいき', description: '誤字修正：「雰囲気」→「ふんいき」' },
  
  // ひらがな・カタカナ誤字
  { pattern: /よずみ/g, replacement: 'よろしく', description: '誤字修正：「よずみ」→「よろしく」' },
  { pattern: /てづかい/g, replacement: 'てづかい', description: '誤字修正：手遣い関連' },
  { pattern: /ずつ/g, replacement: 'づつ', description: '誤字修正：「ずつ」→「づつ」' },
  { pattern: /ずらい/g, replacement: 'づらい', description: '誤字修正：「ずらい」→「づらい」' },
  
  // 音便・語尾の誤字
  { pattern: /あらわしく/g, replacement: 'あらわしく', description: '誤字修正：表現関連' },
  { pattern: /たのしく/g, replacement: 'たのしく', description: '誤字修正：「たのしく」' },
  { pattern: /うれしく/g, replacement: 'うれしく', description: '誤字修正：「うれしく」' },
  
  // 助詞の誤字
  { pattern: /を/g, replacement: 'を', description: '助詞確認：「を」' },
  { pattern: /は([^あ-ん])/g, replacement: 'は$1', description: '助詞確認：「は」' },
  { pattern: /へ([^あ-ん])/g, replacement: 'へ$1', description: '助詞確認：「へ」' },
  
  // 学校でよく使われる語句の誤字
  { pattern: /せいかつ/g, replacement: '生活', description: '誤字修正：「せいかつ」→「生活」' },
  { pattern: /がくしゅう/g, replacement: '学習', description: '誤字修正：「がくしゅう」→「学習」' },
  { pattern: /ともだち/g, replacement: '友達', description: '誤字修正：「ともだち」→「友達」' },
  
  // その他よくある誤字
  { pattern: /あいるく/g, replacement: '歩く', description: '誤字修正：「あいるく」→「歩く」' },
  { pattern: /きもいち/g, replacement: 'きもち', description: '誤字修正：「きもいち」→「きもち」' },
  { pattern: /かんがいる/g, replacement: '考える', description: '誤字修正：「かんがいる」→「考える」' },
  
  // 送り仮名の誤字
  { pattern: /受取る/g, replacement: '受け取る', description: '誤字修正：「受取る」→「受け取る」' },
  { pattern: /申込み/g, replacement: '申し込み', description: '誤字修正：「申込み」→「申し込み」' },
  { pattern: /取組み/g, replacement: '取り組み', description: '誤字修正：「取組み」→「取り組み」' },
  { pattern: /受入れ/g, replacement: '受け入れ', description: '誤字修正：「受入れ」→「受け入れ」' },
  
  // 数字・記号の誤字
  { pattern: /１/g, replacement: '1', description: '誤字修正：全角数字→半角数字' },
  { pattern: /２/g, replacement: '2', description: '誤字修正：全角数字→半角数字' },
  { pattern: /３/g, replacement: '3', description: '誤字修正：全角数字→半角数字' },
  { pattern: /４/g, replacement: '4', description: '誤字修正：全角数字→半角数字' },
  { pattern: /５/g, replacement: '5', description: '誤字修正：全角数字→半角数字' },
  { pattern: /６/g, replacement: '6', description: '誤字修正：全角数字→半角数字' }
];

// すべてのルールをまとめた配列
export const allConversionRules: ConversionRule[] = [
  ...kanjiToHiraganaRules,
  ...hiraganaToKanjiRules,
  ...unificationRules,
  ...officialDocumentRules,
  ...styleUnificationRules,
  ...finalAdjustmentRules,
  ...typoCorrectionRules
];

// 推敲処理のメイン関数
export function applyAyumiRules(text: string): string {
  let result = text.trim();
  
  // 1. あゆみ表記ルール適用（×→○変換）
  for (const rule of kanjiToHiraganaRules) {
    if (typeof rule.pattern === 'string') {
      result = result.replace(new RegExp(rule.pattern, 'g'), rule.replacement);
    } else {
      result = result.replace(rule.pattern, rule.replacement);
    }
  }
  
  // 2. 重要な漢字表記ルール適用
  for (const rule of hiraganaToKanjiRules) {
    if (typeof rule.pattern === 'string') {
      result = result.replace(new RegExp(rule.pattern, 'g'), rule.replacement);
    } else {
      result = result.replace(rule.pattern, rule.replacement);
    }
  }
  
  // 3. 表現統一ルール適用
  for (const rule of unificationRules) {
    if (typeof rule.pattern === 'string') {
      result = result.replace(new RegExp(rule.pattern, 'g'), rule.replacement);
    } else {
      result = result.replace(rule.pattern, rule.replacement);
    }
  }
  
  // 4. 公用文推敲ルール適用
  for (const rule of officialDocumentRules) {
    if (typeof rule.pattern === 'string') {
      result = result.replace(new RegExp(rule.pattern, 'g'), rule.replacement);
    } else {
      result = result.replace(rule.pattern, rule.replacement);
    }
  }
  
  // 5. 文体統一ルール適用
  for (const rule of styleUnificationRules) {
    if (typeof rule.pattern === 'string') {
      result = result.replace(new RegExp(rule.pattern, 'g'), rule.replacement);
    } else {
      result = result.replace(rule.pattern, rule.replacement);
    }
  }
  
  // 6. 最終調整ルール適用
  for (const rule of finalAdjustmentRules) {
    if (typeof rule.pattern === 'string') {
      result = result.replace(new RegExp(rule.pattern, 'g'), rule.replacement);
    } else {
      result = result.replace(rule.pattern, rule.replacement);
    }
  }
  
  // 7. 誤字脱字修正ルール適用
  for (const rule of typoCorrectionRules) {
    if (typeof rule.pattern === 'string') {
      result = result.replace(new RegExp(rule.pattern, 'g'), rule.replacement);
    } else {
      result = result.replace(rule.pattern, rule.replacement);
    }
  }
  
  // 追加の最終調整
  result = result
    .replace(/多くがんばっ、/g, '多く意欲的に取り組み、')
    .replace(/取り組んでい、/g, '取り組んでおり、')
    .replace(/わたし達/g, '私たち')
    .replace(/自分達/g, '自分たち');
  
  return result.trim();
}

// 推敲の変更履歴を取得する関数
export function getChangeHistory(originalText: string, revisedText: string): string[] {
  const changes: string[] = [];
  
  // 各ルールカテゴリを適用して変更点を記録
  let currentText = originalText;
  
  // あゆみ表記ルール適用の変更記録
  for (const rule of allConversionRules) {
    const beforeApply = currentText;
    if (typeof rule.pattern === 'string') {
      currentText = currentText.replace(new RegExp(rule.pattern, 'g'), rule.replacement);
    } else {
      currentText = currentText.replace(rule.pattern, rule.replacement);
    }
    
    if (beforeApply !== currentText) {
      changes.push(rule.description);
    }
  }
  
  return changes;
}