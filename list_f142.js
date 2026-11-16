const fs = require('fs');
const kiwi = require('kiwi-schema');
const schema = kiwi.decodeBinarySchema(fs.readFileSync('temp_schema.bin'));
const compiled = kiwi.compileSchema(schema);
const msg = compiled.decodeMessage(fs.readFileSync('temp_data.bin'));
function guidKey(g) { return g ? g.sessionID + ':' + g.localID : ''; }
const f142List = msg.nodeChanges.filter(n => n.name === 'Frame 142');
f142List.forEach((f, idx) => {
  const kids = msg.nodeChanges.filter(n => n.parentIndex && guidKey(n.parentIndex.guid) === guidKey(f.guid));
  console.log(`#${idx} size=${f.size?.x}x${f.size?.y} pos=(${f.transform?.m02},${f.transform?.m12}) kids=${kids.map(k=>k.name).join(',')}`);
});
