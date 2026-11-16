const fs = require('fs');
const kiwi = require('kiwi-schema');
const schema = kiwi.decodeBinarySchema(fs.readFileSync('temp_schema.bin'));
const compiled = kiwi.compileSchema(schema);
const msg = compiled.decodeMessage(fs.readFileSync('temp_data.bin'));

function guidKey(g) { return g ? g.sessionID + ':' + g.localID : ''; }
const nodeMap = new Map();
msg.nodeChanges.forEach(n => { if (n.guid) nodeMap.set(guidKey(n.guid), n); });

// Find Frame 13 inside Frame 135
const frame13Nodes = Array.from(nodeMap.values()).filter(n => n.name === 'Frame 13');
console.log('Frame 13 count:', frame13Nodes.length);
if (frame13Nodes.length > 0) {
  const f13 = frame13Nodes[0];
  console.log('Frame 13 guid:', guidKey(f13.guid), f13.size);
  // find its children (the 5 circles)
  const circles = Array.from(nodeMap.values()).filter(n => n.parentIndex && guidKey(n.parentIndex.guid) === guidKey(f13.guid));
  console.log('Circles count:', circles.length);
  circles.forEach((c, idx) => {
    console.log(`Circle ${idx}:`, c.name, c.type, c.size);
  });
}
