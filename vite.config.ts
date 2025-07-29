import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Tailwind CSSプラグインをインポート

// https://vitejs.dev/config/
export default defineConfig({
  base: '/tools/universal-wms-v1/',
  plugins: [
    react(),
    tailwindcss(), // ここにプラグインを追加
  ],
  // 外部からアクセスできるようにするための設定
  server: {
    host: true, 
  }
})
