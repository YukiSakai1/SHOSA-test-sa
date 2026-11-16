const fs = require('fs');
const kiwi = require('kiwi-schema');
const schema = kiwi.decodeBinarySchema(fs.readFileSync('temp_schema.bin'));
const compiled = kiwi.compileSchema(schema);
const msg = compiled.decodeMessage(fs.readFileSync('temp_data.bin'));
function guidKey(g) { return g ? g.sessionID + ':' + g.localID : ''; }
const frames = msg.nodeChanges.filter(n => n.name && n.name.includes('20'));
frames.forEach(f => {
  console.log(f.name, guidKey(f.guid), f.type, f.size ? `${f.size.x}x${f.size.y}` : '');
});
