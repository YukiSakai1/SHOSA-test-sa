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

['iPhone 17 - 103', 'iPhone 17 - 104', 'iPhone 17 - 105', 'iPhone 17 - 106'].forEach(name => {
  const frame = msg.nodeChanges.find(n => n.name === name);
  if (!frame) return;
  console.log(`\n=================== ${name} size=${frame.size?.x}x${frame.size?.y} ===================`);
  function dump(node, indent = '') {
    const pos = `pos=(${Math.round(node.transform?.m02 || 0)}, ${Math.round(node.transform?.m12 || 0)})`;
    const sz = `size=${Math.round(node.size?.x || 0)}x${Math.round(node.size?.y || 0)}`;
    const txt = node.characters ? ` text="${node.characters.replace(/\n/g, ' ')}"` : '';
    console.log(`${indent}${node.name} (${node.type}) ${pos} ${sz}${txt}`);
    (childrenMap.get(guidKey(node.guid)) || []).forEach(c => dump(c, indent + '  '));
  }
  (childrenMap.get(guidKey(frame.guid)) || []).forEach(c => dump(c, '  '));
});

