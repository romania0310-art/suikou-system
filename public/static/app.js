// あゆみ所見等 自動推敲システム - フロントエンド機能

let currentSessionId = null;

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
            // ファイル情報を表示
            fileName.textContent = file.name;
            fileSize.textContent = `(${formatFileSize(file.size)})`;
            fileInfo.classList.remove('hidden');
            clearFileBtn.classList.remove('hidden');
        } else {
            // ファイル情報を非表示
            fileInfo.classList.add('hidden');
            clearFileBtn.classList.add('hidden');
        }
    });

    // ファイルクリアボタンクリック処理
    clearFileBtn.addEventListener('click', function() {
        fileInput.value = '';
        fileInfo.classList.add('hidden');
        clearFileBtn.classList.add('hidden');
        
        // 結果セクションも非表示にする
        resultsSection.classList.add('hidden');
        currentSessionId = null;
        
        // ボタン状態をリセット
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'アップロード・推敲開始';
        downloadBtn.classList.add('hidden');
    });

    // ファイルサイズをフォーマットする関数
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // アップロードボタンクリック処理
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

            const formData = new FormData();
            formData.append('csv', file);

            const response = await axios.post('/api/upload-csv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                currentSessionId = response.data.sessionId;
                showResults();
                startReviewProcess();
            } else {
                throw new Error(response.data.error || 'アップロードに失敗しました');
            }

        } catch (error) {
            console.error('アップロードエラー:', error);
            alert(error.response?.data?.error || 'アップロードに失敗しました。ファイル形式を確認してください。');
        } finally {
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'アップロード・推敲開始';
        }
    });

    // 結果セクションを表示
    function showResults() {
        resultsSection.classList.remove('hidden');
        updateProgress(0, 'アップロード完了。推敲処理を開始します...');
    }

    // 推敲処理を開始
    async function startReviewProcess() {
        try {
            updateProgress(25, '公用文推敲処理を実行中...');

            const response = await axios.post(`/api/review/${currentSessionId}`);

            if (response.data.success) {
                updateProgress(75, '推敲処理完了。結果を表示中...');
                displayResults(response.data.results);
                updateProgress(100, '処理完了');
                downloadBtn.classList.remove('hidden');
            } else {
                throw new Error(response.data.error || '推敲処理に失敗しました');
            }

        } catch (error) {
            console.error('推敲処理エラー:', error);
            updateProgress(0, 'エラー: ' + (error.response?.data?.error || '推敲処理に失敗しました'));
        }
    }

    // 進捗バー更新
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
                                                    ${result.revisionNotes || 'あゆみ表記ルールに基づく推敲'}
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
    downloadBtn.addEventListener('click', async function() {
        if (!currentSessionId) {
            alert('セッションが見つかりません。');
            return;
        }

        try {
            downloadBtn.disabled = true;
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>ダウンロード中...';

            const response = await axios.get(`/api/download-csv/${currentSessionId}`, {
                responseType: 'blob'
            });

            // ファイルダウンロード
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `推敲済み所見_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('ダウンロードエラー:', error);
            alert('ダウンロードに失敗しました。');
        } finally {
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = '<i class="fas fa-download mr-2"></i>修正版CSVダウンロード';
        }
    });

    // HTML エスケープ関数
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});