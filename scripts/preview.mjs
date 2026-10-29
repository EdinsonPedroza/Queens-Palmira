// `npm start`: serves the static export (out/, made by `npm run build`) the way Cloudflare does, to try the real build on this computer:
// - serves ./out with pretty URLs (/spa -> spa.html), 404.html (status 404) for unknown paths
// - applies public/_headers (the `/*` block and `/_next/static/*`) and public/_redirects
import http from "node:http"
import fs from "node:fs"
import path from "node:path"
import zlib from "node:zlib"

const PORT = Number(process.env.PORT || 3000)
// Only this computer by default: the preview is not meant to be reachable from the network (HOST=0.0.0.0 to show it on a phone in the same Wi-Fi)
const HOST = process.env.HOST || "127.0.0.1"
const root = path.resolve("out")
if (!fs.existsSync(root)) {
  console.error("No out/ folder: run `npm run build` first.")
  process.exit(1)
}
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".woff2": "font/woff2", ".json": "application/json", ".webmanifest": "application/manifest+json", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml", ".svg": "image/svg+xml" }

function parseHeaders(file) {
  const rules = []
  if (!fs.existsSync(file)) return rules
  let cur = null
  for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    if (!raw.trim() || raw.trim().startsWith("#")) continue
    if (!/^\s/.test(raw)) { cur = { pattern: raw.trim(), headers: {} }; rules.push(cur) }
    else if (cur) { const i = raw.indexOf(":"); cur.headers[raw.slice(0, i).trim()] = raw.slice(i + 1).trim() }
  }
  return rules
}
const matches = (pattern, p) => {
  if (pattern === "/*") return true
  if (pattern.endsWith("/*")) return p.startsWith(pattern.slice(0, -1))
  return pattern === p
}
const headerRules = parseHeaders(path.resolve("out/_headers"))
const redirects = fs.existsSync(path.resolve("out/_redirects"))
  ? fs.readFileSync(path.resolve("out/_redirects"), "utf8").split(/\r?\n/).filter((l) => l.trim() && !l.startsWith("#")).map((l) => l.trim().split(/\s+/))
  : []

// A path inside out/ (not just one that starts with the same letters, like a sibling "out-old" folder)
const inside = (x) => x === root || x.startsWith(root + path.sep)

http.createServer((req, res) => {
  const url = new URL(req.url, "http://x")
  let p
  try {
    p = decodeURIComponent(url.pathname)
  } catch {
    res.writeHead(400); res.end("Bad request"); return   // a malformed %-escape used to throw and stop the server
  }
  const extra = {}
  for (const r of headerRules) if (matches(r.pattern, p)) Object.assign(extra, r.headers)
  const red = redirects.find(([from]) => from === p || from === p.replace(/\/$/, ""))
  if (red) { res.writeHead(Number(red[2] || 301), { location: red[1] + url.search }); res.end(); return }
  const f = path.join(root, p)
  const candidates = [f, f + ".html", path.join(f, "index.html")]
  const hit = candidates.find((x) => inside(x) && fs.existsSync(x) && fs.statSync(x).isFile())
  const send = (status, file) => {
    const ext = path.extname(file)
    const body = fs.readFileSync(file)
    const headers = { "content-type": types[ext] || "application/octet-stream", ...extra }
    if (/^(\.html|\.js|\.css|\.txt|\.json|\.xml|\.svg|\.webmanifest)$/.test(ext) && /gzip/.test(req.headers["accept-encoding"] || "")) {
      headers["content-encoding"] = "gzip"
      res.writeHead(status, headers); res.end(zlib.gzipSync(body)); return
    }
    res.writeHead(status, headers); res.end(body)
  }
  if (!hit) return send(404, path.join(root, "404.html"))
  send(200, hit)
}).listen(PORT, HOST, () => console.log(`Serving out/ at http://${HOST === "127.0.0.1" ? "localhost" : HOST}:${PORT}`))
