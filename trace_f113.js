const fs = require('fs');
const kiwi = require('kiwi-schema');
const schema = kiwi.decodeBinarySchema(fs.readFileSync('temp_schema.bin'));
const compiled = kiwi.compileSchema(schema);
const msg = compiled.decodeMessage(fs.readFileSync('temp_data.bin'));

function guidKey(g) { return g ? g.sessionID + ':' + g.localID : ''; }
const nodeMap = new Map();
msg.nodeChanges.forEach(n => { if (n.guid) nodeMap.set(guidKey(n.guid), n); });

const f113 = msg.nodeChanges.filter(n => n.name === 'Frame 113');
f113.forEach((m, idx) => {
  const p = m.parentIndex ? nodeMap.get(guidKey(m.parentIndex.guid)) : null;
  const pp = p?.parentIndex ? nodeMap.get(guidKey(p.parentIndex.guid)) : null;
  const ppp = pp?.parentIndex ? nodeMap.get(guidKey(pp.parentIndex.guid)) : null;
  console.log(`#${idx} size=${m.size?.x}x${m.size?.y} pos=(${m.transform?.m02},${m.transform?.m12}) parent=${p?.name} -> ${pp?.name} -> ${ppp?.name}`);
});
