import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'
import { applyAyumiRules, getChangeHistory } from './ayumi-rules'
// 軽量化: 必要な機能のみをimport
import { read, utils } from 'xlsx'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS設定
app.use('/api/*', cors())

// 静的ファイル配信
app.use('/static/*', serveStatic({ root: './public' }))

// JSXレンダラーをメインページでのみ使用
app.use('/', renderer)

// メインページ
app.get('/', (c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          <i className="fas fa-school mr-3 text-blue-600"></i>
          あゆみ所見等 自動推敲システム
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            <i className="fas fa-upload mr-2 text-green-600"></i>
            ファイルアップロード
          </h2>
          <div id="upload-section">
            <input type="file" id="csv-file" accept=".csv,.xlsx" className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            <div className="flex gap-3 mb-4">
              <button id="upload-btn" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                アップロード・推敲開始
              </button>
              <button id="clear-file-btn" className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors hidden">
                <i className="fas fa-times mr-1"></i>
                選択解除
              </button>
            </div>
            <div id="file-info" className="text-sm text-gray-600 hidden">
              <i className="fas fa-file-excel mr-2 text-green-600"></i>
              <span id="file-name"></span>
              <span id="file-size" className="ml-2 text-gray-500"></span>
            </div>
          </div>
        </div>

        <div id="results-section" className="hidden">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              <i className="fas fa-edit mr-2 text-purple-600"></i>
              推敲結果
            </h2>
            <div id="progress-bar" className="mb-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
              </div>
              <p id="progress-text" className="text-sm text-gray-600 mt-2">処理中...</p>
            </div>
            <div id="results-table"></div>
            <button id="download-btn" className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors hidden">
              <i className="fas fa-download mr-2"></i>
              修正版CSVダウンロード
            </button>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            <i className="fas fa-info-circle mr-2"></i>
            使用方法と推敲ルール
          </h3>
          <ul className="text-blue-700 space-y-2 mb-4">
            <li>• ExcelまたはCSVファイルに「学年」「組」「番号」「所見等（推敲したい文）」の列が必要です（所見列は複数対応）</li>
            <li>• 横浜市立学校「あゆみ表記ルール」に基づいて自動推敲されます</li>
            <li>• 文化審議会建議「公用文作成の考え方」も併用されます</li>
            <li>• 修正前後の比較表示で変更内容と適用ルールを確認できます</li>
            <li>• 推敲後のデータはCSVファイルでダウンロードできます（校務支援システム対応）</li>
          </ul>
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <h4 className="text-blue-800 font-semibold text-sm mb-2">主な推敲ルール例：</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-600">
              <div>「とても」→「非常に」</div>
              <div>「お話」→「物語」</div>
              <div>「がんばって」→「意欲的に取り組み」</div>
              <div>「みんなの前で」→「学級において」</div>
              <div>「である調」→「です・ます調」</div>
              <div>「子供」→「子ども」</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

// ファイル解析共通関数
async function parseFileToRows(file: File): Promise<string[][]> {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.xlsx')) {
    // Excelファイルの処理
    const arrayBuffer = await file.arrayBuffer();
    const workbook = read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
    
    // nullやundefinedの値を空文字に変換し、文字列として処理
    return (jsonData as any[][]).map(row => 
      row.map(cell => (cell != null ? String(cell).trim() : ''))
    );
  } else if (fileName.endsWith('.csv')) {
    // CSVファイルの処理
    const csvText = await file.text();
    return csvText.split('\n')
      .filter(row => row.trim() !== '') // 空行を除去
      .map(row => 
        row.split(',').map(cell => 
          cell != null ? String(cell).trim().replace(/^"|"$/g, '') : ''
        )
      );
  } else {
    throw new Error('サポートされていないファイル形式です。Excel(.xlsx)またはCSV(.csv)ファイルをアップロードしてください。');
  }
}

// API: ファイルアップロード処理（Excel・CSV両対応）
app.post('/api/upload-csv', async (c) => {
  const { env } = c;
  
  try {
    const formData = await c.req.formData();
    const uploadedFile = formData.get('csv') as File;
    
    if (!uploadedFile) {
      return c.json({ error: 'ファイルが見つかりません' }, 400);
    }

    // ファイル形式のチェック
    const fileName = uploadedFile.name.toLowerCase();
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.csv')) {
      return c.json({ error: 'Excel(.xlsx)またはCSV(.csv)ファイルをアップロードしてください' }, 400);
    }

    const rows = await parseFileToRows(uploadedFile);
    
    // ヘッダー行の検証
    const headers = rows[0].map(h => (h != null ? String(h).trim() : ''));
    // 必須ヘッダー（学年・組・番号と最低1つの所見列）
    const basicHeaders = ['学年', '組', '番号'];
    const commentHeaders = headers.filter(h => h && h.includes('所見等（推敲したい文）'));
    
    const missingBasicHeaders = basicHeaders.filter(h => !headers.includes(h));
    
    if (missingBasicHeaders.length > 0) {
      return c.json({ 
        error: `必要な列が不足しています: ${missingBasicHeaders.join(', ')}` 
      }, 400);
    }
    
    if (commentHeaders.length === 0) {
      return c.json({ 
        error: '所見列が見つかりません。「所見等（推敲したい文）」を含む列が必要です。' 
      }, 400);
    }

    // セッションを作成（シンプルなセッション管理）
    const sessionName = `CSV一括処理 ${new Date().toLocaleString('ja-JP')}`;
    
    // デフォルトクラスが存在することを確認し、なければ作成
    const defaultClassResult = await env.DB.prepare(`
      INSERT OR IGNORE INTO classes (grade, class_number, school_year, teacher_name) 
      VALUES (1, 1, 2025, 'システム')
    `).run();
    
    // デフォルトクラスのIDを取得
    const classQuery = await env.DB.prepare(`
      SELECT id FROM classes WHERE grade = 1 AND class_number = 1 AND school_year = 2025
    `).first();
    
    const classId = classQuery?.id || 1;
    
    const sessionResult = await env.DB.prepare(`
      INSERT INTO review_sessions (session_name, class_id, status) 
      VALUES (?, ?, 'draft')
    `).bind(sessionName, classId).run();

    const sessionId = sessionResult.meta.last_row_id;

    // CSV データの処理（複数所見対応）
    const results = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 4) continue;

      const gradeIndex = headers.indexOf('学年');
      const classIndex = headers.indexOf('組');
      const numberIndex = headers.indexOf('番号');
      
      if (gradeIndex === -1 || classIndex === -1 || numberIndex === -1) {
        continue; // 基本列が見つからない場合はスキップ
      }
      
      const grade = row[gradeIndex]?.trim() || '';
      const classNumber = row[classIndex]?.trim() || '';
      const studentNumber = row[numberIndex]?.trim() || '';
      
      // 各所見列をチェックして処理
      let hasAnyComment = false;
      const commentData = [];
      
      for (const commentHeader of commentHeaders) {
        const commentIndex = headers.indexOf(commentHeader);
        const commentText = row[commentIndex]?.trim() || '';
        
        if (commentText) {
          hasAnyComment = true;
          commentData.push({
            header: commentHeader,
            text: commentText,
            subject: commentHeader.includes('-1') ? '所見-1' : 
                    commentHeader.includes('-2') ? '所見-2' : '所見'
          });
        }
      }
      
      // 所見が1つもない行はスキップ
      if (!hasAnyComment) continue;
      
      // 学年・組・番号から児童名を生成（空欄の場合はデフォルト値を使用）
      const gradeStr = grade || 'X';
      const classStr = classNumber || 'X'; 
      const numberStr = studentNumber || String(i);  // 行番号を使用
      const studentName = `${gradeStr}年${classStr}組${numberStr}番`;

      // 学生データが存在しない場合は作成（学生番号とクラスIDでチェック）
      let student = await env.DB.prepare(`
        SELECT * FROM students WHERE student_number = ? AND class_id = ? LIMIT 1
      `).bind(numberStr, classId).first();

      if (!student) {
        const studentResult = await env.DB.prepare(`
          INSERT INTO students (student_number, name, class_id) 
          VALUES (?, ?, ?)
        `).bind(numberStr, studentName, classId).run();
        
        student = { id: studentResult.meta.last_row_id };
      }

      // 各所見データを個別に保存
      for (const comment of commentData) {
        // 推敲処理を実行
        const revisedText = applyAyumiRules(comment.text);
        const changes = getChangeHistory(comment.text, revisedText);
        
        await env.DB.prepare(`
          INSERT OR REPLACE INTO student_reports (session_id, student_id, subject, original_text, revised_text, revision_notes, is_reviewed) 
          VALUES (?, ?, ?, ?, ?, ?, true)
        `).bind(sessionId, student.id, comment.subject, comment.text, revisedText, JSON.stringify(changes)).run();

        results.push({
          studentName,
          grade: gradeStr,
          classNumber: classStr,
          studentNumber: numberStr,
          subject: comment.subject,
          originalText: comment.text,
          revisedText: revisedText,
          changes: changes
        });
      }
    }

    return c.json({ 
      success: true, 
      sessionId,
      count: results.length,
      message: `${results.length}件の所見データを処理しました` 
    });

  } catch (error) {
    console.error('CSV処理エラー:', error);
    return c.json({ 
      error: 'CSV処理中にエラーが発生しました',
      details: error.message 
    }, 500);
  }
})

