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
    const k = guidKey(n.guid);
    nodeMap.set(k, n);
    if (n.parentIndex && n.parentIndex.guid) {
      const pk = guidKey(n.parentIndex.guid);
      if (!childrenMap.has(pk)) childrenMap.set(pk, []);
      childrenMap.get(pk).push(n);
    }
  }
});

const artboard = msg.nodeChanges.find(n => n.name === 'iPhone 17 - 110');
console.log('Artboard:', artboard?.name, 'guid:', guidKey(artboard?.guid), 'size:', artboard?.size);

function printTree(node, depth = 0) {
  const indent = '  '.repeat(depth);
  const size = node.size ? `${node.size.x.toFixed(1)}x${node.size.y.toFixed(1)}` : '';
  const pos = node.transform ? `(${node.transform.m02.toFixed(1)}, ${node.transform.m12.toFixed(1)})` : '';
  const fill = node.fillPaints ? JSON.stringify(node.fillPaints.map(p => p.color || p.type)) : '';
  console.log(`${indent}- [${node.name}] (${node.type}) ${size} ${pos} text='${node.characters || ''}' fill=${fill}`);
  
  const children = childrenMap.get(guidKey(node.guid)) || [];
  children.forEach(c => printTree(c, depth + 1));
}

if (artboard) {
  printTree(artboard);
}
