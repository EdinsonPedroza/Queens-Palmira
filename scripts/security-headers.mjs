// Runs after `next build` (see "build" in package.json), on the static export in out/. Two jobs:
//
//  1. Every HTML page gets a strict script policy in a <meta> Content-Security-Policy: the site's own files, plus ONLY the inline scripts that page really has (Next's
//     bootstrap and data scripts), each one allowed by its SHA-256 hash. Anything else (a <script> someone manages to inject, an inline onclick=…) does not run.
//     The header CSP in out/_headers keeps 'unsafe-inline' because one header is shared by every page and the hashes change per page; the browser applies BOTH
//     policies and a script must pass both, so the strict one wins. The <meta> goes right after <meta charSet>, before any script, or it would not cover them.
//  2. If NEXT_PUBLIC_GA_ID was set for this build, Google Analytics' hosts are added to the CSP (header and <meta>). Otherwise they stay out: an allowed
//     googletagmanager.com is a well-known way around a CSP.
//
// Never turn on Cloudflare's Rocket Loader (it rewrites the scripts, so their hashes stop matching and the site stops working), and if Cloudflare Web Analytics
// is ever enabled with automatic injection, add its host (https://static.cloudflareinsights.com) to script-src here and in public/_headers.
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"

const OUT = path.resolve("out")
const GA = Boolean(process.env.NEXT_PUBLIC_GA_ID)
const GA_SCRIPT = "https://www.googletagmanager.com"
const GA_CONNECT = "https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com"
const GA_IMG = "https://www.google-analytics.com https://www.googletagmanager.com"

// The script types a browser runs. An inline <script> of any other type (the JSON-LD) is data: CSP neither runs nor blocks it.
const JS_TYPES = new Set(["", "text/javascript", "application/javascript", "module", "text/ecmascript"])
const SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
const CSP_META = /<meta http-equiv="Content-Security-Policy"[^>]*>/gi

if (!fs.existsSync(OUT)) {
  console.error("security-headers: no out/ folder (run next build first)")
  process.exit(1)
}

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? htmlFiles(p) : e.name.endsWith(".html") ? [p] : []
  })
}

let pages = 0
let hashed = 0
let most = 0
for (const file of htmlFiles(OUT)) {
  let html = fs.readFileSync(file, "utf8").replace(CSP_META, "")
  const hashes = new Set()
  for (const [, attrs, body] of html.matchAll(SCRIPT)) {
    if (/\bsrc\s*=/i.test(attrs)) continue
    const type = (attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i)?.[1] ?? "").toLowerCase()
    if (!JS_TYPES.has(type)) continue
    // The browser hashes the script's text exactly as it is in the file (a script's content is raw text: no entities are decoded), in UTF-8
    hashes.add(`'sha256-${crypto.createHash("sha256").update(body, "utf8").digest("base64")}'`)
  }

  // Inline event handlers (onclick="…") would be blocked by this policy: React never writes them, so finding one means something injected markup
  const withoutScripts = html.replace(SCRIPT, "")
  const handler = withoutScripts.match(/<[a-z][^>]*\son[a-z]+\s*=/i)
  if (handler) console.warn(`security-headers: inline event handler in ${path.relative(OUT, file)}: ${handler[0].slice(0, 80)}`)

  const scriptSrc = ["'self'", ...hashes, ...(GA ? [GA_SCRIPT] : [])].join(" ")
  const meta = `<meta http-equiv="Content-Security-Policy" content="script-src ${scriptSrc}; object-src 'none'; base-uri 'self'"/>`
  const charset = html.match(/<meta charSet="utf-8"\s*\/?>/i)
  if (charset) html = html.replace(charset[0], charset[0] + meta)
  else if (/<head\b[^>]*>/i.test(html)) html = html.replace(/<head\b[^>]*>/i, (m) => m + meta)
  else {
    console.error(`security-headers: no <head> in ${path.relative(OUT, file)}`)
    process.exit(1)
  }
  fs.writeFileSync(file, html)
  pages++
  hashed += hashes.size
  most = Math.max(most, hashes.size)
}

// The header CSP (copied from public/_headers by the build): Google Analytics' hosts only when it is on
const headersFile = path.join(OUT, "_headers")
let headers = fs.readFileSync(headersFile, "utf8")
if (GA) {
  headers = headers
    .replace(/(script-src [^;]*)/, `$1 ${GA_SCRIPT}`)
    .replace(/(connect-src [^;]*)/, `$1 ${GA_CONNECT}`)
    .replace(/(img-src [^;]*)/, `$1 ${GA_IMG}`)
}
// Cloudflare ignores a line longer than 2,000 characters: better to fail the build than to ship a site without its security headers
const long = headers.split(/\r?\n/).find((l) => l.length > 2000)
if (long) {
  console.error(`security-headers: a line of _headers is ${long.length} characters long (Cloudflare's limit is 2,000): ${long.slice(0, 60)}…`)
  process.exit(1)
}
fs.writeFileSync(headersFile, headers)

console.log(`security-headers: ${pages} pages with a strict CSP, ${hashed} inline scripts allowed by hash (at most ${most} on one page)${GA ? "; Google Analytics allowed" : ""}`)
