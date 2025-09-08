// あゆみ所見等 自動推敲システム - GitHub Pages版（クライアントサイド）

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
        uploadBtn.textContent = 'アップロード・推敲開始';
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
            updateProgress(50, '推敲処理中...');
            
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
            uploadBtn.textContent = 'アップロード・推敲開始';
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
                        data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    } else {
                        // CSVファイル処理
                        const text = e.target.result;
                        data = text.split('\n').map(row => {
                            return row.split(',').map(cell => 
                                cell.trim().replace(/^"|"$/g, '')
                            );
                        });
                    }
                    
                    resolve(data.filter(row => row.some(cell => cell && cell.trim())));
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
        
        // ヘッダー検索
        const gradeIndex = findHeaderIndex(headers, ['学年']);
        const classIndex = findHeaderIndex(headers, ['組', 'クラス']);  
        const numberIndex = findHeaderIndex(headers, ['番号', '出席番号']);
        const nameIndex = findHeaderIndex(headers, ['名前', '氏名']);
        
        // 所見列の検索（複数列対応）
        const commentIndices = [];
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i] ? headers[i].toString().toLowerCase() : '';
            if (header.includes('所見') || header.includes('コメント') || 
                header.includes('評価') || header.includes('備考')) {
                commentIndices.push(i);
            }
        }
        
        if (commentIndices.length === 0) {
            throw new Error('所見列が見つかりません。「所見」「コメント」「評価」「備考」のいずれかを含む列名が必要です。');
        }
        
        const results = [];
        
        rows.forEach((row, rowIndex) => {
            if (!row || row.length === 0) return;
            
            const studentName = row[nameIndex] || `生徒${rowIndex + 1}`;
            
            commentIndices.forEach((commentIndex, commentIndexNum) => {
                const originalComment = row[commentIndex];
                if (!originalComment || originalComment.trim() === '') return;
                
                const revisedComment = applyAyumiRules(originalComment);
                const changes = getChangeHistory(originalComment, revisedComment);
                
                results.push({
                    studentName: studentName,
                    subject: `所見${commentIndices.length > 1 ? commentIndexNum + 1 : ''}`,
                    originalText: originalComment,
                    revisedText: revisedComment,
                    revisionNotes: changes.length > 0 ? changes.join(', ') : 'あゆみ表記ルールに基づく推敲'
                });
            });
        });
        
        if (results.length === 0) {
            throw new Error('処理対象のデータが見つかりません');
        }
        
        return results;
    }

    // ヘッダー検索
    function findHeaderIndex(headers, searchTerms) {
        for (const term of searchTerms) {
            const index = headers.findIndex(header => 
                header && header.toString().toLowerCase().includes(term.toLowerCase())
            );
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

    // 結果表示
    function displayResults(results) {
        const tableHtml = `
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">児童名</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">教科</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">修正前後比較</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${results.map(result => `
                            <tr class="hover:bg-gray-50">
                                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${escapeHtml(result.studentName)}</td>
                                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${escapeHtml(result.subject)}</td>
                                <td class="px-4 py-4 text-sm text-gray-900">
                                    <div class="space-y-3">
                                        <div class="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                                            <div class="text-red-800 font-semibold text-xs uppercase mb-1">修正前</div>
                                            <div class="text-red-700">${escapeHtml(result.originalText)}</div>
                                        </div>
                                        <div class="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                                            <div class="text-green-800 font-semibold text-xs uppercase mb-1">修正後</div>
                                            <div class="text-green-700">${escapeHtml(result.revisedText)}</div>
                                        </div>
                                        ${result.originalText !== result.revisedText ? 
                                            `<div class="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                                                <div class="text-blue-800 font-semibold text-xs uppercase mb-1">
                                                    <i class="fas fa-list mr-1"></i>適用された表記ルール
                                                </div>
                                                <div class="text-blue-700 text-xs">
                                                    ${result.revisionNotes}
                                                </div>
                                            </div>
                                            <div class="flex items-center text-orange-600 text-xs mt-2">
                                                <i class="fas fa-edit mr-1"></i>推敲済み
                                            </div>` : 
                                            '<div class="flex items-center text-gray-500 text-xs mt-1"><i class="fas fa-check mr-1"></i>修正不要</div>'
                                        }
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="mt-4 text-sm text-gray-600">
                <i class="fas fa-info-circle mr-2"></i>
                処理件数: ${results.length}件 | 
                修正件数: ${results.filter(r => r.originalText !== r.revisedText).length}件
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
            
            // ファイルダウンロード
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `推敲済み所見_${new Date().toISOString().split('T')[0]}.csv`);
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

    // CSV生成
    function generateCSV(data) {
        const headers = ['児童名', '教科・項目', '修正前', '修正後', '適用ルール'];
        const rows = data.map(item => [
            item.studentName,
            item.subject,
            item.originalText,
            item.revisedText,
            item.revisionNotes
        ]);
        
        const csvRows = [headers, ...rows];
        return csvRows.map(row => 
            row.map(field => `"${field.toString().replace(/"/g, '""')}"`).join(',')
        ).join('\n');
    }

    // HTML エスケープ
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});