// API: 推敲処理実行
app.post('/api/review/:sessionId', async (c) => {
  const { env } = c;
  const sessionId = c.req.param('sessionId');

  try {
    // セッション内のすべての所見を取得（アップロード時に推敲済み）
    const reports = await env.DB.prepare(`
      SELECT sr.*, s.name as student_name 
      FROM student_reports sr 
      JOIN students s ON sr.student_id = s.id 
      WHERE sr.session_id = ?
    `).bind(sessionId).all();

    if (!reports.results.length) {
      return c.json({ error: '処理対象の所見が見つかりません' }, 404);
    }

    const results = [];
    for (const report of reports.results) {
      // 推敲済みデータを返す（アップロード時に処理済み）
      const changeHistory = report.revision_notes ? JSON.parse(report.revision_notes) : [];
      
      results.push({
        id: report.id,
        studentName: report.student_name,
        subject: report.subject,
        originalText: report.original_text,
        revisedText: report.revised_text || report.original_text,
        changeHistory: changeHistory,
        revisionNotes: changeHistory.length > 0 ? changeHistory.join('、') : '修正なし'
      });
    }

    return c.json({ success: true, completed: true, results });

  } catch (error) {
    console.error('推敲処理エラー:', error);
    return c.json({ error: '推敲処理中にエラーが発生しました' }, 500);
  }
})

