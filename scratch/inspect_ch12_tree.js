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
    if (n.parentIndex && n.parentIndex.guid) {
      const pk = guidKey(n.parentIndex.guid);
      if (!childrenMap.has(pk)) childrenMap.set(pk, []);
      childrenMap.get(pk).push(n);
    }
  }
});

function printNodeTree(guid, maxDepth = 4, depth = 0) {
  const node = nodeMap.get(guid);
  if (!node || depth > maxDepth) return;
  const indent = '  '.repeat(depth);
  const size = node.size ? Math.round(node.size.x) + 'x' + Math.round(node.size.y) : '';
  const pos = node.transform ? `(${Math.round(node.transform.m02)},${Math.round(node.transform.m12)})` : '';
  const text = node.characters ? ' text=' + JSON.stringify(node.characters) : '';
  console.log(`${indent}[${node.name}] (${node.type}) ${size} ${pos} ${text}`);
  const children = childrenMap.get(guid) || [];
  children.forEach(c => printNodeTree(guidKey(c.guid), maxDepth, depth + 1));
}

console.log('=== CH0-12 tree ===');
printNodeTree('1:2075', 4);
