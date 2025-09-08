// 起動速度最優先の設定 - Cloudflare Pages版
module.exports = {
  apps: [
    {
      name: 'webapp',
      script: 'npx',
      args: 'wrangler pages dev dist --d1=webapp-production --local --ip 0.0.0.0 --port 3000 --live-reload=false',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        // 起動速度最適化のための環境変数
        NO_D1_WARNING: 'true',
        WRANGLER_LOG: 'none'
      },
      
      // 起動速度最優先設定
      instances: 1,              // シングルインスタンス
      exec_mode: 'fork',         // フォークモード
      watch: false,              // ファイル監視無効
      autorestart: false,        // 自動再起動無効（起動速度優先）
      
      // 最小限の制御
      max_restarts: 1,           // 最小限の再起動
      min_uptime: '10s',         // 短い稼働時間判定
      restart_delay: 1000,       // 短い再起動間隔
      
      // メモリ制限緩和
      max_memory_restart: '1G',
      
      // ログ最小化（起動速度向上）
      log_file: '/dev/null',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'HH:mm:ss',
      
      // 高速化設定
      disable_logs: false,
      merge_logs: true,
      kill_timeout: 2000,        // 短いkillタイムアウト
      
      // 環境変数
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};