// API: 推敲結果のCSVダウンロード
app.get('/api/download-csv/:sessionId', async (c) => {
  const { env } = c;
  const sessionId = c.req.param('sessionId');

  try {
    const reports = await env.DB.prepare(`
      SELECT sr.*, s.name as student_name 
      FROM student_reports sr 
      JOIN students s ON sr.student_id = s.id 
      WHERE sr.session_id = ? 
      ORDER BY s.student_number, sr.subject
    `).bind(sessionId).all();

    if (!reports.results.length) {
      return c.json({ error: 'ダウンロード対象のデータが見つかりません' }, 404);
    }

    // CSV生成（複数所見を横並びに配置）
    // 学生ごとにデータをグループ化
    const studentReports = {};
    reports.results.forEach(report => {
      const nameMatch = report.student_name.match(/(.+)年(.+)組(.+)番/);
      const key = report.student_name;
      
      if (!studentReports[key]) {
        studentReports[key] = {
          grade: nameMatch ? nameMatch[1] : '',
          classNum: nameMatch ? nameMatch[2] : '',
          studentNum: nameMatch ? nameMatch[3] : '',
          reports: {}
        };
      }
      
      studentReports[key].reports[report.subject] = {
        original: report.original_text,
        revised: report.revised_text || report.original_text,
        updated_at: report.updated_at
      };
    });

    const csvHeader = '学年,組,番号,元の所見-1,推敲後の所見-1,元の所見-2,推敲後の所見-2,推敲日時\n';
    const csvRows = Object.values(studentReports).map(student => {
      const escapeCsv = (text) => {
        if (!text) return '';
        if (text.includes(',') || text.includes('"') || text.includes('\n')) {
          return `"${text.replace(/"/g, '""')}"`;
        }
        return text;
      };

      const report1 = student.reports['所見-1'] || { original: '', revised: '', updated_at: null };
      const report2 = student.reports['所見-2'] || { original: '', revised: '', updated_at: null };
      
      // 最新の更新日時を使用
      const latestDate = report1.updated_at || report2.updated_at;
      const dateStr = latestDate ? new Date(latestDate).toLocaleString('ja-JP') : '';
      
      return [
        escapeCsv(student.grade),
        escapeCsv(student.classNum),
        escapeCsv(student.studentNum),
        escapeCsv(report1.original),
        escapeCsv(report1.revised),
        escapeCsv(report2.original),
        escapeCsv(report2.revised),
        dateStr
      ].join(',');
    });

    // BOM付きUTF-8で文字化け対策（Excel対応）
    const BOM = '\uFEFF';
    const csvContent = BOM + csvHeader + csvRows.join('\r\n');
    
    // 日本語ファイル名（RFC 5987対応）
    const baseFileName = `推敲済み所見_${new Date().toISOString().split('T')[0]}.csv`;
    const encodedFileName = encodeURIComponent(baseFileName);
    
    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodedFileName}`
      }
    });

  } catch (error) {
    console.error('CSVダウンロードエラー:', error);
    return c.json({ error: 'CSVダウンロード中にエラーが発生しました' }, 500);
  }
})

// 公用文推敲関数（あゆみ表記ルール統合版）
async function reviewText(originalText: string): Promise<string> {
  // あゆみ表記ルールを適用して推敲を実行
  const revisedText = applyAyumiRules(originalText);
  return revisedText;
}

// 推敲内容の詳細情報を取得する関数
async function getReviewDetails(originalText: string, revisedText: string): Promise<string[]> {
  return getChangeHistory(originalText, revisedText);
}

export default app
