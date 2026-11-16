const fs = require('fs');
const kiwi = require('kiwi-schema');
const schema = kiwi.decodeBinarySchema(fs.readFileSync('temp_schema.bin'));
const compiled = kiwi.compileSchema(schema);
const msg = compiled.decodeMessage(fs.readFileSync('temp_data.bin'));

function guidKey(g) { return g ? g.sessionID + ':' + g.localID : ''; }
const childrenMap = new Map();
msg.nodeChanges.forEach(n => {
  if (n.guid && n.parentIndex?.guid) {
    const pk = guidKey(n.parentIndex.guid);
    if (!childrenMap.has(pk)) childrenMap.set(pk, []);
    childrenMap.get(pk).push(n);
  }
});

['104', '105', '106', '107', '108', '109', '110', '111'].forEach(id => {
  const f = msg.nodeChanges.find(n => n.name === `iPhone 17 - ${id}`);
  if (!f) return;
  console.log(`\n=== iPhone 17 - ${id} ===`);
  const children = childrenMap.get(guidKey(f.guid)) || [];
  children.forEach(c => {
    const textChildren = (childrenMap.get(guidKey(c.guid)) || []).filter(cc => cc.type === 'TEXT' || cc.characters);
    const texts = textChildren.map(t => t.name || t.characters).join(', ');
    console.log(`  [${c.name}] (${c.type}) size=${c.size?.x}x${c.size?.y} texts=[${texts}]`);
  });
});
