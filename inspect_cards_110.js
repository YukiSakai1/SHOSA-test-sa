const fs = require('fs');
const kiwi = require('kiwi-schema');
const schema = kiwi.decodeBinarySchema(fs.readFileSync('temp_schema.bin'));
const compiled = kiwi.compileSchema(schema);
const msg = compiled.decodeMessage(fs.readFileSync('temp_data.bin'));

function guidKey(g) { return g ? g.sessionID + ':' + g.localID : ''; }
const nodeMap = new Map();
msg.nodeChanges.forEach(n => { if (n.guid) nodeMap.set(guidKey(n.guid), n); });

['Group 14', 'Rectangle 8'].forEach(name => {
  const matches = msg.nodeChanges.filter(n => n.name === name);
  matches.forEach(m => {
    console.log(`=== ${m.name} (${guidKey(m.guid)}) ===`);
    console.log('size:', m.size, 'corner:', m.cornerRadius, 'radius:', m.rectangleCornerRadii);
    console.log('fillPaints:', JSON.stringify(m.fillPaints));
    console.log('strokePaints:', JSON.stringify(m.strokePaints));
    console.log('strokeWeight:', m.strokeWeight);
  });
});
