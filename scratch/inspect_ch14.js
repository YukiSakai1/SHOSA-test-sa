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
  const text = node.characters ? ' text=' + JSON.stringify(node.characters) : '';
  console.log(`${indent}[${node.name}] (${node.type}) ${size} ${text}`);
  const children = childrenMap.get(guid) || [];
  children.forEach(c => printNodeTree(guidKey(c.guid), maxDepth, depth + 1));
}

console.log('=== CH0-14 Left (1:3064) ===');
printNodeTree('1:3064', 5);

console.log('\n=== CH0-14 Right (1:3128) ===');
printNodeTree('1:3128', 5);
