// Tiny static server for the landing-page preview (see design/build-preview.mjs).
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { dirname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' }
const port = Number(process.env.PORT) || 4120

createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname))
  const file = join(root, path === '/' ? 'index.html' : path)
  if (!file.startsWith(root)) { res.writeHead(403).end('forbidden'); return }
  try {
    const body = await readFile(file)
    const ext = file.slice(file.lastIndexOf('.'))
    res.writeHead(200, { 'content-type': TYPES[ext] ?? 'application/octet-stream', 'cache-control': 'no-store' })
    res.end(body)
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' }).end('not found')
  }
}).listen(port, () => console.log(`landing preview on http://localhost:${port}`))
