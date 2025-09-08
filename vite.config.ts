import { defineConfig } from 'vite'
import pages from '@hono/vite-cloudflare-pages'

export default defineConfig({
  plugins: [pages()],
  build: {
    outDir: 'dist',
    // 軽量化設定
    minify: 'esbuild',
    target: 'esnext',
    rollupOptions: {
      external: [],
      output: {
        // バンドルサイズ削減
        manualChunks: undefined,
        compact: true
      }
    }
  },
  // 開発時の高速化
  optimizeDeps: {
    include: ['hono', 'xlsx']
  }
})