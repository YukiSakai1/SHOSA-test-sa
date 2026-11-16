const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/langside/Desktop/フレームランチ/shosa-game/assets/images';
const files = fs.readdirSync(dir);

const list = [];
for (const f of files) {
  const full = path.join(dir, f);
  const stat = fs.statSync(full);
  if (stat.isDirectory()) continue;
  if (!f.endsWith('.png') && !f.endsWith('.jpg')) continue;
  
  const b = fs.readFileSync(full);
  let w = 0, h = 0;
  if (f.endsWith('.png')) {
    w = b.readUInt32BE(16);
    h = b.readUInt32BE(20);
  } else if (f.endsWith('.jpg')) {
    let i = 0;
    while (i < b.length - 1) {
      if (b[i] === 0xff && (b[i+1] === 0xc0 || b[i+1] === 0xc2)) {
        h = b.readUInt16BE(i + 5);
        w = b.readUInt16BE(i + 7);
        break;
      }
      i++;
    }
  }
  list.push({ file: f, size: stat.size, w, h });
}

console.log(JSON.stringify(list, null, 2));
