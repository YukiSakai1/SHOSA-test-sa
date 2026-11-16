const fs = require('fs');
const kiwi = require('kiwi-schema');
const schema = kiwi.decodeBinarySchema(fs.readFileSync('temp_schema.bin'));
const compiled = kiwi.compileSchema(schema);
const msg = compiled.decodeMessage(fs.readFileSync('temp_data.bin'));
function guidKey(g) { return g ? g.sessionID + ':' + g.localID : ''; }
const nodeMap = new Map();
const childrenMap = new Map();
msg.nodeChanges.forEach(n => {
  if (n.guid) {
    nodeMap.set(guidKey(n.guid), n);
    if (n.parentIndex?.guid) {
      const pk = guidKey(n.parentIndex.guid);
      if (!childrenMap.has(pk)) childrenMap.set(pk, []);
      childrenMap.get(pk).push(n);
    }
  }
});

function dump(guid, depth=0) {
  const n = nodeMap.get(guid);
  if (!n) return;
  const ind = '  '.repeat(depth);
  const size = n.size ? `${n.size.x.toFixed(1)}x${n.size.y.toFixed(1)}` : '';
  const pos = n.transform ? `(${n.transform.m02.toFixed(1)}, ${n.transform.m12.toFixed(1)})` : '';
  let extra = '';
  if (n.characters) extra += ` text="${n.characters.replace(/\n/g, '\\n')}"`;
  if (n.fillPaints && n.fillPaints.length) {
    const f = n.fillPaints[0];
    if (f.color) extra += ` color=(${f.color.r.toFixed(2)},${f.color.g.toFixed(2)},${f.color.b.toFixed(2)})`;
    if (f.type) extra += ` fillType=${f.type}`;
  }
  console.log(`${ind}[${n.name}] ${guid} (${n.type}) ${size} ${pos}${extra}`);
  const c = childrenMap.get(guid) || [];
  c.forEach(ch => dump(guidKey(ch.guid), depth+1));
}

console.log('=== MODAL ===');
dump('1:2651');
console.log('\n=== MODAL UNDER ===');
dump('1:2721');
console.log('\n=== BTN ===');
dump('1:2751');
