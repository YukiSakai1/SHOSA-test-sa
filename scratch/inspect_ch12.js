const fs = require('fs');
const kiwi = require('kiwi-schema');
const schema = kiwi.decodeBinarySchema(fs.readFileSync('temp_schema.bin'));
const compiled = kiwi.compileSchema(schema);
const msg = compiled.decodeMessage(fs.readFileSync('temp_data.bin'));

function guidKey(g) { return g ? g.sessionID + ':' + g.localID : ''; }
const nodeMap = new Map();
msg.nodeChanges.forEach(n => { if (n.guid) nodeMap.set(guidKey(n.guid), n); });

const ch12 = Array.from(nodeMap.values()).find(n => n.name === 'CH0-12');
if (ch12) {
  console.log('Found CH0-12:', guidKey(ch12.guid), ch12.size);
  msg.nodeChanges.forEach(n => {
    if (n.parentIndex && guidKey(n.parentIndex.guid) === guidKey(ch12.guid)) {
      const y = n.transform ? Math.round(n.transform.m12) : 0;
      const x = n.transform ? Math.round(n.transform.m02) : 0;
      const w = n.size ? Math.round(n.size.x) : 0;
      const h = n.size ? Math.round(n.size.y) : 0;
      console.log('Child:', n.name, n.type, `pos:(${x},${y})`, `size:${w}x${h}`);
    }
  });
}
