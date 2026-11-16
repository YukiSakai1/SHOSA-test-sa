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

function inspectDeep(guid, depth = 0) {
  const node = nodeMap.get(guid);
  if (!node) return;
  const indent = '  '.repeat(depth);
  console.log(`${indent}[${node.name}] id=${guid} type=${node.type} size=${node.size?.x}x${node.size?.y}`);
  if (node.vectorData) {
    console.log(`${indent}  vectorData: bytes=${node.vectorData.bytes?.length || 0}`);
  }
  if (node.fillPaints) {
    console.log(`${indent}  fillPaints:`, JSON.stringify(node.fillPaints));
  }
  const children = childrenMap.get(guid) || [];
  children.forEach(c => inspectDeep(guidKey(c.guid), depth + 1));
}

console.log('--- Symbol 1:1002 (_1 ornate divider) ---');
inspectDeep('1:1002');

console.log('\n--- Symbol 1:974 (clipboard icon) ---');
inspectDeep('1:974');
