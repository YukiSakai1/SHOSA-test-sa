const fs = require('fs');
const kiwi = require('kiwi-schema');
const schema = kiwi.decodeBinarySchema(fs.readFileSync('temp_schema.bin'));
const compiled = kiwi.compileSchema(schema);
const msg = compiled.decodeMessage(fs.readFileSync('temp_data.bin'));

function guidKey(g) { return g ? g.sessionID + ':' + g.localID : ''; }
const childrenMap = new Map();
const nodeMap = new Map();
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

const screen110 = msg.nodeChanges.find(n => n.name === 'iPhone 17 - 110');
console.log('=== Screen 110 Children ===');
(childrenMap.get(guidKey(screen110.guid)) || []).forEach(c => {
  console.log(`Node: ${c.name} (${c.type}) size=${c.size?.x}x${c.size?.y} pos=(${c.transform?.m02}, ${c.transform?.m12}) cornerRadius=${c.cornerRadius}`);
  if (c.fillPaints) console.log('  fills:', JSON.stringify(c.fillPaints));
  if (c.strokePaints) console.log('  strokes:', JSON.stringify(c.strokePaints));
  (childrenMap.get(guidKey(c.guid)) || []).forEach(cc => {
    console.log(`  - Sub: ${cc.name} (${cc.type}) size=${cc.size?.x}x${cc.size?.y} pos=(${cc.transform?.m02}, ${cc.transform?.m12}) cornerRadius=${cc.cornerRadius}`);
    if (cc.fillPaints) console.log('    sub fills:', JSON.stringify(cc.fillPaints));
    if (cc.strokePaints) console.log('    sub strokes:', JSON.stringify(cc.strokePaints));
  });
});
