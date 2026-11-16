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
const c = childrenMap.get('1:2592') || [];
c.forEach(ch => {
  console.log(ch.name, guidKey(ch.guid), ch.type, ch.size ? `${ch.size.x}x${ch.size.y}` : '');
  const sub = childrenMap.get(guidKey(ch.guid)) || [];
  sub.forEach(s => console.log('  -', s.name, guidKey(s.guid), s.type, s.characters ? `"${s.characters}"` : ''));
});
