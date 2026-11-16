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

function printAllTexts(guid, prefix = '') {
  const node = nodeMap.get(guid);
  if (!node) return;
  if (node.characters) {
    console.log(`${prefix}[${node.name}]: "${node.characters.replace(/\n/g, '\\n')}"`);
  }
  const children = childrenMap.get(guid) || [];
  children.forEach(c => printAllTexts(guidKey(c.guid), prefix + '  '));
}

console.log('=== CH0-16’ Texts ===');
printAllTexts('1:2182');

console.log('\n=== CH0-18 Texts ===');
printAllTexts('1:2339');

console.log('\n=== CH0-19 Texts ===');
printAllTexts('1:2605');
