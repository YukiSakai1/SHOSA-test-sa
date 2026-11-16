const fs = require('fs');
const kiwi = require('kiwi-schema');
const schema = kiwi.decodeBinarySchema(fs.readFileSync('temp_schema.bin'));
const compiled = kiwi.compileSchema(schema);
const msg = compiled.decodeMessage(fs.readFileSync('temp_data.bin'));

msg.nodeChanges.forEach(n => {
  if (n.name && (n.name.includes('12') || n.name.includes('敬語'))) {
    console.log(n.name, n.type, n.guid);
  }
});
