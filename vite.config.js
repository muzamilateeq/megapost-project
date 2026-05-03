import { copyFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: project sites use https://<user>.github.io/<repo>/ → base /<repo>/
// User/org root site uses repo <user>.github.io → base /
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
function normalizeBase(v) {
  if (v == null || v === '' || v === '/') return '/'
  const withSlash = v.startsWith('/') ? v : `/${v}`
  return withSlash.endsWith('/') ? withSlash : `${withSlash}/`
}
const inferredBase =
  repo && !/\.github\.io$/i.test(repo) ? `/${repo}` : '/'
const base = normalizeBase(process.env.VITE_BASE || inferredBase)

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    {
      name: 'spa-fallback-404',
      closeBundle() {
        // GitHub Pages has no SPA rewrite; copy so deep links still load the app.
        copyFileSync('dist/index.html', 'dist/404.html')
      },
    },
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('@tiptap')) return 'tiptap'
          if (id.includes('react-router')) return 'router'
          if (id.includes('dompurify')) return 'purify'
          if (id.includes('react-dom') || id.includes('/react/')) return 'react-vendor'
          return 'vendor'
        },
      },
    },
  },
})
