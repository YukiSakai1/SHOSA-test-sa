const fs = require('fs');
const kiwi = require('kiwi-schema');
const schema = kiwi.decodeBinarySchema(fs.readFileSync('temp_schema.bin'));
const compiled = kiwi.compileSchema(schema);
const msg = compiled.decodeMessage(fs.readFileSync('temp_data.bin'));

function guidKey(g) { return g ? g.sessionID + ':' + g.localID : ''; }
const nodeMap = new Map();
msg.nodeChanges.forEach(n => { if (n.guid) nodeMap.set(guidKey(n.guid), n); });

const keywords = ['朝', '昼', '夕', '寝る', 'ランチ', 'その他'];
keywords.forEach(kw => {
  const matches = msg.nodeChanges.filter(n => (n.name && n.name.includes(kw)) || (n.characters && n.characters.includes(kw)));
  console.log('=== Matches for ' + kw + ' === count=' + matches.length);
  matches.forEach(m => {
    const parent = m.parentIndex ? nodeMap.get(guidKey(m.parentIndex.guid)) : null;
    const pp = parent?.parentIndex ? nodeMap.get(guidKey(parent.parentIndex.guid)) : null;
    const ppp = pp?.parentIndex ? nodeMap.get(guidKey(pp.parentIndex.guid)) : null;
    console.log(' [' + m.name + '] text=\x27' + (m.characters || '') + '\x27 type=' + m.type + ' size=' + m.size?.x + 'x' + m.size?.y + ' pos=(' + m.transform?.m02 + ', ' + m.transform?.m12 + ') parent=' + parent?.name + ' -> ' + pp?.name + ' -> ' + ppp?.name);
  });
});
