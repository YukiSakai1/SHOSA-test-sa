const fs = require('fs');
const kiwi = require('kiwi-schema');
const schema = kiwi.decodeBinarySchema(fs.readFileSync('temp_schema.bin'));
const compiled = kiwi.compileSchema(schema);
const msg = compiled.decodeMessage(fs.readFileSync('temp_data.bin'));

function guidKey(g) { return g ? g.sessionID + ':' + g.localID : ''; }
const childrenMap = new Map();
msg.nodeChanges.forEach(n => {
  if (n.guid && n.parentIndex?.guid) {
    const pk = guidKey(n.parentIndex.guid);
    if (!childrenMap.has(pk)) childrenMap.set(pk, []);
    childrenMap.get(pk).push(n);
  }
});

function getAllTexts(node) {
  let texts = [];
  if (node.type === 'TEXT' || node.characters) {
    texts.push(node.characters || node.name);
  }
  const children = childrenMap.get(guidKey(node.guid)) || [];
  children.forEach(c => {
    texts = texts.concat(getAllTexts(c));
  });
  return texts;
}

const frames = msg.nodeChanges.filter(n => n.name && n.name.startsWith('iPhone 17 - '));
frames.sort((a, b) => {
  const numA = parseInt(a.name.replace('iPhone 17 - ', ''), 10);
  const numB = parseInt(b.name.replace('iPhone 17 - ', ''), 10);
  return numA - numB;
});

frames.forEach(f => {
  const texts = getAllTexts(f).map(t => t.replace(/\n/g, ' ')).filter(t => t.trim().length > 0);
  console.log(`\n=== ${f.name} (x=${Math.round(f.transform?.m02 || 0)}, y=${Math.round(f.transform?.m12 || 0)}) ===`);
  console.log(`  Texts: ${texts.slice(0, 10).join(' | ')}`);
});

