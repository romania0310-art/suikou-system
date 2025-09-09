// あゆみ所見等 自動校正システム - GitHub Pages版（クライアントサイド）

let processedData = [];

document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('csv-file');
    const uploadBtn = document.getElementById('upload-btn');
    const clearFileBtn = document.getElementById('clear-file-btn');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const resultsSection = document.getElementById('results-section');
    const progressBar = document.querySelector('#progress-bar .bg-green-600');
    const progressText = document.getElementById('progress-text');
    const resultsTable = document.getElementById('results-table');
    const downloadBtn = document.getElementById('download-btn');

    // ファイル選択時の処理
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            fileName.textContent = file.name;
            fileSize.textContent = `(${formatFileSize(file.size)})`;
            fileInfo.classList.remove('hidden');
            clearFileBtn.classList.remove('hidden');
        } else {
            fileInfo.classList.add('hidden');
            clearFileBtn.classList.add('hidden');
        }
    });

    // ファイルクリアボタン
    clearFileBtn.addEventListener('click', function() {
        fileInput.value = '';
        fileInfo.classList.add('hidden');
        clearFileBtn.classList.add('hidden');
        resultsSection.classList.add('hidden');
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'アップロード・校正開始';
        downloadBtn.classList.add('hidden');
        processedData = [];
    });

    // ファイルサイズフォーマット
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // アップロードボタン処理
    uploadBtn.addEventListener('click', async function() {
        const file = fileInput.files[0];
        if (!file) {
            alert('Excel(.xlsx)またはCSV(.csv)ファイルを選択してください。');
            return;
        }

        const fileName = file.name.toLowerCase();
        if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx')) {
            alert('Excel(.xlsx)またはCSV(.csv)ファイルを選択してください。');
            return;
        }

        try {
            uploadBtn.disabled = true;
            uploadBtn.textContent = 'アップロード中...';
            
            // ファイル処理開始
            showResults();
            updateProgress(25, 'ファイルを読み込み中...');
            
            const fileData = await readFile(file);
            updateProgress(50, '校正処理中...');
            
            const results = processAyumiData(fileData);
            updateProgress(75, '結果を表示中...');
            
            displayResults(results);
            updateProgress(100, '処理完了');
            
            processedData = results;
            downloadBtn.classList.remove('hidden');

        } catch (error) {
            console.error('処理エラー:', error);
            updateProgress(0, 'エラー: ' + error.message);
            alert('ファイル処理に失敗しました: ' + error.message);
        } finally {
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'アップロード・校正開始';
        }
    });

    // ファイル読み込み（Excel/CSV対応）
    function readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const fileName = file.name.toLowerCase();
                    let data;
                    
                    if (fileName.endsWith('.xlsx')) {
                        // Excelファイル処理
                        const workbook = XLSX.read(e.target.result, { type: 'array' });
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];
                        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                        
                        // セルの値を安全に文字列化
                        data = rawData.map(row => 
                            row.map(cell => {
                                if (cell == null || cell === undefined) return '';
                                return String(cell).trim();
                            })
                        );
                    } else {
                        // CSVファイル処理
                        const text = e.target.result;
                        data = text.split('\n').map(row => {
                            return row.split(',').map(cell => {
                                if (cell == null || cell === undefined) return '';
                                return String(cell).trim().replace(/^"|"$/g, '');
                            });
                        });
                    }
                    
                    // 空行を除外（安全な文字列チェック）
                    const filteredData = data.filter(row => 
                        row.some(cell => {
                            if (cell == null || cell === undefined) return false;
                            const cellStr = String(cell).trim();
                            return cellStr !== '';
                        })
                    );
                    resolve(filteredData);
                } catch (error) {
                    reject(new Error('ファイル読み込みエラー: ' + error.message));
                }
            };
            
            reader.onerror = () => reject(new Error('ファイル読み込みに失敗しました'));
            
            if (file.name.toLowerCase().endsWith('.xlsx')) {
                reader.readAsArrayBuffer(file);
            } else {
                reader.readAsText(file, 'UTF-8');
            }
        });
    }

    // あゆみデータ処理
    function processAyumiData(fileData) {
        if (!fileData || fileData.length < 2) {
            throw new Error('データが不足しています');
        }
        
        const headers = fileData[0];
        const rows = fileData.slice(1);
        
        // ヘッダー検索（個人情報保護対応）
        const gradeIndex = findHeaderIndex(headers, ['学年']);
        const classIndex = findHeaderIndex(headers, ['組', 'クラス']);  
        const numberIndex = findHeaderIndex(headers, ['番号', '出席番号']);
        // 名前列は個人情報保護のため使用しない
        
        // 所見列の検索（複数列対応、安全な文字列処理）
        const commentIndices = [];
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            if (header == null || header === undefined) continue;
            
            const headerStr = String(header).toLowerCase();
            if (headerStr.includes('所見') || headerStr.includes('コメント') || 
                headerStr.includes('評価') || headerStr.includes('備考')) {
                commentIndices.push(i);
            }
        }
        
        if (commentIndices.length === 0) {
            throw new Error('所見列が見つかりません。「所見」「コメント」「評価」「備考」のいずれかを含む列名が必要です。');
        }
        
        const results = [];
        
        // 横並び表示用：学生ごとにグループ化
        const studentGroups = {};
        
        rows.forEach((row, rowIndex) => {
            if (!row || row.length === 0) return;
            
            // 個人情報保護：学年・組・番号で識別（安全な文字列処理）
            const grade = row[gradeIndex] ? String(row[gradeIndex]).trim() : '';
            const classNum = row[classIndex] ? String(row[classIndex]).trim() : '';  
            const number = row[numberIndex] ? String(row[numberIndex]).trim() : String(rowIndex + 1);
            const studentId = `${grade}年${classNum}組${number}番`;
            
            // 学生ごとの所見をまとめる
            if (!studentGroups[studentId]) {
                studentGroups[studentId] = {
                    studentName: studentId,
                    comments: []
                };
            }
            
            commentIndices.forEach((commentIndex, commentIndexNum) => {
                const originalComment = row[commentIndex];
                if (!originalComment) return;
                
                const commentStr = String(originalComment).trim();
                if (commentStr === '') return;
                
                const revisedComment = applyAyumiRules(commentStr);
                const changes = getChangeHistory(commentStr, revisedComment);
                
                studentGroups[studentId].comments.push({
                    subject: `所見${commentIndices.length > 1 ? commentIndexNum + 1 : ''}`,
                    originalText: commentStr,
                    revisedText: revisedComment,
                    revisionNotes: changes.length > 0 ? changes.join(', ') : 'あゆみ表記ルールに基づく校正'
                });
            });
        });
        
        // 横並び表示用のresults配列を生成
        Object.values(studentGroups).forEach(student => {
            results.push(student);
        });
        
        if (results.length === 0) {
            throw new Error('処理対象のデータが見つかりません');
        }
        
        return results;
    }

    // ヘッダー検索（安全な文字列処理）
    function findHeaderIndex(headers, searchTerms) {
        for (const term of searchTerms) {
            const index = headers.findIndex(header => {
                if (header == null || header === undefined) return false;
                const headerStr = String(header).toLowerCase();
                return headerStr.includes(term.toLowerCase());
            });
            if (index !== -1) return index;
        }
        return -1;
    }

    // 結果セクション表示
    function showResults() {
        resultsSection.classList.remove('hidden');
        updateProgress(0, 'ファイル読み込み開始...');
    }

    // 進捗更新
    function updateProgress(percentage, text) {
        progressBar.style.width = percentage + '%';
        progressText.textContent = text;
    }

    // 結果表示（横並び表示対応）
    function displayResults(results) {
        const tableHtml = `
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">学年・組・番号</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">所見の修正前後比較（横並び表示）</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${results.map(student => `
                            <tr class="hover:bg-gray-50">
                                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 align-top">${escapeHtml(student.studentName)}</td>
                                <td class="px-4 py-4 text-sm text-gray-900">
                                    <div class="grid grid-cols-1 lg:grid-cols-${Math.min(student.comments.length, 3)} gap-4">
                                        ${student.comments.map(comment => `
                                            <div class="border rounded-lg p-3 space-y-3">
                                                <div class="text-center font-medium text-gray-700 bg-gray-100 py-1 px-2 rounded text-xs">
                                                    ${escapeHtml(comment.subject)}
                                                </div>
                                                <div class="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                                                    <div class="text-red-800 font-semibold text-xs uppercase mb-1">修正前</div>
                                                    <div class="text-red-700 text-sm">${escapeHtml(comment.originalText)}</div>
                                                </div>
                                                <div class="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                                                    <div class="text-green-800 font-semibold text-xs uppercase mb-1">修正後</div>
                                                    <div class="text-green-700 text-sm">${escapeHtml(comment.revisedText)}</div>
                                                </div>
                                                ${comment.originalText !== comment.revisedText ? 
                                                    `<div class="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                                                        <div class="text-blue-800 font-semibold text-xs uppercase mb-1">
                                                            <i class="fas fa-list mr-1"></i>適用ルール
                                                        </div>
                                                        <div class="text-blue-700 text-xs">
                                                            ${escapeHtml(comment.revisionNotes)}
                                                        </div>
                                                    </div>
                                                    <div class="flex items-center justify-center text-orange-600 text-xs mt-2">
                                                        <i class="fas fa-edit mr-1"></i>校正済み
                                                    </div>` : 
                                                    '<div class="flex items-center justify-center text-gray-500 text-xs mt-1"><i class="fas fa-check mr-1"></i>修正不要</div>'
                                                }
                                            </div>
                                        `).join('')}
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="mt-4 text-sm text-gray-600">
                <i class="fas fa-info-circle mr-2"></i>
                処理学生数: ${results.length}名 | 
                総所見数: ${results.reduce((sum, student) => sum + student.comments.length, 0)}件 | 
                修正件数: ${results.reduce((sum, student) => sum + student.comments.filter(c => c.originalText !== c.revisedText).length, 0)}件
            </div>
        `;

        resultsTable.innerHTML = tableHtml;
    }

    // CSVダウンロード処理
    downloadBtn.addEventListener('click', function() {
        if (processedData.length === 0) {
            alert('ダウンロードするデータがありません。');
            return;
        }

        try {
            downloadBtn.disabled = true;
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>ダウンロード中...';

            // CSVデータ生成
            const csvContent = generateCSV(processedData);
            
            // BOM付きでファイルダウンロード（Excel文字化け対策）
            const bom = '\uFEFF';
            const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            // ファイル名を安全にエンコード
            const dateStr = new Date().toISOString().split('T')[0];
            const fileName = `kousei_shoken_${dateStr}.csv`; // 英数字ファイル名で安全性確保
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('ダウンロードエラー:', error);
            alert('ダウンロードに失敗しました。');
        } finally {
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = '<i class="fas fa-download mr-2"></i>修正版CSVダウンロード';
        }
    });

    // CSV生成（校務システム対応シンプル形式、日本語文字化け対策）
    function generateCSV(data) {
        const headers = ['学年', '組', '番号', '所見１（校正済）', '所見２（校正済）'];
        const rows = [];
        
        // 学生ごとに横並び形式で1行にまとめる（校務システム対応）
        data.forEach(student => {
            // 学年・組・番号を分解（例：3年1組5番 → 3, 1, 5）
            const studentName = student.studentName || '';
            const match = studentName.match(/(\d+)年(\d+)組(\d+)番/);
            
            const grade = match ? match[1] : '';
            const classNum = match ? match[2] : '';
            const number = match ? match[3] : '';
            
            // 所見を所見１、所見２に分類
            let comment1 = '';
            let comment2 = '';
            
            student.comments.forEach(comment => {
                if (comment.subject.includes('1') || comment.subject === '所見' && comment1 === '') {
                    comment1 = comment.revisedText || '';
                } else if (comment.subject.includes('2') || comment.subject === '所見' && comment1 !== '') {
                    comment2 = comment.revisedText || '';
                }
            });
            
            // 所見が1つしかない場合は所見１に配置
            if (student.comments.length === 1 && comment1 === '' && comment2 === '') {
                comment1 = student.comments[0].revisedText || '';
            }
            
            rows.push([grade, classNum, number, comment1, comment2]);
        });
        
        const csvRows = [headers, ...rows];
        return csvRows.map(row => 
            row.map(field => {
                // 安全な文字列変換と特殊文字エスケープ
                const fieldStr = String(field)
                    .replace(/"/g, '""')  // ダブルクォートのエスケープ
                    .replace(/\r\n/g, ' ') // 改行を空白に置換
                    .replace(/\r/g, ' ')   // CR を空白に置換  
                    .replace(/\n/g, ' ');  // LF を空白に置換
                return `"${fieldStr}"`; 
            }).join(',')
        ).join('\r\n');  // Windows標準の改行コード
    }

    // HTML エスケープ
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});