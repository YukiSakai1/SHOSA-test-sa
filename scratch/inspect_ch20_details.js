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

function printAll(guid, depth = 0) {
  const node = nodeMap.get(guid);
  if (!node) return;
  const indent = '  '.repeat(depth);
  const size = node.size ? `${node.size.x.toFixed(1)}x${node.size.y.toFixed(1)}` : '';
  const pos = node.transform ? `(${node.transform.m02.toFixed(1)}, ${node.transform.m12.toFixed(1)})` : '';
  console.log(`${indent}[${node.name}] id=${guid} type=${node.type} ${size} ${pos}`);
  if (node.characters) console.log(`${indent}  Text: "${node.characters.replace(/\n/g, '\\n')}"`);
  if (node.fillPaints) console.log(`${indent}  Fills:`, JSON.stringify(node.fillPaints.map(f => ({ type: f.type, color: f.color, opacity: f.opacity }))));
  if (node.symbolData) console.log(`${indent}  symbolData:`, JSON.stringify(node.symbolData.symbolID));

  const children = childrenMap.get(guid) || [];
  children.forEach(c => printAll(guidKey(c.guid), depth + 1));
}

console.log('=== CH0-20’ Details ===');
printAll('1:2592');
