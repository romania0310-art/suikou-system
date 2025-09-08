#!/bin/bash
# 高速起動スクリプト

echo "🚀 あゆみ推敲システム 高速起動中..."

# 1. 既存プロセスをクリーンアップ
echo "📋 プロセスクリーンアップ..."
pm2 delete webapp 2>/dev/null || true
fuser -k 3000/tcp 2>/dev/null || true

# 2. D1データベースの事前準備（並列実行）
echo "🗄️ データベース準備中..."
cd /home/user/webapp
npm run db:migrate:local &

# 3. PM2でサービス起動
echo "⚡ サービス起動中..."
pm2 start ecosystem.config.cjs

# 4. ウォームアップリクエスト（バックグラウンド）
echo "🔥 システムウォームアップ中..."
{
  sleep 8
  curl -s http://localhost:3000 > /dev/null 2>&1
  curl -s http://localhost:3000/static/app.js > /dev/null 2>&1
  curl -s http://localhost:3000/static/style.css > /dev/null 2>&1
} &

echo "✅ 起動完了！"
echo "🌐 URL: http://localhost:3000"
echo ""
echo "📊 プロセス状況:"
pm2 list

echo ""
echo "🔍 5秒後にサービステスト実行..."
sleep 5
echo "テスト結果: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)"