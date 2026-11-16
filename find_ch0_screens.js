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

['16', '18', '19'].forEach(num => {
  const matches = msg.nodeChanges.filter(n => n.name && (n.name.includes(`CH0-${num}`) || n.name.includes(`CH0_${num}`) || n.name.includes(`CH0${num}`)));
  console.log(`=== Matches for CH0-${num} === count=${matches.length}`);
  matches.forEach(m => {
    console.log(` - ${m.name} (${m.type}) guid=${guidKey(m.guid)} size=${m.size?.x}x${m.size?.y}`);
  });
});

// Also search for door numbers 101, 201, 301, 401
const doorMatches = msg.nodeChanges.filter(n => n.name && (n.name.includes('101') || n.name.includes('201') || n.name.includes('301')));
console.log(`=== Door matches === count=${doorMatches.length}`);
doorMatches.forEach(m => {
  const p = m.parentIndex ? nodeMap.get(guidKey(m.parentIndex.guid)) : null;
  console.log(` - ${m.name} parent=${p?.name}`);
});
