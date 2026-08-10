/**
 * Replace hard-coded phone shell widths with responsive CSS variables.
 * Run: node scripts/yp-widen-shells.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve("client/src");
const EXTS = new Set([".tsx", ".ts", ".css"]);

const REPLACERS = [
  [/maxWidth:\s*480\b/g, 'maxWidth: "var(--yp-shell-max)"'],
  [/maxWidth:\s*430\b/g, 'maxWidth: "var(--yp-shell-max)"'],
  [/maxWidth:\s*440\b/g, 'maxWidth: "var(--yp-shell-max)"'],
  [/maxWidth:\s*400\b/g, 'maxWidth: "var(--yp-read-max)"'],
  [/max-w-\[430px\]/g, "max-w-[var(--yp-shell-max)]"],
  [/max-w-\[480px\]/g, "max-w-[var(--yp-shell-max)]"],
  [/max-width:\s*480px/g, "max-width: var(--yp-shell-max)"],
  [/max-width:\s*430px/g, "max-width: var(--yp-shell-max)"],
];

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (EXTS.has(path.extname(name))) out.push(p);
  }
  return out;
}

let changed = 0;
for (const file of walk(ROOT)) {
  let src = fs.readFileSync(file, "utf8");
  let next = src;
  for (const [re, to] of REPLACERS) next = next.replace(re, to);
  if (next !== src) {
    fs.writeFileSync(file, next);
    changed++;
    console.log("updated", path.relative(process.cwd(), file));
  }
}
console.log(`Done. ${changed} files updated.`);
