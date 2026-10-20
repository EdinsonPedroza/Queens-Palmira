// Runs after `next build` (see package.json). Next 16's static export writes the page segment of each route as a NESTED file
// (out/spa/__next.spa/__PAGE__.txt), but the browser asks for it with DOTS (out/spa/__next.spa.__PAGE__.txt) when it prefetches a <Link>.
// On a static host the second path does not exist, so every link on screen logged a 404 in the console and wasted a request. This copies each
// nested segment file to the dotted name the client asks for. Nothing else changes (the nested files stay where they are).
import fs from "node:fs"
import path from "node:path"

const OUT = path.resolve("out")
if (!fs.existsSync(OUT)) {
  console.log("fix-export-prefetch: no out/ folder (not a static export build), nothing to do")
  process.exit(0)
}

let made = 0
function flatten(parent, dir, parts) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) flatten(parent, path.join(dir, e.name), [...parts, e.name])
    else if (e.name.endsWith(".txt")) {
      const target = path.join(parent, [...parts, e.name].join("."))
      if (!fs.existsSync(target)) {
        fs.copyFileSync(path.join(dir, e.name), target)
        made++
      }
    }
  }
}
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory() || e.name === "_next") continue
    const p = path.join(dir, e.name)
    if (e.name.startsWith("__next.")) flatten(dir, p, [e.name])
    else walk(p)
  }
}
walk(OUT)
console.log(`fix-export-prefetch: ${made} segment file(s) copied to the dotted name the client asks for`)
