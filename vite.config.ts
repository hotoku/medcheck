import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages のプロジェクトページは https://<user>.github.io/medcheck/ という
// サブパスで配信される。base を相対パスにしておくと、配信先のパスに依らず
// アセットを解決できる（開発サーバ・preview・Pages のいずれでも動く）。
// このアプリはクライアントルーティングを持たないため相対パスで問題ない。
// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
})
