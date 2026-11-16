const fs = require('fs');
const kiwi = require('kiwi-schema');
const schema = kiwi.decodeBinarySchema(fs.readFileSync('temp_schema.bin'));
const compiled = kiwi.compileSchema(schema);
const msg = compiled.decodeMessage(fs.readFileSync('temp_data.bin'));

const frames = msg.nodeChanges.filter(n => n.name && n.name.startsWith('iPhone 17 -'));
console.log('Found frames:', frames.length);
frames.forEach(f => {
  console.log(`- ${f.name} guid=${f.guid.sessionID}:${f.guid.localID}`);
});
