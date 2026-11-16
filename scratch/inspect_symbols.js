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

const symbolIds = ['1:1002', '1:974', '1:948', '1:940', '1:811', '1:32'];

symbolIds.forEach(id => {
  const node = nodeMap.get(id);
  console.log(`\n=== Symbol ${id} ===`);
  if (!node) {
    console.log('Not found');
    return;
  }
  console.log(`Name: ${node.name}, Type: ${node.type}, Size: ${node.size?.x}x${node.size?.y}`);
  const children = childrenMap.get(id) || [];
  console.log(`Children count: ${children.length}`);
  children.forEach(c => {
    console.log(`  - [${c.name}] (${c.type}) size=${c.size?.x}x${c.size?.y}`);
  });
});
