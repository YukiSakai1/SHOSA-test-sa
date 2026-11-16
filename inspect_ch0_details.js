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

function printNodeTree(guid, maxDepth = 3, depth = 0) {
  const node = nodeMap.get(guid);
  if (!node || depth > maxDepth) return;
  const indent = '  '.repeat(depth);
  const size = node.size ? `${node.size.x.toFixed(0)}x${node.size.y.toFixed(0)}` : '';
  const pos = node.transform ? `(${node.transform.m02.toFixed(0)}, ${node.transform.m12.toFixed(0)})` : '';
  const text = node.characters ? `text="${node.characters.replace(/\n/g, '\\n')}"` : '';
  console.log(`${indent}[${node.name}] (${node.type}) ${size} ${pos} ${text}`);
  const children = childrenMap.get(guid) || [];
  children.forEach(c => printNodeTree(guidKey(c.guid), maxDepth, depth + 1));
}

console.log('=== CH0-16’ (1:2182) ===');
printNodeTree('1:2182', 3);

console.log('\n=== CH0-18 (1:2339) ===');
printNodeTree('1:2339', 3);

console.log('\n=== CH0-19 (1:2605) ===');
printNodeTree('1:2605', 3);
