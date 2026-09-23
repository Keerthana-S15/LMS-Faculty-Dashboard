import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_PROXY || 'http://localhost:4000'

  return {
    plugins: [react()],
    server: {
      // Pin the dev server to 5173 and fail loudly if it is taken, instead of
      // silently moving to 5174 (which then looks like "connection refused"
      // at the URL you expected).
      port: 5173,
      strictPort: true,
      // Listen on both IPv4 and IPv6 loopback: on Windows the default binds
      // only to [::1], so http://127.0.0.1:5173 gets refused.
      host: true,
      // Frontend calls /api/... and Vite forwards it to the Express server,
      // so the browser stays same-origin in development.
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          // When the API isn't running, reply with the same JSON error shape
          // the app expects instead of Vite's HTML 502 page.
          configure(proxy) {
            proxy.on('error', (err, req, res) => {
              const message =
                `Can't reach the API server at ${apiTarget}. ` +
                'Start it with: cd server && npm run dev'
              console.warn(`[api proxy] ${req.method} ${req.url} -> ${err.code || err.message}`)
              if (res.writableEnded) return
              res.writeHead(503, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: { message } }))
            })
          },
        },
      },
    },
  }
})
