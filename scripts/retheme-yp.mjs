import fs from "fs";
import path from "path";

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (/\.(tsx|ts|css)$/.test(name)) acc.push(p);
  }
  return acc;
}

const roots = [
  "client/src/pages",
  "client/src/components/yourpoodle",
];

const files = roots.flatMap((r) =>
  walk(r).filter((f) => {
    const base = path.basename(f);
    return (
      base.startsWith("yp-") ||
      base.startsWith("YP") ||
      base.includes("yourpoodle") ||
      f.includes(`${path.sep}yourpoodle${path.sep}`)
    );
  })
);

const map = [
  ["#7B3FE4", "#5D3A1A"],
  ["#7C3AED", "#5D3A1A"],
  ["#7C3AFF", "#5D3A1A"],
  ["#7022C4", "#5D3A1A"],
  ["#6200EE", "#5D3A1A"],
  ["#6324D6", "#5D3A1A"],
  ["#1A0052", "#3D2612"],
  ["#4C1DAA", "#3D2612"],
  ["#5B21B6", "#3D2612"],
  ["#5A32A3", "#4A2E14"],
  ["#A855F7", "#A67C52"],
  ["#9B6AF0", "#A67C52"],
  ["#A78BFA", "#A67C52"],
  ["#8B5CF6", "#8B5E34"],
  ["#F5F0FF", "#F5F0E6"],
  ["#FAF5FF", "#FAF7F0"],
  ["#F3EFFF", "#F5F0E6"],
  ["#F8F5FF", "#FAF7F0"],
  ["#F9F5FF", "#FAF7F0"],
  ["#F0EBFF", "#F5F0E6"],
  ["#F0E8FF", "#F5F0E6"],
  ["#F3EEFF", "#F5F0E6"],
  ["#F5F3FF", "#F5F0E6"],
  ["#EDE9FE", "#EDE5D8"],
  ["#EDE8FF", "#EDE5D8"],
  ["#E5E0F5", "#E5DDD0"],
  ["#D8B4FE", "#D4C4B0"],
  ["#C4B5FD", "#D4C4B0"],
  ["#DDD6FE", "#E5DDD0"],
  ["#BDB5D9", "#B0A69C"],
  ["#18114a", "#2C2118"],
  ["#1A1A2E", "#2C2118"],
  ["#F3F0FB", "#F5F0E6"],
  ["rgba(112,34,196,", "rgba(93,58,26,"],
  ["rgba(112, 34, 196,", "rgba(93, 58, 26,"],
  ["rgba(124,58,237,", "rgba(93,58,26,"],
  ["rgba(98,0,238,", "rgba(93,58,26,"],
];

let updated = 0;
for (const f of files) {
  let c = fs.readFileSync(f, "utf8");
  const orig = c;
  for (const [a, b] of map) c = c.split(a).join(b);
  if (c !== orig) {
    fs.writeFileSync(f, c);
    updated++;
    console.log("UPDATED", f);
  }
}
console.log(`Done. ${updated}/${files.length} files updated.`);
