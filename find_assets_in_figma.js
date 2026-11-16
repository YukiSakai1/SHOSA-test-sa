const fs = require('fs');
const kiwi = require('kiwi-schema');
const schema = kiwi.decodeBinarySchema(fs.readFileSync('temp_schema.bin'));
const compiled = kiwi.compileSchema(schema);
const msg = compiled.decodeMessage(fs.readFileSync('temp_data.bin'));

function guidKey(g) { return g ? g.sessionID + ':' + g.localID : ''; }
const nodeMap = new Map();
msg.nodeChanges.forEach(n => { if (n.guid) nodeMap.set(guidKey(n.guid), n); });

['351', '113', 'icon'].forEach(kw => {
  const matches = msg.nodeChanges.filter(n => n.name && n.name.toLowerCase().includes(kw));
  console.log(`=== Matches for ${kw} === count=${matches.length}`);
  matches.slice(0, 15).forEach(m => {
    const parent = m.parentIndex ? nodeMap.get(guidKey(m.parentIndex.guid)) : null;
    const parentParent = parent?.parentIndex ? nodeMap.get(guidKey(parent.parentIndex.guid)) : null;
    console.log(` - ${m.name} (${m.type}) size=${m.size ? `${m.size.x}x${m.size.y}` : ''} pos=(${m.transform?.m02}, ${m.transform?.m12}) parent=${parent?.name} -> ${parentParent?.name}`);
  });
});
